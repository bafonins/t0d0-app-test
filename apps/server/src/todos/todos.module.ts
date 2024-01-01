import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TodoResolver } from './todo.resolver';
import { TodosService } from './todos.service';
import { Todo } from './models/todo.model';
import { TodosRepository } from './todos.repository';
import { PubSubModule } from 'src/common/modules/pubsub/pubsub.module';

@Module({
  imports: [TypeOrmModule.forFeature([Todo]), PubSubModule],
  providers: [TodoResolver, TodosService, TodosRepository],
  exports: [],
})
export class TodosModule {}
