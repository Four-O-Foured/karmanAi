import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link } from '@tanstack/react-router';
import { ArrowRight, Mail, Lock, User } from 'lucide-react';
import StarBorder from '../components/StarBorder';
import RocketToggleIcon from '../components/RocketToggleIcon';
import { useRegister } from '../hooks/useAuth';

export default function RegisterPage() {
    const [showPassword, setShowPassword] = useState(false);

    const {
        register,
        handleSubmit,
        watch,
        formState: { errors, isSubmitting },
    } = useForm();

    const password = watch('password');

    const { mutate: Register } = useRegister();

    const onSubmit = async (data) => {
        // Simulate API call
        const { username, email, password } = data;
        Register({ username, email, password });
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
                            Join Karman
                        </h1>
                        <p className="text-karman-muted text-sm font-body">
                            Create your account and explore beyond the boundary
                        </p>
                    </div>

                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5 relative z-10">
                        {/* Full Name Field */}
                        <div className="space-y-1.5">
                            <label
                                htmlFor="username"
                                className="block text-xs font-medium text-karman-dim uppercase tracking-wider"
                            >
                                Username
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-karman-muted">
                                    <User className="h-5 w-5" />
                                </div>
                                <input
                                    id="username"
                                    type="text"
                                    className={`w-full bg-karman-code-bg border ${errors.username ? 'border-red-500/50' : 'border-[#1b2535]'
                                        } rounded-lg pl-10 pr-4 py-3 text-karman-text placeholder-karman-dim focus:outline-none focus:border-karman-accent-2 focus:ring-1 focus:ring-karman-accent-2 transition-colors karman-transition`}
                                    placeholder="John Doe"
                                    {...register('username', {
                                        required: 'Name is required',
                                        minLength: {
                                            value: 2,
                                            message: 'Name must be at least 2 characters',
                                        }
                                    })}
                                />
                            </div>
                            {errors.username && (
                                <p className="text-red-400 text-xs mt-1">{errors.username.message}</p>
                            )}
                        </div>

                        {/* Email Field */}
                        <div className="space-y-1.5">
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
                        <div className="space-y-1.5">
                            <label
                                htmlFor="password"
                                className="block text-xs font-medium text-karman-dim uppercase tracking-wider"
                            >
                                Password
                            </label>
                            <div className="flex gap-2 items-start">
                                <div className="relative flex-1">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-karman-muted">
                                        <Lock className="h-5 w-5" />
                                    </div>
                                    <input
                                        id="password"
                                        type="password"
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
                                {errors.password && (
                                    <p className="text-red-400 text-xs mt-1">{errors.password.message}</p>
                                )}
                            </div>



                            {/* Confirm Password Field */}
                            <div className="space-y-1.5">
                                <label
                                    htmlFor="confirmPassword"
                                    className="block text-xs font-medium text-karman-dim uppercase tracking-wider"
                                >
                                    Confirm Password
                                </label>

                                <div className="relative flex gap-4">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-karman-muted">
                                        <Lock className="h-5 w-5" />
                                    </div>
                                    <input
                                        id="confirmPassword"
                                        type={showPassword ? 'text' : 'password'}
                                        className={`w-full bg-karman-code-bg border ${errors.confirmPassword ? 'border-red-500/50' : 'border-[#1b2535]'
                                            } rounded-lg pl-10 pr-4 py-3 text-karman-text placeholder-karman-dim focus:outline-none focus:border-karman-accent-2 focus:ring-1 focus:ring-karman-accent-2 transition-colors karman-transition`}
                                        placeholder="••••••••"
                                        {...register('confirmPassword', {
                                            required: 'Please confirm your password',
                                            validate: value =>
                                                value === password || "The passwords do not match"
                                        })}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="p-3 bg-karman-code-bg border border-[#1b2535]  rounded-lg text-karman-muted hover:text-karman-accent-2 transition-colors focus:outline-none focus:border-karman-accent-2 focus:ring-1 focus:ring-karman-accent-2 h-[48px] flex items-center justify-center shrink-0"
                                        aria-label={showPassword ? "Hide password" : "Show password"}
                                    >
                                        <RocketToggleIcon show={showPassword} />
                                    </button>
                                </div>

                            </div>
                            {errors.confirmPassword && (
                                <p className="text-red-400 text-xs mt-1">{errors.confirmPassword.message}</p>
                            )}
                        </div>


                        {/* Submit Button */}
                        <StarBorder
                            as="button"
                            type="submit"
                            disabled={isSubmitting}
                            className="w-full disabled:opacity-70 disabled:cursor-not-allowed mt-4"
                            color="#d4d8e0"
                        >
                            <div className="flex justify-center items-center">
                                {isSubmitting ? (
                                    <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
                                ) : (
                                    <>
                                        Create Account
                                        <ArrowRight className="ml-2 h-4 w-4 opacity-70 group-hover:translate-x-1 group-hover:opacity-100 transition-all" />
                                    </>
                                )}
                            </div>
                        </StarBorder>


                    </form>

                    {/* Footer Link */}
                    <div className="mt-6 text-center text-sm font-body text-karman-muted relative z-10">
                        Already have an account?{' '}
                        <Link
                            to="/login"
                            className="text-karman-accent-2 hover:text-white transition-colors"
                        >
                            Sign in
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
