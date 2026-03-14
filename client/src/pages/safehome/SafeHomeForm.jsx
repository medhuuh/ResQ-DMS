import React, { useState } from 'react';
import { Save, X, Home, CheckCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { safeHomesAPI } from '../../services/api';

const SafeHomeForm = () => {
    const navigate = useNavigate();
    const [saving, setSaving] = useState(false);
    const [success, setSuccess] = useState(false);
    const [formData, setFormData] = useState({
        ownerName: '',
        phone: '',
        phone2: '',
        capacity: '',
        address: '',
        location: '',
        facilities: []
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const toggleFacility = (f) => {
        setFormData(prev => ({
            ...prev,
            facilities: prev.facilities.includes(f)
                ? prev.facilities.filter(item => item !== f)
                : [...prev.facilities, f]
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);
        try {
            await safeHomesAPI.create({
                ...formData,
                capacity: parseInt(formData.capacity)
            });
            setSuccess(true);
        } catch (err) {
            console.error('Failed to register safe home:', err);
            alert(err.response?.data?.message || 'Failed to register safe home');
        } finally {
            setSaving(false);
        }
    };

    if (success) {
        return (
            <div className="pt-24 min-h-screen bg-background flex flex-col items-center justify-center p-6">
                <div className="bg-surface p-10 rounded-3xl border border-white/10 text-center max-w-md animate-fade-in shadow-2xl">
                    <CheckCircle className="w-20 h-20 text-green-400 mx-auto mb-6" />
                    <h2 className="text-3xl font-bold text-white mb-4">Registration Successful!</h2>
                    <p className="text-gray-400 mb-8">Your Safe Home has been successfully added to the system and will now appear on the Live Disaster Map and Safe Homes directory.</p>
                    <button
                        onClick={() => navigate('/safe-homes')}
                        className="w-full py-4 bg-primary text-black rounded-xl font-bold hover:bg-lime-400 transition shadow-lg shadow-lime-500/20 text-lg"
                    >
                        View Safe Homes
                    </button>
                    <button
                        onClick={() => navigate('/')}
                        className="w-full mt-4 py-3 bg-white/5 text-gray-300 rounded-xl font-bold hover:bg-white/10 transition border border-white/10"
                    >
                        Return to Dashboard
                    </button>
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
                    <div className="p-2 bg-primary/10 rounded-xl">
                        <Home className="w-6 h-6 text-primary" />
                    </div>
                    <h2 className="text-xl sm:text-2xl font-bold text-white">Register Safe Home</h2>
                </div>

                <form className="space-y-5" onSubmit={handleSubmit}>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs sm:text-sm font-medium text-gray-400 mb-1">Owner / Property Name</label>
                            <input type="text" name="ownerName" value={formData.ownerName} onChange={handleChange} className="w-full px-4 py-2 bg-black/20 border border-white/10 text-white rounded-xl focus:ring-2 focus:ring-primary outline-none text-sm" placeholder="Full Name" required />
                        </div>
                        <div>
                            <label className="block text-xs sm:text-sm font-medium text-gray-400 mb-1">Phone Number</label>
                            <input type="tel" name="phone" value={formData.phone} onChange={handleChange}
                                inputMode="numeric"
                                pattern="[0-9+\s\-]{7,15}"
                                title="Phone number should contain only digits"
                                className="w-full px-4 py-2 bg-black/20 border border-white/10 text-white rounded-xl focus:ring-2 focus:ring-primary outline-none text-sm" placeholder="+91..." required />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs sm:text-sm font-medium text-gray-400 mb-1">Capacity (People)</label>
                            <input type="number" name="capacity" value={formData.capacity} onChange={handleChange}
                                min="1"
                                inputMode="numeric"
                                onKeyDown={(e) => { if (['e','E','+','-','.'].includes(e.key)) e.preventDefault(); }}
                                className="w-full px-4 py-2 bg-black/20 border border-white/10 text-white rounded-xl focus:ring-2 focus:ring-primary outline-none text-sm" placeholder="Max capacity" required />
                        </div>
                        <div>
                            <label className="block text-xs sm:text-sm font-medium text-gray-400 mb-1">Location / Area</label>
                            <input type="text" name="location" value={formData.location} onChange={handleChange} className="w-full px-4 py-2 bg-black/20 border border-white/10 text-white rounded-xl focus:ring-2 focus:ring-primary outline-none text-sm" placeholder="e.g. Wayanad, Kalpetta" />
                        </div>
                    </div>

                    <div>
                        <label className="block text-xs sm:text-sm font-medium text-gray-400 mb-1">Full Address</label>
                        <textarea name="address" value={formData.address} onChange={handleChange} className="w-full px-4 py-2 bg-black/20 border border-white/10 text-white rounded-xl focus:ring-2 focus:ring-primary outline-none text-sm" rows="3" placeholder="Full address" required spellCheck="false" />
                    </div>

                    <div>
                        <label className="block text-xs sm:text-sm font-medium text-gray-400 mb-2">Facilities Available</label>
                        <div className="flex gap-2 sm:gap-3 flex-wrap">
                            {['Private Rooms', 'Shared Kitchen', 'Medical Aid', 'Pet Friendly', 'Wi-Fi'].map(f => (
                                <label key={f} className="flex items-center gap-2 px-3 py-2 border border-white/10 rounded-lg cursor-pointer hover:bg-white/5 bg-black/20 text-sm">
                                    <input
                                        type="checkbox"
                                        checked={formData.facilities.includes(f)}
                                        onChange={() => toggleFacility(f)}
                                        className="rounded text-primary focus:ring-primary bg-black/40 border-white/20"
                                    />
                                    <span className="text-gray-300 text-xs sm:text-sm">{f}</span>
                                </label>
                            ))}
                        </div>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-3 pt-4">
                        <button type="button" onClick={() => navigate(-1)} className="w-full sm:flex-1 py-3 bg-black/20 text-gray-300 font-bold rounded-xl hover:bg-white/10 transition border border-white/10 text-sm">Cancel</button>
                        <button type="submit" disabled={saving} className="w-full sm:flex-1 py-3 bg-primary text-white font-bold rounded-xl hover:bg-lime-700 transition shadow-lg shadow-lime-500/30 flex items-center justify-center gap-2 text-sm disabled:opacity-50">
                            <Save className="w-5 h-5" /> {saving ? 'Saving...' : 'Register Home'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default SafeHomeForm;
