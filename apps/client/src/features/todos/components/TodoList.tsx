import { FC } from "react";
import { useGetTodoListQuery } from "@/features/todos/hooks/useGetTodoListQuery";
import { TodoItem } from "@/features/todos/components/TodoItem";

export interface TodoListProps {
  readonly parentId?: string;
}

export const TodoList: FC<TodoListProps> = (props) => {
  const { parentId } = props;
  const { todos, loading } = useGetTodoListQuery({
    parentId: parentId,
  });

  if (loading) {
    return null;
  }

  return (
    <ul>
      {todos.map((todo) => (
        <TodoItem
          key={todo.id}
          id={todo.id}
          title={todo.title}
          hasChildren={todo.todos.page.pageCount > 0}
        />
      ))}
    </ul>
  );
};
