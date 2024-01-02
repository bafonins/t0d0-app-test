import { useCallback, useState } from "react";
import { TodoList } from "@/features/todos/components/todo-list/TodoList";
import {
  TodoFilter,
  TodoFilterProps,
} from "@/features/todos/components/todo-filter/TodoFilter";
import { TodoFilterType } from "@gql/gql-generated";

import styles from "./TodosListOverview.module.css";

export const TodosListOverview = () => {
  const [filter, setFilter] = useState<TodoFilterType>(TodoFilterType.All);

  const handleFilterChange: TodoFilterProps["onFilterChange"] = useCallback(
    (filter) => {
      setFilter(filter);
    },
    [setFilter]
  );

  return (
    <div>
      <h1 className={styles.heading}>T0D0S</h1>
      <TodoFilter value={filter} onFilterChange={handleFilterChange} />
      <main>
        <TodoList filter={filter} />
      </main>
    </div>
  );
};
