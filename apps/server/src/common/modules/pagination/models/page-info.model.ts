import { Field, ObjectType, Int } from '@nestjs/graphql';

@ObjectType()
export class PaginationInfo {
  @Field(() => Int, { defaultValue: 1 })
  page: number;

  @Field(() => Int)
  pageSize: number;

  @Field(() => Int, { defaultValue: 0 })
  pageCount: number;

  @Field(() => Int, { defaultValue: 0 })
  itemCount: number;

  @Field(() => Boolean, { defaultValue: false })
  hasNextPage: boolean;

  @Field(() => Boolean, { defaultValue: false })
  hasPreviousPage: boolean;
}
