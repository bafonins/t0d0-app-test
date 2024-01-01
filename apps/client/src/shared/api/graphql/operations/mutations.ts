import { gql } from "@apollo/client";

export const ADD_NEW_TODO = gql`
  mutation addNewTodo($createTodoInput: CreateTodoInput!) {
    addTodo(createTodoData: $createTodoInput) {
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

export const DELETE_DOTO = gql`
  mutation removeTodo($id: String!) {
    deleteTodo(id: $id)
  }
`;

export const SIGN_IN = gql`
  mutation signIn($username: String!) {
    signIn(signInData: { username: $username }) {
      token
      user {
        id
        username
      }
    }
  }
`;

export const FREEZE_TODO = gql`
  mutation freezeTodo($id: String!, $frozen: Boolean!) {
    updateTodo(id: $id, updateTodoData: { frozen: $frozen }) {
      id
      frozen
    }
  }
`;
