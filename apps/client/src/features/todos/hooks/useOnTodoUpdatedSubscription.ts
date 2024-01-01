import { NEW_TODO_FRAGMENT } from "@/shared/api/graphql/documents/fragments";
import {
  useOnTodoUpdatedSubscription as useGeneratedOnTodoUpdatedSubscription,
  TodoSubscriptionType,
  Todo,
} from "@gql/gql-generated";

export const useOnTodoUpdatedSubscription = () => {
  return useGeneratedOnTodoUpdatedSubscription({
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
              frozen() {
                return messageData.frozen;
              },
            },
          });
          break;
        case TodoSubscriptionType.TodoDeleted:
          client.cache.modify({
            fields: {
              todos(existing = {}) {
                const list = existing.list || [];

                return {
                  list: list.filter((todo: Todo) => todo.id !== messageData.id),
                };
              },
            },
          });
          client.cache.evict({ id: client.cache.identify(messageData) });
          client.cache.gc();
          break;
        case TodoSubscriptionType.TodoCreated:
          client.cache.modify({
            fields: {
              todos(existing = {}) {
                const newTodoRef = client.cache.writeFragment({
                  data: messageData,
                  fragment: NEW_TODO_FRAGMENT,
                });

                const list = existing.list || [];
                const page = existing.page || {};

                return {
                  list: [newTodoRef, ...list],
                  page: {
                    itemCount: (page.itemCount || 0) + 1,
                  },
                };
              },
            },
          });
          break;
      }
    },
  });
};
