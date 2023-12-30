import classNames from "classnames";
import {
  FC,
  useState,
  useCallback,
  MouseEventHandler,
  ChangeEventHandler,
} from "react";
import { GetTodoListQueryHookResult } from "@gql/gql-generated";
import { TodoList } from "@/features/todos/components/todo-list/TodoList";
import { useToggleTodoCompletionMutation } from "@/features/todos/hooks/useToggleTodoCompletion";
import styles from "./TodoList.module.css";

export interface TodoItemProps {
  readonly id: string;
  readonly title: string;
  readonly hasChildren: boolean;
  readonly isCompleted: boolean;
  readonly onRemove: (id: string) => void;
  readonly refetchParent: GetTodoListQueryHookResult["refetch"];
}

export const TodoItem: FC<TodoItemProps> = (props) => {
  const { id, title, hasChildren, isCompleted, onRemove, refetchParent } =
    props;

  const [isOpened, setIsOpened] = useState<boolean>(false);
  const { toggleTodoCompletion } = useToggleTodoCompletionMutation();
  const handleTodoCompletionChange: ChangeEventHandler<HTMLInputElement> =
    useCallback(() => {
      toggleTodoCompletion({
        id: id,
        completed: !isCompleted,
      });
    }, [toggleTodoCompletion, id, isCompleted]);
  const handleRemoval = useCallback(() => {
    onRemove(id);
  }, [id, onRemove]);
  const handleClick: MouseEventHandler<HTMLButtonElement> = useCallback(() => {
    setIsOpened((isOpened) => !isOpened);
  }, [setIsOpened]);

  return (
    <li
      className={classNames(styles.item, {
        [styles.completed]: isCompleted,
        [styles.opened]: isOpened,
        [styles.hasChildren]: hasChildren,
      })}
    >
      <div className={styles.content}>
        <button className={styles.expand} onClick={handleClick}></button>
        <input
          className={styles.toggle}
          type="checkbox"
          checked={isCompleted}
          onChange={handleTodoCompletionChange}
        />
        <label className={styles.title}>{title}</label>
        <button className={styles.remove} onClick={handleRemoval}></button>
      </div>
      {isOpened && <TodoList refetchParent={refetchParent} parentId={id} />}
    </li>
  );
};
