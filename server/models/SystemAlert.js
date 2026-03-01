const mongoose = require('mongoose');

const systemAlertSchema = new mongoose.Schema({
    message: { type: String, required: true },
    priority: { type: String, enum: ['low', 'medium', 'high', 'critical'], default: 'critical' },
    createdAt: { type: Date, default: Date.now, expires: 86400 } // Auto-delete in 24h
});

module.exports = mongoose.model('SystemAlert', systemAlertSchema);
