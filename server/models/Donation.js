const mongoose = require('mongoose');

const DonationSchema = new mongoose.Schema({
    type: {
        type: String,
        enum: ['money', 'items'],
        required: [true, 'Please specify donation type']
    },
    category: {
        type: String,
        default: ''
    },
    quantity: {
        type: String,
        default: ''
    },
    pickupAddress: {
        type: String,
        default: ''
    },
    donorName: {
        type: String,
        default: ''
    },
    donorPhone: {
        type: String,
        default: ''
    },
    status: {
        type: String,
        enum: ['Pledged', 'Collected', 'Delivered'],
        default: 'Pledged'
    },
    donorId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        default: null
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Donation', DonationSchema);
