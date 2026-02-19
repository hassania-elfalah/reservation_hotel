import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, X, Send, Bot, User, Sparkles, Mic } from 'lucide-react';
import api from '@/lib/axios';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useSettings } from '@/context/SettingsContext';
import { useAppearance } from '@/context/AppearanceContext';

interface Message {
    id: string;
    text: string;
    sender: 'bot' | 'user';
    timestamp: Date;
}

const Chatbot: React.FC = () => {
    const { settings } = useSettings();
    const { isDarkMode } = useAppearance();
    const [isOpen, setIsOpen] = useState(false);
    const [isClosing, setIsClosing] = useState(false);
    const [messages, setMessages] = useState<Message[]>([
        {
            id: '1',
            text: 'Salam! 👋 Je suis votre concierge virtuel. Comment puis-je vous aider ?',
            sender: 'bot',
            timestamp: new Date(),
        },
    ]);
    const [inputValue, setInputValue] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const scrollRef = useRef<HTMLDivElement>(null);

    const logoSrc = settings.logo_url.startsWith('/') && !settings.logo_url.startsWith('/storage')
        ? settings.logo_url
        : `${(import.meta.env.VITE_API_URL || 'http://localhost:8000/api').replace('/api', '')}${settings.logo_url}`;

    const quickReplies = [
        { text: 'Horaires du petit-déjeuner ?', icon: '🥐' },
        { text: 'Parking disponible ?', icon: '🚗' },
        { text: 'Wi-Fi gratuit ?', icon: '📶' },
        { text: 'Heure de check-in ?', icon: '🏨' },
    ];

    const handleClose = () => {
        setIsClosing(true);
        setTimeout(() => {
            setIsOpen(false);
            setIsClosing(false);
        }, 2000); // wait for door close animation to complete
    };

    const [isRecording, setIsRecording] = useState(false);
    const recognitionRef = useRef<any>(null);

    useEffect(() => {
        const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
        if (SpeechRecognition) {
            recognitionRef.current = new SpeechRecognition();
            recognitionRef.current.continuous = false;
            recognitionRef.current.interimResults = false;
            recognitionRef.current.lang = 'fr-FR'; // Default to French, can also handle Darija if recognized as Arabic

            recognitionRef.current.onresult = (event: any) => {
                const transcript = event.results[0][0].transcript;
                setInputValue(transcript);
                setIsRecording(false);
            };

            recognitionRef.current.onerror = (event: any) => {
                console.error('Speech recognition error:', event.error);
                setIsRecording(false);
            };

            recognitionRef.current.onend = () => {
                setIsRecording(false);
            };
        }
    }, []);

    const toggleRecording = () => {
        if (isRecording) {
            recognitionRef.current?.stop();
        } else {
            setInputValue('');
            recognitionRef.current?.start();
            setIsRecording(true);
        }
    };

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTo({
                top: scrollRef.current.scrollHeight,
                behavior: 'smooth',
            });
        }
    }, [messages]);

    const handleSend = async (text: string = inputValue) => {
        if (!text.trim() || isLoading) return;

        const userMessage: Message = {
            id: Date.now().toString(),
            text,
            sender: 'user',
            timestamp: new Date(),
        };

        const updatedMessages = [...messages, userMessage];
        setMessages(updatedMessages);
        setInputValue('');
        setIsLoading(true);

        // Build history for the AI (exclude the initial welcome message)
        const history = updatedMessages
            .filter(m => m.id !== '1')
            .map(m => ({ role: m.sender === 'user' ? 'user' : 'assistant', content: m.text }));

        try {
            const response = await api.post('/chatbot', { message: text, history });

            const botMessage: Message = {
                id: (Date.now() + 1).toString(),
                text: response.data.response,
                sender: 'bot',
                timestamp: new Date(),
            };

            setTimeout(() => {
                setMessages((prev) => [...prev, botMessage]);
                setIsLoading(false);
            }, 400);
        } catch (error) {
            console.error('Chatbot error:', error);
            const errorMessage: Message = {
                id: (Date.now() + 1).toString(),
                text: "Dsl, wa9e3 chi mouchkil f l-ittissal. 😕 Merci de réessayer plus tard.",
                sender: 'bot',
                timestamp: new Date(),
            };
            setMessages((prev) => [...prev, errorMessage]);
            setIsLoading(false);
        }
    };

    return (
        <div className="fixed bottom-6 left-6 z-[9999] perspective-1000">
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 50, scale: 0.8, rotateX: 10 }}
                        animate={{ opacity: 1, y: 0, scale: 1, rotateX: 0 }}
                        exit={{ opacity: 0, y: 50, scale: 0.8, rotateX: 10 }}
                        transition={{ duration: 0.5, ease: "easeOut" }}
                        className="mb-4 w-[300px] sm:w-[340px] h-[450px] bg-background/95 backdrop-blur-2xl border border-border shadow-[0_15px_50px_rgba(0,0,0,0.3)] rounded-2xl overflow-hidden flex flex-col relative z-20"
                    >
                        {/* Door Opening Animation Overlay */}
                        <AnimatePresence>
                            <motion.div
                                initial={{ opacity: 1 }}
                                animate={{ opacity: 0 }}
                                transition={{ delay: 2.2, duration: 0.8 }}
                                className="absolute inset-0 z-[100] flex pointer-events-none"
                            >
                                {/* Left Door */}
                                <motion.div
                                    initial={{ rotateY: 0 }}
                                    animate={{ rotateY: -95 }}
                                    transition={{ duration: 2.0, ease: [0.4, 0, 0.2, 1], delay: 0.2 }}
                                    style={{ transformOrigin: 'left center' }}
                                    className="w-1/2 h-full bg-[#1A1108] border-r border-[#D4A017]/30 flex items-center justify-end relative overflow-hidden"
                                >
                                    <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/wood-pattern.png')] grayscale" />
                                    <div className="absolute right-0 top-1/2 -translate-y-1/2 w-0.5 h-16 bg-[#D4A017] rounded-l-full shadow-[0_0_15px_rgba(212,160,23,0.3)]" />
                                    <div className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 w-[250px] h-[250px] opacity-40">
                                        <img src={logoSrc} alt="" className="h-full w-full object-contain invert" />
                                    </div>
                                </motion.div>

                                {/* Right Door */}
                                <motion.div
                                    initial={{ rotateY: 0 }}
                                    animate={{ rotateY: 95 }}
                                    transition={{ duration: 2.0, ease: [0.4, 0, 0.2, 1], delay: 0.2 }}
                                    style={{ transformOrigin: 'right center' }}
                                    className="w-1/2 h-full bg-[#1A1108] border-l border-[#D4A017]/30 flex items-center justify-start relative overflow-hidden"
                                >
                                    <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/wood-pattern.png')] grayscale" />
                                    <div className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-16 bg-[#D4A017] rounded-r-full shadow-[0_0_15px_rgba(212,160,23,0.3)]" />
                                    <div className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1/2 w-[250px] h-[250px] opacity-40">
                                        <img src={logoSrc} alt="" className="h-full w-full object-contain invert" />
                                    </div>
                                </motion.div>
                            </motion.div>
                        </AnimatePresence>

                        {/* Door CLOSING Animation Overlay */}
                        <AnimatePresence>
                            {isClosing && (
                                <motion.div
                                    key="closing-doors"
                                    initial={{ opacity: 1 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    className="absolute inset-0 z-[100] flex"
                                >
                                    {/* Left Door Closing */}
                                    <motion.div
                                        initial={{ rotateY: -95 }}
                                        animate={{ rotateY: 0 }}
                                        transition={{ duration: 1.6, ease: [0.4, 0, 0.2, 1], delay: 0.1 }}
                                        style={{ transformOrigin: 'left center' }}
                                        className="w-1/2 h-full bg-[#1A1108] border-r border-[#D4A017]/30 flex items-center justify-end relative overflow-hidden"
                                    >
                                        <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/wood-pattern.png')] grayscale" />
                                        <div className="absolute right-0 top-1/2 -translate-y-1/2 w-0.5 h-16 bg-[#D4A017] rounded-l-full shadow-[0_0_15px_rgba(212,160,23,0.3)]" />
                                        <div className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 w-[250px] h-[250px] opacity-40">
                                            <img src={logoSrc} alt="" className="h-full w-full object-contain invert" />
                                        </div>
                                    </motion.div>

                                    {/* Right Door Closing */}
                                    <motion.div
                                        initial={{ rotateY: 95 }}
                                        animate={{ rotateY: 0 }}
                                        transition={{ duration: 1.6, ease: [0.4, 0, 0.2, 1], delay: 0.1 }}
                                        style={{ transformOrigin: 'right center' }}
                                        className="w-1/2 h-full bg-[#1A1108] border-l border-[#D4A017]/30 flex items-center justify-start relative overflow-hidden"
                                    >
                                        <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/wood-pattern.png')] grayscale" />
                                        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-16 bg-[#D4A017] rounded-r-full shadow-[0_0_15px_rgba(212,160,23,0.3)]" />
                                        <div className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1/2 w-[250px] h-[250px] opacity-40">
                                            <img src={logoSrc} alt="" className="h-full w-full object-contain invert" />
                                        </div>
                                    </motion.div>
                                </motion.div>
                            )}
                        </AnimatePresence>

                        {/* Chat Header */}
                        <div className="p-4 bg-gradient-to-r from-primary to-primary/80 text-primary-foreground flex items-center justify-between shadow-md">
                            <div className="flex items-center gap-2">
                                <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center backdrop-blur-md border border-white/30">
                                    <Bot size={18} className="text-white" />
                                </div>
                                <div>
                                    <h3 className="font-bold text-xs tracking-tight">{settings.hotel_name || 'Concierge IA'}</h3>
                                    <div className="flex items-center gap-1.5 text-[9px] opacity-90">
                                        <span className="w-1 h-1 bg-green-400 rounded-full animate-pulse shadow-[0_0_5px_rgba(74,222,128,0.5)]" />
                                        <span className="uppercase tracking-widest font-medium">Assistant</span>
                                    </div>
                                </div>
                            </div>
                            <button
                                onClick={handleClose}
                                disabled={isClosing}
                                className="hover:bg-white/20 p-1.5 rounded-lg transition-all active:scale-90 disabled:opacity-50"
                                aria-label="Fermer"
                            >
                                <X size={16} />
                            </button>
                        </div>

                        {/* Messages Area */}
                        <ScrollArea className="flex-1 p-4 bg-card/50 relative" ref={scrollRef}>
                            {/* Background Logo */}
                            <div className="absolute inset-0 flex items-center justify-center opacity-[0.12] pointer-events-none select-none">
                                <img src={logoSrc} alt="" className="w-1/2 h-auto object-contain grayscale" />
                            </div>

                            <div className="relative z-10 space-y-4">
                                {messages.map((m) => (
                                    <motion.div
                                        key={m.id}
                                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                        animate={{ opacity: 1, y: 0, scale: 1 }}
                                        className={cn(
                                            "flex items-end gap-2",
                                            m.sender === 'user' ? "flex-row-reverse" : "flex-row"
                                        )}
                                    >
                                        <div className={cn(
                                            "w-7 h-7 rounded-full flex items-center justify-center shrink-0 shadow-sm border",
                                            m.sender === 'user'
                                                ? "bg-muted border-border"
                                                : "bg-primary/10 border-primary/20 text-primary"
                                        )}>
                                            {m.sender === 'user' ? <User size={12} /> : <Bot size={12} />}
                                        </div>
                                        <div className={cn(
                                            "max-w-[80%] px-3 py-2 rounded-xl text-[12px] leading-relaxed shadow-sm transition-all",
                                            m.sender === 'user'
                                                ? "bg-primary text-primary-foreground rounded-br-none font-medium"
                                                : "bg-background border border-border/50 rounded-bl-none"
                                        )}>
                                            {m.text}
                                        </div>
                                    </motion.div>
                                ))}

                                {isLoading && (
                                    <div className="flex items-center gap-2">
                                        <div className="w-7 h-7 rounded-full bg-primary/10 text-primary flex items-center justify-center border border-primary/20">
                                            <Bot size={12} />
                                        </div>
                                        <div className="bg-background border border-border/50 p-2 rounded-xl rounded-bl-none flex gap-1 items-center">
                                            <span className="w-1.5 h-1.5 bg-primary/30 rounded-full animate-bounce" />
                                            <span className="w-1.5 h-1.5 bg-primary/30 rounded-full animate-bounce [animation-delay:0.2s]" />
                                            <span className="w-1.5 h-1.5 bg-primary/30 rounded-full animate-bounce [animation-delay:0.4s]" />
                                        </div>
                                    </div>
                                )}
                            </div>
                        </ScrollArea>

                        {/* Quick Replies */}
                        {!isLoading && messages.length < 10 && (
                            <div className="px-4 py-2 flex flex-wrap gap-1.5 bg-card/30 border-t border-border/50 overflow-x-auto no-scrollbar">
                                {quickReplies.map((qr, i) => (
                                    <button
                                        key={i}
                                        onClick={() => handleSend(qr.text)}
                                        className="text-[10px] font-bold py-1.5 px-3 rounded-full bg-background border border-border hover:bg-primary hover:text-primary-foreground hover:border-primary transition-all flex items-center gap-1.5 shadow-sm active:scale-95"
                                    >
                                        <span>{qr.icon}</span>
                                        <span className="whitespace-nowrap">{qr.text}</span>
                                    </button>
                                ))}
                            </div>
                        )}

                        {/* Input Area */}
                        <div className="p-4 border-t border-border bg-background">
                            <form
                                onSubmit={(e) => { e.preventDefault(); handleSend(); }}
                                className="flex items-center gap-2"
                            >
                                <div className="flex-1 relative">
                                    <Input
                                        value={inputValue}
                                        onChange={(e) => setInputValue(e.target.value)}
                                        placeholder={isRecording ? "Listening..." : "Votre question..."}
                                        className={cn(
                                            "bg-muted/50 border-none h-10 rounded-xl px-4 focus-visible:ring-1 focus-visible:ring-primary/50 text-[13px] transition-all",
                                            isRecording && "animate-pulse ring-1 ring-red-500/50 bg-red-50/10"
                                        )}
                                    />
                                    <button
                                        type="button"
                                        onClick={toggleRecording}
                                        className={cn(
                                            "absolute right-3 top-1/2 -translate-y-1/2 transition-all p-1.5 rounded-full",
                                            isRecording
                                                ? "text-red-500 bg-red-100 dark:bg-red-900/30 scale-110"
                                                : "text-primary/40 hover:text-primary hover:bg-primary/5"
                                        )}
                                        title={isRecording ? "Arrêter l'enregistrement" : "Parler"}
                                    >
                                        {isRecording ? (
                                            <motion.div
                                                animate={{ scale: [1, 1.2, 1] }}
                                                transition={{ repeat: Infinity, duration: 1 }}
                                            >
                                                <Mic size={14} fill="currentColor" />
                                            </motion.div>
                                        ) : (
                                            <Mic size={14} />
                                        )}
                                    </button>
                                </div>
                                <Button
                                    type="submit"
                                    size="icon"
                                    disabled={!inputValue.trim() || isLoading || isRecording}
                                    className="shrink-0 h-10 w-10 rounded-xl shadow-lg transition-all hover:scale-105 active:scale-95"
                                >
                                    <Send size={16} />
                                </Button>
                            </form>
                            <div className="flex items-center justify-center gap-2 mt-3 opacity-50">
                                <span className="h-[1px] w-6 bg-border" />
                                <p className="text-[8px] uppercase tracking-[0.2em] font-bold">IA Concierge</p>
                                <span className="h-[1px] w-6 bg-border" />
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Floating Toggle Button (Logo Badge Style) */}
            <motion.div className="relative group">
                <AnimatePresence>
                    {!isOpen && (
                        <motion.div
                            initial={{ scale: 0, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0, opacity: 0 }}
                            className="absolute -top-10 left-0 bg-primary text-primary-foreground text-[9px] font-bold px-2.5 py-1.5 rounded-full shadow-lg whitespace-nowrap pointer-events-none mb-2"
                        >
                            Besoin d'aide ? 👋
                            <div className="absolute bottom-[-3px] left-4 w-1.5 h-1.5 bg-primary rotate-45" />
                        </motion.div>
                    )}
                </AnimatePresence>

                <motion.button
                    whileHover={{ scale: 1.08, rotate: 5 }}
                    whileTap={{ scale: 0.92 }}
                    onClick={() => isOpen ? handleClose() : setIsOpen(true)}
                    className={cn(
                        "relative w-14 h-14 rounded-full flex items-center justify-center transition-all duration-500 shadow-2xl overflow-hidden",
                        isOpen
                            ? "bg-muted border-2 border-border"
                            : cn(
                                "border-2",
                                isDarkMode
                                    ? "bg-[#0B1221] border-[#D4A017] shadow-[0_0_30px_rgba(212,160,23,0.4)]"
                                    : "bg-white border-[#D4A017]/40 shadow-[0_10px_20px_rgba(212,160,23,0.2)]"
                            )
                    )}
                >
                    {isOpen ? (
                        <X size={24} className="text-foreground" />
                    ) : (
                        <>
                            {/* Inner Decorative Detail */}
                            <div className={cn(
                                "absolute inset-[2px] rounded-full border pointer-events-none",
                                isDarkMode ? "border-[#D4A017]/30" : "border-[#D4A017]/10"
                            )} />

                            {/* Logo Image */}
                            <img
                                src={logoSrc}
                                alt="Concierge"
                                className={cn(
                                    "h-9 w-auto object-contain transition-all duration-300 z-10",
                                    isDarkMode ? "brightness-125 contrast-110 drop-shadow-[0_0_5px_rgba(212,160,23,0.4)]" : "brightness-100 contrast-100"
                                )}
                            />

                            {/* Notification Dot */}
                            <span className="absolute top-3 right-3 w-3 h-3 bg-red-500 rounded-full border-2 border-background z-20 animate-bounce" />
                        </>
                    )}
                </motion.button>
            </motion.div>
        </div>
    );
};

export default Chatbot;
