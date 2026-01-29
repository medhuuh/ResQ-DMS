import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import {
    LayoutDashboard,
    Home,
    AlertTriangle,
    Map,
    Tent,
    ShieldCheck,
    Users,
    Package,
    UserX,
    HandHeart,
    BarChart3,
    Settings,
    LogOut
} from 'lucide-react';
import clsx from 'clsx';
import SettingsModal from '../common/SettingsModal';
import { useLanguage } from '../../context/LanguageContext';

import logo from '../../assets/resq-logo.png'; // Import logo

const Sidebar = ({ isOpen, onClose }) => {
    const [isSettingsOpen, setIsSettingsOpen] = useState(false);
    const { t } = useLanguage();

    const navItems = [
        { name: t('nav.dashboard'), icon: LayoutDashboard, path: '/admin/dashboard' },
        { name: t('nav.alerts'), icon: AlertTriangle, path: '/admin/alerts' },
        { name: t('nav.riskMap'), icon: Map, path: '/admin/map' },
        { name: t('nav.camps'), icon: Tent, path: '/admin/camps' },
        { name: t('nav.safeHomes'), icon: ShieldCheck, path: '/admin/safe-homes' },
        { name: t('nav.refugees'), icon: Users, path: '/admin/refugees' },
        { name: t('nav.missing'), icon: UserX, path: '/admin/missing-persons' },
    ];

    return (
        <>
            {/* Mobile Overlay */}
            {isOpen && (
                <div
                    className="fixed inset-0 bg-black/80 z-40 lg:hidden backdrop-blur-sm"
                    onClick={onClose}
                />
            )}

            <aside
                className={clsx(
                    "h-screen w-64 bg-surface text-white flex flex-col fixed left-0 top-0 z-50 transition-transform duration-300 border-r border-white/10",
                    isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
                )}
            >
                <div className="p-6 flex justify-between items-center">
                    <div>
                        <img src={logo} alt="ResQ Logo" className="h-12 w-auto mb-2" />
                        <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-neon to-primary">
                            {t('appName')}
                        </h1>
                        <p className="text-xs text-gray-400 mt-1">{t('tagline')}</p>
                    </div>
                </div>

                <nav className="flex-1 px-4 space-y-2 overflow-y-auto custom-scrollbar">
                    {navItems.map((item) => (
                        <NavLink
                            key={item.path}
                            to={item.path}
                            onClick={() => onClose && window.innerWidth < 1024 && onClose()}
                            className={({ isActive }) =>
                                clsx(
                                    "flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group",
                                    isActive
                                        ? "bg-primary text-white shadow-lg shadow-primary/20 font-bold"
                                        : "text-gray-400 hover:bg-black/20 hover:text-white"
                                )
                            }
                        >
                            <item.icon className="w-5 h-5" />
                            <span className="font-medium text-sm">{item.name}</span>
                        </NavLink>
                    ))}
                </nav>

                <div className="p-4 border-t border-white/10">
                    <button
                        onClick={() => setIsSettingsOpen(true)}
                        className="flex items-center gap-3 px-4 py-3 w-full rounded-xl text-gray-400 hover:bg-black/20 hover:text-white transition-all"
                    >
                        <Settings className="w-5 h-5" />
                        <span className="font-medium text-sm">{t('settings')}</span>
                    </button>
                </div>
            </aside>

            <SettingsModal isOpen={isSettingsOpen} onClose={() => setIsSettingsOpen(false)} />
        </>
    );
};

export default Sidebar;
