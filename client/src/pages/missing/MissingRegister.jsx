import React from 'react';
import { Upload, X, Save } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../../context/LanguageContext';

const MissingRegister = () => {
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

                <h2 className="text-2xl font-bold mb-6 text-white">{t('action.reportMissing')}</h2>

                <form className="space-y-6">
                    <div className="flex justify-center mb-6">
                        <div className="w-32 h-32 bg-black/20 rounded-full flex items-center justify-center border-2 border-dashed border-white/20 cursor-pointer hover:border-primary/50 transition">
                            <div className="text-center text-gray-500">
                                <Upload className="w-6 h-6 mx-auto mb-1" />
                                <span className="text-xs">{t('action.uploadPhoto')}</span>
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-400 mb-1">{t('name')}</label>
                            <input type="text" className="w-full px-4 py-2 bg-black/20 border border-white/10 text-white rounded-xl focus:ring-2 focus:ring-primary outline-none" placeholder={t('form.fullName')} />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-400 mb-1">{t('form.age')}</label>
                            <input type="number" className="w-full px-4 py-2 bg-black/20 border border-white/10 text-white rounded-xl focus:ring-2 focus:ring-primary outline-none" placeholder={t('form.age')} />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-400 mb-1">{t('lastSeen')}</label>
                        <input type="text" className="w-full px-4 py-2 bg-black/20 border border-white/10 text-white rounded-xl focus:ring-2 focus:ring-primary outline-none" placeholder={t('form.addressLandmark')} />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-400 mb-1">{t('missing.description')}</label>
                        <textarea className="w-full px-4 py-2 bg-black/20 border border-white/10 text-white rounded-xl focus:ring-2 focus:ring-primary outline-none" rows="2" placeholder={t('form.descPlaceholder')}></textarea>
                    </div>

                    <div className="bg-black/20 p-4 rounded-xl border border-white/10">
                        <h4 className="font-bold text-white text-sm mb-3">{t('form.informant')}</h4>
                        <div className="grid grid-cols-2 gap-4">
                            <input type="text" className="w-full px-4 py-2 bg-black/20 border border-white/10 text-white rounded-xl focus:ring-2 focus:ring-primary outline-none" placeholder={t('name')} />
                            <input type="tel" className="w-full px-4 py-2 bg-black/20 border border-white/10 text-white rounded-xl focus:ring-2 focus:ring-primary outline-none" placeholder={t('phone')} />
                        </div>
                    </div>

                    <div className="flex gap-3 pt-4">
                        <button
                            type="button"
                            onClick={() => navigate(-1)}
                            className="flex-1 py-3 bg-black/20 text-gray-300 font-bold rounded-xl hover:bg-white/10 transition border border-white/10"
                        >
                            {t('cancel')}
                        </button>
                        <button className="flex-1 py-3 bg-red-600/80 text-white font-bold rounded-xl hover:bg-red-600 transition shadow-lg shadow-red-500/20">
                            {t('action.submitReport')}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default MissingRegister;
