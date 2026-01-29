import React from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../../context/LanguageContext';

const LandingPage = () => {
    const { t } = useLanguage();

    return (
        <div className="min-h-screen bg-background">


            <main className="pt-10 pb-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
                <div className="text-center py-20">
                    <h1 className="text-5xl font-extrabold text-white mb-6">
                        {t('hero.title')} <br />
                        <span className="text-primary">{t('tagline')}</span>
                    </h1>
                    <p className="text-xl text-gray-400 max-w-2xl mx-auto mb-10">
                        {t('hero.subtitle')}
                    </p>
                    <div className="flex justify-center gap-4">
                        <Link to="/live-status" className="px-8 py-3 bg-primary text-white rounded-xl font-bold hover:bg-lime-700 transition shadow-lg shadow-lime-500/30">
                            {t('hero.cta')}
                        </Link>
                        <Link to="/login" className="px-8 py-3 bg-gray-900 text-white rounded-xl font-bold hover:bg-gray-800 transition">
                            {t('staffLogin')}
                        </Link>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default LandingPage;
