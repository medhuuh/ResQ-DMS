import React from 'react';

const Dashboard = () => {
    return (
        <div className="p-4 sm:p-0">
            <h2 className="text-2xl sm:text-3xl font-bold mb-6 text-white">Overview</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
                {[
                    { title: 'Total Refugees', value: '1,245', color: 'bg-blue-500' },
                    { title: 'Active Camps', value: '12', color: 'bg-green-500' },
                    { title: 'Resources Low', value: '3', color: 'bg-red-500' },
                    { title: 'Volunteers', value: '85', color: 'bg-purple-500' }
                ].map((stat, idx) => (
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
                <div className="bg-surface p-4 sm:p-6 rounded-2xl shadow-sm border border-white/10 h-64 sm:h-80">
                    <h3 className="font-bold text-lg mb-4 text-white">Live Disaster Map</h3>
                    <div className="w-full h-[calc(100%-3rem)] bg-black/20 rounded-xl flex items-center justify-center text-gray-500 text-sm">
                        Map Integration placeholder
                    </div>
                </div>
                <div className="bg-surface p-4 sm:p-6 rounded-2xl shadow-sm border border-white/10 h-auto lg:h-80 overflow-y-auto">
                    <h3 className="font-bold text-lg mb-4 text-white">Recent Alerts</h3>
                    <ul className="space-y-3">
                        <li className="p-3 bg-red-900/30 text-red-400 rounded-lg text-xs sm:text-sm border border-red-500/30">
                            🔴 High Flood Risk in District A - Evacuate immediately
                        </li>
                        <li className="p-3 bg-yellow-900/30 text-yellow-500 rounded-lg text-xs sm:text-sm border border-yellow-500/30">
                            ⚠️ Landslide warning issued for Hill B
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
