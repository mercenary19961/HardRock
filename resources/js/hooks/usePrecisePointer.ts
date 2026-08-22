import { useEffect, useState } from 'react';

/**
 * True only on a device that genuinely has a precise, hovering pointer at desktop
 * width — which is exactly the condition for mounting the hero character AND for
 * replacing the native cursor with the mosquito. The two decisions must agree:
 * hiding the cursor where the character never renders leaves a visitor with no
 * pointer at all.
 *
 * `hover: hover` also keeps it off tablets, where a tap would otherwise latch a
 * stale pointer position.
 *
 * Returns false on the server and on the first client render so the SSR HTML and
 * the hydrated tree match; it flips inside an effect, once a media query can
 * actually be read.
 */
const QUERY = '(hover: hover) and (pointer: fine) and (min-width: 1024px)';

export function usePrecisePointer(): boolean {
    const [precise, setPrecise] = useState(false);

    useEffect(() => {
        const mq = window.matchMedia(QUERY);
        const sync = () => setPrecise(mq.matches);
        sync();
        mq.addEventListener('change', sync);

        return () => mq.removeEventListener('change', sync);
    }, []);

    return precise;
}
