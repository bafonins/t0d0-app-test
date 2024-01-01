import { gql } from "@apollo/client";

export const GET_TODO_LIST = gql`
  query getTodoList(
    $parentId: String
    $page: Int!
    $take: Int!
    $order: SortOrder
    $filter: TodoFilterType
  ) {
    todos(
      parentId: $parentId
      pageData: { page: $page, take: $take, order: $order }
      filter: $filter
    ) {
      list {
        id
        title
        completed
        frozen
        todos(pageData: { page: 1, take: 1, order: DESC }) {
          page {
            itemCount
          }
        }
      }
      page {
        pageCount
        itemCount
        page
        pageSize
        hasNextPage
        hasPreviousPage
      }
    }
  }
`;
