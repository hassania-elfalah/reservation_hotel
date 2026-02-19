import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { useSettings } from '@/context/SettingsContext';

interface DoorModalProps {
    isOpen: boolean;
    onClose: () => void;
    children: React.ReactNode;
    title?: string;
}

const DoorModal: React.FC<DoorModalProps> = ({ isOpen, onClose, children, title }) => {
    const { settings } = useSettings();
    const logoSrc = settings.logo_url.startsWith('/') && !settings.logo_url.startsWith('/storage')
        ? settings.logo_url
        : `${(import.meta.env.VITE_API_URL || 'http://localhost:8000/api').replace('/api', '')}${settings.logo_url}`;

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-black/90 backdrop-blur-md"
                    />

                    {/* Modal Container */}
                    <div className="relative w-full max-w-5xl h-[85vh] perspective-2000">

                        {/* THE DOORS */}
                        <div className="absolute inset-0 z-[110] flex pointer-events-none">
                            {/* Left Door */}
                            <motion.div
                                initial={{ rotateY: 0 }}
                                animate={{ rotateY: -105 }}
                                exit={{ rotateY: 0 }}
                                transition={{ duration: 1.5, ease: [0.4, 0, 0.2, 1], delay: 0.5 }}
                                style={{ transformOrigin: 'left center' }}
                                className="w-1/2 h-full bg-[#1A1108] border-r border-[#D4A017]/30 shadow-2xl flex items-center justify-end relative overflow-hidden pointer-events-auto"
                            >
                                <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/wood-pattern.png')] grayscale" />
                                <div className="absolute inset-8 border border-[#D4A017]/10 rounded-sm" />
                                <div className="absolute right-0 top-1/2 -translate-y-1/2 w-2 h-40 bg-[#D4A017] rounded-l-full shadow-[0_0_30px_rgba(212,160,23,0.3)] z-20" />

                                {/* Half Logo Left */}
                                <div className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 w-[600px] h-[600px] opacity-40 pointer-events-none z-10">
                                    <img src={logoSrc} alt="" className="h-full w-full object-contain invert" />
                                </div>
                            </motion.div>

                            {/* Right Door */}
                            <motion.div
                                initial={{ rotateY: 0 }}
                                animate={{ rotateY: 105 }}
                                exit={{ rotateY: 0 }}
                                transition={{ duration: 1.5, ease: [0.4, 0, 0.2, 1], delay: 0.5 }}
                                style={{ transformOrigin: 'right center' }}
                                className="w-1/2 h-full bg-[#1A1108] border-l border-[#D4A017]/30 shadow-2xl flex items-center justify-start relative overflow-hidden pointer-events-auto"
                            >
                                <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/wood-pattern.png')] grayscale" />
                                <div className="absolute inset-8 border border-[#D4A017]/10 rounded-sm" />
                                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-2 h-40 bg-[#D4A017] rounded-r-full shadow-[0_0_30px_rgba(212,160,23,0.3)] z-20" />

                                {/* Half Logo Right */}
                                <div className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1/2 w-[600px] h-[600px] opacity-40 pointer-events-none z-10">
                                    <img src={logoSrc} alt="" className="h-full w-full object-contain invert" />
                                </div>
                            </motion.div>
                        </div>

                        {/* CONTENT AREA */}
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            transition={{ delay: 1, duration: 0.8 }}
                            className="absolute inset-0 bg-background rounded-sm shadow-inner overflow-hidden flex flex-col z-[105]"
                        >
                            {/* Header */}
                            <div className="p-6 border-b flex justify-between items-center bg-card">
                                <div>
                                    <h2 className="text-2xl font-bold font-display tracking-tight">{title || "Finaliser votre réservation"}</h2>
                                    <p className="text-sm text-muted-foreground">Veuillez remplir les informations ci-dessous</p>
                                </div>
                                <button
                                    onClick={onClose}
                                    className="p-2 hover:bg-muted rounded-full transition-colors"
                                >
                                    <X size={24} />
                                </button>
                            </div>

                            {/* Body */}
                            <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
                                {children}
                            </div>
                        </motion.div>
                    </div>
                </div>
            )}
        </AnimatePresence>
    );
};

export default DoorModal;
