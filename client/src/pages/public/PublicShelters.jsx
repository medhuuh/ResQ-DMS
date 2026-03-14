import React, { useState } from 'react';
import CampList from '../camp/CampList';
import SafeHomeSearch from './SafeHomeSearch';
import { Tent, ShieldCheck, Home, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

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
                            {/* CTA Banner for registering a safe home */}
                            <div className="mb-6 bg-gradient-to-r from-primary/20 to-lime-600/10 border border-primary/30 rounded-2xl p-5 flex flex-col sm:flex-row items-center justify-between gap-4">
                                <div className="flex items-center gap-4">
                                    <div className="p-3 bg-primary/20 rounded-xl">
                                        <Home className="w-6 h-6 text-primary" />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-white text-sm sm:text-base">Have a safe space to offer?</h3>
                                        <p className="text-gray-400 text-xs sm:text-sm">Register your home as a temporary shelter for disaster victims</p>
                                    </div>
                                </div>
                                <Link
                                    to="/safe-homes/register"
                                    className="flex-shrink-0 flex items-center gap-2 px-5 py-2.5 bg-primary text-black font-bold rounded-xl hover:bg-lime-400 transition shadow-lg shadow-lime-500/20 text-sm"
                                >
                                    Register Your Home <ArrowRight className="w-4 h-4" />
                                </Link>
                            </div>
                            <SafeHomeSearch viewOnly={true} />
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default PublicShelters;
