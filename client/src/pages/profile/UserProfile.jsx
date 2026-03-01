import React from 'react';
import { User, MapPin, Mail, Phone, Home, Edit } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const UserProfile = () => {
    const { user } = useAuth();

    if (!user) {
        return (
            <div className="p-6 flex flex-col items-center justify-center min-h-[60vh]">
                <div className="bg-surface p-8 rounded-2xl border border-white/10 text-center max-w-md">
                    <User className="w-12 h-12 text-gray-500 mx-auto mb-4" />
                    <h2 className="text-xl font-bold text-white mb-2">Not Logged In</h2>
                    <p className="text-gray-400 mb-4">Please log in to view your profile.</p>
                    <Link to="/login" className="px-6 py-2 bg-primary text-white rounded-xl font-bold hover:bg-lime-700 transition">
                        Login
                    </Link>
                </div>
            </div>
        );
    }

    const profileFields = [
        { label: 'Name', value: `${user.firstName} ${user.lastName}`, icon: User },
        { label: 'Role', value: user.role?.charAt(0).toUpperCase() + user.role?.slice(1), icon: Home },
        { label: 'District', value: user.district || 'Not set', icon: MapPin },
        { label: 'Email', value: user.email, icon: Mail },
        { label: 'Phone', value: user.phone || 'Not set', icon: Phone }
    ];

    return (
        <div className="p-4 sm:p-6 max-w-2xl mx-auto">
            <div className="bg-surface rounded-2xl p-6 sm:p-8 border border-white/10 shadow-sm">
                <div className="flex flex-col sm:flex-row items-center gap-4 mb-8">
                    <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center">
                        <span className="text-2xl font-bold text-primary">
                            {user.firstName?.charAt(0)}{user.lastName?.charAt(0)}
                        </span>
                    </div>
                    <div className="text-center sm:text-left">
                        <h2 className="text-2xl font-bold text-white">{user.firstName} {user.lastName}</h2>
                        <span className="text-primary text-sm font-bold uppercase tracking-wider">{user.role}</span>
                    </div>
                </div>

                <div className="space-y-4">
                    {profileFields.map((field, idx) => (
                        <div key={idx} className="flex items-center gap-4 p-4 bg-black/20 rounded-xl border border-white/10">
                            <field.icon className="w-5 h-5 text-gray-400 flex-shrink-0" />
                            <div>
                                <p className="text-xs text-gray-500 font-medium">{field.label}</p>
                                <p className="text-white text-sm font-medium">{field.value}</p>
                            </div>
                        </div>
                    ))}
                </div>

                <Link
                    to="/admin/profile/edit"
                    className="mt-6 w-full py-3 bg-primary text-white font-bold rounded-xl hover:bg-lime-700 transition shadow-lg shadow-lime-500/30 flex items-center justify-center gap-2"
                >
                    <Edit className="w-5 h-5" /> Edit Profile
                </Link>
            </div>
        </div>
    );
};

export default UserProfile;
