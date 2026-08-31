import { useEffect, useRef } from 'react';
import { motion, useMotionValue, useReducedMotion, useSpring, useTransform } from 'framer-motion';

import { usePrecisePointer } from '@/hooks/usePrecisePointer';

/**
 * The "Why HardRock" artwork: the existing AI-head render, put inside an orbital
 * system so the section reads as a machine that is running rather than a picture
 * that is sitting there.
 *
 * 🔑 The rings are concentric with the DISC BAKED INTO THE IMAGE, not with the
 * image box. `why-hardrock.webp` is 746x904 with a hard-edged purple-to-red
 * circle painted into it and the head overhanging the top of that circle, so
 * centring the rings on the file would have put them visibly off the disc they
 * are supposed to hug. Measured off the pixels (widest opaque row, then fitted):
 * centre (372.5, 530), radius 333.5.
 *
 * Everything below is expressed as a fraction of the image WIDTH, because that is
 * what `left` and `width` percentages resolve against. `top` resolves against the
 * box HEIGHT instead, hence the extra division by the aspect ratio on every
 * vertical figure. Re-measure all four constants if the render is ever replaced.
 */
// The disc itself: rings drawn at r=50 in the viewBox below land exactly on its edge.
const DISC = {
    left: '5.228%',
    top: '21.737%',
    width: '89.410%',
};

// A second square at 1.28x the disc radius, matching the r=64 ring. The orbiting
// nodes ride this one, so they sit on that ring rather than near it.
const ORBIT = {
    left: '-7.290%',
    top: '11.407%',
    width: '114.445%',
};

// How far each layer slides under the pointer, in px. The head moves furthest and
// the rings least, so the head separates from the field instead of the whole
// picture sliding as one flat plane.
const HEAD_SHIFT = 10;
const RING_SHIFT = 4;

export default function NeuralCore() {
    const wrapRef = useRef<HTMLDivElement>(null);

    // Parallax is a response to the visitor's own pointer, so it is gated on the
    // same precise-pointer test the hero character uses: a tablet would otherwise
    // latch one stale position on tap and hold the artwork off-centre.
    const precise = usePrecisePointer();
    const reduceMotion = useReducedMotion();
    const parallaxOn = precise && !reduceMotion;

    // 🔴 Motion values, never useState. A pointer position stored in state
    // re-renders this tree on every mousemove; a motion value is written outside
    // React entirely and only touches the transform.
    const px = useMotionValue(0);
    const py = useMotionValue(0);
    const sx = useSpring(px, { stiffness: 90, damping: 22, mass: 0.6 });
    const sy = useSpring(py, { stiffness: 90, damping: 22, mass: 0.6 });

    const headX = useTransform(sx, (v) => v * HEAD_SHIFT);
    const headY = useTransform(sy, (v) => v * HEAD_SHIFT);
    const ringX = useTransform(sx, (v) => v * RING_SHIFT);
    const ringY = useTransform(sy, (v) => v * RING_SHIFT);

    useEffect(() => {
        if (!parallaxOn) return;

        // Listening on the section rather than on window means the handler is idle
        // for the whole rest of the page instead of firing on every pointer move
        // and throwing the result away.
        const section = wrapRef.current?.closest('section');
        if (!section) return;

        const handleMove = (e: PointerEvent) => {
            const r = section.getBoundingClientRect();
            // -1..1 across the section, clamped so a pointer at the very edge does
            // not push the artwork further than the design allows.
            const nx = ((e.clientX - r.left) / r.width) * 2 - 1;
            const ny = ((e.clientY - r.top) / r.height) * 2 - 1;
            px.set(Math.max(-1, Math.min(1, nx)));
            py.set(Math.max(-1, Math.min(1, ny)));
        };

        // Returning to rest on leave, rather than freezing wherever the pointer
        // left the section, is what keeps a scrolled-past section looking settled.
        const handleLeave = () => {
            px.set(0);
            py.set(0);
        };

        section.addEventListener('pointermove', handleMove);
        section.addEventListener('pointerleave', handleLeave);

        return () => {
            section.removeEventListener('pointermove', handleMove);
            section.removeEventListener('pointerleave', handleLeave);
        };
    }, [parallaxOn, px, py]);

    // ⚠️ The width cap on the SMALLEST screens is expressed against the viewport
    // rather than as a fixed step. The rings overflow this box by design (the node
    // ring is 1.144x the image width, the outer dashed one 1.287x), so a flat
    // `max-w-[340px]` pushed the node ring past the `100vw - 2rem` gutter on a phone
    // and the section's `overflow-hidden` sliced dots in half at both edges.
    // `84vw - 54px` keeps the whole node ring inside the gutter at every width down
    // to 320px, and the 340px ceiling stops it growing once `sm:` takes over anyway.
    return (
        <div
            ref={wrapRef}
            className="relative mx-auto w-full max-w-[min(84vw_-_54px,340px)] sm:max-w-[420px] lg:max-w-[480px]"
            style={{ aspectRatio: '746 / 904' }}
        >
            {/* Halo. Sits behind the head and breathes, so the disc reads as lit
                from within rather than pasted on.

                🔴 The parallax and the breathing are on SEPARATE elements, and they
                have to be. A CSS animation replaces the whole `transform` property,
                so `animate-core-breathe` (which sets `scale()`) silently discarded
                the `x`/`y` this component writes and the halo never moved at all.
                Outer element parallaxes, inner element scales. */}
            <motion.div
                aria-hidden
                className="pointer-events-none absolute"
                style={{ ...DISC, aspectRatio: '1', x: headX, y: headY }}
            >
                <div className="animate-core-breathe h-full w-full rounded-full bg-gradient-to-br from-brand-purple via-fuchsia-500 to-brand-red blur-3xl" />
            </motion.div>

            {/* Rings. One fine dotted ring on the disc edge turning one way, a pair
                of arcs turning the other, and a static outer ring the nodes ride. */}
            <motion.div
                aria-hidden
                className="pointer-events-none absolute"
                style={{ ...DISC, aspectRatio: '1', x: ringX, y: ringY }}
            >
                <svg
                    viewBox="0 0 100 100"
                    fill="none"
                    className="h-full w-full overflow-visible"
                >
                    <defs>
                        <linearGradient id="hr-core-ring" x1="0" y1="0" x2="1" y2="1">
                            <stop offset="0%" stopColor="#660adb" />
                            <stop offset="100%" stopColor="#ff3c2b" />
                        </linearGradient>
                    </defs>

                    {/* ⚠️ transform-box: fill-box on every rotating circle. Without it
                        an SVG child rotates about the viewBox origin, which swings the
                        ring across the page instead of turning it in place. */}
                    <circle
                        cx="50"
                        cy="50"
                        r="50"
                        stroke="url(#hr-core-ring)"
                        strokeWidth="0.4"
                        strokeDasharray="0.8 5"
                        strokeLinecap="round"
                        className="animate-core-spin opacity-70 [transform-box:fill-box] [transform-origin:center]"
                    />
                    <circle
                        cx="50"
                        cy="50"
                        r="57"
                        stroke="url(#hr-core-ring)"
                        strokeWidth="0.55"
                        strokeDasharray="26 90"
                        strokeLinecap="round"
                        className="animate-core-spin-reverse opacity-90 [transform-box:fill-box] [transform-origin:center]"
                    />
                    {/* ⚠️ This is the ring the nodes ride, so it is the one ring that
                        must read as a track. At 0.3/15% it was effectively invisible
                        and the dots looked like they were floating between the two
                        rings either side of it rather than orbiting on anything.
                        Static on purpose: a dashed ring turning at its own speed
                        under the dots would make them look like they were sliding. */}
                    <circle
                        cx="50"
                        cy="50"
                        r="64"
                        stroke="currentColor"
                        strokeWidth="0.5"
                        className="text-black/30 dark:text-white/30"
                    />
                    <circle
                        cx="50"
                        cy="50"
                        r="72"
                        stroke="url(#hr-core-ring)"
                        strokeWidth="0.35"
                        strokeDasharray="4 14"
                        className="animate-core-spin-slow opacity-40 [transform-box:fill-box] [transform-origin:center]"
                    />
                </svg>
            </motion.div>

            {/* Nodes riding the r=64 ring. The wrapper turns; each arm is a fixed
                rotation inside it, which spaces the three evenly with no delay
                arithmetic and keeps them locked to each other.

                🔴 Three nested elements, not one, for the same reason as the halo.
                The dot is centred on its point with `-translate-x-1/2
                -translate-y-1/2`, and `animate-core-node` sets `transform: scale()`
                — which REPLACES that translate, because an animated value beats a
                declared one. Each dot then sat half its own width off the ring, in a
                direction that depended on its arm's rotation, so the three landed at
                measurably different radii (63.3 / 63.3 / 64.0 viewBox units against a
                ring at 64). Positioning wrapper outside, animation inside. */}
            <motion.div
                aria-hidden
                className="pointer-events-none absolute"
                style={{ ...ORBIT, aspectRatio: '1', x: ringX, y: ringY }}
            >
                <div className="animate-core-spin-reverse absolute inset-0">
                    {[0, 120, 240].map((deg) => (
                        <div
                            key={deg}
                            className="absolute inset-0"
                            style={{ transform: `rotate(${deg}deg)` }}
                        >
                            <span className="absolute left-1/2 top-0 -translate-x-1/2 -translate-y-1/2">
                                <span
                                    className="animate-core-node block h-2 w-2 rounded-full bg-brand-red shadow-[0_0_10px_2px] shadow-brand-red/50"
                                    style={{ animationDelay: `${(deg / 120) * 1.1}s` }}
                                />
                            </span>
                        </div>
                    ))}
                </div>
            </motion.div>

            {/* The render itself, on top of everything and moving furthest. */}
            <motion.img
                src="/images/why-hardrock.webp"
                alt="Why HardRock"
                title="Why HardRock"
                loading="lazy"
                width={746}
                height={904}
                className="relative h-full w-full object-contain drop-shadow-2xl"
                style={{ x: headX, y: headY }}
            />
        </div>
    );
}
