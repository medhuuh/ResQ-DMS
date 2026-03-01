const https = require('https');

/**
 * Geocode an address using OpenStreetMap Nominatim (free, no API key required)
 * @param {string} address - The address to geocode
 * @returns {Promise<{lat: number, lng: number} | null>}
 */
const geocodeAddress = (address) => {
    return new Promise((resolve) => {
        if (!address || address.trim().length === 0) {
            return resolve(null);
        }

        // Append "Kerala, India" for better results
        const query = `${address}, Kerala, India`;
        const encodedQuery = encodeURIComponent(query);
        const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodedQuery}&limit=1&countrycodes=in`;

        const options = {
            headers: {
                'User-Agent': 'ResQ-DMS/1.0 (disaster-management-system)'
            }
        };

        https.get(url, options, (res) => {
            let data = '';
            res.on('data', chunk => data += chunk);
            res.on('end', () => {
                try {
                    const results = JSON.parse(data);
                    if (results && results.length > 0) {
                        resolve({
                            lat: parseFloat(results[0].lat),
                            lng: parseFloat(results[0].lon)
                        });
                    } else {
                        resolve(null);
                    }
                } catch {
                    resolve(null);
                }
            });
        }).on('error', () => {
            resolve(null);
        });
    });
};

module.exports = geocodeAddress;
