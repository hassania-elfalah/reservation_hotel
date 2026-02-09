import { Moon, Sun } from "lucide-react";
import { useAppearance } from "@/context/AppearanceContext";
import { motion, AnimatePresence } from "framer-motion";

const ThemeToggle = () => {
    const { isDarkMode, toggleDarkMode } = useAppearance();

    return (
        <div className="relative p-2">
            {/* Decorative dots matching the design images */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="absolute top-0 w-1 h-1 rounded-full bg-slate-300/40 dark:bg-slate-700/40" />
                <div className="absolute bottom-0 w-1 h-1 rounded-full bg-slate-300/40 dark:bg-slate-700/40" />
                <div className="absolute left-0 w-1 h-1 rounded-full bg-slate-300/40 dark:bg-slate-700/40" />
                <div className="absolute right-0 w-1 h-1 rounded-full bg-slate-300/40 dark:bg-slate-700/40" />
            </div>

            <button
                onClick={toggleDarkMode}
                className={`relative h-12 w-12 rounded-full flex items-center justify-center transition-all duration-300 border-2 shadow-lg
          ${isDarkMode
                        ? 'bg-[#1a1b26] border-[#24283b] hover:border-slate-600'
                        : 'bg-white border-slate-100 hover:border-slate-200'}
        `}
                aria-label="Toggle theme"
            >
                <AnimatePresence mode="wait" initial={false}>
                    {isDarkMode ? (
                        <motion.div
                            key="moon"
                            initial={{ opacity: 0, rotate: -90, scale: 0.5 }}
                            animate={{ opacity: 1, rotate: 0, scale: 1 }}
                            exit={{ opacity: 0, rotate: 90, scale: 0.5 }}
                            transition={{ duration: 0.2 }}
                        >
                            <Moon className="h-6 w-6 text-white" />
                        </motion.div>
                    ) : (
                        <motion.div
                            key="sun"
                            initial={{ opacity: 0, rotate: 90, scale: 0.5 }}
                            animate={{ opacity: 1, rotate: 0, scale: 1 }}
                            exit={{ opacity: 0, rotate: -90, scale: 0.5 }}
                            transition={{ duration: 0.2 }}
                        >
                            <Sun className="h-6 w-6 text-orange-500 fill-orange-500/20" />
                        </motion.div>
                    )}
                </AnimatePresence>
            </button>
        </div>
    );
};

export default ThemeToggle;
