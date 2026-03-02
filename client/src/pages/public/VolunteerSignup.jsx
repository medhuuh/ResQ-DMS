import React, { useState, useEffect } from 'react';
import { Loader2, Users, MapPin, Phone, Mail, Droplets, X } from 'lucide-react';
import VolunteerForm from '../volunteer/VolunteerForm';
import { volunteersAPI } from '../../services/api';

const VolunteerSignup = () => {
    const [showForm, setShowForm] = useState(false);
    const [districtFilter, setDistrictFilter] = useState('All');
    const [volunteers, setVolunteers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedVolunteer, setSelectedVolunteer] = useState(null);

    const districts = [
        'All', 'Kasaragod', 'Kannur', 'Wayanad', 'Kozhikode', 'Malappuram',
        'Palakkad', 'Thrissur', 'Ernakulam', 'Idukki', 'Kottayam',
        'Alappuzha', 'Pathanamthitta', 'Kollam', 'Thiruvananthapuram'
    ];

    useEffect(() => {
        fetchVolunteers();
    }, []);

    const fetchVolunteers = async () => {
        setLoading(true);
        try {
            const res = await volunteersAPI.getAll();
            setVolunteers(res.data.data || []);
        } catch (err) {
            console.error('Failed to fetch volunteers:', err);
        } finally {
            setLoading(false);
        }
    };

    const filteredVolunteers = districtFilter === 'All'
        ? volunteers
        : volunteers.filter(v => (v.district || '').toLowerCase() === districtFilter.toLowerCase());

    return (
        <div className="pt-24 min-h-screen bg-background pb-12 px-4 sm:px-6">
            <div className="max-w-6xl mx-auto">
                <div className="flex flex-col md:flex-row justify-between items-center mb-12 gap-6">
                    <div>
                        <h1 className="text-4xl font-bold text-white mb-2">Volunteer Force</h1>
                        <p className="text-gray-400">Connect with heroes on the ground.</p>
                    </div>

                    {!showForm && (
                        <button
                            onClick={() => setShowForm(true)}
                            className="px-6 py-3 bg-neon text-black font-bold rounded-xl hover:bg-lime-400 transition shadow-lg shadow-lime-500/20 flex items-center gap-2"
                        >
                            Sign Up to Volunteer
                        </button>
                    )}
                </div>

                {showForm ? (
                    <div className="animate-fade-in w-full max-w-4xl mx-auto">
                        <VolunteerForm onCancel={() => { setShowForm(false); fetchVolunteers(); }} />
                    </div>
                ) : (
                    <div className="animate-fade-in">
                        {/* Filter */}
                        <div className="flex gap-2 overflow-x-auto pb-4 mb-8">
                            {districts.map(d => (
                                <button
                                    key={d}
                                    onClick={() => setDistrictFilter(d)}
                                    className={`px-5 py-2 rounded-full font-bold whitespace-nowrap transition border ${districtFilter === d
                                        ? 'bg-white text-black border-white'
                                        : 'bg-black/30 text-gray-400 border-white/10 hover:border-white/30'
                                        }`}
                                >
                                    {d}
                                </button>
                            ))}
                        </div>

                        {/* Loading */}
                        {loading ? (
                            <div className="flex items-center justify-center py-20">
                                <Loader2 className="w-8 h-8 text-primary animate-spin" />
                            </div>
                        ) : filteredVolunteers.length === 0 ? (
                            <div className="text-center py-20">
                                <Users className="w-12 h-12 text-gray-600 mx-auto mb-4" />
                                <p className="text-gray-400 text-lg">No volunteers registered yet</p>
                                <p className="text-gray-600 text-sm mt-1">Volunteers will appear here once they sign up</p>
                            </div>
                        ) : (
                            /* List */
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {filteredVolunteers.map(v => (
                                    <div key={v._id} className="bg-[#113c31] p-6 rounded-2xl border border-white/5 hover:border-primary/30 transition group flex flex-col h-full">
                                        <div className="flex justify-between items-start mb-6">
                                            <div className="flex items-center gap-4">
                                                <div className="w-12 h-12 bg-green-700 text-green-300 font-bold text-xl rounded-full flex items-center justify-center flex-shrink-0">
                                                    {v.name ? v.name.charAt(0).toUpperCase() : 'V'}
                                                </div>
                                                <div>
                                                    <h3 className="text-xl font-bold text-white group-hover:text-primary transition">{v.name}</h3>
                                                    <span className="text-xs font-bold text-gray-400">{v.role || (v.skills && v.skills.length > 0 ? v.skills[0] : 'General Rescue')}</span>
                                                </div>
                                            </div>
                                            <span className="px-3 py-1 bg-blue-500/20 text-blue-400 rounded-lg text-xs font-bold">
                                                {v.district || 'N/A'}
                                            </span>
                                        </div>

                                        <div className="space-y-3 text-sm text-gray-300 flex-grow">
                                            <div className="flex items-center gap-3">
                                                <MapPin className="w-4 h-4 text-gray-500" />
                                                <span className="font-medium text-gray-400">
                                                    {v.location ? `${v.location}, ${v.district}` : v.district}
                                                </span>
                                            </div>
                                            <div className="flex items-center gap-3">
                                                <Phone className="w-4 h-4 text-gray-500" />
                                                <span className="font-medium text-gray-400">{v.phone || 'N/A'}</span>
                                            </div>
                                        </div>

                                        <button
                                            onClick={() => setSelectedVolunteer(v)}
                                            className="w-full mt-6 py-2.5 bg-white/5 text-white font-bold rounded-xl hover:bg-white/10 transition border border-white/10 flex items-center justify-center"
                                        >
                                            Contact Information
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}
            </div>

            {/* Contact Modal */}
            {selectedVolunteer && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm" onClick={() => setSelectedVolunteer(null)}>
                    <div
                        className="bg-surface border border-white/10 p-6 rounded-3xl w-full max-w-md relative animate-fade-in"
                        onClick={e => e.stopPropagation()}
                    >
                        <button
                            onClick={() => setSelectedVolunteer(null)}
                            className="absolute top-4 right-4 p-2 text-gray-400 hover:text-white bg-white/5 rounded-full transition hover:bg-white/10"
                        >
                            <X className="w-5 h-5" />
                        </button>

                        <div className="flex items-center gap-4 mb-6 pt-2">
                            <div className="w-14 h-14 bg-green-700 text-green-300 font-bold text-2xl rounded-full flex items-center justify-center">
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
                                    <div className="p-2 bg-lime-500/10 rounded-lg text-lime-400"><Mail className="w-5 h-5" /></div>
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
                                            {selectedVolunteer.location ? `${selectedVolunteer.location}, ${selectedVolunteer.district}` : selectedVolunteer.district}
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

export default VolunteerSignup;
