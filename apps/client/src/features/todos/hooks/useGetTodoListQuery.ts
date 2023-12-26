import {
  useGetTodoListQuery as useGeneratedGetTodoListQuery,
  GetTodoListQueryVariables,
  SortOrder,
} from "@gql/gql-generated";
import { DEFAULT_TODO_PAGE_SIZE } from "@/constants/pagination";

const defaultVariables: GetTodoListQueryVariables = {
  parentId: undefined,
  take: DEFAULT_TODO_PAGE_SIZE,
  page: 1,
  order: SortOrder.Desc,
};

export const useGetTodoListQuery = (
  args: Partial<GetTodoListQueryVariables> = defaultVariables
) => {
  const variables: GetTodoListQueryVariables = {
    ...defaultVariables,
    ...args,
  };
  const { data, loading, error } = useGeneratedGetTodoListQuery({
    variables: variables,
  });

  return {
    todos: data?.todos.list || [],
    page: data?.todos.page,
    loading,
    error,
  };
};
