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
import { useAuthContext } from "@/features/auth/hooks/useAuthContext";

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

  const { user } = useAuthContext();
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
        [styles.nested]: hasChildren,
        [styles.editable]: user,
      })}
    >
      <div className={styles.content}>
        <button
          className={styles.expand}
          onClick={handleClick}
          title={isOpened ? "hide nested tasks" : "show nested tasks"}
        ></button>
        <input
          className={styles.toggle}
          type="checkbox"
          checked={isCompleted}
          onChange={handleTodoCompletionChange}
          disabled={!user}
        />
        <label className={styles.title}>{title}</label>
        <button
          className={styles.remove}
          onClick={handleRemoval}
          title={
            hasChildren ? "remove task and all nested tasks" : "remove task"
          }
        ></button>
      </div>
      {isOpened && <TodoList refetchParent={refetchParent} parentId={id} />}
    </li>
  );
};

export const TodoItemEmpty: FC = () => {
  return (
    <li className={classNames(styles.item, styles.empty)}>
      <span>empty</span>
    </li>
  );
};
