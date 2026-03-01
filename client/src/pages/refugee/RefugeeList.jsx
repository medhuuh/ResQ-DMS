import React, { useState, useEffect } from 'react';
import { Search, Filter, MoreHorizontal } from 'lucide-react';
import { Link } from 'react-router-dom';
import { refugeesAPI } from '../../services/api';

const RefugeeList = () => {
    const [refugees, setRefugees] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        fetchRefugees();
    }, []);

    const fetchRefugees = async (search = '') => {
        try {
            const params = search ? { search } : {};
            const res = await refugeesAPI.getAll(params);
            setRefugees(res.data.data);
        } catch (err) {
            console.error('Failed to fetch refugees:', err);
        } finally {
            setLoading(false);
        }
    };

    const cycleStatus = async (id) => {
        const refugee = refugees.find(r => r._id === id);
        if (!refugee) return;
        const statuses = ['Safe', 'Medical Needs', 'Transferred'];
        const nextIndex = (statuses.indexOf(refugee.status) + 1) % statuses.length;
        const newStatus = statuses[nextIndex];

        try {
            await refugeesAPI.update(id, { status: newStatus });
            setRefugees(refugees.map(r => r._id === id ? { ...r, status: newStatus } : r));
        } catch (err) {
            console.error('Failed to update status:', err);
        }
    };

    const handleSearch = (e) => {
        const value = e.target.value;
        setSearchTerm(value);
        // Debounce search
        clearTimeout(window._refugeeSearchTimer);
        window._refugeeSearchTimer = setTimeout(() => fetchRefugees(value), 300);
    };

    if (loading) {
        return <div className="p-6 flex justify-center py-20"><div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div></div>;
    }

    return (
        <div className="p-4 sm:p-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                <div>
                    <h2 className="text-2xl sm:text-3xl font-bold text-white">Refugee Directory</h2>
                    <p className="text-gray-400 text-sm">Search and manage registered refugees</p>
                </div>
                <Link to="/admin/refugees/register" className="w-full sm:w-auto px-4 py-2 bg-primary text-white font-bold rounded-xl hover:bg-lime-700 transition shadow-lg shadow-lime-500/30 text-center text-sm">
                    Register New
                </Link>
            </div>

            <div className="bg-surface p-3 sm:p-4 rounded-2xl shadow-sm border border-white/10 mb-6 flex flex-col sm:flex-row gap-3 sm:gap-4">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4 sm:w-5 sm:h-5" />
                    <input type="text" placeholder="Search by name, ID, or district..." value={searchTerm} onChange={handleSearch} className="w-full pl-9 sm:pl-10 pr-4 py-2 bg-black/20 border border-white/10 rounded-xl focus:ring-2 focus:ring-primary text-white placeholder-gray-500 outline-none text-sm" />
                </div>
            </div>

            <div className="bg-surface rounded-2xl shadow-sm border border-white/10 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left min-w-[700px]">
                        <thead className="bg-black/20 text-[10px] sm:text-xs text-gray-400 uppercase">
                            <tr>
                                <th className="p-4">Name</th>
                                <th className="p-4">Age / Gender</th>
                                <th className="p-4">District</th>
                                <th className="p-4">Assigned Location</th>
                                <th className="p-4">Status</th>
                                <th className="p-4 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {refugees.map((item) => (
                                <tr key={item._id} className="hover:bg-white/5 transition">
                                    <td className="p-4 font-bold text-white text-sm sm:text-base">{item.fullName}</td>
                                    <td className="p-4 text-gray-400 text-sm">{item.age} / {item.gender?.charAt(0)}</td>
                                    <td className="p-4 text-gray-400 text-sm">{item.district}</td>
                                    <td className="p-4 text-primary font-medium text-sm">{item.assignedCamp?.name || item.assignedSafeHome?.ownerName || 'Unassigned'}</td>
                                    <td className="p-4 text-sm">
                                        <span className={`px-2 py-0.5 text-[10px] font-bold rounded border ${item.status === 'Safe' ? 'bg-green-500/20 text-green-400 border-green-500/30' :
                                            item.status === 'Medical Needs' ? 'bg-red-500/20 text-red-400 border-red-500/30' :
                                                'bg-blue-500/20 text-blue-400 border-blue-500/30'
                                            }`}>
                                            {item.status}
                                        </span>
                                    </td>
                                    <td className="p-4 text-right">
                                        <button
                                            onClick={() => cycleStatus(item._id)}
                                            className="text-primary text-xs sm:text-sm font-bold hover:underline"
                                        >
                                            Update
                                        </button>
                                    </td>
                                </tr>
                            ))}
                            {refugees.length === 0 && (
                                <tr><td colSpan="6" className="p-8 text-center text-gray-500">No refugees found</td></tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default RefugeeList;
