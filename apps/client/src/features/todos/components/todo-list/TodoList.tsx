import { FC, useCallback, useEffect } from "react";
import classNames from "classnames";
import { useGetTodoListQuery } from "@/features/todos/hooks/useGetTodoListQuery";
import { useAddNewTodoMutation } from "@/features/todos/hooks/useAddNewTodo";
import {
  TodoItem,
  TodoItemEmpty,
} from "@/features/todos/components/todo-list/TodoItem";
import {
  NewTodoInput,
  NewTodoInputProps,
} from "@/features/todos/components/new-todo-input/NewTodoInput";
import { useRemoveTodoMutation } from "@/features/todos/hooks/useRemoveTodo";
import { Pagination } from "@/shared/components/Pagination";
import { GetTodoListQueryHookResult, TodoFilterType } from "@gql/gql-generated";
import styles from "./TodoList.module.css";

export interface TodoListProps {
  readonly className?: string;
  readonly parentId?: string;
  readonly filter?: TodoFilterType;
  readonly refetchParent?: GetTodoListQueryHookResult["refetch"];
}

const refetchParentNoop: GetTodoListQueryHookResult["refetch"] = () =>
  Promise.resolve({} as ReturnType<GetTodoListQueryHookResult["refetch"]>);

export const TodoList: FC<TodoListProps> = (props) => {
  const {
    parentId,
    className,
    filter,
    refetchParent = refetchParentNoop,
  } = props;
  console.log("filter in list:", filter);

  const { todos, loading, page, refetchTodoList } = useGetTodoListQuery({
    parentId: parentId,
    filter: filter,
  });
  const {
    itemCount = 0,
    hasNextPage = false,
    hasPreviousPage = false,
  } = page || {};
  const hasTodos = itemCount > 0;
  const showPagination = hasTodos && (hasNextPage || hasPreviousPage);

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

  useEffect(() => {
    console.log("kekistan");
    refetchTodoList({ parentId: parentId, filter: filter });
  }, [parentId, filter, refetchTodoList]);

  if (loading) {
    return null;
  }

  return (
    <div className={classNames(styles.listContainer, className)}>
      <div className={styles.inputContainer}>
        <NewTodoInput onSubmit={handleAddNewTodo} />
      </div>
      <ul className={styles.list}>
        {hasTodos &&
          todos.map((todo) => (
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
        {!hasTodos && <TodoItemEmpty />}
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
