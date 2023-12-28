import { FC, useCallback } from "react";
import { useGetTodoListQuery } from "@/features/todos/hooks/useGetTodoListQuery";
import { useAddNewTodoMutation } from "@/features/todos/hooks/useAddNewTodo";
import { TodoItem } from "@/features/todos/components/TodoItem";
import {
  NewTodoInput,
  NewTodoInputProps,
} from "@/features/todos/components/NewTodoInput";

export interface TodoListProps {
  readonly parentId?: string;
}

export const TodoList: FC<TodoListProps> = (props) => {
  const { parentId } = props;

  const { todos, loading, refetchTodoList } = useGetTodoListQuery({
    parentId: parentId,
  });
  const { addNewTodo } = useAddNewTodoMutation(refetchTodoList);
  const handleAddNewTodo: NewTodoInputProps["onSubmit"] = useCallback(
    (title) => {
      addNewTodo({ title: title });
    },
    [addNewTodo]
  );

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
    </div>
  );
};
