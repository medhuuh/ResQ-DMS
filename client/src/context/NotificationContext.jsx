import React, { createContext, useContext, useState, useEffect } from 'react';
import { X, AlertTriangle } from 'lucide-react';

const NotificationContext = createContext();

export const useNotification = () => useContext(NotificationContext);

export const NotificationProvider = ({ children }) => {
    const [notification, setNotification] = useState(null);

    const showNotification = (message, type = 'emergency') => {
        const id = Date.now();
        const newNotif = { id, message, type };
        setNotification(newNotif);

        // Broadcast to other tabs
        // Adding a random component to key to ensure change detection even for same message
        localStorage.setItem('resq-broadcast-alert', JSON.stringify({ ...newNotif, timestamp: Date.now() }));

        setTimeout(() => setNotification(null), 6000);
    };

    useEffect(() => {
        const handleStorageChange = (e) => {
            if (e.key === 'resq-broadcast-alert' && e.newValue) {
                const alert = JSON.parse(e.newValue);
                // 'storage' event fires only on other tabs, which is exactly what we want for "all 3 users"
                setNotification(alert);
                setTimeout(() => setNotification(null), 6000);
            }
        };

        window.addEventListener('storage', handleStorageChange);
        return () => window.removeEventListener('storage', handleStorageChange);
    }, []);

    return (
        <NotificationContext.Provider value={{ showNotification }}>
            {children}
            {notification && (
                <div className="fixed top-6 right-6 z-[100] animate-bounce-in">
                    <div className={`
                        border-2 text-white px-6 py-4 rounded-2xl shadow-2xl flex items-start gap-4 max-w-md relative overflow-hidden
                        ${notification.type === 'low' ? 'bg-green-600 border-green-400' : ''}
                        ${notification.type === 'medium' ? 'bg-yellow-600 border-yellow-400' : ''}
                        ${notification.type === 'high' ? 'bg-orange-600 border-orange-400' : ''}
                        ${notification.type === 'critical' || notification.type === 'emergency' ? 'bg-red-600 border-red-400' : ''}
                    `}>
                        {/* Background Pulse Effect - only for high/critical */}
                        {(notification.type === 'high' || notification.type === 'critical' || notification.type === 'emergency') && (
                            <div className="absolute -top-10 -left-10 w-20 h-20 bg-white/20 rounded-full blur-2xl animate-pulse"></div>
                        )}

                        <div className="bg-white/20 rounded-full p-2 mt-1 shrink-0">
                            <AlertTriangle className="w-6 h-6 text-white" />
                        </div>
                        <div className="flex-1">
                            <h4 className="font-bold text-lg uppercase tracking-wider mb-1">
                                {notification.type === 'low' ? 'Safety Update' :
                                    notification.type === 'medium' ? 'Advisory' :
                                        notification.type === 'high' ? 'Warning' : 'Critical Alert'}
                            </h4>
                            <p className="text-white/90 font-medium leading-relaxed">{notification.message}</p>
                            <p className="text-xs text-white/70 mt-2 opacity-80 uppercase tracking-wide">
                                Priority: {notification.type === 'emergency' ? 'Critical' : notification.type}
                            </p>
                        </div>
                        <button
                            onClick={() => setNotification(null)}
                            className="bg-black/20 hover:bg-black/40 p-1 rounded-lg transition"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </div>
                </div>
            )}
        </NotificationContext.Provider>
    );
};
