import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
import { FieldPolicy, FieldReadFunction, TypePolicies, TypePolicy } from '@apollo/client/cache';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = { [_ in K]?: never };
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
const defaultOptions = {} as const;
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string; }
  String: { input: string; output: string; }
  Boolean: { input: boolean; output: boolean; }
  Int: { input: number; output: number; }
  Float: { input: number; output: number; }
  /** A date-time string at UTC, such as 2019-12-03T09:54:33Z, compliant with the date-time format. */
  DateTime: { input: Date; output: Date; }
};

export type AuthUser = {
  readonly __typename?: 'AuthUser';
  readonly token: Scalars['String']['output'];
  readonly user: User;
};

export type CreateTodoInput = {
  readonly parent?: InputMaybe<ParentTodoIdInput>;
  readonly title: Scalars['String']['input'];
};

export type Mutation = {
  readonly __typename?: 'Mutation';
  readonly addTodo: Todo;
  readonly deleteTodo: Scalars['Boolean']['output'];
  readonly signIn: AuthUser;
  readonly updateTodo: Todo;
};


export type MutationAddTodoArgs = {
  createTodoData: CreateTodoInput;
};


export type MutationDeleteTodoArgs = {
  id: Scalars['String']['input'];
};


export type MutationSignInArgs = {
  signInData: SignInInput;
};


export type MutationUpdateTodoArgs = {
  id: Scalars['String']['input'];
  updateTodoData: UpdateTodoInput;
};

export type PaginationInfo = {
  readonly __typename?: 'PaginationInfo';
  readonly hasNextPage: Scalars['Boolean']['output'];
  readonly hasPreviousPage: Scalars['Boolean']['output'];
  readonly itemCount: Scalars['Int']['output'];
  readonly page: Scalars['Int']['output'];
  readonly pageCount: Scalars['Int']['output'];
  readonly pageSize: Scalars['Int']['output'];
};

export type PaginationInput = {
  readonly order?: SortOrder;
  readonly page: Scalars['Int']['input'];
  readonly take: Scalars['Int']['input'];
};

export type ParentTodoIdInput = {
  readonly id: Scalars['ID']['input'];
};

export type Query = {
  readonly __typename?: 'Query';
  readonly todo: Todo;
  readonly todos: TodoList;
};


export type QueryTodoArgs = {
  id: Scalars['String']['input'];
};


export type QueryTodosArgs = {
  filter?: InputMaybe<TodoFilterType>;
  pageData: PaginationInput;
  parentId?: InputMaybe<Scalars['String']['input']>;
};

export type SignInInput = {
  readonly username: Scalars['String']['input'];
};

export enum SortOrder {
  Asc = 'ASC',
  Desc = 'DESC'
}

export type Subscription = {
  readonly __typename?: 'Subscription';
  readonly todoSubscriptionUpdate: TodoSubscriptionMessage;
};

export type Todo = {
  readonly __typename?: 'Todo';
  readonly completed: Scalars['Boolean']['output'];
  readonly createdAt: Scalars['DateTime']['output'];
  readonly id: Scalars['ID']['output'];
  readonly owner: User;
  readonly parent?: Maybe<Todo>;
  readonly title: Scalars['String']['output'];
  readonly todos: TodoList;
  readonly updatedAt: Scalars['DateTime']['output'];
};


export type TodoTodosArgs = {
  pageData: PaginationInput;
};

export enum TodoFilterType {
  Active = 'ACTIVE',
  All = 'ALL',
  Completed = 'COMPLETED'
}

export type TodoList = {
  readonly __typename?: 'TodoList';
  readonly list?: Maybe<ReadonlyArray<Todo>>;
  readonly page: PaginationInfo;
};

export type TodoSubscriptionMessage = {
  readonly __typename?: 'TodoSubscriptionMessage';
  readonly data?: Maybe<Todo>;
  readonly type: TodoSubscriptionType;
};

export enum TodoSubscriptionType {
  TodoCreated = 'TODO_CREATED',
  TodoDeleted = 'TODO_DELETED',
  TodoUpdated = 'TODO_UPDATED'
}

export type UpdateTodoInput = {
  readonly completed?: InputMaybe<Scalars['Boolean']['input']>;
  readonly parent?: InputMaybe<ParentTodoIdInput>;
  readonly title?: InputMaybe<Scalars['String']['input']>;
};

export type User = {
  readonly __typename?: 'User';
  readonly createdAt: Scalars['DateTime']['output'];
  readonly id: Scalars['ID']['output'];
  readonly todos?: Maybe<ReadonlyArray<Todo>>;
  readonly updatedAt: Scalars['DateTime']['output'];
  readonly username: Scalars['String']['output'];
};

export type AddNewTodoMutationVariables = Exact<{
  createTodoInput: CreateTodoInput;
}>;


export type AddNewTodoMutation = { readonly __typename?: 'Mutation', readonly addTodo: { readonly __typename?: 'Todo', readonly id: string, readonly title: string, readonly completed: boolean } };

export type ToggleTodoCompletionMutationVariables = Exact<{
  id: Scalars['String']['input'];
  completed: Scalars['Boolean']['input'];
}>;


export type ToggleTodoCompletionMutation = { readonly __typename?: 'Mutation', readonly updateTodo: { readonly __typename?: 'Todo', readonly id: string, readonly completed: boolean } };

export type RemoveTodoMutationVariables = Exact<{
  id: Scalars['String']['input'];
}>;


export type RemoveTodoMutation = { readonly __typename?: 'Mutation', readonly deleteTodo: boolean };

export type GetTodoListQueryVariables = Exact<{
  parentId?: InputMaybe<Scalars['String']['input']>;
  page: Scalars['Int']['input'];
  take: Scalars['Int']['input'];
  order?: InputMaybe<SortOrder>;
  filter?: InputMaybe<TodoFilterType>;
}>;


export type GetTodoListQuery = { readonly __typename?: 'Query', readonly todos: { readonly __typename?: 'TodoList', readonly list?: ReadonlyArray<{ readonly __typename?: 'Todo', readonly id: string, readonly title: string, readonly completed: boolean, readonly todos: { readonly __typename?: 'TodoList', readonly page: { readonly __typename?: 'PaginationInfo', readonly itemCount: number } } }> | null, readonly page: { readonly __typename?: 'PaginationInfo', readonly pageCount: number, readonly itemCount: number, readonly page: number, readonly pageSize: number, readonly hasNextPage: boolean, readonly hasPreviousPage: boolean } } };

export type OnTodoUpdatedSubscriptionVariables = Exact<{ [key: string]: never; }>;


export type OnTodoUpdatedSubscription = { readonly __typename?: 'Subscription', readonly todoSubscriptionUpdate: { readonly __typename?: 'TodoSubscriptionMessage', readonly type: TodoSubscriptionType, readonly data?: { readonly __typename?: 'Todo', readonly id: string, readonly title: string, readonly completed: boolean, readonly updatedAt: Date, readonly parent?: { readonly __typename?: 'Todo', readonly id: string } | null } | null } };


export const AddNewTodoDocument = gql`
    mutation addNewTodo($createTodoInput: CreateTodoInput!) {
  addTodo(createTodoData: $createTodoInput) {
    id
    title
    completed
  }
}
    `;
export type AddNewTodoMutationFn = Apollo.MutationFunction<AddNewTodoMutation, AddNewTodoMutationVariables>;

/**
 * __useAddNewTodoMutation__
 *
 * To run a mutation, you first call `useAddNewTodoMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useAddNewTodoMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [addNewTodoMutation, { data, loading, error }] = useAddNewTodoMutation({
 *   variables: {
 *      createTodoInput: // value for 'createTodoInput'
 *   },
 * });
 */
export function useAddNewTodoMutation(baseOptions?: Apollo.MutationHookOptions<AddNewTodoMutation, AddNewTodoMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<AddNewTodoMutation, AddNewTodoMutationVariables>(AddNewTodoDocument, options);
      }
export type AddNewTodoMutationHookResult = ReturnType<typeof useAddNewTodoMutation>;
export type AddNewTodoMutationResult = Apollo.MutationResult<AddNewTodoMutation>;
export type AddNewTodoMutationOptions = Apollo.BaseMutationOptions<AddNewTodoMutation, AddNewTodoMutationVariables>;
export const ToggleTodoCompletionDocument = gql`
    mutation toggleTodoCompletion($id: String!, $completed: Boolean!) {
  updateTodo(id: $id, updateTodoData: {completed: $completed}) {
    id
    completed
  }
}
    `;
export type ToggleTodoCompletionMutationFn = Apollo.MutationFunction<ToggleTodoCompletionMutation, ToggleTodoCompletionMutationVariables>;

/**
 * __useToggleTodoCompletionMutation__
 *
 * To run a mutation, you first call `useToggleTodoCompletionMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useToggleTodoCompletionMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [toggleTodoCompletionMutation, { data, loading, error }] = useToggleTodoCompletionMutation({
 *   variables: {
 *      id: // value for 'id'
 *      completed: // value for 'completed'
 *   },
 * });
 */
export function useToggleTodoCompletionMutation(baseOptions?: Apollo.MutationHookOptions<ToggleTodoCompletionMutation, ToggleTodoCompletionMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<ToggleTodoCompletionMutation, ToggleTodoCompletionMutationVariables>(ToggleTodoCompletionDocument, options);
      }
export type ToggleTodoCompletionMutationHookResult = ReturnType<typeof useToggleTodoCompletionMutation>;
export type ToggleTodoCompletionMutationResult = Apollo.MutationResult<ToggleTodoCompletionMutation>;
export type ToggleTodoCompletionMutationOptions = Apollo.BaseMutationOptions<ToggleTodoCompletionMutation, ToggleTodoCompletionMutationVariables>;
export const RemoveTodoDocument = gql`
    mutation removeTodo($id: String!) {
  deleteTodo(id: $id)
}
    `;
export type RemoveTodoMutationFn = Apollo.MutationFunction<RemoveTodoMutation, RemoveTodoMutationVariables>;

/**
 * __useRemoveTodoMutation__
 *
 * To run a mutation, you first call `useRemoveTodoMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useRemoveTodoMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [removeTodoMutation, { data, loading, error }] = useRemoveTodoMutation({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useRemoveTodoMutation(baseOptions?: Apollo.MutationHookOptions<RemoveTodoMutation, RemoveTodoMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<RemoveTodoMutation, RemoveTodoMutationVariables>(RemoveTodoDocument, options);
      }
export type RemoveTodoMutationHookResult = ReturnType<typeof useRemoveTodoMutation>;
export type RemoveTodoMutationResult = Apollo.MutationResult<RemoveTodoMutation>;
export type RemoveTodoMutationOptions = Apollo.BaseMutationOptions<RemoveTodoMutation, RemoveTodoMutationVariables>;
export const GetTodoListDocument = gql`
    query getTodoList($parentId: String, $page: Int!, $take: Int!, $order: SortOrder, $filter: TodoFilterType) {
  todos(
    parentId: $parentId
    pageData: {page: $page, take: $take, order: $order}
    filter: $filter
  ) {
    list {
      id
      title
      completed
      todos(pageData: {page: 1, take: 1, order: DESC}) {
        page {
          itemCount
        }
      }
    }
    page {
      pageCount
      itemCount
      page
      pageSize
      hasNextPage
      hasPreviousPage
    }
  }
}
    `;

/**
 * __useGetTodoListQuery__
 *
 * To run a query within a React component, call `useGetTodoListQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetTodoListQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetTodoListQuery({
 *   variables: {
 *      parentId: // value for 'parentId'
 *      page: // value for 'page'
 *      take: // value for 'take'
 *      order: // value for 'order'
 *      filter: // value for 'filter'
 *   },
 * });
 */
export function useGetTodoListQuery(baseOptions: Apollo.QueryHookOptions<GetTodoListQuery, GetTodoListQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetTodoListQuery, GetTodoListQueryVariables>(GetTodoListDocument, options);
      }
export function useGetTodoListLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetTodoListQuery, GetTodoListQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetTodoListQuery, GetTodoListQueryVariables>(GetTodoListDocument, options);
        }
export function useGetTodoListSuspenseQuery(baseOptions?: Apollo.SuspenseQueryHookOptions<GetTodoListQuery, GetTodoListQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<GetTodoListQuery, GetTodoListQueryVariables>(GetTodoListDocument, options);
        }
export type GetTodoListQueryHookResult = ReturnType<typeof useGetTodoListQuery>;
export type GetTodoListLazyQueryHookResult = ReturnType<typeof useGetTodoListLazyQuery>;
export type GetTodoListSuspenseQueryHookResult = ReturnType<typeof useGetTodoListSuspenseQuery>;
export type GetTodoListQueryResult = Apollo.QueryResult<GetTodoListQuery, GetTodoListQueryVariables>;
export const OnTodoUpdatedDocument = gql`
    subscription onTodoUpdated {
  todoSubscriptionUpdate {
    data {
      id
      title
      completed
      updatedAt
      parent {
        id
      }
    }
    type
  }
}
    `;

/**
 * __useOnTodoUpdatedSubscription__
 *
 * To run a query within a React component, call `useOnTodoUpdatedSubscription` and pass it any options that fit your needs.
 * When your component renders, `useOnTodoUpdatedSubscription` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the subscription, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useOnTodoUpdatedSubscription({
 *   variables: {
 *   },
 * });
 */
export function useOnTodoUpdatedSubscription(baseOptions?: Apollo.SubscriptionHookOptions<OnTodoUpdatedSubscription, OnTodoUpdatedSubscriptionVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useSubscription<OnTodoUpdatedSubscription, OnTodoUpdatedSubscriptionVariables>(OnTodoUpdatedDocument, options);
      }
export type OnTodoUpdatedSubscriptionHookResult = ReturnType<typeof useOnTodoUpdatedSubscription>;
export type OnTodoUpdatedSubscriptionResult = Apollo.SubscriptionResult<OnTodoUpdatedSubscription>;
export type AuthUserKeySpecifier = ('token' | 'user' | AuthUserKeySpecifier)[];
export type AuthUserFieldPolicy = {
	token?: FieldPolicy<any> | FieldReadFunction<any>,
	user?: FieldPolicy<any> | FieldReadFunction<any>
};
export type MutationKeySpecifier = ('addTodo' | 'deleteTodo' | 'signIn' | 'updateTodo' | MutationKeySpecifier)[];
export type MutationFieldPolicy = {
	addTodo?: FieldPolicy<any> | FieldReadFunction<any>,
	deleteTodo?: FieldPolicy<any> | FieldReadFunction<any>,
	signIn?: FieldPolicy<any> | FieldReadFunction<any>,
	updateTodo?: FieldPolicy<any> | FieldReadFunction<any>
};
export type PaginationInfoKeySpecifier = ('hasNextPage' | 'hasPreviousPage' | 'itemCount' | 'page' | 'pageCount' | 'pageSize' | PaginationInfoKeySpecifier)[];
export type PaginationInfoFieldPolicy = {
	hasNextPage?: FieldPolicy<any> | FieldReadFunction<any>,
	hasPreviousPage?: FieldPolicy<any> | FieldReadFunction<any>,
	itemCount?: FieldPolicy<any> | FieldReadFunction<any>,
	page?: FieldPolicy<any> | FieldReadFunction<any>,
	pageCount?: FieldPolicy<any> | FieldReadFunction<any>,
	pageSize?: FieldPolicy<any> | FieldReadFunction<any>
};
export type QueryKeySpecifier = ('todo' | 'todos' | QueryKeySpecifier)[];
export type QueryFieldPolicy = {
	todo?: FieldPolicy<any> | FieldReadFunction<any>,
	todos?: FieldPolicy<any> | FieldReadFunction<any>
};
export type SubscriptionKeySpecifier = ('todoSubscriptionUpdate' | SubscriptionKeySpecifier)[];
export type SubscriptionFieldPolicy = {
	todoSubscriptionUpdate?: FieldPolicy<any> | FieldReadFunction<any>
};
export type TodoKeySpecifier = ('completed' | 'createdAt' | 'id' | 'owner' | 'parent' | 'title' | 'todos' | 'updatedAt' | TodoKeySpecifier)[];
export type TodoFieldPolicy = {
	completed?: FieldPolicy<any> | FieldReadFunction<any>,
	createdAt?: FieldPolicy<any> | FieldReadFunction<any>,
	id?: FieldPolicy<any> | FieldReadFunction<any>,
	owner?: FieldPolicy<any> | FieldReadFunction<any>,
	parent?: FieldPolicy<any> | FieldReadFunction<any>,
	title?: FieldPolicy<any> | FieldReadFunction<any>,
	todos?: FieldPolicy<any> | FieldReadFunction<any>,
	updatedAt?: FieldPolicy<any> | FieldReadFunction<any>
};
export type TodoListKeySpecifier = ('list' | 'page' | TodoListKeySpecifier)[];
export type TodoListFieldPolicy = {
	list?: FieldPolicy<any> | FieldReadFunction<any>,
	page?: FieldPolicy<any> | FieldReadFunction<any>
};
export type TodoSubscriptionMessageKeySpecifier = ('data' | 'type' | TodoSubscriptionMessageKeySpecifier)[];
export type TodoSubscriptionMessageFieldPolicy = {
	data?: FieldPolicy<any> | FieldReadFunction<any>,
	type?: FieldPolicy<any> | FieldReadFunction<any>
};
export type UserKeySpecifier = ('createdAt' | 'id' | 'todos' | 'updatedAt' | 'username' | UserKeySpecifier)[];
export type UserFieldPolicy = {
	createdAt?: FieldPolicy<any> | FieldReadFunction<any>,
	id?: FieldPolicy<any> | FieldReadFunction<any>,
	todos?: FieldPolicy<any> | FieldReadFunction<any>,
	updatedAt?: FieldPolicy<any> | FieldReadFunction<any>,
	username?: FieldPolicy<any> | FieldReadFunction<any>
};
export type StrictTypedTypePolicies = {
	AuthUser?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | AuthUserKeySpecifier | (() => undefined | AuthUserKeySpecifier),
		fields?: AuthUserFieldPolicy,
	},
	Mutation?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | MutationKeySpecifier | (() => undefined | MutationKeySpecifier),
		fields?: MutationFieldPolicy,
	},
	PaginationInfo?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | PaginationInfoKeySpecifier | (() => undefined | PaginationInfoKeySpecifier),
		fields?: PaginationInfoFieldPolicy,
	},
	Query?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | QueryKeySpecifier | (() => undefined | QueryKeySpecifier),
		fields?: QueryFieldPolicy,
	},
	Subscription?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | SubscriptionKeySpecifier | (() => undefined | SubscriptionKeySpecifier),
		fields?: SubscriptionFieldPolicy,
	},
	Todo?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | TodoKeySpecifier | (() => undefined | TodoKeySpecifier),
		fields?: TodoFieldPolicy,
	},
	TodoList?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | TodoListKeySpecifier | (() => undefined | TodoListKeySpecifier),
		fields?: TodoListFieldPolicy,
	},
	TodoSubscriptionMessage?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | TodoSubscriptionMessageKeySpecifier | (() => undefined | TodoSubscriptionMessageKeySpecifier),
		fields?: TodoSubscriptionMessageFieldPolicy,
	},
	User?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | UserKeySpecifier | (() => undefined | UserKeySpecifier),
		fields?: UserFieldPolicy,
	}
};
export type TypedTypePolicies = StrictTypedTypePolicies & TypePolicies;