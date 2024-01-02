import { ReactNode, FC, useCallback } from "react";
import { useApolloClient } from "@apollo/client";
import { saveToken, clearToken } from "@/shared/storage";
import { useLoginMutation } from "../hooks/useLogin";
import { AuthContext, Context } from "../contexts/auth-context";

interface AuthProviderProps {
  readonly children: ReactNode;
}

export const AuthProvider: FC<AuthProviderProps> = ({ children }) => {
  const client = useApolloClient();

  const {
    login: loginMutation,
    user,
    token,
    loading,
    error,
  } = useLoginMutation();

  const login = useCallback(
    async (username: string) => {
      const result = await loginMutation(username);
      if (result.data?.signIn.token) {
        saveToken(result.data.signIn.token);
      }
      return result;
    },
    [loginMutation]
  );
  const logout = useCallback(() => {
    clearToken();
    client.clearStore();
    location.reload();
  }, [client]);

  const context: Context = {
    user: user,
    token: token,
    loading: loading,
    error: error,
    login: login,
    logout: logout,
  };
  return (
    <AuthContext.Provider value={context}>{children}</AuthContext.Provider>
  );
};
