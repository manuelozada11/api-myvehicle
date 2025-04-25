export const emailConstants = [
  {
    emailId: 1,
    subject: {
      en: 'Welcome to Tangerine!',
      es: '¡Bienvenido a Tangerine!'
    },
    body: {
      en: `We're happy to have you on board!`,
      es: `¡Estamos felices de tenerte con nosotros!`
    },
    html: `<!DOCTYPE html>
      <html lang="es">

      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Welcome to Tangerine</title>
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
            color: #f08411;
            text-decoration: none;
            font-weight: bold;
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
              <img src="https://tangerineapp.vercel.app/logo192.png" alt="Lo Que Pedí Logo">
            </td>
          </tr>

          <!-- Content Section -->
          <tr>
            <td class="content" align="center">
              <h1>Hey {{name}},</h1>
              <p>{{body}}</p>
            </td>
          </tr>

          <!-- Contact Information -->
          <tr>
            <td class="contact-info" align="center">
              <table class="contact-table" cellpadding="0" cellspacing="0" border="0" style="margin-bottom: 25px;">
                <tr class="contact-item">
                  <td>
                    <img src="https://public.loquepedi.com/general/correo.png" alt="Email Icon" width="20" height="20">
                  </td>
                  <td>
                    <a href="mailto:llego@loquepedi.com">tangerineapp@gmail.com</a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Footer Section -->
          <tr>
            <td class="footer" align="center">
              <p><a href="https://tangerineapp.vercel.app">tangerineapp.vercel.com</a></p>
              <p>© Tangerineapp 2025 - All rights reserved</p>
            </td>
          </tr>
        </table>
      </body>

      </html>
    `
  }
]