import React, { createContext, useContext, useEffect, useState, useRef } from 'react';
import { AlertTriangle, X } from 'lucide-react';
import api from '../services/api';

const GlobalAlertContext = createContext();

const getAlertStyles = (alert) => {
    const level = (alert.priority || alert.risk || '').toLowerCase();
    switch (level) {
        case 'low':
        case 'safe':
            return {
                bg: 'bg-green-600',
                border: 'border-green-400',
                text: 'text-white',
                iconBg: 'bg-white/20',
                iconColor: 'text-white',
                mutedText: 'text-white/70'
            };
        case 'moderate':
        case 'medium':
        case 'warning':
            return {
                bg: 'bg-yellow-500',
                border: 'border-yellow-400',
                text: 'text-black',
                iconBg: 'bg-black/10',
                iconColor: 'text-black',
                mutedText: 'text-black/60'
            };
        case 'high':
        case 'danger':
            return {
                bg: 'bg-orange-500',
                border: 'border-orange-400',
                text: 'text-white',
                iconBg: 'bg-white/20',
                iconColor: 'text-white',
                mutedText: 'text-white/70'
            };
        case 'critical':
        case 'extreme':
            return {
                bg: 'bg-red-600',
                border: 'border-red-400',
                text: 'text-white',
                iconBg: 'bg-white/20',
                iconColor: 'text-white',
                mutedText: 'text-white/70'
            };
        default:
            return {
                bg: 'bg-blue-600',
                border: 'border-blue-400',
                text: 'text-white',
                iconBg: 'bg-white/20',
                iconColor: 'text-white',
                mutedText: 'text-white/70'
            };
    }
};

export const GlobalAlertProvider = ({ children }) => {
    const [alerts, setAlerts] = useState([]);
    const previousRiskRef = useRef({});
    const previousManualAlertsRef = useRef(new Set());
    const isFirstLoad = useRef(true);

    useEffect(() => {
        // Function to check for new risks
        const checkRiskUpdates = async () => {
            try {
                // Poll Risk Map
                const res = await api.get('/alerts/risk-map');
                const riskData = res.data;

                // Poll Manual Alerts
                const manualRes = await api.get('/alerts/manual');
                const manualData = manualRes.data.data || [];

                const newAlerts = [];
                const currentRiskMap = {};

                // Process Risk Map
                riskData.forEach(d => {
                    const currentRisk = d.risk;
                    const prevRisk = previousRiskRef.current[d.district];

                    // Check if it's a newly elevated risk (Moderate or High)
                    const isNowElevated = currentRisk === 'High' || currentRisk === 'Moderate';
                    const wasElevated = prevRisk === 'High' || prevRisk === 'Moderate';

                    if (isNowElevated && !wasElevated && Object.keys(previousRiskRef.current).length > 0) {
                        // The risk just elevated, and this wasn't the first load
                        newAlerts.push({
                            id: Date.now() + Math.random(),
                            title: `⚠️ TIER ELEVATED: ${d.district}`,
                            district: d.district,
                            risk: currentRisk,
                            description: d.description || `Risk level for ${d.district} is now ${currentRisk}. Please stay alert.`,
                            isManual: d.isManualOverride
                        });
                    }

                    currentRiskMap[d.district] = currentRisk;
                });

                // Process Manual Alerts
                const currentAlertIds = new Set();
                manualData.forEach(alert => {
                    currentAlertIds.add(alert._id);
                    if (!previousManualAlertsRef.current.has(alert._id) && !isFirstLoad.current) {
                        newAlerts.push({
                            id: alert._id,
                            title: `🚨 ${alert.priority.toUpperCase()} ALERT`,
                            district: `Admin Broadcast`,
                            risk: alert.priority,
                            priority: alert.priority,
                            description: alert.message,
                            isManual: true
                        });
                    }
                });

                // Update refs for next interval
                previousRiskRef.current = currentRiskMap;
                previousManualAlertsRef.current = new Set([...previousManualAlertsRef.current, ...currentAlertIds]);
                isFirstLoad.current = false;

                if (newAlerts.length > 0) {
                    setAlerts(prev => [...prev, ...newAlerts]);
                }
            } catch (err) {
                console.error('Failed to poll risk data:', err);
            }
        };

        // Initial fetch
        checkRiskUpdates();

        // Poll every 15 seconds
        const intervalId = setInterval(checkRiskUpdates, 15000);

        return () => clearInterval(intervalId);
    }, []);

    const dismissAlert = (id) => {
        setAlerts(prev => prev.filter(a => a.id !== id));
    };

    return (
        <GlobalAlertContext.Provider value={{}}>
            {children}

            {/* Global Overlay for Active Alerts */}
            {alerts.length > 0 && (
                <div className="fixed top-6 left-1/2 -translate-x-1/2 z-[9999] flex flex-col gap-4 w-full max-w-md pointer-events-none px-4 font-sans">
                    {alerts.map(alert => {
                        const style = getAlertStyles(alert);
                        return (
                            <div key={alert.id} className={`pointer-events-auto border ${style.bg} ${style.border} ${style.text} px-6 py-4 rounded-xl shadow-2xl flex items-start gap-4 relative overflow-hidden animate-bounce-in`}>
                                {/* Background Pulse Effect */}
                                <div className={`absolute -top-10 -left-10 w-20 h-20 bg-white/20 rounded-full blur-2xl animate-pulse`}></div>

                                <div className={`${style.iconBg} rounded-full p-2 mt-1 shrink-0 relative z-10`}>
                                    <AlertTriangle className={`w-6 h-6 ${style.iconColor}`} />
                                </div>

                                <div className="flex-1 relative z-10">
                                    <h4 className="font-bold text-lg uppercase tracking-wider mb-2">
                                        {alert.title}
                                    </h4>
                                    <p className="font-medium text-sm leading-relaxed mb-1 opacity-95">
                                        {alert.description}
                                    </p>
                                    <p className={`text-[10px] mt-2 font-bold uppercase tracking-wide ${style.mutedText}`}>
                                        LEVEL: {alert.priority || alert.risk}
                                    </p>
                                </div>

                                <button
                                    onClick={() => dismissAlert(alert.id)}
                                    className="bg-black/10 hover:bg-black/20 p-1.5 rounded-lg transition relative z-10 ml-2"
                                >
                                    <X className="w-4 h-4" />
                                </button>
                            </div>
                        );
                    })}
                </div>
            )}
        </GlobalAlertContext.Provider>
    );
};

export const useGlobalAlert = () => useContext(GlobalAlertContext);
