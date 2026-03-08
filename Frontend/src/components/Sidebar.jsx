import { useState, useMemo } from 'react';
import { Link, useMatch, useNavigate } from '@tanstack/react-router';
import {
    Plus, MessageSquare, Code2, FileEdit, History,
    Settings, ChevronLeft, Rocket, LogOut, X
} from 'lucide-react';
import { useAuth, useLogout } from '../hooks/useAuth';
import { useChats } from '../hooks/useChats';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../api/client';
import { motion, AnimatePresence } from 'framer-motion';

const Sidebar = ({ isOpen, onClose }) => {
    const { data: user } = useAuth();
    const { data: chats = [] } = useChats();
    const logout = useLogout();
    const navigate = useNavigate();
    const queryClient = useQueryClient();

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [newChatTitle, setNewChatTitle] = useState('');

    // Create Chat Mutation
    const createChatMutation = useMutation({
        mutationFn: async (title) => {
            const response = await api.post('/chat', { title: title || 'New Mission' });
            return response.data;
        },
        onSuccess: (newChat) => {
            queryClient.invalidateQueries(['chats']);
            navigate({ to: '/chat/$chatId', params: { chatId: newChat._id } });
            setIsModalOpen(false);
            setNewChatTitle('');
            if (onClose) onClose();
        }
    });

    const handleCreateChat = (e) => {
        e.preventDefault();
        if (!newChatTitle.trim()) return;
        createChatMutation.mutate(newChatTitle);
    };

    // Categorization logic memoized to prevent recalculation on every render
    const { activeMissions, pastTrajectories } = useMemo(() => {
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        return {
            activeMissions: chats.filter(chat => new Date(chat.createdAt) >= today),
            pastTrajectories: chats.filter(chat => new Date(chat.createdAt) < today)
        };
    }, [chats]);

    return (
        <>
            {/* Mobile overlay */}
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 z-40 bg-black/70 backdrop-blur-sm md:hidden"
                    onClick={onClose}
                />
            )}

            <aside
                className={`
          fixed md:relative inset-y-0 left-0 z-50
          h-full
          bg-linear-to-b from-karman-bg to-karman-surface
          border-karman-border overflow-hidden
          transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)]
          ${isOpen
                        ? 'translate-x-0 w-[80vw] sm:w-80 border-r opacity-100'
                        : '-translate-x-full w-[80vw] sm:w-80 md:w-0 md:opacity-0 md:translate-x-0 border-r md:border-none'
                    }
        `}
            >
                <div className="w-[80vw] sm:w-80 h-full flex flex-col">
                    {/* ── Logo Area ── */}
                    <div className="p-6 pb-2 relative">
                        {/* Subtle radial glow behind logo */}
                        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-48 h-48 rounded-full bg-karman-accent-1/5 blur-3xl pointer-events-none" />

                        <div className="flex items-center justify-between relative z-10">
                            <motion.div
                                initial={{ opacity: 0, y: 8 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                                className="flex flex-col"
                            >
                                <h1 className="text-white text-xl font-bold tracking-[0.15em] font-heading animate-karman-float">
                                    KARMAN
                                </h1>
                                <p className="text-karman-muted text-[10px] tracking-[0.2em] uppercase mt-0.5">
                                    Beyond the Boundary
                                </p>
                            </motion.div>

                            <button
                                onClick={onClose}
                                className="md:hidden p-2 text-karman-muted hover:text-white rounded-full hover:bg-white/5 karman-transition"
                            >
                                <ChevronLeft className="w-5 h-5" />
                            </button>
                        </div>
                    </div>

                    {/* ── Launch Session ── */}
                    <div className="px-6 py-4">
                        <motion.button
                            onClick={() => setIsModalOpen(true)}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            className="w-full flex items-center gap-3 px-4 py-3 karman-gradient rounded-xl font-semibold text-sm text-white shadow-[0_0_20px_rgba(36,59,85,0.18)] hover:shadow-[0_0_30px_rgba(36,59,85,0.28)] karman-transition"
                        >
                            <Rocket className="w-4 h-4" />
                            Create New Chat
                        </motion.button>
                    </div>

                    {/* ── Chat list ── */}
                    <nav className="flex-1 overflow-y-auto px-4 space-y-1 karman-scroll">
                        {activeMissions.length > 0 && (
                            <>
                                <div className="px-4 py-2 text-[10px] font-semibold text-karman-muted uppercase tracking-[0.15em] mb-1">
                                    Active Missions
                                </div>

                                {activeMissions.map((chat) => (
                                    <Link
                                        key={chat._id}
                                        to="/chat/$chatId"
                                        params={{ chatId: chat._id }}
                                        activeProps={{ className: 'bg-white/5 text-white border-karman-border shadow-[0_0_15px_rgba(36,59,85,0.1)]' }}
                                        inactiveProps={{ className: 'text-karman-muted hover:bg-white/3 hover:text-karman-text border-transparent' }}
                                        className="flex items-center gap-3 px-4 py-3 rounded-xl group karman-transition border"
                                    >
                                        <MessageSquare className="w-4 h-4 karman-transition group-[.active]:text-karman-accent-2 text-karman-dim group-hover:text-karman-muted" />
                                        <div className="flex-1 truncate text-sm font-medium">{chat.title}</div>
                                    </Link>
                                ))}
                            </>
                        )}

                        {pastTrajectories.length > 0 && (
                            <>
                                <div className="px-4 py-2 mt-6 text-[10px] font-semibold text-karman-muted uppercase tracking-[0.15em] mb-1">
                                    Past Trajectories
                                </div>
                                {pastTrajectories.map((chat) => (
                                    <Link
                                        key={chat._id}
                                        to="/chat/$chatId"
                                        params={{ chatId: chat._id }}
                                        activeProps={{ className: 'bg-white/5 text-white border-karman-border shadow-[0_0_15px_rgba(36,59,85,0.1)]' }}
                                        inactiveProps={{ className: 'text-karman-muted hover:bg-white/3 hover:text-karman-text border-transparent' }}
                                        className="flex items-center gap-3 px-4 py-3 rounded-xl group karman-transition border"
                                    >
                                        <History className="w-4 h-4 karman-transition group-[.active]:text-karman-accent-2 text-karman-dim group-hover:text-karman-muted" />
                                        <div className="flex-1 truncate text-sm font-medium">{chat.title}</div>
                                    </Link>
                                ))}
                            </>
                        )}
                    </nav>

                    {/* ── Bottom section ── */}
                    <div className="p-4 border-t border-karman-border">
                        <div className="flex flex-col gap-1">
                            <button
                                onClick={logout}
                                className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-red-500/10 text-karman-muted hover:text-red-400 karman-transition w-full text-left group"
                            >
                                <LogOut className="w-4 h-4 group-hover:scale-110 transition-transform" />
                                <span className="text-sm font-medium">System Logout</span>
                            </button>

                            <div className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-white/3 cursor-pointer karman-transition">
                                <div className="w-8 h-8 rounded-full karman-gradient flex items-center justify-center text-white text-xs font-bold shadow-[0_0_10px_rgba(36,59,85,0.18)]">
                                    {user?.username?.[0]?.toUpperCase() || 'A'}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-medium text-white truncate">
                                        {user?.username || 'Astronaut'}
                                    </p>
                                    <p className="text-xs text-karman-muted truncate">
                                        {user?.email || 'mission@karman.ai'}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </aside>

            {/* ── New Chat Modal ── */}
            <AnimatePresence>
                {isModalOpen && (
                    <div className="fixed inset-0 z-100 flex items-center justify-center p-4 sm:p-6">
                        {/* Backdrop */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsModalOpen(false)}
                            className="absolute inset-0 bg-black/80 backdrop-blur-md"
                        />

                        {/* Glow effect */}
                        <div className="absolute -top-24 -left-24 w-48 h-48 bg-karman-accent-1/10 rounded-full blur-3xl pointer-events-none" />
                        <div className="absolute -bottom-24 -right-24 w-48 h-48 bg-karman-accent-2/10 rounded-full blur-3xl pointer-events-none" />

                        <div className="p-6 relative z-10">
                            <div className="flex items-center justify-between mb-6">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 rounded-lg bg-karman-accent-1/10 text-karman-accent-2">
                                        <Rocket className="w-5 h-5" />
                                    </div>
                                    <h3 className="text-lg font-bold text-white tracking-tight font-heading">
                                        Initialize New Mission
                                    </h3>
                                </div>
                                <button
                                    onClick={() => setIsModalOpen(false)}
                                    className="p-2 text-karman-muted hover:text-white rounded-full hover:bg-white/5 karman-transition"
                                >
                                    <X className="w-5 h-5" />
                                </button>
                            </div>

                            <form onSubmit={handleCreateChat} className="space-y-6">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-bold text-karman-muted uppercase tracking-widest ml-1">
                                        Mission Identifier
                                    </label>
                                    <div className="relative group">
                                        <input
                                            autoFocus
                                            type="text"
                                            value={newChatTitle}
                                            onChange={(e) => setNewChatTitle(e.target.value)}
                                            placeholder="Enter mission name..."
                                            className="w-full bg-karman-bg/50 border border-karman-border rounded-xl px-4 py-3 text-white placeholder:text-karman-dim outline-none focus:border-karman-accent-1/50 focus:ring-1 focus:ring-karman-accent-1/20 karman-transition"
                                        />
                                        <div className="absolute inset-x-0 -bottom-px h-px bg-linear-to-r from-transparent via-karman-accent-1/50 to-transparent scale-x-0 group-focus-within:scale-x-100 transition-transform duration-500" />
                                    </div>
                                </div>

                                <div className="flex gap-3">
                                    <button
                                        type="button"
                                        onClick={() => setIsModalOpen(false)}
                                        className="flex-1 px-4 py-3 rounded-xl border border-karman-border text-karman-muted font-semibold text-sm hover:bg-white/5 hover:text-white karman-transition"
                                    >
                                        Abort
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={!newChatTitle.trim() || createChatMutation.isLoading}
                                        className="flex-2 flex items-center justify-center gap-2 px-4 py-3 karman-gradient rounded-xl font-bold text-sm text-white shadow-lg disabled:opacity-50 disabled:cursor-not-allowed karman-transition"
                                    >
                                        {createChatMutation.isLoading ? (
                                            <>
                                                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                                Launching...
                                            </>
                                        ) : (
                                            <>
                                                <Plus className="w-4 h-4" />
                                                Initialize Mission
                                            </>
                                        )}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>

                )}
            </AnimatePresence >
        </>
    );
};

export default Sidebar;
