import { useCallback } from "react";
import { useSignInMutation, SignInMutationVariables } from "@gql/gql-generated";

export const useLoginMutation = () => {
  const [mutateFunction, { data, loading, error }] = useSignInMutation();

  const signIn = useCallback(
    async (username: SignInMutationVariables["username"]) => {
      const result = await mutateFunction({
        variables: { username: username },
      });

      return result;
    },
    [mutateFunction]
  );

  const authUser = data?.signIn;

  return {
    login: signIn,
    data: authUser,
    loading,
    error,
  };
};
