import { Injectable } from '@nestjs/common';
import { Todo } from './models/todo.model';
import { UpdateTodoInput } from './inputs/update-todo.input';
import { CreateTodoInput } from './inputs/create-todo.input';
import { TodoList } from './models/todo-list.model';
import { PaginationInput } from '../common/pagination/inputs/page.input';
import { PaginationDto } from '../common/pagination/dto/page.dto';
import { TodosRepository } from './todos.repository';

@Injectable()
export class TodosService {
  constructor(private readonly todosRepository: TodosRepository) {}

  async findAll(
    parentId: string | undefined,
    pageData: PaginationDto,
  ): Promise<TodoList> {
    const [entities, itemCount] = await this.todosRepository.findAndCountTodos({
      parentId: parentId,
      order: pageData.order,
      skip: pageData.skip,
      take: pageData.take,
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

  async findParent(todoId: string): Promise<Todo | undefined> {
    const todo = await this.todosRepository.findOne({
      where: { id: todoId },
      relations: ['parent'],
    });

    return todo ? todo.parent : undefined;
  }

  async findChildren(todoId: string): Promise<Todo[]> {
    const todo = await this.todosRepository.findOne({
      where: { id: todoId },
      relations: ['children'],
    });

    return todo ? todo.children : [];
  }

  async create(data: CreateTodoInput): Promise<Todo> {
    return this.todosRepository.createTodo({
      title: data.title,
      parentId: data.parent.id,
    });
  }

  async update(id: string, data: UpdateTodoInput): Promise<Todo> {
    return this.todosRepository.save({
      id: id,
      ...data,
    });
  }

  async delete(id: string): Promise<boolean> {
    return this.todosRepository.deleteTodo({ id: id });
  }
}
