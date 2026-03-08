import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link } from '@tanstack/react-router';
import { ArrowRight, Mail, Lock } from 'lucide-react';
import StarBorder from '../components/StarBorder';
import { useLogin } from '../hooks/useAuth';
import RocketToggleIcon from '../components/RocketToggleIcon';

export default function LoginPage() {
    const [showPassword, setShowPassword] = useState(false);

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm();

    const { mutate: login, isPending: isSubmitting } = useLogin();

    const onSubmit = (data) => {
        console.log(data);
        login(data);
    };

    return (
        <div className="min-h-screen bg-karman-bg text-karman-text flex items-center justify-center p-4 relative overflow-hidden">
            {/* Background ambient light */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-karman-accent-2/10 rounded-full blur-[120px] pointer-events-none data-[animate=true]:animate-pulse-slow"></div>

            <div className="w-full max-w-md animate-karman-fade">
                {/* Karman Glass Card */}
                <div className="karman-glass-strong rounded-2xl p-8 relative overflow-hidden karman-noise shadow-2xl">
                    {/* Header Line */}
                    <div className="absolute top-0 left-0 w-full karman-header-line"></div>

                    <div className="text-center mb-8 relative z-10">
                        <h1 className="text-3xl font-heading font-bold karman-gradient-text mb-2">
                            Welcome Back
                        </h1>
                        <p className="text-karman-muted text-sm font-body">
                            Sign in to continue to Karman
                        </p>
                    </div>

                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 relative z-10">
                        {/* Email Field */}
                        <div className="space-y-2">
                            <label
                                htmlFor="email"
                                className="block text-xs font-medium text-karman-dim uppercase tracking-wider"
                            >
                                Email Address
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-karman-muted">
                                    <Mail className="h-5 w-5" />
                                </div>
                                <input
                                    id="email"
                                    type="email"
                                    className={`w-full bg-karman-code-bg border ${errors.email ? 'border-red-500/50' : 'border-[#1b2535]'
                                        } rounded-lg pl-10 pr-4 py-3 text-karman-text placeholder-karman-dim focus:outline-none focus:border-karman-accent-2 focus:ring-1 focus:ring-karman-accent-2 transition-colors karman-transition`}
                                    placeholder="you@example.com"
                                    {...register('email', {
                                        required: 'Email is required',
                                        pattern: {
                                            value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                                            message: 'Invalid email address',
                                        },
                                    })}
                                />
                            </div>
                            {errors.email && (
                                <p className="text-red-400 text-xs mt-1">{errors.email.message}</p>
                            )}
                        </div>

                        {/* Password Field */}
                        <div className="space-y-2">
                            <div className="flex justify-between items-center">
                                <label
                                    htmlFor="password"
                                    className="block text-xs font-medium text-karman-dim uppercase tracking-wider"
                                >
                                    Password
                                </label>
                                <a
                                    href="#"
                                    className="text-xs text-karman-accent-2 hover:text-[#427abf] transition-colors"
                                >
                                    Forgot?
                                </a>
                            </div>
                            <div className="flex gap-2 items-start">
                                <div className="relative flex-1">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-karman-muted">
                                        <Lock className="h-5 w-5" />
                                    </div>
                                    <input
                                        id="password"
                                        type={showPassword ? 'text' : 'password'}
                                        className={`w-full bg-karman-code-bg border ${errors.password ? 'border-red-500/50' : 'border-[#1b2535]'
                                            } rounded-lg pl-10 pr-4 py-3 text-karman-text placeholder-karman-dim focus:outline-none focus:border-karman-accent-2 focus:ring-1 focus:ring-karman-accent-2 transition-colors karman-transition`}
                                        placeholder="••••••••"
                                        {...register('password', {
                                            required: 'Password is required',
                                            minLength: {
                                                value: 6,
                                                message: 'Password must be at least 6 characters',
                                            },
                                        })}
                                    />
                                </div>
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="p-3 bg-karman-code-bg border border-[#1b2535] rounded-lg text-karman-muted hover:text-karman-accent-2 transition-colors focus:outline-none focus:border-karman-accent-2 focus:ring-1 focus:ring-karman-accent-2 h-[48px] flex items-center justify-center shrink-0"
                                    aria-label={showPassword ? "Hide password" : "Show password"}
                                >
                                    <RocketToggleIcon show={showPassword} />
                                </button>
                            </div>
                            {errors.password && (
                                <p className="text-red-400 text-xs mt-1">{errors.password.message}</p>
                            )}
                        </div>

                        {/* Submit Button */}
                        <StarBorder
                            as="button"
                            type="submit"
                            disabled={isSubmitting}
                            className="w-full disabled:opacity-70 disabled:cursor-not-allowed mt-2"
                            color="#d4d8e0"
                        >
                            <div className="flex justify-center items-center">
                                {isSubmitting ? (
                                    <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
                                ) : (
                                    <>
                                        Sign In
                                        <ArrowRight className="ml-2 h-4 w-4 opacity-70 group-hover:translate-x-1 group-hover:opacity-100 transition-all" />
                                    </>
                                )}
                            </div>
                        </StarBorder>
                    </form>

                    {/* Footer Link */}
                    <div className="mt-6 text-center text-sm font-body text-karman-muted relative z-10">
                        Don't have an account?{' '}
                        <Link
                            to="/register"
                            className="text-karman-accent-2 hover:text-white transition-colors"
                        >
                            Create one
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
