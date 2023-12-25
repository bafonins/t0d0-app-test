import { Field, ObjectType } from '@nestjs/graphql';
import { Todo } from './todo.model';
import { PaginationInfo } from '../../common/pagination/models/page-info.model';

@ObjectType()
export class TodoList {
  @Field(() => [Todo], { defaultValue: [] })
  list?: Todo[];

  @Field(() => PaginationInfo)
  page: PaginationInfo;
}
