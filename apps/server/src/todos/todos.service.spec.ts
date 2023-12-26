import { Test, TestingModule } from '@nestjs/testing';
import { TodosService } from './todos.service';
import { Todo } from './models/todo.model';
import { DeleteResult, DataSource } from 'typeorm';
import { PaginationDto } from '../common/pagination/dto/page.dto';
import { PaginationInfo } from '../common/pagination/models/page-info.model';
import { SortOrder } from '../common/pagination/const';
import { TodosRepository } from './todos.repository';

describe('TodosService', () => {
  let service: TodosService;
  let repository: TodosRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TodosService,
        TodosRepository,
        {
          provide: DataSource,
          useValue: { createEntityManager: jest.fn() },
        },
      ],
    }).compile();

    service = module.get<TodosService>(TodosService);
    repository = module.get<TodosRepository>(TodosRepository);
  });

  afterEach(() => {
    jest.clearAllMocks();
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
      parent: undefined,
      todos: [],
    };
    const sndTodo: Todo = {
      id: 'test-id-2',
      title: 'Test Todo title 2',
      completed: false,
      updatedAt: new Date(),
      createdAt: new Date(),
      parent: undefined,
      todos: [],
    };
    const pageData: PaginationDto = {
      page: 1,
      take: 10,
      order: SortOrder.DESC,
      skip: 10,
    };
    const testTodos = [fstTodo, sndTodo];
    const testPageInfo: PaginationInfo = {
      page: pageData.page,
      itemCount: testTodos.length,
      pageCount: 1,
      pageSize: pageData.take,
      hasNextPage: false,
      hasPreviousPage: false,
    };

    it('should call todoRepository findAndCount method', async () => {
      jest
        .spyOn(repository, 'findAndCountTodos')
        .mockReturnValueOnce(Promise.resolve([testTodos, testTodos.length]));
      await service.findAll(undefined, pageData);
      expect(repository.findAndCountTodos).toHaveBeenCalledTimes(1);
    });

    it('should pass options with parent id', async () => {
      const testId = 'test-id';
      jest
        .spyOn(repository, 'findAndCountTodos')
        .mockReturnValueOnce(Promise.resolve([[], 0]));
      await service.findAll(testId, pageData);

      expect(repository.findAndCountTodos).toHaveBeenCalledWith(
        expect.objectContaining({ parentId: testId }),
      );
    });

    it('should pass undefined find option with empty parent id', async () => {
      jest
        .spyOn(repository, 'findAndCountTodos')
        .mockReturnValueOnce(Promise.resolve([[], 0]));
      await service.findAll(undefined, pageData);

      expect(repository.findAndCountTodos).toHaveBeenCalledWith(
        expect.objectContaining({
          parentId: undefined,
        }),
      );
    });

    it('should pass page options', async () => {
      jest
        .spyOn(repository, 'findAndCountTodos')
        .mockReturnValueOnce(Promise.resolve([[], 0]));
      await service.findAll(undefined, pageData);

      expect(repository.findAndCountTodos).toHaveBeenCalledWith(
        expect.objectContaining({
          skip: pageData.skip,
          take: pageData.take,
          order: pageData.order,
        }),
      );
    });

    it('should return todos', async () => {
      jest
        .spyOn(repository, 'findAndCountTodos')
        .mockReturnValueOnce(Promise.resolve([testTodos, 2]));
      const result = await service.findAll(undefined, pageData);
      expect(result.list).toHaveLength(2);
      expect(result).toEqual(
        expect.objectContaining({
          list: testTodos,
          page: testPageInfo,
        }),
      );
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
