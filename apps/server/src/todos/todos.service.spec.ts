import { Test, TestingModule } from '@nestjs/testing';
import { TodosService } from './todos.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Todo } from './models/todo.model';
import { DeleteResult, Repository, IsNull } from 'typeorm';

describe('TodosService', () => {
  const todoRepositoryToken: ReturnType<typeof getRepositoryToken> =
    getRepositoryToken(Todo);

  let service: TodosService;
  let repository: Repository<Todo>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TodosService,
        { provide: todoRepositoryToken, useClass: Repository },
      ],
    }).compile();

    service = module.get<TodosService>(TodosService);
    repository = module.get<Repository<Todo>>(todoRepositoryToken);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findAll', () => {
    const fstTodo: Todo = {
      id: 'test-id',
      title: 'Test Todo title',
      completed: false,
      updatedAt: new Date(),
      createdAt: new Date(),
      children: [],
      parent: undefined,
    };
    const sndTodo: Todo = {
      id: 'test-id-2',
      title: 'Test Todo title 2',
      completed: false,
      updatedAt: new Date(),
      createdAt: new Date(),
      children: [],
      parent: undefined,
    };
    const testTodos = [fstTodo, sndTodo];

    it('should call todoRepository find method', async () => {
      jest
        .spyOn(repository, 'find')
        .mockReturnValueOnce(Promise.resolve(testTodos));
      await service.findAll();
      expect(repository.find).toHaveBeenCalledTimes(1);
    });

    it('should pass find options with parent id', async () => {
      const testId = 'test-id';
      jest.spyOn(repository, 'find').mockReturnValueOnce(Promise.resolve([]));
      await service.findAll(testId);

      expect(repository.find).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { parent: { id: testId } },
        }),
      );
    });

    it('should pass null find option with empty parent id', async () => {
      jest.spyOn(repository, 'find').mockReturnValueOnce(Promise.resolve([]));
      await service.findAll();

      expect(repository.find).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { parent: { id: IsNull() } },
        }),
      );
    });

    it('should return todos', async () => {
      jest
        .spyOn(repository, 'find')
        .mockReturnValueOnce(Promise.resolve(testTodos));
      const result = await service.findAll();
      expect(result).toHaveLength(2);
      expect(result).toEqual(expect.arrayContaining(testTodos));
    });
  });

  describe('delete', () => {
    const success: DeleteResult = {
      affected: 1,
      raw: [],
    };
    const failure: DeleteResult = {
      affected: 0,
      raw: [],
    };

    it('should call todoRepository delete', async () => {
      const testId = 'test-id';
      jest
        .spyOn(repository, 'delete')
        .mockReturnValueOnce(Promise.resolve(success));
      await service.delete(testId);
      expect(repository.delete).toHaveBeenCalledWith(testId);
    });

    it('should return true on successful deletion', async () => {
      const testId = 'test-id';
      jest
        .spyOn(repository, 'delete')
        .mockReturnValueOnce(Promise.resolve(success));
      const result = await service.delete(testId);
      expect(result).toBe(true);
    });

    it('should return false on successful deletion', async () => {
      const testId = 'test-id';
      jest
        .spyOn(repository, 'delete')
        .mockReturnValueOnce(Promise.resolve(failure));
      const result = await service.delete(testId);
      expect(result).toBe(false);
    });
  });
});
