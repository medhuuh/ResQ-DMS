import React, { useEffect, useState } from 'react';
import { Marker, Popup, GeoJSON } from 'react-leaflet';
import { dashboardAPI } from '../../services/api';
import api from '../../services/api'; // For direct marker fetching
import BaseMap, { MARKER_ICONS, createIcon } from '../../components/map/BaseMap';
import keralaGeoJSON from '../../data/kerala-districts.json';

const Dashboard = () => {
    const [stats, setStats] = useState(null);
    const [markers, setMarkers] = useState([]);
    const [riskZones, setRiskZones] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeFilter, setActiveFilter] = useState('all');

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Fetch stats, live markers, and risk zones concurrently
                const [statsRes, markersRes, riskRes] = await Promise.all([
                    dashboardAPI.getStats(),
                    api.get('/alerts/live-markers').catch(() => ({ data: { data: [] } })),
                    api.get('/alerts/risk-map').catch(() => ({ data: [] }))
                ]);

                setStats(statsRes.data.data);
                setMarkers(markersRes.data.data || []);
                setRiskZones(riskRes.data || []);
            } catch (err) {
                console.error('Failed to load dashboard data:', err);
                if (!stats) {
                    setStats({
                        totalRefugees: 0,
                        activeCamps: 0,
                        lowResourceCamps: 0,
                        totalVolunteers: 0
                    });
                }
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const districtsAtRisk = riskZones.filter(r => r.risk === 'High' || r.risk === 'Moderate').length;
    const filteredMarkers = activeFilter === 'all' ? markers : markers.filter(m => m.type === activeFilter);

    const statCards = stats ? [
        { title: 'Active Camps', value: stats.activeCamps.toString(), color: 'bg-green-500' },
        { title: 'Districts in Risk', value: `${districtsAtRisk}`, color: 'bg-red-500' },
        { title: 'Volunteers', value: stats.totalVolunteers.toString(), color: 'bg-purple-500' }
    ] : [];

    // GeoJSON styling for moderate/high risk zones
    const styleFeature = (feature) => {
        const district = feature.properties.district;
        const riskData = riskZones.find(r => r.district.toLowerCase() === district.toLowerCase());

        if (!riskData || riskData.risk === 'Safe') {
            return { weight: 0, fillOpacity: 0, opacity: 0 };
        }

        const isHigh = riskData.risk === 'High';
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
        const riskData = riskZones.find(r => r.district.toLowerCase() === district.toLowerCase());
        return riskData && (riskData.risk === 'High' || riskData.risk === 'Moderate');
    };

    return (
        <div className="p-4 sm:p-0">
            <h2 className="text-2xl sm:text-3xl font-bold mb-6 text-white">Overview</h2>

            {loading ? (
                <div className="flex justify-center py-20">
                    <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
                </div>
            ) : (
                <>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
                        {statCards.map((stat, idx) => (
                            <div key={idx} className="bg-surface p-4 sm:p-6 rounded-2xl shadow-sm border border-white/10 flex items-center justify-between">
                                <div>
                                    <p className="text-xs sm:text-sm text-gray-400 font-medium">{stat.title}</p>
                                    <p className="text-2xl sm:text-3xl font-bold text-white mt-2">{stat.value}</p>
                                </div>
                                <div className={`w-3 h-3 rounded-full ${stat.color}`}></div>
                            </div>
                        ))}
                    </div>

                    <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
                        <div className="bg-surface p-4 sm:p-6 rounded-2xl shadow-sm border border-white/10 h-64 sm:h-96">
                            <h3 className="font-bold text-lg mb-4 text-white">Live Map</h3>
                            <div className="w-full h-[calc(100%-3rem)] rounded-xl overflow-hidden shadow-lg border border-white/5 relative z-0">

                                {/* Filter bar */}
                                <div className="absolute top-3 left-3 z-[999] flex flex-wrap gap-2">
                                    {[
                                        { key: 'all', label: 'All' },
                                        { key: 'camp', label: 'Camps' },
                                        { key: 'safehome', label: 'Safe Homes' },
                                        { key: 'alert', label: 'Alerts' }
                                    ].map(f => (
                                        <button key={f.key} onClick={(e) => { e.stopPropagation(); setActiveFilter(f.key); }}
                                            className={`px-2 py-1 sm:px-3 sm:py-1.5 rounded-lg text-xs font-bold transition ${activeFilter === f.key
                                                ? 'bg-primary text-black shadow-lg'
                                                : 'bg-black/70 text-gray-300 hover:bg-black/90 border border-white/10'}`}>
                                            {f.label}
                                        </button>
                                    ))}
                                </div>

                                <BaseMap>
                                    {riskZones.length > 0 && (
                                        <GeoJSON
                                            key={`risk-${riskZones.length}`}
                                            data={keralaGeoJSON}
                                            style={styleFeature}
                                            filter={filterFeature}
                                        />
                                    )}
                                    {filteredMarkers.map((marker, idx) => (
                                        marker.lat && marker.lng && (
                                            <Marker
                                                key={`marker-${idx}`}
                                                position={[marker.lat, marker.lng]}
                                                icon={MARKER_ICONS[marker.type] || createIcon()}
                                            >
                                                <Popup className="custom-popup">
                                                    <div className="m-0 p-1">
                                                        <div className="font-bold text-sm mb-1">{marker.title}</div>
                                                        <div className="text-xs text-gray-600 mb-1">{marker.district}</div>
                                                        <div className="text-xs">{marker.details}</div>
                                                    </div>
                                                </Popup>
                                            </Marker>
                                        )
                                    ))}
                                </BaseMap>
                            </div>
                        </div>
                        <div className="bg-surface p-4 sm:p-6 rounded-2xl shadow-sm border border-white/10 h-auto lg:h-80 overflow-y-auto">
                            <h3 className="font-bold text-lg mb-4 text-white">Recent Alerts</h3>
                            <ul className="space-y-3">
                                {riskZones.filter(r => r.risk === 'High' || r.risk === 'Moderate').length > 0 ? (
                                    riskZones
                                        .filter(r => r.risk === 'High' || r.risk === 'Moderate')
                                        .sort((a) => a.risk === 'High' ? -1 : 1)
                                        .slice(0, 5)
                                        .map((alert, idx) => (
                                            <li key={idx} className={`p-3 rounded-lg text-xs sm:text-sm border ${alert.risk === 'High' ? 'bg-red-900/30 text-red-400 border-red-500/30' :
                                                'bg-orange-900/30 text-orange-400 border-orange-500/30'
                                                }`}>
                                                {alert.risk === 'High' ? '🔴' : '🟠'} {alert.district} under {alert.risk} risk
                                                <p className="text-[10px] mt-1 text-gray-400 truncate">{alert.description}</p>
                                            </li>
                                        ))
                                ) : (
                                    <li className="p-3 text-gray-500 text-center text-sm border border-dashed border-white/10 rounded-lg">
                                        No active alerts at this time.
                                    </li>
                                )}
                            </ul>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
};

export default Dashboard;
