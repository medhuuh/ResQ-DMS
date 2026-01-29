import React from 'react';
import { UserPlus, Save, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../../context/LanguageContext';

const VolunteerForm = () => {
    const navigate = useNavigate();
    const { t } = useLanguage();

    return (
        <div className="p-6">
            <div className="max-w-2xl mx-auto bg-surface rounded-2xl shadow-sm border border-white/10 p-8 relative">
                <button
                    onClick={() => navigate(-1)}
                    className="absolute top-4 right-4 p-2 bg-black/20 text-gray-400 hover:text-white rounded-lg hover:bg-white/10 transition"
                >
                    <X className="w-5 h-5" />
                </button>

                <h2 className="text-2xl font-bold mb-6 text-white">{t('action.registerVolunteer')}</h2>

                <form className="space-y-6">
                    <div className="flex justify-center mb-6">
                        <div className="w-24 h-24 bg-black/20 rounded-full flex items-center justify-center border-2 border-dashed border-white/20 cursor-pointer hover:border-primary/50 transition">
                            <span className="text-xs text-gray-400">{t('form.photo')}</span>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-1">{t('form.fullName')}</label>
                            <input type="text" className="w-full px-4 py-2 bg-black/20 border border-white/10 text-white rounded-xl focus:ring-2 focus:ring-primary outline-none" placeholder={t('form.fullName')} />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-1">{t('form.age')}</label>
                            <input type="number" className="w-full px-4 py-2 bg-black/20 border border-white/10 text-white rounded-xl focus:ring-2 focus:ring-primary outline-none" placeholder={t('form.age')} />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-1">{t('phone')}</label>
                            <input type="tel" className="w-full px-4 py-2 bg-black/20 border border-white/10 text-white rounded-xl focus:ring-2 focus:ring-primary outline-none" placeholder="+91..." />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-1">{t('form.bloodGroup')}</label>
                            <select className="w-full px-4 py-2 bg-black/20 border border-white/10 text-white rounded-xl focus:ring-2 focus:ring-primary outline-none">
                                <option className="bg-gray-800">O+</option>
                                <option className="bg-gray-800">A+</option>
                                <option className="bg-gray-800">B+</option>
                                <option className="bg-gray-800">AB+</option>
                            </select>
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-1">{t('form.expertise')}</label>
                        <select className="w-full px-4 py-2 bg-black/20 border border-white/10 text-white rounded-xl focus:ring-2 focus:ring-primary outline-none">
                            <option className="bg-gray-800">General Rescue</option>
                            <option className="bg-gray-800">Medical Aid</option>
                            <option className="bg-gray-800">Logistics & Supply</option>
                            <option className="bg-gray-800">Counselling</option>
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-1">{t('form.location')}</label>
                        <select className="w-full px-4 py-2 bg-black/20 border border-white/10 text-white rounded-xl focus:ring-2 focus:ring-primary outline-none">
                            <option className="bg-gray-800">Wayanad (North)</option>
                            <option className="bg-gray-800">Wayanad (South)</option>
                            <option className="bg-gray-800">Anywhere in Kerala</option>
                        </select>
                    </div>

                    <div className="flex gap-3 pt-4">
                        <button
                            type="button"
                            onClick={() => navigate(-1)}
                            className="flex-1 py-3 bg-black/20 text-gray-300 font-bold rounded-xl hover:bg-white/10 transition border border-white/10"
                        >
                            {t('cancel')}
                        </button>
                        <button className="flex-1 py-3 bg-neon text-black font-bold rounded-xl hover:bg-primary transition shadow-lg shadow-neon/20 flex items-center justify-center gap-2">
                            <UserPlus className="w-5 h-5" /> {t('action.registerVolunteer')}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default VolunteerForm;
