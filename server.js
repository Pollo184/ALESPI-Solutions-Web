require('dotenv').config();
const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;
const RESEND_API_KEY = process.env.RESEND_API_KEY?.trim();
const RESEND_FROM = process.env.RESEND_FROM?.trim() || 'contacto@alespi.mx';

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const nameRegex = /^[^\d]+$/;

if (!RESEND_API_KEY) {
  console.error('ERROR: No se encontró RESEND_API_KEY en .env. Agrega tu clave de Resend en el archivo .env.');
  process.exit(1);
}

const fromAddress = RESEND_FROM;

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
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${RESEND_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        from: `ALESPI Solutions <${fromAddress}>`,
        to: [normalizedEmail],
        subject,
        text,
        html
      })
    });

    const responseText = await response.text();
    if (!response.ok) {
      console.error('Resend API error:', responseText);
      return res.status(502).json({ error: 'No se pudo enviar el correo de confirmación. Intenta de nuevo más tarde.' });
    }

    return res.status(200).json({ success: true, message: 'Correo de confirmación enviado.' });
  } catch (error) {
    console.error('Resend error:', error);
    return res.status(500).json({ error: 'Error al enviar el correo de confirmación. Intenta de nuevo más tarde.' });
  }
});

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Servidor iniciado en http://localhost:${PORT}`);
});
