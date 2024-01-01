import { Field, InputType } from '@nestjs/graphql';
import { ParentTodoIdInput } from './parent-id-todo.input';

@InputType()
export class UpdateTodoInput {
  @Field(() => String, { nullable: true })
  title: string;

  @Field(() => ParentTodoIdInput, { nullable: true })
  parent: ParentTodoIdInput;

  @Field(() => Boolean, { nullable: true })
  completed: boolean;

  @Field(() => Boolean, { nullable: true })
  frozen: boolean;
}
