import {
  FC,
  useState,
  useCallback,
  MouseEventHandler,
  ChangeEventHandler,
} from "react";
import { TodoList } from "@/features/todos/components/TodoList";
import { useToggleTodoCompletionMutation } from "@/features/todos/hooks/useToggleTodoCompletion";

export interface TodoItemProps {
  readonly id: string;
  readonly title: string;
  readonly hasChildren: boolean;
  readonly isCompleted: boolean;
}

export const TodoItem: FC<TodoItemProps> = (props) => {
  const { id, title, hasChildren, isCompleted } = props;

  const [isExpanded, setIsExpanded] = useState<boolean>(false);
  const { toggleTodoCompletion } = useToggleTodoCompletionMutation();
  const handleTodoCompletionChange: ChangeEventHandler<HTMLInputElement> =
    useCallback(() => {
      toggleTodoCompletion({
        id: id,
        completed: !isCompleted,
      });
    }, [toggleTodoCompletion, id, isCompleted]);
  const handleClick: MouseEventHandler<HTMLLIElement> = useCallback(() => {
    if (hasChildren) {
      setIsExpanded((isExpanded) => !isExpanded);
    }
  }, [setIsExpanded, hasChildren]);

  let expandIndicator = null;
  if (hasChildren) {
    expandIndicator = isExpanded ? "👆" : "👇";
  }

  return (
    <li style={hasChildren ? { cursor: "pointer" } : { cursor: "initial" }}>
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
      {expandIndicator && (
        <span style={{ marginLeft: "8px", cursor: "initial" }}>
          {expandIndicator}
        </span>
      )}
      {isExpanded && <TodoList parentId={id} />}
    </li>
  );
};
