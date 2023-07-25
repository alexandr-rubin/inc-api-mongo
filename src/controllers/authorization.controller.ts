import { Body, Controller, Post, Res } from "@nestjs/common";
import { UserInputModel } from "src/models/User";
import { HttpStatusCode } from "../helpers/httpStatusCode";
import { AuthorizationService } from "src/domain/authorization.service";
import { Response } from "express";
import { EmailConfirmationCodePipe } from "src/validation/pipes/email-confirmation-code.pipe";
import { EmailValidation } from "src/validation/Email";

@Controller('auth')
export class AuthorizationController {
  constructor(private readonly authorizationService: AuthorizationService){}
  @Post('/registration')
  async createUser(@Body() user: UserInputModel, @Res() res: Response) {
    await this.authorizationService.createUser(user)
    // if(!newUser){

    // }
    res.sendStatus(HttpStatusCode.NO_CONTENT_204)
  }

  @Post('/registration-confirmation')//add code validation
  async registrationConfirmation(@Body(EmailConfirmationCodePipe) code: {code: string}, @Res() res: Response) {
    const isConfirmed = await this.authorizationService.confrmEmail(code.code)
    if(!isConfirmed){
      return res.sendStatus(HttpStatusCode.BAD_REQUEST_400)
    }
    res.sendStatus(HttpStatusCode.NO_CONTENT_204)
  }

  @Post('/registration-email-resending')//add code validation
  async registrationEmailResending(@Body(EmailConfirmationCodePipe) email: EmailValidation, @Res() res: Response) {
    const isConfirmed = await this.authorizationService.resendEmail(email.email)
    if(!isConfirmed){
      return res.sendStatus(HttpStatusCode.BAD_REQUEST_400)
    }
    res.sendStatus(HttpStatusCode.NO_CONTENT_204)
  }
}