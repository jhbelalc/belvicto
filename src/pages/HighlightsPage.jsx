import React from 'react';
import { motion } from 'framer-motion';
import { ExternalLink } from 'lucide-react';
import NeonBackground from '@/components/NeonBackground';
import { HIGHLIGHTS } from '@/data/highlights';

const NEON_LINK =
    'font-mono text-[0.7rem] font-semibold uppercase tracking-[0.35em] text-cyan-200/80 transition hover:text-cyan-100';
const NEON_GLOW = { textShadow: '0 0 10px rgba(0,229,255,0.5)' };

const watchUrl = (v) =>
    v.type === 'short'
        ? `https://www.youtube.com/shorts/${v.id}`
        : `https://www.youtube.com/watch?v=${v.id}`;

const VideoFrame = ({ video }) => {
    const isShort = video.type === 'short';
    return (
        <figure
            className={
                isShort ? 'w-[15rem] max-w-full' : 'w-full max-w-[34rem]'
            }
        >
            <div
                className={`overflow-hidden rounded-xl border border-cyan-400/30 bg-black shadow-[0_0_30px_rgba(0,229,255,0.15)] ${
                    isShort ? 'aspect-[9/16]' : 'aspect-video'
                }`}
            >
                <iframe
                    src={`https://www.youtube-nocookie.com/embed/${video.id}?rel=0`}
                    title={video.title}
                    loading="lazy"
                    allow="accelerometer; encrypted-media; picture-in-picture; fullscreen"
                    allowFullScreen
                    referrerPolicy="strict-origin-when-cross-origin"
                    className="h-full w-full"
                />
            </div>
            <a
                href={watchUrl(video)}
                target="_blank"
                rel="noopener noreferrer"
                className={`${NEON_LINK} mt-3 inline-flex items-center gap-2`}
                style={NEON_GLOW}
            >
                Open on YouTube{' '}
                <ExternalLink className="h-3 w-3" strokeWidth={1.75} />
            </a>
        </figure>
    );
};

const HighlightCard = ({ item }) => (
    <motion.article
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="rounded-2xl border border-cyan-400/25 bg-[#050b16]/70 p-6 text-left shadow-[0_0_40px_rgba(0,229,255,0.1)] sm:p-8"
    >
        <div className="flex items-center gap-5">
            <img
                src={item.logo}
                alt={`${item.name} logo`}
                className="h-20 w-20 rounded-[22%] shadow-[0_0_25px_rgba(0,229,255,0.35)] sm:h-24 sm:w-24"
            />
            <div>
                <h2 className="neon-text font-mono text-3xl font-semibold tracking-wide sm:text-4xl">
                    {item.name}
                </h2>
                <p className="mt-1 font-mono text-[0.65rem] uppercase tracking-[0.3em] text-cyan-300/70">
                    {item.tagline}
                </p>
                {item.storeUrl && (
                    <a
                        href={item.storeUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`${NEON_LINK} mt-3 inline-flex items-center gap-2`}
                        style={NEON_GLOW}
                    >
                        App Store{' '}
                        <ExternalLink className="h-3 w-3" strokeWidth={1.75} />
                    </a>
                )}
            </div>
        </div>

        <p className="mt-6 text-base font-light leading-relaxed text-cyan-50/90">
            {item.intro}
        </p>

        <div className="mt-6 grid gap-6 sm:grid-cols-2">
            {item.sections.map((section) => (
                <div key={section.title}>
                    <h3 className="font-mono text-xs font-semibold uppercase tracking-[0.3em] text-cyan-300">
                        {section.title}
                    </h3>
                    <ul className="mt-3 space-y-2 text-sm font-light leading-relaxed text-cyan-50/80">
                        {section.items.map((text) => (
                            <li key={text} className="flex gap-2">
                                <span className="text-cyan-400/70">•</span>
                                <span>{text}</span>
                            </li>
                        ))}
                    </ul>
                </div>
            ))}
        </div>

        {item.outro && (
            <p className="mt-6 text-sm font-light leading-relaxed text-cyan-50/70">
                {item.outro}
            </p>
        )}

        {item.videos?.length > 0 && (
            <div className="mt-8">
                <h3 className="font-mono text-xs font-semibold uppercase tracking-[0.3em] text-cyan-300">
                    Videos
                </h3>
                <div className="mt-4 flex flex-wrap items-start justify-center gap-8">
                    {item.videos.map((video) => (
                        <VideoFrame key={video.id} video={video} />
                    ))}
                </div>
            </div>
        )}
    </motion.article>
);

const HighlightsPage = () => (
    <main className="relative min-h-[100dvh] overflow-hidden bg-[#04070f] text-[#eafcff]">
        <NeonBackground />

        <div className="relative z-10 mx-auto max-w-4xl px-6 py-16">
            <header className="text-center">
                <h1 className="font-mono text-3xl font-semibold tracking-[0.35em] text-white sm:text-4xl">
                    <span className="neon-text">HIGHLIGHTS</span>
                </h1>
                <p className="mt-3 font-mono text-[0.7rem] uppercase tracking-[0.45em] text-cyan-300/70">
                    Featured work in depth
                </p>
                <div className="mt-6 flex justify-center gap-8">
                    <a href="/" className={NEON_LINK} style={NEON_GLOW}>
                        Home
                    </a>
                    <a href="/projects" className={NEON_LINK} style={NEON_GLOW}>
                        Projects
                    </a>
                </div>
            </header>

            <div className="mt-12 space-y-10">
                {HIGHLIGHTS.map((item) => (
                    <HighlightCard key={item.id} item={item} />
                ))}
            </div>
        </div>
    </main>
);

export default HighlightsPage;
