import { ObjectType } from '@nestjs/graphql';
import { Todo } from './todo.model';
import { SubscriptionMessage } from '../../common/pubsub/models/subscription-message.model';
import { TodoSubscriptionType } from './todo-subscription-type.model';

@ObjectType()
export class TodoSubscriptionMessage extends SubscriptionMessage(
  Todo,
  TodoSubscriptionType,
) {}
