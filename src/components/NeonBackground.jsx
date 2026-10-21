import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';

// Shared neon backdrop: ambient glows, grid and animated wave lines.
const NeonBackground = () => {
    const reduce = useReducedMotion();

    return (
        <>
            {/* neon ambient background */}
            <div className="pointer-events-none absolute inset-0">
                <div className="absolute -top-40 left-1/2 h-[36rem] w-[36rem] -translate-x-1/2 rounded-full bg-cyan-500/20 blur-[120px]" />
                <div className="absolute bottom-[-12rem] left-[-8rem] h-[32rem] w-[32rem] rounded-full bg-fuchsia-600/20 blur-[130px]" />
                <div className="absolute bottom-[-14rem] right-[-6rem] h-[34rem] w-[34rem] rounded-full bg-blue-500/20 blur-[130px]" />
            </div>

            {/* subtle grid */}
            <div
                className="pointer-events-none absolute inset-0 opacity-[0.08]"
                style={{
                    backgroundImage:
                        'linear-gradient(rgba(0,229,255,0.6) 1px, transparent 1px), linear-gradient(90deg, rgba(0,229,255,0.6) 1px, transparent 1px)',
                    backgroundSize: '54px 54px',
                    maskImage:
                        'radial-gradient(ellipse at center, black 30%, transparent 78%)',
                }}
            />

            {/* animated wave lines at the base */}
            <div className="pointer-events-none absolute inset-x-0 bottom-0 h-64 overflow-hidden">
                {[0, 1, 2].map((n) => (
                    <motion.div
                        key={n}
                        className="absolute inset-x-[-20%] bottom-0 h-56 rounded-[100%] border-t"
                        style={{
                            borderColor:
                                n === 0
                                    ? 'rgba(0,229,255,0.35)'
                                    : n === 1
                                    ? 'rgba(120,80,255,0.28)'
                                    : 'rgba(255,60,190,0.2)',
                            bottom: `${-140 - n * 26}px`,
                            boxShadow:
                                n === 0
                                    ? '0 -10px 60px rgba(0,229,255,0.25)'
                                    : 'none',
                        }}
                        animate={
                            reduce
                                ? {}
                                : { x: ['-4%', '4%', '-4%'], y: [0, -10, 0] }
                        }
                        transition={{
                            duration: 8 + n * 2,
                            repeat: Infinity,
                            ease: 'easeInOut',
                        }}
                    />
                ))}
            </div>
        </>
    );
};

export default NeonBackground;
