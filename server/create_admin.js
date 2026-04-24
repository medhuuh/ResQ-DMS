require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

async function createAdmin() {
    try {
        await mongoose.connect('mongodb+srv://midhunsha005:wSUnU46XnQ2QyUIf@resq-dms.2yihz.mongodb.net/resq-dms?retryWrites=true&w=majority&appName=ResQ-DMS');
        const User = require('./models/User');

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash('qwer1234', salt);

        const admin = await User.create({
            name: 'Muju Admin',
            email: 'muju@resqdms.com',
            password: hashedPassword,
            role: 'admin'
        });

        console.log('✅ Admin user created successfully!');
        console.log('Email:', admin.email);
    } catch (err) {
        if (err.code === 11000) {
            console.log('⚠️ User already exists!');
        } else {
            console.error('ERROR:', err.message);
        }
    } finally {
        process.exit();
    }
}
createAdmin();
