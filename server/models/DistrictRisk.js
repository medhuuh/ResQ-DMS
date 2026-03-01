const mongoose = require('mongoose');

const districtRiskSchema = new mongoose.Schema({
    district: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    riskLevel: {
        type: String,
        enum: ['Auto', 'Safe', 'Moderate', 'High'],
        default: 'Auto'
    },
    lastUpdatedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }
}, { timestamps: true });

module.exports = mongoose.model('DistrictRisk', districtRiskSchema);
