const Admin = require('../models/Admin');
const jwt = require('jsonwebtoken');

// 🔥 Auto-create default admin if none exists
exports.initializeAdmin = async () => {
  console.log('🔥 Running initializeAdmin()');
  try {
    const exists = await Admin.findOne({ username: 'Admin' });
    if (!exists) {
      await Admin.create({ username: 'Admin', password: 'admin911' }); // Will be hashed via Admin model
      console.log('✅ Default admin account created');
    } else {
      console.log('ℹ️ Admin already exists');
    }
  } catch (err) {
    console.error('❌ Error creating admin account:', err.message);
  }
};

// 🔐 Admin login with debug logging
exports.login = async (req, res) => {
  const { username, password } = req.body;

  console.log('\n🛂 Login Attempt');
  console.log('👤 Provided Username:', username);
  console.log('🔑 Provided Password:', password);

  try {
    const admin = await Admin.findOne({ username });

    if (!admin) {
      console.log('❌ No admin found with that username');
      return res.status(401).json({ message: 'Invalid credentials (no admin)' });
    }

    console.log('✅ Admin found:', admin.username);
    console.log('🔐 Stored Hashed Password:', admin.password);

    const isMatch = await admin.comparePassword(password);
    console.log('🔍 Password Match Result:', isMatch);

    if (!isMatch) {
      console.log('❌ Incorrect password');
      return res.status(401).json({ message: 'Invalid credentials (wrong password)' });
    }

    const token = jwt.sign({ id: admin._id }, process.env.JWT_SECRET || 'secret', {
      expiresIn: '1d',
    });

    console.log('🎉 Login Success. Token generated.');
    res.json({ token });

  } catch (err) {
    console.error('❌ Error during login:', err.message);
    res.status(500).json({ message: 'Server error' });
  }
};
