import { FC } from "react";
import { useParams } from "react-router-dom";
import { TodoList } from "@/features/todos/components/todo-list/TodoList";
import { useGetTodoQuery } from "@/features/todos/hooks/useGetTodoQuery";

import styles from "./TodoOverview.module.css";

export const TodoOverview: FC = () => {
  const { todoId } = useParams<{ todoId: string }>();
  if (!todoId) {
    return null;
  }

  return <TodoOverviewContent todoId={todoId} />;
};

const TodoOverviewContent: FC<{ todoId: string }> = (props) => {
  const { todoId } = props;
  const { todo, loading } = useGetTodoQuery({ id: todoId });

  if (loading || !todo) {
    return null;
  }

  return (
    <div>
      <header>
        <h2 className={styles.heading}>{todo.title}</h2>
      </header>
      <main>
        <TodoList parentId={todoId} isParentFrozen={todo.frozen} />
      </main>
    </div>
  );
};
