const mongoose = require('mongoose');

const RefugeeSchema = new mongoose.Schema({
    fullName: {
        type: String,
        required: [true, 'Please add a name'],
        trim: true
    },
    age: {
        type: Number,
        required: [true, 'Please add age']
    },
    gender: {
        type: String,
        enum: ['Male', 'Female', 'Other'],
        required: [true, 'Please specify gender']
    },
    district: {
        type: String,
        required: [true, 'Please add district']
    },
    healthStatus: {
        type: String,
        default: ''
    },
    assignedCamp: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Camp',
        default: null
    },
    assignedSafeHome: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'SafeHome',
        default: null
    },
    status: {
        type: String,
        enum: ['Safe', 'Medical Needs', 'Transferred'],
        default: 'Safe'
    },
    registeredBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Refugee', RefugeeSchema);
