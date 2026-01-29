import React from 'react';
import { Users } from 'lucide-react';

const CampOccupancy = () => {
    return (
        <div className="p-6">
            <h2 className="text-3xl font-bold mb-8">Occupancy Monitor</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[1, 2, 3, 4, 5].map((camp) => (
                    <div key={camp} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                        <h3 className="font-bold text-lg text-gray-800 mb-4">Camp {camp}</h3>

                        <div className="flex justify-between items-end mb-2">
                            <span className="text-4xl font-bold text-indigo-600">{120 + camp * 10}</span>
                            <span className="text-gray-400 text-sm mb-1">/ 200 Capacity</span>
                        </div>
                        <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden mb-4">
                            <div className="h-full bg-indigo-500" style={{ width: `${60 + camp * 5}%` }}></div>
                        </div>

                        <div className="grid grid-cols-3 gap-2 mt-4 pt-4 border-t border-gray-100">
                            <div className="text-center">
                                <p className="text-xs text-gray-400">Men</p>
                                <p className="font-bold text-gray-700">45</p>
                            </div>
                            <div className="text-center border-l border-gray-100">
                                <p className="text-xs text-gray-400">Women</p>
                                <p className="font-bold text-gray-700">55</p>
                            </div>
                            <div className="text-center border-l border-gray-100">
                                <p className="text-xs text-gray-400">Kids</p>
                                <p className="font-bold text-gray-700">20</p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default CampOccupancy;
