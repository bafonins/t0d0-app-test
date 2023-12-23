import { Module } from '@nestjs/common';
import { TodoResolver } from './todo.resolver';
import { TodosService } from './todos.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Todo } from './models/todo.model';

@Module({
  imports: [TypeOrmModule.forFeature([Todo])],
  providers: [TodoResolver, TodosService],
  exports: [],
})
export class TodosModule {}
