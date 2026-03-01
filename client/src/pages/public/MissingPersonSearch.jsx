import React, { useState, useEffect } from 'react';
import { Search, User, X, MapPin, Calendar, AlertCircle, Phone, Plus, Loader2 } from 'lucide-react';
import { AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useLanguage } from '../../context/LanguageContext';
import { missingPersonsAPI } from '../../services/api';

const MissingPersonSearch = ({ viewOnly = false }) => {
    const { t } = useLanguage();
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedPerson, setSelectedPerson] = useState(null);
    const [persons, setPersons] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchMissingPersons();
    }, []);

    const fetchMissingPersons = async () => {
        setLoading(true);
        try {
            const res = await missingPersonsAPI.getAll();
            setPersons(res.data.data || []);
        } catch (err) {
            console.error('Failed to fetch missing persons:', err);
        } finally {
            setLoading(false);
        }
    };

    const filteredPersons = persons.filter(person =>
        (person.name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        (person.lastSeen || '').toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleStatusUpdate = async (id, newStatus) => {
        try {
            await missingPersonsAPI.update(id, { status: newStatus });
            setPersons(persons.map(p => p._id === id ? { ...p, status: newStatus } : p));
            if (selectedPerson && selectedPerson._id === id) {
                setSelectedPerson({ ...selectedPerson, status: newStatus });
            }
        } catch (err) {
            console.error('Failed to update status:', err);
        }
    };

    return (
        <div className="min-h-screen bg-background p-6 relative">
            <div className="max-w-6xl mx-auto">

                <header className="mb-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div>
                        <h1 className="text-3xl font-bold text-white">{t('nav.missing')}</h1>
                        <p className="text-gray-400 mt-2">{t('missing.subtitle')}</p>
                    </div>
                    {!viewOnly && (
                        <Link to="/volunteer/missing/new" className="px-4 py-2 bg-red-600 text-white font-bold rounded-xl flex items-center gap-2 hover:bg-red-700 transition shadow-lg shadow-red-500/30 w-full sm:w-auto justify-center">
                            <Plus className="w-5 h-5" /> {t('action.reportMissing')}
                        </Link>
                    )}
                </header>

                {/* Search Bar */}
                <div className="bg-gray-800 p-4 rounded-2xl shadow-sm mb-8 flex gap-4 max-w-2xl mx-auto border border-gray-700">
                    <div className="flex-1 relative">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                        <input
                            type="text"
                            placeholder={t('search')}
                            className="w-full pl-12 pr-4 py-3 bg-gray-700 text-white border-none rounded-xl focus:ring-2 focus:ring-emerald-500 transition outline-none placeholder-gray-400"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>

                {/* Loading */}
                {loading ? (
                    <div className="flex items-center justify-center py-20">
                        <Loader2 className="w-8 h-8 text-primary animate-spin" />
                    </div>
                ) : filteredPersons.length === 0 ? (
                    <div className="text-center py-16">
                        <User className="w-12 h-12 text-gray-600 mx-auto mb-4" />
                        <p className="text-gray-400 text-lg">No missing persons reported</p>
                        <p className="text-gray-600 text-sm mt-1">Reports will appear here when submitted</p>
                    </div>
                ) : (
                    /* Grid */
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {filteredPersons.map((person) => (
                            <div key={person._id} className="bg-surface rounded-2xl shadow-sm border border-white/10 overflow-hidden group hover:shadow-lg hover:shadow-primary/10 transition-all duration-300">
                                <div className="h-48 bg-black/20 flex items-center justify-center relative overflow-hidden">
                                    {person.photoUrl ? (
                                        <img src={person.photoUrl} alt={person.name} className="w-full h-full object-cover" />
                                    ) : (
                                        <User className="w-16 h-16 text-gray-600 group-hover:scale-110 group-hover:text-primary transition duration-500" />
                                    )}
                                    <div className={`absolute top-3 right-3 px-2 py-1 text-xs font-bold rounded-lg ${person.status === 'Found' ? 'bg-primary/20 text-primary border border-primary/30' : 'bg-red-500/20 text-red-500 border border-red-500/30'
                                        }`}>
                                        {person.status}
                                    </div>
                                </div>
                                <div className="p-5">
                                    <h3 className="font-bold text-lg text-white mb-1">{person.name}</h3>
                                    <div className="flex items-center gap-1 text-sm text-gray-400 mb-4">
                                        <MapPin className="w-3 h-3 text-gray-500" /> {person.lastSeen}
                                    </div>

                                    <button
                                        onClick={() => setSelectedPerson(person)}
                                        className="w-full py-2 bg-primary/10 text-primary text-sm font-bold rounded-lg hover:bg-primary hover:text-black transition-colors"
                                    >
                                        {t('viewDetails')}
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Detail Modal */}
            <AnimatePresence>
                {selectedPerson && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setSelectedPerson(null)}
                            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
                        ></motion.div>

                        <motion.div
                            initial={{ scale: 0.9, opacity: 0, y: 20 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.9, opacity: 0, y: 20 }}
                            className="bg-surface rounded-3xl shadow-2xl max-w-lg w-full overflow-hidden relative z-10 border border-white/10"
                        >
                            <button
                                onClick={() => setSelectedPerson(null)}
                                className="absolute top-4 right-4 p-2 bg-black/20 hover:bg-black/40 rounded-full transition text-gray-400 hover:text-white"
                            >
                                <X className="w-5 h-5" />
                            </button>

                            <div className="p-4 sm:p-8 overflow-y-auto max-h-[85vh]">
                                <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 sm:gap-6 text-center sm:text-left">
                                    <div className="w-24 h-24 bg-black/20 rounded-2xl flex items-center justify-center flex-shrink-0">
                                        <User className="w-10 h-10 text-gray-500" />
                                    </div>
                                    <div className="w-full">
                                        <h2 className="text-2xl font-bold text-white">{selectedPerson.name}</h2>
                                        <p className="text-gray-400">{selectedPerson.age} Years • {selectedPerson.gender}</p>

                                        {!viewOnly ? (
                                            <div className="flex flex-wrap justify-center sm:justify-start gap-2 mt-3">
                                                <button
                                                    onClick={() => handleStatusUpdate(selectedPerson._id, 'Found')}
                                                    className={`px-3 py-1 rounded-lg text-xs font-bold border transition ${selectedPerson.status === 'Found' ? 'bg-primary text-black border-primary' : 'bg-transparent text-gray-400 border-gray-600 hover:border-primary hover:text-primary'}`}
                                                >
                                                    {t('missing.markFound')}
                                                </button>
                                                <button
                                                    onClick={() => handleStatusUpdate(selectedPerson._id, 'Missing')}
                                                    className={`px-3 py-1 rounded-lg text-xs font-bold border transition ${selectedPerson.status === 'Missing' ? 'bg-red-500 text-white border-red-500' : 'bg-transparent text-gray-400 border-gray-600 hover:border-red-500 hover:text-red-500'}`}
                                                >
                                                    {t('missing.markMissing')}
                                                </button>
                                            </div>
                                        ) : (
                                            <div className={`inline-flex items-center gap-2 mt-2 px-3 py-1 rounded-full text-xs font-bold ${selectedPerson.status === 'Found' ? 'bg-primary/20 text-primary' : 'bg-red-500/20 text-red-500'
                                                }`}>
                                                <AlertCircle className="w-3 h-3" /> {selectedPerson.status}
                                            </div>
                                        )}
                                    </div>
                                </div>

                                <div className="mt-8 space-y-4">
                                    <div className="bg-black/20 p-4 rounded-xl flex items-start gap-4 border border-white/5">
                                        <MapPin className="w-5 h-5 text-primary mt-0.5" />
                                        <div>
                                            <p className="text-sm text-gray-400 font-medium">{t('location')}</p>
                                            <p className="text-white font-medium">{selectedPerson.lastSeen}</p>
                                        </div>
                                    </div>

                                    <div className="bg-black/20 p-4 rounded-xl flex items-start gap-4 border border-white/5">
                                        <Calendar className="w-5 h-5 text-primary mt-0.5" />
                                        <div>
                                            <p className="text-sm text-gray-400 font-medium">{t('missing.date')}</p>
                                            <p className="text-white font-medium">{selectedPerson.dateMissing ? new Date(selectedPerson.dateMissing).toLocaleDateString('en-IN') : 'N/A'}</p>
                                        </div>
                                    </div>

                                    <div className="bg-black/20 p-4 rounded-xl border border-white/5">
                                        <p className="text-sm text-gray-400 font-medium mb-1">{t('missing.description')}</p>
                                        <p className="text-gray-200">{selectedPerson.description}</p>
                                    </div>

                                    <div className="border-t border-white/10 pt-6 mt-6">
                                        <p className="text-sm text-gray-400 font-medium mb-2">{t('contact')}</p>
                                        <div className="flex items-center gap-2 text-primary font-bold text-lg">
                                            <Phone className="w-5 h-5" /> {selectedPerson.contact || selectedPerson.informant || 'N/A'}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default MissingPersonSearch;
