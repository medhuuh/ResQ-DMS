const express = require('express');
const router = express.Router();
const SafeHome = require('../models/SafeHome');
const { protect, authorize } = require('../middleware/auth');
const geocodeAddress = require('../utils/geocode');

// @route   GET /api/safe-homes
// @desc    Get all safe homes
// @access  Public
router.get('/', async (req, res, next) => {
    try {
        const { status, location, search } = req.query;
        let query = {};

        if (status) query.status = status;
        if (location) query.location = { $regex: location, $options: 'i' };
        if (search) {
            query.$or = [
                { ownerName: { $regex: search, $options: 'i' } },
                { location: { $regex: search, $options: 'i' } },
                { address: { $regex: search, $options: 'i' } }
            ];
        }

        const homes = await SafeHome.find(query).sort('-createdAt');
        res.json({ success: true, count: homes.length, data: homes });
    } catch (err) {
        next(err);
    }
});

// @route   GET /api/safe-homes/:id
// @desc    Get single safe home
// @access  Public
router.get('/:id', async (req, res, next) => {
    try {
        const home = await SafeHome.findById(req.params.id);
        if (!home) {
            return res.status(404).json({ success: false, message: 'Safe home not found' });
        }
        res.json({ success: true, data: home });
    } catch (err) {
        next(err);
    }
});

// @route   POST /api/safe-homes
// @desc    Create a safe home
// @access  Private (Admin, Host)
router.post('/', protect, authorize('admin', 'host'), async (req, res, next) => {
    try {
        req.body.ownerId = req.user.id;

        // Auto-geocode the address
        const address = req.body.address || req.body.location || '';
        if (address && (!req.body.latitude || !req.body.longitude)) {
            const coords = await geocodeAddress(address);
            if (coords) {
                req.body.latitude = coords.lat;
                req.body.longitude = coords.lng;
            }
        }

        const home = await SafeHome.create(req.body);
        res.status(201).json({ success: true, data: home });
    } catch (err) {
        next(err);
    }
});

// @route   PUT /api/safe-homes/:id
// @desc    Update a safe home
// @access  Private (Admin, Host - owner only)
router.put('/:id', protect, authorize('admin', 'host'), async (req, res, next) => {
    try {
        let home = await SafeHome.findById(req.params.id);
        if (!home) {
            return res.status(404).json({ success: false, message: 'Safe home not found' });
        }

        // Check ownership for hosts
        if (req.user.role === 'host' && home.ownerId && home.ownerId.toString() !== req.user.id) {
            return res.status(403).json({ success: false, message: 'Not authorized to update this safe home' });
        }

        // Re-geocode if address changed
        const newAddress = req.body.address || req.body.location;
        if (newAddress && newAddress !== home.address) {
            const coords = await geocodeAddress(newAddress);
            if (coords) {
                req.body.latitude = coords.lat;
                req.body.longitude = coords.lng;
            }
        }

        home = await SafeHome.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        });

        res.json({ success: true, data: home });
    } catch (err) {
        next(err);
    }
});

// @route   DELETE /api/safe-homes/:id
// @desc    Delete a safe home
// @access  Private (Admin, Host - owner only)
router.delete('/:id', protect, authorize('admin', 'host'), async (req, res, next) => {
    try {
        const home = await SafeHome.findById(req.params.id);
        if (!home) {
            return res.status(404).json({ success: false, message: 'Safe home not found' });
        }

        if (req.user.role === 'host' && home.ownerId && home.ownerId.toString() !== req.user.id) {
            return res.status(403).json({ success: false, message: 'Not authorized to delete this safe home' });
        }

        await home.deleteOne();
        res.json({ success: true, data: {} });
    } catch (err) {
        next(err);
    }
});

module.exports = router;
