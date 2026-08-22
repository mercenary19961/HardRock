import { useCallback, useEffect, useRef } from 'react';

import { usePrecisePointer } from '@/hooks/usePrecisePointer';

/**
 * The hero backdrop: a character who follows the visitor's cursor.
 *
 * DESKTOP ONLY, by design. There is no cursor on a phone, so below `lg` this
 * renders nothing at all and the original hero (chevron, glow, "Reach The Peak")
 * is left exactly as it was.
 *
 * 🔑 It is a stack of stills, not a video. Seeking the source MP4 measured ~68ms
 * per jump, which cannot track a pointer; images have no decoder, so moving between
 * poses is an opacity change. It also works in Safari, where video currentTime
 * scrubbing does not, and it drops the dead holds at either end of the clip.
 *
 * ⚠️ Known limitation of the current footage: the character never turns to the
 * viewer's RIGHT — the sweep runs from profile-left to head-on and stops. The
 * mapping therefore spreads what exists evenly across the width rather than
 * pivoting head-on onto his screen position. He is not strictly looking AT the
 * cursor when it sits on him. A render covering both sides makes this mapping
 * correct with no code change.
 */

/*
 * 59 poses, taken from FROG_3 at its native 30fps and kept in the video's own
 * TEMPORAL order.
 *
 * 🔴 An earlier version sorted frames by a proxy for head angle (where the dark eye
 * pixels sat inside the head's bounding box). The proxy is noisy, and in the tail it
 * mis-ordered genuinely different poses — which is why the last stretch read as the
 * head turning back and then forward again. The video's own order is the rotation
 * order; nothing needs sorting.
 *
 * Selection is by monotonic pose PROGRESS: a frame is kept only if the head has
 * actually advanced since the last kept one, measured as pixel distance from the
 * first frame over the head region. That drops the holds at either end and the stall
 * in the middle in one rule, and guarantees the sequence only ever moves one way.
 */
const FRAME_COUNT = 59;
const FRAMES = Array.from({ length: FRAME_COUNT }, (_, i) => `/images/frog/f${String(i).padStart(3, '0')}.webp`);

/**
 * Height of the fixed navbar, in px (`h-20`). The bar is transparent, so the
 * mosquito would otherwise be visible underneath it alongside the real arrow
 * cursor — which the nav keeps, since its links need a click affordance. Two
 * cursors in one strip reads as a bug, so the mosquito hides while the pointer
 * is up there. The frog goes on tracking; only the mosquito is withheld.
 */
const NAV_HEIGHT = 80;

export default function HeroFrog() {
    const wrapRef = useRef<HTMLDivElement>(null);
    const imgsRef = useRef<HTMLImageElement[]>([]);
    const skeeterRef = useRef<SVGSVGElement>(null);
    const rafRef = useRef(0);
    // VIEWPORT coordinates, not hero-relative ones, so that a scroll can be repainted
    // from the last known pointer position. Storing hero-relative coordinates would
    // let the mosquito ride up with the section on a wheel-scroll and sit somewhere
    // the pointer is not — which was invisible before, but the native cursor is now
    // hidden here, so the mosquito is the only pointer the visitor has. -1 means the
    // pointer has not been seen yet.
    const posRef = useRef({ x: -1, y: -1 });
    const pairRef = useRef({ lo: 0, hi: 0 });

    // Shared with Hero, which hides the native cursor on exactly this condition.
    const armed = usePrecisePointer();

    const paint = useCallback(() => {
        rafRef.current = 0;
        const wrap = wrapRef.current;
        const imgs = imgsRef.current;
        if (!wrap || imgs.length !== FRAME_COUNT) return;

        const r = wrap.getBoundingClientRect();
        const vp = posRef.current;
        if (vp.x < 0) return;
        const x = vp.x - r.left;
        const y = vp.y - r.top;

        // ABSOLUTE mapping: cursor position maps straight onto a pose, so where he
        // looks always corresponds to where the visitor actually is. Accumulating
        // deltas instead (the usual implementation of this effect) drifts, which is
        // fine for an abstract shape and fatal for a face.
        const t = Math.min(1, Math.max(0, x / r.width));
        const exact = t * (FRAME_COUNT - 1);
        const lo = Math.min(FRAME_COUNT - 1, Math.floor(exact));
        const hi = Math.min(FRAME_COUNT - 1, lo + 1);
        /*
         * Eased, not linear.
         *
         * Cross-fading two poses is a double exposure: at 50/50 it costs ~15% of the
         * head's edge detail, which reads as blur. The cost cannot be removed without
         * more real poses, but the TIME spent near 50/50 can be — smoothstep passes
         * through the middle faster and lingers near a pure frame, so most positions
         * show something close to a single sharp image.
         *
         * ⚠️ Do not "fix" softness by duplicating frames: a duplicate carries no new
         * pose, so it just parks the same image over more cursor travel — a dead spot
         * rather than smoother motion.
         */
        const raw = exact - lo;
        const frac = raw * raw * (3 - 2 * raw);

        const prev = pairRef.current;
        if (prev.lo !== lo || prev.hi !== hi) {
            imgs[prev.lo].style.opacity = '0';
            imgs[prev.hi].style.opacity = '0';
            pairRef.current = { lo, hi };
        }
        // ⚠️ hi FIRST, then lo. At the end of the sequence they are the same element,
        // and writing the fraction second would set it to 0 — the character then
        // disappears for that whole stretch of the screen.
        imgs[hi].style.opacity = String(frac);
        imgs[lo].style.opacity = '1';

        const skeeter = skeeterRef.current;
        if (skeeter) {
            skeeter.style.transform = `translate(${x}px, ${y}px)`;
            // The navbar is fixed, so this is a viewport comparison. It also doubles as
            // the reveal: the mosquito renders at opacity 0, so it is never parked in
            // the corner before the visitor has moved.
            skeeter.style.opacity = vp.y < NAV_HEIGHT ? '0' : '1';
        }
    }, []);

    useEffect(() => {
        if (!armed) return;
        const schedule = () => {
            if (!rafRef.current) rafRef.current = requestAnimationFrame(paint);
        };
        const onMove = (e: MouseEvent) => {
            posRef.current = { x: e.clientX, y: e.clientY };
            schedule();
        };
        window.addEventListener('mousemove', onMove, { passive: true });
        // The pointer does not move during a wheel-scroll but the hero does, so the
        // mosquito has to be redrawn against the section's new position to stay under
        // the visitor's hand.
        window.addEventListener('scroll', schedule, { passive: true });

        return () => {
            window.removeEventListener('mousemove', onMove);
            window.removeEventListener('scroll', schedule);
            if (rafRef.current) cancelAnimationFrame(rafRef.current);
            rafRef.current = 0;
        };
    }, [armed, paint]);

    if (!armed) return null;

    return (
        <div ref={wrapRef} className="pointer-events-none absolute inset-0 hidden overflow-hidden lg:block" aria-hidden="true">
            {FRAMES.map((src, i) => (
                <img
                    key={src}
                    ref={(el) => {
                        if (el) imgsRef.current[i] = el;
                    }}
                    src={src}
                    alt=""
                    decoding="sync"
                    // Every frame is in the DOM from the start; only opacity changes.
                    // Swapping a single src would decode on demand and stutter on the
                    // first pass through the sweep.
                    className="absolute inset-0 h-full w-full object-cover"
                    style={{ objectPosition: '50% 40%', opacity: i === 0 ? 1 : 0 }}
                />
            ))}

            {/* Copy sits over this. The backdrop is mid-luminance purple, so the
                brand's purple-to-red gradient headline all but vanished on it —
                white was fine, the gradient was not. Darkening the copy side keeps
                the gradient intact rather than recolouring it for one breakpoint. */}
            <div className="absolute inset-0 bg-gradient-to-r from-black/75 via-black/25 to-transparent" />

            {/* The cursor IS the mosquito he is watching — without it a visitor sees a
                character looking around for no reason. Hero hides the native arrow over
                this section (on the same usePrecisePointer condition) so only one
                pointer is ever on screen. */}
            <svg
                ref={skeeterRef}
                viewBox="0 0 40 40"
                className="absolute -ml-4 -mt-4 h-8 w-8 transition-opacity duration-150 will-change-transform"
                style={{ opacity: 0 }}
            >
                <g fill="none" stroke="#1a1020" strokeWidth="1.6" strokeLinecap="round">
                    <ellipse cx="20" cy="22" rx="2.6" ry="6.4" fill="#241634" stroke="none" />
                    <path d="M20 15.5 L20 9" />
                    <circle cx="20" cy="7.6" r="2.5" fill="#241634" stroke="none" />
                    <path d="M18.6 6 L16.4 2.6M21.4 6 L23.6 2.6" />
                    <path d="M17.6 19 L9 14M17.6 22 L9.4 21M22.4 19 L31 14M22.4 22 L30.6 21" />
                </g>
                <g fill="rgba(255,255,255,.5)" stroke="rgba(26,16,32,.5)" strokeWidth=".8">
                    <ellipse cx="13" cy="16.5" rx="7" ry="2.7" transform="rotate(-22 13 16.5)" />
                    <ellipse cx="27" cy="16.5" rx="7" ry="2.7" transform="rotate(22 27 16.5)" />
                </g>
            </svg>
        </div>
    );
}
