import { Injectable } from '@nestjs/common';
import { Repository, IsNull, FindOptionsWhere, DataSource } from 'typeorm';
import { Todo } from './models/todo.model';
import { SortOrder } from '../common/pagination/const';

export interface FindAndCountProps {
  readonly parentId: string | undefined;
  readonly order: SortOrder;
  readonly skip: number;
  readonly take: number;
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

  async findAndCountTodos(props: FindAndCountProps): Promise<[Todo[], number]> {
    const { parentId, order, skip, take } = props;

    const whereCondition: FindOptionsWhere<Todo> = {
      parent: { id: parentId || IsNull() },
    };

    const queryBuilder = this.createQueryBuilder('todos');
    queryBuilder
      .where(whereCondition)
      .orderBy('todos.updatedAt', order)
      .skip(skip)
      .take(take);

    return queryBuilder.getManyAndCount();
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