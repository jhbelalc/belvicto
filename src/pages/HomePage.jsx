import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { X, Send, Loader2 } from 'lucide-react';
import pocketbaseClient from '@/lib/pocketbaseClient';

const LOGO = 'https://horizons-cdn.hostinger.com/a3b2908a-c2fb-4ea7-a737-b53b007d3105/151aba82c6849ab52a5b95dc356ceb16.png';

const PARAGRAPH =
    'Successful digital transformation begins with informed decisions. With over two decades of experience designing, modernizing, and leading software initiatives across diverse industries, we guide organizations through technology change with a focus on scalability, performance, and AI-driven innovation. From legacy modernization to future-ready architectures, we provide the expertise needed to move forward with confidence.';

const words = PARAGRAPH.split(' ');

const formatDateTime = (d) => {
    const pad = (n) => String(n).padStart(2, '0');
    let h = d.getHours();
    const ampm = h >= 12 ? 'PM' : 'AM';
    h = h % 12 || 12;
    return (
        `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ` +
        `${pad(h)}:${pad(d.getMinutes())}:${pad(d.getSeconds())} ${ampm}`
    );
};

// Ticker that drifts left → right → left across the top, with its own
// rhythm (5 segments, each 1–6s) that is unrelated to the wave text.
const DateTimeTicker = () => {
    const reduce = useReducedMotion();
    const [now, setNow] = useState(() => new Date());

    useEffect(() => {
        const id = setInterval(() => setNow(new Date()), 1000);
        return () => clearInterval(id);
    }, []);

    // 5 random hold points across the width + random per-leg durations.
    const { xKeys, times, duration } = useMemo(() => {
        const legs = 5;
        const durations = Array.from(
            { length: legs },
            () => 1 + Math.random() * 5
        );
        const total = durations.reduce((a, b) => a + b, 0);
        const times = [0];
        let acc = 0;
        durations.forEach((d) => {
            acc += d;
            times.push(acc / total);
        });
        // positions in vw for left edge of the element (returns to start)
        const positions = ['2vw']; // ['2vw', '55vw', '20vw', '70vw', '35vw', '2vw'];
        return { xKeys: positions, times, duration: total };
    }, []);

    const text = formatDateTime(now);

    return (
        <div className="pointer-events-none absolute inset-x-0 top-0 z-20 h-10">
            <motion.span
                className="absolute top-2 whitespace-nowrap font-mono text-[0.7rem] font-semibold uppercase tracking-[0.35em] text-cyan-200/80"
                style={{
                    textShadow: '0 0 10px rgba(0,229,255,0.5)',
                    left: 0,
                }}
                animate={reduce ? { left: '2vw' } : { left: xKeys }}
                transition={
                    reduce
                        ? {}
                        : {
                              duration,
                              times,
                              ease: 'easeInOut',
                              repeat: Infinity,
                          }
                }
            >
                {text}
            </motion.span>
        </div>
    );
};

const NEON_INPUT =
    'w-full rounded-lg border border-cyan-400/25 bg-[#081422]/70 px-4 py-3 font-mono text-sm text-cyan-50 placeholder:text-cyan-200/30 outline-none transition focus:border-cyan-300/70 focus:shadow-[0_0_18px_rgba(0,229,255,0.35)]';

const ContactDialog = ({ open, onClose }) => {
    const [form, setForm] = useState({
        name: '',
        whatsapp: '',
        cell: '',
        email: '',
        message: '',
    });
    const [status, setStatus] = useState('idle');
    const [error, setError] = useState('');

    const update = (key) => (e) =>
        setForm((f) => ({ ...f, [key]: e.target.value }));

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        if (!form.name.trim() || !form.email.trim() || !form.message.trim()) {
            setError('Please fill in name, email and message.');
            return;
        }
        setStatus('sending');
        try {
            await pocketbaseClient.collection('contact_messages').create({
                name: form.name.trim(),
                whatsapp: form.whatsapp.trim(),
                cell: form.cell.trim(),
                email: form.email.trim(),
                message: form.message.trim(),
            });
            setStatus('sent');
        } catch (err) {
            setStatus('idle');
            setError('Something went wrong. Please try again.');
        }
    };

    const handleClose = () => {
        onClose();
        setTimeout(() => {
            setForm({ name: '', whatsapp: '', cell: '', email: '', message: '' });
            setStatus('idle');
            setError('');
        }, 300);
    };

    return (
        <AnimatePresence>
            {open && (
                <motion.div
                    className="fixed inset-0 z-50 flex items-center justify-center px-4"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                >
                    <div
                        className="absolute inset-0 bg-[#02040a]/80 backdrop-blur-sm"
                        onClick={handleClose}
                    />
                    <motion.div
                        initial={{ opacity: 0, y: 24, scale: 0.96 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 24, scale: 0.96 }}
                        transition={{ duration: 0.3, ease: 'easeOut' }}
                        className="relative z-10 w-full max-w-md overflow-hidden rounded-2xl border border-cyan-400/30 bg-[#050b16]/95 p-7 shadow-[0_0_60px_rgba(0,229,255,0.25)]"
                    >
                        <div className="pointer-events-none absolute -top-24 left-1/2 h-48 w-48 -translate-x-1/2 rounded-full bg-cyan-500/20 blur-[80px]" />
                        <button
                            onClick={handleClose}
                            aria-label="Close"
                            className="absolute right-4 top-4 text-cyan-200/60 transition hover:text-cyan-100"
                        >
                            <X className="h-5 w-5" strokeWidth={1.75} />
                        </button>

                        {status === 'sent' ? (
                            <div className="relative py-8 text-center">
                                <h2 className="neon-text font-mono text-2xl font-semibold tracking-[0.15em]">
                                    MESSAGE SENT
                                </h2>
                                <p className="mt-4 text-sm text-cyan-100/70">
                                    Thanks for reaching out. We&apos;ll get back to
                                    you shortly.
                                </p>
                                <button
                                    onClick={handleClose}
                                    className="mt-7 rounded-lg border border-cyan-400/40 px-6 py-2.5 font-mono text-xs uppercase tracking-[0.25em] text-cyan-100 transition hover:bg-cyan-400/10 hover:shadow-[0_0_20px_rgba(0,229,255,0.35)]"
                                >
                                    Close
                                </button>
                            </div>
                        ) : (
                            <form onSubmit={handleSubmit} className="relative">
                                <h2 className="neon-text font-mono text-2xl font-semibold tracking-[0.12em]">
                                    CONTACT ME
                                </h2>
                                <p className="mt-2 mb-6 font-mono text-[0.65rem] uppercase tracking-[0.35em] text-cyan-300/60">
                                    Use this to send me a message or directly to john@belvicto.com
                                </p>

                                <div className="space-y-3">
                                    <input
                                        className={NEON_INPUT}
                                        placeholder="Name *"
                                        value={form.name}
                                        onChange={update('name')}
                                        required
                                    />
                                    <input
                                        className={NEON_INPUT}
                                        type="email"
                                        placeholder="Email *"
                                        value={form.email}
                                        onChange={update('email')}
                                        required
                                    />
                                    <input
                                        className={NEON_INPUT}
                                        placeholder="WhatsApp number (optional)"
                                        value={form.whatsapp}
                                        onChange={update('whatsapp')}
                                    />
                                    <input
                                        className={NEON_INPUT}
                                        placeholder="Cell number (optional)"
                                        value={form.cell}
                                        onChange={update('cell')}
                                    />
                                    <textarea
                                        className={`${NEON_INPUT} min-h-[110px] resize-none`}
                                        placeholder="Message *"
                                        value={form.message}
                                        onChange={update('message')}
                                        required
                                    />
                                </div>

                                {error && (
                                    <p className="mt-3 font-mono text-xs text-fuchsia-400">
                                        {error}
                                    </p>
                                )}

                                <button
                                    type="submit"
                                    disabled={status === 'sending'}
                                    className="mt-6 flex w-full items-center justify-center gap-2 rounded-lg border border-cyan-400/50 bg-cyan-400/10 py-3 font-mono text-xs uppercase tracking-[0.3em] text-cyan-100 transition hover:bg-cyan-400/20 hover:shadow-[0_0_24px_rgba(0,229,255,0.45)] disabled:opacity-60"
                                >
                                    {status === 'sending' ? (
                                        <Loader2 className="h-4 w-4 animate-spin" />
                                    ) : (
                                        <Send className="h-4 w-4" strokeWidth={1.75} />
                                    )}
                                    {status === 'sending' ? 'Sending' : 'Send message'}
                                </button>
                            </form>
                        )}
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

const HomePage = () => {
    const reduce = useReducedMotion();
    const [contactOpen, setContactOpen] = useState(false);
    const [logoFailed, setLogoFailed] = useState(false);

    // Wave loop: each word rises in, glows, then recedes; the whole
    // sequence loops so the text keeps washing in like the sea.
    const container = {
        animate: {
            transition: {
                staggerChildren: 0.09,
                repeat: Infinity,
                repeatType: 'loop',
                repeatDelay: 2.4,
            },
        },
    };

    const wordVariant = {
        animate: (i) => ({
            opacity: [0, 1, 1, 0],
            y: [26, 0, 0, -18],
            filter: [
                'blur(8px)',
                'blur(0px)',
                'blur(0px)',
                'blur(8px)',
            ],
            transition: {
                duration: 6.5,
                times: [0, 0.16, 0.72, 1],
                ease: 'easeInOut',
                repeat: Infinity,
                repeatDelay: 1.2,
                delay: i * 0.11,
            },
        }),
    };

    return (
        <main className="relative min-h-[100dvh] overflow-hidden bg-[#04070f] text-[#eafcff]">
            <DateTimeTicker />
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

            <div className="relative z-10 mx-auto flex min-h-[100dvh] max-w-4xl flex-col items-center justify-center px-6 py-20 text-center">
                {/* logo + brand */}
                <motion.div
                    initial={{ opacity: 0, y: -12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, ease: 'easeOut' }}
                    className="mb-10 flex flex-col items-center"
                >
                    <button
                        type="button"
                        onClick={() => setContactOpen(true)}
                        aria-label="Open contact form"
                        className="group relative rounded-full outline-none"
                    >
                        {logoFailed ? (
                            <span
                                aria-label="Belvicto logo"
                                className="flex h-24 w-24 items-center justify-center rounded-full border border-cyan-300/60 bg-[#081422] font-mono text-5xl font-semibold text-cyan-100 drop-shadow-[0_0_25px_rgba(0,229,255,0.55)] transition duration-300 group-hover:scale-105 group-hover:drop-shadow-[0_0_40px_rgba(0,229,255,0.85)]"
                            >
                                B
                            </span>
                        ) : (
                            <img
                                src={LOGO}
                                alt="Belvicto logo"
                                onError={() => setLogoFailed(true)}
                                className="h-24 w-24 cursor-pointer drop-shadow-[0_0_25px_rgba(0,229,255,0.55)] transition duration-300 group-hover:scale-105 group-hover:drop-shadow-[0_0_40px_rgba(0,229,255,0.85)]"
                            />
                        )}
                        <span className="pointer-events-none absolute -bottom-6 left-1/2 -translate-x-1/2 whitespace-nowrap font-mono text-[0.55rem] uppercase tracking-[0.3em] text-cyan-300/0 transition duration-300 group-hover:text-cyan-300/70">
                            Contact me
                        </span>
                    </button>
                    <h1 className="mt-5 font-mono text-3xl font-semibold tracking-[0.35em] text-white sm:text-4xl">
                        <span className="neon-text">BELVICTO</span>
                    </h1>
                    <p className="mt-3 font-mono text-[0.7rem] uppercase tracking-[0.45em] text-cyan-300/70">
                        Software Advisory
                    </p>
                </motion.div>

                {/* wave text */}
                <motion.p
                    variants={reduce ? undefined : container}
                    initial={reduce ? undefined : 'initial'}
                    animate={reduce ? undefined : 'animate'}
                    className="max-w-3xl text-balance text-lg font-light leading-relaxed text-cyan-50/90 sm:text-2xl sm:leading-[1.7]"
                >
                    {reduce
                        ? PARAGRAPH
                        : words.map((word, i) => (
                              <motion.span
                                  key={i}
                                  custom={i}
                                  variants={wordVariant}
                                  className="mr-[0.32em] inline-block wave-word"
                              >
                                  {word}
                              </motion.span>
                          ))}
                </motion.p>
            </div>

            <ContactDialog open={contactOpen} onClose={() => setContactOpen(false)} />

            <footer className="relative z-10 pb-8 text-center font-mono text-[0.65rem] uppercase tracking-[0.3em] text-cyan-200/40">
                © {new Date().getFullYear()} Belvicto — Guiding software decisions
            </footer>
        </main>
    );
};

export default HomePage;
