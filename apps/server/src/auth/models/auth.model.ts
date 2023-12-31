import { Field, ObjectType } from '@nestjs/graphql';
import { User } from 'src/users/models/user.model';

@ObjectType()
export class AuthUser {
  @Field(() => String)
  token: string;

  @Field(() => User)
  user: User;
}
