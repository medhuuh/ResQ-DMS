import React, { useState, useEffect } from 'react';
import { Search, Filter, Phone, MapPin, Shield, Mail, Droplets, X } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { volunteersAPI } from '../../services/api';

const VolunteerList = ({ isAdmin = false }) => {
    const { t } = useLanguage();
    const [searchTerm, setSearchTerm] = useState('');
    const [districtFilter, setDistrictFilter] = useState('All');
    const [volunteers, setVolunteers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedVolunteer, setSelectedVolunteer] = useState(null);

    useEffect(() => {
        fetchVolunteers();
    }, []);

    const fetchVolunteers = async () => {
        try {
            const res = await volunteersAPI.getAll();
            setVolunteers(res.data.data);
        } catch (err) {
            console.error('Failed to fetch volunteers:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (e, id) => {
        e.stopPropagation(); // prevent opening contact modal if parent is clickable
        if (window.confirm("Are you sure you want to remove this volunteer?")) {
            try {
                await volunteersAPI.delete(id);
                fetchVolunteers(); // refresh list
            } catch (err) {
                console.error("Failed to delete volunteer:", err);
                alert("Could not delete volunteer.");
            }
        }
    };

    // Extract unique districts from data
    const districts = ['All', ...new Set(volunteers.map(v => v.district))];

    const filteredVolunteers = volunteers.filter(v => {
        const matchesDistrict = districtFilter === 'All' || v.district === districtFilter;
        const matchesSearch = v.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            v.location.toLowerCase().includes(searchTerm.toLowerCase());
        return matchesDistrict && matchesSearch;
    });

    if (loading) {
        return <div className="p-6 flex justify-center py-20"><div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div></div>;
    }

    return (
        <div className="p-4 sm:p-6 h-full flex flex-col">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                <div>
                    <h2 className="text-2xl sm:text-3xl font-bold text-white">{t('nav.directory')}</h2>
                    <p className="text-gray-400 text-sm">{t('volunteer.connect')}</p>
                </div>
                <div className="w-full sm:w-auto">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input
                            type="text"
                            placeholder={t('search')}
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full sm:w-64 pl-9 pr-4 py-2 bg-surface border border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-neon/20 text-sm text-white"
                        />
                    </div>
                </div>
            </div>

            {/* Filters */}
            <div className="flex gap-2 mb-6 overflow-x-auto pb-2 no-scrollbar">
                {districts.map(d => (
                    <button
                        key={d}
                        onClick={() => setDistrictFilter(d)}
                        className={`whitespace-nowrap px-4 py-1.5 rounded-full text-xs sm:text-sm font-bold transition border ${districtFilter === d
                            ? 'bg-neon text-black border-neon'
                            : 'bg-surface text-gray-400 border-white/10 hover:border-white/30'
                            }`}
                    >
                        {d === 'All' ? t('filter') + ': All' : d}
                    </button>
                ))}
            </div>

            {/* List */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 overflow-y-auto custom-scrollbar">
                {filteredVolunteers.map(v => (
                    <div key={v._id} className="bg-surface p-5 rounded-2xl border border-white/10 shadow-sm hover:border-neon/30 transition group">
                        <div className="flex justify-between items-start mb-4">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-neon/10 flex items-center justify-center text-neon font-bold">
                                    {v.name.charAt(0)}
                                </div>
                                <div>
                                    <h3 className="font-bold text-white leading-tight">{v.name}</h3>
                                    <span className="text-xs font-bold text-gray-500">{v.role}</span>
                                </div>
                            </div>
                            <span className={`px-2.5 py-1 rounded-lg text-xs font-bold ${v.district === 'Wayanad' ? 'bg-red-500/20 text-red-400' : 'bg-blue-500/20 text-blue-400'
                                }`}>
                                {v.district}
                            </span>
                        </div>

                        <div className="space-y-2.5">
                            <div className="flex items-center gap-3 text-sm text-gray-400">
                                <MapPin className="w-4 h-4 text-gray-500" />
                                <span>{v.location}</span>
                            </div>
                            <div className="flex items-center gap-3 text-sm text-gray-400">
                                <Phone className="w-4 h-4 text-gray-500" />
                                <span>{v.phone}</span>
                            </div>
                        </div>

                        <div className="mt-4 pt-4 border-t border-white/10 flex gap-2">
                            <button
                                onClick={() => setSelectedVolunteer(v)}
                                className="flex-1 py-2 text-xs font-bold bg-white/5 text-gray-300 rounded-lg hover:bg-white/10 transition border border-white/5"
                            >
                                {t('contact')}
                            </button>
                            {isAdmin && (
                                <button
                                    onClick={(e) => handleDelete(e, v._id)}
                                    className="py-2 px-4 text-xs font-bold bg-red-500/10 text-red-500 rounded-lg hover:bg-red-500/20 transition border border-red-500/20"
                                >
                                    Delete
                                </button>
                            )}
                        </div>
                    </div>
                ))}
            </div>

            {filteredVolunteers.length === 0 && (
                <div className="text-center py-20 bg-surface rounded-2xl border-2 border-dashed border-white/10">
                    <Shield className="w-12 h-12 mx-auto text-gray-500 mb-3" />
                    <p className="text-gray-400 font-medium">{t('noResults')}</p>
                </div>
            )}

            {/* Contact Modal */}
            {selectedVolunteer && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm" onClick={() => setSelectedVolunteer(null)}>
                    <div
                        className="bg-surface border border-white/10 p-6 rounded-3xl w-full max-w-md relative animate-fade-in shadow-2xl"
                        onClick={e => e.stopPropagation()}
                    >
                        <button
                            onClick={() => setSelectedVolunteer(null)}
                            className="absolute top-4 right-4 p-2 text-gray-400 hover:text-white bg-white/5 rounded-full transition hover:bg-white/10"
                        >
                            <X className="w-5 h-5" />
                        </button>

                        <div className="flex items-center gap-4 mb-6 pt-2">
                            <div className="w-14 h-14 bg-neon/10 text-neon font-bold text-2xl rounded-full flex items-center justify-center border border-neon/20">
                                {selectedVolunteer.name ? selectedVolunteer.name.charAt(0).toUpperCase() : 'V'}
                            </div>
                            <div>
                                <h3 className="text-2xl font-bold text-white">{selectedVolunteer.name}</h3>
                                <p className="text-gray-400 text-sm">
                                    {selectedVolunteer.role || (selectedVolunteer.skills?.length > 0 ? selectedVolunteer.skills[0] : 'General Rescue')}
                                </p>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <div className="bg-black/20 p-4 rounded-xl border border-white/5 flex flex-col gap-4">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-primary/10 rounded-lg text-primary"><Phone className="w-5 h-5" /></div>
                                    <div>
                                        <p className="text-xs text-gray-500 font-bold uppercase tracking-wider">Phone</p>
                                        <p className="text-white font-medium">{selectedVolunteer.phone || 'N/A'}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-neon/10 rounded-lg text-neon"><Mail className="w-5 h-5" /></div>
                                    <div>
                                        <p className="text-xs text-gray-500 font-bold uppercase tracking-wider">Email</p>
                                        <p className="text-white font-medium">{selectedVolunteer.email || 'Not provided'}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-red-500/10 rounded-lg text-red-500"><Droplets className="w-5 h-5" /></div>
                                    <div>
                                        <p className="text-xs text-gray-500 font-bold uppercase tracking-wider">Blood Group</p>
                                        <p className="text-white font-medium">{selectedVolunteer.bloodGroup || 'N/A'}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-blue-500/10 rounded-lg text-blue-500"><MapPin className="w-5 h-5" /></div>
                                    <div>
                                        <p className="text-xs text-gray-500 font-bold uppercase tracking-wider">Location</p>
                                        <p className="text-white font-medium">
                                            {selectedVolunteer.location && selectedVolunteer.district && selectedVolunteer.location !== selectedVolunteer.district
                                                ? `${selectedVolunteer.location}, ${selectedVolunteer.district}`
                                                : selectedVolunteer.location || selectedVolunteer.district || 'N/A'}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default VolunteerList;
