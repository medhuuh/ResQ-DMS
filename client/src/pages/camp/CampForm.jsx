import React, { useState } from 'react';
import { Save, X, CheckCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { campsAPI } from '../../services/api';

const CampForm = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        name: '',
        location: '',
        capacity: '',
        inChargePerson: '',
        phone1: '',
        phone2: '',
        facilities: []
    });
    const [saving, setSaving] = useState(false);
    const [success, setSuccess] = useState(false);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleFacilityToggle = (facility) => {
        setFormData(prev => ({
            ...prev,
            facilities: prev.facilities.includes(facility)
                ? prev.facilities.filter(f => f !== facility)
                : [...prev.facilities, facility]
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);
        try {
            await campsAPI.create({
                ...formData,
                capacity: parseInt(formData.capacity)
            });
            setSuccess(true);
        } catch (err) {
            console.error('Failed to create camp:', err);
            alert(err.response?.data?.message || 'Failed to create camp');
        } finally {
            setSaving(false);
        }
    };

    if (success) {
        return (
            <div className="pt-24 min-h-screen bg-background flex flex-col items-center justify-center p-6">
                <div className="bg-surface p-10 rounded-3xl border border-white/10 text-center max-w-md animate-fade-in shadow-2xl">
                    <CheckCircle className="w-20 h-20 text-green-400 mx-auto mb-6" />
                    <h2 className="text-3xl font-bold text-white mb-4">Camp Registered!</h2>
                    <p className="text-gray-400 mb-8">The Relief Camp has been successfully added to the system and will now appear on the Live Disaster Map and Public Shelters directory.</p>
                    <button
                        onClick={() => navigate('/camps')}
                        className="w-full py-4 bg-primary text-black rounded-xl font-bold hover:bg-lime-400 transition shadow-lg shadow-lime-500/20 text-lg"
                    >
                        View Relief Camps
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
        <div className="p-6">
            <div className="max-w-2xl mx-auto bg-surface rounded-2xl shadow-sm border border-white/10 p-8 relative">
                <button
                    onClick={() => navigate(-1)}
                    className="absolute top-4 right-4 p-2 bg-black/20 text-gray-400 hover:text-white rounded-lg hover:bg-white/10 transition"
                >
                    <X className="w-5 h-5" />
                </button>

                <h2 className="text-2xl font-bold mb-6 text-white">Create New Relief Camp</h2>

                <form className="space-y-6" onSubmit={handleSubmit}>
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-1">Camp Name</label>
                        <input type="text" name="name" value={formData.name} onChange={handleChange} className="w-full px-4 py-2 bg-black/20 border border-white/10 text-white rounded-xl focus:ring-2 focus:ring-primary outline-none" placeholder="e.g. Town Hall Relief Camp" required />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-1">Location / Address</label>
                        <textarea name="location" value={formData.location} onChange={handleChange} className="w-full px-4 py-2 bg-black/20 border border-white/10 text-white rounded-xl focus:ring-2 focus:ring-primary outline-none" rows="3" placeholder="Full address" required spellCheck="false" />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-1">Capacity</label>
                            <input type="number" name="capacity" value={formData.capacity} onChange={handleChange} className="w-full px-4 py-2 bg-black/20 border border-white/10 text-white rounded-xl focus:ring-2 focus:ring-primary outline-none" placeholder="Max people" required />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-1">In-Charge Person</label>
                            <input type="text" name="inChargePerson" value={formData.inChargePerson} onChange={handleChange} className="w-full px-4 py-2 bg-black/20 border border-white/10 text-white rounded-xl focus:ring-2 focus:ring-primary outline-none" placeholder="Contact Name" />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-1">Phone 1</label>
                            <input type="tel" name="phone1" value={formData.phone1} onChange={handleChange} className="w-full px-4 py-2 bg-black/20 border border-white/10 text-white rounded-xl focus:ring-2 focus:ring-primary outline-none" placeholder="+91..." />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-1">Phone 2</label>
                            <input type="tel" name="phone2" value={formData.phone2} onChange={handleChange} className="w-full px-4 py-2 bg-black/20 border border-white/10 text-white rounded-xl focus:ring-2 focus:ring-primary outline-none" placeholder="+91..." />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-1">Facilities Available</label>
                        <div className="flex gap-3 flex-wrap">
                            {['Food', 'Water', 'Medical', 'Bedding', 'Power'].map(f => (
                                <label key={f} className="flex items-center gap-2 px-3 py-2 border border-white/10 rounded-lg cursor-pointer hover:bg-white/5 bg-black/20">
                                    <input
                                        type="checkbox"
                                        checked={formData.facilities.includes(f)}
                                        onChange={() => handleFacilityToggle(f)}
                                        className="rounded text-primary focus:ring-primary bg-black/40 border-white/20"
                                    />
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
                        <button type="submit" disabled={saving} className="flex-1 py-3 bg-primary text-white font-bold rounded-xl hover:bg-lime-700 transition shadow-lg shadow-lime-500/30 flex items-center justify-center gap-2 disabled:opacity-50">
                            <Save className="w-5 h-5" /> {saving ? 'Saving...' : 'Save Camp'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CampForm;
