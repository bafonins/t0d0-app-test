import {
  FC,
  useState,
  useCallback,
  MouseEventHandler,
  ChangeEventHandler,
} from "react";
import { GetTodoListQueryHookResult } from "@gql/gql-generated";
import { TodoList } from "@/features/todos/components/TodoList";
import { useToggleTodoCompletionMutation } from "@/features/todos/hooks/useToggleTodoCompletion";

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

  const [isExpanded, setIsExpanded] = useState<boolean>(false);
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
  const handleClick: MouseEventHandler<HTMLLIElement> = useCallback(() => {
    setIsExpanded((isExpanded) => !isExpanded);
  }, [setIsExpanded]);

  let indicator = null;
  if (hasChildren) {
    indicator = isExpanded ? "👆" : "👇";
  }

  return (
    <li style={{ cursor: "pointer" }}>
      <input
        type="checkbox"
        checked={isCompleted}
        onChange={handleTodoCompletionChange}
      />
      <span
        onClick={handleClick}
        style={isCompleted ? { textDecoration: "line-through" } : {}}
      >
        {title}
      </span>
      {indicator && (
        <span style={{ marginLeft: "8px", cursor: "initial" }}>
          {indicator}
        </span>
      )}
      <button style={{ marginLeft: "8px" }} onClick={handleRemoval}>
        delete
      </button>
      {isExpanded && <TodoList refetchParent={refetchParent} parentId={id} />}
    </li>
  );
};
