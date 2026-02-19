import { motion } from 'framer-motion';

interface AdminPageHeaderProps {
    title: string;
    subtitle?: string;
    actions?: React.ReactNode;
}

export const AdminPageHeader = ({ title, subtitle, actions }: AdminPageHeaderProps) => {
    return (
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
            <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5 }}
            >
                <h1 className="text-4xl font-black font-display uppercase tracking-tight">{title}</h1>
                {subtitle && (
                    <p className="text-muted-foreground font-medium opacity-60 mt-1">{subtitle}</p>
                )}
            </motion.div>

            {actions && (
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                >
                    {actions}
                </motion.div>
            )}
        </div>
    );
};
