import { Args, Mutation, Resolver, Query } from '@nestjs/graphql';
import { AuthService } from './auth.service';
import { AuthUser } from './models/auth.model';
import { SignInInput } from './inputs/sign-in-input.input';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { User } from '../users/models/user.model';
import { UseGuards } from '@nestjs/common';
import { SignInGuard } from 'src/common/guards/graphql-signin.guard';
import { GraphqlJwtAuthGuard } from 'src/common/guards/graphql-jwt-auth.guard';

@Resolver()
export class AuthResolver {
  constructor(private readonly authService: AuthService) {}

  @Mutation(() => AuthUser)
  @UseGuards(SignInGuard)
  async signIn(@Args('signInData') _: SignInInput, @CurrentUser() user: User) {
    return this.authService.signIn(user);
  }

  @Query(() => User)
  @UseGuards(GraphqlJwtAuthGuard)
  async me(@CurrentUser() user: User) {
    return user;
  }
}
