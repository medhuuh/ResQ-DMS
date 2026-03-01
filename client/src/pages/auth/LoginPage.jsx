import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { UserCircle, Shield, Key } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const LoginPage = () => {
    const [role, setRole] = useState('volunteer');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const { login } = useAuth();

    const roles = [
        { id: 'volunteer', label: 'Volunteer', icon: Shield },
        { id: 'admin', label: 'Admin', icon: Key },
    ];

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        const result = await login(email, password, role);

        if (result.success) {
            if (result.data.role === 'admin') {
                navigate('/admin/dashboard');
            } else if (result.data.role === 'volunteer') {
                navigate('/volunteer');
            } else {
                navigate('/');
            }
        } else {
            setError(result.message);
        }
        setLoading(false);
    };

    return (
        <div className="min-h-screen bg-background flex items-center justify-center p-4">
            <div className="max-w-md w-full bg-surface rounded-2xl shadow-xl p-8 border border-white/10 relative overflow-hidden">
                {/* Decorative elements */}
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary to-neon"></div>

                <div className="text-center mb-8">
                    <h2 className="text-3xl font-bold text-white">Welcome Back</h2>
                    <p className="text-gray-300 mt-2">Sign in to ResQ-DMS Platform</p>
                </div>

                {error && (
                    <div className="mb-4 p-3 bg-red-500/20 text-red-400 text-sm rounded-xl border border-red-500/30">
                        {error}
                    </div>
                )}

                {/* Role Select */}
                <div className="mb-6 grid grid-cols-2 gap-2">
                    {roles.map(r => (
                        <button
                            key={r.id}
                            onClick={() => setRole(r.id)}
                            className={`flex items-center justify-center gap-2 p-2 rounded-lg text-sm font-medium transition-all ${role === r.id
                                ? 'bg-primary text-white ring-1 ring-primary-neon'
                                : 'bg-black/20 text-gray-300 hover:bg-black/40'
                                }`}
                        >
                            <span className="capitalize">{r.label}</span>
                        </button>
                    ))}
                </div>

                <form className="space-y-5" onSubmit={handleSubmit}>
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-1">Email Address</label>
                        <input type="email" value={email} onChange={e => setEmail(e.target.value)} className="w-full px-4 py-3 bg-black/20 border border-white/10 text-white rounded-xl focus:ring-2 focus:ring-primary focus:border-primary transition outline-none placeholder-gray-500" placeholder="name@example.com" required />
                    </div>
                    <div>
                        <div className="flex justify-between items-center mb-1">
                            <label className="block text-sm font-medium text-gray-300">Password</label>
                            <Link to="/forgot-password" className="text-xs text-primary hover:text-neon hover:underline">Forgot?</Link>
                        </div>
                        <input type="password" value={password} onChange={e => setPassword(e.target.value)} className="w-full px-4 py-3 bg-black/20 border border-white/10 text-white rounded-xl focus:ring-2 focus:ring-primary focus:border-primary transition outline-none placeholder-gray-500" placeholder="••••••••" required />
                    </div>

                    <button type="submit" disabled={loading} className="w-full py-3.5 bg-primary text-white font-bold rounded-xl hover:bg-lime-700 transition shadow-lg shadow-lime-500/30 flex items-center justify-center gap-2 disabled:opacity-50">
                        {loading ? 'Signing In...' : <>Sign In as <span className="capitalize">{role}</span></>}
                    </button>
                </form>

                <p className="text-center mt-8 text-sm text-gray-400">
                    New to ResQ-DMS? <Link to="/register" className="text-primary font-bold hover:underline">Create Account</Link>
                </p>
            </div>
        </div>
    );
};

export default LoginPage;
