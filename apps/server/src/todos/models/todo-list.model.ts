import { ObjectType } from '@nestjs/graphql';
import { Todo } from './todo.model';
import { PaginatedList } from '../../common/pagination/models/paginated-list.model';

@ObjectType()
export class TodoList extends PaginatedList(Todo) {}
