import React, { createContext, useContext, useState, useEffect } from 'react';

interface AppearanceContextType {
    isDarkMode: boolean;
    toggleDarkMode: () => void;
    isSidebarCompact: boolean;
    toggleSidebarCompact: () => void;
}

const AppearanceContext = createContext<AppearanceContextType | undefined>(undefined);

export const AppearanceProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [isDarkMode, setIsDarkMode] = useState(() => localStorage.getItem('theme') === 'dark');
    const [isSidebarCompact, setIsSidebarCompact] = useState(() => localStorage.getItem('sidebarCompact') === 'true');

    useEffect(() => {
        const root = window.document.documentElement;
        if (isDarkMode) {
            root.classList.add('dark');
            localStorage.setItem('theme', 'dark');
        } else {
            root.classList.remove('dark');
            localStorage.setItem('theme', 'light');
        }
    }, [isDarkMode]);

    useEffect(() => {
        localStorage.setItem('sidebarCompact', String(isSidebarCompact));
    }, [isSidebarCompact]);

    const toggleDarkMode = () => setIsDarkMode(!isDarkMode);
    const toggleSidebarCompact = () => setIsSidebarCompact(!isSidebarCompact);

    return (
        <AppearanceContext.Provider value={{ isDarkMode, toggleDarkMode, isSidebarCompact, toggleSidebarCompact }}>
            {children}
        </AppearanceContext.Provider>
    );
};

export const useAppearance = () => {
    const context = useContext(AppearanceContext);
    if (context === undefined) {
        throw new Error('useAppearance must be used within an AppearanceProvider');
    }
    return context;
};
