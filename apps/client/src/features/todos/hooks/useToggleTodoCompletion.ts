import {
  useToggleTodoCompletionMutation as useGeneratedToggleTodoCompletionMutation,
  ToggleTodoCompletionMutationVariables,
} from "@gql/gql-generated";

export const useToggleTodoCompletionMutation = (
  variables: ToggleTodoCompletionMutationVariables
) => {
  const [mutateFunction, { data, loading, error }] =
    useGeneratedToggleTodoCompletionMutation({
      variables: variables,
    });

  return {
    toggleTodoCompletion: mutateFunction,
    data,
    loading,
    error,
  };
};
