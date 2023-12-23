import { Field, ID, InputType } from '@nestjs/graphql';

@InputType()
export class ParentTodoIdInput {
  @Field(() => ID)
  id: string;
}
