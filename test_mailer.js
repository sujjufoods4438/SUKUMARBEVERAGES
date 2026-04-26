const { sendOtpSms } = require('./backend/utils/mailer');

async function test() {
    console.log('Running SMS log test...');
    await sendOtpSms('9999999999', '654321');
    process.exit(0);
}

test();
