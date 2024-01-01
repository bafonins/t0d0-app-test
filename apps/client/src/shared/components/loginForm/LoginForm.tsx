import {
  FC,
  FormEventHandler,
  ReactEventHandler,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";

import styles from "./LoginForm.module.css";

export interface LoginFormProps {
  readonly onSubmit: (username: string) => void;
}

export const LoginForm: FC<LoginFormProps> = (props) => {
  const { onSubmit } = props;

  const [username, setUsername] = useState("");
  const usernameRef = useRef(username);

  const handleUsernameChange: ReactEventHandler<HTMLInputElement> = useCallback(
    (event) => {
      setUsername(event.currentTarget.value);
    },
    []
  );
  const handleFormSubmit: FormEventHandler<HTMLFormElement> = useCallback(
    (event) => {
      event.preventDefault();
      onSubmit(usernameRef.current);
      setUsername("");
    },
    [setUsername, onSubmit]
  );

  useEffect(() => {
    if (username !== usernameRef.current) {
      usernameRef.current = username;
    }
  }, [username]);

  return (
    <form onSubmit={handleFormSubmit}>
      <input
        className={styles.usernameInput}
        placeholder="username"
        type="text"
        required
        value={username}
        onChange={handleUsernameChange}
      />
      <button className={styles.submitButton}>login</button>
    </form>
  );
};
