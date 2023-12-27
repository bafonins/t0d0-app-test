import { registerEnumType } from '@nestjs/graphql';

export enum TodoSubscriptionType {
  TODO_CREATED = 'TODO_CREATED',
  TODO_UPDATED = 'TODO_UPDATED',
  TODO_DELETED = 'TODO_DELETED',
}

registerEnumType(TodoSubscriptionType, { name: 'TodoSubscriptionType' });
