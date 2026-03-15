import React, { useState } from 'react';
import { Upload, X, Save } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../../context/LanguageContext';
import { missingPersonsAPI } from '../../services/api';

const MissingRegister = () => {
    const navigate = useNavigate();
    const { t } = useLanguage();
    const [saving, setSaving] = useState(false);
    const [photo, setPhoto] = useState(null);
    const [photoPreview, setPhotoPreview] = useState(null);
    const [formData, setFormData] = useState({
        name: '',
        age: '',
        dateMissing: '',
        lastSeenLocation: '',
        description: '',
        informantName: '',
        informantPhone: ''
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handlePhotoChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setPhoto(file);
            setPhotoPreview(URL.createObjectURL(file));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);
        try {
            const data = new FormData();
            Object.entries(formData).forEach(([key, val]) => {
                if (val) data.append(key, val);
            });
            if (photo) data.append('photo', photo);

            await missingPersonsAPI.report(data);
            navigate(-1);
        } catch (err) {
            console.error('Failed to report missing person:', err);
            alert(err.response?.data?.message || 'Failed to submit report');
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="p-4 sm:p-6">
            <div className="max-w-2xl mx-auto bg-surface rounded-2xl shadow-sm border border-white/10 p-5 sm:p-8 relative">
                <button onClick={() => navigate(-1)} className="absolute top-4 right-4 p-2 bg-black/20 text-gray-400 hover:text-white rounded-lg hover:bg-white/10 transition">
                    <X className="w-5 h-5" />
                </button>

                <h2 className="text-xl sm:text-2xl font-bold mb-6 text-white">{t('action.reportMissing')}</h2>

                <form className="space-y-6" onSubmit={handleSubmit}>
                    <div className="flex justify-center mb-6">
                        <label className="w-24 h-24 sm:w-32 sm:h-32 bg-black/20 rounded-full flex items-center justify-center border-2 border-dashed border-white/20 cursor-pointer hover:border-primary/50 transition overflow-hidden">
                            {photoPreview ? (
                                <img src={photoPreview} alt="Preview" className="w-full h-full object-cover rounded-full" />
                            ) : (
                                <div className="text-center text-gray-500 p-2">
                                    <Upload className="w-5 h-5 sm:w-6 sm:h-6 mx-auto mb-1" />
                                    <span className="text-[10px] sm:text-xs">{t('action.uploadPhoto')}</span>
                                </div>
                            )}
                            <input type="file" accept="image/*" onChange={handlePhotoChange} className="hidden" />
                        </label>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs sm:text-sm font-medium text-gray-400 mb-1">{t('name')}</label>
                            <input type="text" name="name" value={formData.name} onChange={handleChange} className="w-full px-4 py-2 bg-black/20 border border-white/10 text-white rounded-xl focus:ring-2 focus:ring-primary outline-none text-sm" placeholder={t('form.fullName')} required />
                        </div>
                        <div>
                            <label className="block text-xs sm:text-sm font-medium text-gray-400 mb-1">{t('form.age')}</label>
                            <input type="number" name="age" value={formData.age} onChange={handleChange} className="w-full px-4 py-2 bg-black/20 border border-white/10 text-white rounded-xl focus:ring-2 focus:ring-primary outline-none text-sm" placeholder={t('form.age')} />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs sm:text-sm font-medium text-gray-400 mb-1">{t('lastSeen')}</label>
                            <input type="text" name="lastSeenLocation" value={formData.lastSeenLocation} onChange={handleChange} className="w-full px-4 py-2 bg-black/20 border border-white/10 text-white rounded-xl focus:ring-2 focus:ring-primary outline-none text-sm" placeholder={t('form.addressLandmark')} required />
                        </div>
                        <div>
                            <label className="block text-xs sm:text-sm font-medium text-gray-400 mb-1">Date Went Missing</label>
                            <input type="date" name="dateMissing" value={formData.dateMissing} onChange={handleChange} max={new Date().toISOString().split('T')[0]} className="w-full px-4 py-2 bg-black/20 border border-white/10 text-white rounded-xl focus:ring-2 focus:ring-primary outline-none text-sm" />
                        </div>
                    </div>
                    <div>
                        <label className="block text-xs sm:text-sm font-medium text-gray-400 mb-1">{t('missing.description')}</label>
                        <textarea name="description" value={formData.description} onChange={handleChange} className="w-full px-4 py-2 bg-black/20 border border-white/10 text-white rounded-xl focus:ring-2 focus:ring-primary outline-none text-sm" rows="3" placeholder={t('form.descPlaceholder')}></textarea>
                    </div>

                    <div className="bg-black/20 p-4 rounded-xl border border-white/10">
                        <h4 className="font-bold text-white text-xs sm:text-sm mb-3">{t('form.informant')}</h4>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <input type="text" name="informantName" value={formData.informantName} onChange={handleChange} className="w-full px-4 py-2 bg-black/20 border border-white/10 text-white rounded-xl focus:ring-2 focus:ring-primary outline-none text-sm" placeholder={t('name')} />
                            <input type="tel" name="informantPhone" value={formData.informantPhone} onChange={handleChange}
                                inputMode="numeric"
                                pattern="[0-9+\s\-]{7,15}"
                                title="Phone number should contain only digits"
                                className="w-full px-4 py-2 bg-black/20 border border-white/10 text-white rounded-xl focus:ring-2 focus:ring-primary outline-none text-sm" placeholder={t('phone')} />
                        </div>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-3 pt-4">
                        <button type="button" onClick={() => navigate(-1)} className="w-full sm:flex-1 py-3 bg-black/20 text-gray-300 font-bold rounded-xl hover:bg-white/10 transition border border-white/10 text-sm">
                            {t('cancel')}
                        </button>
                        <button type="submit" disabled={saving} className="w-full sm:flex-1 py-3 bg-red-600/80 text-white font-bold rounded-xl hover:bg-red-600 transition shadow-lg shadow-red-500/20 text-sm disabled:opacity-50">
                            {saving ? 'Submitting...' : t('action.submitReport')}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default MissingRegister;
