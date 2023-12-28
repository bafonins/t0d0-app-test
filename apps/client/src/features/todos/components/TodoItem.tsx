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
      {isExpanded && <TodoList parentId={id} />}
    </li>
  );
};
