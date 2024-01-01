import { Test, TestingModule } from '@nestjs/testing';
import { DataSource } from 'typeorm';
import { TodosService } from './todos.service';
import { Todo } from './models/todo.model';
import { TodosRepository } from './todos.repository';
import { PaginationDto } from 'src/common/modules/pagination/dto/page.dto';
import { PaginationInfo } from 'src/common/modules/pagination/models/page-info.model';
import { SortOrder } from 'src/common/modules/pagination/const';
import { PubSubService } from 'src/common/modules/pubsub/pubsub.service';
import { PubSub } from 'src/common/modules/pubsub/pubsub';

describe('TodosService', () => {
  let service: TodosService;
  let repository: TodosRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TodosService,
        TodosRepository,
        PubSubService,
        {
          provide: DataSource,
          useValue: { createEntityManager: jest.fn() },
        },
        {
          provide: 'PUB_SUB',
          useValue: new PubSub(),
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
      owner: {
        username: 'test-user',
        id: 'test-user',
        createdAt: new Date(),
        updatedAt: new Date(),
        todos: [],
      },
    };
    const sndTodo: Todo = {
      id: 'test-id-2',
      title: 'Test Todo title 2',
      completed: false,
      updatedAt: new Date(),
      createdAt: new Date(),
      parent: undefined,
      todos: [],
      owner: {
        username: 'test-user',
        id: 'test-user',
        createdAt: new Date(),
        updatedAt: new Date(),
        todos: [],
      },
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
      await service.findAll(undefined, pageData, undefined);
      expect(repository.findAndCountTodos).toHaveBeenCalledTimes(1);
    });

    it('should pass options with parent id', async () => {
      const testId = 'test-id';
      jest
        .spyOn(repository, 'findAndCountTodos')
        .mockReturnValueOnce(Promise.resolve([[], 0]));
      await service.findAll(testId, pageData, undefined);

      expect(repository.findAndCountTodos).toHaveBeenCalledWith(
        expect.objectContaining({ parentId: testId }),
      );
    });

    it('should pass undefined find option with empty parent id', async () => {
      jest
        .spyOn(repository, 'findAndCountTodos')
        .mockReturnValueOnce(Promise.resolve([[], 0]));
      await service.findAll(undefined, pageData, undefined);

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
      await service.findAll(undefined, pageData, undefined);

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
      const result = await service.findAll(undefined, pageData, undefined);
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
    const todo: Todo = {
      id: 'test-id',
      title: 'Test Todo title',
      completed: false,
      updatedAt: new Date(),
      createdAt: new Date(),
      parent: undefined,
      todos: [],
      owner: {
        username: 'test-user',
        id: 'test-user',
        createdAt: new Date(),
        updatedAt: new Date(),
        todos: [],
      },
    };

    it('should call todoRepository delete', async () => {
      const testId = todo.id;
      jest
        .spyOn(repository, 'deleteTodo')
        .mockReturnValueOnce(Promise.resolve(todo));
      await service.delete(testId);
      expect(repository.deleteTodo).toHaveBeenCalledWith(
        expect.objectContaining({ id: testId }),
      );
    });

    it('should return true on successful deletion', async () => {
      const testId = todo.id;
      jest
        .spyOn(repository, 'deleteTodo')
        .mockReturnValueOnce(Promise.resolve(todo));
      const result = await service.delete(testId);
      expect(result).toBe(true);
    });

    it('should return false on failed deletion', async () => {
      const testId = 'does-not-exist-todo-id';
      jest
        .spyOn(repository, 'deleteTodo')
        .mockReturnValueOnce(Promise.resolve(undefined));
      const result = await service.delete(testId);
      expect(result).toBe(false);
    });
  });
});
