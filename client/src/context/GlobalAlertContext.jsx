import React, { createContext, useContext, useEffect, useState, useRef } from 'react';
import { AlertTriangle, X } from 'lucide-react';
import api from '../services/api';

const GlobalAlertContext = createContext();

export const GlobalAlertProvider = ({ children }) => {
    const [alerts, setAlerts] = useState([]);
    const previousRiskRef = useRef({});

    useEffect(() => {
        // Function to check for new risks
        const checkRiskUpdates = async () => {
            try {
                const res = await api.get('/alerts/risk-map');
                const riskData = res.data;

                const newAlerts = [];
                const currentRiskMap = {};

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
                            district: d.district,
                            risk: currentRisk,
                            description: d.description,
                            isManual: d.isManualOverride
                        });
                    }

                    currentRiskMap[d.district] = currentRisk;
                });

                // Update the ref for next interval
                previousRiskRef.current = currentRiskMap;

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
                    {alerts.map(alert => (
                        <div key={alert.id} className="pointer-events-auto bg-red-600 border border-red-400 text-white px-6 py-4 rounded-xl shadow-2xl flex items-start gap-4 relative overflow-hidden animate-bounce-in">
                            {/* Background Pulse Effect */}
                            <div className="absolute -top-10 -left-10 w-20 h-20 bg-white/20 rounded-full blur-2xl animate-pulse"></div>

                            <div className="bg-white/20 rounded-full p-2 mt-1 shrink-0 relative z-10">
                                <AlertTriangle className="w-6 h-6 text-white" />
                            </div>

                            <div className="flex-1 relative z-10">
                                <h4 className="font-bold text-lg uppercase tracking-wider mb-1">
                                    Critical Alert
                                </h4>
                                <p className="text-white/90 font-medium leading-relaxed mb-1">
                                    {alert.district} under {alert.risk.toLowerCase()} risk
                                </p>
                                <p className="text-xs text-white/70 mt-2 opacity-80 uppercase tracking-wide">
                                    Priority: {alert.risk}
                                </p>
                            </div>

                            <button
                                onClick={() => dismissAlert(alert.id)}
                                className="bg-black/20 hover:bg-black/40 p-1 rounded-lg transition relative z-10"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                    ))}
                </div>
            )}
        </GlobalAlertContext.Provider>
    );
};

export const useGlobalAlert = () => useContext(GlobalAlertContext);
