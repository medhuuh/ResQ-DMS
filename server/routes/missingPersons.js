const express = require('express');
const router = express.Router();
const MissingPerson = require('../models/MissingPerson');
const { protect, authorize } = require('../middleware/auth');
const upload = require('../middleware/upload');

// @route   GET /api/missing-persons
// @desc    Get all missing persons
// @access  Public
router.get('/', async (req, res, next) => {
    try {
        const { search, status } = req.query;
        let query = {};

        if (search) {
            query.$or = [
                { name: { $regex: search, $options: 'i' } },
                { lastSeenLocation: { $regex: search, $options: 'i' } }
            ];
        }
        if (status) query.status = status;

        const persons = await MissingPerson.find(query).sort('-createdAt');
        res.json({ success: true, count: persons.length, data: persons });
    } catch (err) {
        next(err);
    }
});

// @route   GET /api/missing-persons/:id
// @desc    Get single missing person
// @access  Public
router.get('/:id', async (req, res, next) => {
    try {
        const person = await MissingPerson.findById(req.params.id);
        if (!person) {
            return res.status(404).json({ success: false, message: 'Missing person record not found' });
        }
        res.json({ success: true, data: person });
    } catch (err) {
        next(err);
    }
});

// @route   POST /api/missing-persons
// @desc    Report a missing person (with optional photo upload)
// @access  Private (Any logged-in user)
router.post('/', protect, upload.single('photo'), async (req, res, next) => {
    try {
        req.body.reportedBy = req.user.id;

        // If a photo was uploaded, store the path
        if (req.file) {
            req.body.photo = `/uploads/${req.file.filename}`;
        }

        const person = await MissingPerson.create(req.body);
        res.status(201).json({ success: true, data: person });
    } catch (err) {
        next(err);
    }
});

// @route   PUT /api/missing-persons/:id
// @desc    Update missing person (status, details)
// @access  Private (Admin)
router.put('/:id', protect, authorize('admin'), async (req, res, next) => {
    try {
        let person = await MissingPerson.findById(req.params.id);
        if (!person) {
            return res.status(404).json({ success: false, message: 'Missing person record not found' });
        }

        person = await MissingPerson.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        });

        res.json({ success: true, data: person });
    } catch (err) {
        next(err);
    }
});

// @route   DELETE /api/missing-persons/:id
// @desc    Delete a missing person record
// @access  Private (Admin)
router.delete('/:id', protect, authorize('admin'), async (req, res, next) => {
    try {
        const person = await MissingPerson.findById(req.params.id);
        if (!person) {
            return res.status(404).json({ success: false, message: 'Missing person record not found' });
        }

        await person.deleteOne();
        res.json({ success: true, data: {} });
    } catch (err) {
        next(err);
    }
});

module.exports = router;
