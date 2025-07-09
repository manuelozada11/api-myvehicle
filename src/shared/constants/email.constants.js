export const emailConstants = [
  {
    emailId: 1,
    subject: {
      en: 'Welcome to Taangi!',
      es: '¡Bienvenido a Taangi!'
    },
    body: {
      en: `We're happy to have you on board! Please click the button below to activate your account`,
      es: `¡Estamos felices de tenerte con nosotros! Por favor, haz clic en el botón de abajo para activar tu cuenta`
    },
    btnName: {
      en: 'Activate',
      es: 'Activar'
    },
    html: `<!DOCTYPE html>
      <html lang="es">

      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Welcome to Taangi</title>
        <style>
          body {
            font-family: 'Arial', sans-serif;
            background-color: #f3f4f6;
            margin: 0;
            padding: 0;
            color: #333;
            text-align: center;
          }

          .email-container {
            max-width: 600px;
            margin: 40px auto;
            background-color: #ffffff;
            border-radius: 12px;
            overflow: hidden;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
          }

          .header {
            background-color: #ffffff;
            padding: 10px 0;
            text-align: center;
          }

          .header img {
            max-width: 70px;
            height: auto;
          }

          .content {
            padding: 30px;
            text-align: center;
          }

          .content h1 {
            font-size: 22px;
            color: #f08411;
            margin-bottom: 20px;
            margin-top: 0;
          }

          .content p {
            font-size: 16px;
            line-height: 1.5;
            margin-bottom: 20px;
            text-align: center;
          }

          .content a {
            text-decoration: none;
            font-weight: bold;
          }

          .btn {
            display: inline-block;
            background-color: #f08411;
            color: #ffffff;
            text-decoration: none;
            padding: 12px 24px;
            border-radius: 6px;
            font-weight: bold;
            font-size: 16px;
            margin-top: 20px;
          }

          .contact-info {
            margin: 20px 0;
            text-align: center;
          }

          .contact-table {
            margin: 0 auto;
          }

          .contact-item {
            padding: 5px 0;
          }

          .contact-item img {
            vertical-align: middle;
            margin-right: 10px;
          }

          .contact-item a {
            font-size: 14px;
            color: #f08411;
            text-decoration: none;
            vertical-align: middle;
          }

          .footer {
            background-color: #646464;
            padding: 20px;
            text-align: center;
            color: #ffffff;
            font-size: 14px;
          }

          .footer a {
            color: #ffffff;
            text-decoration: none;
            margin: 0 8px;
          }

          .disclaimer {
            color: #999999;
            margin-top: 30px;
            font-style: italic;
          }

          .icon {
            display: flex;
            align-items: center;
            justify-content: center;
          }
        </style>
      </head>

      <body>
        <table class="email-container" cellpadding="0" cellspacing="0" border="0" align="center">
          <!-- Header Section -->
          <tr>
            <td class="header" align="center">
              <img src="https://taangi.com/logo192.png" alt="Taangi Logo">
            </td>
          </tr>

          <!-- Content Section -->
          <tr>
            <td class="content" align="center">
              <h1>Hey {{name}},</h1>
              <p>{{body}}</p>

              <!-- Nuevo botón -->
              <a href="https://taangi.com/activate/{{token}}" class="btn">{{btnName}}</a>
            </td>
          </tr>

          <!-- Footer Section -->
          <tr>
            <td class="footer" align="center">
              <p><a href="https://taangi.com">taangi.com</a></p>
              <p>© Taangi 2025 - All rights reserved</p>
            </td>
          </tr>
        </table>
      </body>

      </html>
    `
  },
  {
    emailId: 2,
    subject: {
      en: 'Reset your password',
      es: 'Restablecer tu contraseña'
    },
    body: {
      en: `It looks like you requested a password reset. Please click the button below to set a new password.`,
      es: `Parece que solicitaste restablecer tu contraseña. Por favor, haz clic en el botón de abajo para crear una nueva contraseña.`
    },
    btnName: {
      en: 'Reset password',
      es: 'Restablecer contraseña'
    },
    html: `<!DOCTYPE html>
      <html lang="es">

      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Taangi</title>
        <style>
          body {
            font-family: 'Arial', sans-serif;
            background-color: #f3f4f6;
            margin: 0;
            padding: 0;
            color: #333;
            text-align: center;
          }

          .email-container {
            max-width: 600px;
            margin: 40px auto;
            background-color: #ffffff;
            border-radius: 12px;
            overflow: hidden;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
          }

          .header {
            background-color: #ffffff;
            padding: 10px 0;
            text-align: center;
          }

          .header img {
            max-width: 70px;
            height: auto;
          }

          .content {
            padding: 30px;
            text-align: center;
          }

          .content h1 {
            font-size: 22px;
            color: #f08411;
            margin-bottom: 20px;
            margin-top: 0;
          }

          .content p {
            font-size: 16px;
            margin-bottom: 30px;
          }

          .btn {
            display: inline-block;
            padding: 12px 32px;
            background-color: #f08411;
            color: #fff !important;
            border-radius: 6px;
            text-decoration: none;
            font-size: 16px;
            font-weight: bold;
            margin-top: 20px;
            transition: background 0.2s;
          }

          .btn:hover {
            background-color: #d46e0c;
          }

          .footer {
            background-color: #f3f4f6;
            padding: 20px 0;
            font-size: 14px;
            color: #888888;
            border-top: 1px solid #eaeaea;
          }

          .disclaimer {
            color: #999999;
            margin-top: 30px;
            font-style: italic;
          }

          .icon {
            display: flex;
            align-items: center;
            justify-content: center;
          }
        </style>
      </head>

      <body>
        <table class="email-container" cellpadding="0" cellspacing="0" border="0" align="center">
          <!-- Header Section -->
          <tr>
            <td class="header" align="center">
              <img src="https://taangi.com/logo192.png" alt="Taangi Logo">
            </td>
          </tr>

          <!-- Content Section -->
          <tr>
            <td class="content" align="center">
              <h1>Hi {{name}},</h1>
              <p>{{body}}</p>

              <!-- Reset password button -->
              <a href="https://taangi.com/reset-password?token={{token}}" class="btn">{{btnName}}</a>
              <p style="margin-top:30px; color:#888; font-size:13px;">
                If you did not request a password reset, you can safely ignore this email.
              </p>
            </td>
          </tr>

          <!-- Footer Section -->
          <tr>
            <td class="footer" align="center">
              <p><a href="https://taangi.com">taangi.com</a></p>
              <p>© Taangi 2025 - All rights reserved</p>
            </td>
          </tr>
        </table>
      </body>

      </html>
    `
  }
]