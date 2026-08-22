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
 * mid-stare reads as a broken image rather than as a character. So after a second the
 * mosquito hides and he sweeps the whole room looking for it, which is also the story:
 * the thing he was watching got away.
 *
 * ⚠️ The mosquito is the ONLY pointer over the hero (Hero hides the native arrow), so
 * hiding it while idle means the visitor briefly has no pointer at all. That is why
 * any movement returns it immediately, on the first mousemove rather than on a timer.
 */
const IDLE_AFTER = 1000;
/**
 * One end-to-end sweep of the head; a full there-and-back takes twice this.
 *
 * 🔑 The search is ONE continuous sweep, end to end and back, not a series of looks at
 * chosen poses. An earlier version picked random targets and held on each: every hold
 * was a stop, every stop showed a single frame in isolation, and the whole thing read as
 * a video being scrubbed rather than a head turning. Sweeping the full range means the
 * only thing on screen is motion, which is also the one condition under which the
 * cross-fade blur is invisible.
 *
 * ⚠️ Driven by a cosine, not a linear ping-pong. Reversing a constant velocity at the
 * ends snaps; a cosine arrives at each extreme with zero velocity and turns around
 * smoothly, which is exactly how a head actually moves.
 */
const SWEEP_MS = 2400;
/** How long the head takes to swing back once the mosquito reappears. */
const RETURN_MS = 260;

/**
 * The hero opens mid-hunt: he is already sweeping when the page arrives, and the pointer
 * cannot take his head until this is up. Without it the first thing a visitor sees is a
 * character standing dead still, which reads as a background image rather than as
 * something alive — the effect only announces itself once he moves.
 *
 * ⚠️ The mosquito still tracks the pointer throughout, it is only the HEAD that ignores
 * it. Hiding the pointer for two seconds on arrival would strand a visitor who reaches
 * for the CTA immediately, and the story survives intact: the mosquito is in the room,
 * he simply has not spotted it yet.
 *
 * At `SWEEP_MS` 2400 this covers about 83% of one pass. Raise it to 2400 for exactly one
 * full pass, or 4800 for a complete there-and-back.
 */
const INTRO_MS = 2000;

/*
 * 🔑 He must never come to REST between two frames.
 *
 * A cross-fade is a double exposure, worth ~15% of the head's edge detail at 50/50.
 * While he is moving that is invisible; parked, it is a permanently soft frame, and it
 * reads exactly like a video paused between keyframes. The idle sweep never stops, so
 * this only applies where he genuinely comes to rest: the pointer going still.
 *
 * Measured on the current 59: sharpness (variance of the Laplacian over the head)
 * spans only 1.47x end to end, worst frame 83% of median, best 121%. So no single
 * frame is meaningfully blurry — a mid-blend rest is as soft as the WORST frame in the
 * set, and lands there from any pose. Snapping to a whole frame is therefore the whole
 * fix; hand-picking "sharp" frames to stop on would buy almost nothing on top.
 */
const SETTLE_AFTER = 200;
const SETTLE_MS = 160;

const clamp01 = (t: number) => Math.min(1, Math.max(0, t));
/** Same easing as the cross-fade: quick through the middle, gentle at both ends. */
const smoothstep = (t: number) => t * t * (3 - 2 * t);

type Mode = 'track' | 'idle' | 'return' | 'settle';

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
        let settleTimer: ReturnType<typeof setTimeout> | null = null;
        let onScreen = true;
        // The search sweep, as a phase into a cosine: 0 is one extreme, π the other.
        let sweep = { phase0: 0, start: 0 };

        const openedAt = performance.now();
        /** True while the opening hunt still owns the head. */
        const inIntro = () => performance.now() - openedAt < INTRO_MS;
        // Where the head was when the mosquito came back.
        let ret = { from: 0, start: 0 };
        // The nudge onto a whole frame once the pointer goes still.
        let stl = { from: 0, to: 0, start: 0 };

        const schedule = () => {
            if (!rafRef.current) rafRef.current = requestAnimationFrame(frame);
        };

        const clearTimers = () => {
            if (idleTimer) {
                clearTimeout(idleTimer);
                idleTimer = null;
            }
            if (settleTimer) {
                clearTimeout(settleTimer);
                settleTimer = null;
            }
        };

        const armTimers = () => {
            clearTimers();
            settleTimer = setTimeout(goSettle, SETTLE_AFTER);
            idleTimer = setTimeout(goIdle, IDLE_AFTER);
        };

        /**
         * The pointer has gone still. Nudge the head onto the nearest whole frame so it
         * rests on a real photograph rather than on a blend of two. At most half a pose,
         * well under a degree of rotation — invisible as movement, decisive for
         * sharpness. Unconditional, including under reduced motion: it is a correction,
         * not decoration, and a soft frozen frame is a worse outcome for everyone.
         */
        const goSettle = () => {
            settleTimer = null;
            if (mode !== 'track') return;

            const from = poseRef.current;
            const to = Math.round(from);
            if (Math.abs(to - from) < 0.005) return;

            stl = { from, to, start: performance.now() };
            mode = 'settle';
            schedule();
        };

        const goIdle = () => {
            idleTimer = null;
            if (mode !== 'track' || calm.matches || !onScreen) return;

            mode = 'idle';
            /*
             * Enter the sweep at the phase that already matches where the head is, so
             * the hunt starts from his current pose rather than snapping to an end.
             * acos returns [0, π], which puts him on the outbound leg from wherever he
             * happens to be looking.
             */
            sweep = {
                phase0: Math.acos(1 - 2 * clamp01(poseRef.current / SPAN)),
                start: performance.now(),
            };
            schedule();
        };

        const frame = () => {
            rafRef.current = 0;

            if (mode === 'idle') {
                // One unbroken cosine: end to end, back again, forever. No targets, no
                // holds, nothing to land on — the phase just keeps advancing.
                const phase = sweep.phase0 + (Math.PI * (performance.now() - sweep.start)) / SWEEP_MS;
                renderPose((SPAN / 2) * (1 - Math.cos(phase)));

                if (inIntro()) {
                    // Opening hunt: the head is his, but the mosquito is still the
                    // visitor's pointer and has to keep up with it.
                    const p = readPointer();
                    if (p) {
                        const skeeter = skeeterRef.current;
                        if (skeeter) skeeter.style.transform = `translate(${p.x}px, ${p.y}px)`;
                        setSkeeterShown(!p.overNav);
                    }
                } else {
                    // Also what hides it the moment the intro lapses, if a visitor moved
                    // during the opening and then went still.
                    setSkeeterShown(false);
                }

                schedule();
                return;
            }

            if (mode === 'settle') {
                // The pointer is not moving, so the mosquito needs no repositioning and
                // keeps whatever visibility the last tracked frame gave it.
                const k = clamp01((performance.now() - stl.start) / SETTLE_MS);
                renderPose(stl.from + (stl.to - stl.from) * smoothstep(k));
                if (k >= 1) mode = 'track';
                else schedule();
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
            if (mode === 'idle' && !inIntro()) {
                // Straight back to 'return', on the first movement rather than on a
                // timer: the mosquito is the visitor's pointer and must not lag it.
                // During the intro this is skipped, and the sweep keeps the head.
                mode = 'return';
                ret = { from: poseRef.current, start: performance.now() };
            } else if (mode === 'settle') {
                // Abandon the nudge; tracking is absolute, so the next frame simply
                // paints the pointer's pose and the half-frame difference never shows.
                mode = 'track';
            }
            armTimers();
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
                    if (mode === 'track') armTimers();
                    return;
                }
                clearTimers();
                if (mode === 'idle') mode = 'track';
                if (rafRef.current) {
                    cancelAnimationFrame(rafRef.current);
                    rafRef.current = 0;
                }
            },
            { threshold: 0 },
        );
        if (wrapRef.current) io.observe(wrapRef.current);

        /*
         * The hero opens on the hunt rather than on a still frame — see INTRO_MS. After
         * it lapses this is also what keeps him hunting when the visitor never moves at
         * all, which is the usual case on a fresh page load.
         *
         * goIdle's own guards do the rest: reduced motion and an off-screen hero both
         * fall through to plain tracking, exactly as before.
         */
        armTimers();
        goIdle();

        return () => {
            window.removeEventListener('mousemove', onMove);
            window.removeEventListener('scroll', schedule);
            io.disconnect();
            clearTimers();
            if (rafRef.current) cancelAnimationFrame(rafRef.current);
            rafRef.current = 0;
        };
    }, [armed, readPointer, renderPose, setSkeeterShown]);

    if (!armed) return null;

    return (
        <>
            {/* Backdrop: the frames and the scrim, deliberately BELOW the hero copy. */}
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
            </div>

            <Mosquito innerRef={skeeterRef} />
        </>
    );
}

/**
 * The mosquito, in its own layer ABOVE the hero copy.
 *
 * 🔴 It cannot live in the backdrop with the frames. The hero's content column is
 * `relative z-10`, so anything painted with the frames goes UNDER it — over the CTA,
 * whose gradient is opaque, the mosquito vanished completely and the visitor was left
 * with no pointer at all, because Hero has hidden the native arrow.
 *
 * Same box as the backdrop (`absolute inset-0` on the same section), so the
 * coordinates it is painted at need no adjustment. `overflow-hidden` still clips it to
 * the hero, and `pointer-events-none` keeps the CTA clickable through it.
 */
function Mosquito({ innerRef }: { innerRef: React.RefObject<SVGSVGElement> }) {
    return (
        <div className="pointer-events-none absolute inset-0 z-20 hidden overflow-hidden lg:block" aria-hidden="true">
            {/* The cursor IS the mosquito he is watching — without it a visitor sees a
                character looking around for no reason. It starts hidden, so it is never
                parked in the corner before the visitor has moved, and it fades rather
                than blinks when the search starts. */}
            {/* 🔴 `left-0 top-0` is REQUIRED, not tidiness. Without an explicit offset an
                absolute box sits at its static position, which under `dir="rtl"` is the
                RIGHT edge of the container — the transform below then pushed it further
                right, off the hero and into the clip, so the mosquito simply vanished in
                Arabic. Physical `left`, deliberately, never the logical `start-0`: the
                coordinates come from `r.left`, which is physical too. */}
            <svg
                ref={innerRef}
                viewBox="0 0 40 40"
                className="absolute left-0 top-0 -ml-4 -mt-4 h-8 w-8 transition-opacity duration-300 will-change-transform"
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
