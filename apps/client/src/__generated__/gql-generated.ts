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
  DateTime: { input: any; output: any; }
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
  readonly page: Scalars['Int']['output'];
  readonly pageSize: Scalars['Int']['output'];
  readonly totalCount: Scalars['Int']['output'];
};

export type PaginationInput = {
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

export type Todo = {
  readonly __typename?: 'Todo';
  readonly children?: Maybe<ReadonlyArray<Todo>>;
  readonly completed: Scalars['Boolean']['output'];
  readonly createdAt: Scalars['DateTime']['output'];
  readonly id: Scalars['ID']['output'];
  readonly parent?: Maybe<Todo>;
  readonly title: Scalars['String']['output'];
  readonly updatedAt: Scalars['DateTime']['output'];
};

export type TodoList = {
  readonly __typename?: 'TodoList';
  readonly list: ReadonlyArray<Todo>;
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

export type GetTodoChildrenQueryVariables = Exact<{
  parentId?: InputMaybe<Scalars['String']['input']>;
  page: Scalars['Int']['input'];
  take: Scalars['Int']['input'];
}>;


export type GetTodoChildrenQuery = { readonly __typename?: 'Query', readonly todos: { readonly __typename?: 'TodoList', readonly list: ReadonlyArray<{ readonly __typename?: 'Todo', readonly id: string, readonly title: string, readonly completed: boolean }>, readonly page: { readonly __typename?: 'PaginationInfo', readonly totalCount: number, readonly page: number, readonly pageSize: number } } };


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
export const GetTodoChildrenDocument = gql`
    query getTodoChildren($parentId: String, $page: Int!, $take: Int!) {
  todos(parentId: $parentId, pageData: {page: $page, take: $take}) {
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

/**
 * __useGetTodoChildrenQuery__
 *
 * To run a query within a React component, call `useGetTodoChildrenQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetTodoChildrenQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetTodoChildrenQuery({
 *   variables: {
 *      parentId: // value for 'parentId'
 *      page: // value for 'page'
 *      take: // value for 'take'
 *   },
 * });
 */
export function useGetTodoChildrenQuery(baseOptions: Apollo.QueryHookOptions<GetTodoChildrenQuery, GetTodoChildrenQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetTodoChildrenQuery, GetTodoChildrenQueryVariables>(GetTodoChildrenDocument, options);
      }
export function useGetTodoChildrenLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetTodoChildrenQuery, GetTodoChildrenQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetTodoChildrenQuery, GetTodoChildrenQueryVariables>(GetTodoChildrenDocument, options);
        }
export function useGetTodoChildrenSuspenseQuery(baseOptions?: Apollo.SuspenseQueryHookOptions<GetTodoChildrenQuery, GetTodoChildrenQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<GetTodoChildrenQuery, GetTodoChildrenQueryVariables>(GetTodoChildrenDocument, options);
        }
export type GetTodoChildrenQueryHookResult = ReturnType<typeof useGetTodoChildrenQuery>;
export type GetTodoChildrenLazyQueryHookResult = ReturnType<typeof useGetTodoChildrenLazyQuery>;
export type GetTodoChildrenSuspenseQueryHookResult = ReturnType<typeof useGetTodoChildrenSuspenseQuery>;
export type GetTodoChildrenQueryResult = Apollo.QueryResult<GetTodoChildrenQuery, GetTodoChildrenQueryVariables>;