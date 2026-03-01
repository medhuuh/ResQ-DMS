
import React, { useState, useEffect } from 'react';
import { ShieldCheck, MapPin, Phone, Plus, Home, Edit, Trash2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { safeHomesAPI } from '../../services/api';

const SafeHomeList = () => {
    const [homes, setHomes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [editingHome, setEditingHome] = useState(null);
    const [editForm, setEditForm] = useState({ capacity: 0, occupied: 0 });

    useEffect(() => {
        fetchHomes();
    }, []);

    const fetchHomes = async () => {
        try {
            const res = await safeHomesAPI.getAll();
            setHomes(res.data.data);
        } catch (err) {
            console.error('Failed to fetch safe homes:', err);
        } finally {
            setLoading(false);
        }
    };

    const openEditModal = (home) => {
        setEditingHome(home);
        setEditForm({ capacity: home.capacity, occupied: home.occupied });
    };

    const handleUpdate = async (e) => {
        e.preventDefault();
        try {
            await safeHomesAPI.update(editingHome._id, editForm);
            setHomes(homes.map(h => h._id === editingHome._id ? { ...h, ...editForm } : h));
            setEditingHome(null);
        } catch (err) {
            console.error('Failed to update safe home:', err);
            alert('Failed to update. Please try again.');
        }
    };

    const handleDelete = async (id) => {
        if (!confirm('Are you sure you want to delete this safe home?')) return;
        try {
            await safeHomesAPI.delete(id);
            setHomes(homes.filter(h => h._id !== id));
        } catch (err) {
            console.error('Failed to delete safe home:', err);
            alert('Failed to delete. Please try again.');
        }
    };

    if (loading) {
        return <div className="p-6 flex justify-center py-20"><div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div></div>;
    }

    return (
        <div className="p-4 sm:p-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                <div>
                    <h2 className="text-2xl sm:text-3xl font-bold text-white">My Safe Homes</h2>
                    <p className="text-gray-400 text-sm">Manage your listed properties</p>
                </div>
                <Link to="/admin/safe-homes/new" className="w-full sm:w-auto px-4 py-2 bg-primary text-white font-bold rounded-xl flex items-center justify-center gap-2 hover:bg-lime-700 transition shadow-lg shadow-lime-500/30 text-sm">
                    <Plus className="w-5 h-5" /> List New Home
                </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                {homes.map((home) => (
                    <div key={home._id} className="bg-surface p-4 sm:p-6 rounded-2xl shadow-sm border border-white/10 group hover:border-primary/50 transition duration-300">
                        <div className="flex justify-between items-start mb-4">
                            <div className="bg-black/20 p-2 sm:p-3 rounded-xl text-primary">
                                <Home className="w-5 h-5 sm:w-6 sm:h-6" />
                            </div>
                            <div className="flex gap-1 sm:gap-2">
                                <button
                                    onClick={() => openEditModal(home)}
                                    className="p-1.5 sm:p-2 hover:bg-black/20 rounded-lg text-gray-400 hover:text-primary transition"
                                >
                                    <Edit className="w-4 h-4" />
                                </button>
                                <button onClick={() => handleDelete(home._id)} className="p-1.5 sm:p-2 hover:bg-black/20 rounded-lg text-gray-400 hover:text-red-500 transition"><Trash2 className="w-4 h-4" /></button>
                            </div>
                        </div>
                        <h3 className="font-bold text-base sm:text-lg text-white">{home.ownerName}</h3>
                        <p className="text-xs sm:text-sm text-gray-400 mb-2">Location: {home.location}</p>

                        <div className="flex flex-col gap-1 mb-4 text-[10px] sm:text-xs text-gray-500">
                            <div className="flex items-center gap-2"><Phone className="w-3 h-3" /> {home.phone}</div>
                            {home.phone2 && <div className="flex items-center gap-2"><Phone className="w-3 h-3" /> {home.phone2}</div>}
                        </div>

                        <div className="flex items-center justify-between py-3 border-t border-white/10">
                            <div>
                                <p className="text-[10px] sm:text-xs text-gray-400">Capacity</p>
                                <p className="font-bold text-white text-xs sm:text-sm">{home.capacity} People</p>
                            </div>
                            <div className="text-right">
                                <p className="text-[10px] sm:text-xs text-gray-400">Status</p>
                                <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${home.status === 'Active' ? 'text-green-400 bg-green-500/20 border border-green-500/30' : 'text-gray-400 bg-gray-500/20'}`}>
                                    {home.status}
                                </span>
                            </div>
                        </div>

                        <div className="mt-4">
                            <label className="flex items-center justify-between cursor-pointer">
                                <span className="text-xs sm:text-sm font-medium text-gray-300">Available Spots</span>
                                <span className="text-xs sm:text-sm font-bold text-primary">{home.capacity - home.occupied}</span>
                            </label>
                            <div className="w-full h-1.5 sm:h-2 bg-black/40 rounded-full mt-2 overflow-hidden">
                                <div
                                    className="h-full bg-primary transition-all duration-500"
                                    style={{ width: `${(home.occupied / home.capacity) * 100}%` }}
                                ></div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Edit Modal */}
            {editingHome && (
                <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-surface rounded-2xl border border-white/10 p-5 sm:p-6 w-full max-w-md shadow-2xl">
                        <h3 className="text-lg sm:text-xl font-bold text-white mb-4">Edit Home: {editingHome.ownerName}</h3>
                        <form onSubmit={handleUpdate} className="space-y-4">
                            <div>
                                <label className="block text-xs sm:text-sm text-gray-400 mb-1">Total Capacity</label>
                                <input type="number" className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-2 text-white focus:outline-none focus:border-primary text-sm" value={editForm.capacity} onChange={e => setEditForm({ ...editForm, capacity: parseInt(e.target.value) })} />
                            </div>
                            <div>
                                <label className="block text-xs sm:text-sm text-gray-400 mb-1">Current Occupancy</label>
                                <input type="number" className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-2 text-white focus:outline-none focus:border-primary text-sm" value={editForm.occupied} onChange={e => setEditForm({ ...editForm, occupied: parseInt(e.target.value) })} />
                            </div>
                            <div className="flex gap-3 pt-2">
                                <button type="button" onClick={() => setEditingHome(null)} className="flex-1 py-2 rounded-xl border border-white/10 text-gray-300 font-bold hover:bg-white/5 text-sm">Cancel</button>
                                <button type="submit" className="flex-1 py-2 rounded-xl bg-primary text-black font-bold hover:bg-lime-400 text-sm">Update</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default SafeHomeList;
