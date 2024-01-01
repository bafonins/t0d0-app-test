import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { TodosService } from '../todos.service';
import { FieldMaskDto } from 'src/common/modules/fieldMask/dto/fieldMask.dto';
import { Todo } from '../models/todo.model';

@Injectable()
export class TodoOwnerGuard implements CanActivate {
  constructor(private todosService: TodosService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const ctx = GqlExecutionContext.create(context);
    const { req } = ctx.getContext();
    const user = req.user;
    const args = ctx.getArgs();
    const todoId = args.id;

    if (!user || !todoId) {
      return false;
    }

    const fieldMaskDto = FieldMaskDto.fromEntity<Todo>(
      args.updateTodoData,
      ['parent', 'todos', 'owner'],
      'todo',
    );

    if (fieldMaskDto.hasField<Todo>('frozen')) {
      const todo = await this.todosService.findOneByOwnerId(todoId, user.id);
      if (!todo) {
        return false;
      }
    }

    return true;
  }
}
