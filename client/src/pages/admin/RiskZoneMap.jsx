import React, { useState } from 'react';
import { MapPin, Info, X } from 'lucide-react';

const RiskZoneMap = ({ isPublic = false }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleAddZone = (e) => {
        e.preventDefault();
        // Here you would typically handle form submission
        console.log("Adding zone...");
        setIsModalOpen(false);
    };

    return (
        <div className="p-6 h-[calc(100vh-80px)] flex flex-col relative">
            {/* Modal Overlay */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in duration-200">
                        <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50">
                            <h3 className="text-xl font-bold text-gray-800">Add New Risk Zone</h3>
                            <button
                                onClick={() => setIsModalOpen(false)}
                                className="p-2 hover:bg-gray-200 rounded-full transition-colors"
                            >
                                <X className="w-5 h-5 text-gray-500" />
                            </button>
                        </div>

                        <form onSubmit={handleAddZone} className="p-6 space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Zone Name</label>
                                <input
                                    type="text"
                                    placeholder="e.g. Riverside Flood Area"
                                    className="w-full px-4 py-2 rounded-xl border border-gray-200 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/50"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Risk Level</label>
                                <select className="w-full px-4 py-2 rounded-xl border border-gray-200 text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary/50">
                                    <option value="high">High Risk (Red)</option>
                                    <option value="moderate">Moderate Risk (Yellow)</option>
                                    <option value="low">Low Risk (Green)</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                                <textarea
                                    rows="3"
                                    placeholder="Describe the potential risks..."
                                    className="w-full px-4 py-2 rounded-xl border border-gray-200 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/50"
                                ></textarea>
                            </div>

                            <div className="pt-4 flex gap-3">
                                <button
                                    type="button"
                                    onClick={() => setIsModalOpen(false)}
                                    className="flex-1 py-2.5 rounded-xl border border-gray-300 text-gray-700 font-medium hover:bg-gray-50 transition"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="flex-1 py-2.5 rounded-xl bg-red-600 text-white font-bold hover:bg-red-700 transition shadow-lg shadow-red-600/20"
                                >
                                    Add Zone
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            <div className="flex justify-between items-center mb-6">
                <div>
                    <h2 className="text-3xl font-bold">Risk Zone Map</h2>
                    <p className="text-gray-500">Geospatial view of vulnerable areas</p>
                </div>
                <div className="flex gap-2">
                    <span className="px-3 py-1 bg-red-100 text-red-700 rounded-full text-xs font-bold flex items-center gap-1"><span className="w-2 h-2 bg-red-500 rounded-full"></span> High Risk</span>
                    <span className="px-3 py-1 bg-yellow-100 text-yellow-700 rounded-full text-xs font-bold flex items-center gap-1"><span className="w-2 h-2 bg-yellow-500 rounded-full"></span> Moderate</span>
                    <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-bold flex items-center gap-1"><span className="w-2 h-2 bg-green-500 rounded-full"></span> Safe Zone</span>

                    {!isPublic && (
                        <button
                            onClick={() => setIsModalOpen(true)}
                            className="ml-4 px-4 py-2 bg-red-600 text-white font-bold rounded-xl shadow-lg hover:bg-red-700 transition"
                        >
                            + Add Zone
                        </button>
                    )}
                </div>
            </div>

            <div className="flex-1 bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden relative">
                {/* Map Placeholder */}
                <div className="absolute inset-0 bg-slate-100 flex items-center justify-center">
                    <div className="text-center text-gray-400">
                        <MapPin className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                        <p className="font-medium text-lg">Interactive Google Map / OpenStreetMap</p>
                        <p className="text-sm mt-2">API Integration Required</p>
                    </div>
                </div>

                {/* Overlay Info Panel */}
                <div className="absolute top-4 right-4 w-80 bg-white/90 backdrop-blur-sm p-4 rounded-xl shadow-lg border border-gray-200">
                    <h4 className="font-bold flex items-center gap-2 mb-3">
                        <Info className="w-4 h-4 text-indigo-500" /> Zone Details
                    </h4>
                    <div className="space-y-3">
                        <div className="p-3 bg-red-50 rounded-lg border border-red-100">
                            <div className="flex justify-between mb-1">
                                <span className="font-bold text-red-800 text-sm">Flood Zone A</span>
                                <span className="text-xs text-red-600 font-bold">Critical</span>
                            </div>
                            <p className="text-xs text-red-600">River water levels exceeding safe mark.</p>
                        </div>
                        <div className="p-3 bg-yellow-50 rounded-lg border border-yellow-100">
                            <div className="flex justify-between mb-1">
                                <span className="font-bold text-yellow-800 text-sm">Landslide Zone B</span>
                                <span className="text-xs text-yellow-600 font-bold">Warning</span>
                            </div>
                            <p className="text-xs text-yellow-600">Heavy rainfall predicted.</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RiskZoneMap;
