import React, { useState } from 'react';
import { signInWithGoogle, signInWithApple, signInWithEmail, signUpWithEmail } from '../firebase';

export default function Login({ onLogin, moonData }) {
    const [animating, setAnimating] = useState(false);
    const [selected, setSelected] = useState(null);
    const [showEmail, setShowEmail] = useState(false);
    const [isSignUp, setIsSignUp] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSocialLogin = async (provider) => {
        setSelected(provider);
        setError('');
        setLoading(true);
        try {
            let user;
            if (provider === 'google') {
                user = await signInWithGoogle();
            } else if (provider === 'apple') {
                user = await signInWithApple();
            } else if (provider === 'email') {
                setShowEmail(true);
                setLoading(false);
                return;
            } else {
                // Pinterest: fallback to mock for now
                setAnimating(true);
                setTimeout(() => onLogin({ uid: 'demo', displayName: 'Demo User', email: 'demo@globalfycle.com' }), 800);
                return;
            }
            setAnimating(true);
            setTimeout(() => onLogin(user), 600);
        } catch (err) {
            console.error('Login error:', err);
            setError(err.message?.replace('Firebase: ', '') || 'Login failed. Please try again.');
            setLoading(false);
            setSelected(null);
        }
    };

    const handleEmailSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            let user;
            if (isSignUp) {
                user = await signUpWithEmail(email, password, name);
            } else {
                user = await signInWithEmail(email, password);
            }
            setAnimating(true);
            setTimeout(() => onLogin(user), 600);
        } catch (err) {
            console.error('Email auth error:', err);
            const msg = err.code === 'auth/invalid-credential' ? 'Wrong email or password'
                : err.code === 'auth/email-already-in-use' ? 'Email already taken — try signing in'
                    : err.code === 'auth/weak-password' ? 'Password must be at least 6 characters'
                        : err.code === 'auth/invalid-email' ? 'Enter a valid email address'
                            : err.message?.replace('Firebase: ', '') || 'Something went wrong';
            setError(msg);
            setLoading(false);
        }
    };

    const SOCIAL_BUTTONS = [
        { id: 'google', name: 'Continue with Google', icon: '🔵', bg: '#ffffff', color: '#333' },
        { id: 'apple', name: 'Continue with Apple', icon: '🍎', bg: '#000000', color: '#fff' },
        { id: 'email', name: 'Continue with Email', icon: '✉️', bg: 'rgba(255,255,255,0.08)', color: '#fff' },
    ];

    return (
        <div style={{
            minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
            background: 'radial-gradient(ellipse at 30% 20%, rgba(107,33,168,0.2) 0%, transparent 50%), radial-gradient(ellipse at 70% 80%, rgba(255,45,120,0.12) 0%, transparent 50%), #0a0612',
            position: 'relative', overflow: 'hidden',
        }}>
            {/* Floating particles */}
            {[...Array(30)].map((_, i) => (
                <div key={i} style={{
                    position: 'absolute',
                    width: 2 + Math.random() * 3, height: 2 + Math.random() * 3,
                    borderRadius: '50%', background: 'rgba(255,255,255,0.15)',
                    top: `${Math.random() * 100}%`, left: `${Math.random() * 100}%`,
                    animation: `float ${3 + Math.random() * 4}s ease infinite`,
                    animationDelay: `${Math.random() * 3}s`,
                }} />
            ))}

            <div style={{
                width: 420, maxWidth: '90vw', textAlign: 'center', position: 'relative', zIndex: 1,
                opacity: animating ? 0 : 1, transform: animating ? 'scale(0.95)' : 'scale(1)',
                transition: 'all 0.6s cubic-bezier(0.16,1,0.3,1)',
            }}>
                {/* Logo */}
                <div style={{ marginBottom: 8 }}>
                    <div style={{
                        width: 80, height: 80, borderRadius: 20, margin: '0 auto 16px',
                        background: 'linear-gradient(135deg, #ff2d78 0%, #a855f7 50%, #00f5d4 100%)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2.5rem',
                        boxShadow: '0 0 40px rgba(255,45,120,0.4)',
                    }}>🌙</div>
                    <h1 style={{
                        fontFamily: "'Playfair Display', serif", fontSize: '2.8rem', fontWeight: 700,
                        background: 'linear-gradient(135deg, #ff2d78 0%, #a855f7 50%, #00f5d4 100%)',
                        WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
                        marginBottom: 6,
                    }}>Global Fycle</h1>
                    <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.85rem', letterSpacing: 1 }}>
                        Cosmic Period Synchronization
                    </p>
                </div>

                {/* Moon phase */}
                <div style={{
                    margin: '24px auto', padding: '14px 24px', borderRadius: 999, display: 'inline-flex',
                    alignItems: 'center', gap: 10, background: 'rgba(255,255,255,0.06)',
                    border: '1px solid rgba(255,255,255,0.1)',
                }}>
                    <span style={{ fontSize: '1.4rem' }}>{moonData.emoji}</span>
                    <span style={{ color: '#ffd700', fontSize: '0.8rem', fontWeight: 500 }}>{moonData.phaseName}</span>
                    <span style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.75rem' }}>{moonData.illumination}% illuminated</span>
                </div>

                {/* Tagline */}
                <p style={{
                    color: 'rgba(255,255,255,0.6)', fontSize: '1rem', lineHeight: 1.6,
                    margin: '20px 0 32px', fontStyle: 'italic', fontFamily: "'Playfair Display', serif",
                }}>
                    "You are not just a woman tracking her cycle.<br />
                    You are a universe discovering her rhythm."
                </p>

                {/* Error display */}
                {error && (
                    <div style={{
                        padding: '10px 16px', borderRadius: 10, marginBottom: 12,
                        background: 'rgba(255,45,78,0.12)', border: '1px solid rgba(255,45,78,0.3)',
                        color: '#ff6b6b', fontSize: '0.8rem',
                    }}>
                        {error}
                    </div>
                )}

                {/* Email form */}
                {showEmail ? (
                    <form onSubmit={handleEmailSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                        {isSignUp && (
                            <input
                                type="text" placeholder="Your name" value={name}
                                onChange={e => setName(e.target.value)}
                                style={{
                                    padding: '14px 18px', borderRadius: 12, border: '1px solid rgba(255,255,255,0.15)',
                                    background: 'rgba(255,255,255,0.06)', color: '#fff', fontFamily: "'Inter', sans-serif",
                                    fontSize: '0.9rem', outline: 'none',
                                }}
                            />
                        )}
                        <input
                            type="email" placeholder="Email address" value={email} required
                            onChange={e => setEmail(e.target.value)}
                            style={{
                                padding: '14px 18px', borderRadius: 12, border: '1px solid rgba(255,255,255,0.15)',
                                background: 'rgba(255,255,255,0.06)', color: '#fff', fontFamily: "'Inter', sans-serif",
                                fontSize: '0.9rem', outline: 'none',
                            }}
                        />
                        <input
                            type="password" placeholder="Password" value={password} required minLength={6}
                            onChange={e => setPassword(e.target.value)}
                            style={{
                                padding: '14px 18px', borderRadius: 12, border: '1px solid rgba(255,255,255,0.15)',
                                background: 'rgba(255,255,255,0.06)', color: '#fff', fontFamily: "'Inter', sans-serif",
                                fontSize: '0.9rem', outline: 'none',
                            }}
                        />
                        <button type="submit" disabled={loading} style={{
                            padding: '14px 24px', borderRadius: 12, border: 'none',
                            background: 'linear-gradient(135deg, #ff2d78, #a855f7)', color: '#fff',
                            fontSize: '0.9rem', fontWeight: 600, cursor: loading ? 'wait' : 'pointer',
                            fontFamily: "'Inter', sans-serif", opacity: loading ? 0.7 : 1,
                        }}>
                            {loading ? '⏳ Signing in...' : isSignUp ? 'Create Account ✨' : 'Sign In →'}
                        </button>
                        <button type="button" onClick={() => setIsSignUp(!isSignUp)} style={{
                            background: 'none', border: 'none', color: 'rgba(255,255,255,0.5)',
                            cursor: 'pointer', fontSize: '0.8rem', fontFamily: "'Inter', sans-serif",
                        }}>
                            {isSignUp ? 'Already have an account? Sign in' : "Don't have an account? Sign up"}
                        </button>
                        <button type="button" onClick={() => { setShowEmail(false); setError(''); }} style={{
                            background: 'none', border: 'none', color: 'rgba(255,255,255,0.35)',
                            cursor: 'pointer', fontSize: '0.75rem', fontFamily: "'Inter', sans-serif",
                        }}>
                            ← Back to social login
                        </button>
                    </form>
                ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                        {SOCIAL_BUTTONS.map(p => (
                            <button key={p.id} onClick={() => handleSocialLogin(p.id)} disabled={loading} style={{
                                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12,
                                padding: '14px 24px', borderRadius: 12,
                                border: p.id === 'google' ? '1px solid rgba(255,255,255,0.2)' : '1px solid transparent',
                                background: p.bg, color: p.color, fontSize: '0.9rem', fontWeight: 500,
                                cursor: loading ? 'wait' : 'pointer', transition: 'all 0.3s',
                                fontFamily: "'Inter', sans-serif",
                                transform: selected === p.id ? 'scale(0.97)' : 'scale(1)',
                                opacity: loading && selected !== p.id ? 0.5 : 1,
                            }}>
                                <span style={{ fontSize: '1.2rem' }}>{p.icon}</span> {p.name}
                                {loading && selected === p.id && <span>⏳</span>}
                            </button>
                        ))}
                    </div>
                )}

                <p style={{ color: 'rgba(255,255,255,0.3)', fontSize: '0.7rem', marginTop: 24 }}>
                    By continuing, you agree to our Privacy Policy & Terms of Service.<br />
                    Your data is encrypted and never shared without consent.
                </p>
            </div>
        </div>
    );
}
