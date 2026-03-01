const mongoose = require('mongoose');

const VolunteerSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please add a name'],
        trim: true
    },
    age: {
        type: Number,
        default: null
    },
    phone: {
        type: String,
        required: [true, 'Please add a phone number']
    },
    bloodGroup: {
        type: String,
        enum: ['O+', 'O-', 'A+', 'A-', 'B+', 'B-', 'AB+', 'AB-'],
        default: 'O+'
    },
    expertise: {
        type: String,
        enum: ['General Rescue', 'Medical Aid', 'Logistics & Supply', 'Counselling'],
        default: 'General Rescue'
    },
    district: {
        type: String,
        required: [true, 'Please add district']
    },
    location: {
        type: String,
        default: ''
    },
    role: {
        type: String,
        default: 'General'
    },
    photo: {
        type: String,
        default: ''
    },
    email: {
        type: String,
        default: ''
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        default: null
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Volunteer', VolunteerSchema);
