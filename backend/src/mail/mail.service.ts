import { Injectable } from '@nestjs/common';
import { Resend } from 'resend';

@Injectable()
export class MailService {
  private resend: Resend;
  private readonly remitente: string;

constructor() {
    this.resend = new Resend(process.env.RESEND_API_KEY);

    if (!process.env.MAIL_FROM) {
      throw new Error('Falta la variable de entorno MAIL_FROM');
    }
    this.remitente = process.env.MAIL_FROM;
  }
  async enviarCodigoVerificacion(destinatario: string, codigo: string) {
    const { error } = await this.resend.emails.send({
      from: this.remitente,
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

    if (error) {
      console.error('Error enviando mail de verificación:', error);
      throw new Error('No se pudo enviar el mail de verificación');
    }
  }

  async enviarLinkRecuperacion(destinatario: string, token: string) {
  const resetUrl = `${process.env.FRONTEND_URL}/reset-password?token=${token}`;

  const { error } = await this.resend.emails.send({
    from: this.remitente,
    to: destinatario,
    subject: 'Recuperá tu contraseña - trama.',
    html: `
      <div style="font-family: sans-serif; max-width: 480px; margin: 0 auto;">
        <h2>Recuperá tu contraseña</h2>
        <p>Recibimos una solicitud para restablecer tu contraseña. Hacé click en el siguiente link:</p>
        <p><a href="${resetUrl}" style="display: inline-block; padding: 12px 24px; background: #000; color: #fff; text-decoration: none; border-radius: 6px;">Restablecer contraseña</a></p>
        <p>Este link vence en 30 minutos. Si no pediste esto, ignorá este mail.</p>
      </div>
    `,
  });

  if (error) {
    console.error('Error enviando mail de recuperación:', error);
    throw new Error('No se pudo enviar el mail de recuperación');
  }
}
}