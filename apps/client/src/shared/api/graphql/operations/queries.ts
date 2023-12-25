import { gql } from "@apollo/client";

export const GET_TODO_CHILDREN = gql`
  query getTodoChildren($parentId: String, $page: Int!, $take: Int!) {
    todos(parentId: $parentId, pageData: { page: $page, take: $take }) {
      list {
        id
        title
        completed
      }
      page {
        totalCount
        page
        pageSize
      }
    }
  }
`;
