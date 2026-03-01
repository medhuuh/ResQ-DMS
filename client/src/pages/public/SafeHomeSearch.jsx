import React, { useState, useEffect } from 'react';
import { Home, MapPin, ChevronDown, Plus, Phone, Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../../context/LanguageContext';
import { safeHomesAPI } from '../../services/api';

const SafeHomeSearch = ({ canEdit = false, viewOnly = false }) => {
    const { t } = useLanguage();
    const [selectedDistrict, setSelectedDistrict] = useState('');
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [homes, setHomes] = useState([]);
    const [loading, setLoading] = useState(true);

    const districts = [
        "Kasaragod", "Kannur", "Wayanad", "Kozhikode", "Malappuram",
        "Palakkad", "Thrissur", "Ernakulam", "Idukki", "Kottayam",
        "Alappuzha", "Pathanamthitta", "Kollam", "Thiruvananthapuram"
    ];

    const [editingHome, setEditingHome] = useState(null);
    const [editForm, setEditForm] = useState({ occupied: 0 });

    useEffect(() => {
        fetchHomes();
    }, []);

    const fetchHomes = async () => {
        setLoading(true);
        try {
            const res = await safeHomesAPI.getAll();
            setHomes(res.data.data || []);
        } catch (err) {
            console.error('Failed to fetch safe homes:', err);
        } finally {
            setLoading(false);
        }
    };

    const filteredHomes = selectedDistrict
        ? homes.filter(home =>
            (home.location || '').toLowerCase().includes(selectedDistrict.toLowerCase()) ||
            (home.address || '').toLowerCase().includes(selectedDistrict.toLowerCase()) ||
            (home.district || '').toLowerCase().includes(selectedDistrict.toLowerCase())
        )
        : homes;

    const handleUpdate = async (e) => {
        e.preventDefault();
        try {
            await safeHomesAPI.update(editingHome._id, { occupied: parseInt(editForm.occupied) });
            setHomes(homes.map(h => h._id === editingHome._id ? { ...h, occupied: parseInt(editForm.occupied) } : h));
            setEditingHome(null);
        } catch (err) {
            console.error('Failed to update safe home:', err);
        }
    };

    const openEditModal = (home) => {
        setEditingHome(home);
        setEditForm({ occupied: home.occupied || 0 });
    };

    return (
        <div className="min-h-screen bg-background p-6">
            <div className="max-w-6xl mx-auto">
                <header className="mb-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div>
                        <h1 className="text-3xl font-bold text-white">{t('nav.safeHomes')}</h1>
                        <p className="text-gray-400 mt-2">{t('card.safeHomes.desc')}</p>
                    </div>
                    {!viewOnly && (
                        <Link to="/volunteer/safe-homes/new" className="px-4 py-2 bg-primary text-white font-bold rounded-xl flex items-center gap-2 hover:bg-lime-700 transition shadow-lg shadow-lime-500/30 w-full sm:w-auto justify-center">
                            <Plus className="w-5 h-5" /> {t('action.listHome')}
                        </Link>
                    )}
                </header>

                <div className="bg-surface p-2 rounded-2xl shadow-sm mb-8 max-w-md mx-auto border border-white/10 relative z-20">
                    <div className="relative">
                        <button
                            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                            className="w-full flex items-center justify-between pl-5 pr-4 py-3 bg-black/20 rounded-xl text-left transition text-white font-medium hover:bg-black/30"
                        >
                            <span>{selectedDistrict || t('filter')}</span>
                            <ChevronDown className={`w-5 h-5 text-indigo-500 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
                        </button>

                        {isDropdownOpen && (
                            <>
                                <div className="fixed inset-0 z-10" onClick={() => setIsDropdownOpen(false)}></div>
                                <div className="absolute top-full left-0 right-0 mt-2 bg-[#1e1e1e] border border-white/10 rounded-xl shadow-xl overflow-hidden z-20 py-2 max-h-60 overflow-y-auto">
                                    <button
                                        onClick={() => { setSelectedDistrict(''); setIsDropdownOpen(false); }}
                                        className="w-full text-left px-5 py-3 text-gray-400 hover:bg-white/5 transition flex items-center gap-2"
                                    >
                                        All Districts
                                    </button>
                                    {districts.map((district) => (
                                        <button
                                            key={district}
                                            onClick={() => { setSelectedDistrict(district); setIsDropdownOpen(false); }}
                                            className={`w-full text-left px-5 py-3 transition flex items-center gap-2 ${selectedDistrict === district ? 'bg-indigo-500/20 text-indigo-400' : 'text-white hover:bg-white/5'
                                                }`}
                                        >
                                            {district}
                                        </button>
                                    ))}
                                </div>
                            </>
                        )}
                    </div>
                </div>

                {/* Loading */}
                {loading ? (
                    <div className="flex items-center justify-center py-20">
                        <Loader2 className="w-8 h-8 text-primary animate-spin" />
                    </div>
                ) : filteredHomes.length === 0 ? (
                    <div className="text-center py-16">
                        <Home className="w-12 h-12 text-gray-600 mx-auto mb-4" />
                        <p className="text-gray-400 text-lg">No safe homes registered yet</p>
                        <p className="text-gray-600 text-sm mt-1">Safe homes will appear here once registered</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredHomes.map(home => (
                            <div key={home._id} className="bg-surface p-6 rounded-3xl shadow-sm border border-white/10 hover:shadow-lg hover:shadow-primary/10 transition-all duration-300">
                                <div className="flex justify-between items-start mb-4">
                                    <div className="bg-black/20 p-3 rounded-2xl text-primary">
                                        <Home className="w-6 h-6" />
                                    </div>
                                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${(home.capacity - (home.occupied || 0)) > 10 ? 'bg-primary/20 text-primary' : 'bg-red-500/20 text-red-500'}`}>
                                        {home.capacity - (home.occupied || 0)} Available
                                    </span>
                                </div>
                                <h3 className="text-xl font-bold text-white mb-1">{home.ownerName}</h3>
                                <div className="flex items-center gap-2 text-gray-400 mb-2">
                                    <MapPin className="w-4 h-4 text-gray-500" />
                                    <span className="text-sm">{home.address || home.location || 'No address'}</span>
                                </div>

                                <div className="flex flex-col gap-1 mb-4 text-xs text-gray-500">
                                    {home.phone && <div className="flex items-center gap-2"><Phone className="w-3 h-3" /> {home.phone}</div>}
                                    {home.phone2 && <div className="flex items-center gap-2"><Phone className="w-3 h-3" /> {home.phone2}</div>}
                                </div>

                                <div className="flex justify-between items-center pt-4 border-t border-white/10">
                                    <div className="text-sm text-gray-400 font-medium">
                                        Max {t('capacity')}: <span className="text-white">{home.capacity}</span>
                                    </div>
                                    {canEdit ? (
                                        <button
                                            onClick={() => openEditModal(home)}
                                            className="text-primary font-bold text-sm hover:text-neon transition border border-primary/30 px-3 py-1.5 rounded-lg hover:bg-primary/10"
                                        >
                                            {t('updateStatus')}
                                        </button>
                                    ) : (
                                        <span className={`px-2 py-1 rounded-lg text-[10px] font-bold ${home.status === 'Active' ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
                                            {home.status || 'Active'}
                                        </span>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* Edit Modal */}
                {editingHome && (
                    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                        <div className="bg-surface rounded-2xl border border-white/10 p-6 w-full max-w-md shadow-2xl">
                            <h3 className="text-xl font-bold text-white mb-4">{t('updateStatus')}: {editingHome.ownerName}</h3>
                            <form onSubmit={handleUpdate} className="space-y-4">
                                <div>
                                    <label className="block text-sm text-gray-400 mb-1">Occupied</label>
                                    <input
                                        type="number"
                                        className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-2 text-white focus:outline-none focus:border-primary"
                                        value={editForm.occupied}
                                        onChange={e => setEditForm({ ...editForm, occupied: parseInt(e.target.value) })}
                                    />
                                    <p className="text-xs text-gray-500 mt-2">Max {t('capacity')}: {editingHome.capacity}</p>
                                </div>
                                <div className="flex gap-3 pt-2">
                                    <button type="button" onClick={() => setEditingHome(null)} className="flex-1 py-2 rounded-xl border border-white/10 text-gray-300 font-bold hover:bg-white/5">{t('cancel')}</button>
                                    <button type="submit" className="flex-1 py-2 rounded-xl bg-primary text-black font-bold hover:bg-lime-400">{t('submit')}</button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default SafeHomeSearch;
