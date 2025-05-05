// utils/email.js
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail', // or 'smtp.mailtrap.io', 'SendGrid', etc.
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  }
});

async function sendReservationConfirmation({ to, name, date, time, guests, tableNumber, duration }) {
  const mailOptions = {
    from: `"The Golden Fork" <${process.env.SMTP_USER}>`,
    to,
    subject: '🪄 Your Reservation is Confirmed!',
    html: `
      <h2>Dear ${name},</h2>
      <p>Thank you for choosing us!</p>
      <ul>
        <li><strong>Date:</strong> ${date}</li>
        <li><strong>Time:</strong> ${time}</li>
        <li><strong>Duration:</strong> ${duration} hour(s)</li>
        <li><strong>Guests:</strong> ${guests}</li>
        <li><strong>Table:</strong> #${tableNumber}</li>
      </ul>
      <p>We look forward to serving you 🍽️</p>
      <p>Best,<br>The Golden Fork Team</p>
    `
  };

  return transporter.sendMail(mailOptions);
}

module.exports = { sendReservationConfirmation };
