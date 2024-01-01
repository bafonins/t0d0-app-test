import { useCallback } from "react";
import {
  useFreezeTodoMutation as useGeneratedFreezeTodoMutation,
  FreezeTodoMutationVariables,
} from "@gql/gql-generated";

export const useFreezeTodoMutation = () => {
  const [mutateFunction, { data, loading, error }] =
    useGeneratedFreezeTodoMutation();
  const freezeTodo = useCallback(
    (variables: FreezeTodoMutationVariables) => {
      return mutateFunction({ variables: variables });
    },
    [mutateFunction]
  );

  return {
    freezeTodo,
    data,
    loading,
    error,
  };
};
