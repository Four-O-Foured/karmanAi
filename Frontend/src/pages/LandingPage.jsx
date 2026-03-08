import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { Link } from '@tanstack/react-router';
import Antigravity from '../components/Antigravity';
import StarBorder from '../components/StarBorder';

const LandingPage = () => {
    const MotionLink = motion.create(Link);

    return (
        <div className="relative w-full h-screen overflow-hidden bg-[#0A0B10] text-white selection:bg-indigo-500/30 font-body flex items-center justify-center">

            {/* --- 1. FULL SCREEN IMAGE BACKGROUND --- */}
            <div className="absolute inset-0 z-0">
                <img
                    src="/LandingImg.png"
                    alt="Karman AI Interface"
                    className="w-full h-full object-cover opacity-100 mix-blend-screen mask-image-linear-to-b from-black via-black/80 to-transparent"
                />
            </div>

            {/* --- 2. DARK OVERLAYS FOR LEGIBILITY --- */}
            <div className="absolute inset-x-0 bottom-0 h-3/4 bg-linear-to-t from-[#0A0B10] via-[#0A0B10]/80 to-transparent z-10 pointer-events-none" />
            <div className="absolute inset-0 bg-[#0A0B10]/40 z-10 pointer-events-none" />

            {/* --- 3. ANTIGRAVITY ENGINE (Interactive Layer) --- */}
            <div className="absolute inset-0 z-20 pointer-events-auto opacity-70">
                <Antigravity
                    count={350}
                    color="#fff" // Slightly lighter indigo for contrast against dark bg
                    particleSize={0.6}
                    rotationSpeed={0.03}
                    ringRadius={9}
                    particleShape="sphere"
                />
            </div>

            {/* --- 4. MAIN CONTENT CONTAINER (Centered) --- */}
            <div className="relative z-30 w-full max-w-4xl mx-auto px-6 flex flex-col items-center text-center mt-32 pointer-events-none">

                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    className="flex flex-col items-center space-y-8 p-8 md:p-12 rounded-3xl"
                >
                    <h1 className="text-5xl md:text-8xl font-heading font-bold tracking-tight leading-[1.1]">
                        <span className="block text-white drop-shadow-[0_4px_20px_rgba(0,0,0,0.8)]">Intelligence,</span>
                        <span className="block bg-clip-text text-transparent bg-linear-to-r from-indigo-300 via-blue-200 to-indigo-400 drop-shadow-[0_0_40px_rgba(79,70,229,0.5)]">
                            Beautifully Engineered.
                        </span>
                    </h1>

                    <p className="text-lg md:text-2xl text-zinc-300 font-light max-w-2xl leading-relaxed drop-shadow-md">
                        Experience the next generation of conversational AI. Fluid dynamics, dark aesthetics, and unparalleled performance.
                    </p>

                    {/* THE GLASS CTA BUTTON */}
                    <StarBorder as="div" color="#818cf8" speed="4s" className="pointer-events-auto">
                        <MotionLink
                            to="/chat"
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            className="group relative flex items-center justify-center bg-transparent transition-all duration-300 overflow-hidden px-4"
                        >
                            <span className="relative z-10 flex items-center gap-3 text-lg font-medium tracking-wide text-white group-hover:text-indigo-200">
                                Initialize Session <ArrowRight className="w-6 h-6 transition-transform group-hover:translate-x-2 text-indigo-400" />
                            </span>
                        </MotionLink>
                    </StarBorder>
                </motion.div>

            </div>

            {/* CSS for Shimmer Animation */}
            <style>{`
                @keyframes shimmer {
                    100% { transform: translateX(100%); }
                }
                .group-hover\\:animate-shimmer:hover {
                    animation: shimmer 1.5s infinite;
                }
            `}</style>
        </div>
    );
};

export default LandingPage;