import { Injectable } from '@nestjs/common';
import { EmailAdapter } from 'src/adapters/email.adapter';

@Injectable()
export class EmailService {
  constructor(private readonly emailAdapter: EmailAdapter) {}
  async sendRegistrationConfirmationEmail(email: string, code: string){
    const subject = 'registration'
    //
    const html = `<a href='https://incubator-homework-nest.vercel.app/confirm-email?code=${code}'>complete registration</a>` 
    return await this.emailAdapter.sendEmail(email, subject, html)
} 
}
