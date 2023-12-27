import { Injectable, Inject } from '@nestjs/common';
import { PubSub } from './pubsub';
import { ISubscriptionMessageType } from './models/subscription-message.model';

@Injectable()
export class PubSubService {
  constructor(@Inject('PUB_SUB') private readonly pubSub: PubSub) {}

  publish<T extends ISubscriptionMessageType<unknown, Record<string, string>>>(
    trigger: string,
    message: T,
  ) {
    return this.pubSub.publish(trigger, { [trigger]: message });
  }

  subscribe(trigger: string) {
    return this.pubSub.asyncIterator(trigger);
  }
}
