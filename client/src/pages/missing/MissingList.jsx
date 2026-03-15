import React, { useState, useEffect } from 'react';
import { Search, UserPlus, X, MapPin, Phone, User, AlertCircle, Calendar } from 'lucide-react';
import { Link } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { missingPersonsAPI } from '../../services/api';

const MissingList = () => {
    const [missingPersons, setMissingPersons] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedPerson, setSelectedPerson] = useState(null);

    useEffect(() => {
        fetchMissingPersons();
    }, []);

    const fetchMissingPersons = async () => {
        try {
            const res = await missingPersonsAPI.getAll();
            setMissingPersons(res.data.data);
        } catch (err) {
            console.error('Failed to fetch missing persons:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleUpdateStatus = async (id) => {
        const person = missingPersons.find(p => p._id === id);
        if (!person) return;
        const newStatus = person.status === 'Missing' ? 'Found' : 'Missing';

        try {
            await missingPersonsAPI.update(id, { status: newStatus });
            setMissingPersons(missingPersons.map(p => p._id === id ? { ...p, status: newStatus } : p));
            if (selectedPerson && selectedPerson._id === id) {
                setSelectedPerson({ ...selectedPerson, status: newStatus });
            }
        } catch (err) {
            console.error('Failed to update status:', err);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this missing person record?')) return;
        try {
            await missingPersonsAPI.delete(id);
            setMissingPersons(missingPersons.filter(p => p._id !== id));
            if (selectedPerson && selectedPerson._id === id) setSelectedPerson(null);
        } catch (err) {
            console.error('Failed to delete missing person:', err);
            alert('Failed to delete missing person');
        }
    };

    if (loading) {
        return <div className="p-6 flex justify-center py-20"><div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div></div>;
    }

    return (
        <div className="p-4 sm:p-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                <div>
                    <h2 className="text-xl sm:text-3xl font-bold text-white">Missing Persons Database</h2>
                    <p className="text-gray-400 text-sm">Official registry of reported missing individuals</p>
                </div>
                <Link to="new" className="w-full sm:w-auto px-4 py-2 bg-red-600 text-white font-bold rounded-xl flex items-center justify-center gap-2 hover:bg-red-700 transition shadow-lg shadow-red-500/30">
                    <UserPlus className="w-5 h-5" /> Report Missing
                </Link>
            </div>

            <div className="bg-surface rounded-2xl shadow-sm border border-white/10 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left min-w-[600px]">
                        <thead className="bg-black/20 text-xs text-gray-400 uppercase">
                            <tr>
                                <th className="p-4">Photo</th>
                                <th className="p-4">Name</th>
                                <th className="p-4">Last Seen</th>
                                <th className="p-4">Status</th>
                                <th className="p-4">Contact</th>
                                <th className="p-4">Date Missing</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/10">
                            {missingPersons.map((item) => (
                                <tr key={item._id} className="hover:bg-white/5 transition cursor-pointer" onClick={() => setSelectedPerson(item)}>
                                    <td className="p-4" onClick={e => e.stopPropagation()}>
                                        {item.photo ? (
                                            <img
                                                src={item.photo.startsWith('http') ? item.photo : `http://localhost:5000${item.photo}`}
                                                alt={item.name}
                                                className="w-10 h-10 rounded-full object-cover"
                                            />
                                        ) : (
                                            <div className="w-10 h-10 bg-black/40 rounded-full flex items-center justify-center">
                                                <User className="w-5 h-5 text-gray-500" />
                                            </div>
                                        )}
                                    </td>
                                    <td className="p-4 font-bold text-white">{item.name}</td>
                                    <td className="p-4 text-gray-400 text-sm">{item.lastSeenLocation}</td>
                                    <td className="p-4">
                                        <span className={`px-2 py-1 text-[10px] font-bold rounded border ${item.status === 'Missing'
                                            ? 'bg-red-900/40 text-red-500 border-red-500/30'
                                            : 'bg-green-500/20 text-green-400 border-green-500/30'
                                            }`}>
                                            {item.status}
                                        </span>
                                    </td>
                                    <td className="p-4 text-sm text-gray-400">
                                        <p>{item.informantName}: {item.informantPhone}</p>
                                    </td>
                                    <td className="p-4 text-sm text-gray-400">
                                        {item.dateMissing
                                            ? new Date(item.dateMissing).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })
                                            : <span className="text-gray-600 italic text-xs">Not recorded</span>}
                                    </td>
                                </tr>
                            ))}
                            {missingPersons.length === 0 && (
                                <tr><td colSpan="6" className="p-8 text-center text-gray-500">No missing person records</td></tr>
                            )}
                        </tbody>
                    </table>
                </div>
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
                            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                        />
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
                                    {/* Photo */}
                                    <div className="w-24 h-24 bg-black/20 rounded-2xl flex items-center justify-center flex-shrink-0 overflow-hidden">
                                        {selectedPerson.photo ? (
                                            <img
                                                src={selectedPerson.photo.startsWith('http') ? selectedPerson.photo : `http://localhost:5000${selectedPerson.photo}`}
                                                alt={selectedPerson.name}
                                                className="w-full h-full object-cover"
                                            />
                                        ) : (
                                            <User className="w-10 h-10 text-gray-500" />
                                        )}
                                    </div>

                                    <div className="w-full">
                                        <h2 className="text-2xl font-bold text-white">{selectedPerson.name}</h2>
                                        <p className="text-gray-400">{selectedPerson.age ? `${selectedPerson.age} Years` : 'Age unknown'}</p>

                                        {/* Status + Update buttons */}
                                        <div className="flex flex-wrap justify-center sm:justify-start gap-2 mt-3">
                                            <button
                                                onClick={() => handleUpdateStatus(selectedPerson._id)}
                                                className={`px-3 py-1 rounded-lg text-xs font-bold border transition ${selectedPerson.status === 'Found' ? 'bg-primary text-black border-primary' : 'bg-transparent text-gray-400 border-gray-600 hover:border-primary hover:text-primary'}`}
                                            >
                                                Mark Found
                                            </button>
                                            <button
                                                onClick={() => handleUpdateStatus(selectedPerson._id)}
                                                className={`px-3 py-1 rounded-lg text-xs font-bold border transition ${selectedPerson.status === 'Missing' ? 'bg-red-500 text-white border-red-500' : 'bg-transparent text-gray-400 border-gray-600 hover:border-red-500 hover:text-red-500'}`}
                                            >
                                                Mark Missing
                                            </button>
                                            <button
                                                onClick={() => { handleDelete(selectedPerson._id); }}
                                                className="px-3 py-1 rounded-lg text-xs font-bold border border-gray-600 text-red-400 hover:bg-red-500/10 transition"
                                            >
                                                Delete
                                            </button>
                                        </div>
                                    </div>
                                </div>

                                <div className="mt-6 space-y-4">
                                    <div className="bg-black/20 p-4 rounded-xl flex items-start gap-4 border border-white/5">
                                        <MapPin className="w-5 h-5 text-primary mt-0.5" />
                                        <div>
                                            <p className="text-sm text-gray-400 font-medium">Last Seen Location</p>
                                            <p className="text-white font-medium">{selectedPerson.lastSeenLocation || 'N/A'}</p>
                                        </div>
                                    </div>

                                    <div className="bg-black/20 p-4 rounded-xl flex items-start gap-4 border border-white/5">
                                        <Calendar className="w-5 h-5 text-primary mt-0.5" />
                                        <div>
                                            <p className="text-sm text-gray-400 font-medium">Date Went Missing</p>
                                            <p className="text-white font-medium">
                                                {selectedPerson.dateMissing
                                                    ? new Date(selectedPerson.dateMissing).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })
                                                    : 'Not recorded'}
                                            </p>
                                        </div>
                                    </div>

                                    {selectedPerson.description && (
                                        <div className="bg-black/20 p-4 rounded-xl border border-white/5">
                                            <p className="text-sm text-gray-400 font-medium mb-1">Description</p>
                                            <p className="text-gray-200">{selectedPerson.description}</p>
                                        </div>
                                    )}

                                    <div className="border-t border-white/10 pt-4 mt-4">
                                        <p className="text-sm text-gray-400 font-medium mb-2">Informant Contact</p>
                                        <div className="flex flex-col gap-1">
                                            <div className="flex items-center gap-2 text-primary font-bold text-lg">
                                                <Phone className="w-5 h-5" /> {selectedPerson.informantName || 'N/A'}
                                            </div>
                                            {selectedPerson.informantPhone && (
                                                <p className="text-gray-400 text-sm">{selectedPerson.informantPhone}</p>
                                            )}
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

export default MissingList;
