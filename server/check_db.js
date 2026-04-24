const mongoose = require('mongoose');
const fs = require('fs');
require('dotenv').config();

async function dump() {
    try {
        await mongoose.connect(process.env.MONGO_URI || 'mongodb+srv://midhunsha005:wSUnU46XnQ2QyUIf@resq-dms.2yihz.mongodb.net/resq-dms?retryWrites=true&w=majority&appName=ResQ-DMS');
        const MissingPerson = require('./models/MissingPerson');
        const data = await MissingPerson.find().sort({createdAt: -1}).lean();
        fs.writeFileSync('C:/tmp/missing_dump.json', JSON.stringify(data, null, 2));
        console.log('SUCCESS');
    } catch (err) {
        console.error('ERROR:', err);
    } finally {
        process.exit();
    }
}
dump();
