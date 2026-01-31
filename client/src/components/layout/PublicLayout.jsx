import React, { useState } from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { ShieldAlert, Menu, X, Settings } from 'lucide-react';
import SettingsModal from '../common/SettingsModal';
import { useLanguage } from '../../context/LanguageContext';

import logo from '../../assets/resq-logo.png'; // Import logo

const PublicLayout = () => {
    const [isMenuOpen, setIsMenuOpen] = React.useState(false);
    const [isSettingsOpen, setIsSettingsOpen] = useState(false);
    const { t } = useLanguage();
    const location = useLocation();

    const navItems = [
        { name: t('nav.home'), path: '/' },
        { name: t('nav.alerts'), path: '/alerts' },
        { name: t('nav.riskMap'), path: '/map' },
        { name: t('nav.shelters'), path: '/shelters' },
        { name: t('nav.missing'), path: '/missing-public' },
        { name: t('nav.volunteers'), path: '/volunteer-signup' },
    ];

    const isActive = (path) => location.pathname === path;

    return (
        <div className="min-h-screen bg-background font-sans text-text-main transition-colors duration-300">
            <nav className="fixed top-0 left-0 w-full z-50 bg-background/80 backdrop-blur-md border-b border-border-color transition-colors duration-300">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 sm:h-20 flex justify-between items-center">
                    <Link to="/" className="flex items-center gap-2 sm:gap-3">
                        <img src={logo} alt="ResQ Logo" className="h-8 sm:h-10 w-auto" />
                        <div>
                            <h1 className="text-lg sm:text-xl font-bold tracking-tight text-text-main leading-none">{t('appName')}</h1>
                            <p className="text-[8px] sm:text-[10px] text-text-muted uppercase tracking-widest mt-1">{t('tagline')}</p>
                        </div>
                    </Link>

                    {/* Desktop Menu */}
                    <div className="hidden lg:flex items-center gap-6">
                        {navItems.map((item) => (
                            <Link
                                key={item.path}
                                to={item.path}
                                className={`text-sm font-medium transition-colors ${isActive(item.path) ? 'text-primary' : 'text-text-muted hover:text-text-main'
                                    }`}
                            >
                                {item.name}
                            </Link>
                        ))}
                    </div>

                    <div className="hidden lg:flex items-center gap-4">
                        <Link to="/donate" className="px-5 py-2 bg-gradient-to-r from-green-500 to-emerald-600 text-white font-bold rounded-lg hover:shadow-lg hover:shadow-green-500/20 transition text-sm">
                            {t('donate')}
                        </Link>
                        <button
                            onClick={() => setIsSettingsOpen(true)}
                            className="p-2 bg-surface border border-border-color rounded-lg text-text-muted hover:text-primary transition"
                        >
                            <Settings className="w-5 h-5" />
                        </button>
                    </div>

                    {/* Mobile Toggle */}
                    <button className="lg:hidden p-2 text-text-main hover:bg-surface rounded-lg transition-colors" onClick={() => setIsMenuOpen(!isMenuOpen)}>
                        {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
                    </button>
                </div>
            </nav>

            {/* Mobile Menu Overlay */}
            {isMenuOpen && (
                <div className="fixed inset-0 z-40 bg-background pt-24 px-6 lg:hidden">
                    <div className="flex flex-col gap-6">
                        {navItems.map((item) => (
                            <Link
                                key={item.path}
                                to={item.path}
                                onClick={() => setIsMenuOpen(false)}
                                className="text-lg font-medium text-text-muted hover:text-primary"
                            >
                                {item.name}
                            </Link>
                        ))}
                        <hr className="border-border-color" />
                        <Link to="/donate" className="w-full py-3 bg-green-600 text-white text-center font-bold rounded-xl">{t('donate')}</Link>
                        <button
                            onClick={() => { setIsSettingsOpen(true); setIsMenuOpen(false); }}
                            className="w-full py-3 bg-surface border border-border-color text-text-main font-bold rounded-xl flex items-center justify-center gap-2"
                        >
                            <Settings className="w-5 h-5" /> {t('settings')}
                        </button>
                    </div>
                </div>
            )}

            <SettingsModal isOpen={isSettingsOpen} onClose={() => setIsSettingsOpen(false)} />

            <div className="pt-20">
                <Outlet />
            </div>
        </div>
    );
};

export default PublicLayout;
