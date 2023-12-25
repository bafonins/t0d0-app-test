import { gql } from "@apollo/client";

export const ADD_NEW_TODO = gql`
  mutation addNewTodo($title: String!) {
    addTodo(createTodoData: { title: $title }) {
      id
      title
      completed
    }
  }
`;
