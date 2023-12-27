import { Field, ObjectType } from '@nestjs/graphql';
import { Type } from '@nestjs/common';

export interface ISubscriptionMessageType<T, E> {
  readonly data?: T;
  readonly type: keyof E;
}

export function SubscriptionMessage<T, E extends Record<string, string>>(
  classRef: Type<T>,
  subscriptionEnumRef: E,
): Type<ISubscriptionMessageType<T, E>> {
  @ObjectType({ isAbstract: true })
  abstract class SubscriptionMessageType
    implements ISubscriptionMessageType<T, E>
  {
    @Field(() => subscriptionEnumRef)
    type: keyof E;

    @Field(() => classRef, { nullable: true })
    data?: T;
  }

  return SubscriptionMessageType as Type<ISubscriptionMessageType<T, E>>;
}
