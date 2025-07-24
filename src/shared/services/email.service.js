import { SESClient, SendEmailCommand } from '@aws-sdk/client-ses';
import { config } from '../config/config.js';
import { emailConstants } from '../constants/email.constants.js';
import { firstLetterUppercase } from '../utils.js';

class EmailService {
  constructor() {
    this.sesClient = new SESClient({
      region: config.aws.region,
      credentials: {
        accessKeyId: config.aws.accessKeyId,
        secretAccessKey: config.aws.secretAccessKey,
      },
    });
  }

  async sendEmail({ to, subject, html, from = config.aws.ses.from }) {
    try {
      const command = new SendEmailCommand({
        Source: from,
        Destination: {
          ToAddresses: [to],
        },
        Message: {
          Subject: {
            Data: subject,
            Charset: 'UTF-8',
          },
          Body: {
            Html: {
              Data: html,
              Charset: 'UTF-8',
            },
          },
        },
      });

      const response = await this.sesClient.send(command);
      console.log('Email sent successfully:', response.MessageId);
      return { success: true, messageId: response.MessageId };
    } catch (error) {
      console.error('Error sending email:', error);
      throw new Error(`Failed to send email: ${error.message}`);
    }
  }

  async sendWelcomeEmail({ to, name, token, lang = 'en' }) {
    const emailTemplate = this.getEmailTemplate(1, lang);
    
    let html = emailTemplate.html;
    html = html.replace('{{title}}', emailTemplate.title[lang] || '');
    html = html.replace('{{name}}', firstLetterUppercase(name) || '');
    html = html.replace('{{body}}', emailTemplate.body[lang] || '');
    html = html.replace('{{btnName}}', emailTemplate.btnName[lang] || '');
    html = html.replace('{{token}}', token);

    return this.sendEmail({
      to,
      subject: emailTemplate.subject[lang],
      html,
    });
  }

  async sendPasswordResetEmail({ to, name, token, lang = 'en' }) {
    const emailTemplate = this.getEmailTemplate(2, lang);
    
    let html = emailTemplate.html;
    html = html.replace('{{title}}', emailTemplate.title[lang] || '');
    html = html.replace('{{name}}', firstLetterUppercase(name) || '');
    html = html.replace('{{body}}', emailTemplate.body[lang] || '');
    html = html.replace('{{btnName}}', emailTemplate.btnName[lang] || '');
    html = html.replace('{{token}}', token);

    return this.sendEmail({
      to,
      subject: emailTemplate.subject[lang],
      html,
    });
  }

  getEmailTemplate(emailId, lang) {
    return emailConstants.find(e => e.emailId === emailId);
  }
}

export const emailService = new EmailService(); 