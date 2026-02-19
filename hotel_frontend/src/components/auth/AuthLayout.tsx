import { motion } from 'framer-motion';
import { useSettings } from '@/context/SettingsContext';
import { Link } from 'react-router-dom';

interface AuthLayoutProps {
    children: React.ReactNode;
    title: string;
    subtitle: string;
    image: string;
    sideTitle: string;
    sideSubtitle: string;
}

const AuthLayout = ({ children, title, subtitle, image, sideTitle, sideSubtitle }: AuthLayoutProps) => {
    const { settings } = useSettings();
    const currentYear = new Date().getFullYear();

    return (
        <div className="flex min-h-screen">
            {/* Side Image & Branding */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="hidden lg:flex w-1/2 lg:w-3/5 bg-cover bg-center relative"
                style={{ backgroundImage: `url(${image})` }}
            >
                <div className="absolute inset-0 bg-black/40 flex flex-col justify-between p-12 text-white">
                    <Link to="/">
                        <img src={settings.logo_url.startsWith('/') && !settings.logo_url.startsWith('/storage') ? settings.logo_url : `${(import.meta.env.VITE_API_URL || 'http://localhost:8000/api').replace('/api', '')}${settings.logo_url}`} className="h-32 w-fit bg-white/10 p-4 rounded-3xl backdrop-blur-sm" alt={settings.hotel_name} />
                    </Link>
                    <div className="max-w-md">
                        <h2 className="text-4xl font-bold mb-4">{sideTitle}</h2>
                        <p className="opacity-80 font-medium">{sideSubtitle}</p>
                    </div>
                    <p className="text-sm opacity-50 font-bold tracking-widest">
                        © {currentYear} {settings.hotel_name || 'Hôtel Excellence'}.
                    </p>
                </div>
            </motion.div>

            {/* Form Content */}
            <div className="flex-1 flex items-center justify-center p-8 bg-slate-50 dark:bg-[#020617]">
                <div className="w-full max-w-md space-y-8">
                    <Link to="/" className="lg:hidden mx-auto block w-fit">
                        <img src={settings.logo_url.startsWith('/') && !settings.logo_url.startsWith('/storage') ? settings.logo_url : `${(import.meta.env.VITE_API_URL || 'http://localhost:8000/api').replace('/api', '')}${settings.logo_url}`} className="h-24" alt={settings.hotel_name} />
                    </Link>
                    <div className="text-center lg:text-left">
                        <h1 className="text-3xl font-black uppercase tracking-tight">{title}</h1>
                        <p className="text-muted-foreground mt-2 font-medium">{subtitle}</p>
                    </div>

                    {children}
                </div>
            </div>
        </div>
    );
};

export default AuthLayout;
