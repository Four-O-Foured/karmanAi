import React from 'react';

export default function RocketToggleIcon({ show, className = "w-6 h-6" }) {
    return (
        <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            className={className}
        >
            {/* Core / Eye (revealed when open) */}
            <g
                className={`origin-center transition-all ${show
                        ? 'opacity-100 scale-100 duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)]'
                        : 'opacity-0 scale-50 duration-300 ease-out'
                    }`}
                style={{ transformOrigin: '12px 12px' }}
            >
                <path d="M4 12s3-6 8-6 8 6 8 6-3 6-8 6-8-6-8-6z" />
                <circle cx="12" cy="12" r="3" />
            </g>

            {/* Left rocket half */}
            <g
                className={`transition-all ${show
                        ? '-translate-x-4 -rotate-45 opacity-0 duration-500 ease-out'
                        : 'translate-x-0 rotate-0 opacity-100 duration-300 ease-out'
                    }`}
                style={{ transformOrigin: '12px 18px' }}
            >
                <path d="M12 2c-2 2-4 5.5-4 10v6h4z" />
                <path d="M8 14l-3 4v1h3" />
            </g>

            {/* Right rocket half */}
            <g
                className={`transition-all ${show
                        ? 'translate-x-4 rotate-45 opacity-0 duration-500 ease-out'
                        : 'translate-x-0 rotate-0 opacity-100 duration-300 ease-out'
                    }`}
                style={{ transformOrigin: '12px 18px' }}
            >
                <path d="M12 2c2 2 4 5.5 4 10v6h-4z" />
                <path d="M16 14l3 4v1h-3" />
            </g>

            {/* Flame */}
            <path
                className={`transition-all ${show
                        ? 'scale-0 opacity-0 duration-300 ease-out'
                        : 'scale-100 opacity-100 duration-300 ease-out'
                    }`}
                d="M10 18l2 4 2-4"
                style={{ transformOrigin: '12px 18px' }}
            />

            {/* Little window */}
            <circle
                cx="12" cy="10" r="1.5"
                className={`transition-all ${show
                        ? 'scale-0 opacity-0 duration-300 ease-out'
                        : 'scale-100 opacity-100 duration-300 ease-out'
                    }`}
                style={{ transformOrigin: '12px 10px' }}
            />
        </svg>
    );
}
