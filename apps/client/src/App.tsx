import { TodoList } from "@/features/todos/components/todo-list/TodoList";
import { useOnTodoUpdatedSubscription } from "@/features/todos/hooks/useOnTodoUpdatedSubscription";
import styles from "./App.module.css";

function App() {
  useOnTodoUpdatedSubscription();

  return (
    <div className={styles.app}>
      <header>
        <h1 className={styles.heading}>T0D0S</h1>
      </header>
      <TodoList />
    </div>
  );
}

export default App;
