import React, { useState, useEffect, useCallback } from 'react';
import { MapPin, Info, AlertTriangle, Shield, RefreshCw } from 'lucide-react';
import BaseMap from '../../components/map/BaseMap';
import { GeoJSON, useMap } from 'react-leaflet';
import keralaGeoJSON from '../../data/kerala-districts.json';
import api from '../../services/api';
import { useAuth } from '../../context/AuthContext';

const RISK_COLORS = {
    High: '#ef4444',
    Moderate: '#facc15',
    Safe: '#22c55e'
};

const RISK_BG = {
    High: 'bg-red-500/20 border-red-500/30',
    Moderate: 'bg-yellow-500/20 border-yellow-500/30',
    Safe: 'bg-green-500/20 border-green-500/30'
};

const RISK_TEXT = {
    High: 'text-red-400',
    Moderate: 'text-yellow-400',
    Safe: 'text-green-400'
};

// Component to fit map bounds to Kerala
const FitBounds = () => {
    const map = useMap();
    useEffect(() => {
        map.fitBounds([[8.2, 74.8], [12.8, 77.4]], { padding: [20, 20] });
    }, [map]);
    return null;
};

const RiskZoneMap = ({ isPublic = false }) => {
    const { user } = useAuth();
    const [riskData, setRiskData] = useState([]);
    const [selectedZone, setSelectedZone] = useState(null);
    const [loading, setLoading] = useState(true);
    const [geoJsonKey, setGeoJsonKey] = useState(0);
    const [updatingOverride, setUpdatingOverride] = useState(false);

    const isAdmin = user?.role === 'admin' && !isPublic;

    useEffect(() => {
        fetchRiskData();
    }, []);

    const fetchRiskData = async () => {
        setLoading(true);
        try {
            const res = await api.get('/alerts/risk-map');
            setRiskData(res.data);
            setGeoJsonKey(prev => prev + 1);
            if (selectedZone) {
                // Update selected zone data if currently selected
                const updatedZone = res.data.find(d => d.district === selectedZone.district);
                if (updatedZone) setSelectedZone(updatedZone);
            }
        } catch (err) {
            console.error('Failed to fetch risk data:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleOverrideChange = async (district, newRiskLevel) => {
        try {
            setUpdatingOverride(true);
            await api.put('/alerts/risk-override', { district, riskLevel: newRiskLevel });
            await fetchRiskData(); // Re-fetch all data to apply overriding logic from backend
        } catch (err) {
            console.error('Failed to update risk override:', err);
            alert('Failed to update risk level. Check console.');
        } finally {
            setUpdatingOverride(false);
        }
    };

    const getRiskForDistrict = useCallback((districtName) => {
        return riskData.find(d =>
            d.district.toLowerCase() === districtName.toLowerCase()
        ) || { risk: 'Safe', description: 'No data available', score: 0, eventCount: 0 };
    }, [riskData]);

    const styleFeature = useCallback((feature) => {
        const district = feature.properties.district;
        const risk = getRiskForDistrict(district);
        return {
            fillColor: RISK_COLORS[risk.risk] || RISK_COLORS.Safe,
            weight: 2,
            opacity: 0.8,
            color: '#ffffff30',
            fillOpacity: 0.45,
        };
    }, [getRiskForDistrict]);

    const onEachFeature = useCallback((feature, layer) => {
        const district = feature.properties.district;
        const risk = getRiskForDistrict(district);

        layer.bindTooltip(`<strong>${district}</strong><br/>Risk: ${risk.risk}`, {
            sticky: true,
            className: 'leaflet-tooltip-dark'
        });

        layer.on({
            click: () => {
                setSelectedZone({ district, ...risk });
            },
            mouseover: (e) => {
                e.target.setStyle({ weight: 3, fillOpacity: 0.65, color: '#ffffff80' });
            },
            mouseout: (e) => {
                e.target.setStyle({ weight: 2, fillOpacity: 0.45, color: '#ffffff30' });
            }
        });
    }, [getRiskForDistrict]);

    const highRiskCount = riskData.filter(d => d.risk === 'High').length;
    const moderateCount = riskData.filter(d => d.risk === 'Moderate').length;
    const safeCount = riskData.filter(d => d.risk === 'Safe').length;

    return (
        <div className="p-4 sm:p-6 h-[calc(100vh-80px)] flex flex-col">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-3">
                <div>
                    <h2 className="text-2xl sm:text-3xl font-bold text-white">Risk Zone Map</h2>
                    <p className="text-gray-400 text-sm">Geospatial view of vulnerable areas based on historical data</p>
                </div>
                <div className="flex gap-2 flex-wrap items-center">
                    <span className="px-3 py-1 bg-red-500/20 text-red-400 rounded-full text-xs font-bold flex items-center gap-1 border border-red-500/30">
                        <span className="w-2 h-2 bg-red-500 rounded-full"></span> High ({highRiskCount})
                    </span>
                    <span className="px-3 py-1 bg-yellow-500/20 text-yellow-400 rounded-full text-xs font-bold flex items-center gap-1 border border-yellow-500/30">
                        <span className="w-2 h-2 bg-yellow-500 rounded-full"></span> Moderate ({moderateCount})
                    </span>
                    <span className="px-3 py-1 bg-green-500/20 text-green-400 rounded-full text-xs font-bold flex items-center gap-1 border border-green-500/30">
                        <span className="w-2 h-2 bg-green-500 rounded-full"></span> Safe ({safeCount})
                    </span>
                    <button onClick={fetchRiskData} className="ml-2 p-2 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 transition text-gray-400 hover:text-white">
                        <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                    </button>
                </div>
            </div>

            <div className="flex-1 flex gap-4 min-h-0">
                {/* Map */}
                <div className="flex-1 bg-surface rounded-2xl shadow-sm border border-white/10 overflow-hidden relative">
                    {loading ? (
                        <div className="absolute inset-0 flex items-center justify-center bg-black/40 z-10">
                            <div className="w-10 h-10 border-4 border-neon border-t-transparent rounded-full animate-spin"></div>
                        </div>
                    ) : null}
                    <BaseMap zoom={7}>
                        <FitBounds />
                        {riskData.length > 0 && (
                            <GeoJSON
                                key={geoJsonKey}
                                data={keralaGeoJSON}
                                style={styleFeature}
                                onEachFeature={onEachFeature}
                            />
                        )}
                    </BaseMap>
                </div>

                {/* Zone Details Panel */}
                <div className="w-72 xl:w-80 bg-surface rounded-2xl shadow-sm border border-white/10 p-4 flex-shrink-0 overflow-y-auto hidden lg:block">
                    <h4 className="font-bold flex items-center gap-2 mb-4 text-white">
                        <Info className="w-4 h-4 text-indigo-400" /> Zone Details
                    </h4>

                    {selectedZone ? (
                        <div className="space-y-4">
                            <div className={`p-4 rounded-xl border ${RISK_BG[selectedZone.risk]}`}>
                                <div className="flex justify-between items-start mb-2">
                                    <span className="font-bold text-white text-sm">{selectedZone.district}</span>
                                    <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${RISK_TEXT[selectedZone.risk]} ${RISK_BG[selectedZone.risk]}`}>
                                        {selectedZone.risk}
                                    </span>
                                </div>
                                <p className="text-xs text-gray-300">{selectedZone.description}</p>
                                <div className="flex gap-4 mt-3 pt-3 border-t border-white/10">
                                    <div>
                                        <p className="text-[10px] text-gray-500 uppercase">Risk Score</p>
                                        <p className={`font-bold text-sm ${RISK_TEXT[selectedZone.risk]}`}>{selectedZone.score}</p>
                                    </div>
                                    <div>
                                        <p className="text-[10px] text-gray-500 uppercase">Historical Events</p>
                                        <p className="font-bold text-sm text-white">{selectedZone.eventCount}</p>
                                    </div>
                                </div>

                                {isAdmin && (
                                    <div className="mt-4 pt-3 border-t border-white/10">
                                        <label className="text-[10px] text-gray-500 font-bold uppercase mb-2 block">Admin Override</label>
                                        <select
                                            className="w-full bg-black/40 border border-white/10 rounded-lg p-2 text-sm text-white focus:outline-none focus:border-primary"
                                            onChange={(e) => handleOverrideChange(selectedZone.district, e.target.value)}
                                            disabled={updatingOverride}
                                            value={selectedZone.isManualOverride ? selectedZone.risk : 'Auto'}
                                        >
                                            <option value="Auto">Auto (Calculated)</option>
                                            <option value="Safe">Safe</option>
                                            <option value="Moderate">Moderate</option>
                                            <option value="High">High</option>
                                        </select>
                                    </div>
                                )}
                            </div>

                            <p className="text-[10px] text-gray-500 text-center italic">Click another district for details</p>
                        </div>
                    ) : (
                        <div className="space-y-3">
                            <p className="text-sm text-gray-500 text-center py-4 italic">Click a district on the map</p>

                            {/* Quick overview of high-risk zones */}
                            {riskData.filter(d => d.risk !== 'Safe').length > 0 && (
                                <>
                                    <p className="text-xs text-gray-500 uppercase tracking-wider font-bold">Alert Zones</p>
                                    {riskData.filter(d => d.risk !== 'Safe').map(d => (
                                        <div key={d.district} className={`p-3 rounded-lg border cursor-pointer hover:bg-white/5 transition ${RISK_BG[d.risk]}`}
                                            onClick={() => setSelectedZone(d)}>
                                            <div className="flex justify-between mb-1">
                                                <span className="font-bold text-white text-xs">{d.district}</span>
                                                <span className={`text-[10px] font-bold ${RISK_TEXT[d.risk]}`}>{d.risk}</span>
                                            </div>
                                            <p className="text-[10px] text-gray-400">{d.eventCount} event(s) this period</p>
                                        </div>
                                    ))}
                                </>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default RiskZoneMap;
