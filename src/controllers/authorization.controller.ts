import { Body, Controller, Get, Headers, HttpCode, Ip, Post, Req, Res, UseGuards } from "@nestjs/common";
import { UserInputModel } from "src/models/User";
import { HttpStatusCode } from "../helpers/httpStatusCode";
import { AuthorizationService } from "src/domain/authorization.service";
import { Request, Response } from "express";
import { EmailConfirmationCodePipe } from "src/validation/pipes/email-confirmation-code.pipe";
import { EmailValidation } from "src/validation/Email";
import { NewPasswordInputModelValidation } from "src/validation/newPasswordInputModel";
import { PasswordRecoveryCodeValidPipe } from "src/validation/pipes/password-recovery-code-valid.pipe";
import { EmailOrLoginExistsPipe } from "src/validation/pipes/email-login-exist.pipe";
import { Public } from "src/decorators/public.decorator";
import { LoginValidation } from "src/validation/login";
import { LoginValidationPipe } from "src/validation/pipes/login-validation.pipe";
import { AccessTokenVrifyModel } from "src/models/Auth";
import { RefreshTokenGuard } from "src/guards/refreshToken.guard";

@Controller('auth')
export class AuthorizationController {
  constructor(private readonly authorizationService: AuthorizationService){}
  @Public()
  @Post('/login')
  async login(@Headers() headers, @Ip() ip, @Body(LoginValidationPipe) loginData: LoginValidation, @Res() res: Response) {
    const userId = await this.authorizationService.verifyUser(loginData)

    const userAgent = headers['user-agent']
    const clientIP = ip
    const tokens = await this.authorizationService.signIn(userId, userAgent, clientIP)

    res.cookie('refreshToken', tokens.refreshToken, {
      httpOnly: true,
      secure: true,
    })

    res.status(HttpStatusCode.OK_200).send({accessToken: tokens.accessToken})
  }

  @Public()
  @UseGuards(RefreshTokenGuard)
  @Post('/refresh-token')
  async updateTokens(@Headers() headers, @Ip() ip, @Res() res: Response, @Req() req: Request) {
    const oldToken = req.cookies.refreshToken
    const userAgent = headers['user-agent']
    const clientIP = ip
    const tokens = await this.authorizationService.updateDevice(oldToken, clientIP, userAgent)

    res.cookie('refreshToken', tokens.refreshToken, {
      httpOnly: true,
      secure: true,
    })

    return {accessToken: tokens.accessToken}
  }

  @Public()
  @UseGuards(RefreshTokenGuard)
  @HttpCode(HttpStatusCode.NO_CONTENT_204)
  @Post('/logout')
  async logout(@Req() req: Request) {
    const oldToken = req.cookies.refreshToken
    return await this.authorizationService.logoutDevice(oldToken)
  }

  @Public()
  @HttpCode(HttpStatusCode.NO_CONTENT_204)
  @Post('/registration')
  async createUser(@Body(EmailOrLoginExistsPipe) user: UserInputModel) {
    return await this.authorizationService.createUser(user)
  }

  @Public()
  @HttpCode(HttpStatusCode.NO_CONTENT_204)
  @Post('/registration-confirmation')//add code validation
  async registrationConfirmation(@Body(EmailConfirmationCodePipe) code: {code: string}) {
    return await this.authorizationService.confrmEmail(code.code)
  }

  @Public()
  @HttpCode(HttpStatusCode.NO_CONTENT_204)
  @Post('/registration-email-resending')//add code validation
  async registrationEmailResending(@Body(EmailConfirmationCodePipe) email: EmailValidation) {
    return await this.authorizationService.resendEmail(email.email)
  }

  @Public()
  @HttpCode(HttpStatusCode.NO_CONTENT_204)
  @Post('/password-recovery')//add code validation
  async passwordRecovery(@Body() email: EmailValidation) {
    return await this.authorizationService.recoverPassword(email.email)
  }

  @Public()
  @HttpCode(HttpStatusCode.NO_CONTENT_204)
  @Post('/new-password')//add code validation
  async newPassword(@Body(PasswordRecoveryCodeValidPipe) newPasswordAndCode: NewPasswordInputModelValidation) {
    //
    return await this.authorizationService.updatePassword(newPasswordAndCode.newPassword, newPasswordAndCode.recoveryCode)
  }

  @Get('/me')
  async getCurrentUser(@Req() req: AccessTokenVrifyModel) {
    ////////////
    return {
      email: req.user.email,
      login: req.user.login,
      userId: req.user.userId
    }
  }
}