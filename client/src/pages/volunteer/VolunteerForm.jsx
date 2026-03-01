import React, { useState } from 'react';
import { Save, X, Shield, Mail, Lock, CheckCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../../context/LanguageContext';
import { useAuth } from '../../context/AuthContext';
import { volunteersAPI } from '../../services/api';

const VolunteerForm = () => {
    const navigate = useNavigate();
    const [saving, setSaving] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState('');
    const [formData, setFormData] = useState({
        name: '',
        age: '',
        phone: '',
        bloodGroup: 'O+',
        expertise: 'General Rescue',
        district: 'Wayanad',
        location: '',
        email: '',
        password: ''
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSaving(true);
        try {
            const res = await volunteersAPI.register({
                ...formData,
                age: parseInt(formData.age)
            });

            // Auto-login with the returned token
            if (res.data.token) {
                localStorage.setItem('token', res.data.token);
                localStorage.setItem('user', JSON.stringify(res.data.user));
                setSuccess(true);
                // Redirect after showing success
                setTimeout(() => {
                    navigate('/volunteer');
                    window.location.reload();
                }, 3000);
            } else {
                setSuccess(true);
                setTimeout(() => {
                    navigate(-1);
                }, 3000);
            }
        } catch (err) {
            console.error('Failed to register volunteer:', err);
            setError(err.response?.data?.message || 'Failed to register volunteer');
        } finally {
            setSaving(false);
        }
    };

    if (success) {
        return (
            <div className="p-4 sm:p-6 flex flex-col items-center justify-center min-h-[50vh]">
                <div className="bg-surface p-10 rounded-3xl border border-white/10 text-center max-w-md animate-fade-in shadow-2xl w-full">
                    <CheckCircle className="w-20 h-20 text-neon mx-auto mb-6" />
                    <h2 className="text-3xl font-bold text-white mb-4">Registration Successful!</h2>
                    <p className="text-gray-400 mb-8">Welcome to the ResQ volunteer force. Your account has been created and you are now logged in.</p>
                    <div className="flex justify-center items-center gap-2 text-neon text-sm font-bold animate-pulse">
                        <Lock className="w-4 h-4" /> Redirecting to Dashboard...
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="p-4 sm:p-6">
            <div className="max-w-2xl mx-auto bg-surface rounded-2xl shadow-sm border border-white/10 p-5 sm:p-8 relative">
                <button onClick={() => navigate(-1)} className="absolute top-4 right-4 p-2 bg-black/20 text-gray-400 hover:text-white rounded-lg hover:bg-white/10 transition">
                    <X className="w-5 h-5" />
                </button>

                <div className="flex items-center gap-3 mb-6">
                    <div className="p-2 bg-neon/10 rounded-xl">
                        <Shield className="w-6 h-6 text-neon" />
                    </div>
                    <h2 className="text-xl sm:text-2xl font-bold text-white">Register Volunteer</h2>
                </div>

                {error && (
                    <div className="mb-4 p-3 bg-red-500/20 text-red-400 text-sm rounded-xl border border-red-500/30">
                        {error}
                    </div>
                )}

                <form className="space-y-5" onSubmit={handleSubmit}>
                    {/* Login Credentials Section */}
                    <div className="bg-neon/5 p-4 rounded-xl border border-neon/20">
                        <h4 className="font-bold text-neon text-sm mb-3 flex items-center gap-2">
                            <Lock className="w-4 h-4" /> Login Credentials
                        </h4>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-xs sm:text-sm font-medium text-gray-400 mb-1">Email Address</label>
                                <div className="relative">
                                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                                    <input type="email" name="email" value={formData.email} onChange={handleChange} className="w-full pl-9 pr-4 py-2 bg-black/20 border border-white/10 text-white rounded-xl focus:ring-2 focus:ring-neon outline-none text-sm" placeholder="name@example.com" required />
                                </div>
                            </div>
                            <div>
                                <label className="block text-xs sm:text-sm font-medium text-gray-400 mb-1">Password</label>
                                <div className="relative">
                                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                                    <input type="password" name="password" value={formData.password} onChange={handleChange} className="w-full pl-9 pr-4 py-2 bg-black/20 border border-white/10 text-white rounded-xl focus:ring-2 focus:ring-neon outline-none text-sm" placeholder="Min 6 characters" required minLength="6" />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Personal Details */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs sm:text-sm font-medium text-gray-400 mb-1">Full Name</label>
                            <input type="text" name="name" value={formData.name} onChange={handleChange} className="w-full px-4 py-2 bg-black/20 border border-white/10 text-white rounded-xl focus:ring-2 focus:ring-neon outline-none text-sm" placeholder="Full Name" required />
                        </div>
                        <div>
                            <label className="block text-xs sm:text-sm font-medium text-gray-400 mb-1">Age</label>
                            <input type="number" name="age" value={formData.age} onChange={handleChange} className="w-full px-4 py-2 bg-black/20 border border-white/10 text-white rounded-xl focus:ring-2 focus:ring-neon outline-none text-sm" placeholder="Age" required />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs sm:text-sm font-medium text-gray-400 mb-1">Phone</label>
                            <input type="tel" name="phone" value={formData.phone} onChange={handleChange} className="w-full px-4 py-2 bg-black/20 border border-white/10 text-white rounded-xl focus:ring-2 focus:ring-neon outline-none text-sm" placeholder="+91..." required />
                        </div>
                        <div>
                            <label className="block text-xs sm:text-sm font-medium text-gray-400 mb-1">Blood Group</label>
                            <select name="bloodGroup" value={formData.bloodGroup} onChange={handleChange} className="w-full px-4 py-2 bg-black/20 border border-white/10 text-white rounded-xl focus:ring-2 focus:ring-neon outline-none text-sm">
                                {['O+', 'O-', 'A+', 'A-', 'B+', 'B-', 'AB+', 'AB-'].map(bg => (
                                    <option key={bg} value={bg} className="bg-gray-800">{bg}</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs sm:text-sm font-medium text-gray-400 mb-1">Area of Expertise</label>
                            <select name="expertise" value={formData.expertise} onChange={handleChange} className="w-full px-4 py-2 bg-black/20 border border-white/10 text-white rounded-xl focus:ring-2 focus:ring-neon outline-none text-sm">
                                {['General Rescue', 'Medical Aid', 'Logistics & Supply', 'Counselling'].map(e => (
                                    <option key={e} value={e} className="bg-gray-800">{e}</option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className="block text-xs sm:text-sm font-medium text-gray-400 mb-1">District</label>
                            <select name="district" value={formData.district} onChange={handleChange} className="w-full px-4 py-2 bg-black/20 border border-white/10 text-white rounded-xl focus:ring-2 focus:ring-neon outline-none text-sm">
                                {['Wayanad', 'Kozhikode', 'Malappuram', 'Kannur', 'Kasaragod'].map(d => (
                                    <option key={d} value={d} className="bg-gray-800">{d}</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <div>
                        <label className="block text-xs sm:text-sm font-medium text-gray-400 mb-1">Preferred Location</label>
                        <input type="text" name="location" value={formData.location} onChange={handleChange} className="w-full px-4 py-2 bg-black/20 border border-white/10 text-white rounded-xl focus:ring-2 focus:ring-neon outline-none text-sm" placeholder="e.g. Meppadi, Wayanad" />
                    </div>

                    <div className="flex flex-col sm:flex-row gap-3 pt-4">
                        <button type="button" onClick={() => navigate(-1)} className="w-full sm:flex-1 py-3 bg-black/20 text-gray-300 font-bold rounded-xl hover:bg-white/10 transition border border-white/10 text-sm">
                            Cancel
                        </button>
                        <button type="submit" disabled={saving} className="w-full sm:flex-1 py-3 bg-neon text-black font-bold rounded-xl hover:bg-green-400 transition shadow-lg shadow-green-500/30 flex items-center justify-center gap-2 text-sm disabled:opacity-50">
                            <Save className="w-5 h-5" /> {saving ? 'Registering...' : 'Register & Login'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default VolunteerForm;
