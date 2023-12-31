import {
  Args,
  Info,
  Mutation,
  Parent,
  Query,
  ResolveField,
  Resolver,
  Subscription,
} from '@nestjs/graphql';
import { Todo } from './models/todo.model';
import { TodosService } from './todos.service';
import { CreateTodoInput } from './inputs/create-todo.input';
import { UpdateTodoInput } from './inputs/update-todo.input';
import { TodoList } from './models/todo-list.model';
import { PaginationInput } from '../common/modules/pagination/inputs/page.input';
import { PaginationDto } from '../common/modules/pagination/dto/page.dto';
import { PubSubService } from '../common/modules/pubsub/pubsub.service';
import { TodoSubscriptionMessage } from './models/todo-subscription.model';
import { GraphQLResolveInfo } from 'graphql';
import { FieldMaskDto } from 'src/common/modules/fieldMask/dto/fieldMask.dto';
import { TodoFilterType } from './models/todo-filter-type.model';
import { UseGuards } from '@nestjs/common';
import { GraphqlJwtAuthGuard } from 'src/common/guards/graphql-jwt-auth.guard';

@Resolver(() => Todo)
export class TodoResolver {
  constructor(
    private readonly todosService: TodosService,
    private readonly pubSubService: PubSubService,
  ) {}

  @Query(() => TodoList)
  async todos(
    @Args({ name: 'parentId', nullable: true, type: () => String })
    parentId: string | undefined,
    @Args('pageData')
    pageData: PaginationInput,
    @Args('filter', {
      nullable: true,
      defaultValue: TodoFilterType.ALL,
      type: () => TodoFilterType,
    })
    filter: TodoFilterType,
  ): Promise<TodoList> {
    return this.todosService.findAll(
      parentId,
      PaginationDto.fromInput(pageData),
      filter,
    );
  }

  @Query(() => Todo)
  async todo(
    @Args({ name: 'id', type: () => String }) id: string,
    @Info() info: GraphQLResolveInfo,
  ): Promise<Todo | undefined> {
    return this.todosService.findOne(
      id,
      FieldMaskDto.fromGqlInfo(info, ['parent', 'todos']),
    );
  }

  @ResolveField('todos', () => TodoList)
  async children(
    @Parent() todo: Todo,
    @Args('pageData')
    pageData: PaginationInput,
  ): Promise<TodoList> {
    return this.todosService.findAll(
      todo.id,
      PaginationDto.fromInput(pageData),
      TodoFilterType.ALL,
    );
  }

  @ResolveField('parent', () => Todo)
  async parent(
    @Parent() childTodo: Todo,
    @Info() info: GraphQLResolveInfo,
  ): Promise<Todo | undefined> {
    return this.todosService.findOneByChildId(
      childTodo.id,
      FieldMaskDto.fromGqlInfo(info, ['parent', 'todos']),
    );
  }

  @UseGuards(GraphqlJwtAuthGuard)
  @Mutation(() => Todo)
  async addTodo(
    @Args('createTodoData') createTodoData: CreateTodoInput,
  ): Promise<Todo> {
    return this.todosService.create(createTodoData);
  }

  @UseGuards(GraphqlJwtAuthGuard)
  @Mutation(() => Boolean)
  async deleteTodo(@Args('id') id: string): Promise<boolean> {
    return this.todosService.delete(id);
  }

  @UseGuards(GraphqlJwtAuthGuard)
  @Mutation(() => Todo)
  async updateTodo(
    @Args('id') id: string,
    @Args('updateTodoData') updateTodoData: UpdateTodoInput,
  ): Promise<Todo | undefined> {
    return this.todosService.update(id, updateTodoData);
  }

  @Subscription(() => TodoSubscriptionMessage, {
    name: TodosService.todoSubscriptionUpdate,
  })
  subscribeTodoUpdate() {
    return this.pubSubService.subscribe(TodosService.todoSubscriptionUpdate);
  }
}
