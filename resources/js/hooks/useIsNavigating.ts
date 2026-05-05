import { useEffect, useState } from 'react';
import { router } from '@inertiajs/react';

// True while an Inertia request is in flight. Useful for showing
// scoped skeleton screens during in-page navigation (filters,
// pagination, tabs).
export function useIsNavigating(): boolean {
    const [navigating, setNavigating] = useState(false);

    useEffect(() => {
        const offStart = router.on('start', () => setNavigating(true));
        const offFinish = router.on('finish', () => setNavigating(false));
        return () => {
            offStart();
            offFinish();
        };
    }, []);

    return navigating;
}
