import { GqlClient, GqlInMemoryCache } from "@/shared/api/graphql/types";

export const createGqlClient = (uri: string) => {
  const client = new GqlClient({
    uri: uri,
    cache: new GqlInMemoryCache(),
  });

  return client;
};
