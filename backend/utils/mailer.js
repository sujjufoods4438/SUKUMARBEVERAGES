const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

const sendInvoiceEmail = async (toEmail, userName, bill) => {
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; background: #f4f4f4; }
        .container { max-width: 600px; margin: 0 auto; background: #fff; border-radius: 12px; overflow: hidden; }
        .header { background: linear-gradient(135deg, #00b4d8, #0077b6); padding: 30px; text-align: center; color: #fff; }
        .header h1 { margin: 0; font-size: 28px; letter-spacing: 2px; }
        .header p { margin: 5px 0 0; font-size: 14px; opacity: 0.85; }
        .body { padding: 30px; }
        .info-row { display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid #eee; font-size: 14px; }
        .label { color: #555; }
        .value { font-weight: bold; color: #222; }
        .total-row { background: #e8f4f8; border-radius: 8px; padding: 15px; margin-top: 20px; display: flex; justify-content: space-between; }
        .total-label { font-size: 18px; font-weight: bold; color: #0077b6; }
        .total-value { font-size: 22px; font-weight: bold; color: #0077b6; }
        .footer { background: #0077b6; color: #fff; text-align: center; padding: 20px; font-size: 13px; }
        .badge { display: inline-block; background: #00b4d8; border-radius: 20px; padding: 4px 12px; font-size: 12px; margin-top: 10px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>💧 AW Alkaline Water</h1>
          <p>Sukumar Industries – Premium Alkaline Water</p>
        </div>
        <div class="body">
          <h2>Hello, ${userName}!</h2>
          <p>Your 15-day billing statement is ready. Please find the details below:</p>
          <div class="info-row"><span class="label">Bill Number:</span><span class="value">${bill.billNumber}</span></div>
          <div class="info-row"><span class="label">Billing Period:</span><span class="value">${new Date(bill.periodStart).toDateString()} – ${new Date(bill.periodEnd).toDateString()}</span></div>
          <div class="info-row"><span class="label">Subtotal:</span><span class="value">₹${bill.subtotal}</span></div>
          <div class="info-row"><span class="label">Discount:</span><span class="value">-₹${bill.discount}</span></div>
          <div class="info-row"><span class="label">GST (18%):</span><span class="value">₹${bill.gstAmount.toFixed(2)}</span></div>
          <div class="total-row">
            <span class="total-label">Total Due:</span>
            <span class="total-value">₹${bill.totalAmount.toFixed(2)}</span>
          </div>
          <p style="margin-top:20px; color:#555; font-size: 14px;">
            <strong>Due Date:</strong> ${new Date(bill.dueDate).toDateString()}<br/>
            Pay via UPI, Net Banking, or Card. GST invoice attached.
          </p>
          <div class="badge">pH 8.5 Certified Alkaline Water</div>
        </div>
        <div class="footer">
          Sukumar Industries | Head Office: Vijayawada | Branch: Hyderabad<br/>
          📞 Customer Care: 1800-XXX-XXXX | ✉ info@sukumarindustries.com
        </div>
      </div>
    </body>
    </html>
  `;
  await transporter.sendMail({
    from: `"AW Alkaline Water – Sukumar Industries" <${process.env.EMAIL_USER}>`,
    to: toEmail,
    subject: `Your AW Alkaline Water Bill – ${bill.billNumber}`,
    html
  });
};

const sendOtpEmail = async (toEmail, userName, otp) => {
  const html = `
    <div style="font-family: Arial, sans-serif; background: #f4f4f4; padding: 20px;">
      <div style="max-width: 600px; margin: 0 auto; background: #fff; border-radius: 12px; overflow: hidden; padding: 30px; text-align: center;">
        <h2 style="color: #0077b6;">💧 AW Alkaline Water Verification</h2>
        <p>Hello ${userName},</p>
        <p>Your Email Verification OTP is:</p>
        <h1 style="font-size: 36px; letter-spacing: 4px; color: #00b4d8; background: rgba(0,180,216,0.1); padding: 10px; border-radius: 8px; display: inline-block;">${otp}</h1>
        <p style="color: #555; margin-top: 20px;">Please enter this code to complete your registration.</p>
      </div>
    </div>
  `;
  try {
    await transporter.sendMail({
      from: `"AW Alkaline Water" <${process.env.EMAIL_USER}>`,
      to: toEmail,
      subject: `[${otp}] Your AW Verification Code`,
      html
    });
  } catch (err) {
    console.error(`❌ Email Failed: ${err.message}`);
    throw new Error('Failed to send email OTP');
  }
};

const sendWelcomeEmail = async (toEmail, userName, referralCode) => {
  const html = `
    <div style="font-family: Arial, sans-serif; background: #f4f4f4; padding: 20px;">
      <div style="max-width: 600px; margin: 0 auto; background: #fff; border-radius: 12px; overflow: hidden; padding: 30px; text-align: center;">
        <h2 style="color: #0077b6;">🎉 Welcome to the AW Family!</h2>
        <p>Hello ${userName},</p>
        <p>Your registration is complete! You have received <strong>3 FREE Bottles</strong> of our premium 8.5 pH Alkaline Water.</p>
        <div style="background: rgba(255,215,0,0.15); border: 1px solid #f59e0b; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <p style="margin: 0; color: #555;">Your Unique Referral Code:</p>
          <h1 style="margin: 10px 0 0; color: #f59e0b; letter-spacing: 2px;">${referralCode}</h1>
        </div>
        <p style="color: #555;">Share this code with up to 2 friends. When they register, they get 25% off, and you earn a lifetime 25% discount per referral!</p>
      </div>
    </div>
  `;
  try {
    await transporter.sendMail({
      from: `"AW Alkaline Water" <${process.env.EMAIL_USER}>`,
      to: toEmail,
      subject: `Welcome to AW Alkaline! Here is your Referral Code 💧`,
      html
    });
  } catch (err) { console.log('Mock Welcome Email Sent:', referralCode); }
};

const sendOtpSms = async (phone, otp) => {
  const message = `Your AW Verification Code: ${otp}`;
  console.log(`[SMS] To: ${phone} | Message: ${message}`);
};

const sendWhatsAppBill = async (phone, userName, bill) => {
  const message = `
💧 *AW Alkaline Water Bill*
Hello ${userName}, your bill for ${new Date(bill.periodStart).toLocaleDateString()} to ${new Date(bill.periodEnd).toLocaleDateString()} is ready.
*Bill No:* ${bill.billNumber}
*Total Amount:* ₹${bill.totalAmount.toFixed(2)}
*Due Date:* ${new Date(bill.dueDate).toLocaleDateString()}
_Sukumar Industries_
  `;
  console.log(`[REAL-TIME WHATSAPP] To: ${phone} | Message: ${message}`);
};

module.exports = { sendInvoiceEmail, sendOtpEmail, sendWelcomeEmail, sendWhatsAppBill, sendOtpSms };
