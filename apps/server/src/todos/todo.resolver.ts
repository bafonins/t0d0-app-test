import {
  Args,
  Mutation,
  Parent,
  Query,
  ResolveField,
  Resolver,
} from '@nestjs/graphql';
import { Todo } from './models/todo.model';
import { TodosService } from './todos.service';
import { CreateTodoInput } from './dto/create-todo.input';
import { UpdateTodoInput } from './dto/update-todo.input';

@Resolver(() => Todo)
export class TodoResolver {
  constructor(private readonly todosService: TodosService) {}

  @Query(() => [Todo])
  async getTodos(): Promise<Todo[]> {
    return this.todosService.findAll();
  }

  @ResolveField('parent', () => Todo)
  async parent(@Parent() childTodo: Todo): Promise<Todo> {
    return this.todosService.findParent(childTodo.id);
  }

  @ResolveField('children', () => [Todo])
  async children(@Parent() parentTodo: Todo): Promise<Todo[]> {
    return this.todosService.findChildren(parentTodo.id);
  }

  @Mutation(() => Todo)
  async addTodo(
    @Args('createTodoData') createTodoData: CreateTodoInput,
  ): Promise<Todo> {
    return this.todosService.create(createTodoData);
  }

  @Mutation(() => Todo)
  async updateTodo(
    @Args('id') id: string,
    @Args('updateTodoData') updateTodoData: UpdateTodoInput,
  ): Promise<Todo> {
    return this.todosService.update(id, updateTodoData);
  }
}
