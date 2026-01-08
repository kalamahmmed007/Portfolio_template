import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
dotenv.config();

export const sendEmail = async ({ to, subject, text, html }) => {
  try {
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || 'smtp.gmail.com',
      port: process.env.SMTP_PORT || 587,
      secure: false, // true for 465, false for other ports
      auth: {
        user: process.env.SMTP_USER || '0057kalamahmmed@gmail.com', 
        pass: process.env.SMTP_PASS || 'kalam@mim1',
      },
    });

    const info = await transporter.sendMail({
      from: `"Portfolio Admin" <${process.env.SMTP_USER || 'yourmail@gmail.com'}>`,
      to,
      subject,
      text,
      html,
    });

    console.log('Message sent: %s', info.messageId);
  } catch (error) {
    console.error('Email not sent: ', error);
  }
};
