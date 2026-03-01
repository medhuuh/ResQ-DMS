import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { User, Shield, Home } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const RegisterPage = () => {
    const [role, setRole] = useState('citizen');
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        password: '',
        propertyAddress: '',
        preferredDistrict: ''
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const { register } = useAuth();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        const result = await register({ ...formData, role });

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
        <div className="min-h-screen bg-background flex items-center justify-center p-4 py-10">
            <div className="max-w-xl w-full bg-surface rounded-2xl shadow-xl p-8 border border-white/10 relative">
                <div className="text-center mb-8">
                    <h2 className="text-3xl font-bold text-white">Create Account</h2>
                    <p className="text-gray-300 mt-2">Join ResQ-DMS to help and get help</p>
                </div>

                {error && (
                    <div className="mb-4 p-3 bg-red-500/20 text-red-400 text-sm rounded-xl border border-red-500/30">
                        {error}
                    </div>
                )}

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

                <form className="space-y-6" onSubmit={handleSubmit}>
                    <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-1">First Name</label>
                                <input type="text" name="firstName" value={formData.firstName} onChange={handleChange} className="w-full px-4 py-2 bg-black/20 border border-white/10 text-white rounded-lg focus:ring-primary focus:border-primary transition outline-none" placeholder="John" required />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-1">Last Name</label>
                                <input type="text" name="lastName" value={formData.lastName} onChange={handleChange} className="w-full px-4 py-2 bg-black/20 border border-white/10 text-white rounded-lg focus:ring-primary focus:border-primary transition outline-none" placeholder="Doe" required />
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-1">Email Address</label>
                            <input type="email" name="email" value={formData.email} onChange={handleChange} className="w-full px-4 py-2 bg-black/20 border border-white/10 text-white rounded-lg focus:ring-primary focus:border-primary transition outline-none" placeholder="john@example.com" required />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-1">Phone Number</label>
                            <input type="tel" name="phone" value={formData.phone} onChange={handleChange} className="w-full px-4 py-2 bg-black/20 border border-white/10 text-white rounded-lg focus:ring-primary focus:border-primary transition outline-none" placeholder="+91 98765 43210" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-1">Password</label>
                            <input type="password" name="password" value={formData.password} onChange={handleChange} className="w-full px-4 py-2 bg-black/20 border border-white/10 text-white rounded-lg focus:ring-primary focus:border-primary transition outline-none" placeholder="Create a strong password" required minLength="6" />
                        </div>

                        {role === 'host' && (
                            <div className="bg-primary/10 p-4 rounded-lg border border-primary/20">
                                <h4 className="font-bold text-primary text-sm mb-2">Safe Home Details</h4>
                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-1">Property Address</label>
                                    <input type="text" name="propertyAddress" value={formData.propertyAddress} onChange={handleChange} className="w-full px-4 py-2 bg-black/20 border border-white/10 text-white rounded-lg transition outline-none focus:border-primary" placeholder="Full address" />
                                </div>
                            </div>
                        )}
                        {role === 'volunteer' && (
                            <div className="bg-neon/10 p-4 rounded-lg border border-neon/20">
                                <h4 className="font-bold text-neon text-sm mb-2">Volunteer Preference</h4>
                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-1">Preferred District</label>
                                    <select name="preferredDistrict" value={formData.preferredDistrict} onChange={handleChange} className="w-full px-4 py-2 bg-black/20 border border-white/10 text-white rounded-lg outline-none focus:border-neon">
                                        <option className="bg-gray-800" value="">Select District</option>
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

                    <button type="submit" disabled={loading} className="w-full py-4 bg-primary text-white font-bold rounded-xl hover:bg-lime-700 transition shadow-lg shadow-lime-500/30 disabled:opacity-50">
                        {loading ? 'Creating Account...' : 'Create Account'}
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
