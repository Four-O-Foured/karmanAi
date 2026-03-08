import { PlusCircle, Mic, ArrowUp } from 'lucide-react';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';

const ChatInput = ({ onSendMessage, isThinking }) => {
    const { register, handleSubmit, watch, reset } = useForm();
    const inputValue = watch('message', '');

    const handleKeyDown = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSubmit(onSubmit)();
        }
    };

    const onSubmit = (data) => {
        if (!data.message?.trim() || isThinking) return;
        onSendMessage(data);
        reset();
    };

    return (
        <form
            onSubmit={handleSubmit(onSubmit)}
            className="max-w-4xl mx-auto relative"
        >
            <div className="karman-glass-strong rounded-full shadow-[0_0_30px_rgba(36,59,85,0.1)] flex items-center p-1.5 pl-3 sm:p-2 sm:pl-5 gap-2 sm:gap-3 karman-transition focus-within:shadow-[0_0_40px_rgba(36,59,85,0.18)] focus-within:border-karman-accent-1/25">
                <button
                    type="button"
                    className="p-2 text-karman-muted hover:text-karman-accent-2 hover:bg-white/5 rounded-full karman-transition shrink-0"
                >
                    <PlusCircle className="w-5 h-5" />
                </button>

                <input
                    {...register('message')}
                    type="text"
                    placeholder="What will you launch today?"
                    onKeyDown={handleKeyDown}
                    autoComplete="off"
                    className="flex-1 bg-transparent border-none outline-none text-karman-text placeholder-karman-dim h-full py-2.5 sm:py-3 text-sm sm:text-base focus:ring-0 min-w-0"
                />

                <div className="flex items-center gap-1 pr-1">
                    <button
                        type="button"
                        className="p-2 text-karman-muted hover:text-karman-accent-2 hover:bg-white/5 rounded-full karman-transition hidden sm:flex"
                    >
                        <Mic className="w-5 h-5" />
                    </button>

                    <motion.button
                        type="submit"
                        disabled={!inputValue?.trim() || isThinking}
                        whileHover={inputValue?.trim() && !isThinking ? { scale: 1.08, y: -1 } : {}}
                        whileTap={inputValue?.trim() && !isThinking ? { scale: 0.95 } : {}}
                        className={`w-10 h-10 rounded-full flex items-center justify-center karman-transition ml-1 ${inputValue?.trim() && !isThinking
                            ? 'karman-gradient text-white shadow-[0_0_20px_rgba(36,59,85,0.18)]'
                            : 'bg-white/5 text-karman-dim cursor-not-allowed'
                            }`}
                    >
                        <ArrowUp className="w-5 h-5" />
                    </motion.button>
                </div>
            </div>

            <div className="text-center mt-3">
                <p className="text-[10px] text-karman-dim">
                    AI can make mistakes. Consider checking important information.
                </p>
            </div>
        </form>
    );
};

export default ChatInput;
