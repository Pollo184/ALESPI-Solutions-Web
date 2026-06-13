require('dotenv').config();
const express = require('express');
const path = require('path');
const nodemailer = require('nodemailer');

const app = express();
const PORT = process.env.PORT || 3000;
const SMTP_HOST = process.env.SMTP_HOST?.trim() || 'smtp.office365.com';
const SMTP_PORT = Number(process.env.SMTP_PORT || 587);
const SMTP_SECURE = process.env.SMTP_SECURE === 'true' || process.env.SMTP_SECURE === '1';
const SMTP_USER = process.env.SMTP_USER?.trim();
const SMTP_PASS = process.env.SMTP_PASS?.trim();
const SMTP_FROM = process.env.SMTP_FROM?.trim() || SMTP_USER;
const SMTP_AUTH_METHOD = process.env.SMTP_AUTH_METHOD?.trim() || (SMTP_HOST.includes('outlook') || SMTP_HOST.includes('office365') ? 'XOAUTH2' : 'LOGIN');
const SMTP_CLIENT_ID = process.env.SMTP_CLIENT_ID?.trim();
const SMTP_CLIENT_SECRET = process.env.SMTP_CLIENT_SECRET?.trim();
const SMTP_REFRESH_TOKEN = process.env.SMTP_REFRESH_TOKEN?.trim();
const SMTP_ACCESS_TOKEN = process.env.SMTP_ACCESS_TOKEN?.trim();

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const nameRegex = /^[^\d]+$/;

if (!SMTP_USER || !SMTP_PASS) {
  console.error('ERROR: No se encontró SMTP_USER o SMTP_PASS en .env.');
  process.exit(1);
}

const transporter = nodemailer.createTransport({
  host: SMTP_HOST,
  port: SMTP_PORT,
  secure: SMTP_SECURE,
  requireTLS: true,
  authMethod: SMTP_AUTH_METHOD,
  auth: SMTP_AUTH_METHOD === 'XOAUTH2' && SMTP_CLIENT_ID && SMTP_CLIENT_SECRET && SMTP_REFRESH_TOKEN
    ? {
        type: 'OAuth2',
        user: SMTP_USER,
        clientId: SMTP_CLIENT_ID,
        clientSecret: SMTP_CLIENT_SECRET,
        refreshToken: SMTP_REFRESH_TOKEN,
        accessToken: SMTP_ACCESS_TOKEN,
      }
    : {
        user: SMTP_USER,
        pass: SMTP_PASS,
      },
});

if (SMTP_HOST.includes('outlook') || SMTP_HOST.includes('office365')) {
  console.warn('Advertencia: Outlook/Office 365 suele requerir SMTP AUTH habilitado o un app password para enviar correos con contraseña.');
}

app.use(express.json());
app.use(express.static(path.join(__dirname)));

app.post('/api/contact', async (req, res) => {
  const { nombre, email, empresa, asunto, mensaje } = req.body || {};

  if (!nombre?.trim() || !email?.trim() || !empresa?.trim() || !asunto?.trim() || !mensaje?.trim()) {
    return res.status(400).json({ error: 'Todos los campos son obligatorios.' });
  }

  if (!nameRegex.test(nombre.trim())) {
    return res.status(400).json({ error: 'El nombre no puede contener números.' });
  }

  if (!emailRegex.test(email.trim())) {
    return res.status(400).json({ error: 'El correo electrónico no es válido.' });
  }

  const normalizedEmail = email.trim();
  const subject = 'Hemos recibido tu solicitud | ALESPI Solutions';
  const text = `Hola ${nombre.trim()},\n\nGracias por contactarnos. Hemos recibido tu solicitud con los siguientes datos:\n\nEmpresa: ${empresa.trim()}\nAsunto: ${asunto.trim()}\nMensaje: ${mensaje.trim()}\n\nUn asesor especializado de ALESPI Solutions se comunicará contigo en breve para dar seguimiento a tu requerimiento.\n\nAtentamente,\nEquipo de ALESPI Solutions\nhttps://alespi.mx`;
  const html = `<!DOCTYPE html>
<html lang="es">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Confirmación de contacto</title>
  </head>
  <body style="margin:0;padding:0;font-family:Arial,Helvetica,sans-serif;background:#f8fafc;color:#1f2937;">
    <table width="100%" cellpadding="0" cellspacing="0" role="presentation">
      <tr>
        <td align="center" style="padding:24px;">
          <table width="100%" cellpadding="0" cellspacing="0" role="presentation" style="max-width:680px;background:#ffffff;border-radius:24px;overflow:hidden;box-shadow:0 18px 50px rgba(15,23,42,0.08);">
            <tr>
              <td style="padding:32px 32px 24px;background:#0f172a;color:#ffffff;text-align:center;">
                <h1 style="margin:0;font-size:28px;font-weight:700;">Solicitud recibida</h1>
                <p style="margin:12px 0 0;font-size:16px;line-height:1.6;color:#d1d5db;">Gracias por comunicarte con ALESPI Solutions.</p>
              </td>
            </tr>
            <tr>
              <td style="padding:32px 32px 24px;">
                <p style="margin:0 0 20px;font-size:16px;line-height:1.75;color:#334155;">Hola ${nombre.trim()},</p>
                <p style="margin:0 0 20px;font-size:16px;line-height:1.75;color:#334155;">Hemos recibido tu mensaje y nuestro equipo de asesores técnicos revisará tu solicitud a la brevedad. A continuación verás un resumen de la información que nos proporcionaste:</p>
                <table width="100%" cellpadding="0" cellspacing="0" role="presentation" style="border-collapse:collapse;margin-bottom:24px;">
                  <tr>
                    <td style="padding:12px 16px;border:1px solid #e2e8f0;background:#f8fafc;font-weight:700;width:160px;">Empresa</td>
                    <td style="padding:12px 16px;border:1px solid #e2e8f0;">${empresa.trim()}</td>
                  </tr>
                  <tr>
                    <td style="padding:12px 16px;border:1px solid #e2e8f0;background:#f8fafc;font-weight:700;">Asunto</td>
                    <td style="padding:12px 16px;border:1px solid #e2e8f0;">${asunto.trim()}</td>
                  </tr>
                  <tr>
                    <td style="padding:12px 16px;border:1px solid #e2e8f0;background:#f8fafc;font-weight:700;vertical-align:top;">Mensaje</td>
                    <td style="padding:12px 16px;border:1px solid #e2e8f0;">${mensaje.trim().replace(/\n/g, '<br>')}</td>
                  </tr>
                </table>
                <p style="margin:0 0 20px;font-size:16px;line-height:1.75;color:#334155;">Un asesor de ALESPI Solutions se pondrá en contacto contigo lo antes posible para analizar requisitos técnicos y ofrecer la mejor solución para tu proyecto.</p>
                <p style="margin:0;font-size:16px;line-height:1.75;color:#334155;">Atentamente,<br><strong>Equipo de ALESPI Solutions</strong></p>
              </td>
            </tr>
            <tr>
              <td style="padding:24px 32px 32px;background:#f8fafc;color:#64748b;text-align:center;font-size:14px;">
                <p style="margin:0;">Si no solicitaste este correo, ignora este mensaje.</p>
                <p style="margin:8px 0 0;">ALESPI Solutions · Calzada Zavaleta 313-A, Puebla</p>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>`;

  try {
    await transporter.sendMail({
      from: `ALESPI Solutions <${SMTP_FROM || SMTP_USER}>`,
      to: 'alespi.ventas@outlook.com',
      replyTo: normalizedEmail,
      subject: `Nueva solicitud: ${asunto.trim()}`,
      text: `Nueva solicitud de contacto\n\nNombre: ${nombre.trim()}\nEmail: ${email.trim()}\nEmpresa: ${empresa.trim()}\nAsunto: ${asunto.trim()}\n\n${mensaje.trim()}`,
      html: `
        <h2>Nueva solicitud de contacto</h2>
        <p><strong>Nombre:</strong> ${nombre.trim()}</p>
        <p><strong>Email:</strong> ${email.trim()}</p>
        <p><strong>Empresa:</strong> ${empresa.trim()}</p>
        <p><strong>Asunto:</strong> ${asunto.trim()}</p>
        <hr />
        <p>${mensaje.trim().replace(/\n/g, '<br>')}</p>
      `
    });

    await transporter.sendMail({
      from: `ALESPI Solutions <${SMTP_FROM || SMTP_USER}>`,
      to: normalizedEmail,
      subject,
      text,
      html
    });

    return res.status(200).json({ success: true, message: 'Correos enviados correctamente.' });
  } catch (error) {
    const msg = error?.code === 'EAUTH' || error?.responseCode === 535
      ? 'La autenticación SMTP falló. Si usas Outlook/Office 365, habilita SMTP AUTH o usa un app password; si usas Gmail, usa una contraseña de aplicación.'
      : 'Error al enviar los correos. Intenta de nuevo más tarde.';

    console.error('SMTP error:', error);
    return res.status(500).json({ error: msg });
  }
});

app.get('/api/test-mail', async (req, res) => {
  try {
    await transporter.verify();
    return res.status(200).json({ success: true, message: 'SMTP verificado correctamente.' });
  } catch (error) {
    const msg = error?.code === 'EAUTH' || error?.responseCode === 535
      ? 'La autenticación SMTP falló. Para Outlook necesitas un app password o SMTP AUTH habilitado en la cuenta.'
      : 'No se pudo verificar el SMTP.';

    console.error('SMTP verify error:', error);
    return res.status(500).json({ success: false, error: msg });
  }
});

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Servidor iniciado en http://localhost:${PORT}`);
});
