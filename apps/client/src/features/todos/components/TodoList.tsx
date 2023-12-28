import { FC, useCallback } from "react";
import { useGetTodoListQuery } from "@/features/todos/hooks/useGetTodoListQuery";
import { useAddNewTodoMutation } from "@/features/todos/hooks/useAddNewTodo";
import { TodoItem } from "@/features/todos/components/TodoItem";
import {
  NewTodoInput,
  NewTodoInputProps,
} from "@/features/todos/components/NewTodoInput";
import { Pagination } from "@/shared/components/Pagination";

export interface TodoListProps {
  readonly parentId?: string;
}

export const TodoList: FC<TodoListProps> = (props) => {
  const { parentId } = props;

  const { todos, loading, page, refetchTodoList } = useGetTodoListQuery({
    parentId: parentId,
  });

  const { addNewTodo } = useAddNewTodoMutation(refetchTodoList);
  const handleAddNewTodo: NewTodoInputProps["onSubmit"] = useCallback(
    (title) => {
      addNewTodo({
        title: title,
        ...(parentId ? { parent: { id: parentId } } : {}),
      });
    },
    [addNewTodo, parentId]
  );
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
      <ul>
        {todos.map((todo) => (
          <TodoItem
            key={todo.id}
            id={todo.id}
            title={todo.title}
            hasChildren={todo.todos.page.pageCount > 0}
            isCompleted={todo.completed}
          />
        ))}
      </ul>
      <Pagination
        hasNextPage={page?.hasNextPage}
        hasPreviousPage={page?.hasPreviousPage}
        currentPage={page?.page}
        onNextPage={handleNextPageChange}
        onPreviousPage={handlePreviousPageChange}
      />
    </div>
  );
};
