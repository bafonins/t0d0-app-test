import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { AuthUser } from './models/auth.model';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async signIn(username: string): Promise<AuthUser> {
    let user = await this.usersService.findOneByUserName(username);
    if (!user) {
      /*
        In a real-world application, we would typically throw an error if a user
        tries to log in and the user does not exist, as this is a standard
        security practice to prevent unauthorized access. However, for the
        sake of simplicity and demonstration purposes in this example, I am
        deviating from this norm. Instead of throwing an error, we are
        automatically creating a new user account if one does not already exist.
        This approach is not recommended for production environments as it can
        lead to potential security vulnerabilities and unexpected behaviors.
        It is being used here solely to streamline the development and
        testing process.
      */
      user = await this.usersService.createUser(username);
    }

    const jwtPayload = { sub: user.id, userName: user.username };
    return {
      token: await this.jwtService.signAsync(jwtPayload),
      user: user,
    };
  }
}
