import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { User, Shield, Home } from 'lucide-react';

const RegisterPage = () => {
    const [role, setRole] = useState('citizen');

    const renderForm = () => {
        // Common fields
        const commonFields = (
            <>
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-1">First Name</label>
                        <input type="text" className="w-full px-4 py-2 bg-black/20 border border-white/10 text-white rounded-lg focus:ring-primary focus:border-primary transition outline-none" placeholder="John" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-1">Last Name</label>
                        <input type="text" className="w-full px-4 py-2 bg-black/20 border border-white/10 text-white rounded-lg focus:ring-primary focus:border-primary transition outline-none" placeholder="Doe" />
                    </div>
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">Email Address</label>
                    <input type="email" className="w-full px-4 py-2 bg-black/20 border border-white/10 text-white rounded-lg focus:ring-primary focus:border-primary transition outline-none" placeholder="john@example.com" />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">Phone Number</label>
                    <input type="tel" className="w-full px-4 py-2 bg-black/20 border border-white/10 text-white rounded-lg focus:ring-primary focus:border-primary transition outline-none" placeholder="+91 98765 43210" />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">Password</label>
                    <input type="password" className="w-full px-4 py-2 bg-black/20 border border-white/10 text-white rounded-lg focus:ring-primary focus:border-primary transition outline-none" placeholder="Create a strong password" />
                </div>
            </>
        );

        return (
            <div className="space-y-4">
                {commonFields}

                {role === 'host' && (
                    <div className="bg-primary/10 p-4 rounded-lg border border-primary/20">
                        <h4 className="font-bold text-primary text-sm mb-2">Safe Home Details</h4>
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-1">Property Address</label>
                            <input type="text" className="w-full px-4 py-2 bg-black/20 border border-white/10 text-white rounded-lg transition outline-none focus:border-primary" placeholder="Full address" />
                        </div>
                    </div>
                )}
                {role === 'volunteer' && (
                    <div className="bg-neon/10 p-4 rounded-lg border border-neon/20">
                        <h4 className="font-bold text-neon text-sm mb-2">Volunteer Preference</h4>
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-1">Preferred District</label>
                            <select className="w-full px-4 py-2 bg-black/20 border border-white/10 text-white rounded-lg outline-none focus:border-neon">
                                <option className="bg-gray-800">Select District</option>
                                <option className="bg-gray-800">Kasaragod</option>
                                <option className="bg-gray-800">Kannur</option>
                                <option className="bg-gray-800">Wayanad</option>
                                <option className="bg-gray-800">Kozhikode</option>
                                <option className="bg-gray-800">Malappuram</option>
                            </select>
                        </div>
                    </div>
                )}
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background flex items-center justify-center p-4 py-10">
            <div className="max-w-xl w-full bg-surface rounded-2xl shadow-xl p-8 border border-white/10 relative">
                <div className="text-center mb-8">
                    <h2 className="text-3xl font-bold text-white">Create Account</h2>
                    <p className="text-gray-300 mt-2">Join ResQ-DMS to help and get help</p>
                </div>

                <div className="flex justify-center gap-4 mb-8">
                    <button
                        onClick={() => setRole('citizen')}
                        className={`flex-1 py-3 rounded-xl border flex flex-col items-center gap-2 transition ${role === 'citizen' ? 'border-primary bg-primary text-white' : 'border-white/10 text-gray-400 hover:bg-black/20'}`}
                    >
                        <User className="w-6 h-6" />
                        <span className="text-sm font-bold">Citizen</span>
                    </button>
                    <button
                        onClick={() => setRole('volunteer')}
                        className={`flex-1 py-3 rounded-xl border flex flex-col items-center gap-2 transition ${role === 'volunteer' ? 'border-neon bg-neon text-black' : 'border-white/10 text-gray-400 hover:bg-black/20'}`}
                    >
                        <Shield className="w-6 h-6" />
                        <span className="text-sm font-bold">Volunteer</span>
                    </button>
                    <button
                        onClick={() => setRole('host')}
                        className={`flex-1 py-3 rounded-xl border flex flex-col items-center gap-2 transition ${role === 'host' ? 'border-purple-500 bg-purple-500 text-white' : 'border-white/10 text-gray-400 hover:bg-black/20'}`}
                    >
                        <Home className="w-6 h-6" />
                        <span className="text-sm font-bold">Host</span>
                    </button>
                </div>

                <form className="space-y-6">
                    {renderForm()}

                    <button className="w-full py-4 bg-primary text-white font-bold rounded-xl hover:bg-lime-700 transition shadow-lg shadow-lime-500/30">
                        Create Account
                    </button>
                </form>

                <p className="text-center mt-6 text-sm text-gray-400">
                    Already have an account? <Link to="/login" className="text-primary font-bold hover:underline">Sign In</Link>
                </p>
            </div>
        </div>
    );
};

export default RegisterPage;
