import { useCallback } from "react";
import {
  useAddNewTodoMutation as useGeneratedAddNewTodoMutation,
  AddNewTodoMutationVariables,
  GetTodoListQueryHookResult,
} from "@gql/gql-generated";

export const useAddNewTodoMutation = (
  refetchTodoList: GetTodoListQueryHookResult["refetch"]
) => {
  const [mutateFunction, { data, loading, error }] =
    useGeneratedAddNewTodoMutation();

  const addNewTodo = useCallback(
    async (variables: AddNewTodoMutationVariables) => {
      const result = await mutateFunction({
        variables: variables,
      });
      refetchTodoList();
      return result;
    },
    [mutateFunction, refetchTodoList]
  );

  return {
    addNewTodo,
    data,
    loading,
    error,
  };
};
