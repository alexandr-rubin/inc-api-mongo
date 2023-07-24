import { Injectable } from '@nestjs/common';
import { EmailAdapter } from 'src/adapters/email.adapter';

@Injectable()
export class EmailService {
  constructor(private readonly emailAdapter: EmailAdapter) {}
  async sendRegistrationConfirmationEmail(email: string, code: string){
    const subject = 'registration'
    return await this.emailAdapter.sendEmail(email, code, subject)
} 
}
