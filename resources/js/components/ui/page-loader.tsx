import { useEffect, useState } from 'react';
import { router } from '@inertiajs/react';

export function PageLoader() {
    const [isLoading, setIsLoading] = useState(false);
    const [progress, setProgress] = useState(0);

    useEffect(() => {
        const startHandler = () => {
            setIsLoading(true);
            setProgress(0);
            // Animate progress
            const interval = setInterval(() => {
                setProgress((prev) => {
                    if (prev >= 90) {
                        clearInterval(interval);
                        return 90;
                    }
                    return prev + Math.random() * 15;
                });
            }, 100);
            return () => clearInterval(interval);
        };

        const finishHandler = () => {
            setProgress(100);
            setTimeout(() => {
                setIsLoading(false);
                setProgress(0);
            }, 200);
        };

        router.on('start', startHandler);
        router.on('finish', finishHandler);

        return () => {
            router.on('start', startHandler);
            router.on('finish', finishHandler);
        };
    }, []);

    if (!isLoading) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-white/80 dark:bg-black/80 backdrop-blur-sm transition-opacity">
            {/* Logo and loader container */}
            <div className="flex flex-col items-center gap-6">
                {/* Animated logo */}
                <div className="relative">
                    {/* Pulsing glow effect */}
                    <div className="absolute inset-0 animate-pulse">
                        <div className="absolute inset-0 bg-gradient-to-r from-brand-purple to-brand-red rounded-full blur-xl opacity-50" />
                    </div>

                    {/* Logo text */}
                    <div className="relative">
                        <span className="text-4xl font-bold bg-gradient-to-r from-brand-purple to-brand-red bg-clip-text text-transparent animate-pulse">
                            HardRock
                        </span>
                    </div>
                </div>

                {/* Progress bar */}
                <div className="w-48 h-1 bg-gray-200 dark:bg-gray-800 rounded-full overflow-hidden">
                    <div
                        className="h-full bg-gradient-to-r from-brand-purple to-brand-red rounded-full transition-all duration-200 ease-out"
                        style={{ width: `${progress}%` }}
                    />
                </div>

                {/* Loading dots */}
                <div className="flex items-center gap-1">
                    <div className="size-2 rounded-full bg-brand-purple animate-bounce" style={{ animationDelay: '0ms' }} />
                    <div className="size-2 rounded-full bg-brand-purple/80 animate-bounce" style={{ animationDelay: '150ms' }} />
                    <div className="size-2 rounded-full bg-brand-red/80 animate-bounce" style={{ animationDelay: '300ms' }} />
                    <div className="size-2 rounded-full bg-brand-red animate-bounce" style={{ animationDelay: '450ms' }} />
                </div>
            </div>
        </div>
    );
}

// Suspense fallback component (for lazy loading)
export function SuspenseLoader() {
    return (
        <div className="min-h-screen flex items-center justify-center bg-white dark:bg-black">
            <div className="flex flex-col items-center gap-6">
                {/* Animated logo */}
                <div className="relative">
                    <div className="absolute inset-0 animate-pulse">
                        <div className="absolute inset-0 bg-gradient-to-r from-brand-purple to-brand-red rounded-full blur-xl opacity-50" />
                    </div>
                    <span className="relative text-4xl font-bold bg-gradient-to-r from-brand-purple to-brand-red bg-clip-text text-transparent animate-pulse">
                        HardRock
                    </span>
                </div>

                {/* Spinning loader */}
                <div className="relative size-12">
                    <div className="absolute inset-0 rounded-full border-4 border-gray-200 dark:border-gray-800" />
                    <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-brand-purple border-r-brand-red animate-spin" />
                </div>

                {/* Loading text */}
                <p className="text-sm text-gray-500 dark:text-gray-400 animate-pulse">
                    Loading...
                </p>
            </div>
        </div>
    );
}
