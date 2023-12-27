import { createClient } from "graphql-ws";
import {
  GqlClient,
  GqlInMemoryCache,
  GqlHttpLink,
  GqlWsLink,
} from "@/shared/api/graphql/types";
import { StrictTypedTypePolicies } from "@gql/gql-generated";
import { split, getMainDefinition } from "@/shared/api/graphql/utils";

const typePolicies: StrictTypedTypePolicies = {
  Todo: {
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

  const splitLink = split(
    ({ query }) => {
      const definition = getMainDefinition(query);
      return (
        definition.kind === "OperationDefinition" &&
        definition.operation === "subscription"
      );
    },
    wsLink,
    httpLink
  );

  return new GqlClient({
    link: splitLink,
    cache: new GqlInMemoryCache({
      typePolicies: typePolicies,
    }),
  });
};
