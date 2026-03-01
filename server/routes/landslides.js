const express = require('express');
const router = express.Router();
const Landslide = require('../models/Landslide');

// @route   GET /api/landslides
// @desc    Get all historical landslide records
// @access  Public
router.get('/', async (req, res, next) => {
    try {
        const { district } = req.query;
        let query = {};
        if (district) query.district = district;

        const landslides = await Landslide.find(query).sort('-date');
        res.json({ success: true, count: landslides.length, data: landslides });
    } catch (err) {
        next(err);
    }
});

// @route   GET /api/landslides/risk-assessment
// @desc    Get current landslide risk based on historical data + weather
// @access  Public
router.get('/risk-assessment', async (req, res, next) => {
    try {
        const { rainfall = 0, district } = req.query;
        const currentRainfall = parseFloat(rainfall);

        const now = new Date();
        const currentMonth = now.getMonth() + 1;
        const startOfYear = new Date(now.getFullYear(), 0, 1);
        const daysDiff = Math.floor((now - startOfYear) / (24 * 60 * 60 * 1000));
        const currentWeek = Math.ceil((daysDiff + startOfYear.getDay() + 1) / 7);

        // --- 1. Find historical events in the SAME WEEK (±1 week window) ---
        const weekQuery = {
            week: { $gte: currentWeek - 1, $lte: currentWeek + 1 }
        };
        if (district) weekQuery.district = district;
        const weekMatches = await Landslide.find(weekQuery).sort('-severity');

        // --- 2. Find historical events in the SAME MONTH ---
        const monthQuery = { month: currentMonth };
        if (district) monthQuery.district = district;
        const monthMatches = await Landslide.find(monthQuery).sort('-severity');

        // --- 3. Calculate Risk Score ---
        // Severity weight map
        const severityWeight = { Low: 1, Medium: 2, High: 3, Extreme: 4 };
        const categoryWeight = { Minor: 1, Moderate: 2, Major: 3 };

        // Base score from historical week matches
        let riskScore = 0;

        weekMatches.forEach(event => {
            riskScore += (severityWeight[event.severity] || 1) * 3; // Week match = 3x weight
            riskScore += (categoryWeight[event.category] || 1) * 2;
        });

        // Monthly pattern adds less weight
        monthMatches.forEach(event => {
            riskScore += (severityWeight[event.severity] || 1) * 1;
        });

        // Rainfall multiplier (mm in last period)
        // < 10 mm: low, 10-30mm: moderate, 30-60mm: high, > 60mm: extreme
        let rainfallMultiplier = 1;
        let rainfallLevel = 'Low';
        if (currentRainfall >= 60) {
            rainfallMultiplier = 2.5;
            rainfallLevel = 'Extreme';
        } else if (currentRainfall >= 30) {
            rainfallMultiplier = 2.0;
            rainfallLevel = 'High';
        } else if (currentRainfall >= 10) {
            rainfallMultiplier = 1.5;
            rainfallLevel = 'Moderate';
        }

        riskScore = Math.round(riskScore * rainfallMultiplier);

        // --- 4. Determine Risk Level ---
        let riskLevel = 'Low';
        let riskColor = 'green';
        if (riskScore >= 50) {
            riskLevel = 'Extreme';
            riskColor = 'red';
        } else if (riskScore >= 30) {
            riskLevel = 'High';
            riskColor = 'orange';
        } else if (riskScore >= 15) {
            riskLevel = 'Medium';
            riskColor = 'yellow';
        }

        // --- 5. Build alerts from matching events ---
        const alerts = [];

        // Week-level alerts (most urgent)
        weekMatches.forEach(event => {
            const eventDate = new Date(event.date);
            const yearsAgo = now.getFullYear() - eventDate.getFullYear();
            alerts.push({
                type: 'week',
                urgency: 'high',
                severity: event.severity,
                category: event.category,
                district: event.district,
                location: event.location,
                description: event.description,
                historicalDate: event.date,
                yearsAgo,
                message: `${event.severity} landslide at ${event.location}, ${event.district} — ${yearsAgo} year${yearsAgo > 1 ? 's' : ''} ago this week`
            });
        });

        // Month-level alerts (awareness — exclude already matched events)
        const weekIds = new Set(weekMatches.map(e => e._id.toString()));
        monthMatches.filter(e => !weekIds.has(e._id.toString())).forEach(event => {
            const eventDate = new Date(event.date);
            const yearsAgo = now.getFullYear() - eventDate.getFullYear();
            alerts.push({
                type: 'month',
                urgency: 'medium',
                severity: event.severity,
                category: event.category,
                district: event.district,
                location: event.location,
                description: event.description,
                historicalDate: event.date,
                yearsAgo,
                message: `${event.severity} landslide at ${event.location}, ${event.district} — ${yearsAgo} year${yearsAgo > 1 ? 's' : ''} ago this month`
            });
        });

        // --- 6. District breakdown ---
        const districtRisks = {};
        [...weekMatches, ...monthMatches].forEach(event => {
            if (!districtRisks[event.district]) {
                districtRisks[event.district] = { count: 0, maxSeverity: 'Low', events: [] };
            }
            districtRisks[event.district].count++;
            const currentMax = severityWeight[districtRisks[event.district].maxSeverity] || 0;
            const eventSev = severityWeight[event.severity] || 0;
            if (eventSev > currentMax) {
                districtRisks[event.district].maxSeverity = event.severity;
            }
        });

        res.json({
            success: true,
            data: {
                riskLevel,
                riskScore,
                riskColor,
                rainfallLevel,
                currentRainfall,
                currentWeek,
                currentMonth,
                totalWeekMatches: weekMatches.length,
                totalMonthMatches: monthMatches.length,
                districtRisks,
                alerts: alerts.sort((a, b) => {
                    const urgencyOrder = { high: 0, medium: 1, low: 2 };
                    return (urgencyOrder[a.urgency] || 2) - (urgencyOrder[b.urgency] || 2);
                }),
                summary: riskScore >= 30
                    ? `⚠️ HIGH ALERT: ${weekMatches.length} landslide(s) occurred during this week in previous years. Current rainfall: ${rainfallLevel}. Exercise extreme caution.`
                    : riskScore >= 15
                        ? `🔶 MODERATE RISK: Historical landslide patterns detected for this period. Monitor weather closely.`
                        : `✅ LOW RISK: No significant historical landslide patterns for this week. Stay aware during heavy rain.`
            }
        });
    } catch (err) {
        next(err);
    }
});

module.exports = router;
