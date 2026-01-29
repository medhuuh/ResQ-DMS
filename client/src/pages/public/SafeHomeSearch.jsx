import React, { useState } from 'react';
import { Home, MapPin, ChevronDown, Plus, Phone } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../../context/LanguageContext';

const SafeHomeSearch = ({ canEdit = false }) => {
    const { t } = useLanguage();
    const [selectedDistrict, setSelectedDistrict] = useState('');
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);

    const districts = ["Wayanad", "Kozhikode", "Kannur", "Malappuram", "Kasaragod"];
    const [homes, setHomes] = useState([
        { id: 1, name: 'Sree Vilas Community Hall', location: 'Meppadi, Wayanad', capacity: 150, available: 12, phone1: "+91 98765 11101", phone2: "+91 98765 11102" },
        { id: 2, name: 'St. Marys High School', location: 'Vythiri, Wayanad', capacity: 200, available: 45, phone1: "+91 98765 11103", phone2: "+91 98765 11104" },
        { id: 3, name: 'Govt. College Shelter', location: 'Mundakkai, Wayanad', capacity: 300, available: 120, phone1: "+91 98765 11105", phone2: "+91 98765 11106" },
        { id: 4, name: 'Town Hall Relief Camp', location: 'Vilangad, Kozhikode', capacity: 100, available: 10, phone1: "+91 98765 11107", phone2: "+91 98765 11108" },
        { id: 5, name: 'Hilltop Residency', location: 'Taliparamba, Kannur', capacity: 50, available: 5, phone1: "+91 98765 11109", phone2: "+91 98765 11110" },
        { id: 6, name: 'Community Center', location: 'Nilambur, Malappuram', capacity: 80, available: 30, phone1: "+91 98765 11111", phone2: "+91 98765 11112" },
        { id: 7, name: 'District Sports Complex', location: 'Kanhangad, Kasaragod', capacity: 500, available: 350, phone1: "+91 98765 11113", phone2: "+91 98765 11114" },
    ]);

    const [editingHome, setEditingHome] = useState(null);
    const [editForm, setEditForm] = useState({ available: 0 });

    const filteredHomes = selectedDistrict
        ? homes.filter(home => home.location.toLowerCase().includes(selectedDistrict.toLowerCase()))
        : homes;

    const handleUpdate = (e) => {
        e.preventDefault();
        setHomes(homes.map(h => h.id === editingHome.id ? { ...h, available: parseInt(editForm.available) } : h));
        setEditingHome(null);
    };

    const openEditModal = (home) => {
        setEditingHome(home);
        setEditForm({ available: home.available });
    };

    return (
        <div className="min-h-screen bg-background p-6">
            <div className="max-w-6xl mx-auto">
                <header className="mb-8 flex justify-between items-center">
                    <div>
                        <h1 className="text-3xl font-bold text-white">{t('nav.safeHomes')}</h1>
                        <p className="text-gray-400 mt-2">{t('card.safeHomes.desc')}</p>
                    </div>
                    <Link to="/volunteer/safe-homes/new" className="px-4 py-2 bg-primary text-white font-bold rounded-xl flex items-center gap-2 hover:bg-lime-700 transition shadow-lg shadow-lime-500/30">
                        <Plus className="w-5 h-5" /> {t('action.listHome')}
                    </Link>
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
                                <div className="absolute top-full left-0 right-0 mt-2 bg-[#1e1e1e] border border-white/10 rounded-xl shadow-xl overflow-hidden z-20 py-2">
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

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredHomes.map(home => (
                        <div key={home.id} className="bg-surface p-6 rounded-3xl shadow-sm border border-white/10 hover:shadow-lg hover:shadow-primary/10 transition-all duration-300">
                            <div className="flex justify-between items-start mb-4">
                                <div className="bg-black/20 p-3 rounded-2xl text-primary">
                                    <Home className="w-6 h-6" />
                                </div>
                                <span className={`px-3 py-1 rounded-full text-xs font-bold ${home.available > 10 ? 'bg-primary/20 text-primary' : 'bg-red-500/20 text-red-500'}`}>
                                    {home.available} {t('capacity')}
                                </span>
                            </div>
                            <h3 className="text-xl font-bold text-white mb-1">{home.name}</h3>
                            <div className="flex items-center gap-2 text-gray-400 mb-2">
                                <MapPin className="w-4 h-4 text-gray-500" />
                                <span className="text-sm">{home.location}</span>
                            </div>

                            <div className="flex flex-col gap-1 mb-4 text-xs text-gray-500">
                                <div className="flex items-center gap-2"><Phone className="w-3 h-3" /> {home.phone1}</div>
                                <div className="flex items-center gap-2"><Phone className="w-3 h-3" /> {home.phone2}</div>
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
                                    <Link to="/login" className="text-primary font-bold text-sm hover:text-neon transition">
                                        {t('staffLogin')}
                                    </Link>
                                )}
                            </div>
                        </div>
                    ))}
                </div>

                {filteredHomes.length === 0 && (
                    <div className="text-center py-12">
                        <p className="text-gray-400">No safe homes found in this district.</p>
                    </div>
                )}

                {/* Edit Modal */}
                {editingHome && (
                    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                        <div className="bg-surface rounded-2xl border border-white/10 p-6 w-full max-w-md shadow-2xl">
                            <h3 className="text-xl font-bold text-white mb-4">{t('updateStatus')}: {editingHome.name}</h3>
                            <form onSubmit={handleUpdate} className="space-y-4">
                                <div>
                                    <label className="block text-sm text-gray-400 mb-1">{t('capacity')}</label>
                                    <input
                                        type="number"
                                        className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-2 text-white focus:outline-none focus:border-primary"
                                        value={editForm.available}
                                        onChange={e => setEditForm({ ...editForm, available: parseInt(e.target.value) })}
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
