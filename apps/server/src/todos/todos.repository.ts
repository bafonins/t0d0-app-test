import { Injectable } from '@nestjs/common';
import { Repository, IsNull, FindOptionsWhere, DataSource } from 'typeorm';
import { Todo } from './models/todo.model';
import { SortOrder } from '../common/modules/pagination/const';
import { TodoFilterType } from './models/todo-filter-type.model';

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
}

export interface DeleteTodoProps {
  readonly id: string;
}

export interface UpdateTodoProps {
  id: string;
  title?: string;
  completed?: boolean;
  parent?: { id: string };
}

@Injectable()
export class TodosRepository extends Repository<Todo> {
  constructor(dataSource: DataSource) {
    super(Todo, dataSource.createEntityManager());
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

  async createTodo(props: CreateTodoProps): Promise<Todo> {
    const todo = await this.save(
      this.create({
        title: props.title,
        parent: { id: props.parentId },
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
