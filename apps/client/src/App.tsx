import { TodoList } from "@/features/todos/components/todo-list/TodoList";
import { useOnTodoUpdatedSubscription } from "@/features/todos/hooks/useOnTodoUpdatedSubscription";
import styles from "./App.module.css";
import {
  TodoFilter,
  TodoFilterProps,
} from "./features/todos/components/todo-filter/TodoFilter";
import { useCallback, useState } from "react";
import { TodoFilterType } from "@gql/gql-generated";

function App() {
  useOnTodoUpdatedSubscription();
  const [filter, setFilter] = useState<TodoFilterType>(TodoFilterType.All);

  const handleFilterChange: TodoFilterProps["onFilterChange"] = useCallback(
    (filter) => {
      setFilter(filter);
    },
    [setFilter]
  );

  return (
    <div className={styles.app}>
      <header>
        <h1 className={styles.heading}>T0D0S</h1>
        <TodoFilter value={filter} onFilterChange={handleFilterChange} />
      </header>
      <TodoList filter={filter} />
    </div>
  );
}

export default App;
