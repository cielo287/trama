import { Injectable } from '@nestjs/common';
import { Resend } from 'resend';

@Injectable()
export class MailService {
  private resend: Resend;

  constructor() {
    this.resend = new Resend(process.env.RESEND_API_KEY);
  }

  async enviarCodigoVerificacion(destinatario: string, codigo: string) {
    const { error } = await this.resend.emails.send({
      from: 'trama. <verificacion@tramahq.online>',
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
}