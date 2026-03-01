import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Marker, Popup, GeoJSON } from 'react-leaflet';
import BaseMap, { MARKER_ICONS, createIcon } from '../../components/map/BaseMap';
import keralaGeoJSON from '../../data/kerala-districts.json';
import api from '../../services/api';
import { useLanguage } from '../../context/LanguageContext';

const LandingPage = () => {
    const { t } = useLanguage();
    const [markers, setMarkers] = useState([]);
    const [riskZones, setRiskZones] = useState([]);
    const [loadingMap, setLoadingMap] = useState(true);
    const [activeFilter, setActiveFilter] = useState('all');

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [markersRes, riskRes] = await Promise.all([
                    api.get('/alerts/live-markers'),
                    api.get('/alerts/risk-map').catch(() => ({ data: [] }))
                ]);
                setMarkers(markersRes.data.data || []);
                setRiskZones(riskRes.data || []);
            } catch (err) {
                console.error('Failed to fetch map data for landing page:', err);
            } finally {
                setLoadingMap(false);
            }
        };
        fetchData();
    }, []);

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

    const filteredMarkers = activeFilter === 'all' ? markers : markers.filter(m => m.type === activeFilter);

    return (
        <div className="min-h-screen bg-background">


            <main className="pt-4 sm:pt-10 pb-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
                <div className="text-center py-10 sm:py-20">
                    <h1 className="text-3xl sm:text-5xl font-extrabold text-white mb-6 leading-tight">
                        {t('hero.title')} <br />
                        <span className="text-primary">{t('tagline')}</span>
                    </h1>
                    <p className="text-base sm:text-xl text-gray-400 max-w-2xl mx-auto mb-10">
                        {t('hero.subtitle')}
                    </p>
                    <div className="flex flex-col sm:flex-row justify-center gap-4">
                        <Link to="/live-status" className="w-full sm:w-auto px-8 py-3 bg-primary text-white rounded-xl font-bold hover:bg-lime-700 transition shadow-lg shadow-lime-500/30 text-center">
                            {t('hero.cta')}
                        </Link>
                        <Link to="/login" className="w-full sm:w-auto px-8 py-3 bg-gray-900 text-white rounded-xl font-bold hover:bg-gray-800 transition text-center">
                            {t('staffLogin')}
                        </Link>
                    </div>

                    <div className="mt-16 w-full max-w-5xl mx-auto bg-surface p-4 sm:p-6 rounded-3xl border border-white/10 shadow-2xl relative">
                        <h2 className="text-2xl font-bold text-white mb-6 text-left flex items-center gap-3">
                            <span className="w-3 h-3 rounded-full bg-red-500 animate-pulse"></span>
                            Live Map
                        </h2>

                        <div className="w-full h-80 sm:h-[500px] rounded-2xl overflow-hidden shadow-inner border border-white/5 relative z-0">

                            {/* Filter bar */}
                            <div className="absolute top-3 left-3 z-[999] flex flex-wrap gap-2">
                                {[
                                    { key: 'all', label: 'All' },
                                    { key: 'camp', label: 'Camps' },
                                    { key: 'safehome', label: 'Safe Homes' },
                                    { key: 'alert', label: 'Alerts' }
                                ].map(f => (
                                    <button key={f.key} onClick={(e) => { e.stopPropagation(); setActiveFilter(f.key); }}
                                        className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${activeFilter === f.key
                                            ? 'bg-primary text-black shadow-lg'
                                            : 'bg-black/70 text-gray-300 hover:bg-black/90 border border-white/10'}`}>
                                        {f.label}
                                    </button>
                                ))}
                            </div>

                            {loadingMap ? (
                                <div className="w-full h-full flex items-center justify-center bg-black/40">
                                    <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
                                </div>
                            ) : (
                                <BaseMap>
                                    {riskZones.length > 0 && (
                                        <GeoJSON
                                            key={`lp-risk-${riskZones.length}`}
                                            data={keralaGeoJSON}
                                            style={styleFeature}
                                            filter={filterFeature}
                                        />
                                    )}
                                    {filteredMarkers.map((marker, idx) => (
                                        marker.lat && marker.lng && (
                                            <Marker
                                                key={`lp-marker-${idx}`}
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
                            )}
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default LandingPage;
