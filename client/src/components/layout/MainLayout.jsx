import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import { Menu } from 'lucide-react';

import { useLanguage } from '../../context/LanguageContext';

const MainLayout = () => {
    const { t } = useLanguage();
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    return (
        <div className="flex min-h-screen bg-background font-sans relative">
            <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

            {/* Mobile Header */}
            <div className="lg:hidden fixed top-0 left-0 right-0 z-30 bg-background/80 backdrop-blur-md border-b border-white/10 px-4 py-3 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <button
                        onClick={() => setIsSidebarOpen(true)}
                        className="p-2 -ml-2 text-gray-400 hover:text-white rounded-lg active:bg-white/10"
                    >
                        <Menu className="w-6 h-6" />
                    </button>
                    <span className="font-bold text-white">{t('appName')}</span>
                </div>
                <div className="w-8 h-8 rounded-full bg-surface border border-white/10 overflow-hidden">
                    <img src="https://ui-avatars.com/api/?name=Admin+User" alt="User" />
                </div>
            </div>

            <main className="flex-1 lg:ml-64 p-4 lg:p-8 pt-20 lg:pt-8 overflow-y-auto w-full">
                {/* Top Header (Desktop only) */}
                <header className="hidden lg:flex justify-between items-center mb-8">
                    <div>
                        <h2 className="text-2xl font-bold text-white">{t('welcome')}</h2>
                        <p className="text-gray-400 text-sm">{t('overview')}</p>
                    </div>
                    <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-full bg-surface border border-white/10 overflow-hidden">
                            <img src="https://ui-avatars.com/api/?name=Admin+User" alt="User" />
                        </div>
                    </div>
                </header>

                {/* Mobile Welcome */}
                <div className="lg:hidden mb-6 px-2">
                    <h2 className="text-xl font-bold text-white">{t('welcome')}</h2>
                    <p className="text-gray-400 text-xs">{t('overview')}</p>
                </div>

                <div className="max-w-full overflow-hidden">
                    <Outlet />
                </div>
            </main>
        </div>
    );
};

export default MainLayout;
