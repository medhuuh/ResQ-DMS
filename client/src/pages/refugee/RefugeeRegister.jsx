import React, { useState, useEffect } from 'react';
import { UserPlus, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { refugeesAPI, campsAPI, safeHomesAPI } from '../../services/api';

const RefugeeRegister = () => {
    const navigate = useNavigate();
    const [camps, setCamps] = useState([]);
    const [safeHomes, setSafeHomes] = useState([]);
    const [saving, setSaving] = useState(false);
    const [formData, setFormData] = useState({
        fullName: '',
        age: '',
        gender: 'Male',
        district: 'Wayanad',
        healthStatus: '',
        assignedCamp: '',
        assignedSafeHome: ''
    });

    useEffect(() => {
        const loadOptions = async () => {
            try {
                const [campsRes, homesRes] = await Promise.all([
                    campsAPI.getAll(),
                    safeHomesAPI.getAll()
                ]);
                setCamps(campsRes.data.data);
                setSafeHomes(homesRes.data.data);
            } catch (err) {
                console.error('Failed to load options:', err);
            }
        };
        loadOptions();
    }, []);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);
        try {
            const data = {
                ...formData,
                age: parseInt(formData.age),
                assignedCamp: formData.assignedCamp || null,
                assignedSafeHome: formData.assignedSafeHome || null
            };
            await refugeesAPI.create(data);
            navigate(-1);
        } catch (err) {
            console.error('Failed to register refugee:', err);
            alert(err.response?.data?.message || 'Failed to register refugee');
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="p-6">
            <div className="max-w-3xl mx-auto bg-surface rounded-2xl shadow-sm border border-white/10 p-8 relative">
                <button onClick={() => navigate(-1)} className="absolute top-4 right-4 p-2 bg-black/20 text-gray-400 hover:text-white rounded-lg hover:bg-white/10 transition">
                    <X className="w-5 h-5" />
                </button>

                <h2 className="text-2xl font-bold mb-6 text-white">Register New Refugee</h2>

                <form className="space-y-6" onSubmit={handleSubmit}>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-1">Full Name</label>
                            <input type="text" name="fullName" value={formData.fullName} onChange={handleChange} className="w-full px-4 py-2 bg-black/20 border border-white/10 text-white rounded-xl focus:ring-2 focus:ring-primary outline-none" placeholder="Name" required />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-1">Age</label>
                            <input type="number" name="age" value={formData.age} onChange={handleChange} className="w-full px-4 py-2 bg-black/20 border border-white/10 text-white rounded-xl focus:ring-2 focus:ring-primary outline-none" placeholder="Age" required />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-1">Gender</label>
                            <select name="gender" value={formData.gender} onChange={handleChange} className="w-full px-4 py-2 bg-black/20 border border-white/10 text-white rounded-xl focus:ring-2 focus:ring-primary outline-none">
                                <option className="bg-gray-800">Male</option>
                                <option className="bg-gray-800">Female</option>
                                <option className="bg-gray-800">Other</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-1">District</label>
                            <select name="district" value={formData.district} onChange={handleChange} className="w-full px-4 py-2 bg-black/20 border border-white/10 text-white rounded-xl focus:ring-2 focus:ring-primary outline-none">
                                <option className="bg-gray-800">Wayanad</option>
                                <option className="bg-gray-800">Idukki</option>
                                <option className="bg-gray-800">Ernakulam</option>
                            </select>
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-1">Health Status / Medical Needs</label>
                        <textarea name="healthStatus" value={formData.healthStatus} onChange={handleChange} className="w-full px-4 py-2 bg-black/20 border border-white/10 text-white rounded-xl focus:ring-2 focus:ring-primary outline-none" rows="3" placeholder="Any specific condition..."></textarea>
                    </div>

                    <div className="bg-black/20 p-4 rounded-xl border border-white/10">
                        <h3 className="font-bold text-white mb-4">Assignment</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-1">Assign to Camp</label>
                                <select name="assignedCamp" value={formData.assignedCamp} onChange={handleChange} className="w-full px-4 py-2 bg-black/40 border border-white/10 text-white rounded-xl focus:ring-2 focus:ring-primary outline-none">
                                    <option value="" className="bg-gray-800">Select Camp</option>
                                    {camps.map(c => (
                                        <option key={c._id} value={c._id} className="bg-gray-800">{c.name}</option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-1">...or Safe Home</label>
                                <select name="assignedSafeHome" value={formData.assignedSafeHome} onChange={handleChange} className="w-full px-4 py-2 bg-black/40 border border-white/10 text-white rounded-xl focus:ring-2 focus:ring-primary outline-none">
                                    <option value="" className="bg-gray-800">Select Safe Home</option>
                                    {safeHomes.map(h => (
                                        <option key={h._id} value={h._id} className="bg-gray-800">{h.ownerName}</option>
                                    ))}
                                </select>
                            </div>
                        </div>
                    </div>

                    <div className="flex gap-3 pt-4">
                        <button type="button" onClick={() => navigate(-1)} className="flex-1 py-3 bg-black/20 text-gray-300 font-bold rounded-xl hover:bg-white/10 transition border border-white/10">
                            Cancel
                        </button>
                        <button type="submit" disabled={saving} className="flex-1 py-3 bg-primary text-white font-bold rounded-xl hover:bg-lime-700 transition shadow-lg shadow-lime-500/30 flex items-center justify-center gap-2 disabled:opacity-50">
                            <UserPlus className="w-5 h-5" /> {saving ? 'Registering...' : 'Register Refugee'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default RefugeeRegister;
