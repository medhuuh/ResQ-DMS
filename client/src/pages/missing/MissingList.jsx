import React, { useState } from 'react';
import { Search, UserPlus } from 'lucide-react';
import { Link } from 'react-router-dom';

const MissingList = () => {
    const [missingPersons, setMissingPersons] = useState([
        { id: 1, name: "Jane Doe 1", location: "Town Hall, Wayanad", status: "Missing", contact: "Brother: +91 987..." },
        { id: 2, name: "Jane Doe 2", location: "Town Hall, Wayanad", status: "Found", contact: "Brother: +91 987..." },
        { id: 3, name: "Jane Doe 3", location: "Town Hall, Wayanad", status: "Missing", contact: "Brother: +91 987..." },
    ]);

    const handleUpdateStatus = (id) => {
        setMissingPersons(missingPersons.map(person => {
            if (person.id === id) {
                const newStatus = person.status === 'Missing' ? 'Found' : 'Missing';
                return { ...person, status: newStatus };
            }
            return person;
        }));
    };

    return (
        <div className="p-4 sm:p-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                <div>
                    <h2 className="text-xl sm:text-3xl font-bold text-white">Missing Persons Database</h2>
                    <p className="text-gray-400 text-sm">Official registry of reported missing individuals</p>
                </div>
                <Link to="/admin/missing-persons/new" className="w-full sm:w-auto px-4 py-2 bg-red-600 text-white font-bold rounded-xl flex items-center justify-center gap-2 hover:bg-red-700 transition shadow-lg shadow-red-500/30">
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
                                <tr key={item.id} className="hover:bg-white/5 transition">
                                    <td className="p-4">
                                        <div className="w-10 h-10 bg-black/40 rounded-full"></div>
                                    </td>
                                    <td className="p-4 font-bold text-white">{item.name}</td>
                                    <td className="p-4 text-gray-400 text-sm">{item.location}</td>
                                    <td className="p-4">
                                        <span className={`px-2 py-1 text-[10px] font-bold rounded border ${item.status === 'Missing'
                                                ? 'bg-red-900/40 text-red-500 border-red-500/30'
                                                : 'bg-green-500/20 text-green-400 border-green-500/30'
                                            }`}>
                                            {item.status}
                                        </span>
                                    </td>
                                    <td className="p-4 text-sm text-gray-400">
                                        <p>{item.contact}</p>
                                    </td>
                                    <td className="p-4 text-right">
                                        <button
                                            onClick={() => handleUpdateStatus(item.id)}
                                            className="text-primary text-sm font-bold hover:underline hover:text-white"
                                        >
                                            Update
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default MissingList;
