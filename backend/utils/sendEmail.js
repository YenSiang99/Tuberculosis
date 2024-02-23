const nodemailer = require('nodemailer');
require('dotenv').config(); // Make sure to require dotenv if you haven't already

const sendEmail = async (options) => {
  // Create reusable transporter object using SMTP transport
  const transporter = nodemailer.createTransport({
    service: 'gmail', // No need to set host or port for Gmail
    auth: {
      user: process.env.EMAIL_ADDRESS, // Gmail address
      pass: process.env.EMAIL_APP_PASSWORD, // App Password
    },
  });

  // Define email options
  const mailOptions = {
    from: 'MyTBCompanion <mytbcompanion3@gmail.com>', // Sender address
    to: options.email, // List of recipients
    subject: options.subject, // Subject line
    text: options.message, // Plain text body
    // html: "<p>HTML version of the message</p>" // HTML body
  };

  // Send email
  await transporter.sendMail(mailOptions);
};

module.exports = sendEmail;
