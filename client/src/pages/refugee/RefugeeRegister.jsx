import React from 'react';
import { UserPlus, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const RefugeeRegister = () => {
    const navigate = useNavigate();

    return (
        <div className="p-6">
            <div className="max-w-3xl mx-auto bg-surface rounded-2xl shadow-sm border border-white/10 p-8 relative">
                <button
                    onClick={() => navigate(-1)}
                    className="absolute top-4 right-4 p-2 bg-black/20 text-gray-400 hover:text-white rounded-lg hover:bg-white/10 transition"
                >
                    <X className="w-5 h-5" />
                </button>

                <h2 className="text-2xl font-bold mb-6 text-white">Register New Refugee</h2>

                <form className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-1">Full Name</label>
                            <input type="text" className="w-full px-4 py-2 bg-black/20 border border-white/10 text-white rounded-xl focus:ring-2 focus:ring-primary outline-none" placeholder="Name" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-1">Age</label>
                            <input type="number" className="w-full px-4 py-2 bg-black/20 border border-white/10 text-white rounded-xl focus:ring-2 focus:ring-primary outline-none" placeholder="Age" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-1">Gender</label>
                            <select className="w-full px-4 py-2 bg-black/20 border border-white/10 text-white rounded-xl focus:ring-2 focus:ring-primary outline-none">
                                <option className="bg-gray-800">Male</option>
                                <option className="bg-gray-800">Female</option>
                                <option className="bg-gray-800">Other</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-1">District</label>
                            <select className="w-full px-4 py-2 bg-black/20 border border-white/10 text-white rounded-xl focus:ring-2 focus:ring-primary outline-none">
                                <option className="bg-gray-800">Wayanad</option>
                                <option className="bg-gray-800">Idukki</option>
                                <option className="bg-gray-800">Ernakulam</option>
                            </select>
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-1">Health Status / Medical Needs</label>
                        <textarea className="w-full px-4 py-2 bg-black/20 border border-white/10 text-white rounded-xl focus:ring-2 focus:ring-primary outline-none" rows="3" placeholder="Any specific condition..."></textarea>
                    </div>

                    <div className="bg-black/20 p-4 rounded-xl border border-white/10">
                        <h3 className="font-bold text-white mb-4">Assignment</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-1">Assign to Camp</label>
                                <select className="w-full px-4 py-2 bg-black/40 border border-white/10 text-white rounded-xl focus:ring-2 focus:ring-primary outline-none">
                                    <option className="bg-gray-800">Select Camp</option>
                                    <option className="bg-gray-800">Govt High School Camp 1</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-1">...or Safe Home</label>
                                <select className="w-full px-4 py-2 bg-black/40 border border-white/10 text-white rounded-xl focus:ring-2 focus:ring-primary outline-none">
                                    <option className="bg-gray-800">Select Safe Home</option>
                                    <option className="bg-gray-800">Villa Serenity</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    <div className="flex gap-3 pt-4">
                        <button
                            type="button"
                            onClick={() => navigate(-1)}
                            className="flex-1 py-3 bg-black/20 text-gray-300 font-bold rounded-xl hover:bg-white/10 transition border border-white/10"
                        >
                            Cancel
                        </button>
                        <button className="flex-1 py-3 bg-primary text-white font-bold rounded-xl hover:bg-lime-700 transition shadow-lg shadow-lime-500/30 flex items-center justify-center gap-2">
                            <UserPlus className="w-5 h-5" /> Register Refugee
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default RefugeeRegister;
