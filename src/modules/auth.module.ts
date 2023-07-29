import { Module } from '@nestjs/common';
import { AuthorizationController } from 'src/controllers/authorization.controller';
import { AuthorizationService } from 'src/domain/authorization.service';
import { AuthorizationRepository } from 'src/repositories/authorization.repository';
import { PasswordRecoveryCodeExistValidator } from 'src/validation/passwordRecCodeValid';
import { PasswordRecoveryCodeValidPipe } from 'src/validation/pipes/password-recovery-code-valid.pipe';
import { UsersModule } from './users.module';
import { EmailModule } from './email.module';
import { JwtModule } from '@nestjs/jwt';
import * as dotenv from 'dotenv'
import { AuthGuard } from 'src/guards/auth.guard';
import { APP_GUARD } from '@nestjs/core';
import { LoginValidation } from 'src/validation/login';
import { LoginValidationPipe } from 'src/validation/pipes/login-validation.pipe';
import { Device, DeviceSchema } from 'src/models/Device';
import { MongooseModule } from '@nestjs/mongoose';
import { SecurityController } from 'src/controllers/security.controller';
import { SecurityService } from 'src/domain/security.service';
import { SecurityRepository } from 'src/repositories/security.repository';
import { SecurityQueryRepository } from 'src/queryRepositories/security.query-repository';
import { RefreshTokenGuard } from 'src/guards/refreshToken.guard';
/////////////
dotenv.config()

const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY || 'secretkey'

@Module({
  imports: [
    UsersModule,
    EmailModule,
    JwtModule.register({
      global: true,
      secret: JWT_SECRET_KEY,
      signOptions: { expiresIn: '5m' },
    }),
    MongooseModule.forFeature([{ name: Device.name, schema: DeviceSchema }]),
  ],
  controllers: [AuthorizationController, SecurityController],
  providers: [AuthorizationService, AuthorizationRepository, PasswordRecoveryCodeExistValidator, PasswordRecoveryCodeValidPipe,
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
  LoginValidation, LoginValidationPipe, SecurityService, SecurityRepository, SecurityQueryRepository, RefreshTokenGuard],
  exports: [AuthorizationService]
})
export class AuthModule {}