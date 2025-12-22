import { type HTMLAttributes, useCallback, useEffect, useState } from 'react';
import { cn } from '@/lib/utils';
import { buttonVariants } from '@/components/ui/button';

// Inline X icon
const XIcon = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M18 6 6 18" />
    <path d="m6 6 12 12" />
  </svg>
);

interface BannerProps extends HTMLAttributes<HTMLDivElement> {
  variant?: 'rainbow' | 'normal';
  changeLayout?: boolean;
  message?: string;
  height?: string;
}

export function Banner({
  id,
  variant = 'normal',
  changeLayout = true,
  message,
  height = '3rem',
  ...props
}: BannerProps): React.ReactElement {
  const [open, setOpen] = useState(true);
  const globalKey = id ? `banner-${id}` : undefined;

  useEffect(() => {
    if (globalKey) {
      const stored = localStorage.getItem(globalKey);
      if (stored === 'true') setOpen(false);
    }
  }, [globalKey]);

  const onClick = useCallback(() => {
    setOpen(false);
    if (globalKey) localStorage.setItem(globalKey, 'true');
  }, [globalKey]);

  if (!open) return <></>;

  return (
    <div
      id={id}
      {...props}
      style={{ height }}
      className={cn(
        'relative flex flex-row items-center justify-center bg-secondary px-4 text-center text-sm font-medium',
        variant === 'rainbow' && 'bg-background',
        props.className,
      )}
    >
      {variant === 'rainbow' ? <RainbowLayer /> : null}
      {message || props.children}
      {id ? (
        <button
          type="button"
          aria-label="Close Banner"
          onClick={onClick}
          className={cn(
            buttonVariants({
              variant: 'ghost',
              className: 'absolute end-2 top-1/2 -translate-y-1/2 text-muted-foreground',
              size: 'icon',
            }),
          )}
        >
          <XIcon className="h-4 w-4" />
        </button>
      ) : null}
    </div>
  );
}

const RainbowLayer = () => {
  return (
    <>
      <div className="absolute inset-0 z-[-1] rainbow-banner-gradient-1" />
      <div className="absolute inset-0 z-[-1] rainbow-banner-gradient-2" />
    </>
  );
};
