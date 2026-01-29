import React, { useState } from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { ShieldAlert, Menu, X, User, Settings } from 'lucide-react';
import SettingsModal from '../common/SettingsModal';
import { useLanguage } from '../../context/LanguageContext';

import logo from '../../assets/resq-logo.png'; // Import logo

const VolunteerLayout = () => {
    const [isMenuOpen, setIsMenuOpen] = React.useState(false);
    const [isSettingsOpen, setIsSettingsOpen] = useState(false);
    const { t } = useLanguage();
    const location = useLocation();

    // Full navigation for Volunteers
    const navItems = [
        { name: t('nav.directory'), path: '/volunteer' },
        { name: t('nav.alerts'), path: '/volunteer/alerts' },
        { name: t('nav.riskMap'), path: '/volunteer/map' },
        { name: t('nav.camps'), path: '/volunteer/camps' },
        { name: t('nav.safeHomes'), path: '/volunteer/safe-homes' },
        { name: t('nav.missing'), path: '/volunteer/missing' },
    ];

    const isActive = (path) => location.pathname === path;

    return (
        <div className="min-h-screen bg-background font-sans text-text-main">
            <nav className="fixed top-0 left-0 w-full z-50 bg-background/90 backdrop-blur-md border-b border-border-color">
                <div className="max-w-7xl mx-auto px-6 h-20 flex justify-between items-center">
                    <Link to="/volunteer" className="flex items-center gap-3">
                        <img src={logo} alt="ResQ Logo" className="h-10 w-auto" />
                        <div>
                            <h1 className="text-xl font-bold tracking-tight text-text-main">ResQ <span className="text-neon">{t('role.volunteer')}</span></h1>
                            <p className="text-[10px] text-text-muted uppercase tracking-widest">Field Operations</p>
                        </div>
                    </Link>

                    {/* Desktop Menu */}
                    <div className="hidden lg:flex items-center gap-6">
                        {navItems.map((item) => (
                            <Link
                                key={item.path}
                                to={item.path}
                                className={`text-sm font-medium transition-colors ${isActive(item.path) ? 'text-neon' : 'text-text-muted hover:text-text-main'
                                    }`}
                            >
                                {item.name}
                            </Link>
                        ))}
                    </div>

                    <div className="hidden lg:flex items-center gap-4">
                        <div className="flex items-center gap-2 px-4 py-2 bg-surface/50 rounded-full border border-border-color">
                            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                            <span className="text-xs font-bold text-green-400">{t('active')}</span>
                        </div>
                        <button
                            onClick={() => setIsSettingsOpen(true)}
                            className="w-10 h-10 rounded-full bg-surface border border-border-color flex items-center justify-center hover:bg-white/10 transition text-text-muted hover:text-text-main"
                        >
                            <Settings className="w-5 h-5" />
                        </button>
                    </div>

                    {/* Mobile Toggle */}
                    <button className="lg:hidden text-text-main" onClick={() => setIsMenuOpen(!isMenuOpen)}>
                        {isMenuOpen ? <X /> : <Menu />}
                    </button>
                </div>
            </nav >

            {/* Mobile Menu Overlay */}
            {
                isMenuOpen && (
                    <div className="fixed inset-0 z-40 bg-background pt-24 px-6 lg:hidden">
                        <div className="flex flex-col gap-6">
                            {navItems.map((item) => (
                                <Link
                                    key={item.path}
                                    to={item.path}
                                    onClick={() => setIsMenuOpen(false)}
                                    className="text-lg font-medium text-text-muted hover:text-neon"
                                >
                                    {item.name}
                                </Link>
                            ))}
                            <hr className="border-border-color" />
                            <button
                                onClick={() => { setIsSettingsOpen(true); setIsMenuOpen(false); }}
                                className="w-full py-3 bg-surface border border-border-color text-text-main font-bold rounded-xl flex items-center justify-center gap-2"
                            >
                                <Settings className="w-5 h-5" /> {t('settings')}
                            </button>
                        </div>
                    </div>
                )
            }

            <SettingsModal isOpen={isSettingsOpen} onClose={() => setIsSettingsOpen(false)} />

            <div className="pt-20">
                <Outlet />
            </div>
        </div >
    );
};

export default VolunteerLayout;
