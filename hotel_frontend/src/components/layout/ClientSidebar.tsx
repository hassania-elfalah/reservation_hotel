import { Link, useLocation } from 'react-router-dom';
import { Home, User, Bed, Calendar, Star, Send, LogIn, Plus } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { useAppearance } from '@/context/AppearanceContext';
import { useSettings } from '@/context/SettingsContext';

const BedPlus = ({ className }: { className?: string }) => (
    <div className="relative inline-flex items-center justify-center">
        <Bed className={cn(className, "transition-transform")} />
        <div className="absolute -top-1.5 -right-1.5 bg-background rounded-full p-0.5 shadow-sm border border-border">
            <Plus className="h-2.5 w-2.5 text-primary stroke-[3px]" />
        </div>
    </div>
);

const NavItem = ({ icon: Icon, label, href, active, isBottom }: any) => (
    <Link to={href} className="w-full px-2">
        <div className={cn(
            "group relative flex items-center justify-center transition-all duration-300 p-3 rounded-2xl w-full",
            active ? "text-primary bg-primary/10" : "text-muted-foreground hover:text-foreground hover:bg-muted"
        )}>
            <Icon className={cn("h-6 w-6 transition-transform group-hover:scale-110")} />
            <div className="absolute right-full mr-4 scale-0 rounded-lg bg-foreground px-3 py-2 text-xs text-background transition-all group-hover:scale-100 whitespace-nowrap z-50 shadow-xl">
                {label}
                <div className="absolute top-1/2 -right-1 -translate-y-1/2 border-y-[6px] border-y-transparent border-l-[6px] border-l-foreground" />
            </div>
        </div>
    </Link>
);

const ClientSidebar = () => {
    const { pathname } = useLocation();
    const { isDarkMode } = useAppearance();
    const { settings } = useSettings();
    const isActive = (path: string) => path === '/' ? pathname === '/' : pathname.startsWith(path);

    const menu = {
        top: [
            { icon: Home, label: 'Accueil', href: '/' },
            { icon: User, label: 'Profil', href: '/profile' },
            { icon: BedPlus, label: 'Chambres', href: '/rooms' },
            { icon: Star, label: 'Favoris', href: '/favorites' },
        ],
        bottom: [
            { icon: Calendar, label: 'Réservations', href: '/reservations' },
            { icon: Send, label: 'Contact', href: '/contact' },
            { icon: LogIn, label: 'Se connecter', href: '/login' },
        ]
    };

    return (
        <>
            {/* Mobile Top Header */}
            <header className="md:hidden fixed top-0 left-0 right-0 h-14 flex items-center justify-center bg-card/50 backdrop-blur-xl border-b border-white/5 z-50">
                <Link to="/" className="transition-transform active:scale-95">
                    <div className="relative group/mobile-logo translate-y-6">
                        {/* Glow Effect */}
                        <div className={cn(
                            "absolute inset-0 rounded-full blur-2xl transition-all duration-500",
                            isDarkMode ? "bg-[#D4A017]/30" : "bg-[#D4A017]/15"
                        )} />

                        {/* Logo Badge */}
                        <div className={cn(
                            "relative w-16 h-16 rounded-full flex items-center justify-center border-2 transition-all duration-300 shadow-2xl",
                            isDarkMode
                                ? "bg-[#0B1221] border-[#D4A017] shadow-[0_10px_30px_rgba(212,160,23,0.4)]"
                                : "bg-white border-[#D4A017]/40 shadow-[0_10px_30px_rgba(212,160,23,0.2)]"
                        )}>
                            <img
                                src={settings.logo_url.startsWith('/') && !settings.logo_url.startsWith('/storage') ? settings.logo_url : `${(import.meta.env.VITE_API_URL || 'http://localhost:8000/api').replace('/api', '')}${settings.logo_url}`}
                                alt={settings.hotel_name}
                                className={cn(
                                    "h-16 w-auto object-contain z-10",
                                    isDarkMode ? "brightness-125" : "brightness-100"
                                )}
                            />
                        </div>
                    </div>
                </Link>
            </header>

            <aside className="fixed z-40 right-0 top-0 h-screen w-20 hidden md:flex flex-col py-8 items-center bg-card border-l">
                <nav className="flex flex-col gap-1 w-full px-2">
                    {menu.top.map(item => <NavItem key={item.href} {...item} active={isActive(item.href)} />)}
                </nav>

                {/* Logo Section - Theme Aware */}
                <div className="my-auto flex items-center justify-center py-4">
                    <div className="relative group/logo -translate-x-4">
                        {/* Glow Effect */}
                        <div className={cn(
                            "absolute inset-0 rounded-full blur-2xl transition-all duration-500 group-hover/logo:scale-125",
                            isDarkMode ? "bg-[#D4A017]/20 group-hover/logo:bg-[#D4A017]/30" : "bg-[#D4A017]/10 group-hover/logo:bg-[#D4A017]/15"
                        )} />

                        {/* Logo Badge */}
                        <div className={cn(
                            "relative w-24 h-24 rounded-full flex items-center justify-center transition-all duration-500 hover:scale-105 shadow-xl",
                            isDarkMode
                                ? "bg-[#0B1221] border-2 border-[#D4A017] shadow-[0_0_40px_rgba(212,160,23,0.3)]"
                                : "bg-white border-2 border-[#D4A017]/30 shadow-[0_10px_30px_rgba(212,160,23,0.1)]"
                        )}>
                            {/* Inner Decorative Detail */}
                            <div className={cn(
                                "absolute inset-[3px] rounded-full border pointer-events-none",
                                isDarkMode ? "border-[#D4A017]/30" : "border-[#D4A017]/10"
                            )} />

                            {/* Logo Image */}
                            <img
                                src={settings.logo_url.startsWith('/') && !settings.logo_url.startsWith('/storage') ? settings.logo_url : `${(import.meta.env.VITE_API_URL || 'http://localhost:8000/api').replace('/api', '')}${settings.logo_url}`}
                                alt={settings.hotel_name}
                                className={cn(
                                    "h-15 w-auto object-contain transition-all duration-300 z-10",
                                    isDarkMode ? "brightness-125 contrast-110 drop-shadow-[0_0_10px_rgba(212,160,23,0.4)]" : "brightness-100 contrast-100 drop-shadow-sm"
                                )}
                            />
                        </div>
                    </div>
                </div>

                <div className="mt-auto flex flex-col gap-2 w-full px-2">
                    {menu.bottom.map(item => <NavItem key={item.href} {...item} active={isActive(item.href)} />)}
                </div>
            </aside>

            {/* Mobile Bottom Navigation */}
            <nav className="md:hidden fixed bottom-6 left-1/2 -translate-x-1/2 z-50 flex gap-1 px-4 py-3 bg-card/90 backdrop-blur-xl border border-border/50 rounded-full shadow-2xl min-w-[340px] justify-between">
                {[...menu.top, menu.bottom[0], menu.bottom[1], menu.bottom[2]].map(({ icon: Icon, href, label }) => (
                    <Link
                        key={label}
                        to={href}
                        className={cn(
                            "p-2 rounded-full transition-all active:scale-90",
                            isActive(href) ? "text-primary bg-primary/10" : "text-muted-foreground"
                        )}
                    >
                        <Icon className="h-6 w-6" />
                    </Link>
                ))}
            </nav>
        </>
    );
};

export default ClientSidebar;
