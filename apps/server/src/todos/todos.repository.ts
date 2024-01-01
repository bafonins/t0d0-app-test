import { Injectable } from '@nestjs/common';
import { Repository, IsNull, FindOptionsWhere, EntityManager } from 'typeorm';
import { Todo } from './models/todo.model';
import { TodoFilterType } from './models/todo-filter-type.model';
import { SortOrder } from 'src/common/modules/pagination/const';
import { GET_ROOT_PARENT_TODO_QUERY } from './dal/raw-queries';
import { InjectEntityManager } from '@nestjs/typeorm';

export interface FindAndCountTodosProps {
  readonly parentId: string | undefined;
  readonly order: SortOrder;
  readonly skip: number;
  readonly take: number;
  readonly filter: TodoFilterType;
}

export interface FindOneTodoProps {
  readonly todoId: string;
  readonly selectOptions: string[];
  readonly relations?: Record<string, string[]>;
}

export interface CreateTodoProps {
  readonly title: string;
  readonly parentId?: string;
  readonly ownerId: string;
}

export interface DeleteTodoProps {
  readonly id: string;
}

export interface UpdateTodoProps {
  id: string;
  title?: string;
  completed?: boolean;
  frozen?: boolean;
  parent?: { id: string };
}

@Injectable()
export class TodosRepository extends Repository<Todo> {
  constructor(
    @InjectEntityManager() private readonly entityManager: EntityManager,
  ) {
    super(Todo, entityManager);
  }

  async findAndCountTodos(
    props: FindAndCountTodosProps,
  ): Promise<[Todo[], number]> {
    const { parentId, order, skip, take, filter } = props;

    const whereCondition: FindOptionsWhere<Todo> = {
      parent: { id: parentId || IsNull() },
    };

    const queryBuilder = this.createQueryBuilder('todos');
    if (filter === TodoFilterType.COMPLETED) {
      whereCondition.completed = true;
    } else if (filter === TodoFilterType.ACTIVE) {
      whereCondition.completed = false;
    }

    queryBuilder
      .where(whereCondition)
      .orderBy('todos.createdAt', order)
      .skip(skip)
      .take(take);

    return queryBuilder.getManyAndCount();
  }

  async findOneTodo(props: FindOneTodoProps): Promise<Todo> {
    const { todoId, selectOptions, relations = {} } = props;

    const whereCondition: FindOptionsWhere<Todo> = {
      id: todoId,
    };

    const queryBuilder = this.createQueryBuilder('todo');
    if (selectOptions.length > 0) {
      queryBuilder.select(selectOptions);
    }

    Object.keys(relations).forEach((relationName) => {
      if (relations[relationName].length > 0) {
        queryBuilder
          .leftJoinAndSelect(`todo.${relationName}`, relationName)
          .addSelect(relations[relationName]);
      }
    });

    return queryBuilder.where(whereCondition).getOne();
  }

  async findTodoRootParent(id: string): Promise<Todo | undefined> {
    const result = await this.entityManager.query(GET_ROOT_PARENT_TODO_QUERY, [
      id,
    ]);
    return result ? result[0] : undefined;
  }

  async createTodo(props: CreateTodoProps): Promise<Todo> {
    const todo = await this.save(
      this.create({
        title: props.title,
        parent: { id: props.parentId },
        owner: { id: props.ownerId },
      }),
    );

    return todo;
  }

  async updateTodo(props: UpdateTodoProps): Promise<Todo | undefined> {
    const { id, ...todoDiff } = props;

    const todo = await this.findOne({
      where: { id: id },
    });
    if (todo) {
      Object.assign(todo, todoDiff);
      return this.save(todo);
    }

    return undefined;
  }

  async deleteTodo(props: DeleteTodoProps): Promise<Todo | undefined> {
    const todo = await this.find({ where: { id: props.id } });
    const result = await this.remove(todo);

    const deletedTodo = result[0];
    if (deletedTodo) {
      deletedTodo.id = props.id;
      return deletedTodo;
    }

    return undefined;
  }
}
