import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';
import { Transporter } from 'nodemailer';

@Injectable()
export class MailerService {
  private transporter: Transporter;

  constructor(private config: ConfigService) {
    this.transporter = nodemailer.createTransport({
      host: this.config.get<string>('MAIL_HOST'),
      port: parseInt(this.config.get<string>('MAIL_PORT') || '587', 10),
      secure: false,
      auth: {
        user: this.config.get<string>('MAIL_USER'),
        pass: this.config.get<string>('MAIL_PASS'),
      },
    });
  }

  async sendVerificationEmail(to: string, token: string): Promise<void> {
    const url = `${this.config.get<string>('API_URL')}/auth/verify-email?token=${token}`;

    const html = `
      <h2>Bienvenido a BeLoop</h2>
      <p>Para activar tu cuenta, haz clic en el siguiente enlace:</p>
      <a href="${url}">${url}</a>
    `;

    try {
      await this.transporter.sendMail({
        from: `"BeLoop" <${this.config.get<string>('MAIL_FROM')}>`,
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
