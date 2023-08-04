import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import * as dotenv from 'dotenv'
import { UserQueryRepository } from '../queryRepositories/user.query-repository';

dotenv.config()

const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY || 'secretkey'

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly userQueryRepository: UserQueryRepository
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: JWT_SECRET_KEY,
    });
  }

  async validate(payload: any) {
    const user = await this.userQueryRepository.getUsergByIdNoView(payload.userId);

    if (!user) {
      throw new UnauthorizedException();
    }

    return { userId: payload.userId, ...user };
  }
}