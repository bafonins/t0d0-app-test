import { useCallback } from "react";
import {
  useRemoveTodoMutation as useGeneratedRemoveTodoMutation,
  RemoveTodoMutationVariables,
  GetTodoListQueryHookResult,
} from "@gql/gql-generated";

export const useRemoveTodoMutation = (
  refetchTodoList: GetTodoListQueryHookResult["refetch"][]
) => {
  const [mutateFunction, { data, loading, error }] =
    useGeneratedRemoveTodoMutation();

  const removeTodo = useCallback(
    async (id: RemoveTodoMutationVariables["id"]) => {
      const result = await mutateFunction({
        variables: { id: id },
      });
      await Promise.all(refetchTodoList.map((refetch) => refetch()));

      return result;
    },
    [mutateFunction, refetchTodoList]
  );

  return {
    removeTodo,
    data,
    loading,
    error,
  };
};
