const nodemailer = require('nodemailer');

module.exports = async function sendEmail(to, subject, text) {
  try {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to,
      subject,
      text,
    });
  } catch (err) {
    console.error('❌ Email send error:', err.message);
    throw new Error('Email failed to send');
  }
};
