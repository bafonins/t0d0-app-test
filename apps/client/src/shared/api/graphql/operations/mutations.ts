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

export const TOGGLE_TODO_COMPLETION = gql`
  mutation toggleTodoCompletion($id: String!, $completed: Boolean!) {
    updateTodo(id: $id, updateTodoData: { completed: $completed }) {
      id
      completed
    }
  }
`;
