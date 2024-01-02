import {
  useGetTodoQuery as useGeneratedGetTodoQuery,
  GetTodoQueryVariables,
} from "@gql/gql-generated";

export const useGetTodoQuery = (variables: GetTodoQueryVariables) => {
  const { data, loading, error, updateQuery } = useGeneratedGetTodoQuery({
    variables: variables,
  });

  return {
    updateTodoQuery: updateQuery,
    todo: data?.todo,
    loading: loading,
    error: error,
  };
};
