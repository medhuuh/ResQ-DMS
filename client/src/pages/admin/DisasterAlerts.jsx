import React, { useState, useEffect } from 'react';
import { CloudRain, AlertOctagon, Send, Radio, Sun, Cloud, CloudDrizzle, CloudLightning, CloudSnow, Wind, Droplets, Thermometer, RefreshCw, AlertTriangle, MapPin, Calendar, Clock, ChevronDown, ChevronUp, Shield } from 'lucide-react';
import { useNotification } from '../../context/NotificationContext';
import { landslidesAPI, alertsAPI } from '../../services/api';

const API_KEY = import.meta.env.VITE_OPENWEATHER_API_KEY;

const getWeatherIcon = (iconCode) => {
    if (!iconCode) return Cloud;
    const code = iconCode.substring(0, 2);
    switch (code) {
        case '01': return Sun;
        case '02': return Cloud;
        case '03': return Cloud;
        case '04': return Cloud;
        case '09': return CloudDrizzle;
        case '10': return CloudRain;
        case '11': return CloudLightning;
        case '13': return CloudSnow;
        case '50': return Wind;
        default: return Cloud;
    }
};

const getDayName = (timestamp) => {
    const date = new Date(timestamp * 1000);
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    if (date.toDateString() === today.toDateString()) return 'Today';
    if (date.toDateString() === tomorrow.toDateString()) return 'Tomorrow';
    return date.toLocaleDateString('en-US', { weekday: 'short' });
};

const riskConfig = {
    Low: { color: 'green', bg: 'bg-green-500/20', border: 'border-green-500/30', text: 'text-green-400', ring: 'border-green-500', icon: Shield },
    Medium: { color: 'yellow', bg: 'bg-yellow-500/20', border: 'border-yellow-500/30', text: 'text-yellow-400', ring: 'border-yellow-500', icon: AlertTriangle },
    High: { color: 'orange', bg: 'bg-orange-500/20', border: 'border-orange-500/30', text: 'text-orange-400', ring: 'border-orange-500', icon: AlertOctagon },
    Extreme: { color: 'red', bg: 'bg-red-500/20', border: 'border-red-500/30', text: 'text-red-400', ring: 'border-red-500', icon: AlertOctagon }
};

const KERALA_DISTRICTS = {
    "Alappuzha": { lat: 9.4981, lon: 76.3388 },
    "Ernakulam": { lat: 9.9816, lon: 76.2999 },
    "Idukki": { lat: 9.8500, lon: 76.9500 },
    "Kannur": { lat: 11.8745, lon: 75.3704 },
    "Kasaragod": { lat: 12.4996, lon: 74.9869 },
    "Kollam": { lat: 8.8932, lon: 76.6141 },
    "Kottayam": { lat: 9.5916, lon: 76.5222 },
    "Kozhikode": { lat: 11.2588, lon: 75.7804 },
    "Malappuram": { lat: 11.0732, lon: 76.0740 },
    "Palakkad": { lat: 10.7867, lon: 76.6548 },
    "Pathanamthitta": { lat: 9.2642, lon: 76.7870 },
    "Thiruvananthapuram": { lat: 8.5241, lon: 76.9366 },
    "Thrissur": { lat: 10.5276, lon: 76.2144 },
    "Wayanad": { lat: 11.6854, lon: 76.1320 }
};

const DisasterAlerts = ({ isPublic = false }) => {
    const [alertMessage, setAlertMessage] = useState('');
    const [alertPriority, setAlertPriority] = useState('critical');
    const { showNotification } = useNotification();

    // Weather state
    const [weather, setWeather] = useState(null);
    const [currentWeather, setCurrentWeather] = useState(null);
    const [weatherLoading, setWeatherLoading] = useState(true);
    const [locationName, setLocationName] = useState('');

    // Landslide risk state
    const [riskData, setRiskData] = useState(null);
    const [riskLoading, setRiskLoading] = useState(true);
    const [showAllAlerts, setShowAllAlerts] = useState(false);

    // Selected location for explicit choice
    const [selectedDistrict, setSelectedDistrict] = useState(() => {
        return localStorage.getItem('resq-weather-district') || 'Ernakulam';
    });

    useEffect(() => {
        fetchWeather(selectedDistrict);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selectedDistrict]);

    const fetchWeather = async (district) => {
        setWeatherLoading(true);
        try {
            let lat = 11.6854, lon = 76.1320; // Wayanad default

            if (district && KERALA_DISTRICTS[district]) {
                lat = KERALA_DISTRICTS[district].lat;
                lon = KERALA_DISTRICTS[district].lon;
            } else if (navigator.geolocation) {
                try {
                    const pos = await new Promise((res, rej) => navigator.geolocation.getCurrentPosition(res, rej, { timeout: 5000 }));
                    lat = pos.coords.latitude;
                    lon = pos.coords.longitude;
                } catch { /* use default */ }
            }

            // Current weather
            const currentRes = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`);
            const currentData = await currentRes.json();

            if (currentData.cod === 200) {
                setCurrentWeather({
                    temp: Math.round(currentData.main.temp),
                    feelsLike: Math.round(currentData.main.feels_like),
                    humidity: currentData.main.humidity,
                    windSpeed: Math.round(currentData.wind.speed * 3.6),
                    description: currentData.weather[0].description,
                    icon: currentData.weather[0].icon,
                    rain: currentData.rain ? currentData.rain['1h'] || currentData.rain['3h'] || 0 : 0
                });
                setLocationName(currentData.name);

                // Fetch risk assessment with rainfall data
                const rainfall = currentData.rain ? (currentData.rain['1h'] || currentData.rain['3h'] || 0) : 0;
                fetchRiskAssessment(rainfall);
            }

            // 5-day forecast
            const forecastRes = await fetch(`https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`);
            const forecastData = await forecastRes.json();

            if (forecastData.cod === '200') {
                const dailyForecasts = [];
                const seenDates = new Set();
                for (const item of forecastData.list) {
                    const date = new Date(item.dt * 1000).toDateString();
                    if (!seenDates.has(date) && dailyForecasts.length < 5) {
                        seenDates.add(date);
                        dailyForecasts.push({
                            day: getDayName(item.dt),
                            temp: Math.round(item.main.temp),
                            humidity: item.main.humidity,
                            description: item.weather[0].description,
                            icon: item.weather[0].icon,
                            rain: item.pop ? Math.round(item.pop * 100) : 0
                        });
                    }
                }
                setWeather(dailyForecasts);
            }
        } catch (err) {
            console.error('Weather error:', err);
        } finally {
            setWeatherLoading(false);
        }
    };

    const fetchRiskAssessment = async (rainfall = 0) => {
        setRiskLoading(true);
        try {
            const res = await landslidesAPI.getRiskAssessment({ rainfall });
            setRiskData(res.data.data);
        } catch (err) {
            console.error('Risk assessment error:', err);
        } finally {
            setRiskLoading(false);
        }
    };

    const handleBroadcast = async () => {
        if (!alertMessage.trim()) return;
        try {
            await alertsAPI.broadcastManualAlert({ message: alertMessage, priority: alertPriority });
            showNotification('Alert broadcasted successfully. All devices will sync shortly.', 'success');
            setAlertMessage('');
            setAlertPriority('critical');
        } catch (err) {
            console.error('Broadcast failed', err);
            showNotification('Failed to broadcast alert', 'error');
        }
    };

    const risk = riskData ? riskConfig[riskData.riskLevel] || riskConfig.Low : riskConfig.Low;
    const visibleAlerts = showAllAlerts ? (riskData?.alerts || []) : (riskData?.alerts || []).slice(0, 4);

    return (
        <div className="p-4 sm:p-6">
            <h2 className="text-2xl sm:text-3xl font-bold mb-6 sm:mb-8 text-white">Disaster Prediction & Alerts</h2>

            {/* Weather Section */}
            <div className="mb-8">
                <div className="bg-surface p-4 sm:p-6 rounded-2xl shadow-sm border border-white/10">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                        <h3 className="font-bold text-lg sm:text-xl flex items-center gap-2 text-white">
                            <CloudRain className="text-blue-500" /> Weather Forecast
                            {locationName && <span className="text-xs sm:text-sm text-gray-400 font-normal">— {selectedDistrict || locationName}</span>}
                        </h3>
                        <div className="flex items-center gap-3 w-full sm:w-auto">
                            <select
                                value={selectedDistrict}
                                onChange={(e) => {
                                    const val = e.target.value;
                                    setSelectedDistrict(val);
                                    if (val) localStorage.setItem('resq-weather-district', val);
                                    else localStorage.removeItem('resq-weather-district');
                                }}
                                className="bg-black/30 border border-white/10 text-white text-sm rounded-xl px-3 py-1.5 focus:outline-none focus:border-blue-500 w-full sm:w-auto"
                            >
                                <option value="">🎯 Use My GPS Location</option>
                                {Object.keys(KERALA_DISTRICTS).sort().map(d => (
                                    <option key={d} value={d}>{d}</option>
                                ))}
                            </select>
                            <button onClick={() => fetchWeather(selectedDistrict)} className="flex items-center gap-1 p-2 bg-white/5 rounded-xl text-gray-400 hover:text-white transition">
                                <RefreshCw className={`w-4 h-4 ${weatherLoading ? 'animate-spin' : ''}`} />
                            </button>
                        </div>
                    </div>

                    {weatherLoading ? (
                        <div className="flex justify-center py-12"><div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div></div>
                    ) : (
                        <>
                            {currentWeather && (
                                <div className="bg-gradient-to-br from-blue-600/20 to-blue-800/10 p-4 sm:p-5 rounded-xl border border-blue-500/20 mb-5">
                                    <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 sm:gap-6">
                                        <div className="text-center sm:text-left">
                                            <p className="text-xs text-blue-400 font-bold uppercase tracking-wider mb-1">Right Now</p>
                                            <div className="flex items-center gap-3">
                                                {React.createElement(getWeatherIcon(currentWeather.icon), { className: 'w-10 h-10 text-blue-400' })}
                                                <span className="text-4xl sm:text-5xl font-bold text-white">{currentWeather.temp}°C</span>
                                            </div>
                                            <p className="text-sm text-blue-300 capitalize mt-1">{currentWeather.description}</p>
                                        </div>
                                        <div className="flex flex-wrap gap-4 sm:gap-6 sm:ml-auto">
                                            <div className="flex items-center gap-2 text-sm text-gray-300"><Thermometer className="w-4 h-4 text-orange-400" /><span>Feels {currentWeather.feelsLike}°C</span></div>
                                            <div className="flex items-center gap-2 text-sm text-gray-300"><Droplets className="w-4 h-4 text-blue-400" /><span>{currentWeather.humidity}%</span></div>
                                            <div className="flex items-center gap-2 text-sm text-gray-300"><Wind className="w-4 h-4 text-gray-400" /><span>{currentWeather.windSpeed} km/h</span></div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {weather && (
                                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3 sm:gap-4">
                                    {weather.map((d, i) => {
                                        const WeatherIcon = getWeatherIcon(d.icon);
                                        return (
                                            <div key={i} className="bg-black/20 p-3 sm:p-4 rounded-xl text-center border border-white/5 hover:bg-white/5 transition">
                                                <p className="font-bold text-[10px] sm:text-xs text-gray-400 mb-2">{d.day}</p>
                                                <WeatherIcon className="w-6 h-6 mx-auto text-blue-400 mb-1" />
                                                <h4 className="text-xl sm:text-2xl font-bold text-blue-500 mb-1">{d.temp}°C</h4>
                                                <p className="text-[10px] sm:text-xs text-blue-400 font-medium capitalize">{d.description}</p>
                                                <p className="text-[10px] sm:text-xs text-gray-500 mt-1">Rain: {d.rain}%</p>
                                            </div>
                                        );
                                    })}
                                </div>
                            )}
                        </>
                    )}
                </div>
            </div>

            {/* Landslide Risk Assessment */}
            <div className="mb-8">
                <div className={`bg-surface p-4 sm:p-6 rounded-2xl shadow-sm border ${riskData && riskData.riskLevel !== 'Low' ? risk.border : 'border-white/10'} transition-colors`}>
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="font-bold text-lg sm:text-xl flex items-center gap-2 text-white">
                            <AlertOctagon className={risk.text} /> Landslide Risk Assessment
                        </h3>
                        {riskData && (
                            <span className={`text-xs font-bold ${risk.text}`}>
                                Week {riskData.currentWeek} • {new Date().toLocaleDateString('en-US', { month: 'long' })}
                            </span>
                        )}
                    </div>

                    {riskLoading ? (
                        <div className="flex justify-center py-12"><div className="w-8 h-8 border-4 border-yellow-500 border-t-transparent rounded-full animate-spin"></div></div>
                    ) : riskData ? (
                        <div className="space-y-6">
                            {/* Risk Gauge + Summary */}
                            <div className="flex flex-col lg:flex-row gap-6">
                                {/* Risk Circle */}
                                <div className="flex flex-col items-center">
                                    <div className={`w-36 h-36 sm:w-44 sm:h-44 rounded-full border-8 ${risk.ring}/20 flex flex-col items-center justify-center relative`}>
                                        <div className={`absolute inset-0 rounded-full border-t-8 ${risk.ring} rotate-45`}></div>
                                        <span className={`text-2xl sm:text-3xl font-bold ${risk.text}`}>{riskData.riskLevel}</span>
                                        <span className="text-xs sm:text-sm text-gray-400">Risk Level</span>
                                        <span className="text-[10px] text-gray-500 mt-1">Score: {riskData.riskScore}</span>
                                    </div>
                                </div>

                                {/* Summary Info */}
                                <div className="flex-1 space-y-3">
                                    {/* Summary message */}
                                    <div className={`p-4 rounded-xl ${risk.bg} border ${risk.border}`}>
                                        <p className={`text-sm font-medium ${risk.text}`}>{riskData.summary}</p>
                                    </div>

                                    {/* Stats */}
                                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                                        <div className="bg-black/20 p-3 rounded-xl border border-white/5 text-center">
                                            <p className="text-[10px] text-gray-500 uppercase tracking-wider">This Week</p>
                                            <p className="text-lg font-bold text-white">{riskData.totalWeekMatches}</p>
                                            <p className="text-[10px] text-gray-400">historical events</p>
                                        </div>
                                        <div className="bg-black/20 p-3 rounded-xl border border-white/5 text-center">
                                            <p className="text-[10px] text-gray-500 uppercase tracking-wider">This Month</p>
                                            <p className="text-lg font-bold text-white">{riskData.totalMonthMatches}</p>
                                            <p className="text-[10px] text-gray-400">historical events</p>
                                        </div>
                                        <div className="bg-black/20 p-3 rounded-xl border border-white/5 text-center">
                                            <p className="text-[10px] text-gray-500 uppercase tracking-wider">Rainfall</p>
                                            <p className={`text-lg font-bold ${risk.text}`}>{riskData.rainfallLevel}</p>
                                            <p className="text-[10px] text-gray-400">{riskData.currentRainfall} mm</p>
                                        </div>
                                    </div>

                                    {/* District risks */}
                                    {Object.keys(riskData.districtRisks).length > 0 && (
                                        <div>
                                            <p className="text-xs text-gray-400 mb-2 font-bold uppercase tracking-wider">At-Risk Districts</p>
                                            <div className="flex flex-wrap gap-2">
                                                {Object.entries(riskData.districtRisks)
                                                    .sort((a, b) => b[1].count - a[1].count)
                                                    .map(([district, info]) => {
                                                        const dRisk = riskConfig[info.maxSeverity] || riskConfig.Low;
                                                        return (
                                                            <span key={district} className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold ${dRisk.bg} ${dRisk.text} border ${dRisk.border}`}>
                                                                <MapPin className="w-3 h-3" />
                                                                {district} ({info.count})
                                                            </span>
                                                        );
                                                    })}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Historical Alerts Timeline */}
                            {riskData.alerts.length > 0 && (
                                <div>
                                    <p className="text-xs text-gray-400 mb-3 font-bold uppercase tracking-wider">Historical Events Matching This Period</p>
                                    <div className="space-y-2">
                                        {visibleAlerts.map((alert, i) => {
                                            const aRisk = riskConfig[alert.severity] || riskConfig.Low;
                                            return (
                                                <div key={i} className={`flex items-start gap-3 p-3 rounded-xl ${alert.type === 'week' ? 'bg-black/30 border border-white/10' : 'bg-black/15 border border-white/5'} hover:bg-white/5 transition`}>
                                                    <div className={`mt-0.5 w-2 h-2 rounded-full flex-shrink-0 ${aRisk.text === 'text-green-400' ? 'bg-green-400' : aRisk.text === 'text-yellow-400' ? 'bg-yellow-400' : aRisk.text === 'text-orange-400' ? 'bg-orange-400' : 'bg-red-400'}`}></div>
                                                    <div className="flex-1 min-w-0">
                                                        <div className="flex items-center gap-2 flex-wrap">
                                                            <span className={`text-xs font-bold ${aRisk.text}`}>{alert.severity}</span>
                                                            <span className="text-[10px] text-gray-500">•</span>
                                                            <span className="text-xs text-gray-400 flex items-center gap-1"><MapPin className="w-3 h-3" />{alert.location}, {alert.district}</span>
                                                            <span className="text-[10px] text-gray-500">•</span>
                                                            <span className="text-[10px] text-gray-500 flex items-center gap-1">
                                                                <Calendar className="w-3 h-3" />
                                                                {new Date(alert.historicalDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                                                            </span>
                                                        </div>
                                                        <p className="text-xs text-gray-300 mt-1">{alert.description}</p>
                                                        <p className="text-[10px] text-gray-500 mt-0.5 italic">{alert.yearsAgo} year{alert.yearsAgo > 1 ? 's' : ''} ago — {alert.type === 'week' ? 'same week' : 'same month'}</p>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                    {riskData.alerts.length > 4 && (
                                        <button onClick={() => setShowAllAlerts(!showAllAlerts)} className="mt-3 flex items-center gap-1 text-xs text-primary font-bold hover:underline mx-auto">
                                            {showAllAlerts ? <><ChevronUp className="w-3 h-3" /> Show Less</> : <><ChevronDown className="w-3 h-3" /> Show All {riskData.alerts.length} Events</>}
                                        </button>
                                    )}
                                </div>
                            )}
                        </div>
                    ) : (
                        <p className="text-center text-gray-500 py-8">Unable to load risk data</p>
                    )}
                </div>
            </div>

            {/* Manual Alert Trigger - Admin Only */}
            {!isPublic && (
                <div className="bg-surface p-4 sm:p-6 rounded-2xl shadow-sm border border-white/10">
                    <h3 className="font-bold text-lg sm:text-xl flex items-center gap-2 mb-6 text-white">
                        <Radio className="text-indigo-500" /> Manual Alert Trigger
                    </h3>
                    <div className="bg-red-500/10 p-4 rounded-xl border border-red-500/20 mb-6">
                        <p className="text-[10px] sm:text-sm text-red-400 font-medium">
                            ⚠️ Sending an alert will notify all registered users and volunteers
                        </p>
                    </div>
                    <div className="space-y-4">
                        <div className="grid grid-cols-2 sm:flex gap-3 sm:gap-4 mb-4">
                            {[
                                { id: 'low', label: 'Safe', color: 'bg-green-500' },
                                { id: 'medium', label: 'Warning', color: 'bg-yellow-500' },
                                { id: 'high', label: 'Danger', color: 'bg-orange-500' },
                                { id: 'critical', label: 'Critical', color: 'bg-red-500' },
                            ].map((p) => (
                                <button key={p.id} onClick={() => setAlertPriority(p.id)}
                                    className={`flex-1 py-2 sm:py-3 px-2 rounded-xl border transition-all flex items-center justify-center gap-2 ${alertPriority === p.id ? `${p.color} border-transparent text-black font-bold shadow-lg scale-105` : 'bg-black/20 border-white/10 text-gray-400 hover:bg-white/5'}`}>
                                    <div className={`w-2 h-2 sm:w-3 sm:h-3 rounded-full ${alertPriority === p.id ? 'bg-black' : p.color}`} />
                                    <span className="text-[10px] sm:text-xs">{p.label}</span>
                                </button>
                            ))}
                        </div>
                        <textarea className="w-full p-4 bg-black/20 border border-white/10 rounded-xl focus:ring-2 focus:ring-red-500 text-white placeholder-gray-500 outline-none text-sm" rows="3" placeholder="Enter urgent alert message..." value={alertMessage} onChange={(e) => setAlertMessage(e.target.value)}></textarea>
                        <div className="flex flex-col sm:flex-row justify-end gap-3">
                            <button className="w-full sm:w-auto px-6 py-3 bg-white/5 text-gray-300 font-bold rounded-xl hover:bg-white/10 transition text-sm">Cancel</button>
                            <button onClick={handleBroadcast} className="w-full sm:w-auto px-6 py-3 bg-red-600 text-white font-bold rounded-xl hover:bg-red-700 transition flex items-center justify-center gap-2 shadow-lg shadow-red-500/30 text-sm">
                                <Send className="w-4 h-4" /> Broadcast Alert
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default DisasterAlerts;
