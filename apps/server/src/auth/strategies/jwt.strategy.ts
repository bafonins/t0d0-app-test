import { ExtractJwt, Strategy, VerifiedCallback } from 'passport-jwt';
import { UsersService } from '../../users/users.service';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(
    private readonly usersService: UsersService,
    readonly configService: ConfigService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: configService.get('JWT_SECRET'),
    });
  }

  async validate(payload: any, done: VerifiedCallback) {
    try {
      const user = await this.usersService.findOneById(payload.sub);

      done(null, user);
    } catch (err) {
      throw new UnauthorizedException('Error', err.message);
    }
  }
}
