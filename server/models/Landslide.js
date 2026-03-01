const mongoose = require('mongoose');

const LandslideSchema = new mongoose.Schema({
    date: {
        type: Date,
        required: true
    },
    approxTime: {
        type: String
    },
    district: {
        type: String,
        required: true
    },
    location: {
        type: String,
        required: true
    },
    category: {
        type: String,
        enum: ['Minor', 'Moderate', 'Major'],
        default: 'Minor'
    },
    severity: {
        type: String,
        enum: ['Low', 'Medium', 'High', 'Extreme'],
        default: 'Low'
    },
    description: {
        type: String
    },
    // Derived fields for quick querying
    month: {
        type: Number  // 1-12
    },
    week: {
        type: Number  // 1-53 (ISO week)
    },
    dayOfYear: {
        type: Number  // 1-366
    }
}, { timestamps: true });

// Pre-validate: auto-calculate month, week, dayOfYear
LandslideSchema.pre('validate', function () {
    const d = new Date(this.date);
    this.month = d.getMonth() + 1;

    // ISO week number
    const startOfYear = new Date(d.getFullYear(), 0, 1);
    const days = Math.floor((d - startOfYear) / (24 * 60 * 60 * 1000));
    this.week = Math.ceil((days + startOfYear.getDay() + 1) / 7);
    this.dayOfYear = days + 1;
});

module.exports = mongoose.model('Landslide', LandslideSchema);
