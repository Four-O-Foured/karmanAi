import React, { useState, useRef, useEffect, useMemo, memo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Share, Archive, Info,
    Menu, Copy, Check
} from 'lucide-react';
import { useMessages } from '../hooks/useMessages';
import { useQueryClient } from '@tanstack/react-query';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import ChatInput from './ChatInput';

/* ═══════════════════════════════════════════
   Data
   ═══════════════════════════════════════════ */
// const INITIAL_MESSAGES = [
//     {
//         id: 1,
//         type: 'ai',
//         text: 'Hello! How can I assist you with your project today? I can help with coding, writing, data analysis, or generating creative content.',
//         time: '10:23 AM',
//     },
//     {
//         id: 2,
//         type: 'user',
//         text: 'I need to generate a Python script for data analysis regarding sales trends. Can you help me visualize CSV data?',
//         time: '10:24 AM',
//     },
//     {
//         id: 3,
//         type: 'ai',
//         time: '10:25 AM',
//         text: 'Certainly. I can help you with that. We\'ll use the `pandas` library for data manipulation and `matplotlib` for visualization. Here is a starter script based on a standard CSV structure:',
//         code: {
//             filename: 'analysis.py',
//             content: `import pandas as pd
// import matplotlib.pyplot as plt

// # Load the dataset
// df = pd.read_csv('sales_data.csv')

// # Convert date column to datetime objects
// df['Date'] = pd.to_datetime(df['Date'])

// # Group by month and sum sales
// monthly_sales = df.groupby(df['Date'].dt.to_period('M'))['Sales'].sum()

// # Plotting
// plt.figure(figsize=(10, 6))
// monthly_sales.plot(kind='bar', color='skyblue')
// plt.title('Monthly Sales Trends')
// plt.xlabel('Month')
// plt.ylabel('Total Sales ($)')
// plt.show()`,
//         },
//         followUp: 'Do you have a specific CSV file format you\'d like me to tailor this for?',
//         suggestions: ['Explain this code', 'Visualize sample data'],
//     },
// ];

const formatTime = (date = new Date()) => {
    return new Date(date).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
};

/* ═══════════════════════════════════════════
   Code Block
   ═══════════════════════════════════════════ */
const CodeBlock = ({ filename, content }) => {
    const [copied, setCopied] = useState(false);

    const handleCopy = async () => {
        await navigator.clipboard.writeText(content);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="karman-code-block">
            <div className="karman-code-header flex items-center justify-between px-4 py-2.5">
                <span className="text-xs text-karman-muted font-mono">{filename}</span>
                <button
                    onClick={handleCopy}
                    className="flex items-center gap-1.5 text-xs text-karman-muted hover:text-karman-accent-2 karman-transition group"
                    title={copied ? 'Copied!' : 'Copy code'}
                >
                    {copied ? (
                        <Check className="w-3.5 h-3.5 text-green-400" />
                    ) : (
                        <Copy className="w-3.5 h-3.5 group-hover:scale-110 karman-transition" />
                    )}
                </button>
            </div>
            <div className="p-5 overflow-x-auto">
                <pre className="text-sm font-mono text-karman-text/80 whitespace-pre leading-relaxed">
                    <code>{content}</code>
                </pre>
            </div>
        </div>
    );
};

/* ═══════════════════════════════════════════
   Message animation variants
   ═══════════════════════════════════════════ */
const msgVariants = {
    hidden: { opacity: 0, y: 14, filter: 'blur(4px)' },
    visible: {
        opacity: 1,
        y: 0,
        filter: 'blur(0px)',
        transition: { duration: 0.4, ease: [0.16, 1, 0.3, 1] },
    },
};

/* ═══════════════════════════════════════════
   MessageItem (Memoized)
   ═══════════════════════════════════════════ */
const MessageItem = memo(({ msg }) => {
    return (
        <motion.div
            variants={msgVariants}
            initial="hidden"
            animate="visible"
            className={`flex gap-2 sm:gap-4 max-w-4xl mx-auto w-full group ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}
        >
            {/* Avatar */}
            {msg.role === 'ai' ? (
                <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full karman-gradient shrink-0 flex items-center justify-center text-white shadow-[0_0_15px_rgba(36,59,85,0.15)]">
                    <span className="text-xs sm:text-sm font-bold font-heading">K</span>
                </div>
            ) : (
                <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-karman-elevated border border-white/8 shrink-0 flex items-center justify-center text-karman-muted text-xs font-bold">
                    A
                </div>
            )}

            {/* Content */}
            <div className={`flex flex-col gap-2 flex-1 min-w-0 ${msg.role === 'user' ? 'items-end' : ''}`}>
                {/* Name + time */}
                <div className={`flex items-center gap-2 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
                    <span className="text-sm font-semibold text-white">
                        {msg.role === 'ai' ? 'Karman' : 'You'}
                    </span>
                    <span className="text-xs text-karman-dim">{msg.time}</span>
                </div>

                {/* Bubble */}
                {msg.role === 'ai' ? (
                    <div className="karman-ai-bubble p-3 pl-5 sm:p-5 sm:pl-7 rounded-4xl rounded-tl-none text-karman-text/90 leading-relaxed space-y-3 sm:space-y-4 prose-invert prose-sm sm:prose-base font-body">
                        <div className="markdown-content">
                            <ReactMarkdown remarkPlugins={[remarkGfm]}>
                                {msg.content}
                            </ReactMarkdown>
                        </div>

                        {msg.code && (
                            <CodeBlock
                                filename={msg.code.filename}
                                content={msg.code.content}
                            />
                        )}

                        {msg.followUp && <p>{msg.followUp}</p>}

                        {msg.suggestions && (
                            <div className="flex flex-wrap gap-2 pt-2">
                                {msg.suggestions.map((s) => (
                                    <motion.button
                                        key={s}
                                        whileHover={{ scale: 1.03 }}
                                        whileTap={{ scale: 0.97 }}
                                        className="px-4 py-2 rounded-full border border-karman-accent-1/15 bg-karman-accent-1/5 hover:bg-karman-accent-1/10 text-sm text-karman-muted hover:text-karman-accent-2 karman-transition"
                                    >
                                        {s}
                                    </motion.button>
                                ))}
                            </div>
                        )}
                    </div>
                ) : (
                    <div className="karman-user-bubble p-5 sm:p-5 rounded-4xl rounded-tr-none leading-relaxed font-medium">
                        <p>{msg.content}</p>
                    </div>
                )}
            </div>
        </motion.div>
    );
});
MessageItem.displayName = 'MessageItem';

/* ═══════════════════════════════════════════
   ChatInterface
   ═══════════════════════════════════════════ */


const ChatInterface = ({ onToggleSidebar, chatId, socket }) => {
    const queryClient = useQueryClient();
    const { data: dbMessages = [], isLoading } = useMessages(chatId);
    const [isThinking, setIsThinking] = useState(false);

    // Map DB messages to UI format - Memoized to prevent referential changes on every render
    const messages = useMemo(() => {
        return dbMessages.map(m => ({
            id: m._id || m.id,
            role: m.role === 'user' ? 'user' : 'ai',
            content: m.content,
            time: formatTime(m.createdAt || new Date()),
            code: m.code,
            followUp: m.followUp,
            suggestions: m.suggestions
        }));
    }, [dbMessages]);

    // Socket Listeners
    useEffect(() => {
        if (!socket) return;

        const handleResponse = (data) => {
            if (data.chatId !== chatId) return;

            const aiMsg = {
                _id: Date.now() + 1,
                role: 'model',
                content: data.response,
                time: new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true }),
            };

            queryClient.setQueryData(['messages', chatId], (old) => [...(old || []), aiMsg]);
            setIsThinking(false);
        };

        const handleError = (data) => {
            if (data.chatId !== chatId) return;
            setIsThinking(false);
            console.error("AI Error:", data.error);
        };

        socket.on("ai-response", handleResponse);
        socket.on("ai-error", handleError);

        return () => {
            socket.off("ai-response", handleResponse);
            socket.off("ai-error", handleError);
        };
    }, [socket, chatId, queryClient]);

    const scrollRef = useRef(null);

    // Auto-scroll
    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages, isThinking]);

    const onSubmit = (data) => {
        const content = data.message?.trim();
        if (!content || isThinking || !chatId) return;

        // Optimistic update
        const userMsg = {
            _id: Date.now(),
            role: 'user',
            content,
            time: new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true }),
        };

        queryClient.setQueryData(['messages', chatId], (old) => [...(old || []), userMsg]);
        setIsThinking(true);

        socket.emit("ai-message", {
            message: content,
            chatId,
        });
    };

    return (
        <main className="flex-1 flex flex-col h-full relative bg-karman-surface rounded-xl md:rounded-2xl border border-karman-border overflow-hidden min-w-0">
            {/* ── Subtle radial glow behind chat ── */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden">
                <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] md:w-[600px] md:h-[600px] rounded-full bg-karman-accent-1/4 blur-[80px] md:blur-[120px]" />
            </div>

            {/* ── Header ── */}
            <header className="relative z-10">
                <div className="flex items-center justify-between px-3 sm:px-6 py-3 sm:py-4 bg-karman-bg/70 backdrop-blur-xl">
                    <div className="flex items-center gap-4">
                        <button
                            onClick={onToggleSidebar}
                            className="p-2 text-karman-muted hover:text-white rounded-full hover:bg-white/5 karman-transition group"
                        >
                            <Menu className="w-5 h-5 group-hover:scale-110 karman-transition" />
                        </button>
                        <div className="flex items-center gap-2 sm:gap-3">
                            <h2 className="text-base sm:text-lg font-bold text-white tracking-tight font-heading">
                                Karman Core
                            </h2>
                            <span className="hidden sm:inline-block text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider bg-karman-accent-1/10 text-karman-accent-2 border border-karman-accent-1/15">
                                Orbital Engine v1
                            </span>
                        </div>
                    </div>
                    <div className="flex items-center gap-1">
                        {[
                            { icon: Share, label: 'Share' },
                            { icon: Archive, label: 'Archive' },
                            { icon: Info, label: 'Details' },
                        ].map(({ icon: Icon, label }) => (
                            <button
                                key={label}
                                title={label}
                                className="p-2 text-karman-muted hover:text-white rounded-full hover:bg-white/5 karman-transition"
                            >
                                <Icon className="w-[18px] h-[18px]" />
                            </button>
                        ))}
                    </div>
                </div>
                {/* Gradient underline */}
                <div className="karman-header-line" />
            </header>

            {/* ── Messages ── */}
            <div
                ref={scrollRef}
                className="flex-1 overflow-y-auto p-3 sm:p-4 md:p-8 space-y-5 sm:space-y-8 scroll-smooth karman-scroll relative z-1"
            >
                <AnimatePresence initial={false}>
                    {messages.map((msg) => (
                        <MessageItem key={msg.id} msg={msg} />
                    ))}

                    {/* ── Thinking dots ── */}
                    {isThinking && (
                        <motion.div
                            variants={msgVariants}
                            initial="hidden"
                            animate="visible"
                            className="flex gap-2 sm:gap-4 max-w-4xl mx-auto w-full"
                        >
                            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full karman-gradient shrink-0 flex items-center justify-center text-white shadow-[0_0_15px_rgba(36,59,85,0.15)]">
                                <span className="text-xs sm:text-sm font-bold font-heading">K</span>
                            </div>
                            <div className="karman-ai-bubble p-5 pl-7 rounded-2xl rounded-tl-none flex gap-2 items-center">
                                {[0, 1, 2].map((i) => (
                                    <motion.div
                                        key={i}
                                        animate={{ scale: [1, 1.4, 1], opacity: [0.3, 1, 0.3] }}
                                        transition={{ duration: 0.8, repeat: Infinity, delay: i * 0.2, ease: [0.4, 0, 0.6, 1] }}
                                        className="w-2 h-2 rounded-full bg-karman-accent-2"
                                    />
                                ))}
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Bottom spacer */}
                <div className="h-28" />
            </div>

            {/* ── Input Bar ── */}
            <div className="absolute bottom-0 left-0 w-full p-2 sm:p-4 md:p-6 bg-linear-to-t from-karman-bg via-karman-bg/70 to-transparent z-20">
                <ChatInput onSendMessage={onSubmit} isThinking={isThinking} />
            </div>
        </main>
    );
};

export default ChatInterface;
