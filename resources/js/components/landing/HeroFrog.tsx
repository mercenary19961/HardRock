import { useCallback, useEffect, useRef } from 'react';

import { usePrecisePointer } from '@/hooks/usePrecisePointer';

/**
 * The hero backdrop: a character who follows the visitor's cursor, and hunts for it
 * when it stops moving.
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
const SPAN = FRAME_COUNT - 1;

/**
 * Height of the fixed navbar, in px (`h-20`). The bar is transparent, so the
 * mosquito would otherwise be visible underneath it alongside the real arrow
 * cursor — which the nav keeps, since its links need a click affordance. Two
 * cursors in one strip reads as a bug, so the mosquito hides while the pointer
 * is up there. The frog goes on tracking; only the mosquito is withheld.
 */
const NAV_HEIGHT = 80;

/*
 * Idle behaviour. A still pointer means a still mosquito, and a character frozen
 * mid-stare reads as a broken image rather than as a character. So after a pause the
 * mosquito hides and he starts looking around for it, which is also the story: the
 * thing he was watching got away.
 *
 * ⚠️ The mosquito is the ONLY pointer over the hero (Hero hides the native arrow), so
 * hiding it while idle means the visitor briefly has no pointer at all. That is why
 * any movement returns it immediately, on the first mousemove rather than on a timer.
 */
const IDLE_AFTER = 2000;
/** Pace of a search turn, per pose. 59 poses × 34ms ≈ 2s for the full sweep. */
const IDLE_MS_PER_POSE = 34;
const IDLE_MIN_MS = 420;
/** A new look must cross at least this much of the sweep, or it reads as a twitch. */
const IDLE_MIN_TRAVEL = 0.35;
const IDLE_HOLD_MIN = 250;
const IDLE_HOLD_VARY = 700;
/** How long the head takes to swing back once the mosquito reappears. */
const RETURN_MS = 260;

const clamp01 = (t: number) => Math.min(1, Math.max(0, t));
/** Same easing as the cross-fade: quick through the middle, gentle at both ends. */
const smoothstep = (t: number) => t * t * (3 - 2 * t);

type Mode = 'track' | 'idle' | 'return';

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
    /** Last pose painted, as a float. Every mode hands off through this. */
    const poseRef = useRef(0);

    // Shared with Hero, which hides the native cursor on exactly this condition.
    const armed = usePrecisePointer();

    /**
     * Paints one pose. WHICH pose is the caller's business — the pointer decides it
     * while tracking, a timeline decides it while searching.
     */
    const renderPose = useCallback((exact: number) => {
        const imgs = imgsRef.current;
        if (imgs.length !== FRAME_COUNT) return;

        const pose = Math.min(SPAN, Math.max(0, exact));
        poseRef.current = pose;

        const lo = Math.min(SPAN, Math.floor(pose));
        const hi = Math.min(SPAN, lo + 1);
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
        const frac = smoothstep(clamp01(pose - lo));

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
    }, []);

    /**
     * Where the pointer is, in hero coordinates, plus the pose that looks at it.
     * Null until the pointer has been seen at all. One rect read per call, so callers
     * take everything they need from a single result.
     */
    const readPointer = useCallback(() => {
        const wrap = wrapRef.current;
        const vp = posRef.current;
        if (!wrap || vp.x < 0) return null;

        const r = wrap.getBoundingClientRect();
        return {
            x: vp.x - r.left,
            y: vp.y - r.top,
            pose: clamp01((vp.x - r.left) / r.width) * SPAN,
            // The navbar is fixed, so this is a viewport comparison.
            overNav: vp.y < NAV_HEIGHT,
        };
    }, []);

    const setSkeeterShown = useCallback((shown: boolean) => {
        const skeeter = skeeterRef.current;
        if (skeeter) skeeter.style.opacity = shown ? '1' : '0';
    }, []);

    useEffect(() => {
        if (!armed) return;

        /*
         * A head that turns on its own, indefinitely, is exactly what this setting is
         * meant to stop. Reduced motion keeps the pointer tracking (that is a direct
         * response to the visitor's own input, not an animation) and drops the search.
         */
        const calm = window.matchMedia('(prefers-reduced-motion: reduce)');

        let mode: Mode = 'track';
        let idleTimer: ReturnType<typeof setTimeout> | null = null;
        let onScreen = true;
        // Current search leg: he eases from one look to the next, then holds.
        let leg = { from: 0, to: 0, start: 0, dur: 0, hold: 0 };
        // Where the head was when the mosquito came back.
        let ret = { from: 0, start: 0 };

        const schedule = () => {
            if (!rafRef.current) rafRef.current = requestAnimationFrame(frame);
        };

        const clearIdleTimer = () => {
            if (idleTimer) {
                clearTimeout(idleTimer);
                idleTimer = null;
            }
        };

        const armIdleTimer = () => {
            clearIdleTimer();
            idleTimer = setTimeout(goIdle, IDLE_AFTER);
        };

        /** Picks somewhere new to look, far enough to read as a real turn. */
        const nextLeg = (at: number) => {
            const from = poseRef.current;
            let to = Math.random() * SPAN;
            if (Math.abs(to - from) < SPAN * IDLE_MIN_TRAVEL) {
                // Too close to be worth turning for: strike out toward the far end.
                const away = from > SPAN / 2 ? -1 : 1;
                to = from + away * SPAN * (IDLE_MIN_TRAVEL + Math.random() * 0.35);
            }
            to = Math.min(SPAN, Math.max(0, to));

            leg = {
                from,
                to,
                start: at,
                dur: Math.max(IDLE_MIN_MS, Math.abs(to - from) * IDLE_MS_PER_POSE),
                hold: IDLE_HOLD_MIN + Math.random() * IDLE_HOLD_VARY,
            };
        };

        const goIdle = () => {
            idleTimer = null;
            if (mode !== 'track' || calm.matches || !onScreen) return;

            mode = 'idle';
            setSkeeterShown(false);
            nextLeg(performance.now());
            schedule();
        };

        const frame = () => {
            rafRef.current = 0;

            if (mode === 'idle') {
                const now = performance.now();
                const k = clamp01((now - leg.start) / leg.dur);
                renderPose(leg.from + (leg.to - leg.from) * smoothstep(k));
                if (k >= 1 && now - (leg.start + leg.dur) >= leg.hold) nextLeg(now);
                schedule();
                return;
            }

            const p = readPointer();
            if (!p) {
                // The pointer has never been seen. Nothing to track, and nothing to
                // ease back to — leaving 'return' scheduled here would spin forever.
                if (mode === 'return') mode = 'track';
                return;
            }

            if (mode === 'return') {
                /*
                 * Eases from wherever the search left the head back onto the pointer.
                 * The target is re-read every frame rather than fixed at the start, so
                 * a visitor who keeps moving is converged on rather than chased to a
                 * position they have already left.
                 */
                const k = clamp01((performance.now() - ret.start) / RETURN_MS);
                renderPose(ret.from + (p.pose - ret.from) * smoothstep(k));
                if (k >= 1) mode = 'track';
            } else {
                renderPose(p.pose);
            }

            const skeeter = skeeterRef.current;
            if (skeeter) skeeter.style.transform = `translate(${p.x}px, ${p.y}px)`;
            setSkeeterShown(!p.overNav);

            if (mode === 'return') schedule();
        };

        const onMove = (e: MouseEvent) => {
            posRef.current = { x: e.clientX, y: e.clientY };
            if (mode === 'idle') {
                // Straight back to 'return', on the first movement rather than on a
                // timer: the mosquito is the visitor's pointer and must not lag it.
                mode = 'return';
                ret = { from: poseRef.current, start: performance.now() };
            }
            armIdleTimer();
            schedule();
        };

        // The pointer does not move during a wheel-scroll but the hero does, so the
        // mosquito has to be redrawn against the section's new position to stay under
        // the visitor's hand.
        window.addEventListener('mousemove', onMove, { passive: true });
        window.addEventListener('scroll', schedule, { passive: true });

        /*
         * Nobody watches a character they have scrolled past, and an rAF loop that runs
         * forever on a section nobody is looking at is a battery leak. Idling stops when
         * the hero leaves the viewport and picks up again when it returns.
         */
        const io = new IntersectionObserver(
            ([entry]) => {
                onScreen = entry.isIntersecting;
                if (onScreen) {
                    if (mode === 'track') armIdleTimer();
                    return;
                }
                clearIdleTimer();
                if (mode === 'idle') mode = 'track';
                if (rafRef.current) {
                    cancelAnimationFrame(rafRef.current);
                    rafRef.current = 0;
                }
            },
            { threshold: 0 },
        );
        if (wrapRef.current) io.observe(wrapRef.current);

        // He starts hunting on his own if the visitor never moves at all, which is the
        // usual case on a fresh page load.
        armIdleTimer();

        return () => {
            window.removeEventListener('mousemove', onMove);
            window.removeEventListener('scroll', schedule);
            io.disconnect();
            clearIdleTimer();
            if (rafRef.current) cancelAnimationFrame(rafRef.current);
            rafRef.current = 0;
        };
    }, [armed, readPointer, renderPose, setSkeeterShown]);

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
                pointer is ever on screen. It starts hidden, so it is never parked in the
                corner before the visitor has moved, and it fades rather than blinks when
                the search starts. */}
            <svg
                ref={skeeterRef}
                viewBox="0 0 40 40"
                className="absolute -ml-4 -mt-4 h-8 w-8 transition-opacity duration-300 will-change-transform"
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
