import { useCallback, useEffect } from "react";
import { useSignInMutation, SignInMutationVariables } from "@gql/gql-generated";
import { useMe } from "./useMe";

export const useLoginMutation = () => {
  const [mutateFunction, { data, loading, error: signInError }] =
    useSignInMutation();
  const { getMe, me, error: meError } = useMe();

  const signIn = useCallback(
    async (username: SignInMutationVariables["username"]) => {
      const result = await mutateFunction({
        variables: { username: username },
      });

      return result;
    },
    [mutateFunction]
  );

  useEffect(() => {
    if (!data && !loading) {
      getMe();
    }
  }, [data, getMe, loading]);

  const authUser = data?.signIn;

  return {
    login: signIn,
    user: data?.signIn.user || me,
    token: data?.signIn.token,
    data: authUser,
    loading,
    error: meError || signInError,
  };
};
