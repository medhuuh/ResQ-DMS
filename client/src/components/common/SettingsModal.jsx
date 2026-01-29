import React from 'react';
import { X, Moon, Sun, Languages, LogOut, UserCircle } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { useLanguage } from '../../context/LanguageContext';
import { useLocation, useNavigate } from 'react-router-dom';

const SettingsModal = ({ isOpen, onClose }) => {
    const { theme, toggleTheme } = useTheme();
    const { language, toggleLanguage, t } = useLanguage();
    const navigate = useNavigate();
    const location = useLocation();

    const [loginRole, setLoginRole] = React.useState(null); // 'admin' | 'volunteer' | null
    const [email, setEmail] = React.useState('');
    const [password, setPassword] = React.useState('');

    if (!isOpen) return null;

    const handleLogout = () => {
        // Clear anything if needed
        navigate('/login');
        onClose();
    };

    const handleLoginSubmit = (e) => {
        e.preventDefault();
        // In a real app, validate credentials here based on loginRole
        if (loginRole === 'admin') {
            navigate('/admin/dashboard');
        } else if (loginRole === 'volunteer') {
            navigate('/volunteer');
        }
        setLoginRole(null);
        onClose();
    };

    const renderLoginForm = () => (
        <form onSubmit={handleLoginSubmit} className="space-y-4">
            <div>
                <label className={`block text-sm font-medium mb-1 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                    Email ({loginRole === 'admin' ? 'Admin' : 'Volunteer'})
                </label>
                <input
                    type="email"
                    required
                    className={`w-full p-3 rounded-xl border outline-none focus:ring-2 focus:ring-indigo-500 transition ${theme === 'dark' ? 'bg-black/20 border-white/10 text-white' : 'bg-gray-50 border-gray-200 text-gray-900'}`}
                    placeholder="name@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />
            </div>
            <div>
                <label className={`block text-sm font-medium mb-1 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                    Password
                </label>
                <input
                    type="password"
                    required
                    className={`w-full p-3 rounded-xl border outline-none focus:ring-2 focus:ring-indigo-500 transition ${theme === 'dark' ? 'bg-black/20 border-white/10 text-white' : 'bg-gray-50 border-gray-200 text-gray-900'}`}
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
            </div>
            <div className="flex gap-3 pt-2">
                <button
                    type="button"
                    onClick={() => setLoginRole(null)}
                    className={`flex-1 py-3 rounded-xl font-bold border transition ${theme === 'dark' ? 'border-white/10 text-gray-300 hover:bg-white/5' : 'border-gray-200 text-gray-600 hover:bg-gray-50'}`}
                >
                    Back
                </button>
                <button
                    type="submit"
                    className="flex-1 py-3 rounded-xl font-bold bg-indigo-600 text-white hover:bg-indigo-700 transition shadow-lg shadow-indigo-500/20"
                >
                    Login
                </button>
            </div>
        </form>
    );

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
            <div className={`w-full max-w-md rounded-3xl p-6 relative shadow-2xl border ${theme === 'dark' ? 'bg-[#1e1e1e] border-white/10' : 'bg-white border-gray-200'}`}>

                {/* Header */}
                <div className="flex justify-between items-center mb-8">
                    <div>
                        <h2 className={`text-2xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                            {loginRole ? 'Login Required' : t('settings')}
                        </h2>
                        <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                            {loginRole ? `Please login as ${loginRole}` : `${t('appName')} Preferences`}
                        </p>
                    </div>
                    <button
                        onClick={onClose}
                        className={`p-2 rounded-full transition-colors ${theme === 'dark' ? 'hover:bg-white/10 text-gray-400' : 'hover:bg-gray-100 text-gray-500'}`}
                    >
                        <X className="w-6 h-6" />
                    </button>
                </div>

                {loginRole ? renderLoginForm() : (
                    <>
                        {/* Grid Options */}
                        <div className="grid grid-cols-2 gap-4">
                            {/* Theme Toggle */}
                            <button
                                onClick={toggleTheme}
                                className={`p-4 rounded-2xl flex flex-col items-center justify-center gap-3 transition-all border ${theme === 'dark'
                                    ? 'bg-white/5 border-white/10 hover:bg-white/10 text-white'
                                    : 'bg-gray-50 border-gray-200 hover:bg-gray-100 text-gray-900'
                                    }`}
                            >
                                <div className={`p-3 rounded-full ${theme === 'dark' ? 'bg-indigo-500/20 text-indigo-400' : 'bg-indigo-100 text-indigo-600'}`}>
                                    {theme === 'dark' ? <Moon className="w-6 h-6" /> : <Sun className="w-6 h-6" />}
                                </div>
                                <span className="font-medium">{theme === 'dark' ? t('mode.dark') : t('mode.light')}</span>
                            </button>

                            {/* Language Toggle */}
                            <button
                                onClick={toggleLanguage}
                                className={`p-4 rounded-2xl flex flex-col items-center justify-center gap-3 transition-all border ${theme === 'dark'
                                    ? 'bg-white/5 border-white/10 hover:bg-white/10 text-white'
                                    : 'bg-gray-50 border-gray-200 hover:bg-gray-100 text-gray-900'
                                    }`}
                            >
                                <div className={`p-3 rounded-full ${theme === 'dark' ? 'bg-pink-500/20 text-pink-400' : 'bg-pink-100 text-pink-600'}`}>
                                    <Languages className="w-6 h-6" />
                                </div>
                                <span className="font-medium">{language === 'en' ? t('lang.english') : t('lang.malayalam')}</span>
                            </button>

                            {/* Dynamic Role / Navigation Options */}
                            {location.pathname.startsWith('/admin') ? (
                                <>
                                    {/* Admin View Options */}
                                    <button
                                        onClick={() => setLoginRole('volunteer')}
                                        className={`p-4 rounded-2xl flex flex-col items-center justify-center gap-3 transition-all border ${theme === 'dark' ? 'bg-white/5 border-white/10 hover:bg-white/10 text-white' : 'bg-gray-50 border-gray-200 hover:bg-gray-100 text-gray-900'}`}
                                    >
                                        <div className={`p-3 rounded-full ${theme === 'dark' ? 'bg-orange-500/20 text-orange-400' : 'bg-orange-100 text-orange-600'}`}>
                                            <UserCircle className="w-6 h-6" />
                                        </div>
                                        <span className="font-medium text-center text-sm">{t('role.volunteer')} Login</span>
                                    </button>
                                    <button
                                        onClick={() => { navigate('/'); onClose(); }}
                                        className={`p-4 rounded-2xl flex flex-col items-center justify-center gap-3 transition-all border ${theme === 'dark' ? 'bg-white/5 border-white/10 hover:bg-white/10 text-white' : 'bg-gray-50 border-gray-200 hover:bg-gray-100 text-gray-900'}`}
                                    >
                                        <div className={`p-3 rounded-full ${theme === 'dark' ? 'bg-green-500/20 text-green-400' : 'bg-green-100 text-green-600'}`}>
                                            <UserCircle className="w-6 h-6" />
                                        </div>
                                        <span className="font-medium text-center text-sm">{t('role.public')} Page</span>
                                    </button>
                                </>
                            ) : location.pathname.startsWith('/volunteer') ? (
                                <>
                                    {/* Volunteer View Options */}
                                    <button
                                        onClick={() => setLoginRole('admin')}
                                        className={`p-4 rounded-2xl flex flex-col items-center justify-center gap-3 transition-all border ${theme === 'dark' ? 'bg-white/5 border-white/10 hover:bg-white/10 text-white' : 'bg-gray-50 border-gray-200 hover:bg-gray-100 text-gray-900'}`}
                                    >
                                        <div className={`p-3 rounded-full ${theme === 'dark' ? 'bg-purple-500/20 text-purple-400' : 'bg-purple-100 text-purple-600'}`}>
                                            <UserCircle className="w-6 h-6" />
                                        </div>
                                        <span className="font-medium text-center text-sm">{t('role.admin')} Login</span>
                                    </button>
                                    <button
                                        onClick={() => { navigate('/'); onClose(); }}
                                        className={`p-4 rounded-2xl flex flex-col items-center justify-center gap-3 transition-all border ${theme === 'dark' ? 'bg-white/5 border-white/10 hover:bg-white/10 text-white' : 'bg-gray-50 border-gray-200 hover:bg-gray-100 text-gray-900'}`}
                                    >
                                        <div className={`p-3 rounded-full ${theme === 'dark' ? 'bg-green-500/20 text-green-400' : 'bg-green-100 text-green-600'}`}>
                                            <UserCircle className="w-6 h-6" />
                                        </div>
                                        <span className="font-medium text-center text-sm">{t('role.public')} Page</span>
                                    </button>
                                </>
                            ) : (
                                <>
                                    {/* Public View Options */}
                                    <button
                                        onClick={() => setLoginRole('volunteer')}
                                        className={`p-4 rounded-2xl flex flex-col items-center justify-center gap-3 transition-all border ${theme === 'dark' ? 'bg-white/5 border-white/10 hover:bg-white/10 text-white' : 'bg-gray-50 border-gray-200 hover:bg-gray-100 text-gray-900'}`}
                                    >
                                        <div className={`p-3 rounded-full ${theme === 'dark' ? 'bg-orange-500/20 text-orange-400' : 'bg-orange-100 text-orange-600'}`}>
                                            <UserCircle className="w-6 h-6" />
                                        </div>
                                        <span className="font-medium text-center text-sm">{t('role.volunteer')} Login</span>
                                    </button>
                                    <button
                                        onClick={() => setLoginRole('admin')}
                                        className={`p-4 rounded-2xl flex flex-col items-center justify-center gap-3 transition-all border ${theme === 'dark' ? 'bg-white/5 border-white/10 hover:bg-white/10 text-white' : 'bg-gray-50 border-gray-200 hover:bg-gray-100 text-gray-900'}`}
                                    >
                                        <div className={`p-3 rounded-full ${theme === 'dark' ? 'bg-purple-500/20 text-purple-400' : 'bg-purple-100 text-purple-600'}`}>
                                            <UserCircle className="w-6 h-6" />
                                        </div>
                                        <span className="font-medium text-center text-sm">{t('role.admin')} Login</span>
                                    </button>
                                </>
                            )}

                            {/* Logout - Always visible */}
                            <button
                                onClick={handleLogout}
                                className={`p-4 rounded-2xl flex flex-col items-center justify-center gap-3 transition-all border ${theme === 'dark'
                                    ? 'bg-red-500/10 border-red-500/20 hover:bg-red-500/20 text-red-400'
                                    : 'bg-red-50 border-red-200 hover:bg-red-100 text-red-600'
                                    }`}
                            >
                                <div className={`p-3 rounded-full ${theme === 'dark' ? 'bg-red-500/20' : 'bg-red-100'}`}>
                                    <LogOut className="w-6 h-6" />
                                </div>
                                <span className="font-medium">{t('logout')}</span>
                            </button>
                        </div>

                        <div className={`mt-8 text-center text-xs ${theme === 'dark' ? 'text-gray-500' : 'text-gray-400'}`}>
                            v1.0.0 &copy; 2026 ResQ-DMS
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default SettingsModal;
