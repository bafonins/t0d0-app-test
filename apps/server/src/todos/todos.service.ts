import { Injectable } from '@nestjs/common';
import { Todo } from './models/todo.model';
import { UpdateTodoInput } from './dto/update-todo.input';
import { CreateTodoInput } from './dto/create-todo.input';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class TodosService {
  constructor(
    @InjectRepository(Todo)
    private readonly todoRepository: Repository<Todo>,
  ) {}

  async findAll(): Promise<Todo[]> {
    return this.todoRepository.find();
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
