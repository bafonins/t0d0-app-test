import { createContext } from "react";
import { SignInMutation } from "@gql/gql-generated";
import { ApolloError, FetchResult } from "@apollo/client";

export interface Context {
  user?: SignInMutation["signIn"]["user"];
  token?: SignInMutation["signIn"]["token"];
  loading: boolean;
  error?: ApolloError;
  login: (username: string) => Promise<FetchResult<SignInMutation>>;
  logout: () => void;
}

const loginNoop = () => Promise.resolve({} as FetchResult<SignInMutation>);
const logoutNoop = () => {};

const defaultContext: Context = {
  loading: false,
  login: loginNoop,
  logout: logoutNoop,
};

export const AuthContext = createContext(defaultContext);
