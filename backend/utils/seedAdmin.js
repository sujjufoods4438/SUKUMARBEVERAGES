const User = require('../models/User');

const seedAdmin = async () => {
  try {
    const adminEmail = 'chandrasekharuppu004@gmail.com';
    const adminExists = await User.findOne({ email: adminEmail });

    if (!adminExists) {
      await User.create({
        name: 'Super Admin',
        email: adminEmail,
        phone: '9999999999',
        password: 'CHINNU@4438@sujjufoods',
        role: 'admin',
        address: {
          street: 'Admin HQ',
          city: 'Vijayawada',
          pincode: '520001'
        },
        registrationPaid: true
      });
      console.log('✅ Admin user seeded successfully');
    } else {
      // Update password just in case
      adminExists.password = 'CHINNU@4438@sujjufoods';
      await adminExists.save();
      console.log('ℹ️ Admin user already exists (Password updated)');
    }
  } catch (err) {
    console.error('❌ Error seeding admin:', err.message);
  }
};

module.exports = seedAdmin;
