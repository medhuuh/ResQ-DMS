import React from 'react';
import { Plus, MapPin, Users, Phone } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../../context/LanguageContext';

const CampList = ({ isPublic = false, viewOnly = false, canEdit = false }) => {
    const { t } = useLanguage();
    const [camps, setCamps] = React.useState([
        { id: 1, name: "Govt High School Camp 1", location: "Wayanad", capacity: 200, occupied: 150, status: "Active", phone1: "+91 98765 43210", phone2: "+91 98765 43211" },
        { id: 2, name: "Govt High School Camp 2", location: "Wayanad", capacity: 300, occupied: 280, status: "Active", phone1: "+91 98765 43212", phone2: "+91 98765 43213" },
        { id: 3, name: "Govt High School Camp 3", location: "Wayanad", capacity: 150, occupied: 45, status: "Active", phone1: "+91 98765 43214", phone2: "+91 98765 43215" },
    ]);

    const [editingCamp, setEditingCamp] = React.useState(null);
    const [editForm, setEditForm] = React.useState({ occupied: 0, capacity: 0 });

    const openEditModal = (camp) => {
        setEditingCamp(camp);
        setEditForm({ occupied: camp.occupied, capacity: camp.capacity });
    };

    const handleUpdate = (e) => {
        e.preventDefault();
        setCamps(camps.map(c => c.id === editingCamp.id ? { ...c, ...editForm } : c));
        setEditingCamp(null);
    };

    const showActions = !isPublic || canEdit;

    return (
        <div className="p-4 sm:p-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                <div>
                    <h2 className="text-2xl sm:text-3xl font-bold text-white">{t('nav.camps')}</h2>
                    <p className="text-gray-400 text-sm">{t('camp.manageDesc')}</p>
                </div>
                {!viewOnly && (
                    <Link to="new" className="w-full sm:w-auto px-4 py-2 bg-primary text-white font-bold rounded-xl flex items-center justify-center gap-2 hover:bg-lime-700 transition shadow-lg shadow-lime-500/30 text-sm">
                        <Plus className="w-5 h-5" /> {isPublic ? t('action.requestCamp') : t('action.addCamp')}
                    </Link>
                )}
            </div>

            <div className="bg-surface rounded-2xl shadow-sm border border-white/10 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse min-w-[700px]">
                        <thead>
                            <tr className="bg-black/20 border-b border-white/10 text-[10px] sm:text-xs text-gray-400 uppercase tracking-wider">
                                <th className="p-4 font-medium">{t('name')}</th>
                                <th className="p-4 font-medium">{t('location')}</th>
                                <th className="p-4 font-medium">{t('phone')}</th>
                                <th className="p-4 font-medium">{t('capacity')}</th>
                                <th className="p-4 font-medium">{t('status')}</th>
                                {showActions && <th className="p-4 font-medium text-right">{t('actions')}</th>}
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/10">
                            {camps.map((camp) => (
                                <tr key={camp.id} className="hover:bg-white/5 transition">
                                    <td className="p-4 font-medium text-white text-sm sm:text-base">{camp.name}</td>
                                    <td className="p-4 text-gray-400 text-sm flex items-center gap-1 mt-2 sm:mt-0"><MapPin className="w-4 h-4" /> {camp.location}</td>
                                    <td className="p-4">
                                        <div className="flex flex-col gap-1 text-[10px] sm:text-sm text-gray-400">
                                            <div className="flex items-center gap-1"><Phone className="w-3 h-3" /> {camp.phone1}</div>
                                            <div className="flex items-center gap-1"><Phone className="w-3 h-3" /> {camp.phone2}</div>
                                        </div>
                                    </td>
                                    <td className="p-4">
                                        <div className="flex items-center gap-2">
                                            <div className="w-16 sm:w-24 h-1.5 sm:h-2 bg-black/40 rounded-full overflow-hidden">
                                                <div
                                                    className={`h-full ${camp.occupied / camp.capacity > 0.9 ? 'bg-red-500' : 'bg-primary'} transition-all duration-500`}
                                                    style={{ width: `${(camp.occupied / camp.capacity) * 100}%` }}
                                                ></div>
                                            </div>
                                            <span className="text-[10px] sm:text-xs font-bold text-gray-300">{Math.round((camp.occupied / camp.capacity) * 100)}%</span>
                                        </div>
                                        <p className="text-[10px] sm:text-xs text-gray-400 mt-1">{camp.occupied} / {camp.capacity} {t('occupied')}</p>
                                    </td>
                                    <td className="p-4">
                                        <span className="px-2 py-0.5 bg-green-500/20 text-green-400 border border-green-500/30 text-[10px] font-bold rounded-lg">{camp.status}</span>
                                    </td>
                                    {showActions && (
                                        <td className="p-4 text-right">
                                            <button
                                                onClick={() => openEditModal(camp)}
                                                className="text-primary font-bold text-sm hover:underline hover:text-white"
                                            >
                                                {t('manage')}
                                            </button>
                                        </td>
                                    )}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Edit Modal */}
            {editingCamp && (
                <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-surface rounded-2xl border border-white/10 p-6 w-full max-w-md shadow-2xl">
                        <h3 className="text-xl font-bold text-white mb-4">{t('camp.editCapacity')}: {editingCamp.name}</h3>
                        <form onSubmit={handleUpdate} className="space-y-4">
                            <div>
                                <label className="block text-sm text-gray-400 mb-1">{t('capacity.total')}</label>
                                <input
                                    type="number"
                                    className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-2 text-white focus:outline-none focus:border-primary"
                                    value={editForm.capacity}
                                    onChange={e => setEditForm({ ...editForm, capacity: parseInt(e.target.value) })}
                                />
                            </div>
                            <div>
                                <label className="block text-sm text-gray-400 mb-1">{t('capacity.occupied')}</label>
                                <input
                                    type="number"
                                    className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-2 text-white focus:outline-none focus:border-primary"
                                    value={editForm.occupied}
                                    onChange={e => setEditForm({ ...editForm, occupied: parseInt(e.target.value) })}
                                />
                            </div>
                            <div className="flex gap-3 pt-2">
                                <button type="button" onClick={() => setEditingCamp(null)} className="flex-1 py-2 rounded-xl border border-white/10 text-gray-300 font-bold hover:bg-white/5">{t('cancel')}</button>
                                <button type="submit" className="flex-1 py-2 rounded-xl bg-primary text-black font-bold hover:bg-lime-400">{t('submit')}</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CampList;
