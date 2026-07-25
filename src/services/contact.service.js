import nodemailer from 'nodemailer'
import { env } from '../config/env.js'
import { AppError } from '../utils/helpers.js'
import {
  normalizeEmail,
  sanitizeMessage,
  sanitizePersonName,
} from '../utils/validators.js'

function escapeHtml(value = '') {
  return String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;')
}

function getInitials(name = '') {
  const parts = String(name).trim().split(/\s+/).filter(Boolean)
  if (!parts.length) return '?'
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase()
  return `${parts[0][0] || ''}${parts[1][0] || ''}`.toUpperCase()
}

function formatReceivedAt(date = new Date()) {
  return new Intl.DateTimeFormat('es-VE', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date)
}

function createTransporter() {
  if (!env.emailUser || !env.emailPass) {
    throw new AppError(
      'El servicio de correo no está configurado (EMAIL_USER / EMAIL_PASS).',
      500,
    )
  }

  return nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: env.emailUser,
      pass: env.emailPass,
    },
  })
}

function buildContactEmailHtml({
  safeName,
  safeEmail,
  safeMessage,
  initials,
  receivedAt,
}) {
  const accent = '#00b4ff'
  const accentSoft = '#e5f7ff'
  const black = '#000000'
  const white = '#ffffff'
  const muted = '#6b6b73'
  const gray = '#f4f4f6'
  const border = '#e6e6ea'
  const replySubject = encodeURIComponent('Re: Contacto portafolio Merwil Vegas')

  return `
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <meta name="color-scheme" content="light" />
  <title>Nuevo contacto — Merwil Vegas</title>
</head>
<body style="margin:0;padding:0;background:${gray};-webkit-text-size-adjust:100%;">
  <div style="display:none;max-height:0;overflow:hidden;opacity:0;color:transparent;">
    ${safeName} te escribió desde el portafolio: ${safeMessage.slice(0, 80)}
  </div>

  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background:${gray};padding:40px 16px;">
    <tr>
      <td align="center">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="max-width:600px;">
          <tr>
            <td align="center" style="padding:0 0 18px;font-family:Inter,Arial,Helvetica,sans-serif;">
              <table role="presentation" cellpadding="0" cellspacing="0" border="0">
                <tr>
                  <td style="padding-right:10px;vertical-align:middle;">
                    <table role="presentation" cellpadding="0" cellspacing="0" border="0" style="width:28px;height:28px;background:${black};border-radius:8px;">
                      <tr>
                        <td align="center" valign="middle" style="font-size:11px;font-weight:700;letter-spacing:-0.04em;color:${white};font-family:Arial,Helvetica,sans-serif;">
                          MV
                        </td>
                      </tr>
                    </table>
                  </td>
                  <td style="vertical-align:middle;font-size:13px;font-weight:500;color:${black};letter-spacing:-0.02em;">
                    Merwil Vegas
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          <tr>
            <td>
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background:${white};border:1px solid ${border};border-radius:20px;overflow:hidden;">
                <tr>
                  <td style="background:${black};padding:28px 28px 26px;font-family:Inter,Arial,Helvetica,sans-serif;">
                    <p style="margin:0 0 10px;font-size:11px;font-weight:600;letter-spacing:0.1em;text-transform:uppercase;color:${accent};">
                      Formulario de contacto
                    </p>
                    <h1 style="margin:0;font-size:26px;font-weight:500;letter-spacing:-0.04em;line-height:1.15;color:${white};">
                      Tienes un nuevo mensaje
                    </h1>
                    <p style="margin:12px 0 0;font-size:14px;line-height:1.5;color:rgba(255,255,255,0.62);">
                      Recibido el ${receivedAt}
                    </p>
                  </td>
                </tr>
                <tr>
                  <td style="height:5px;background:${accent};font-size:0;line-height:0;">&nbsp;</td>
                </tr>
                <tr>
                  <td style="padding:26px 28px 8px;font-family:Inter,Arial,Helvetica,sans-serif;">
                    <p style="margin:0 0 14px;font-size:11px;font-weight:600;letter-spacing:0.08em;text-transform:uppercase;color:${accent};">
                      Remitente
                    </p>
                    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background:${accentSoft};border:1px solid ${border};border-radius:16px;">
                      <tr>
                        <td style="padding:18px;">
                          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
                            <tr>
                              <td width="52" valign="top" style="padding-right:14px;">
                                <table role="presentation" cellpadding="0" cellspacing="0" border="0" style="width:48px;height:48px;background:${black};border-radius:50%;">
                                  <tr>
                                    <td align="center" valign="middle" style="font-size:14px;font-weight:600;color:${white};font-family:Arial,Helvetica,sans-serif;">
                                      ${initials}
                                    </td>
                                  </tr>
                                </table>
                              </td>
                              <td valign="middle">
                                <p style="margin:0 0 4px;font-size:17px;font-weight:500;letter-spacing:-0.02em;color:${black};">
                                  ${safeName}
                                </p>
                                <p style="margin:0;font-size:14px;">
                                  <a href="mailto:${safeEmail}" style="color:${accent};text-decoration:none;">${safeEmail}</a>
                                </p>
                              </td>
                            </tr>
                          </table>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
                <tr>
                  <td style="padding:18px 28px 8px;font-family:Inter,Arial,Helvetica,sans-serif;">
                    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
                      <tr>
                        <td width="50%" valign="top" style="padding-right:8px;">
                          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="border:1px solid ${border};border-radius:14px;">
                            <tr>
                              <td style="padding:14px 16px;">
                                <p style="margin:0 0 6px;font-size:11px;font-weight:600;letter-spacing:0.06em;text-transform:uppercase;color:${muted};">Canal</p>
                                <p style="margin:0;font-size:14px;font-weight:500;color:${black};">Portafolio web</p>
                              </td>
                            </tr>
                          </table>
                        </td>
                        <td width="50%" valign="top" style="padding-left:8px;">
                          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="border:1px solid ${border};border-radius:14px;">
                            <tr>
                              <td style="padding:14px 16px;">
                                <p style="margin:0 0 6px;font-size:11px;font-weight:600;letter-spacing:0.06em;text-transform:uppercase;color:${muted};">Respuesta</p>
                                <p style="margin:0;font-size:14px;font-weight:500;color:${black};">Reply-To listo</p>
                              </td>
                            </tr>
                          </table>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
                <tr>
                  <td style="padding:18px 28px 8px;font-family:Inter,Arial,Helvetica,sans-serif;">
                    <p style="margin:0 0 12px;font-size:11px;font-weight:600;letter-spacing:0.08em;text-transform:uppercase;color:${accent};">Mensaje</p>
                    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background:${gray};border:1px solid ${border};border-radius:16px;border-left:4px solid ${accent};">
                      <tr>
                        <td style="padding:18px 20px;font-size:15px;line-height:1.65;color:${black};white-space:pre-wrap;">${safeMessage}</td>
                      </tr>
                    </table>
                  </td>
                </tr>
                <tr>
                  <td style="padding:24px 28px 28px;font-family:Inter,Arial,Helvetica,sans-serif;">
                    <a href="mailto:${safeEmail}?subject=${replySubject}" style="display:inline-block;padding:12px 20px;background:${black};color:${white};font-size:13px;font-weight:500;text-decoration:none;border-radius:999px;">
                      Responder ahora
                    </a>
                    <p style="margin:16px 0 0;font-size:12px;line-height:1.55;color:${muted};">
                      Si usas “Responder” en Gmail, el mensaje irá directo a <strong style="color:${black};font-weight:500;">${safeEmail}</strong>.
                    </p>
                  </td>
                </tr>
                <tr>
                  <td style="padding:16px 28px;background:${accentSoft};border-top:1px solid ${border};font-family:Inter,Arial,Helvetica,sans-serif;">
                    <p style="margin:0;font-size:12px;line-height:1.5;color:${muted};">
                      Notificación automática del portafolio de <span style="color:${black};">Merwil Vegas</span> · Ingeniero en Informática
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
`.trim()
}

export async function sendContactMessage({ name, email, message, website }) {
  // Honeypot anti-bot: si viene relleno, fingir éxito
  if (website) {
    return { ok: true }
  }

  if (!env.contactEmails.length) {
    throw new AppError('No hay destinatarios de contacto configurados.', 500)
  }

  const trimmedName = sanitizePersonName(name)
  const trimmedEmail = normalizeEmail(email)
  const trimmedMessage = sanitizeMessage(message)
  const transporter = createTransporter()
  const recipients = env.contactEmails.join(', ')
  const safeName = escapeHtml(trimmedName)
  const safeEmail = escapeHtml(trimmedEmail)
  const safeMessage = escapeHtml(trimmedMessage)
  const receivedAt = formatReceivedAt()
  const safeSubjectName = trimmedName.replace(/[\r\n]+/g, ' ').slice(0, 80)

  await transporter.sendMail({
    from: `"Portafolio Merwil Vegas" <${env.emailUser}>`,
    to: recipients,
    replyTo: trimmedEmail,
    subject: `Nuevo contacto — ${safeSubjectName}`,
    text: `Tienes un nuevo mensaje de contacto

Recibido: ${receivedAt}

Nombre: ${trimmedName}
Email: ${trimmedEmail}
Canal: Portafolio web

Mensaje:
${trimmedMessage}

Responde a este correo para escribirle directamente.
`,
    html: buildContactEmailHtml({
      safeName,
      safeEmail,
      safeMessage,
      initials: escapeHtml(getInitials(trimmedName)),
      receivedAt: escapeHtml(receivedAt),
    }),
  })

  return { ok: true }
}
