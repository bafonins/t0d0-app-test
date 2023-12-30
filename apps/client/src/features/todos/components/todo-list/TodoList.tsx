import { FC, useCallback } from "react";
import { useGetTodoListQuery } from "@/features/todos/hooks/useGetTodoListQuery";
import { useAddNewTodoMutation } from "@/features/todos/hooks/useAddNewTodo";
import { TodoItem } from "@/features/todos/components/todo-list/TodoItem";
import {
  NewTodoInput,
  NewTodoInputProps,
} from "@/features/todos/components/new-todo-input/NewTodoInput";
import { useRemoveTodoMutation } from "@/features/todos/hooks/useRemoveTodo";
import { Pagination } from "@/shared/components/Pagination";
import { GetTodoListQueryHookResult } from "@gql/gql-generated";
import styles from "./TodoList.module.css";

export interface TodoListProps {
  readonly parentId?: string;
  readonly refetchParent?: GetTodoListQueryHookResult["refetch"];
}

const refetchParentNoop: GetTodoListQueryHookResult["refetch"] = () =>
  Promise.resolve({} as ReturnType<GetTodoListQueryHookResult["refetch"]>);

export const TodoList: FC<TodoListProps> = (props) => {
  const { parentId, refetchParent = refetchParentNoop } = props;

  const { todos, loading, page, refetchTodoList } = useGetTodoListQuery({
    parentId: parentId,
  });
  const {
    itemCount = 0,
    hasNextPage = false,
    hasPreviousPage = false,
  } = page || {};
  const showPagination = itemCount > 0 && (hasNextPage || hasPreviousPage);

  const { addNewTodo } = useAddNewTodoMutation([
    refetchTodoList,
    refetchParent,
  ]);
  const handleAddNewTodo: NewTodoInputProps["onSubmit"] = useCallback(
    (title) => {
      addNewTodo({
        title: title,
        ...(parentId ? { parent: { id: parentId } } : {}),
      });
    },
    [addNewTodo, parentId]
  );
  const { removeTodo } = useRemoveTodoMutation([
    refetchTodoList,
    refetchParent,
  ]);
  const handleNextPageChange = useCallback(() => {
    if (page?.hasNextPage) {
      refetchTodoList({ parentId: parentId, page: (page?.page || 1) + 1 });
    }
  }, [refetchTodoList, page, parentId]);
  const handlePreviousPageChange = useCallback(() => {
    if (page?.hasPreviousPage) {
      refetchTodoList({ parentId: parentId, page: (page?.page || 1) - 1 });
    }
  }, [refetchTodoList, page, parentId]);

  if (loading) {
    return null;
  }

  return (
    <div>
      <NewTodoInput onSubmit={handleAddNewTodo} />
      <ul className={styles.list}>
        {todos.map((todo) => (
          <TodoItem
            key={todo.id}
            id={todo.id}
            title={todo.title}
            hasChildren={todo.todos.page.itemCount > 0}
            isCompleted={todo.completed}
            onRemove={removeTodo}
            refetchParent={refetchTodoList}
          />
        ))}
      </ul>
      {showPagination && (
        <Pagination
          hasNextPage={page?.hasNextPage}
          hasPreviousPage={page?.hasPreviousPage}
          currentPage={page?.page}
          onNextPage={handleNextPageChange}
          onPreviousPage={handlePreviousPageChange}
        />
      )}
    </div>
  );
};
