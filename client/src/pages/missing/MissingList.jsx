import React, { useState, useEffect } from 'react';
import { Search, UserPlus } from 'lucide-react';
import { Link } from 'react-router-dom';
import { missingPersonsAPI } from '../../services/api';

const MissingList = () => {
    const [missingPersons, setMissingPersons] = useState([]);
    const [loading, setLoading] = useState(true);

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
        } catch (err) {
            console.error('Failed to update status:', err);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this missing person record?')) return;
        try {
            await missingPersonsAPI.delete(id);
            setMissingPersons(missingPersons.filter(p => p._id !== id));
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
                                <th className="p-4 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/10">
                            {missingPersons.map((item) => (
                                <tr key={item._id} className="hover:bg-white/5 transition">
                                    <td className="p-4">
                                        {item.photo ? (
                                            <img src={item.photo.startsWith('http') ? item.photo : `http://localhost:5000${item.photo}`} alt={item.name} className="w-10 h-10 rounded-full object-cover" />
                                        ) : (
                                            <div className="w-10 h-10 bg-black/40 rounded-full"></div>
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
                                    <td className="p-4 text-right flex justify-end gap-3">
                                        <button
                                            onClick={() => handleUpdateStatus(item._id)}
                                            className="text-primary text-sm font-bold hover:underline hover:text-white"
                                        >
                                            Update
                                        </button>
                                        <button
                                            onClick={() => handleDelete(item._id)}
                                            className="text-red-500 text-sm font-bold hover:underline hover:text-white"
                                        >
                                            Delete
                                        </button>
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
        </div>
    );
};

export default MissingList;
