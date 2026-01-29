import React from 'react';
import { Link } from 'react-router-dom';
import { User, Mail, Phone, MapPin } from 'lucide-react';

const UserProfile = () => {
    return (
        <div className="p-6">
            <div className="max-w-2xl mx-auto bg-surface rounded-2xl shadow-sm border border-white/10 overflow-hidden">
                <div className="h-32 bg-gradient-to-r from-gray-900 to-black border-b border-white/10"></div>
                <div className="px-8 pb-8">
                    <div className="relative -mt-16 mb-4">
                        <div className="w-32 h-32 bg-surface rounded-full p-1 shadow-lg">
                            <img className="w-full h-full rounded-full object-cover bg-black" src="https://ui-avatars.com/api/?name=Admin+User&background=random" alt="Profile" />
                        </div>
                    </div>

                    <div className="mb-6">
                        <h2 className="text-2xl font-bold text-white">Admin User</h2>
                        <p className="text-gray-400">District Administrator • Wayanad</p>
                    </div>

                    <div className="space-y-4">
                        <div className="flex items-center gap-3 p-4 bg-black/20 rounded-xl border border-white/5">
                            <Mail className="w-5 h-5 text-gray-500" />
                            <span className="text-gray-300">admin@resq-dms.com</span>
                        </div>
                        <div className="flex items-center gap-3 p-4 bg-black/20 rounded-xl border border-white/5">
                            <Phone className="w-5 h-5 text-gray-500" />
                            <span className="text-gray-300">+91 98765 43210</span>
                        </div>
                        <div className="flex items-center gap-3 p-4 bg-black/20 rounded-xl border border-white/5">
                            <MapPin className="w-5 h-5 text-gray-500" />
                            <span className="text-gray-300">Kalpetta, Wayanad, Kerala</span>
                        </div>
                    </div>

                    <Link to="/admin/profile/edit" className="mt-8 w-full py-3 bg-primary text-black font-bold rounded-xl hover:bg-neon transition shadow-lg shadow-primary/20 flex justify-center items-center">
                        Edit Profile
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default UserProfile;
