import React, { useState } from 'react';
import { Search, Filter, Phone, MapPin, Shield } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

const VolunteerList = () => {
    const { t } = useLanguage();
    const [searchTerm, setSearchTerm] = useState('');
    const [districtFilter, setDistrictFilter] = useState('All');

    // Data copied from VolunteerSignup.jsx as requested
    const volunteers = [
        { id: 1, name: "Arjun Narayan", district: "Wayanad", phone: "+91 98765 12345", location: "Meppadi", role: "Medical" },
        { id: 2, name: "Fatima Hameed", district: "Kozhikode", phone: "+91 99887 66554", location: "Vilangad", role: "Rescue" },
        { id: 3, name: "John Mathew", district: "Malappuram", phone: "+91 88776 54321", location: "Nilambur", role: "Logistics" },
        { id: 4, name: "Sreejith K", district: "Wayanad", phone: "+91 77665 43210", location: "Chooralmala", role: "General" },
        { id: 5, name: "Deepa Thomas", district: "Kannur", phone: "+91 66554 32109", location: "Iritty", role: "Medical" },
        { id: 6, name: "Rahul Krishna", district: "Wayanad", phone: "+91 98765 00000", location: "Kalpetta", role: "Rescue" },
    ];

    const districts = ['All', 'Wayanad', 'Kozhikode', 'Malappuram', 'Kannur'];

    const filteredVolunteers = volunteers.filter(v => {
        const matchesDistrict = districtFilter === 'All' || v.district === districtFilter;
        const matchesSearch = v.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            v.location.toLowerCase().includes(searchTerm.toLowerCase());
        return matchesDistrict && matchesSearch;
    });

    return (
        <div className="p-6 h-full flex flex-col">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h2 className="text-3xl font-bold text-white">{t('nav.directory')}</h2>
                    <p className="text-gray-400">{t('volunteer.connect')}</p>
                </div>
                <div className="flex gap-3">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input
                            type="text"
                            placeholder={t('search')}
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-9 pr-4 py-2 bg-surface border border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-neon/20 text-sm w-64 text-white"
                        />
                    </div>
                </div>
            </div>

            {/* Filters */}
            <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
                {districts.map(d => (
                    <button
                        key={d}
                        onClick={() => setDistrictFilter(d)}
                        className={`px-4 py-1.5 rounded-full text-sm font-bold transition border ${districtFilter === d
                            ? 'bg-neon text-black border-neon'
                            : 'bg-surface text-gray-400 border-white/10 hover:border-white/30'
                            }`}
                    >
                        {d === 'All' ? t('filter') + ': All' : d}
                    </button>
                ))}
            </div>

            {/* List */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 overflow-y-auto">
                {filteredVolunteers.map(v => (
                    <div key={v.id} className="bg-surface p-5 rounded-2xl border border-white/10 shadow-sm hover:border-neon/30 transition group">
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
                            <button className="flex-1 py-2 text-xs font-bold bg-white/5 text-gray-300 rounded-lg hover:bg-white/10 transition border border-white/5">
                                {t('contact')}
                            </button>
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
        </div>
    );
};

export default VolunteerList;
