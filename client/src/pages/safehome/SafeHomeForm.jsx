import React from 'react';
import { ShieldCheck, Save, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const SafeHomeForm = () => {
    const navigate = useNavigate();

    return (
        <div className="p-6">
            <div className="max-w-2xl mx-auto bg-surface rounded-2xl shadow-sm border border-white/10 p-8 relative">
                <button
                    onClick={() => navigate(-1)}
                    className="absolute top-4 right-4 p-2 bg-black/20 text-gray-400 hover:text-white rounded-lg hover:bg-white/10 transition"
                >
                    <X className="w-5 h-5" />
                </button>

                <h2 className="text-2xl font-bold mb-6 text-white">Register New Safe Home</h2>

                <form className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-1">Owner Name</label>
                        <input type="text" className="w-full px-4 py-2 bg-black/20 border border-white/10 text-white rounded-xl focus:ring-2 focus:ring-primary outline-none" placeholder="Host Name" />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-1">Phone Number</label>
                            <input type="tel" className="w-full px-4 py-2 bg-black/20 border border-white/10 text-white rounded-xl focus:ring-2 focus:ring-primary outline-none" placeholder="+91..." />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-1">Capacity</label>
                            <input type="number" className="w-full px-4 py-2 bg-black/20 border border-white/10 text-white rounded-xl focus:ring-2 focus:ring-primary outline-none" placeholder="Max persons" />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-1">Address / Location</label>
                        <textarea className="w-full px-4 py-2 bg-black/20 border border-white/10 text-white rounded-xl focus:ring-2 focus:ring-primary outline-none" rows="3" placeholder="Full address with landmark"></textarea>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">Facilities Available</label>
                        <div className="grid grid-cols-2 gap-3">
                            {['Private Rooms', 'Shared Kitchen', 'Medical Aid', 'Pet Friendly', 'Wi-Fi'].map(f => (
                                <label key={f} className="flex items-center gap-2 px-3 py-2 border border-white/10 rounded-lg cursor-pointer hover:bg-white/5 bg-black/20">
                                    <input type="checkbox" className="rounded text-primary focus:ring-primary bg-black/40 border-white/20" />
                                    <span className="text-sm text-gray-300">{f}</span>
                                </label>
                            ))}
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
                            <ShieldCheck className="w-5 h-5" /> Register Safe Home
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default SafeHomeForm;
