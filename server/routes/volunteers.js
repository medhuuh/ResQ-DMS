const express = require('express');
const router = express.Router();
const Volunteer = require('../models/Volunteer');
const User = require('../models/User');
const { protect, authorize } = require('../middleware/auth');

// @route   GET /api/volunteers
// @desc    Get all volunteers (with district/search filter)
// @access  Public
router.get('/', async (req, res, next) => {
    try {
        const { search, district, expertise } = req.query;
        let query = {};

        if (search) {
            query.$or = [
                { name: { $regex: search, $options: 'i' } },
                { location: { $regex: search, $options: 'i' } }
            ];
        }
        if (district && district !== 'All') query.district = district;
        if (expertise) query.expertise = expertise;

        const volunteers = await Volunteer.find(query).sort('-createdAt');
        res.json({ success: true, count: volunteers.length, data: volunteers });
    } catch (err) {
        next(err);
    }
});

// @route   GET /api/volunteers/:id
// @desc    Get single volunteer
// @access  Public
router.get('/:id', async (req, res, next) => {
    try {
        const volunteer = await Volunteer.findById(req.params.id);
        if (!volunteer) {
            return res.status(404).json({ success: false, message: 'Volunteer not found' });
        }
        res.json({ success: true, data: volunteer });
    } catch (err) {
        next(err);
    }
});

// @route   POST /api/volunteers
// @desc    Register as volunteer (creates user account + volunteer profile)
// @access  Public
router.post('/', async (req, res, next) => {
    try {
        const { name, age, phone, bloodGroup, expertise, district, location, email, password } = req.body;

        // Validate email and password
        if (!email || !password) {
            return res.status(400).json({ success: false, message: 'Please provide email and password' });
        }

        // Check if email already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ success: false, message: 'Email already registered' });
        }

        // Split name into first/last for the User model
        const nameParts = name.trim().split(' ');
        const firstName = nameParts[0];
        const lastName = nameParts.slice(1).join(' ') || '';

        // Create user account with volunteer role
        const user = await User.create({
            firstName,
            lastName,
            email,
            password,
            phone,
            role: 'volunteer',
            district,
            preferredDistrict: district
        });

        // Create volunteer profile linked to user
        const volunteer = await Volunteer.create({
            name, age, phone, bloodGroup, expertise, district, location, email,
            role: expertise || 'General',
            userId: user._id
        });

        // Return token so they're logged in immediately
        const token = user.getSignedJwtToken();

        res.status(201).json({
            success: true,
            token,
            data: volunteer,
            user: {
                _id: user._id,
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email,
                role: user.role,
                district: user.district
            }
        });
    } catch (err) {
        next(err);
    }
});

// @route   PUT /api/volunteers/:id
// @desc    Update volunteer
// @access  Private (Admin or self)
router.put('/:id', protect, async (req, res, next) => {
    try {
        let volunteer = await Volunteer.findById(req.params.id);
        if (!volunteer) {
            return res.status(404).json({ success: false, message: 'Volunteer not found' });
        }

        // Only admin or the volunteer themselves can update
        if (req.user.role !== 'admin' && volunteer.userId && volunteer.userId.toString() !== req.user.id) {
            return res.status(403).json({ success: false, message: 'Not authorized' });
        }

        volunteer = await Volunteer.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        });

        res.json({ success: true, data: volunteer });
    } catch (err) {
        next(err);
    }
});

// @route   DELETE /api/volunteers/:id
// @desc    Delete a volunteer
// @access  Private (Admin)
router.delete('/:id', protect, authorize('admin'), async (req, res, next) => {
    try {
        const volunteer = await Volunteer.findById(req.params.id);
        if (!volunteer) {
            return res.status(404).json({ success: false, message: 'Volunteer not found' });
        }

        await volunteer.deleteOne();
        res.json({ success: true, data: {} });
    } catch (err) {
        next(err);
    }
});

module.exports = router;
