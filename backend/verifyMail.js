require('dotenv').config();
const nodemailer = require('nodemailer');
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});
transporter.verify((err, success) => {
  if (err) {
    console.error('VERIFY ERROR', err);
    process.exit(1);
  }
  console.log('SMTP Verified');
  process.exit(0);
});