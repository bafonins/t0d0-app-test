import { gql } from "@apollo/client";

export const NEW_TODO_FRAGMENT = gql`
  fragment NewTodo on Todo {
    id
    title
    completed
    frozen
    updatedAt
    parent {
      id
    }
  }
`;
