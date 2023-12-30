import {
  FC,
  useState,
  ChangeEventHandler,
  KeyboardEventHandler,
  useCallback,
} from "react";
import styles from "./NewTodoInput.module.css";

export interface NewTodoInputProps {
  readonly onSubmit: (value: string) => void;
}

export const NewTodoInput: FC<NewTodoInputProps> = (props) => {
  const { onSubmit } = props;

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
      placeholder="What needs to be done?"
    />
  );
};
