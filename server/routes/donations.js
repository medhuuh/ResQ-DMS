const express = require('express');
const router = express.Router();
const Donation = require('../models/Donation');
const { protect, authorize } = require('../middleware/auth');

// @route   GET /api/donations
// @desc    Get all donations
// @access  Private (Admin)
router.get('/', protect, authorize('admin'), async (req, res, next) => {
    try {
        const { type, status } = req.query;
        let query = {};

        if (type) query.type = type;
        if (status) query.status = status;

        const donations = await Donation.find(query).sort('-createdAt');
        res.json({ success: true, count: donations.length, data: donations });
    } catch (err) {
        next(err);
    }
});

// @route   POST /api/donations
// @desc    Submit a donation pledge
// @access  Public
router.post('/', async (req, res, next) => {
    try {
        const donation = await Donation.create(req.body);
        res.status(201).json({ success: true, data: donation });
    } catch (err) {
        next(err);
    }
});

// @route   PUT /api/donations/:id
// @desc    Update donation status
// @access  Private (Admin)
router.put('/:id', protect, authorize('admin'), async (req, res, next) => {
    try {
        let donation = await Donation.findById(req.params.id);
        if (!donation) {
            return res.status(404).json({ success: false, message: 'Donation not found' });
        }

        donation = await Donation.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        });

        res.json({ success: true, data: donation });
    } catch (err) {
        next(err);
    }
});

module.exports = router;
