import { Injectable } from '@nestjs/common';
import { Todo } from './models/todo.model';
import { UpdateTodoInput } from './inputs/update-todo.input';
import { CreateTodoInput } from './inputs/create-todo.input';
import { TodoList } from './models/todo-list.model';
import { PaginationDto } from '../common/pagination/dto/page.dto';
import { TodosRepository } from './todos.repository';
import { PubSubService } from '../common/pubsub/pubsub.service';
import { TodoSubscriptionMessage } from './models/todo-subscription.model';
import { TodoSubscriptionType } from './models/todo-subscription-type.model';
import { FieldMaskDto } from '../common/fieldMask/dto/fieldMask.dto';
import { TodoFilterType } from './models/todo-filter-type.model';

@Injectable()
export class TodosService {
  constructor(
    private readonly todosRepository: TodosRepository,
    private readonly pubSubService: PubSubService,
  ) {}

  static todoSubscriptionUpdate: string = 'todoSubscriptionUpdate';

  async findAll(
    parentId: string | undefined,
    pageData: PaginationDto,
    filter: TodoFilterType,
  ): Promise<TodoList> {
    const [entities, itemCount] = await this.todosRepository.findAndCountTodos({
      parentId: parentId,
      order: pageData.order,
      skip: pageData.skip,
      take: pageData.take,
      filter: filter,
    });

    const pageCount = Math.ceil(itemCount / pageData.take);
    const result: TodoList = {
      list: entities,
      page: {
        itemCount: itemCount,
        pageCount: pageCount,
        pageSize: pageData.take,
        page: pageData.page,
        hasPreviousPage: pageData.page > 1,
        hasNextPage: pageData.page < pageCount,
      },
    };
    return result;
  }

  async findOne(
    todoId: string,
    fieldMask: FieldMaskDto,
  ): Promise<Todo | undefined> {
    return this.todosRepository.findOneTodo({
      todoId: todoId,
      selectOptions: fieldMask.fields,
    });
  }

  async findOneByChildId(
    childId: string,
    parentFieldMask: FieldMaskDto,
  ): Promise<Todo | undefined> {
    return this.todosRepository.findOneTodo({
      todoId: childId,
      selectOptions: [],
      relations: {
        parent: parentFieldMask.fields,
      },
    });
  }

  async findParent(todoId: string): Promise<Todo | undefined> {
    const todo = await this.todosRepository.findOne({
      where: { id: todoId },
      relations: ['parent'],
    });

    return todo ? todo.parent : undefined;
  }

  async create(data: CreateTodoInput): Promise<Todo> {
    const created = await this.todosRepository.createTodo({
      title: data.title,
      parentId: data.parent?.id,
    });
    await this.pubSubService.publish<TodoSubscriptionMessage>(
      TodosService.todoSubscriptionUpdate,
      {
        type: TodoSubscriptionType.TODO_CREATED,
        data: created,
      },
    );

    return created;
  }

  async update(id: string, data: UpdateTodoInput): Promise<Todo | undefined> {
    const updated = await this.todosRepository.updateTodo({
      id: id,
      ...data,
    });
    if (updated) {
      await this.pubSubService.publish<TodoSubscriptionMessage>(
        TodosService.todoSubscriptionUpdate,
        {
          type: TodoSubscriptionType.TODO_UPDATED,
          data: updated,
        },
      );

      return updated;
    }

    return undefined;
  }

  async delete(id: string): Promise<boolean> {
    const deletedTodo = await this.todosRepository.deleteTodo({ id: id });
    if (deletedTodo) {
      await this.pubSubService.publish<TodoSubscriptionMessage>(
        TodosService.todoSubscriptionUpdate,
        {
          type: TodoSubscriptionType.TODO_DELETED,
          data: deletedTodo,
        },
      );
      return true;
    } else {
      return false;
    }
  }
}
