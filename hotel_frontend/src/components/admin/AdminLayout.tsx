import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useAppearance } from '@/context/AppearanceContext';
import { useAuth } from '../../context/AuthContext';
import { useSettings } from '../../context/SettingsContext';
import {
  LayoutDashboard,
  Bed,
  Calendar,
  Settings,
  Hotel,
  Menu,
  Mail,
  Sparkles,
  Moon,
  Sun,
  X,
  LogOut,
  MessageSquare
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

interface AdminLayoutProps {
  children: React.ReactNode;
}

const AdminLayout = ({ children }: AdminLayoutProps) => {
  const { isDarkMode, toggleDarkMode } = useAppearance();
  const { settings } = useSettings();
  const { logout } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();

  const navItems = [
    { href: '/admin', icon: LayoutDashboard, label: 'Tableau' },
    { href: '/admin/rooms', icon: Bed, label: 'Chambres' },
    { href: '/admin/reservations', icon: Calendar, label: 'Réserves' },
    { href: '/admin/reviews', icon: MessageSquare, label: 'Avis' },
    { href: '/admin/contacts', icon: Mail, label: 'Messages' },
    { href: '/admin/settings', icon: Settings, label: 'Params' },
  ];

  const isActive = (path: string) => {
    if (path === '/admin') return location.pathname === '/admin';
    return location.pathname.startsWith(path);
  };

  const leftItems = navItems.slice(0, 3);
  const rightItems = navItems.slice(3);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#020617] text-foreground transition-colors duration-500 overflow-x-hidden pt-12 md:pt-0">
      {/* Background Decor */}
      <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-[#D4A017]/5 dark:bg-[#D4A017]/10 blur-[120px] rounded-full"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-500/5 dark:bg-blue-500/10 blur-[120px] rounded-full"></div>
      </div>

      {/* Header Container */}
      <header className="fixed top-0 left-0 right-0 z-50 py-0 md:py-6 px-4 md:px-16 pointer-events-none">
        <div className="max-w-[1200px] mx-auto relative group pointer-events-none">

          {/* Main Navigation Bar */}
          <div className="relative h-20 bg-white dark:bg-slate-900/90 backdrop-blur-xl rounded-[2.5rem] shadow-[0_15px_40px_rgba(0,0,0,0.08)] dark:shadow-[0_20px_50px_rgba(0,0,0,0.3)] flex items-center justify-between px-8 md:px-12 lg:px-20 border border-slate-100 dark:border-slate-800/50 pointer-events-auto">

            {/* Left Nav */}
            <nav className="hidden md:flex flex-1 items-center gap-8 lg:gap-16">

              {leftItems.map((item) => {
                const active = isActive(item.href);
                return (
                  <Link
                    key={item.href}
                    to={item.href}
                    className={cn(
                      "relative text-[10px] lg:text-xs font-black uppercase tracking-[0.2em] transition-all duration-300 whitespace-nowrap",
                      active ? "text-[#D4A017]" : "text-slate-400 hover:text-slate-600 dark:hover:text-white"
                    )}
                  >
                    {item.label}
                    {active && (
                      <motion.div
                        layoutId="activeNav"
                        className="absolute -bottom-2 left-0 right-0 h-0.5 bg-[#D4A017] shadow-[0_0_10px_#D4A017]"
                      />
                    )}
                  </Link>
                );
              })}

            </nav>


            {/* Empty Center Spacer for Logo Area */}
            <div className="hidden md:block w-24 lg:w-32 shrink-0"></div>

            {/* Circular Logo Holder */}
            <div className="absolute left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2 z-10">
              <Link to="/" className="block group/logo">
                <div className="relative w-20 h-20 md:w-28 md:h-28 bg-white dark:bg-slate-900 rounded-full flex items-center justify-center shadow-2xl border-4 border-slate-50 dark:border-[#020617] transition-transform duration-500 group-hover/logo:scale-110">
                  <img src={settings.logo_url.startsWith('/') && !settings.logo_url.startsWith('/storage') ? settings.logo_url : `${(import.meta.env.VITE_API_URL || 'http://localhost:8000/api').replace('/api', '')}${settings.logo_url}`} alt={settings.hotel_name} className="h-12 md:h-16 object-contain" />
                  <div className="absolute inset-0 rounded-full border-2 border-[#D4A017]/20 group-hover/logo:border-[#D4A017] transition-colors duration-500"></div>
                </div>
              </Link>
            </div>

            {/* Right Nav */}
            <nav className="hidden md:flex flex-1 items-center justify-end gap-6 lg:gap-10">



              {rightItems.slice(0, 2).map((item) => {
                const active = isActive(item.href);
                return (


                  <Link
                    key={item.href}
                    to={item.href}
                    className={cn(
                      "relative text-[10px] lg:text-xs font-black uppercase tracking-[0.2em] transition-all duration-300 whitespace-nowrap",
                      active ? "text-[#D4A017]" : "text-slate-400 hover:text-slate-600 dark:hover:text-white"
                    )}
                  >
                    {item.label}
                    {active && (
                      <motion.div
                        layoutId="activeNav"
                        className="absolute -bottom-2 left-0 right-0 h-0.5 bg-[#D4A017] shadow-[0_0_10px_#D4A017]"
                      />
                    )}
                  </Link>
                );
              })}

              <div className="flex items-center gap-2 lg:gap-4 pl-0 lg:pl-6 border-l border-slate-100 dark:border-slate-800">
                <Button
                  variant="ghost"
                  size="icon"
                  className="w-8 h-8 rounded-full text-slate-400 hover:text-[#D4A017] hover:bg-[#D4A017]/5"
                  onClick={toggleDarkMode}
                >
                  {isDarkMode ? <Sun size={14} /> : <Moon size={14} />}
                </Button>

                <Link to="/admin/settings" className={cn("inline-flex items-center justify-center w-8 h-8 rounded-full text-slate-400 hover:text-[#D4A017] transition-colors", isActive('/admin/settings') && "text-[#D4A017]")}>
                  <Settings size={16} />
                </Link>

                <Button
                  variant="ghost"
                  size="icon"
                  className="w-8 h-8 rounded-full text-slate-400 hover:text-red-500 hover:bg-red-500/10"
                  onClick={logout}
                  title="Déconnexion"
                >
                  <LogOut size={16} />
                </Button>
              </div>
            </nav>

            {/* Mobile Toggle */}
            <div className="md:hidden flex items-center justify-between w-full">
              <Button variant="ghost" size="icon" onClick={() => setMobileOpen(true)} className="text-[#D4A017]">
                <Menu />
              </Button>
              <div className="flex items-center gap-3">
                <Button variant="ghost" size="icon" onClick={toggleDarkMode} className="text-slate-400">
                  {isDarkMode ? <Sun size={18} /> : <Moon size={18} />}
                </Button>
                <div className="w-10 h-10 rounded-full bg-[#D4A017]/10 flex items-center justify-center text-[#D4A017] font-black border border-[#D4A017]/20">A</div>
              </div>
            </div>

          </div>

          {/* Subheader info bar */}
          <div className="flex justify-center mt-12 md:mt-16 pointer-events-none">
            <div className="inline-flex items-center gap-6 px-10 py-3 bg-white/5 dark:bg-white/5 backdrop-blur-md rounded-full border border-white/10 pointer-events-auto">
              <div className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></div>
                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 dark:text-white/40">Status: En Ligne</span>
              </div>
              <div className="h-4 w-[1px] bg-slate-200 dark:bg-white/10"></div>
              <div className="flex items-center gap-2">
                <Sparkles size={12} className="text-[#D4A017]" />
                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-[#D4A017]">Palace Admin Dashboard</span>
              </div>
            </div>
          </div>

        </div>
      </header>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[60] bg-black/80 backdrop-blur-md md:hidden"
              onClick={() => setMobileOpen(false)}
            />
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed inset-y-0 left-0 z-[70] w-80 bg-white dark:bg-slate-900 border-r border-slate-100 dark:border-white/10 p-8 flex flex-col md:hidden shadow-2xl"
            >
              <div className="flex items-center justify-between mb-12">
                <img src={settings.logo_url.startsWith('/') && !settings.logo_url.startsWith('/storage') ? settings.logo_url : `${(import.meta.env.VITE_API_URL || 'http://localhost:8000/api').replace('/api', '')}${settings.logo_url}`} alt={settings.hotel_name} className="h-10 object-contain" />
                <Button variant="ghost" size="icon" onClick={() => setMobileOpen(false)} className="text-slate-900 dark:text-white hover:bg-slate-100 dark:hover:bg-white/10 rounded-full">
                  <X />
                </Button>
              </div>

              <nav className="flex-1 space-y-4">
                {navItems.map((item) => {
                  const active = isActive(item.href);
                  return (
                    <Link
                      key={item.href}
                      to={item.href}
                      onClick={() => setMobileOpen(false)}
                      className={cn(
                        "flex items-center gap-4 px-6 py-4 rounded-2xl transition-all duration-300",
                        active ? "bg-[#D4A017] text-white shadow-lg shadow-yellow-600/20" : "text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-white/5"
                      )}
                    >
                      <item.icon size={20} />
                      <span className="text-xs font-black uppercase tracking-widest">{item.label}</span>
                    </Link>
                  );
                })}

                <button
                  onClick={logout}
                  className="flex w-full items-center gap-4 px-6 py-4 rounded-2xl transition-all duration-300 text-red-500 hover:bg-red-500/5 group"
                >
                  <LogOut size={20} className="group-hover:scale-110 transition-transform" />
                  <span className="text-xs font-black uppercase tracking-widest">Déconnexion</span>
                </button>
              </nav>

              <div className="mt-auto pt-8 border-t border-slate-100 dark:border-white/5">
                <Link to="/">
                  <Button variant="outline" className="w-full h-12 rounded-xl border-[#D4A017]/50 text-[#D4A017] uppercase text-[10px] font-black tracking-widest bg-transparent hover:bg-[#D4A017] hover:text-white transition-all duration-500">
                    <Hotel size={16} className="mr-3" /> Retour au site
                  </Button>
                </Link>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Page Content */}
      <main className="relative z-10 pt-32 md:pt-48 pb-10 px-4 md:px-10">
        <div className="max-w-[1400px] mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
          >
            {children}
          </motion.div>
        </div>
      </main>

      {/* Footer / Status Bottom Bar */}
      <footer className="relative z-10 py-10 flex justify-center opacity-30">
        <div className="flex items-center gap-4 text-[9px] font-black uppercase tracking-[0.3em]">
          <span>Palace Hotel Premium Management</span>
          <span className="h-3 w-[1px] bg-foreground/20"></span>
          <span>&copy; 2026 High Class Reservation</span>
        </div>
      </footer>
    </div>
  );
};

export default AdminLayout;
