import React, { useState } from 'react';
import { Search, Filter, MoreHorizontal } from 'lucide-react';
import { Link } from 'react-router-dom';

const RefugeeList = () => {
    const [refugees, setRefugees] = useState([
        { id: 1, name: "Refugee Name 1", age: 34, gender: "M", district: "Wayanad", camp: "Camp Alpha", status: "Safe" },
        { id: 2, name: "Refugee Name 2", age: 28, gender: "F", district: "Idukki", camp: "Camp Alpha", status: "Medical Needs" },
        { id: 3, name: "Refugee Name 3", age: 45, gender: "M", district: "Ernakulam", camp: "Camp Beta", status: "Safe" },
    ]);

    const cycleStatus = (id) => {
        setRefugees(refugees.map(r => {
            if (r.id === id) {
                const statuses = ['Safe', 'Medical Needs', 'Transferred'];
                const nextIndex = (statuses.indexOf(r.status) + 1) % statuses.length;
                return { ...r, status: statuses[nextIndex] };
            }
            return r;
        }));
    };

    return (
        <div className="p-6">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h2 className="text-3xl font-bold text-white">Refugee Directory</h2>
                    <p className="text-gray-400">Search and manage registered refugees</p>
                </div>
                <Link to="/admin/refugees/register" className="px-4 py-2 bg-primary text-white font-bold rounded-xl hover:bg-lime-700 transition shadow-lg shadow-lime-500/30">
                    Register New
                </Link>
            </div>

            <div className="bg-surface p-4 rounded-2xl shadow-sm border border-white/10 mb-6 flex gap-4">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input type="text" placeholder="Search by name, ID, or district..." className="w-full pl-10 pr-4 py-2 bg-black/20 border border-white/10 rounded-xl focus:ring-2 focus:ring-primary text-white placeholder-gray-500 outline-none" />
                </div>
                <button className="px-4 py-2 border border-white/10 text-gray-300 rounded-xl flex items-center gap-2 hover:bg-black/20">
                    <Filter className="w-4 h-4" /> Filter
                </button>
            </div>

            <div className="bg-surface rounded-2xl shadow-sm border border-white/10 overflow-hidden">
                <table className="w-full text-left">
                    <thead className="bg-black/20 text-xs text-gray-400 uppercase">
                        <tr>
                            <th className="p-4">Name</th>
                            <th className="p-4">Age / Gender</th>
                            <th className="p-4">District</th>
                            <th className="p-4">Assigned Location</th>
                            <th className="p-4">Status</th>
                            <th className="p-4">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                        {refugees.map((item) => (
                            <tr key={item.id} className="hover:bg-white/5 transition">
                                <td className="p-4 font-bold text-white">{item.name}</td>
                                <td className="p-4 text-gray-400">{item.age} / {item.gender}</td>
                                <td className="p-4 text-gray-400">{item.district}</td>
                                <td className="p-4 text-primary font-medium">{item.camp}</td>
                                <td className="p-4">
                                    <span className={`px-2 py-1 text-xs font-bold rounded border ${item.status === 'Safe' ? 'bg-green-500/20 text-green-400 border-green-500/30' :
                                            item.status === 'Medical Needs' ? 'bg-red-500/20 text-red-400 border-red-500/30' :
                                                'bg-blue-500/20 text-blue-400 border-blue-500/30'
                                        }`}>
                                        {item.status}
                                    </span>
                                </td>
                                <td className="p-4 text-gray-500 cursor-pointer hover:text-white">
                                    <button
                                        onClick={() => cycleStatus(item.id)}
                                        className="text-primary text-sm font-bold hover:underline"
                                    >
                                        Update Status
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default RefugeeList;
