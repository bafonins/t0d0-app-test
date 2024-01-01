import { useMeLazyQuery as useGeneratedMeQuery } from "@gql/gql-generated";

export const useMe = () => {
  const [getMe, { loading, error, data }] = useGeneratedMeQuery();

  return {
    getMe,
    me: data?.me,
    loading: loading,
    error: error,
  };
};
