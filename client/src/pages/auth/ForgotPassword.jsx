import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

const ForgotPassword = () => {
    return (
        <div className="min-h-screen bg-background flex items-center justify-center p-4">
            <div className="max-w-md w-full bg-surface rounded-2xl shadow-xl p-8 border border-white/10">
                <Link to="/login" className="flex items-center text-gray-400 hover:text-white mb-6 transition">
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back to Login
                </Link>

                <div className="mb-6">
                    <h2 className="text-2xl font-bold text-white">Forgot Password?</h2>
                    <p className="text-gray-400 mt-2">Enter your email address and we'll send you a link to reset your password.</p>
                </div>

                <form className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-1">Email Address</label>
                        <input type="email" className="w-full px-4 py-3 bg-black/20 border border-white/10 text-white rounded-xl focus:ring-2 focus:ring-primary focus:border-primary transition outline-none" placeholder="you@example.com" />
                    </div>

                    <button className="w-full py-3 bg-primary text-white font-bold rounded-xl hover:bg-lime-700 transition shadow-lg shadow-lime-500/30">
                        Send Reset Link
                    </button>
                </form>
            </div>
        </div>
    );
};

export default ForgotPassword;
