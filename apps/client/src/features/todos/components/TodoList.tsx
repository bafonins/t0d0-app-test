import { FC } from "react";
import { useGetTodoChildrenQuery } from "@/features/todos/hooks/useGetTodoChildrenQuery";
import { TodoItem } from "@/features/todos/components/TodoItem";

export interface TodoListProps {
  readonly parentId?: string;
}

export const TodoList: FC<TodoListProps> = (props) => {
  const { parentId } = props;
  const { todos, loading } = useGetTodoChildrenQuery({
    parentId: parentId,
  });

  if (loading) {
    return null;
  }

  return (
    <ul>
      {todos.map((todo) => (
        <TodoItem key={todo.id} id={todo.id} title={todo.title} />
      ))}
    </ul>
  );
};
