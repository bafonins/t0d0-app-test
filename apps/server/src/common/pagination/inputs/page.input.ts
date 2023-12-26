import { Field, InputType, Int } from '@nestjs/graphql';
import { SortOrder } from '../const';

@InputType()
export class PaginationInput {
  @Field(() => Int)
  page: number;

  @Field(() => Int)
  take: number;

  @Field(() => SortOrder, { defaultValue: SortOrder.DESC })
  order: SortOrder;
}
