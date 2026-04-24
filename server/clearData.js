const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();

const User = require('./models/User');
const Camp = require('./models/Camp');
const SafeHome = require('./models/SafeHome');
const MissingPerson = require('./models/MissingPerson');
const Volunteer = require('./models/Volunteer');

const clearAll = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('MongoDB connected...');

        await User.deleteMany();
        await Camp.deleteMany();
        await SafeHome.deleteMany();
        await MissingPerson.deleteMany();
        await Volunteer.deleteMany();

        console.log('✅ All data cleared from all collections!');
        console.log('   You can now add your own data via the app or API.');
        process.exit(0);
    } catch (err) {
        console.error('❌ Error:', err.message);
        process.exit(1);
    }
};

clearAll();
