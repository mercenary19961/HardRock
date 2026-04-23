import { useRef, useEffect, type ReactNode } from 'react';
import './magic-card.css';

interface MagicCardGridProps {
  children: ReactNode;
  className?: string;
  /** RGB triplet for the glow start color, e.g. '102, 10, 219' */
  glowColor1?: string;
  /** RGB triplet for the glow end color, e.g. '255, 60, 43' */
  glowColor2?: string;
  /** How far the glow reaches from the cursor to nearby cards, in pixels */
  spotlightRadius?: number;
}

export function MagicCardGrid({
  children,
  className = '',
  glowColor1 = '139, 92, 246',
  glowColor2 = '217, 70, 239',
  spotlightRadius = 400,
}: MagicCardGridProps) {
  const gridRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const grid = gridRef.current;
    if (!grid) return;

    const proximity = spotlightRadius * 0.5;
    const fadeDistance = spotlightRadius * 0.75;

    const handleMouseMove = (e: MouseEvent) => {
      const cards = grid.querySelectorAll<HTMLElement>('.magic-card');
      cards.forEach((card) => {
        const rect = card.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        const dist = Math.max(
          0,
          Math.hypot(e.clientX - centerX, e.clientY - centerY) -
            Math.max(rect.width, rect.height) / 2,
        );
        let intensity = 0;
        if (dist <= proximity) intensity = 1;
        else if (dist <= fadeDistance)
          intensity = (fadeDistance - dist) / (fadeDistance - proximity);
        const relX = ((e.clientX - rect.left) / rect.width) * 100;
        const relY = ((e.clientY - rect.top) / rect.height) * 100;
        card.style.setProperty('--glow-x', `${relX}%`);
        card.style.setProperty('--glow-y', `${relY}%`);
        card.style.setProperty('--glow-intensity', intensity.toString());
      });
    };

    const handleMouseLeave = () => {
      grid.querySelectorAll<HTMLElement>('.magic-card').forEach((card) => {
        card.style.setProperty('--glow-intensity', '0');
      });
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseleave', handleMouseLeave);
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [spotlightRadius]);

  return (
    <div
      ref={gridRef}
      className={className}
      style={{
        '--glow-color-1': glowColor1,
        '--glow-color-2': glowColor2,
      } as React.CSSProperties}
    >
      {children}
    </div>
  );
}

interface MagicCardProps {
  children: ReactNode;
  className?: string;
}

export function MagicCard({ children, className = '' }: MagicCardProps) {
  return <div className={`magic-card ${className}`}>{children}</div>;
}
