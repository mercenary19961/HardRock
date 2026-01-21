"use client"

import * as React from "react"
import { cn } from "@/lib/utils"
import { motion, useAnimation } from "framer-motion"
import { useEffect, useState, useCallback } from "react"

interface MagnetizeButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    particleCount?: number;
    attractRadius?: number;
    children: React.ReactNode;
}

interface Particle {
    id: number;
    x: number;
    y: number;
}

function MagnetizeButton({
    className,
    particleCount = 12,
    attractRadius = 120,
    children,
    ...props
}: MagnetizeButtonProps) {
    const [isAttracting, setIsAttracting] = useState(false);
    const [particles, setParticles] = useState<Particle[]>([]);
    const particlesControl = useAnimation();

    useEffect(() => {
        // Generate particles positioned outside the button
        const newParticles = Array.from({ length: particleCount }, (_, i) => {
            const angle = (i / particleCount) * Math.PI * 2;
            const radius = attractRadius + Math.random() * 70;
            return {
                id: i,
                x: Math.cos(angle) * radius,
                y: Math.sin(angle) * radius,
            };
        });
        setParticles(newParticles);
    }, [particleCount, attractRadius]);

    const handleInteractionStart = useCallback(async () => {
        setIsAttracting(true);
        await particlesControl.start({
            x: 0,
            y: 0,
            transition: {
                type: "spring",
                stiffness: 50,
                damping: 10,
            },
        });
    }, [particlesControl]);

    const handleInteractionEnd = useCallback(async () => {
        setIsAttracting(false);
        await particlesControl.start((i) => ({
            x: particles[i]?.x ?? 0,
            y: particles[i]?.y ?? 0,
            transition: {
                type: "spring",
                stiffness: 150,
                damping: 15,
            },
        }));
    }, [particlesControl, particles]);

    return (
        <div className="relative inline-block">
            {/* Particles container - positioned outside the button */}
            <div className="absolute inset-0 pointer-events-none" style={{ overflow: 'visible' }}>
                {particles.map((particle, index) => (
                    <motion.div
                        key={index}
                        custom={index}
                        initial={{ x: particle.x, y: particle.y }}
                        animate={particlesControl}
                        className={cn(
                            "absolute w-2 h-2 rounded-full",
                            "bg-brand-purple",
                            "transition-opacity duration-300",
                            isAttracting ? "opacity-100" : "opacity-50"
                        )}
                        style={{
                            left: '50%',
                            top: '50%',
                            marginLeft: '-4px',
                            marginTop: '-4px',
                        }}
                    />
                ))}
            </div>

            <button
                className={cn(
                    "relative touch-none z-10",
                    className
                )}
                onMouseEnter={handleInteractionStart}
                onMouseLeave={handleInteractionEnd}
                onTouchStart={handleInteractionStart}
                onTouchEnd={handleInteractionEnd}
                {...props}
            >
                <span className="relative z-10 w-full flex items-center justify-center">
                    {children}
                </span>
            </button>
        </div>
    );
}

export { MagnetizeButton }
