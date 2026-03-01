const mongoose = require('mongoose');

const CampSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please add a camp name'],
        trim: true
    },
    location: {
        type: String,
        required: [true, 'Please add a location']
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
    status: {
        type: String,
        enum: ['Active', 'Inactive', 'Full'],
        default: 'Active'
    },
    phone1: {
        type: String,
        default: ''
    },
    phone2: {
        type: String,
        default: ''
    },
    inChargePerson: {
        type: String,
        default: ''
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
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Camp', CampSchema);
