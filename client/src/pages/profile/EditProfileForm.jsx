import React from 'react';
import { UserCheck, Save, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const EditProfileForm = () => {
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

                <h2 className="text-2xl font-bold mb-6 text-white">Edit Profile</h2>

                <form className="space-y-6">
                    <div className="flex justify-center mb-6">
                        <div className="relative">
                            <div className="w-24 h-24 bg-black/20 rounded-full flex items-center justify-center overflow-hidden border-2 border-primary/50">
                                <img src="https://ui-avatars.com/api/?name=Admin+User&background=random" alt="Profile" className="w-full h-full object-cover" />
                            </div>
                            <butto className="absolute bottom-0 right-0 bg-primary text-black p-1 rounded-full text-xs font-bold border border-black cursor-pointer">Edit</butto>
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-1">Full Name</label>
                        <input type="text" className="w-full px-4 py-2 bg-black/20 border border-white/10 text-white rounded-xl focus:ring-2 focus:ring-primary outline-none" defaultValue="Admin User" />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-1">Email Address</label>
                        <input type="email" className="w-full px-4 py-2 bg-black/20 border border-white/10 text-white rounded-xl focus:ring-2 focus:ring-primary outline-none" defaultValue="admin@resq-dms.com" />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-1">Phone Number</label>
                        <input type="tel" className="w-full px-4 py-2 bg-black/20 border border-white/10 text-white rounded-xl focus:ring-2 focus:ring-primary outline-none" defaultValue="+91 98765 43210" />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-1">Assigned District</label>
                        <input type="text" className="w-full px-4 py-2 bg-black/40 border border-white/10 text-gray-400 rounded-xl cursor-not-allowed" defaultValue="Wayanad" disabled />
                    </div>

                    <div className="flex gap-3 pt-4">
                        <button
                            type="button"
                            onClick={() => navigate(-1)}
                            className="flex-1 py-3 bg-black/20 text-gray-300 font-bold rounded-xl hover:bg-white/10 transition border border-white/10"
                        >
                            Cancel
                        </button>
                        <button className="flex-1 py-3 bg-primary text-black font-bold rounded-xl hover:bg-neon transition shadow-lg shadow-primary/20 flex items-center justify-center gap-2">
                            <Save className="w-5 h-5" /> Save Changes
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default EditProfileForm;
