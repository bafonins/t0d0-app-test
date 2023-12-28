import { useCallback } from "react";
import {
  useToggleTodoCompletionMutation as useGeneratedToggleTodoCompletionMutation,
  ToggleTodoCompletionMutationVariables,
} from "@gql/gql-generated";

export const useToggleTodoCompletionMutation = () => {
  const [mutateFunction, { data, loading, error }] =
    useGeneratedToggleTodoCompletionMutation();
  const toggleTodoCompletion = useCallback(
    (variables: ToggleTodoCompletionMutationVariables) => {
      return mutateFunction({ variables: variables });
    },
    [mutateFunction]
  );

  return {
    toggleTodoCompletion,
    data,
    loading,
    error,
  };
};
