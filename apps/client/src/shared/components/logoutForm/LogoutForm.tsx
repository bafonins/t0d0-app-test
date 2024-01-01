import { FC, useCallback, FormEventHandler } from "react";

import styles from "./LogoutForm.module.css";

export interface LogoutFormProps {
  readonly username: string;
  readonly onSubmit: () => void;
}

export const LogoutForm: FC<LogoutFormProps> = (props) => {
  const { username, onSubmit } = props;

  const handleFormSubmit: FormEventHandler<HTMLFormElement> = useCallback(
    (event) => {
      event.preventDefault();
      onSubmit();
    },
    [onSubmit]
  );

  return (
    <form onSubmit={handleFormSubmit}>
      <span className={styles.hello}>
        Hello, <b>{username}</b>!
      </span>
      <button className={styles.submitButton}>logout</button>
    </form>
  );
};
