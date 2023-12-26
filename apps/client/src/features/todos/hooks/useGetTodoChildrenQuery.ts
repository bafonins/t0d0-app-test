import {
  useGetTodoChildrenQuery as useGeneratedGetTodoChildrenQuery,
  GetTodoChildrenQueryVariables,
} from "@gql/gql-generated";
import { DEFAULT_TODO_PAGE_SIZE } from "@/constants/pagination";

const defaultVariables: GetTodoChildrenQueryVariables = {
  parentId: undefined,
  take: DEFAULT_TODO_PAGE_SIZE,
  page: 1,
};

export const useGetTodoChildrenQuery = (
  args: Partial<GetTodoChildrenQueryVariables> = defaultVariables
) => {
  const variables: GetTodoChildrenQueryVariables = {
    ...defaultVariables,
    ...args,
  };
  const { data, loading, error } = useGeneratedGetTodoChildrenQuery({
    variables: variables,
  });

  return {
    todos: data?.todos.list || [],
    page: data?.todos.page,
    loading,
    error,
  };
};
