const mongoose = require('mongoose');

const MissingPersonSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please add the person name'],
        trim: true
    },
    age: {
        type: Number,
        default: null
    },
    lastSeenLocation: {
        type: String,
        required: [true, 'Please add last seen location']
    },
    description: {
        type: String,
        default: ''
    },
    photo: {
        type: String,
        default: ''
    },
    status: {
        type: String,
        enum: ['Missing', 'Found'],
        default: 'Missing'
    },
    informantName: {
        type: String,
        default: ''
    },
    informantPhone: {
        type: String,
        default: ''
    },
    reportedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('MissingPerson', MissingPersonSchema);
