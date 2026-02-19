import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import axios from 'axios';
import api from '@/lib/axios';
import { toast } from 'sonner';

export interface User {
    id: number;
    nom: string;
    prenom: string;
    email: string;
    telephone?: string;
    role: 'admin' | 'client'; // Assuming roles based on context
    created_at: string;
    updated_at: string;
}

interface AuthContextType {
    user: User | null;
    loading: boolean;
    login: (credentials: any) => Promise<User | void>;
    register: (data: any) => Promise<User | void>;
    logout: () => void;
    refreshUser: () => Promise<void>;
    isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    const setupCsrf = async () => {
        const baseUrl = (import.meta.env.VITE_API_URL || 'http://localhost:8000/api').replace('/api', '');
        await api.get(`${baseUrl}/sanctum/csrf-cookie`);
    };

    const refreshUser = async () => {
        const token = localStorage.getItem('token');
        if (!token) {
            setLoading(false);
            return;
        }

        try {
            await setupCsrf();
            const response = await api.get('/profile');
            setUser(response.data);
        } catch (error: any) {
            // Si c'est une 401, c'est normal pour un guest, on nettoie juste
            if (error.response?.status === 401) {
                localStorage.removeItem('token');
            }
            setUser(null);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        refreshUser();
    }, []);

    const login = async (credentials: any) => {
        try {
            await setupCsrf();
            const response = await api.post('/login', credentials);
            const { token, user } = response.data;

            localStorage.setItem('token', token);
            setUser(user);
            toast.success('Connexion réussie !');
            return user;
        } catch (error: any) {
            console.error('Login error:', error);
            throw error;
        }
    };

    const register = async (data: any) => {
        try {
            await setupCsrf();
            const response = await api.post('/register', data);
            const { token, user } = response.data;

            localStorage.setItem('token', token);
            setUser(user);
            toast.success('Inscription réussie !');
            return user;
        } catch (error: any) {
            console.error('Register error:', error);
            throw error;
        }
    };

    const logout = async () => {
        try {
            await api.post('/logout');
        } catch (error) {
            console.error('Logout error (server side):', error);
        } finally {
            localStorage.removeItem('token');
            setUser(null);
            toast.info('Vous êtes déconnecté.');
            window.location.href = '/login';
        }
    };

    return (
        <AuthContext.Provider value={{
            user,
            loading,
            login,
            register,
            logout,
            refreshUser,
            isAuthenticated: !!user
        }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
