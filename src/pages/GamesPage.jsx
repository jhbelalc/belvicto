import React, { useEffect, useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { Play } from 'lucide-react';
import NeonBackground from '@/components/NeonBackground';
import { GAMES } from '@/data/games';

const NEON_LINK =
    'font-mono text-[0.7rem] font-semibold uppercase tracking-[0.35em] text-cyan-200/80 transition hover:text-cyan-100';
const NEON_GLOW = { textShadow: '0 0 10px rgba(0,229,255,0.5)' };

const QUOTE = 'All work and no play makes Jack a dull boy.';

// Types the quote out one character at a time, as on the film's typewriter.
const TypedQuote = () => {
    const reduce = useReducedMotion();
    const [count, setCount] = useState(0);

    useEffect(() => {
        if (reduce || count >= QUOTE.length) return undefined;
        const id = setTimeout(() => setCount((c) => c + 1), 70);
        return () => clearTimeout(id);
    }, [count, reduce]);

    const shown = reduce ? QUOTE : QUOTE.slice(0, count);

    return (
        <p
            aria-label={QUOTE}
            className="mx-auto min-h-[3.5rem] max-w-xl font-mono text-base leading-relaxed text-cyan-50/90 sm:min-h-0 sm:text-lg"
        >
            <span aria-hidden="true">{shown}</span>
            {!reduce && (
                <span
                    aria-hidden="true"
                    className="ml-0.5 inline-block h-[1.1em] w-[0.55em] translate-y-[0.2em] animate-pulse bg-cyan-300/80"
                />
            )}
        </p>
    );
};

const GameCard = ({ game }) => (
    <motion.article
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="rounded-2xl border border-cyan-400/25 bg-[#050b16]/70 p-6 text-left shadow-[0_0_40px_rgba(0,229,255,0.1)] sm:p-8"
    >
        <div className="flex items-center gap-5">
            <img
                src={game.icon}
                alt={`${game.name} icon`}
                className="h-20 w-20 rounded-[22%] shadow-[0_0_25px_rgba(0,229,255,0.35)] sm:h-24 sm:w-24"
            />
            <div>
                <h2 className="neon-text font-mono text-3xl font-semibold tracking-wide sm:text-4xl">
                    {game.name}
                </h2>
                <p className="mt-1 font-mono text-[0.65rem] uppercase tracking-[0.3em] text-cyan-300/70">
                    {game.tagline}
                </p>
            </div>
        </div>

        <p className="mt-6 text-base font-light leading-relaxed text-cyan-50/90">
            {game.intro}
        </p>

        <ul className="mt-4 space-y-2 text-sm font-light leading-relaxed text-cyan-50/80">
            {game.facts.map((text) => (
                <li key={text} className="flex gap-2">
                    <span className="text-cyan-400/70">•</span>
                    <span>{text}</span>
                </li>
            ))}
        </ul>

        <a
            href={game.url}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-7 inline-flex items-center gap-2 rounded-lg border border-cyan-400/50 bg-cyan-400/10 px-6 py-3 font-mono text-xs uppercase tracking-[0.3em] text-cyan-100 transition hover:bg-cyan-400/20 hover:shadow-[0_0_24px_rgba(0,229,255,0.45)]"
        >
            <Play className="h-4 w-4" strokeWidth={1.75} />
            Play {game.name}
        </a>
    </motion.article>
);

const GamesPage = () => (
    <main className="relative min-h-[100dvh] overflow-hidden bg-[#04070f] text-[#eafcff]">
        <NeonBackground />

        <div className="relative z-10 mx-auto max-w-4xl px-6 py-16">
            <header className="text-center">
                <h1 className="font-mono text-3xl font-semibold tracking-[0.35em] text-white sm:text-4xl">
                    <span className="neon-text">PLAY</span>
                </h1>
                <div className="mt-5">
                    <TypedQuote />
                </div>
                <p className="mt-3 font-mono text-[0.7rem] uppercase tracking-[0.45em] text-cyan-300/70">
                    So here are our games
                </p>
                <div className="mt-6 flex flex-wrap justify-center gap-x-8 gap-y-2">
                    <a href="/" className={NEON_LINK} style={NEON_GLOW}>
                        Home
                    </a>
                    <a href="/projects" className={NEON_LINK} style={NEON_GLOW}>
                        Projects
                    </a>
                    <a href="/highlights" className={NEON_LINK} style={NEON_GLOW}>
                        Highlights
                    </a>
                </div>
            </header>

            <div className="mt-12 space-y-10">
                {GAMES.map((game) => (
                    <GameCard key={game.id} game={game} />
                ))}
            </div>
        </div>
    </main>
);

export default GamesPage;
