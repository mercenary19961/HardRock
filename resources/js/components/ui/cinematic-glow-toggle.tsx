"use client";

import { cn } from "@/lib/utils";
import React from "react";
import { motion } from "framer-motion";
import { useTheme } from "@/contexts/ThemeContext";

interface CinematicSwitchProps {
    className?: string;
}

export default function CinematicSwitch({ className }: CinematicSwitchProps) {
    const { theme, toggleTheme } = useTheme();
    const isOn = theme === 'dark';

    return (
        <div
            className={cn(
                "flex items-center gap-2 p-2 rounded-xl bg-zinc-900/50 dark:bg-zinc-900/50 bg-white/50 border border-zinc-200 dark:border-zinc-800 backdrop-blur-sm shadow-md cursor-pointer",
                className
            )}
            onClick={toggleTheme}
            role="button"
            aria-label={`Switch to ${isOn ? 'light' : 'dark'} mode`}
        >
            {/* Sun Icon for Light Mode */}
            <span className={`text-xs transition-colors duration-300 ${!isOn ? "text-amber-500" : "text-zinc-600"}`}>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-3.5 h-3.5">
                    <circle cx="12" cy="12" r="4" />
                    <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41" stroke="currentColor" strokeWidth="2" strokeLinecap="round" fill="none"/>
                </svg>
            </span>

            {/* Switch Track */}
            <motion.div
                className="relative w-10 h-5 rounded-full shadow-inner"
                initial={false}
                animate={{
                    backgroundColor: isOn ? "#704399" : "#e4e4e7", // brand-purple vs zinc-200
                }}
                transition={{ duration: 0.3 }}
            >
                {/* Switch Thumb */}
                <motion.div
                    className="absolute top-0.5 left-0.5 w-4 h-4 rounded-full border border-white/20 shadow-md"
                    initial={false}
                    animate={{
                        x: isOn ? 20 : 0,
                        backgroundColor: isOn ? "#ffffff" : "#a1a1aa", // white vs zinc-400
                    }}
                    transition={{ type: "spring", stiffness: 500, damping: 30 }}
                    whileTap={{ scale: 0.9 }}
                >
                    {/* Thumb Highlight (Gloss) */}
                    <div className="absolute top-0.5 left-1 w-1.5 h-0.5 bg-white/40 rounded-full blur-[0.5px]" />
                </motion.div>
            </motion.div>

            {/* Moon Icon for Dark Mode */}
            <span className={`text-xs transition-colors duration-300 ${isOn ? "text-brand-purple drop-shadow-[0_0_8px_rgba(112,67,153,0.5)]" : "text-zinc-400"}`}>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-3.5 h-3.5">
                    <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" />
                </svg>
            </span>
        </div>
    );
}
