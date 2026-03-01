const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();

const Landslide = require('./models/Landslide');

const landslideData = [
    { date: '2024-07-30', approxTime: '02:15 AM', district: 'Wayanad', location: 'Mundakkai', category: 'Major', severity: 'Extreme', description: 'Massive debris flow destroying 3 villages' },
    { date: '2024-07-30', approxTime: '04:30 AM', district: 'Wayanad', location: 'Chooralmala', category: 'Major', severity: 'Extreme', description: 'Second massive surge' },
    { date: '2024-07-30', approxTime: '06:00 AM', district: 'Kozhikode', location: 'Vilangad', category: 'Moderate', severity: 'High', description: 'Earth slip destroying bridge and shop' },
    { date: '2023-07-06', approxTime: '09:45 AM', district: 'Idukki', location: 'Munnar Gap Road', category: 'Minor', severity: 'Low', description: 'Rocks falling on NH, Traffic Blocked' },
    { date: '2023-07-07', approxTime: '11:20 PM', district: 'Kannur', location: 'Nedumpoil', category: 'Minor', severity: 'Medium', description: 'Soil erosion near forest road' },
    { date: '2023-08-14', approxTime: '03:30 PM', district: 'Pathanamthitta', location: 'Gavi Route', category: 'Minor', severity: 'Low', description: 'Small earth slip due to afternoon rain' },
    { date: '2022-08-04', approxTime: '05:15 AM', district: 'Thrissur', location: 'Peringalkuthu', category: 'Minor', severity: 'Medium', description: 'Mudslide near dam area' },
    { date: '2022-08-06', approxTime: '01:30 PM', district: 'Idukki', location: 'Adimali', category: 'Minor', severity: 'Medium', description: 'Roadside earth slip' },
    { date: '2021-10-16', approxTime: '11:30 AM', district: 'Kottayam', location: 'Koottickal', category: 'Major', severity: 'High', description: 'Flash flood induced landslide' },
    { date: '2021-10-16', approxTime: '01:30 PM', district: 'Idukki', location: 'Kokkayar', category: 'Major', severity: 'High', description: 'Happened shortly after Koottickal' },
    { date: '2021-10-17', approxTime: '04:00 AM', district: 'Idukki', location: 'Pallarivasal', category: 'Minor', severity: 'Low', description: 'Mud falling on resort road' },
    { date: '2020-08-06', approxTime: '10:30 PM', district: 'Idukki', location: 'Pettimudi (Rajamala)', category: 'Major', severity: 'Extreme', description: 'Tea estate lines destroyed while workers slept' },
    { date: '2020-08-07', approxTime: '07:00 AM', district: 'Wayanad', location: 'Thamarassery Churam', category: 'Minor', severity: 'Medium', description: 'Slip at 8th Hairpin Bend' },
    { date: '2019-08-08', approxTime: '04:00 PM', district: 'Wayanad', location: 'Puthumala', category: 'Major', severity: 'High', description: 'Whole section of hill collapsed' },
    { date: '2019-08-08', approxTime: '07:30 PM', district: 'Malappuram', location: 'Kavalappara', category: 'Major', severity: 'Extreme', description: 'Hill collapsed on colony during heavy rain' },
    { date: '2019-08-09', approxTime: '03:00 AM', district: 'Kannur', location: 'Kottiyoor', category: 'Minor', severity: 'Medium', description: 'Forest landslide near temple' },
    { date: '2018-08-15', approxTime: '02:00 AM', district: 'Thrissur', location: 'Kuranchery', category: 'Major', severity: 'Medium', description: 'House buried, 1 casualty' },
    { date: '2018-08-16', approxTime: '05:00 AM', district: 'Idukki', location: 'Adimali (Multiple)', category: 'Moderate', severity: 'High', description: 'Multiple slips in town area' },
    { date: '2018-08-16', approxTime: '06:30 AM', district: 'Palakkad', location: 'Nenmara', category: 'Major', severity: 'High', description: 'Landslide in forest area affecting houses' },
    { date: '2018-08-17', approxTime: '11:00 PM', district: 'Wayanad', location: 'Vythiri', category: 'Minor', severity: 'Medium', description: 'Road blockage due to heavy rain' },
    { date: '2018-08-18', approxTime: '04:45 AM', district: 'Kannur', location: 'Iritty', category: 'Minor', severity: 'Medium', description: 'Hill slope failure near river' },
    { date: '2018-06-14', approxTime: '08:30 AM', district: 'Kozhikode', location: 'Kattipara', category: 'Major', severity: 'High', description: 'Karinchola Mala slide, 14 casualties' },
    { date: '2017-09-19', approxTime: '02:00 PM', district: 'Kottayam', location: 'Meenachil', category: 'Minor', severity: 'Low', description: 'River bank slump' },
    { date: '2016-06-08', approxTime: '10:00 AM', district: 'Idukki', location: 'Vagamon', category: 'Minor', severity: 'Low', description: 'Minor road blockage' },
    { date: '2015-07-22', approxTime: '04:20 PM', district: 'Kasaragod', location: 'Ranipuram', category: 'Minor', severity: 'Medium', description: 'Small earth slip in eco-tourism area' },
    { date: '2014-07-28', approxTime: '03:30 AM', district: 'Idukki', location: 'Cheeyappara', category: 'Minor', severity: 'Medium', description: 'Waterfall rock fall' },
    { date: '2014-08-02', approxTime: '07:00 AM', district: 'Wayanad', location: 'Mananthavady', category: 'Minor', severity: 'Low', description: 'Slope failure near road' },
    { date: '2022-07-13', approxTime: '11:45 PM', district: 'Kannur', location: 'Cherupuzha', category: 'Minor', severity: 'Low', description: 'Mudflow near rubber plantation' },
    { date: '2023-10-02', approxTime: '05:30 PM', district: 'Trivandrum', location: 'Ponmudi', category: 'Minor', severity: 'Low', description: 'Small rock fall on hairpin' },
    { date: '2018-08-09', approxTime: '02:00 PM', district: 'Idukki', location: 'Cheruthoni', category: 'Moderate', severity: 'High', description: 'Near Dam shutters due to overflow' },
    { date: '2021-10-16', approxTime: '12:00 PM', district: 'Pathanamthitta', location: 'Seethathode', category: 'Minor', severity: 'Medium', description: 'Flash flood triggered slip' },
    { date: '2019-08-10', approxTime: '06:00 AM', district: 'Wayanad', location: 'Meppadi', category: 'Minor', severity: 'Medium', description: 'Estate road collapse' },
    { date: '2024-06-15', approxTime: '08:00 AM', district: 'Idukki', location: 'Neriyamangalam', category: 'Minor', severity: 'Low', description: 'Forest border slip' },
    { date: '2020-08-09', approxTime: '09:00 PM', district: 'Palakkad', location: 'Attappadi', category: 'Minor', severity: 'Low', description: 'Ghat road damage' },
];

const seedLandslides = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('MongoDB connected for landslide seeding...');

        await Landslide.deleteMany();
        console.log('Existing landslide data cleared');

        await Landslide.create(landslideData);
        console.log(`✅ ${landslideData.length} landslide records seeded (2014–2024)`);

        // Print summary by district
        const summary = {};
        landslideData.forEach(l => {
            summary[l.district] = (summary[l.district] || 0) + 1;
        });
        console.log('\n📊 Records by district:');
        Object.entries(summary).sort((a, b) => b[1] - a[1]).forEach(([d, c]) => {
            console.log(`   ${d}: ${c} events`);
        });

        process.exit(0);
    } catch (err) {
        console.error('❌ Seeding failed:', err.message);
        process.exit(1);
    }
};

seedLandslides();
