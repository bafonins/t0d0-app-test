import { createClient } from "graphql-ws";
import {
  GqlClient,
  GqlInMemoryCache,
  GqlHttpLink,
  GqlWsLink,
  GqlLink,
} from "@/shared/api/graphql/types";
import { StrictTypedTypePolicies } from "@gql/gql-generated";
import { split, getMainDefinition } from "@/shared/api/graphql/utils";
import { getToken } from "@/shared/storage";
const typePolicies: StrictTypedTypePolicies = {
  Todo: {
    keyFields: ["id"],
  },
  User: {
    keyFields: ["id"],
  },
};

export const createGqlClient = (httpUri: string, wsUri: string) => {
  const httpLink = new GqlHttpLink({
    uri: httpUri,
  });

  const wsLink = new GqlWsLink(
    createClient({
      url: wsUri,
    })
  );

  const authMiddleware = new GqlLink((operation, forward) => {
    const authToken = getToken();
    operation.setContext({
      headers: {
        authorization: authToken ? `Bearer ${authToken}` : null,
      },
    });

    return forward(operation);
  });

  const splitLink = split(
    ({ query }) => {
      const definition = getMainDefinition(query);
      return (
        definition.kind === "OperationDefinition" &&
        definition.operation === "subscription"
      );
    },
    wsLink,
    authMiddleware.concat(httpLink)
  );

  return new GqlClient({
    link: splitLink,
    cache: new GqlInMemoryCache({
      typePolicies: typePolicies,
    }),
  });
};
