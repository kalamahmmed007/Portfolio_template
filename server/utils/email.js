const transporter = require('../config/nodemailer');

// Send generic email
exports.sendEmail = async (options) => {
  try {
    const mailOptions = {
      from: `${process.env.FROM_NAME || 'Portfolio'} <${process.env.FROM_EMAIL}>`,
      to: options.to,
      subject: options.subject,
      text: options.text,
      html: options.html,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('✓ Email sent:', info.messageId);
    return {
      success: true,
      messageId: info.messageId,
    };
  } catch (error) {
    console.error('✗ Error sending email:', error.message);
    throw error;
  }
};

// Send contact form notification to admin
exports.sendContactNotification = async (message) => {
  try {
    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body {
            font-family: Arial, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
          }
          .header {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 30px;
            text-align: center;
            border-radius: 10px 10px 0 0;
          }
          .content {
            background-color: #f5f5f5;
            padding: 30px;
            border-radius: 0 0 10px 10px;
          }
          .info-box {
            background-color: white;
            padding: 20px;
            margin: 15px 0;
            border-radius: 5px;
            border-left: 4px solid #667eea;
          }
          .label {
            font-weight: bold;
            color: #667eea;
            margin-bottom: 5px;
          }
          .value {
            color: #333;
            margin-bottom: 15px;
          }
          .message-box {
            background-color: white;
            padding: 20px;
            margin: 15px 0;
            border-radius: 5px;
            white-space: pre-wrap;
            word-wrap: break-word;
          }
          .footer {
            text-align: center;
            margin-top: 20px;
            color: #666;
            font-size: 12px;
          }
          .button {
            display: inline-block;
            background-color: #667eea;
            color: white;
            padding: 12px 30px;
            text-decoration: none;
            border-radius: 5px;
            margin-top: 15px;
          }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>📧 New Contact Message</h1>
        </div>
        <div class="content">
          <div class="info-box">
            <div class="label">From:</div>
            <div class="value">${message.name}</div>
            
            <div class="label">Email:</div>
            <div class="value"><a href="mailto:${message.email}">${message.email}</a></div>
            
            <div class="label">Subject:</div>
            <div class="value">${message.subject}</div>
            
            <div class="label">Date:</div>
            <div class="value">${new Date(message.createdAt).toLocaleString()}</div>
          </div>
          
          <div class="label">Message:</div>
          <div class="message-box">${message.message}</div>
          
          ${process.env.CLIENT_URL ? `
          <div style="text-align: center;">
            <a href="${process.env.CLIENT_URL}/admin/messages" class="button">
              View in Admin Panel
            </a>
          </div>
          ` : ''}
        </div>
        <div class="footer">
          <p>This email was sent from your portfolio contact form.</p>
          <p>You can reply directly to this email to respond to ${message.name}.</p>
        </div>
      </body>
      </html>
    `;

    const textContent = `
New Contact Message

From: ${message.name}
Email: ${message.email}
Subject: ${message.subject}
Date: ${new Date(message.createdAt).toLocaleString()}

Message:
${message.message}

---
This email was sent from your portfolio contact form.
You can reply directly to this email to respond to ${message.name}.
    `;

    return await this.sendEmail({
      to: process.env.SMTP_EMAIL,
      subject: `New Contact: ${message.subject}`,
      text: textContent,
      html: htmlContent,
    });
  } catch (error) {
    console.error('Error sending contact notification:', error);
    throw error;
  }
};

// Send welcome email to new user
exports.sendWelcomeEmail = async (user) => {
  try {
    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body {
            font-family: Arial, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
          }
          .header {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 30px;
            text-align: center;
            border-radius: 10px 10px 0 0;
          }
          .content {
            background-color: #f5f5f5;
            padding: 30px;
            border-radius: 0 0 10px 10px;
          }
          .button {
            display: inline-block;
            background-color: #667eea;
            color: white;
            padding: 12px 30px;
            text-decoration: none;
            border-radius: 5px;
            margin-top: 15px;
          }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>🎉 Welcome to Our Portfolio!</h1>
        </div>
        <div class="content">
          <h2>Hi ${user.name}!</h2>
          <p>Thank you for registering. We're excited to have you on board!</p>
          <p>Your account has been successfully created and you can now access all features.</p>
          ${process.env.CLIENT_URL ? `
          <div style="text-align: center;">
            <a href="${process.env.CLIENT_URL}" class="button">Visit Website</a>
          </div>
          ` : ''}
        </div>
      </body>
      </html>
    `;

    return await this.sendEmail({
      to: user.email,
      subject: 'Welcome to Our Portfolio!',
      html: htmlContent,
    });
  } catch (error) {
    console.error('Error sending welcome email:', error);
    throw error;
  }
};

// Send password reset email
exports.sendPasswordResetEmail = async (user, resetToken) => {
  try {
    const resetUrl = `${process.env.CLIENT_URL}/reset-password/${resetToken}`;

    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body {
            font-family: Arial, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
          }
          .header {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 30px;
            text-align: center;
            border-radius: 10px 10px 0 0;
          }
          .content {
            background-color: #f5f5f5;
            padding: 30px;
            border-radius: 0 0 10px 10px;
          }
          .button {
            display: inline-block;
            background-color: #667eea;
            color: white;
            padding: 12px 30px;
            text-decoration: none;
            border-radius: 5px;
            margin-top: 15px;
          }
          .warning {
            background-color: #fff3cd;
            border-left: 4px solid #ffc107;
            padding: 15px;
            margin: 15px 0;
            border-radius: 5px;
          }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>🔐 Password Reset Request</h1>
        </div>
        <div class="content">
          <h2>Hi ${user.name}!</h2>
          <p>You requested to reset your password. Click the button below to proceed:</p>
          <div style="text-align: center;">
            <a href="${resetUrl}" class="button">Reset Password</a>
          </div>
          <div class="warning">
            <strong>⚠️ Important:</strong><br>
            This link will expire in 10 minutes.<br>
            If you didn't request this, please ignore this email.
          </div>
        </div>
      </body>
      </html>
    `;

    const textContent = `
Password Reset Request

Hi ${user.name},

You requested to reset your password. Click the link below to proceed:
${resetUrl}

This link will expire in 10 minutes.

If you didn't request this, please ignore this email.
    `;

    return await this.sendEmail({
      to: user.email,
      subject: 'Password Reset Request',
      text: textContent,
      html: htmlContent,
    });
  } catch (error) {
    console.error('Error sending password reset email:', error);
    throw error;
  }
};

// Send email verification
exports.sendVerificationEmail = async (user, verificationToken) => {
  try {
    const verifyUrl = `${process.env.CLIENT_URL}/verify-email/${verificationToken}`;

    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body {
            font-family: Arial, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
          }
          .header {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 30px;
            text-align: center;
            border-radius: 10px 10px 0 0;
          }
          .content {
            background-color: #f5f5f5;
            padding: 30px;
            border-radius: 0 0 10px 10px;
          }
          .button {
            display: inline-block;
            background-color: #667eea;
            color: white;
            padding: 12px 30px;
            text-decoration: none;
            border-radius: 5px;
            margin-top: 15px;
          }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>✉️ Verify Your Email</h1>
        </div>
        <div class="content">
          <h2>Hi ${user.name}!</h2>
          <p>Please verify your email address by clicking the button below:</p>
          <div style="text-align: center;">
            <a href="${verifyUrl}" class="button">Verify Email</a>
          </div>
          <p style="margin-top: 20px; color: #666;">
            If you didn't create this account, please ignore this email.
          </p>
        </div>
      </body>
      </html>
    `;

    return await this.sendEmail({
      to: user.email,
      subject: 'Verify Your Email Address',
      html: htmlContent,
    });
  } catch (error) {
    console.error('Error sending verification email:', error);
    throw error;
  }
};

// Send reply to contact message
exports.sendContactReply = async (originalMessage, replyText) => {
  try {
    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body {
            font-family: Arial, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
          }
          .header {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 30px;
            text-align: center;
            border-radius: 10px 10px 0 0;
          }
          .content {
            background-color: #f5f5f5;
            padding: 30px;
            border-radius: 0 0 10px 10px;
          }
          .reply-box {
            background-color: white;
            padding: 20px;
            margin: 15px 0;
            border-radius: 5px;
            border-left: 4px solid #667eea;
          }
          .original-message {
            background-color: #f9f9f9;
            padding: 15px;
            margin-top: 20px;
            border-radius: 5px;
            font-size: 14px;
          }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>💬 Response to Your Message</h1>
        </div>
        <div class="content">
          <h2>Hi ${originalMessage.name}!</h2>
          <p>Thank you for contacting us. Here's our response:</p>
          <div class="reply-box">
            ${replyText}
          </div>
          <div class="original-message">
            <strong>Your Original Message:</strong><br>
            <em>Subject: ${originalMessage.subject}</em><br>
            ${originalMessage.message}
          </div>
        </div>
      </body>
      </html>
    `;

    return await this.sendEmail({
      to: originalMessage.email,
      subject: `Re: ${originalMessage.subject}`,
      html: htmlContent,
    });
  } catch (error) {
    console.error('Error sending reply email:', error);
    throw error;
  }
};