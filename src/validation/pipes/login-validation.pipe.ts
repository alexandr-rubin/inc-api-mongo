import { PipeTransform, Injectable, UnauthorizedException } from '@nestjs/common';
import { LoginValidation } from '../login';
import { UserQueryRepository } from 'src/queryRepositories/user.query-repository';

@Injectable()
export class LoginValidationPipe implements PipeTransform {
  constructor(private readonly userQueryRepository: UserQueryRepository) {}

  async transform(value: LoginValidation) {

    let user = await this.userQueryRepository.getUsergByEmail(value.loginOrEmail)
    if (!user) {
      user = await this.userQueryRepository.getUsergByLogin(value.loginOrEmail)
    }

    if (!user) {
      throw new UnauthorizedException('User with the specified login or email not found.')
    }

    return value
  }
}
