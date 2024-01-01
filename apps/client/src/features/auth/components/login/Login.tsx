import { FC } from "react";
import { useAuthContext } from "../../hooks/useAuthContext";
import { LoginForm } from "@/shared/components/loginForm/LoginForm";
import { LogoutForm } from "@/shared/components/logoutForm/LogoutForm";

export const Login: FC = () => {
  const { login, logout, user } = useAuthContext();

  return user ? (
    <LogoutForm username={user.username} onSubmit={logout} />
  ) : (
    <LoginForm onSubmit={login} />
  );
};
