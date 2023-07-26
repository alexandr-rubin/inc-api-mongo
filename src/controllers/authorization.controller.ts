import { Body, Controller, Post, Res } from "@nestjs/common";
import { UserInputModel } from "src/models/User";
import { HttpStatusCode } from "../helpers/httpStatusCode";
import { AuthorizationService } from "src/domain/authorization.service";
import { Response } from "express";
import { EmailConfirmationCodePipe } from "src/validation/pipes/email-confirmation-code.pipe";
import { EmailValidation } from "src/validation/Email";
import { NewPasswordInputModelValidation } from "src/validation/newPasswordInputModel";
import { PasswordRecoveryCodeValidPipe } from "src/validation/pipes/password-recovery-code-valid.pipe";
import { EmailOrLoginExistsPipe } from "src/validation/pipes/email-login-exist.pipe";
import { Public } from "src/decorators/public.decorator";
import { LoginValidation } from "src/validation/login";
import { LoginValidationPipe } from "src/validation/pipes/login-validation.pipe";

@Controller('auth')
export class AuthorizationController {
  constructor(private readonly authorizationService: AuthorizationService){}
  @Public()
  @Post('/login')
  async login(@Body(LoginValidationPipe) loginData: LoginValidation, @Res() res: Response) {
    const userId = await this.authorizationService.verifyUser(loginData)
    // throw
    if(!userId){
      return res.sendStatus(HttpStatusCode.UNAUTHORIZED_401)
    }

    const tokens = await this.authorizationService.signIn(userId)

    res.cookie('refreshToken', tokens.refreshToken, {
      httpOnly: true,
      secure: true,
    })

    return res.status(HttpStatusCode.OK_200).send({accessToken: tokens.accessToken})
  }

  @Public()
  @Post('/registration')
  async createUser(@Body(EmailOrLoginExistsPipe) user: UserInputModel, @Res() res: Response) {
    await this.authorizationService.createUser(user)
    // if(!newUser){

    // }
    res.sendStatus(HttpStatusCode.NO_CONTENT_204)
  }

  @Public()
  @Post('/registration-confirmation')//add code validation
  async registrationConfirmation(@Body(EmailConfirmationCodePipe) code: {code: string}, @Res() res: Response) {
    const isConfirmed = await this.authorizationService.confrmEmail(code.code)
    if(!isConfirmed){
      return res.sendStatus(HttpStatusCode.BAD_REQUEST_400)
    }
    res.sendStatus(HttpStatusCode.NO_CONTENT_204)
  }

  @Public()
  @Post('/registration-email-resending')//add code validation
  async registrationEmailResending(@Body(EmailConfirmationCodePipe) email: EmailValidation, @Res() res: Response) {
    const isConfirmed = await this.authorizationService.resendEmail(email.email)
    if(!isConfirmed){
      return res.sendStatus(HttpStatusCode.BAD_REQUEST_400)
    }
    res.sendStatus(HttpStatusCode.NO_CONTENT_204)
  }

  @Public()
  @Post('/password-recovery')//add code validation
  async passwordRecovery(@Body() email: EmailValidation, @Res() res: Response) {
    //
    await this.authorizationService.recoverPassword(email.email)
    return res.sendStatus(HttpStatusCode.NO_CONTENT_204)
  }

  @Public()
  @Post('/new-password')//add code validation
  async newPassword(@Body(PasswordRecoveryCodeValidPipe) newPasswordAndCode: NewPasswordInputModelValidation, @Res() res: Response) {
    //
    await this.authorizationService.updatePassword(newPasswordAndCode.newPassword, newPasswordAndCode.recoveryCode)
    return res.sendStatus(HttpStatusCode.NO_CONTENT_204)
  }
}