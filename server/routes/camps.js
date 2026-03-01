const express = require('express');
const router = express.Router();
const Camp = require('../models/Camp');
const { protect, authorize } = require('../middleware/auth');
const geocodeAddress = require('../utils/geocode');

// @route   GET /api/camps
// @desc    Get all camps
// @access  Public
router.get('/', async (req, res, next) => {
    try {
        const { status, location, search } = req.query;
        let query = {};

        if (status) query.status = status;
        if (location) query.location = { $regex: location, $options: 'i' };
        if (search) {
            query.$or = [
                { name: { $regex: search, $options: 'i' } },
                { location: { $regex: search, $options: 'i' } }
            ];
        }

        const camps = await Camp.find(query).sort('-createdAt');
        res.json({ success: true, count: camps.length, data: camps });
    } catch (err) {
        next(err);
    }
});

// @route   GET /api/camps/:id
// @desc    Get single camp
// @access  Public
router.get('/:id', async (req, res, next) => {
    try {
        const camp = await Camp.findById(req.params.id);
        if (!camp) {
            return res.status(404).json({ success: false, message: 'Camp not found' });
        }
        res.json({ success: true, data: camp });
    } catch (err) {
        next(err);
    }
});

// @route   POST /api/camps
// @desc    Create a camp
// @access  Private (Admin, Volunteer)
router.post('/', protect, authorize('admin', 'volunteer'), async (req, res, next) => {
    try {
        req.body.createdBy = req.user.id;

        // Auto-geocode the location/address
        const address = req.body.location || req.body.address || '';
        if (address && (!req.body.latitude || !req.body.longitude)) {
            const coords = await geocodeAddress(address);
            if (coords) {
                req.body.latitude = coords.lat;
                req.body.longitude = coords.lng;
            }
        }

        const camp = await Camp.create(req.body);
        res.status(201).json({ success: true, data: camp });
    } catch (err) {
        next(err);
    }
});

// @route   PUT /api/camps/:id
// @desc    Update a camp
// @access  Private (Admin, Volunteer)
router.put('/:id', protect, authorize('admin', 'volunteer'), async (req, res, next) => {
    try {
        let camp = await Camp.findById(req.params.id);
        if (!camp) {
            return res.status(404).json({ success: false, message: 'Camp not found' });
        }

        // Re-geocode if location changed
        const newLocation = req.body.location || req.body.address;
        if (newLocation && newLocation !== camp.location) {
            const coords = await geocodeAddress(newLocation);
            if (coords) {
                req.body.latitude = coords.lat;
                req.body.longitude = coords.lng;
            }
        }

        camp = await Camp.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        });

        res.json({ success: true, data: camp });
    } catch (err) {
        next(err);
    }
});

// @route   DELETE /api/camps/:id
// @desc    Delete a camp
// @access  Private (Admin)
router.delete('/:id', protect, authorize('admin'), async (req, res, next) => {
    try {
        const camp = await Camp.findById(req.params.id);
        if (!camp) {
            return res.status(404).json({ success: false, message: 'Camp not found' });
        }

        await camp.deleteOne();
        res.json({ success: true, data: {} });
    } catch (err) {
        next(err);
    }
});

module.exports = router;
