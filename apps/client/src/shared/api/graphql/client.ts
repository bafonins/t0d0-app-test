import { createClient } from "graphql-ws";
import {
  GqlClient,
  GqlInMemoryCache,
  GqlHttpLink,
  GqlWsLink,
  GqlLink,
} from "@/shared/api/graphql/types";
import {
  split,
  getMainDefinition,
  onErrorLink,
} from "@/shared/api/graphql/utils";
import { getToken } from "@/shared/storage";
import { StrictTypedTypePolicies } from "@gql/gql-generated";
import { notification } from "@/shared/components/notification";

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
    uri: httpUri || `${location.protocol}//${location.host}/graphql`,
  });

  const wsLink = new GqlWsLink(
    createClient({
      url:
        wsUri ||
        `${import.meta.env.PROD ? "wss" : "ws"}://${location.host}/graphql`,
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

  const errorMiddleware = onErrorLink(({ graphQLErrors, networkError }) => {
    if (graphQLErrors)
      graphQLErrors.forEach(({ message }) => {
        notification.error(`Error: ${message}`);
      });

    if (networkError) {
      notification.error(`Network error: ${networkError.message}`);
    }
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
    GqlLink.from([authMiddleware, errorMiddleware, httpLink])
  );

  return new GqlClient({
    link: splitLink,
    cache: new GqlInMemoryCache({
      typePolicies: typePolicies,
    }),
  });
};
