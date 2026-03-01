const express = require('express');
const router = express.Router();
const Landslide = require('../models/Landslide');
const Camp = require('../models/Camp');
const SafeHome = require('../models/SafeHome');
const DistrictRisk = require('../models/DistrictRisk');
const SystemAlert = require('../models/SystemAlert');
const { protect, authorize } = require('../middleware/auth');
const https = require('https');

// All Kerala districts with center coordinates
const DISTRICT_COORDS = {
    'Thiruvananthapuram': [8.52, 76.93], 'Kollam': [8.89, 76.60], 'Pathanamthitta': [9.26, 76.79],
    'Alappuzha': [9.49, 76.33], 'Kottayam': [9.59, 76.52], 'Idukki': [9.85, 76.97],
    'Ernakulam': [9.98, 76.28], 'Thrissur': [10.52, 76.21], 'Palakkad': [10.78, 76.65],
    'Malappuram': [10.99, 76.07], 'Kozhikode': [11.25, 75.77], 'Wayanad': [11.69, 76.13],
    'Kannur': [11.87, 75.37], 'Kasaragod': [12.50, 74.98], 'Trivandrum': [8.52, 76.93]
};

const ALL_DISTRICTS = [
    'Thiruvananthapuram', 'Kollam', 'Pathanamthitta', 'Alappuzha', 'Kottayam',
    'Idukki', 'Ernakulam', 'Thrissur', 'Palakkad', 'Malappuram',
    'Kozhikode', 'Wayanad', 'Kannur', 'Kasaragod'
];

// Fetch current rainfall for a district from OpenWeatherMap
const fetchRainfall = (lat, lon, apiKey) => {
    return new Promise((resolve) => {
        if (!apiKey) return resolve(0);
        const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`;
        https.get(url, (res) => {
            let data = '';
            res.on('data', chunk => data += chunk);
            res.on('end', () => {
                try {
                    const parsed = JSON.parse(data);
                    const rain = parsed.rain ? (parsed.rain['1h'] || parsed.rain['3h'] || 0) : 0;
                    resolve(rain);
                } catch { resolve(0); }
            });
        }).on('error', () => resolve(0));
    });
};

// @route   GET /api/alerts/risk-map
// @desc    Get risk data for all Kerala districts (combines historical + weather)
// @access  Public
router.get('/risk-map', async (req, res, next) => {
    try {
        const now = new Date();
        const currentMonth = now.getMonth() + 1;
        const startOfYear = new Date(now.getFullYear(), 0, 1);
        const daysDiff = Math.floor((now - startOfYear) / (24 * 60 * 60 * 1000));
        const currentWeek = Math.ceil((daysDiff + startOfYear.getDay() + 1) / 7);

        const severityWeight = { Low: 1, Medium: 2, High: 3, Extreme: 4 };

        // Get all landslide data for this month ± 1 week window
        const historicalEvents = await Landslide.find({
            $or: [
                { week: { $gte: currentWeek - 1, $lte: currentWeek + 1 } },
                { month: currentMonth }
            ]
        });

        // Get all manual risk overrides
        const manualRisks = await DistrictRisk.find();

        // Try to get weather API key from frontend env or request
        const apiKey = req.query.weatherKey || process.env.OPENWEATHER_API_KEY || '';

        // Calculate risk per district (with optional weather data)
        const districtRisks = await Promise.all(ALL_DISTRICTS.map(async (district) => {
            const events = historicalEvents.filter(e => {
                return e.district.toLowerCase() === district.toLowerCase() ||
                    (district === 'Thiruvananthapuram' && e.district === 'Trivandrum');
            });

            // Historical score
            let historicalScore = 0;
            events.forEach(e => {
                const weekMatch = Math.abs(e.week - currentWeek) <= 1;
                historicalScore += (severityWeight[e.severity] || 1) * (weekMatch ? 3 : 1);
            });

            // Fetch current rainfall for this district
            let rainfall = 0;
            if (apiKey && DISTRICT_COORDS[district]) {
                rainfall = await fetchRainfall(DISTRICT_COORDS[district][0], DISTRICT_COORDS[district][1], apiKey);
            }

            // Rainfall multiplier
            let rainfallMultiplier = 1;
            if (rainfall >= 60) rainfallMultiplier = 2.5;
            else if (rainfall >= 30) rainfallMultiplier = 2.0;
            else if (rainfall >= 10) rainfallMultiplier = 1.5;

            const score = Math.round(historicalScore * rainfallMultiplier);

            let risk = 'Safe';
            let description = 'No significant risk detected for this period.';
            if (score >= 15) {
                risk = 'High';
                description = `${events.length} historical landslide(s) in this period${rainfall > 0 ? `, current rainfall: ${rainfall.toFixed(1)}mm` : ''}. High caution advised.`;
            } else if (score >= 5) {
                risk = 'Moderate';
                description = `${events.length} historical event(s) detected${rainfall > 0 ? `, rainfall: ${rainfall.toFixed(1)}mm` : ''}. Monitor weather conditions.`;
            }

            // Apply manual override if exists and was updated within the last 12 hours
            const override = manualRisks.find(m => m.district.toLowerCase() === district.toLowerCase());
            let isManualOverride = false;

            if (override && override.riskLevel !== 'Auto') {
                const twelveHoursAgo = new Date(Date.now() - 12 * 60 * 60 * 1000);
                const updatedAt = new Date(override.updatedAt);

                if (updatedAt >= twelveHoursAgo) {
                    risk = override.riskLevel;
                    description = `[Manual Override] ${description}`;
                    isManualOverride = true;
                }
            }

            return {
                district,
                risk,
                score,
                eventCount: events.length,
                rainfall: rainfall.toFixed(1),
                description,
                isManualOverride
            };
        }));

        res.json(districtRisks);
    } catch (err) {
        next(err);
    }
});

// In-memory cache for geocoded locations to prevent spamming the Nominatim API
const geocodeCache = {};

// Helper to get coordinates from OpenStreetMap Nominatim
const geocodeLocation = async (placeName, district) => {
    // Clean up place name: take first part before comma, remove special chars
    const cleanPlace = placeName.split(',')[0].trim().replace(/[^a-zA-Z\s]/g, '');

    // Check cache first
    const cacheKey = `${cleanPlace}-${district}`.toLowerCase();
    if (geocodeCache[cacheKey]) {
        return geocodeCache[cacheKey];
    }

    if (!cleanPlace || cleanPlace.length < 3) return null;

    return new Promise((resolve) => {
        // Search format: "place_name, district, kerala"
        const query = encodeURIComponent(`${cleanPlace}, ${district || ''}, kerala`);
        const url = `https://nominatim.openstreetmap.org/search?q=${query}&format=json&limit=1`;

        // Nominatim requires a User-Agent
        const options = {
            headers: { 'User-Agent': 'ResQ-DMS-App/1.0' }
        };

        https.get(url, options, (res) => {
            let data = '';
            res.on('data', chunk => data += chunk);
            res.on('end', () => {
                try {
                    const parsed = JSON.parse(data);
                    if (parsed && parsed.length > 0) {
                        const coords = [parseFloat(parsed[0].lat), parseFloat(parsed[0].lon)];
                        // Save to cache
                        geocodeCache[cacheKey] = coords;
                        resolve(coords);
                    } else {
                        // Mark as missing in cache so we don't spam failed queries either
                        geocodeCache[cacheKey] = null;
                        resolve(null);
                    }
                } catch { resolve(null); }
            });
        }).on('error', () => resolve(null));
    });
};

// @route   GET /api/alerts/live-markers
// @desc    Get markers for live status map (camps, safe homes, alerts) with real coordinates
// @access  Public
router.get('/live-markers', async (req, res, next) => {
    try {
        const markers = [];

        // Get camps with coordinates
        const camps = await Camp.find();
        for (const camp of camps) {
            let lat = camp.latitude || null;
            let lng = camp.longitude || null;

            let detectedDistrict = camp.district || '';
            const locationStr = camp.location || '';

            if (!detectedDistrict && locationStr) {
                Object.keys(DISTRICT_COORDS).forEach(d => {
                    if (locationStr.toLowerCase().includes(d.toLowerCase())) {
                        detectedDistrict = d;
                    }
                });
            }

            // 1. Try to Geocode exact spot if no lat/lng provided
            if (!lat && locationStr) {
                const geoCoords = await geocodeLocation(locationStr, detectedDistrict);
                if (geoCoords) {
                    [lat, lng] = geoCoords;
                    // tiny jiggle so identical addresses don't perfectly overlap
                    lat += (Math.random() - 0.5) * 0.001;
                    lng += (Math.random() - 0.5) * 0.001;
                }
            }

            // 2. Fallback to District coords
            if (!lat && detectedDistrict && DISTRICT_COORDS[detectedDistrict]) {
                [lat, lng] = DISTRICT_COORDS[detectedDistrict];
                lat += (Math.random() - 0.5) * 0.05;
                lng += (Math.random() - 0.5) * 0.05;
            } else if (!lat) {
                // 3. Last resort fallback
                lat = 10.8505 + (Math.random() - 0.5) * 0.5;
                lng = 76.2711 + (Math.random() - 0.5) * 0.5;
            }

            markers.push({
                type: 'camp',
                title: camp.name || 'Relief Camp',
                severity: 'info',
                district: detectedDistrict,
                lat,
                lng,
                details: `Capacity: ${camp.capacity || 0}, Occupied: ${camp.occupied || 0}`,
                address: locationStr,
                timestamp: camp.updatedAt || camp.createdAt
            });
        }

        // Get safe homes with coordinates
        const safeHomes = await SafeHome.find();
        for (const sh of safeHomes) {
            let lat = sh.latitude || null;
            let lng = sh.longitude || null;

            let detectedDistrict = sh.district || '';
            const firstPlaceStr = sh.location || '';
            const fullAddress = `${firstPlaceStr} ${sh.address || ''}`.trim();

            if (!detectedDistrict && fullAddress) {
                Object.keys(DISTRICT_COORDS).forEach(d => {
                    if (fullAddress.toLowerCase().includes(d.toLowerCase())) {
                        detectedDistrict = d;
                    }
                });
            }

            // 1. Try to Geocode exact spot
            if (!lat && firstPlaceStr) {
                const geoCoords = await geocodeLocation(firstPlaceStr, detectedDistrict);
                if (geoCoords) {
                    [lat, lng] = geoCoords;
                    lat += (Math.random() - 0.5) * 0.001;
                    lng += (Math.random() - 0.5) * 0.001;
                }
            } else if (!lat && sh.address) {
                // Try geocoding the address part if location part failed/missing
                const geoCoords = await geocodeLocation(sh.address, detectedDistrict);
                if (geoCoords) {
                    [lat, lng] = geoCoords;
                    lat += (Math.random() - 0.5) * 0.001;
                    lng += (Math.random() - 0.5) * 0.001;
                }
            }

            // 2. District Fallback
            if (!lat && detectedDistrict && DISTRICT_COORDS[detectedDistrict]) {
                [lat, lng] = DISTRICT_COORDS[detectedDistrict];
                lat += (Math.random() - 0.5) * 0.05;
                lng += (Math.random() - 0.5) * 0.05;
            } else if (!lat) {
                // 3. Kerala Fallback
                lat = 10.8505 + (Math.random() - 0.5) * 0.5;
                lng = 76.2711 + (Math.random() - 0.5) * 0.5;
            }

            markers.push({
                type: 'safehome',
                title: sh.ownerName || 'Safe Home',
                severity: 'safe',
                district: detectedDistrict,
                lat,
                lng,
                details: `Capacity: ${sh.capacity || 0}, Available: ${(sh.capacity || 0) - (sh.occupied || 0)}`,
                address: fullAddress,
                timestamp: sh.updatedAt || sh.createdAt
            });
        }

        // Get recent landslide alerts for current period
        const now = new Date();
        const currentMonth = now.getMonth() + 1;
        const recentAlerts = await Landslide.find({ month: currentMonth }).sort('-date').limit(10);

        for (const alert of recentAlerts) {
            let lat = null, lng = null;

            // Try geocoding the actual location of the landslide
            if (alert.location) {
                const geoCoords = await geocodeLocation(alert.location, alert.district);
                if (geoCoords) {
                    [lat, lng] = geoCoords;
                    lat += (Math.random() - 0.5) * 0.001;
                    lng += (Math.random() - 0.5) * 0.001;
                }
            }

            // District fallback
            if (!lat) {
                const coords = DISTRICT_COORDS[alert.district] || null;
                if (coords) {
                    lat = coords[0] + (Math.random() - 0.5) * 0.05;
                    lng = coords[1] + (Math.random() - 0.5) * 0.05;
                }
            }

            markers.push({
                type: 'alert',
                title: `${alert.category} Landslide - ${alert.location}`,
                severity: alert.severity.toLowerCase(),
                district: alert.district,
                lat,
                lng,
                details: alert.description,
                address: `${alert.location}, ${alert.district}`,
                timestamp: alert.date
            });
        }

        res.json({ success: true, count: markers.length, data: markers });
    } catch (err) {
        next(err);
    }
});

// @route   PUT /api/alerts/risk-override
// @desc    Update or create manual risk override for a district
// @access  Private/Admin
router.put('/risk-override', protect, authorize('admin'), async (req, res, next) => {
    try {
        const { district, riskLevel } = req.body;
        if (!district || !riskLevel) {
            return res.status(400).json({ success: false, error: 'Please provide district and riskLevel' });
        }

        // Case-insensitive find
        let override = await DistrictRisk.findOne({ district: new RegExp(`^${district}$`, 'i') });

        if (override) {
            override.riskLevel = riskLevel;
            override.lastUpdatedBy = req.user.id;
            await override.save();
        } else {
            override = await DistrictRisk.create({
                district,
                riskLevel,
                lastUpdatedBy: req.user.id
            });
        }

        res.json({ success: true, data: override });
    } catch (err) {
        next(err);
    }
});

// @route   POST /api/alerts/manual
// @desc    Admin broadcasts a manual alert to all users
// @access  Private/Admin
router.post('/manual', protect, authorize('admin', 'volunteer'), async (req, res, next) => {
    try {
        const { message, priority } = req.body;
        if (!message || !priority) {
            return res.status(400).json({ success: false, error: 'Please provide message and priority' });
        }
        const alert = await SystemAlert.create({ message, priority });
        res.status(201).json({ success: true, data: alert });
    } catch (err) {
        next(err);
    }
});

// @route   GET /api/alerts/manual
// @desc    Get the latest manual alerts (last 24h)
// @access  Public
router.get('/manual', async (req, res, next) => {
    try {
        // Find manual alerts from the last hour to prevent spamming old alerts to newly loaded pages
        const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);
        const alerts = await SystemAlert.find({ createdAt: { $gte: oneHourAgo } }).sort({ createdAt: -1 });
        res.json({ success: true, count: alerts.length, data: alerts });
    } catch (err) {
        next(err);
    }
});

module.exports = router;
