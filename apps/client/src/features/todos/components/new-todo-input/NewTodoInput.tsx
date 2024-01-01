import {
  FC,
  useState,
  ChangeEventHandler,
  KeyboardEventHandler,
  useCallback,
} from "react";
import styles from "./NewTodoInput.module.css";
import { useAuthContext } from "@/features/auth/hooks/useAuthContext";

export interface NewTodoInputProps {
  readonly onSubmit: (value: string) => void;
}

export const NewTodoInput: FC<NewTodoInputProps> = (props) => {
  const { onSubmit } = props;

  const { user } = useAuthContext();
  const [todoTitle, setTodoTitle] = useState("");
  const handleInputChange: ChangeEventHandler<HTMLInputElement> = useCallback(
    (event) => {
      setTodoTitle(event.currentTarget.value);
    },
    [setTodoTitle]
  );
  const handleInputSubmit: KeyboardEventHandler<HTMLInputElement> = (event) => {
    if (todoTitle.length <= 0) {
      return;
    }

    if (event.key === "Enter") {
      onSubmit(todoTitle);
      setTodoTitle("");
    }
  };

  return (
    <input
      className={styles.newTodoInput}
      type="text"
      value={todoTitle}
      onChange={handleInputChange}
      onKeyDown={handleInputSubmit}
      placeholder={
        user ? "What needs to be done?" : "Login to add and edit tasks"
      }
      disabled={!user}
    />
  );
};
