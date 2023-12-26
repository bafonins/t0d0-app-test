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
import { CreateTodoInput } from './inputs/create-todo.input';
import { UpdateTodoInput } from './inputs/update-todo.input';
import { TodoList } from './models/todo-list.model';
import { PaginationInput } from '../common/pagination/inputs/page.input';
import { PaginationDto } from '../common/pagination/dto/page.dto';

@Resolver(() => Todo)
export class TodoResolver {
  constructor(private readonly todosService: TodosService) {}

  @Query(() => TodoList)
  async todos(
    @Args({ name: 'parentId', nullable: true, type: () => String })
    parentId: string | undefined,
    @Args('pageData')
    pageData: PaginationInput,
  ): Promise<TodoList> {
    return this.todosService.findAll(
      parentId,
      PaginationDto.fromInput(pageData),
    );
  }

  @ResolveField('parent', () => Todo)
  async parent(@Parent() childTodo: Todo): Promise<Todo | undefined> {
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
