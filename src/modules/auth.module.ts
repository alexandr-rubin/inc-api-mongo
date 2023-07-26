import { Module } from '@nestjs/common';
import { AuthorizationController } from 'src/controllers/authorization.controller';
import { AuthorizationService } from 'src/domain/authorization.service';
import { AuthorizationRepository } from 'src/repositories/authorization.repository';
import { PasswordRecoveryCodeExistValidator } from 'src/validation/passwordRecCodeValid';
import { PasswordRecoveryCodeValidPipe } from 'src/validation/pipes/password-recovery-code-valid.pipe';
import { UsersModule } from './users.module';
import { EmailModule } from './email.module';

@Module({
  imports: [
    UsersModule,
    EmailModule
  ],
  controllers: [AuthorizationController],
  providers: [AuthorizationService, AuthorizationRepository, PasswordRecoveryCodeExistValidator, PasswordRecoveryCodeValidPipe],
})
export class AuthModule {}