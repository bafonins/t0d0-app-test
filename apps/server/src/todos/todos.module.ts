import { Module } from '@nestjs/common';
import { TodoResolver } from './todo.resolver';
import { TodosService } from './todos.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Todo } from './models/todo.model';
import { TodosRepository } from './todos.repository';
import { PubSubModule } from '../common/modules/pubsub/pubsub.module';
// import { APP_GUARD } from '@nestjs/core';

@Module({
  imports: [TypeOrmModule.forFeature([Todo]), PubSubModule],
  providers: [
    TodoResolver,
    TodosService,
    TodosRepository,
    // {
    //   provide: APP_GUARD,
    //   useClass: JwtAuthGuard,
    // },
  ],
  exports: [],
})
export class TodosModule {}
