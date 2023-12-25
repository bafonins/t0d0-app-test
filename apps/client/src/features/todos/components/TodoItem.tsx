import { FC, useState, useCallback, MouseEventHandler } from "react";
import { TodoList } from "@/features/todos/components/TodoList";

export interface TodoItemProps {
  readonly id: string;
  readonly title: string;
}

export const TodoItem: FC<TodoItemProps> = (props) => {
  const { id, title } = props;

  const [isExpanded, setIsExpanded] = useState<boolean>(false);
  const handleClick: MouseEventHandler<HTMLLIElement> = useCallback(
    (event) => {
      event.stopPropagation();
      setIsExpanded((isExpanded) => !isExpanded);
    },
    [setIsExpanded]
  );

  return (
    <li onClick={handleClick}>
      <span>{title}</span>
      {isExpanded && <TodoList parentId={id} />}
    </li>
  );
};
