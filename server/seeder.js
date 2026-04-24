const mongoose = require('mongoose');
const dotenv = require('dotenv');
const bcrypt = require('bcryptjs');

// Load env vars
dotenv.config();

// Load models
const User = require('./models/User');
const Camp = require('./models/Camp');
const SafeHome = require('./models/SafeHome');
const MissingPerson = require('./models/MissingPerson');
const Volunteer = require('./models/Volunteer');

const seedData = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('MongoDB connected for seeding...');

        // Clear existing data
        await User.deleteMany();
        await Camp.deleteMany();
        await SafeHome.deleteMany();
        await MissingPerson.deleteMany();
        await Volunteer.deleteMany();
        console.log('Existing data cleared');

        // ====== USERS ======
        const adminUser = await User.create({
            firstName: 'Admin',
            lastName: 'User',
            email: 'admin@resq-dms.com',
            password: 'admin123',
            phone: '+91 98765 43210',
            role: 'admin',
            district: 'Wayanad'
        });

        const volunteerUser = await User.create({
            firstName: 'Arjun',
            lastName: 'Narayan',
            email: 'volunteer@resq-dms.com',
            password: 'volunteer123',
            phone: '+91 98765 12345',
            role: 'volunteer',
            district: 'Wayanad',
            preferredDistrict: 'Wayanad'
        });

        const hostUser = await User.create({
            firstName: 'Meera',
            lastName: 'Krishna',
            email: 'host@resq-dms.com',
            password: 'host123',
            phone: '+91 98765 00001',
            role: 'host',
            district: 'Wayanad',
            propertyAddress: 'Kalpetta, Wayanad'
        });

        const citizenUser = await User.create({
            firstName: 'Rahul',
            lastName: 'Kumar',
            email: 'citizen@resq-dms.com',
            password: 'citizen123',
            phone: '+91 88776 54321',
            role: 'citizen',
            district: 'Ernakulam'
        });

        console.log('✅ Users seeded');

        // ====== CAMPS ======
        const camps = await Camp.insertMany([
            {
                name: 'Govt High School Camp 1',
                location: 'Wayanad',
                capacity: 200,
                occupied: 150,
                status: 'Active',
                phone1: '+91 98765 43210',
                phone2: '+91 98765 43211',
                inChargePerson: 'Suresh Kumar',
                facilities: ['Food', 'Water', 'Medical', 'Bedding'],
                createdBy: adminUser._id
            },
            {
                name: 'Govt High School Camp 2',
                location: 'Wayanad',
                capacity: 300,
                occupied: 280,
                status: 'Active',
                phone1: '+91 98765 43212',
                phone2: '+91 98765 43213',
                inChargePerson: 'Priya Nair',
                facilities: ['Food', 'Water', 'Bedding', 'Power'],
                createdBy: adminUser._id
            },
            {
                name: 'Govt High School Camp 3',
                location: 'Wayanad',
                capacity: 150,
                occupied: 45,
                status: 'Active',
                phone1: '+91 98765 43214',
                phone2: '+91 98765 43215',
                inChargePerson: 'Rajesh Menon',
                facilities: ['Food', 'Water', 'Medical'],
                createdBy: adminUser._id
            }
        ]);
        console.log('✅ Camps seeded');

        // ====== SAFE HOMES ======
        const safeHomes = await SafeHome.insertMany([
            {
                ownerName: 'Villa Serenity 1',
                phone: '+91 98765 00001',
                phone2: '+91 98765 00002',
                capacity: 8,
                occupied: 0,
                address: 'Near Lake Road, Kalpetta',
                location: 'Wayanad, Kalpetta',
                status: 'Active',
                facilities: ['Private Rooms', 'Shared Kitchen', 'Wi-Fi'],
                ownerId: hostUser._id
            },
            {
                ownerName: 'Villa Serenity 2',
                phone: '+91 98765 00003',
                phone2: '+91 98765 00004',
                capacity: 12,
                occupied: 4,
                address: 'Main Road, Kalpetta',
                location: 'Wayanad, Kalpetta',
                status: 'Active',
                facilities: ['Private Rooms', 'Shared Kitchen', 'Medical Aid', 'Pet Friendly'],
                ownerId: hostUser._id
            }
        ]);
        console.log('✅ Safe Homes seeded');

        // ====== MISSING PERSONS ======
        await MissingPerson.insertMany([
            {
                name: 'Ananya Suresh',
                age: 22,
                lastSeenLocation: 'Town Hall, Wayanad',
                description: 'Wearing blue salwar, last seen near Town Hall',
                status: 'Missing',
                informantName: 'Suresh K',
                informantPhone: '+91 98765 11111',
                reportedBy: adminUser._id
            },
            {
                name: 'Rajan Pillai',
                age: 55,
                lastSeenLocation: 'Market Road, Wayanad',
                description: 'Elderly male, grey hair, wearing white mundu',
                status: 'Found',
                informantName: 'Geetha P',
                informantPhone: '+91 98765 22222',
                reportedBy: adminUser._id
            },
            {
                name: 'Meera Nair',
                age: 30,
                lastSeenLocation: 'Bus Stand, Wayanad',
                description: 'Medium build, wearing green churidar',
                status: 'Missing',
                informantName: 'Vijay N',
                informantPhone: '+91 98765 33333',
                reportedBy: adminUser._id
            }
        ]);
        console.log('✅ Missing Persons seeded');

        // ====== VOLUNTEERS ======
        await Volunteer.insertMany([
            { name: 'Arjun Narayan', age: 28, phone: '+91 98765 12345', bloodGroup: 'O+', expertise: 'Medical Aid', district: 'Wayanad', location: 'Meppadi', role: 'Medical', userId: volunteerUser._id },
            { name: 'Fatima Hameed', age: 32, phone: '+91 99887 66554', bloodGroup: 'A+', expertise: 'General Rescue', district: 'Kozhikode', location: 'Vilangad', role: 'Rescue' },
            { name: 'John Mathew', age: 35, phone: '+91 88776 54321', bloodGroup: 'B+', expertise: 'Logistics & Supply', district: 'Malappuram', location: 'Nilambur', role: 'Logistics' },
            { name: 'Sreejith K', age: 26, phone: '+91 77665 43210', bloodGroup: 'O+', expertise: 'General Rescue', district: 'Wayanad', location: 'Chooralmala', role: 'General' },
            { name: 'Deepa Thomas', age: 30, phone: '+91 66554 32109', bloodGroup: 'AB+', expertise: 'Medical Aid', district: 'Kannur', location: 'Iritty', role: 'Medical' },
            { name: 'Rahul Krishna', age: 29, phone: '+91 98765 00000', bloodGroup: 'A+', expertise: 'General Rescue', district: 'Wayanad', location: 'Kalpetta', role: 'Rescue' }
        ]);
        console.log('✅ Volunteers seeded');

        console.log('\n🎉 All data seeded successfully!');
        console.log('\n📋 Login Credentials:');
        console.log('   Admin:     admin@resq-dms.com / admin123');
        console.log('   Volunteer: volunteer@resq-dms.com / volunteer123');
        console.log('   Host:      host@resq-dms.com / host123');
        console.log('   Citizen:   citizen@resq-dms.com / citizen123');

        process.exit(0);
    } catch (err) {
        console.error('❌ Seeding failed:', err.message);
        process.exit(1);
    }
};

seedData();
