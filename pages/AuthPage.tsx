import React, { useState } from 'react';
import { supabase } from '../services/supabase';
import { useNavigate } from 'react-router-dom';
import { Sparkles, ArrowRight, Loader2, AlertCircle } from 'lucide-react';

export const AuthPage: React.FC = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [mode, setMode] = useState<'signin' | 'signup'>('signup');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const navigate = useNavigate();

    const handleAuth = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            if (mode === 'signup') {
                const { error } = await supabase.auth.signUp({
                    email,
                    password,
                });
                if (error) throw error;
                // Auto sign in or show verification message could be handled here
                // For simplicity, we'll try to sign in immediately if auto-confirm is enabled,
                // or just let them know to check email if needed.
                // Assuming Supabase project defaults (confirm email might be off or on).
                // If "Enable Email Confirm" is OFF, they are signed in.
                // If ON, they need to verify.
                // We'll assume a direct entry for this demo or handle the session check.
            } else {
                const { error } = await supabase.auth.signInWithPassword({
                    email,
                    password,
                });
                if (error) throw error;
            }
            // Successful auth automatically updates context, which redirects via ProtectedRoute mechanism if we were there,
            // but here we are on /auth.
            // We should redirect manually to /
            navigate('/');
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleGoogleLogin = async () => {
        try {
            setLoading(true);
            const { error } = await supabase.auth.signInWithOAuth({
                provider: 'google',
                options: {
                    redirectTo: `${window.location.origin}/`,
                }
            });
            if (error) throw error;
        } catch (err: any) {
            setError(err.message);
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#050505] flex flex-col items-center justify-center p-4 selection:bg-yellow-500/30 selection:text-yellow-200 overflow-hidden relative">

            {/* Background Ambience */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
                <div className="absolute top-[-20%] left-1/2 -translate-x-1/2 w-[800px] h-[600px] bg-yellow-500/5 rounded-full blur-[120px]"></div>
                <div className="absolute bottom-0 right-0 w-[600px] h-[600px] bg-yellow-900/5 rounded-full blur-[100px]"></div>
            </div>

            <div className="w-full max-w-md relative z-10">

                {/* Header */}
                <div className="text-center mb-10">
                    <div className="inline-flex items-center justify-center gap-2 mb-4 px-4 py-1.5 rounded-full border border-yellow-500/30 bg-yellow-500/5 backdrop-blur-sm">
                        <Sparkles className="w-4 h-4 text-yellow-400" />
                        <span className="text-xs uppercase tracking-[0.2em] text-yellow-400 font-semibold">Secure Access</span>
                    </div>
                    <h1 className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-b from-white via-yellow-100 to-yellow-600 tracking-tighter mb-2">
                        neon voice
                    </h1>
                    <p className="text-yellow-100/40 font-light text-lg">
                        identify yourself to proceed
                    </p>
                </div>

                {/* Auth Card */}
                <div className="bg-black/40 backdrop-blur-xl border border-yellow-500/20 rounded-2xl p-8 shadow-2xl relative overflow-hidden group">

                    {/* Hover Glow */}
                    <div className="absolute -inset-1 bg-gradient-to-r from-yellow-600/0 via-yellow-500/10 to-yellow-600/0 rounded-2xl blur opacity-0 group-hover:opacity-100 transition duration-1000"></div>

                    <div className="relative z-10 flex flex-col gap-5">
                        <button
                            type="button"
                            onClick={handleGoogleLogin}
                            disabled={loading}
                            className="w-full bg-white text-black font-semibold py-3.5 rounded-lg hover:bg-gray-100 focus:ring-2 focus:ring-white/50 transition-all transform hover:scale-[1.01] active:scale-[0.99] flex items-center justify-center gap-2 mb-2"
                        >
                            <svg className="w-5 h-5" viewBox="0 0 24 24">
                                <path
                                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                                    fill="#4285F4"
                                />
                                <path
                                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                                    fill="#34A853"
                                />
                                <path
                                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                                    fill="#FBBC05"
                                />
                                <path
                                    d="M12 4.63c1.61 0 3.06.56 4.21 1.64l3.16-3.16C17.45 1.19 14.97 0 12 0 7.7 0 3.99 2.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                                    fill="#EA4335"
                                />
                            </svg>
                            <span>Sign in with Google</span>
                        </button>

                        <div className="relative">
                            <div className="absolute inset-0 flex items-center">
                                <span className="w-full border-t border-yellow-500/20"></span>
                            </div>
                            <div className="relative flex justify-center text-xs uppercase">
                                <span className="bg-[#050505] px-2 text-yellow-500/40 font-mono tracking-widest">Or continue with email</span>
                            </div>
                        </div>

                        <form onSubmit={handleAuth} className="flex flex-col gap-5">

                            {error && (
                                <div className="bg-red-950/30 border border-red-500/30 rounded-lg p-3 flex items-start gap-3 backdrop-blur-md animate-in fade-in slide-in-from-top-2">
                                    <AlertCircle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
                                    <span className="text-sm text-red-200/80 font-light">{error}</span>
                                </div>
                            )}

                            <div className="space-y-1.5">
                                <label className="text-xs font-mono text-yellow-500/60 uppercase tracking-wider ml-1">Email Address</label>
                                <input
                                    type="email"
                                    required
                                    className="w-full bg-black/50 border border-yellow-500/20 rounded-lg px-4 py-3 text-yellow-100 placeholder-yellow-500/20 focus:outline-none focus:border-yellow-500/60 focus:ring-1 focus:ring-yellow-500/60 transition-all"
                                    placeholder="user@example.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                            </div>

                            <div className="space-y-1.5">
                                <label className="text-xs font-mono text-yellow-500/60 uppercase tracking-wider ml-1">Password</label>
                                <input
                                    type="password"
                                    required
                                    minLength={6}
                                    className="w-full bg-black/50 border border-yellow-500/20 rounded-lg px-4 py-3 text-yellow-100 placeholder-yellow-500/20 focus:outline-none focus:border-yellow-500/60 focus:ring-1 focus:ring-yellow-500/60 transition-all font-mono"
                                    placeholder="••••••••"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className="mt-4 w-full bg-yellow-500 text-black font-bold py-3.5 rounded-lg hover:bg-yellow-400 focus:ring-2 focus:ring-yellow-500/50 transition-all transform hover:scale-[1.01] active:scale-[0.99] flex items-center justify-center gap-2"
                            >
                                {loading ? (
                                    <Loader2 className="w-5 h-5 animate-spin" />
                                ) : (
                                    <>
                                        <span>{mode === 'signin' ? 'Initialize Session' : 'Create Account'}</span>
                                        <ArrowRight className="w-5 h-5" />
                                    </>
                                )}
                            </button>
                        </form>

                        <div className="mt-6 text-center">
                            <button
                                onClick={() => setMode(mode === 'signin' ? 'signup' : 'signin')}
                                className="text-sm text-yellow-500/60 hover:text-yellow-400 transition-colors hover:underline underline-offset-4"
                            >
                                {mode === 'signin' ? "Don't have access? Sign up" : "Already have an account? Sign in"}
                            </button>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
};
