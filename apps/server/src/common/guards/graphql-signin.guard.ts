import { ExecutionContext, Injectable } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class SignInGuard extends AuthGuard('local') {
  constructor() {
    super();
  }

  getRequest(context: ExecutionContext) {
    const ctx = GqlExecutionContext.create(context);
    const request = ctx.getContext().req;
    const {
      username,
      /*
        We use simplified strategy here such that only the username is needed.
      */
      password = '*',
    } = ctx.getArgs().signInData;
    request.body = { username: username, password: password };
    return request;
  }
}
