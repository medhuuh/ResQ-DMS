const express = require('express');
const router = express.Router();
const Camp = require('../models/Camp');
const Refugee = require('../models/Refugee');
const Volunteer = require('../models/Volunteer');
const SafeHome = require('../models/SafeHome');
const MissingPerson = require('../models/MissingPerson');
const Donation = require('../models/Donation');
const { protect, authorize } = require('../middleware/auth');

// @route   GET /api/dashboard/stats
// @desc    Get aggregated dashboard statistics
// @access  Private (Admin)
router.get('/stats', protect, authorize('admin'), async (req, res, next) => {
    try {
        const [
            totalRefugees,
            activeCamps,
            totalVolunteers,
            totalSafeHomes,
            missingPersons,
            totalDonations,
            campsList,
            recentMissing
        ] = await Promise.all([
            Refugee.countDocuments(),
            Camp.countDocuments({ status: 'Active' }),
            Volunteer.countDocuments(),
            SafeHome.countDocuments({ status: 'Active' }),
            MissingPerson.countDocuments({ status: 'Missing' }),
            Donation.countDocuments(),
            Camp.find({ status: 'Active' }).select('name capacity occupied').limit(10),
            MissingPerson.find({ status: 'Missing' }).sort('-createdAt').limit(5)
        ]);

        // Count camps with low resources (capacity > 90% full)
        const lowResourceCamps = campsList.filter(c => (c.occupied / c.capacity) > 0.9).length;

        res.json({
            success: true,
            data: {
                totalRefugees,
                activeCamps,
                lowResourceCamps,
                totalVolunteers,
                totalSafeHomes,
                missingPersons,
                totalDonations,
                campsList,
                recentMissing
            }
        });
    } catch (err) {
        next(err);
    }
});

module.exports = router;
