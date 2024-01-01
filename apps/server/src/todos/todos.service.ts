import { BadRequestException, Injectable } from '@nestjs/common';
import { Todo } from './models/todo.model';
import { UpdateTodoInput } from './inputs/update-todo.input';
import { CreateTodoInput } from './inputs/create-todo.input';
import { TodoList } from './models/todo-list.model';
import { PaginationDto } from '../common/modules/pagination/dto/page.dto';
import { TodosRepository } from './todos.repository';
import { PubSubService } from '../common/modules/pubsub/pubsub.service';
import { TodoSubscriptionMessage } from './models/todo-subscription.model';
import { TodoSubscriptionType } from './models/todo-subscription-type.model';
import { FieldMaskDto } from '../common/modules/fieldMask/dto/fieldMask.dto';
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

  async findOneByOwnerId(
    todoId: string,
    ownerId: string,
  ): Promise<Todo | undefined> {
    const todo = await this.todosRepository.findOneTodo({
      todoId: todoId,
      selectOptions: [],
      relations: {
        owner: ['owner.id'],
      },
    });

    return todo.owner.id === ownerId ? todo : undefined;
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

  async create(ownerId: string, data: CreateTodoInput): Promise<Todo> {
    if (data.parent?.id) {
      const rootParent = await this.todosRepository.findTodoRootParent(
        data.parent.id,
      );
      if (rootParent.frozen) {
        throw new BadRequestException(
          'Cannot add a new task under frozen parent',
        );
      }
    }

    const created = await this.todosRepository.createTodo({
      title: data.title,
      ownerId: ownerId,
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
    const rootParent = await this.todosRepository.findTodoRootParent(id);

    if (id === rootParent?.id) {
      if (rootParent.frozen && data.frozen === undefined) {
        throw new BadRequestException('Cannot update frozen task');
      }
    } else {
      if (data.frozen) {
        throw new BadRequestException('Only top-level task can be frozen');
      }
      if (rootParent.frozen) {
        throw new BadRequestException('Cannot update task with frozen parent');
      }
    }

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
    const rootParent = await this.todosRepository.findTodoRootParent(id);
    if (rootParent?.frozen) {
      throw new BadRequestException('Cannot delete todo under frozen task');
    }
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
