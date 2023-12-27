import {
  useOnTodoUpdatedSubscription as useGeneratedOnTodoUpdatedSubscription,
  TodoSubscriptionType,
} from "@gql/gql-generated";

export const useOnTodoUpdatedSubscription = () => {
  useGeneratedOnTodoUpdatedSubscription({
    onData: ({ client, data }) => {
      const messageType = data.data?.todoSubscriptionUpdate.type;
      const messageData = data.data?.todoSubscriptionUpdate.data;

      if (!messageData) {
        return;
      }

      switch (messageType) {
        case TodoSubscriptionType.TodoUpdated:
          client.cache.modify({
            id: client.cache.identify(messageData),
            fields: {
              title() {
                return messageData.title;
              },
              completed() {
                return messageData.completed;
              },
              parent(existingParent) {
                return messageData.parent?.id || existingParent?.id;
              },
            },
          });
          break;
        case TodoSubscriptionType.TodoDeleted:
          client.cache.evict({ id: client.cache.identify(messageData) });
          client.cache.gc();
          break;
        case TodoSubscriptionType.TodoCreated:
          // TODO: Implement adding todo
          break;
      }
    },
  });
};
