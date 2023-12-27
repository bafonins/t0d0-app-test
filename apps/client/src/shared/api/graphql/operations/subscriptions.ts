import { gql } from "@apollo/client";

export const TODOS_SUBSCRIPTION = gql`
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
