import { Injectable } from '@nestjs/common';
import { Resend } from 'resend';

@Injectable()
export class MailService {
  private resend = new Resend(process.env.RESEND_API_KEY);

  async sendEmail(to: string, subject: string, text: string) {
    if (!process.env.RESEND_API_KEY) {
      console.log('Resend API key missing, skipping email.');
      return;
    }
    try {
      await this.resend.emails.send({
        from: 'TaskFlow <onboarding@resend.dev>',
        to,
        subject,
        html: `<div style="font-family: sans-serif; padding: 20px; color: #333;">
                <h2>${subject}</h2>
                <p style="white-space: pre-wrap; line-height: 1.5;">${text}</p>
                <hr style="border: none; border-top: 1px solid #eaeaea; margin: 20px 0;" />
                <p style="font-size: 12px; color: #888;">TaskFlow Workspace Notification</p>
               </div>`,
      });
    } catch (error) {
      console.error('Resend email failed:', error);
    }
  }
}