import React from 'react';
import VolunteerForm from '../volunteer/VolunteerForm';

const VolunteerSignup = () => {
    const [showForm, setShowForm] = React.useState(false);
    const [districtFilter, setDistrictFilter] = React.useState('All');

    const volunteers = [
        { id: 1, name: "Arjun Narayan", district: "Wayanad", phone: "+91 98765 12345", location: "Meppadi", role: "Medical" },
        { id: 2, name: "Fatima Hameed", district: "Kozhikode", phone: "+91 99887 66554", location: "Vilangad", role: "Rescue" },
        { id: 3, name: "John Mathew", district: "Malappuram", phone: "+91 88776 54321", location: "Nilambur", role: "Logistics" },
        { id: 4, name: "Sreejith K", district: "Wayanad", phone: "+91 77665 43210", location: "Chooralmala", role: "General" },
        { id: 5, name: "Deepa Thomas", district: "Kannur", phone: "+91 66554 32109", location: "Iritty", role: "Medical" },
        { id: 6, name: "Rahul Krishna", district: "Wayanad", phone: "+91 98765 00000", location: "Kalpetta", role: "Rescue" },
    ];

    const districts = ['All', 'Wayanad', 'Kozhikode', 'Malappuram', 'Kannur'];

    const filteredVolunteers = districtFilter === 'All'
        ? volunteers
        : volunteers.filter(v => v.district === districtFilter);

    return (
        <div className="pt-24 min-h-screen bg-background pb-12 px-6">
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
                    <div className="animate-fade-in">
                        <button
                            onClick={() => setShowForm(false)}
                            className="mb-6 text-gray-400 hover:text-white flex items-center gap-2"
                        >
                            ← Back to Directory
                        </button>
                        <div className="max-w-4xl mx-auto bg-surface p-8 rounded-3xl border border-white/10">
                            <h2 className="text-2xl font-bold text-white mb-6 text-center">Register as Volunteer</h2>
                            <VolunteerForm />
                        </div>
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

                        {/* List */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {filteredVolunteers.map(v => (
                                <div key={v.id} className="bg-surface p-6 rounded-2xl border border-white/5 hover:border-primary/30 transition group">
                                    <div className="flex justify-between items-start mb-4">
                                        <div>
                                            <h3 className="text-xl font-bold text-white group-hover:text-primary transition">{v.name}</h3>
                                            <span className="text-xs font-bold text-gray-500 uppercase tracking-widest">{v.role}</span>
                                        </div>
                                        <span className={`px-3 py-1 rounded-lg text-xs font-bold ${v.district === 'Wayanad' ? 'bg-red-500/20 text-red-400' : 'bg-blue-500/20 text-blue-400'
                                            }`}>
                                            {v.district}
                                        </span>
                                    </div>

                                    <div className="space-y-2 text-sm text-gray-300">
                                        <div className="flex items-center gap-2">
                                            <span className="w-20 text-gray-500">Location:</span>
                                            <span className="font-medium">{v.location}</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <span className="w-20 text-gray-500">Phone:</span>
                                            <span className="font-medium text-white">{v.phone}</span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {filteredVolunteers.length === 0 && (
                            <div className="text-center py-20">
                                <p className="text-gray-500">No volunteers found in this district.</p>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default VolunteerSignup;
