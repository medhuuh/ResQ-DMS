import React, { useState } from 'react';
import { CloudRain, Activity, AlertOctagon, Send, Radio } from 'lucide-react';

import { useNotification } from '../../context/NotificationContext';

const DisasterAlerts = ({ isPublic = false }) => {
    const [alertMessage, setAlertMessage] = useState('');
    const [alertPriority, setAlertPriority] = useState('critical');
    const { showNotification } = useNotification();

    const handleBroadcast = () => {
        if (!alertMessage.trim()) return;
        showNotification(alertMessage, alertPriority);
        setAlertMessage('');
        setAlertPriority('critical');
    };

    return (
        <div className="p-6">
            <h2 className="text-3xl font-bold mb-8 text-white">Disaster Prediction & Alerts</h2>

            {/* Weather Forecast */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                <div className="bg-surface p-6 rounded-2xl shadow-sm border border-white/10">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="font-bold text-xl flex items-center gap-2 text-white">
                            <CloudRain className="text-blue-500" /> Weather Forecast
                        </h3>
                        <span className="text-sm text-gray-400">Next 5 Days</span>
                    </div>
                    <div className="overflow-hidden relative pb-2 group mask-linear-fade">
                        <div className="flex gap-4 animate-scroll pause-on-hover w-max">
                            {[
                                { day: 'Today', temp: '28°C', rain: '80%', status: 'Heavy Rain' },
                                { day: 'Tom', temp: '27°C', rain: '90%', status: 'Storm' },
                                { day: 'Wed', temp: '29°C', rain: '40%', status: 'Cloudy' },
                                { day: 'Thu', temp: '30°C', rain: '10%', status: 'Sunny' },
                                { day: 'Fri', temp: '31°C', rain: '0%', status: 'Sunny' },
                                { day: 'Today', temp: '28°C', rain: '80%', status: 'Heavy Rain' },
                                { day: 'Tom', temp: '27°C', rain: '90%', status: 'Storm' },
                                { day: 'Wed', temp: '29°C', rain: '40%', status: 'Cloudy' },
                                { day: 'Thu', temp: '30°C', rain: '10%', status: 'Sunny' },
                                { day: 'Fri', temp: '31°C', rain: '0%', status: 'Sunny' },
                            ].map((d, i) => (
                                <div key={i} className="w-[140px] bg-black/20 p-4 rounded-xl text-center border border-white/5 hover:bg-white/5 transition flex-shrink-0">
                                    <p className="font-bold text-gray-400 mb-1">{d.day}</p>
                                    <h4 className="text-2xl font-bold text-blue-500 mb-1">{d.temp}</h4>
                                    <p className="text-xs text-blue-400 font-medium">{d.status}</p>
                                    <p className="text-xs text-gray-500 mt-1">Rain: {d.rain}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Earthquake Monitor */}
                <div className="bg-surface p-6 rounded-2xl shadow-sm border border-white/10">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="font-bold text-xl flex items-center gap-2 text-white">
                            <Activity className="text-orange-500" /> Earthquake Monitor
                        </h3>
                        <div className="flex items-center gap-2">
                            <span className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></span>
                            <span className="text-sm text-green-500 font-bold">Stable</span>
                        </div>
                    </div>
                    <div className="h-40 bg-black/30 rounded-xl flex items-center justify-center relative overflow-hidden ring-1 ring-white/5">
                        {/* Simulated Seismograph Line */}
                        <div className="absolute inset-0 flex items-center justify-center text-gray-500 font-mono text-sm">
                            [Live Seismograph Data Visualization]
                        </div>
                        <div className="absolute bottom-4 left-4">
                            <p className="text-xs text-gray-500">Magnitude</p>
                            <p className="font-bold text-white">1.2 Rch</p>
                        </div>
                        <div className="absolute bottom-4 right-4 text-right">
                            <p className="text-xs text-gray-500">Epicenter</p>
                            <p className="font-bold text-white">Arabian Sea</p>
                        </div>
                    </div>
                </div>
            </div>

            <div className={`grid grid-cols-1 ${!isPublic ? 'lg:grid-cols-3' : ''} gap-8`}>
                {/* Landslide Risk */}
                <div className="bg-surface p-6 rounded-2xl shadow-sm border border-white/10">
                    <h3 className="font-bold text-xl flex items-center gap-2 mb-4 text-white">
                        <AlertOctagon className="text-red-500" /> Landslide Risk
                    </h3>
                    <div className="flex items-center justify-center py-6">
                        <div className="w-48 h-48 rounded-full border-8 border-yellow-500/20 flex flex-col items-center justify-center relative">
                            <div className="absolute inset-0 rounded-full border-t-8 border-yellow-500 rotate-45"></div>
                            <span className="text-4xl font-bold text-yellow-500">Medium</span>
                            <span className="text-sm text-gray-400">Risk Level</span>
                        </div>
                    </div>
                    <p className="text-center text-sm text-gray-400 mt-2">
                        Soil moisture levels are rising in hill stations.
                    </p>
                </div>

                {/* Manual Alert Trigger - Admin Only */}
                {!isPublic && (
                    <div className="lg:col-span-2 bg-surface p-6 rounded-2xl shadow-sm border border-white/10">
                        <h3 className="font-bold text-xl flex items-center gap-2 mb-6 text-white">
                            <Radio className="text-indigo-500" /> Manual Alert Trigger
                        </h3>
                        <div className="bg-red-500/10 p-4 rounded-xl border border-red-500/20 mb-6">
                            <p className="text-sm text-red-400 font-medium">
                                ⚠️ Sending an alert will notify all registered users and volunteers
                            </p>
                        </div>
                        <div className="space-y-4">
                            {/* Priority Selector */}
                            <div className="flex gap-4 mb-4">
                                {[
                                    { id: 'low', label: 'Safe', color: 'bg-green-500', displayColor: 'green' },
                                    { id: 'medium', label: 'Warning', color: 'bg-yellow-500', displayColor: 'yellow' },
                                    { id: 'high', label: 'Danger', color: 'bg-orange-500', displayColor: 'orange' },
                                    { id: 'critical', label: 'Critical', color: 'bg-red-500', displayColor: 'red' },
                                ].map((p) => (
                                    <button
                                        key={p.id}
                                        onClick={() => setAlertPriority(p.id)}
                                        className={`flex-1 py-3 rounded-xl border transition-all flex items-center justify-center gap-2 ${alertPriority === p.id
                                            ? `${p.color} border-transparent text-black font-bold shadow-lg scale-105`
                                            : 'bg-black/20 border-white/10 text-gray-400 hover:bg-white/5'
                                            }`}
                                    >
                                        <div className={`w-3 h-3 rounded-full ${alertPriority === p.id ? 'bg-black' : p.color}`} />
                                        {p.label}
                                    </button>
                                ))}
                            </div>
                            <textarea
                                className="w-full p-4 bg-black/20 border border-white/10 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-red-500 text-white placeholder-gray-500 outline-none"
                                rows="3"
                                placeholder="Enter urgent alert message regarding disaster status..."
                                value={alertMessage}
                                onChange={(e) => setAlertMessage(e.target.value)}
                            ></textarea>
                            <div className="flex justify-end gap-3">
                                <button className="px-6 py-3 bg-white/5 text-gray-300 font-bold rounded-xl hover:bg-white/10 transition">
                                    Cancel
                                </button>
                                <button
                                    onClick={handleBroadcast}
                                    className="px-6 py-3 bg-red-600 text-white font-bold rounded-xl hover:bg-red-700 transition flex items-center gap-2 shadow-lg shadow-red-500/30"
                                >
                                    <Send className="w-4 h-4" /> Broadcast Alert
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default DisasterAlerts;
