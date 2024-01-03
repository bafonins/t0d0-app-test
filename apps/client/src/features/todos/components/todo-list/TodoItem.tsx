import {
  FC,
  useState,
  useCallback,
  MouseEventHandler,
  ChangeEventHandler,
} from "react";
import classNames from "classnames";
import { TodoList } from "@/features/todos/components/todo-list/TodoList";
import { useToggleTodoCompletionMutation } from "@/features/todos/hooks/useToggleTodoCompletion";
import { useFreezeTodoMutation } from "@/features/todos/hooks/useFreezeTodo";
import { useAuthContext } from "@/features/auth/hooks/useAuthContext";
import { Link } from "@/shared/components/link/Link";
import { GetTodoListQueryHookResult } from "@gql/gql-generated";

import styles from "./TodoList.module.css";

export interface TodoItemProps {
  readonly id: string;
  readonly title: string;
  readonly hasChildren: boolean;
  readonly hasParent: boolean;
  readonly isCompleted: boolean;
  readonly isFrozen: boolean;
  readonly onRemove: (id: string) => void;
  readonly refetchParent: GetTodoListQueryHookResult["refetch"];
}

export const TodoItem: FC<TodoItemProps> = (props) => {
  const {
    id,
    title,
    hasChildren,
    hasParent,
    isCompleted,
    isFrozen,
    onRemove,
    refetchParent,
  } = props;

  const [isOpened, setIsOpened] = useState<boolean>(false);
  const { user } = useAuthContext();
  const { freezeTodo } = useFreezeTodoMutation();
  const { toggleTodoCompletion } = useToggleTodoCompletionMutation();

  const handleFreezeTodo = useCallback(() => {
    return freezeTodo({ id: id, frozen: !isFrozen });
  }, [freezeTodo, id, isFrozen]);
  const handleTodoCompletionChange: ChangeEventHandler<HTMLInputElement> =
    useCallback(() => {
      return toggleTodoCompletion({
        id: id,
        completed: !isCompleted,
      });
    }, [toggleTodoCompletion, id, isCompleted]);
  const handleRemoval = useCallback(() => {
    return onRemove(id);
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
        [styles.frozen]: isFrozen,
        [styles.editable]: user,
        [styles.freezable]: !hasParent,
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
          disabled={!user || isFrozen}
        />
        <Link to={`/${id}`}>
          <label className={styles.title}>{title}</label>
        </Link>
        <button
          className={styles.freeze}
          onClick={handleFreezeTodo}
          title={isFrozen ? "unfreeze task" : "freeze task"}
        ></button>
        <button
          className={styles.remove}
          onClick={handleRemoval}
          title={
            hasChildren ? "remove task and all nested tasks" : "remove task"
          }
        ></button>
      </div>
      {isOpened && (
        <TodoList
          refetchParent={refetchParent}
          parentId={id}
          isParentFrozen={isFrozen}
        />
      )}
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
