# t0d0 overview

Live version: https://t0d0.bafonins.xyz

The live version of the t0d0 app is hosted on a private [linode](https://www.linode.com/) VPS instance, deployed using github actions, `docker-compose` with traffic routed using `nginx` on the server.

The application was tested **only** on the latest version of Chrome on desktop.

# Project Structure

```
├── apps
│   ├── client                      # React.js SPA repo
│   │   ├── public                  # public assets
│   │   ├── src
│   │   │   ├── __generated__       # GraphQL generated files
│   │   │   ├── app
│   │   │   ├── assets
│   │   │   ├── constants
│   │   │   ├── features            # Feature modules
│   │   │   │   ├── auth
│   │   │   │   ├── notifications
│   │   │   │   └── todos
│   │   │   ├── pages               # Application pages
│   │   │   └── shared
│   │   │       ├── api
│   │   │       │   └── graphql     # GraphQL api module
│   │   │       ├── components      # Shared components (not connected)
│   │   │       └── storage         # Browser storage module
│   │   ├── README.md
│   │   └── index.html
│   └── server                      # Nest.js backend api
│       ├── src
│       │   ├── auth
│       │   │   ├── inputs          # Auth GraphQL inputs
│       │   │   ├── models          # Auth GraphQL object types
│       │   │   └── strategies      # Passport strategies
│       │   ├── common              # Shared files
│       │   │   ├── decorators      # Common Nest.js decorators
│       │   │   ├── guards          # Auth guards
│       │   │   └── modules         # Shared modules
│       │   │       ├── fieldMask
│       │   │       ├── pagination
│       │   │       └── pubsub
│       │   ├── todos
│       │   │   ├── dal             # Todos data access layer
│       │   │   ├── guards
│       │   │   ├── inputs
│       │   │   └── models
│       │   └── users
│       │       └── models
│       ├── test
│       └── README.md
├── init-db                         # DB init scripts
├── packages
└── README.md
```

# Commands

## Development build with docker

Make sure to have `docker` and `docker-compose` installed on your machine. Then run `docker-compose -f docker-compose.dev.yml up --build`. This should start a `PostgreSQL` database (with the `pgAdmin` dashboard) and the t0d0 app.

- `pgAdmin` should be accessible on port `:5050`. Use credentials set in `.env.development` file.
- `t0d0-app` react.js client served by `vite` should be accessible on port `:5173`
- `t0d0-app` nest.js server should be accessible on port `:3000`
  - GraphQL playground should be accessible on the `/graphql` path

## Production build with docker

Make sure to populate `.env.production` file based on `.env.development` example and have `docker` and `docker-compose` install locally. Then run `docker-ompose -f docker-compose.prod.yml up --build`. This should start a `PostrgreSQL` database and the t0d0 app.

- `t0d0-app` nest.js server should be accessible on port `:3000`.
  Note: in production build `t0d0-app` client is server by the nest.js server as static assets.

# Tech stack

TL;DR NestJS + NodeJS + PostgreSQL + GraphQL + Apollo + ReactJS

**t0d0-app-test** is a full-stack application to manage tasks with infinite nesting. It is inspired by [TodoMVC](https://todomvc.com/) and [workflowy](https://workflowy.com/).

This project is a monorepo containing [apps/client](#client-side) and [apps/server](#server-side) projects. [Turborepo](https://turbo.build/) is used to orchestrate dependencies and pipelines.

**t0d0-app-test** is a comprehensive full-stack application designed for task management, featuring infinite nesting capabilies and real-time collaboration. This project is structured as a monorepo, encopassing both the [apps/client](#client-side) and [apps/server](#server-side) projects. Utilizing [TurboRepo](https://turbo.build) to streamline dependency management and development process.

## Client-side

- [vite](https://vitejs.dev/) - project scaffolding and build tool (TS and HMR built-in)
- [react.js](https://react.dev/) - UI framework (library 🙃)
- [apollo-client](https://www.apollographql.com/docs/react/) - state management library + graphql fetching
- [react-router](https://reactrouter.com/en/main) - SPA client routing library
- [react-hot-toast](https://react-hot-toast.com/) - premade toast components

## Server-side

- [nest.js](https://nestjs.com/) - node.js framework with DI built-in (with express.js and TS under the hood)
- [typeorm](https://typeorm.io/) - ORM tool
- [apollo-server](https://github.com/apollographql/apollo-server) - GraphQL server
- [passport](https://www.passportjs.org/) - authentication middleware (used for local + jwt auth in the app)

## Codegen

GraphQL schema is auto generated based on NestJS models (see `schema-generated.gql` file) on the server side. Then, using [@graphql-codegen](https://github.com/dotansimha/graphql-code-generator) the schema is generated for the client. This process takes care of generating required graphql boilerplate (including types, hooks, apollo-client bindings, etc.). In order to update client-side GraphQL generated files, run `npm run --workspace client codegen` - this should update `src/__generated__/gql-generated.ts` file according to the latest GraphQL schema changes.

# Features

## Infinite nesting of todo tasks

There are 2 general types of todo tasks in the application:

- Root task - has no parent
- Nested task - has parent and can at any level of nesting in the parent-child relation chain.

Each task can have an infinite number of subtasks. This is implemented by self-referencing relationship in PostgreSQL.

### Parent tasks cascade on nested tasks

1. Delete operation on the parent task causes **all** nested tasks to become deleted as well.
2. Frozen parent tasks blocks any create/delete/update operations on the task and its nested tasks.

## Authentication

The application implement basic authentication using [passport-local](https://github.com/jaredhanson/passport-local) authentication. For simplicity sake, only a username is required to distinguish between unique users and track todo ownership. After successful initial login [passport-jwt](https://www.npmjs.com/package/passport-jwt) auth is used to authenticate a user. The same [jwt token](https://jwt.io/) is used to authorize users for create,update and delete operations. The token is persisted in `localStorage` and sent as `Authorization: Breader ...token...` in all requests to server when present. It is worth mentioning, that the token has no expiry date. This is done on purpose for simplicity sake. In general, users should receive 2 tokens with expiry date: `access_token` and `refresh_token`.

## Pagination

List data in the application is paginated using offset-based pagination. Both, root level and nested todos are paginated with the default page size of 10.

## Real-time updates

The application uses GraphQL subscriptions running over WebSockets to implement real-time updates. Todo update, create and delete operations are broadcasted to all active users.

## Authorization

There are 3 global roles authorized in the application.

1. Guests

- Can view todo tasks
- Can filter todo tasks
- Can view real-time updates made by other users

2. Authenticated users

- Everything that _Guests_ can do
- Create todo tasks
- Delete todo tasks
- Complete todo tasks

3. Task owners

- Everything that `Authenticated users` can do
- Freeze/unfreeze created todo tasks

## Checklist

This sections lists all recruitment assignment tasks.

- [x] (required): I as a user can create to-do items, such as a grocery list
- [x] (required): I as another user can collaborate in real-time with user - so that we can
      (for example) edit our family shopping-list together
- [x] I as a user can mark to-do items as “done” - so that I can avoid clutter and focus on
      things that are still pending
- [x] I as a user can filter the to-do list and view items that were marked as done - so that I
      can retrospect on my prior progress
- [x] I as a user can add sub-tasks to my to-do items - so that I could make logical groups of
      tasks and see their overall progress
- [ ] I as a user can specify cost/price for a task or a subtask - so that I can track my
      expenses / project cost
- [ ] I as a user can see the sum of the subtasks aggregated in the parent task - so that in my
      shopping list I can see what contributes to the overall sum. For example I can have a
      task “Salad”, where I'd add all ingredients as sub-tasks, and would see how much does
      salad cost on my shopping list
- [x] I as a user can make infinite nested levels of subtasks
- [ ] I as a user can add sub-descriptions of tasks in Markdown and view them as rich text
      while I'm not editing the descriptions
- [ ] I as a user can see the cursor and/or selection of another-user as he selects/types when
      he is editing text - so that we can discuss focused words during our online call.
- [x] I as a user can create multiple to-do lists where each list has it's unique URL that I can
      share with my friends - so that I could have separate to do lists for my groceries and
      work related tasks
- [ ] In addition to regular to-do tasks, I as a user can add “special” typed to-do items, that
      will have custom style and some required fields:
  - ”work-task”, which has a required field “deadline” - which is a date
  - “food” that has fields:
    - required: “carbohydrate”, “fat”, “protein” (each specified in g/100g)
    - optional: “picture” an URL to an image used to render this item
- [ ] I as a user can keep editing the list even when I lose internet connection, and can
      expect it to sync up with BE as I regain connection
- [ ] I as a user can use my VR goggles to edit/browse multiple to-do lists in parallel in 3D
      space so that I can feel ultra-productive
- [ ] I as a user can change the order of tasks via drag & drop
- [ ] I as a user can move/convert subtasks to tasks via drag & drop
- [x] I as a user can be sure that my todos will be persisted so that important information is
      not lost when server restarts
- [x] I as an owner/creator of a certain to-do list can freeze/unfreeze a to-do list I've created to
      avoid other users from mutating it
