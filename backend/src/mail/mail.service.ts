import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import SMTPTransport from 'nodemailer/lib/smtp-transport';
import { setDefaultResultOrder } from 'node:dns';

setDefaultResultOrder('ipv4first');

@Injectable()
export class MailService {
  private transporter;

  constructor() {
    const options: SMTPTransport.Options = {
      host: 'smtp.gmail.com',
      port: 465,
      secure: true,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_APP_PASSWORD,
      },
    };
    this.transporter = nodemailer.createTransport(options);
  }


  async enviarCodigoVerificacion(destinatario: string, codigo: string) {
    await this.transporter.sendMail({
      from: `"trama." <${process.env.EMAIL_USER}>`,
      to: destinatario,
      subject: 'Tu código de verificación - trama.',
      html: `
        <div style="font-family: sans-serif; max-width: 480px; margin: 0 auto;">
          <h2>Verificá tu cuenta</h2>
          <p>Tu código de verificación es:</p>
          <p style="font-size: 32px; font-weight: bold; letter-spacing: 4px;">${codigo}</p>
          <p>Este código vence en 15 minutos.</p>
        </div>
      `,
    });
  }
}