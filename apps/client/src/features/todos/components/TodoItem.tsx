import { FC, useState, useCallback, MouseEventHandler } from "react";
import { TodoList } from "@/features/todos/components/TodoList";

export interface TodoItemProps {
  readonly id: string;
  readonly title: string;
  readonly hasChildren: boolean;
}

export const TodoItem: FC<TodoItemProps> = (props) => {
  const { id, title, hasChildren } = props;

  const [isExpanded, setIsExpanded] = useState<boolean>(false);
  const handleClick: MouseEventHandler<HTMLLIElement> = useCallback(
    (event) => {
      event.stopPropagation();

      if (hasChildren) {
        setIsExpanded((isExpanded) => !isExpanded);
      }
    },
    [setIsExpanded, hasChildren]
  );

  let expandIndicator = null;
  if (hasChildren) {
    expandIndicator = isExpanded ? "👆" : "👇";
  }

  return (
    <li
      onClick={handleClick}
      style={hasChildren ? { cursor: "pointer" } : { cursor: "initial" }}
    >
      <span>
        {title} {expandIndicator}
      </span>
      {isExpanded && <TodoList parentId={id} />}
    </li>
  );
};
