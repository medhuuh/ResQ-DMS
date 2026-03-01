const express = require('express');
const router = express.Router();
const Refugee = require('../models/Refugee');
const { protect, authorize } = require('../middleware/auth');

// @route   GET /api/refugees
// @desc    Get all refugees (with search/filter)
// @access  Private (Admin)
router.get('/', protect, authorize('admin'), async (req, res, next) => {
    try {
        const { search, district, status, camp } = req.query;
        let query = {};

        if (search) {
            query.$or = [
                { fullName: { $regex: search, $options: 'i' } },
                { district: { $regex: search, $options: 'i' } }
            ];
        }
        if (district) query.district = district;
        if (status) query.status = status;
        if (camp) query.assignedCamp = camp;

        const refugees = await Refugee.find(query)
            .populate('assignedCamp', 'name location')
            .populate('assignedSafeHome', 'ownerName location')
            .sort('-createdAt');

        res.json({ success: true, count: refugees.length, data: refugees });
    } catch (err) {
        next(err);
    }
});

// @route   GET /api/refugees/:id
// @desc    Get single refugee
// @access  Private (Admin)
router.get('/:id', protect, authorize('admin'), async (req, res, next) => {
    try {
        const refugee = await Refugee.findById(req.params.id)
            .populate('assignedCamp', 'name location')
            .populate('assignedSafeHome', 'ownerName location');

        if (!refugee) {
            return res.status(404).json({ success: false, message: 'Refugee not found' });
        }

        res.json({ success: true, data: refugee });
    } catch (err) {
        next(err);
    }
});

// @route   POST /api/refugees
// @desc    Register a new refugee
// @access  Private (Admin)
router.post('/', protect, authorize('admin'), async (req, res, next) => {
    try {
        req.body.registeredBy = req.user.id;
        const refugee = await Refugee.create(req.body);
        res.status(201).json({ success: true, data: refugee });
    } catch (err) {
        next(err);
    }
});

// @route   PUT /api/refugees/:id
// @desc    Update refugee (status, assignment, etc.)
// @access  Private (Admin)
router.put('/:id', protect, authorize('admin'), async (req, res, next) => {
    try {
        let refugee = await Refugee.findById(req.params.id);
        if (!refugee) {
            return res.status(404).json({ success: false, message: 'Refugee not found' });
        }

        refugee = await Refugee.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        });

        res.json({ success: true, data: refugee });
    } catch (err) {
        next(err);
    }
});

// @route   DELETE /api/refugees/:id
// @desc    Delete a refugee record
// @access  Private (Admin)
router.delete('/:id', protect, authorize('admin'), async (req, res, next) => {
    try {
        const refugee = await Refugee.findById(req.params.id);
        if (!refugee) {
            return res.status(404).json({ success: false, message: 'Refugee not found' });
        }

        await refugee.deleteOne();
        res.json({ success: true, data: {} });
    } catch (err) {
        next(err);
    }
});

module.exports = router;
