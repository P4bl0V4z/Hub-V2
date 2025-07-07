// src/mailer/mailer.service.ts
import { Injectable, InternalServerErrorException } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class MailerService {
  private transporter;

  constructor(private config: ConfigService) {
    this.transporter = nodemailer.createTransport({
      host: this.config.get('MAIL_HOST'),
      port: this.config.get('MAIL_PORT'),
      secure: false,
      auth: {
        user: this.config.get('MAIL_USER'),
        pass: this.config.get('MAIL_PASS'),
      },
    });
  }

  async sendVerificationEmail(to: string, token: string) {
    const url = `${this.config.get('FRONTEND_URL')}/verificar?token=${token}`;
    
    const html = `
      <h2>Bienvenido a BeLoop</h2>
      <p>Para activar tu cuenta, haz clic en el siguiente enlace:</p>
      <a href="${url}">${url}</a>
    `;

    try {
      await this.transporter.sendMail({
        from: `"BeLoop" <${this.config.get('MAIL_FROM')}>`,
        to,
        subject: 'Verifica tu cuenta',
        html,
      });
    } catch (err) {
      console.error('Error enviando email:', err);
      throw new InternalServerErrorException('No se pudo enviar el correo');
    }
  }
}
