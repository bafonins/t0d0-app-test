import { Field, InputType } from '@nestjs/graphql';
import { ParentTodoIdInput } from './parent-id-todo.input';

@InputType()
export class CreateTodoInput {
  @Field(() => String)
  title: string;

  @Field(() => ParentTodoIdInput, { nullable: true })
  parent: ParentTodoIdInput;
}
