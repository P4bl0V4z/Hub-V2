import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class MailerService {
  private transporter: nodemailer.Transporter;

  constructor(private config: ConfigService) {
    this.transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: this.config.get('MAIL_USER'),
        pass: this.config.get('MAIL_PASS'),
      },
    });
  }

  async sendVerificationEmail(to: string, token: string) {
    const url = `https://tu-dominio.com/verificar-email?token=${token}`;
    await this.transporter.sendMail({
      from: this.config.get('MAIL_FROM'),
      to,
      subject: 'Verifica tu cuenta',
      html: `<p>Haz clic en el siguiente enlace para verificar tu cuenta:</p><a href="${url}">${url}</a>`,
    });
  }
}
