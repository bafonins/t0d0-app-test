import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = { [_ in K]?: never };
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
const defaultOptions = {} as const;
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string; }
  String: { input: string; output: string; }
  Boolean: { input: boolean; output: boolean; }
  Int: { input: number; output: number; }
  Float: { input: number; output: number; }
  /** A date-time string at UTC, such as 2019-12-03T09:54:33Z, compliant with the date-time format. */
  DateTime: { input: Date; output: Date; }
};

export type CreateTodoInput = {
  readonly parent?: InputMaybe<ParentTodoIdInput>;
  readonly title: Scalars['String']['input'];
};

export type Mutation = {
  readonly __typename?: 'Mutation';
  readonly addTodo: Todo;
  readonly updateTodo: Todo;
};


export type MutationAddTodoArgs = {
  createTodoData: CreateTodoInput;
};


export type MutationUpdateTodoArgs = {
  id: Scalars['String']['input'];
  updateTodoData: UpdateTodoInput;
};

export type PaginationInfo = {
  readonly __typename?: 'PaginationInfo';
  readonly hasNextPage: Scalars['Boolean']['output'];
  readonly hasPreviousPage: Scalars['Boolean']['output'];
  readonly itemCount: Scalars['Int']['output'];
  readonly page: Scalars['Int']['output'];
  readonly pageCount: Scalars['Int']['output'];
  readonly pageSize: Scalars['Int']['output'];
};

export type PaginationInput = {
  readonly order?: SortOrder;
  readonly page: Scalars['Int']['input'];
  readonly take: Scalars['Int']['input'];
};

export type ParentTodoIdInput = {
  readonly id: Scalars['ID']['input'];
};

export type Query = {
  readonly __typename?: 'Query';
  readonly todos: TodoList;
};


export type QueryTodosArgs = {
  pageData: PaginationInput;
  parentId?: InputMaybe<Scalars['String']['input']>;
};

export enum SortOrder {
  Asc = 'ASC',
  Desc = 'DESC'
}

export type Todo = {
  readonly __typename?: 'Todo';
  readonly completed: Scalars['Boolean']['output'];
  readonly createdAt: Scalars['DateTime']['output'];
  readonly id: Scalars['ID']['output'];
  readonly parent?: Maybe<Todo>;
  readonly title: Scalars['String']['output'];
  readonly todos: TodoList;
  readonly updatedAt: Scalars['DateTime']['output'];
};


export type TodoTodosArgs = {
  pageData: PaginationInput;
};

export type TodoList = {
  readonly __typename?: 'TodoList';
  readonly list?: Maybe<ReadonlyArray<Todo>>;
  readonly page: PaginationInfo;
};

export type UpdateTodoInput = {
  readonly completed?: InputMaybe<Scalars['Boolean']['input']>;
  readonly parent?: InputMaybe<ParentTodoIdInput>;
  readonly title?: InputMaybe<Scalars['String']['input']>;
};

export type AddNewTodoMutationVariables = Exact<{
  title: Scalars['String']['input'];
}>;


export type AddNewTodoMutation = { readonly __typename?: 'Mutation', readonly addTodo: { readonly __typename?: 'Todo', readonly id: string, readonly title: string, readonly completed: boolean } };

export type GetTodoListQueryVariables = Exact<{
  parentId?: InputMaybe<Scalars['String']['input']>;
  page: Scalars['Int']['input'];
  take: Scalars['Int']['input'];
  order?: InputMaybe<SortOrder>;
}>;


export type GetTodoListQuery = { readonly __typename?: 'Query', readonly todos: { readonly __typename?: 'TodoList', readonly list?: ReadonlyArray<{ readonly __typename?: 'Todo', readonly id: string, readonly title: string, readonly completed: boolean, readonly todos: { readonly __typename?: 'TodoList', readonly page: { readonly __typename?: 'PaginationInfo', readonly pageCount: number } } }> | null, readonly page: { readonly __typename?: 'PaginationInfo', readonly pageCount: number, readonly itemCount: number, readonly page: number, readonly pageSize: number, readonly hasNextPage: boolean, readonly hasPreviousPage: boolean } } };


export const AddNewTodoDocument = gql`
    mutation addNewTodo($title: String!) {
  addTodo(createTodoData: {title: $title}) {
    id
    title
    completed
  }
}
    `;
export type AddNewTodoMutationFn = Apollo.MutationFunction<AddNewTodoMutation, AddNewTodoMutationVariables>;

/**
 * __useAddNewTodoMutation__
 *
 * To run a mutation, you first call `useAddNewTodoMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useAddNewTodoMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [addNewTodoMutation, { data, loading, error }] = useAddNewTodoMutation({
 *   variables: {
 *      title: // value for 'title'
 *   },
 * });
 */
export function useAddNewTodoMutation(baseOptions?: Apollo.MutationHookOptions<AddNewTodoMutation, AddNewTodoMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<AddNewTodoMutation, AddNewTodoMutationVariables>(AddNewTodoDocument, options);
      }
export type AddNewTodoMutationHookResult = ReturnType<typeof useAddNewTodoMutation>;
export type AddNewTodoMutationResult = Apollo.MutationResult<AddNewTodoMutation>;
export type AddNewTodoMutationOptions = Apollo.BaseMutationOptions<AddNewTodoMutation, AddNewTodoMutationVariables>;
export const GetTodoListDocument = gql`
    query getTodoList($parentId: String, $page: Int!, $take: Int!, $order: SortOrder) {
  todos(parentId: $parentId, pageData: {page: $page, take: $take, order: $order}) {
    list {
      id
      title
      completed
      todos(pageData: {page: 1, take: 1, order: DESC}) {
        page {
          pageCount
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

/**
 * __useGetTodoListQuery__
 *
 * To run a query within a React component, call `useGetTodoListQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetTodoListQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetTodoListQuery({
 *   variables: {
 *      parentId: // value for 'parentId'
 *      page: // value for 'page'
 *      take: // value for 'take'
 *      order: // value for 'order'
 *   },
 * });
 */
export function useGetTodoListQuery(baseOptions: Apollo.QueryHookOptions<GetTodoListQuery, GetTodoListQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetTodoListQuery, GetTodoListQueryVariables>(GetTodoListDocument, options);
      }
export function useGetTodoListLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetTodoListQuery, GetTodoListQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetTodoListQuery, GetTodoListQueryVariables>(GetTodoListDocument, options);
        }
export function useGetTodoListSuspenseQuery(baseOptions?: Apollo.SuspenseQueryHookOptions<GetTodoListQuery, GetTodoListQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<GetTodoListQuery, GetTodoListQueryVariables>(GetTodoListDocument, options);
        }
export type GetTodoListQueryHookResult = ReturnType<typeof useGetTodoListQuery>;
export type GetTodoListLazyQueryHookResult = ReturnType<typeof useGetTodoListLazyQuery>;
export type GetTodoListSuspenseQueryHookResult = ReturnType<typeof useGetTodoListSuspenseQuery>;
export type GetTodoListQueryResult = Apollo.QueryResult<GetTodoListQuery, GetTodoListQueryVariables>;