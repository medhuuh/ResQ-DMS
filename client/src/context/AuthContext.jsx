import React, { createContext, useContext, useState, useEffect } from 'react';
import { authAPI } from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(localStorage.getItem('token'));
    const [loading, setLoading] = useState(true);

    // On mount, check if we have a stored token and load user
    useEffect(() => {
        const loadUser = async () => {
            if (token) {
                try {
                    const res = await authAPI.getMe();
                    setUser(res.data.data);
                } catch (err) {
                    console.error('Failed to load user:', err);
                    localStorage.removeItem('token');
                    localStorage.removeItem('user');
                    setToken(null);
                    setUser(null);
                }
            }
            setLoading(false);
        };
        loadUser();
    }, [token]);

    const login = async (email, password, role) => {
        try {
            const res = await authAPI.login({ email, password, role });
            const { token: newToken, data } = res.data;
            localStorage.setItem('token', newToken);
            localStorage.setItem('user', JSON.stringify(data));
            setToken(newToken);
            setUser(data);
            return { success: true, data };
        } catch (err) {
            const message = err.response?.data?.message || 'Login failed';
            return { success: false, message };
        }
    };

    const register = async (formData) => {
        try {
            const res = await authAPI.register(formData);
            const { token: newToken, data } = res.data;
            localStorage.setItem('token', newToken);
            localStorage.setItem('user', JSON.stringify(data));
            setToken(newToken);
            setUser(data);
            return { success: true, data };
        } catch (err) {
            const message = err.response?.data?.message || 'Registration failed';
            return { success: false, message };
        }
    };

    const logout = async () => {
        try {
            await authAPI.logout();
        } catch {
            // Ignore errors
        }
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setToken(null);
        setUser(null);
    };

    const updateProfile = async (data) => {
        try {
            const res = await authAPI.updateProfile(data);
            setUser(res.data.data);
            localStorage.setItem('user', JSON.stringify(res.data.data));
            return { success: true, data: res.data.data };
        } catch (err) {
            const message = err.response?.data?.message || 'Update failed';
            return { success: false, message };
        }
    };

    return (
        <AuthContext.Provider value={{
            user,
            token,
            loading,
            isAuthenticated: !!user,
            login,
            register,
            logout,
            updateProfile
        }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
