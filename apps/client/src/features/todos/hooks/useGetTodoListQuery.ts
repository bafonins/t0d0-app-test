import {
  useGetTodoListQuery as useGeneratedGetTodoListQuery,
  GetTodoListQueryVariables,
  SortOrder,
  TodoFilterType,
} from "@gql/gql-generated";
import { DEFAULT_TODO_PAGE_SIZE, DEFAULT_PAGE } from "@/constants/pagination";

const defaultVariables: GetTodoListQueryVariables = {
  parentId: undefined,
  take: DEFAULT_TODO_PAGE_SIZE,
  page: DEFAULT_PAGE,
  order: SortOrder.Desc,
  filter: TodoFilterType.All,
};

export const useGetTodoListQuery = (
  args: Partial<GetTodoListQueryVariables> = defaultVariables
) => {
  const variables: GetTodoListQueryVariables = {
    ...defaultVariables,
    ...args,
  };
  const { data, loading, error, refetch, updateQuery } =
    useGeneratedGetTodoListQuery({
      variables: variables,
    });

  return {
    updateTodoListQuery: updateQuery,
    refetchTodoList: refetch,
    todos: data?.todos.list || [],
    page: data?.todos.page,
    loading,
    error,
  };
};
