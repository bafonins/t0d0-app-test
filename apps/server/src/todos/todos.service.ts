import { Injectable } from '@nestjs/common';
import { Todo } from './models/todo.model';
import { UpdateTodoInput } from './inputs/update-todo.input';
import { CreateTodoInput } from './inputs/create-todo.input';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, IsNull, FindOptionsWhere } from 'typeorm';
import { TodoList } from './models/todo-list.model';
import { PaginationInput } from '../common/pagination/inputs/page.input';

@Injectable()
export class TodosService {
  constructor(
    @InjectRepository(Todo)
    private readonly todoRepository: Repository<Todo>,
  ) {}

  async findAll(
    parentId: string | undefined,
    pageData: PaginationInput,
  ): Promise<TodoList> {
    const findCondition: FindOptionsWhere<Todo> = {
      parent: { id: parentId || IsNull() },
    };

    const [list, count] = await this.todoRepository.findAndCount({
      where: findCondition,
      order: {
        updatedAt: 'DESC',
      },
      skip: pageData.page * pageData.take,
      take: pageData.take,
    });

    const result: TodoList = {
      list: list,
      page: {
        totalCount: count,
        pageSize: pageData.take,
        page: pageData.page + 1,
      },
    };
    return result;
  }

  async findParent(todoId: string): Promise<Todo | undefined> {
    const todo = await this.todoRepository.findOne({
      where: { id: todoId },
      relations: ['parent'],
    });

    return todo ? todo.parent : undefined;
  }

  async findChildren(todoId: string): Promise<Todo[]> {
    const todo = await this.todoRepository.findOne({
      where: { id: todoId },
      relations: ['children'],
    });

    return todo ? todo.children : [];
  }

  async create(data: CreateTodoInput): Promise<Todo> {
    const todo = await this.todoRepository.save(
      this.todoRepository.create(data),
    );

    return todo;
  }

  async update(id: string, data: UpdateTodoInput): Promise<Todo> {
    return this.todoRepository.save({
      id: id,
      ...data,
    });
  }

  async delete(id: string): Promise<boolean> {
    const result = await this.todoRepository.delete(id);
    return (result.affected || 0) >= 1;
  }
}
