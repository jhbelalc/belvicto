import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { ExternalLink, Loader2 } from 'lucide-react';
import NeonBackground from '@/components/NeonBackground';

const GITHUB_USER = 'jhbelalc';
const PROFILE_URL = `https://github.com/${GITHUB_USER}`;
const REPOS_URL = `https://api.github.com/users/${GITHUB_USER}/repos?per_page=100&sort=pushed`;

const NEON_LINK =
    'font-mono text-[0.7rem] font-semibold uppercase tracking-[0.35em] text-cyan-200/80 transition hover:text-cyan-100';
const NEON_GLOW = { textShadow: '0 0 10px rgba(0,229,255,0.5)' };

const formatDate = (iso) =>
    iso
        ? new Date(iso).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'short',
          })
        : '';

const ProjectCard = ({ repo, index }) => (
    <motion.li
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: Math.min(index * 0.05, 0.6) }}
        className="rounded-xl border border-cyan-400/25 bg-[#050b16]/70 p-6 text-left transition hover:border-cyan-300/60 hover:shadow-[0_0_30px_rgba(0,229,255,0.25)]"
    >
        <a
            href={repo.html_url}
            target="_blank"
            rel="noopener noreferrer"
            className="neon-text break-words font-mono text-2xl font-semibold tracking-wide transition hover:brightness-125 sm:text-3xl"
        >
            {repo.name}
        </a>
        {repo.description && (
            <p className="mt-3 text-sm font-light leading-relaxed text-cyan-50/80">
                {repo.description}
            </p>
        )}
        <div className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-2 font-mono text-[0.65rem] uppercase tracking-[0.25em] text-cyan-300/60">
            {repo.language && <span>{repo.language}</span>}
            {repo.pushed_at && <span>Updated {formatDate(repo.pushed_at)}</span>}
        </div>
        <div className="mt-4 flex flex-wrap gap-x-6 gap-y-2">
            <a
                href={repo.html_url}
                target="_blank"
                rel="noopener noreferrer"
                className={`${NEON_LINK} inline-flex items-center gap-2`}
                style={NEON_GLOW}
            >
                GitHub <ExternalLink className="h-3 w-3" strokeWidth={1.75} />
            </a>
            {repo.homepage && /^https?:\/\//i.test(repo.homepage) && (
                <a
                    href={repo.homepage}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`${NEON_LINK} inline-flex items-center gap-2`}
                    style={NEON_GLOW}
                >
                    Live site{' '}
                    <ExternalLink className="h-3 w-3" strokeWidth={1.75} />
                </a>
            )}
        </div>
    </motion.li>
);

const ProjectsPage = () => {
    const [repos, setRepos] = useState([]);
    const [status, setStatus] = useState('loading');

    useEffect(() => {
        const controller = new AbortController();
        (async () => {
            try {
                const res = await fetch(REPOS_URL, {
                    signal: controller.signal,
                    headers: { Accept: 'application/vnd.github+json' },
                });
                if (!res.ok) throw new Error(`GitHub ${res.status}`);
                const data = await res.json();
                const own = data
                    .filter((r) => !r.fork && !r.private)
                    .sort(
                        (a, b) =>
                            new Date(b.pushed_at) - new Date(a.pushed_at)
                    );
                setRepos(own);
                setStatus('ready');
            } catch (err) {
                if (err.name !== 'AbortError') setStatus('error');
            }
        })();
        return () => controller.abort();
    }, []);

    return (
        <main className="relative min-h-[100dvh] overflow-hidden bg-[#04070f] text-[#eafcff]">
            <NeonBackground />

            <div className="relative z-10 mx-auto max-w-4xl px-6 py-16">
                <header className="text-center">
                    <h1 className="font-mono text-3xl font-semibold tracking-[0.35em] text-white sm:text-4xl">
                        <span className="neon-text">PROJECTS</span>
                    </h1>
                    <p className="mt-3 font-mono text-[0.7rem] uppercase tracking-[0.45em] text-cyan-300/70">
                        Public work on GitHub
                    </p>
                    <div className="mt-6 flex justify-center gap-8">
                        <a href="/" className={NEON_LINK} style={NEON_GLOW}>
                            Home
                        </a>
                        <a
                            href={PROFILE_URL}
                            target="_blank"
                            rel="noopener noreferrer"
                            className={NEON_LINK}
                            style={NEON_GLOW}
                        >
                            GitHub profile
                        </a>
                    </div>
                </header>

                <section className="mt-12">
                    {status === 'loading' && (
                        <div className="flex justify-center text-cyan-300/70">
                            <Loader2 className="h-6 w-6 animate-spin" />
                        </div>
                    )}
                    {status === 'error' && (
                        <p className="text-center font-mono text-sm text-cyan-100/70">
                            Couldn&apos;t load projects right now. You can see
                            them directly on{' '}
                            <a
                                href={PROFILE_URL}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-cyan-300 underline"
                            >
                                GitHub
                            </a>
                            .
                        </p>
                    )}
                    {status === 'ready' && (
                        <ul className="grid gap-5 sm:grid-cols-2">
                            {repos.map((repo, i) => (
                                <ProjectCard
                                    key={repo.id}
                                    repo={repo}
                                    index={i}
                                />
                            ))}
                        </ul>
                    )}
                </section>

                <p className="mt-12 text-center font-mono text-[0.65rem] uppercase tracking-[0.3em] text-cyan-200/40">
                    Only public repositories are shown
                </p>
            </div>
        </main>
    );
};

export default ProjectsPage;
