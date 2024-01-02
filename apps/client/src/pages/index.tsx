import { FC } from "react";
import { Routes, Route } from "react-router-dom";
import { TodosListOverview } from "./todos-list-overview/TodosListOverview";
import { useOnTodoUpdatedSubscription } from "@/features/todos/hooks/useOnTodoUpdatedSubscription";
import { Login } from "@/features/auth/components/login/Login";
import { Link } from "@/shared/components/link/Link";
import { TodoOverview } from "./todo-overview/TodoOverview";

import styles from "./pages.module.css";

export const RootPage: FC = () => {
  useOnTodoUpdatedSubscription();

  return (
    <div className={styles.pages}>
      <header>
        <div className={styles.navigation}>
          <Link to="/">Home</Link>
        </div>
        <div className={styles.login}>
          <Login />
        </div>
      </header>
      <Routes>
        <Route path="/:todoId" Component={TodoOverview} />
        <Route path="/" Component={TodosListOverview} />
      </Routes>
    </div>
  );
};
