import React, { useState, useEffect } from 'react';
import { AlertTriangle, CloudRain, Navigation, RefreshCw, Tent, Home, AlertOctagon, Activity } from 'lucide-react';
import BaseMap, { MARKER_ICONS } from '../../components/map/BaseMap';
import { Marker, Popup, useMap, CircleMarker, GeoJSON } from 'react-leaflet';
import keralaGeoJSON from '../../data/kerala-districts.json';
import api from '../../services/api';

// District center coordinates for placing markers without lat/lng
const DISTRICT_COORDS = {
    'Wayanad': [11.69, 76.13], 'Kozhikode': [11.25, 75.77], 'Malappuram': [10.99, 76.07],
    'Kannur': [11.87, 75.37], 'Kasaragod': [12.50, 74.98], 'Idukki': [9.85, 76.97],
    'Thrissur': [10.52, 76.21], 'Palakkad': [10.78, 76.65], 'Ernakulam': [9.98, 76.28],
    'Kottayam': [9.59, 76.52], 'Pathanamthitta': [9.26, 76.79], 'Alappuzha': [9.49, 76.33],
    'Kollam': [8.89, 76.60], 'Thiruvananthapuram': [8.52, 76.93], 'Trivandrum': [8.52, 76.93]
};

const FitBounds = () => {
    const map = useMap();
    useEffect(() => {
        map.fitBounds([[8.2, 74.8], [12.8, 77.4]], { padding: [20, 20] });
    }, [map]);
    return null;
};

const LiveDisasterStatus = () => {
    const [markers, setMarkers] = useState([]);
    const [earthquakes, setEarthquakes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [riskData, setRiskData] = useState([]);
    const [activeFilter, setActiveFilter] = useState('all');

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        setLoading(true);
        try {
            const [markersRes, riskRes] = await Promise.all([
                api.get('/alerts/live-markers').catch(() => ({ data: { data: [] } })),
                api.get('/alerts/risk-map').catch(() => ({ data: [] }))
            ]);

            setMarkers(markersRes.data.data || []);
            setRiskData(riskRes.data || []);

            // Fetch earthquake data
            try {
                const eqRes = await fetch('https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_day.geojson');
                const eqData = await eqRes.json();
                // Filter for nearby earthquakes (South Asia region)
                const nearbyEqs = eqData.features.filter(eq => {
                    const [lng, lat] = eq.geometry.coordinates;
                    return lat >= 5 && lat <= 20 && lng >= 65 && lng <= 85;
                }).slice(0, 10);
                setEarthquakes(nearbyEqs);
            } catch { /* earthquake API optional */ }
        } catch (err) {
            console.error('Failed to fetch live data:', err);
        } finally {
            setLoading(false);
        }
    };

    const getMarkerCoords = (marker) => {
        if (marker.lat && marker.lng) return [marker.lat, marker.lng];
        const coords = DISTRICT_COORDS[marker.district];
        if (coords) {
            // Add small random offset to prevent overlapping
            return [coords[0] + (Math.random() - 0.5) * 0.1, coords[1] + (Math.random() - 0.5) * 0.1];
        }
        return null;
    };

    const filteredMarkers = activeFilter === 'all' ? markers : markers.filter(m => m.type === activeFilter);
    const highRisk = riskData.filter(d => d.risk === 'High');
    const moderateRisk = riskData.filter(d => d.risk === 'Moderate');

    const typeInfo = {
        camp: { icon: Tent, label: 'Relief Camps', color: '#3b82f6' },
        safehome: { icon: Home, label: 'Safe Homes', color: '#22c55e' },
        alert: { icon: AlertOctagon, label: 'Alerts', color: '#ef4444' }
    };

    // GeoJSON styling for moderate/high risk zones
    const styleFeature = (feature) => {
        const district = feature.properties.district;
        const districtRisk = riskData.find(r => r.district.toLowerCase() === district.toLowerCase());

        if (!districtRisk || districtRisk.risk === 'Safe') {
            return { weight: 0, fillOpacity: 0, opacity: 0 };
        }

        const isHigh = districtRisk.risk === 'High';
        return {
            fillColor: isHigh ? '#ef4444' : '#facc15',
            weight: 2,
            opacity: 0.8,
            color: isHigh ? '#ef4444' : '#facc15',
            fillOpacity: 0.35,
        };
    };

    const filterFeature = (feature) => {
        const district = feature.properties.district;
        const districtRisk = riskData.find(r => r.district.toLowerCase() === district.toLowerCase());
        return districtRisk && (districtRisk.risk === 'High' || districtRisk.risk === 'Moderate');
    };

    return (
        <div className="min-h-screen bg-background p-4 sm:p-6">
            <div className="max-w-7xl mx-auto">
                <header className="mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-surface p-4 sm:p-6 rounded-2xl shadow-sm border border-white/10">
                    <div>
                        <h1 className="text-2xl sm:text-3xl font-bold text-white">Live Disaster Status</h1>
                        <p className="text-gray-400 text-sm">Real-time impact map and alert monitoring</p>
                    </div>
                    <div className="flex items-center gap-3">
                        <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Last Updated</span>
                        <p className="text-sm font-mono text-primary">{new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })} IST</p>
                        <button onClick={fetchData} className="p-2 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 transition text-gray-400">
                            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                        </button>
                    </div>
                </header>

                {/* Status Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
                    <div className="bg-red-900/20 border border-red-500/30 p-4 rounded-2xl flex items-center gap-4">
                        <div className="bg-red-500/20 p-3 rounded-full">
                            <AlertTriangle className="w-6 h-6 text-red-500" />
                        </div>
                        <div>
                            <h3 className="text-lg font-bold text-red-400">High Risk</h3>
                            <p className="text-red-300 text-sm">{highRisk.length} district{highRisk.length !== 1 ? 's' : ''} at high risk</p>
                        </div>
                    </div>
                    <div className="bg-yellow-900/20 border border-yellow-500/30 p-4 rounded-2xl flex items-center gap-4">
                        <div className="bg-yellow-500/20 p-3 rounded-full">
                            <CloudRain className="w-6 h-6 text-yellow-500" />
                        </div>
                        <div>
                            <h3 className="text-lg font-bold text-yellow-400">Moderate Alert</h3>
                            <p className="text-yellow-300 text-sm">{moderateRisk.length} district{moderateRisk.length !== 1 ? 's' : ''} under watch</p>
                        </div>
                    </div>
                    <div className="bg-primary/10 border border-primary/30 p-4 rounded-2xl flex items-center gap-4">
                        <div className="bg-primary/20 p-3 rounded-full">
                            <Navigation className="w-6 h-6 text-primary" />
                        </div>
                        <div>
                            <h3 className="text-lg font-bold text-primary">Active Resources</h3>
                            <p className="text-gray-300 text-sm">{markers.filter(m => m.type === 'camp').length} camps, {markers.filter(m => m.type === 'safehome').length} safe homes</p>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Map */}
                    <div className="lg:col-span-2 bg-surface rounded-2xl shadow-sm border border-white/10 overflow-hidden relative" style={{ height: '500px' }}>
                        {/* Filter bar */}
                        <div className="absolute top-3 left-3 z-10 flex gap-2">
                            {[
                                { key: 'all', label: 'All' },
                                { key: 'camp', label: 'Camps' },
                                { key: 'safehome', label: 'Safe Homes' },
                                { key: 'alert', label: 'Alerts' }
                            ].map(f => (
                                <button key={f.key} onClick={() => setActiveFilter(f.key)}
                                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${activeFilter === f.key
                                        ? 'bg-primary text-black shadow-lg'
                                        : 'bg-black/70 text-gray-300 hover:bg-black/90 border border-white/10'}`}>
                                    {f.label}
                                </button>
                            ))}
                        </div>

                        {loading && (
                            <div className="absolute inset-0 flex items-center justify-center bg-black/40 z-[999]">
                                <div className="w-10 h-10 border-4 border-neon border-t-transparent rounded-full animate-spin"></div>
                            </div>
                        )}

                        <BaseMap zoom={7}>
                            <FitBounds />
                            {riskData.length > 0 && (
                                <GeoJSON
                                    key={`live-risk-${riskData.length}`}
                                    data={keralaGeoJSON}
                                    style={styleFeature}
                                    filter={filterFeature}
                                />
                            )}
                            {/* Markers */}
                            {filteredMarkers.map((marker, i) => {
                                const coords = getMarkerCoords(marker);
                                if (!coords) return null;
                                return (
                                    <Marker key={`${marker.type}-${i}`} position={coords} icon={MARKER_ICONS[marker.type] || MARKER_ICONS.alert}>
                                        <Popup>
                                            <div style={{ minWidth: 180, color: '#000' }}>
                                                <h4 style={{ fontWeight: 'bold', fontSize: 13, marginBottom: 4 }}>{marker.title}</h4>
                                                <p style={{ fontSize: 11, color: '#666', marginBottom: 2 }}>
                                                    <strong>Type:</strong> {marker.type} &bull; <strong>District:</strong> {marker.district}
                                                </p>
                                                <p style={{ fontSize: 11, color: '#444', marginBottom: 2 }}>{marker.details}</p>
                                                {marker.timestamp && (
                                                    <p style={{ fontSize: 10, color: '#999' }}>
                                                        {new Date(marker.timestamp).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                                                    </p>
                                                )}
                                            </div>
                                        </Popup>
                                    </Marker>
                                );
                            })}

                            {/* Earthquake markers */}
                            {earthquakes.map((eq, i) => {
                                const [lng, lat] = eq.geometry.coordinates;
                                const mag = eq.properties.mag || 0;
                                return (
                                    <CircleMarker key={`eq-${i}`} center={[lat, lng]} radius={Math.max(mag * 3, 4)}
                                        pathOptions={{ color: '#f97316', fillColor: '#f97316', fillOpacity: 0.5, weight: 1 }}>
                                        <Popup>
                                            <div style={{ minWidth: 160, color: '#000' }}>
                                                <h4 style={{ fontWeight: 'bold', fontSize: 13 }}>Earthquake M{mag.toFixed(1)}</h4>
                                                <p style={{ fontSize: 11, color: '#666' }}>{eq.properties.place}</p>
                                                <p style={{ fontSize: 10, color: '#999' }}>
                                                    {new Date(eq.properties.time).toLocaleString('en-IN')}
                                                </p>
                                            </div>
                                        </Popup>
                                    </CircleMarker>
                                );
                            })}
                        </BaseMap>
                    </div>

                    {/* Side panel */}
                    <div className="bg-surface rounded-2xl shadow-sm border border-white/10 p-4 sm:p-5 overflow-y-auto" style={{ maxHeight: '500px' }}>
                        <h3 className="font-bold text-lg mb-4 text-white">Affected Districts</h3>
                        {highRisk.length === 0 && moderateRisk.length === 0 ? (
                            <div className="flex flex-col items-center justify-center py-10 text-center">
                                <div className="w-16 h-16 rounded-full bg-green-500/20 border-2 border-green-500/40 flex items-center justify-center mb-4">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="w-8 h-8 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>
                                </div>
                                <p className="text-green-400 font-bold text-lg">All Districts Safe</p>
                                <p className="text-gray-500 text-xs mt-1">No active alerts at this time</p>
                            </div>
                        ) : (
                            <ul className="space-y-2">
                                {highRisk.map(d => (
                                    <li key={d.district} className="flex justify-between items-center p-3 bg-red-500/10 border border-red-500/20 rounded-xl">
                                        <span className="font-medium text-gray-200 text-sm">{d.district}</span>
                                        <span className="text-[10px] px-2 py-1 bg-red-900/30 text-red-400 border border-red-500/30 rounded-full font-bold">High Risk</span>
                                    </li>
                                ))}
                                {moderateRisk.map(d => (
                                    <li key={d.district} className="flex justify-between items-center p-3 bg-yellow-500/10 border border-yellow-500/20 rounded-xl">
                                        <span className="font-medium text-gray-200 text-sm">{d.district}</span>
                                        <span className="text-[10px] px-2 py-1 bg-yellow-900/30 text-yellow-400 border border-yellow-500/30 rounded-full font-bold">Moderate</span>
                                    </li>
                                ))}
                            </ul>
                        )}

                        {/* Legend */}
                        <div className="mt-6 pt-4 border-t border-white/10">
                            <p className="text-xs text-gray-500 uppercase tracking-wider font-bold mb-3">Map Legend</p>
                            <div className="space-y-2">
                                {Object.entries(typeInfo).map(([key, info]) => (
                                    <div key={key} className="flex items-center gap-2 text-xs text-gray-400">
                                        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: info.color }}></div>
                                        <span>{info.label}</span>
                                    </div>
                                ))}
                                <div className="flex items-center gap-2 text-xs text-gray-400">
                                    <div className="w-3 h-3 rounded-full bg-orange-500 opacity-50 border border-orange-500"></div>
                                    <span>Earthquakes (USGS Live)</span>
                                </div>
                            </div>
                        </div>

                        {/* Earthquake feed */}
                        {earthquakes.length > 0 && (
                            <div className="mt-4 pt-4 border-t border-white/10">
                                <p className="text-xs text-gray-500 uppercase tracking-wider font-bold mb-3 flex items-center gap-1">
                                    <Activity className="w-3 h-3" /> Recent Earthquakes
                                </p>
                                <div className="space-y-2">
                                    {earthquakes.slice(0, 5).map((eq, i) => (
                                        <div key={i} className="p-2 bg-orange-500/10 border border-orange-500/20 rounded-lg">
                                            <div className="flex justify-between items-center">
                                                <span className="text-xs text-orange-300 font-bold">M{eq.properties.mag?.toFixed(1)}</span>
                                                <span className="text-[10px] text-gray-500">
                                                    {new Date(eq.properties.time).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}
                                                </span>
                                            </div>
                                            <p className="text-[10px] text-gray-400 mt-0.5">{eq.properties.place}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LiveDisasterStatus;
