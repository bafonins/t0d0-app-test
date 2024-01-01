import { FC, ChangeEventHandler, useCallback } from "react";

import { TodoFilterType } from "@gql/gql-generated";

import styles from "./TodoFilter.module.css";

export interface TodoFilterProps {
  readonly value: TodoFilterType;
  readonly isDisabled?: boolean;
  readonly onFilterChange: (filter: TodoFilterType) => void;
}

export const TodoFilter: FC<TodoFilterProps> = (props) => {
  const { value, onFilterChange, isDisabled = false } = props;

  const handleFilterChange: ChangeEventHandler<HTMLInputElement> = useCallback(
    (event) => {
      const newFilter = event.currentTarget.value as TodoFilterType;
      onFilterChange(newFilter);
    },
    [onFilterChange]
  );
  return (
    <div className={styles.filter}>
      <label htmlFor="all-filter">All</label>
      <input
        className={styles.input}
        id="all-filter"
        name="todo-filter"
        type="radio"
        disabled={isDisabled}
        value={TodoFilterType.All}
        checked={value === TodoFilterType.All}
        onChange={handleFilterChange}
        title="show all tasks"
      ></input>
      <label htmlFor="active-filter">Active</label>
      <input
        className={styles.input}
        id="active-filter"
        name="todo-filter"
        type="radio"
        disabled={isDisabled}
        value={TodoFilterType.Active}
        checked={value === TodoFilterType.Active}
        onChange={handleFilterChange}
        title="show active tasks"
      ></input>
      <label htmlFor="completed-filter">Completed</label>
      <input
        className={styles.input}
        id="completed-filter"
        name="todo-filter"
        type="radio"
        disabled={isDisabled}
        value={TodoFilterType.Completed}
        checked={value === TodoFilterType.Completed}
        onChange={handleFilterChange}
        title="show completed tasks"
      ></input>
    </div>
  );
};
