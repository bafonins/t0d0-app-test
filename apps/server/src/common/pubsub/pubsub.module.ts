import { Module } from '@nestjs/common';
import { PubSub } from 'graphql-subscriptions';
import { PubSubService } from './pubsub.service';

@Module({
  providers: [
    PubSubService,
    {
      provide: 'PUB_SUB',
      useValue: new PubSub(),
    },
  ],
  exports: [PubSubService],
})
export class PubSubModule {}
