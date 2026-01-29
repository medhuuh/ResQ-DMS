import React, { useState } from 'react';
import CampList from '../camp/CampList';
import SafeHomeSearch from './SafeHomeSearch'; // Reusing search for view
import { Tent, ShieldCheck } from 'lucide-react';

const PublicShelters = () => {
    const [activeTab, setActiveTab] = useState('camps');

    return (
        <div className="min-h-screen bg-background pt-24 pb-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                <div className="text-center mb-12">
                    <h1 className="text-4xl font-bold text-white mb-4">Find Shelter</h1>
                    <p className="text-xl text-gray-400">Locate Relief Camps and Safe Homes near you</p>
                </div>

                {/* Tabs */}
                <div className="flex justify-center mb-12">
                    <div className="bg-white/5 p-1 rounded-2xl flex">
                        <button
                            onClick={() => setActiveTab('camps')}
                            className={`px-8 py-3 rounded-xl flex items-center gap-2 font-bold transition-all ${activeTab === 'camps'
                                    ? 'bg-primary text-black shadow-lg shadow-primary/20'
                                    : 'text-gray-400 hover:text-white'
                                }`}
                        >
                            <Tent className="w-5 h-5" /> Relief Camps
                        </button>
                        <button
                            onClick={() => setActiveTab('safe-homes')}
                            className={`px-8 py-3 rounded-xl flex items-center gap-2 font-bold transition-all ${activeTab === 'safe-homes'
                                    ? 'bg-primary text-black shadow-lg shadow-primary/20'
                                    : 'text-gray-400 hover:text-white'
                                }`}
                        >
                            <ShieldCheck className="w-5 h-5" /> Safe Homes
                        </button>
                    </div>
                </div>

                {/* Content */}
                <div className="bg-black/20 rounded-3xl border border-white/5 p-1">
                    {activeTab === 'camps' ? (
                        <CampList isPublic={true} viewOnly={true} />
                    ) : (
                        <div className="p-4">
                            {/* Manually rendering SafeHomeSearch content or using it but hiding add button via props if supported */}
                            {/* Since SafeHomeSearch has internal header with Add button, we might need to modify it to accept viewOnly */}
                            <SafeHomeSearch viewOnly={true} />
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default PublicShelters;
