import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';

@Injectable()
export class EmailAdapter {
  constructor(private readonly mailerService: MailerService) {}

  async sendEmail(email: string, code: string, subject: string) {
    try {
      await this.mailerService
      .sendMail({
        to: email,
        from: 'rubinyourhead@gmail.com',
        subject: subject,
        text: 'welcome',
        // const
        html: `<a href='https://incubator-homework-nest.vercel.app/confirm-email?code=${code}'>complete registration</a>`,
      })

      console.log("Message sent");
    } catch (error) {
      console.error('Error sending email:', error);
      throw error;
    }
  }

  
}
