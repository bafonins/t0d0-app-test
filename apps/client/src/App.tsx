import "./App.css";
import { TodoList } from "@/features/todos/components/TodoList";
import { useOnTodoUpdatedSubscription } from "@/features/todos/hooks/useOnTodoUpdatedSubscription";

function App() {
  useOnTodoUpdatedSubscription();

  return <TodoList />;
}

export default App;
