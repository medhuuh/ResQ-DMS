import React from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../../context/LanguageContext';

const LandingPage = () => {
    const { t } = useLanguage();

    return (
        <div className="min-h-screen bg-background">


            <main className="pt-4 sm:pt-10 pb-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
                <div className="text-center py-10 sm:py-20">
                    <h1 className="text-3xl sm:text-5xl font-extrabold text-white mb-6 leading-tight">
                        {t('hero.title')} <br />
                        <span className="text-primary">{t('tagline')}</span>
                    </h1>
                    <p className="text-base sm:text-xl text-gray-400 max-w-2xl mx-auto mb-10">
                        {t('hero.subtitle')}
                    </p>
                    <div className="flex flex-col sm:flex-row justify-center gap-4">
                        <Link to="/live-status" className="w-full sm:w-auto px-8 py-3 bg-primary text-white rounded-xl font-bold hover:bg-lime-700 transition shadow-lg shadow-lime-500/30 text-center">
                            {t('hero.cta')}
                        </Link>
                        <Link to="/login" className="w-full sm:w-auto px-8 py-3 bg-gray-900 text-white rounded-xl font-bold hover:bg-gray-800 transition text-center">
                            {t('staffLogin')}
                        </Link>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default LandingPage;
