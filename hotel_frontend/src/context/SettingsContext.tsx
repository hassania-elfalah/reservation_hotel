import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '@/lib/axios';

interface Settings {
    hotel_name: string;
    hotel_address: string;
    hotel_phone: string;
    hotel_email: string;
    social_facebook: string;
    social_instagram: string;
    social_twitter: string;
    [key: string]: string;
}

interface SettingsContextType {
    settings: Settings;
    loading: boolean;
    refreshSettings: () => Promise<void>;
}

const defaultSettings: Settings = {
    hotel_name: 'Hôtel Excellence',
    hotel_address: '123 Avenue de l’Excellence, Marrakech 40000',
    hotel_phone: '+212 5 22 00 00 00',
    hotel_email: 'contact@hotel-excellence.com',
    social_facebook: '#',
    social_instagram: '#',
    social_twitter: '#'
};

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export const SettingsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [settings, setSettings] = useState<Settings>(defaultSettings);
    const [loading, setLoading] = useState(true);

    const fetchSettings = async () => {
        try {
            const { data } = await api.get('/settings');
            if (data && Object.keys(data).length > 0) {
                setSettings(prev => ({ ...prev, ...data }));
            }
        } catch (error) {
            console.error('Error fetching settings:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchSettings();
    }, []);

    useEffect(() => {
        if (settings.hotel_name) {
            document.title = settings.hotel_name;
        }
    }, [settings.hotel_name]);

    return (
        <SettingsContext.Provider value={{ settings, loading, refreshSettings: fetchSettings }}>
            {children}
        </SettingsContext.Provider>
    );
};

export const useSettings = () => {
    const context = useContext(SettingsContext);
    if (context === undefined) {
        throw new Error('useSettings must be used within a SettingsProvider');
    }
    return context;
};
