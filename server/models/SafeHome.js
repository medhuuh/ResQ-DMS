const mongoose = require('mongoose');

const SafeHomeSchema = new mongoose.Schema({
    ownerName: {
        type: String,
        required: [true, 'Please add the owner name'],
        trim: true
    },
    phone: {
        type: String,
        required: [true, 'Please add a phone number']
    },
    phone2: {
        type: String,
        default: ''
    },
    capacity: {
        type: Number,
        required: [true, 'Please add capacity'],
        min: 1
    },
    occupied: {
        type: Number,
        default: 0,
        min: 0
    },
    address: {
        type: String,
        required: [true, 'Please add an address']
    },
    location: {
        type: String,
        default: ''
    },
    status: {
        type: String,
        enum: ['Active', 'Inactive'],
        default: 'Active'
    },
    facilities: {
        type: [String],
        default: []
    },
    latitude: {
        type: Number,
        default: null
    },
    longitude: {
        type: Number,
        default: null
    },
    district: {
        type: String,
        default: ''
    },
    ownerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('SafeHome', SafeHomeSchema);
