import React, { useState, useEffect } from 'react';

const STEPS = [
    {
        id: 'welcome',
        emoji: '🌙',
        title: 'Welcome to Global Fycle',
        subtitle: 'The world\'s first cosmic period synchronization platform',
        description: 'Connect with your body, the moon, and women across the planet.',
    },
    {
        id: 'period',
        emoji: '🩸',
        title: 'When did your last period start?',
        subtitle: 'This helps us predict your cycle phases accurately',
        type: 'date',
        field: 'lastPeriodStart',
    },
    {
        id: 'cycleLength',
        emoji: '🔄',
        title: 'How long is your cycle?',
        subtitle: 'Average is 28 days — don\'t worry if you\'re not sure',
        type: 'stepper',
        field: 'cycleLength',
        min: 21,
        max: 40,
        unit: 'days',
    },
    {
        id: 'periodLength',
        emoji: '💧',
        title: 'How many days does your period last?',
        subtitle: 'This varies — just give your best estimate',
        type: 'stepper',
        field: 'periodLength',
        min: 2,
        max: 10,
        unit: 'days',
    },
    {
        id: 'interests',
        emoji: '✨',
        title: 'What interests you most?',
        subtitle: 'We\'ll personalize your experience',
        type: 'multi-select',
        options: [
            { id: 'tracking', emoji: '📊', label: 'Period prediction' },
            { id: 'fertility', emoji: '🌸', label: 'Fertility awareness' },
            { id: 'moon', emoji: '🌙', label: 'Moon connection' },
            { id: 'astrology', emoji: '♈', label: 'Cosmic insights' },
            { id: 'community', emoji: '👯', label: 'Global sisterhood' },
            { id: 'wellness', emoji: '🧘', label: 'Holistic wellness' },
        ],
    },
    {
        id: 'ready',
        emoji: '🎆',
        title: 'Your cosmic profile is ready',
        subtitle: 'You\'re about to join 3,000+ women synced across 43 countries',
        type: 'reveal',
    },
];

function ProgressBar({ current, total }) {
    return (
        <div className="onboarding-progress">
            <div className="progress-track">
                <div className="progress-fill" style={{ width: `${((current + 1) / total) * 100}%` }} />
            </div>
            <span className="progress-text">{current + 1} of {total}</span>
        </div>
    );
}

export default function Onboarding({ onComplete, moonData }) {
    const [step, setStep] = useState(0);
    const [data, setData] = useState({
        lastPeriodStart: (() => {
            const d = new Date();
            d.setDate(d.getDate() - 12);
            return d.toISOString().split('T')[0];
        })(),
        cycleLength: 28,
        periodLength: 5,
    });
    const [interests, setInterests] = useState([]);
    const [animating, setAnimating] = useState(false);
    const [particles, setParticles] = useState([]);

    const current = STEPS[step];

    useEffect(() => {
        // Spawn confetti particles on the reveal step
        if (current.id === 'ready') {
            const p = Array.from({ length: 30 }, (_, i) => ({
                id: i,
                x: Math.random() * 100,
                delay: Math.random() * 1.5,
                duration: 2 + Math.random() * 2,
                color: ['#ff2d78', '#00f5d4', '#ffd700', '#a855f7'][Math.floor(Math.random() * 4)],
                size: 4 + Math.random() * 8,
            }));
            setParticles(p);
        }
    }, [current.id]);

    const goNext = () => {
        if (step >= STEPS.length - 1) {
            onComplete(data);
            return;
        }
        setAnimating(true);
        setTimeout(() => {
            setStep(s => s + 1);
            setAnimating(false);
        }, 300);
    };

    const goBack = () => {
        if (step <= 0) return;
        setAnimating(true);
        setTimeout(() => {
            setStep(s => s - 1);
            setAnimating(false);
        }, 300);
    };

    const toggleInterest = (id) => {
        setInterests(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
    };

    return (
        <div className="onboarding-screen">
            {/* Ambient background */}
            <div className="onboarding-bg">
                <div className="ob-orb ob-orb-1" />
                <div className="ob-orb ob-orb-2" />
                <div className="ob-orb ob-orb-3" />
            </div>

            {/* Confetti on final step */}
            {current.id === 'ready' && (
                <div className="confetti-container">
                    {particles.map(p => (
                        <div
                            key={p.id}
                            className="confetti-particle"
                            style={{
                                left: `${p.x}%`,
                                animationDelay: `${p.delay}s`,
                                animationDuration: `${p.duration}s`,
                                background: p.color,
                                width: p.size,
                                height: p.size,
                            }}
                        />
                    ))}
                </div>
            )}

            <div className="onboarding-container">
                {step > 0 && <ProgressBar current={step} total={STEPS.length} />}

                <div className={`onboarding-card ${animating ? 'card-exit' : 'card-enter'}`}>
                    <div className="ob-emoji">{current.emoji}</div>
                    <h1 className="ob-title">{current.title}</h1>
                    <p className="ob-subtitle">{current.subtitle}</p>

                    {/* Date input */}
                    {current.type === 'date' && (
                        <div className="ob-input-group">
                            <input
                                type="date"
                                className="ob-date-input"
                                value={data.lastPeriodStart}
                                onChange={e => setData(d => ({ ...d, lastPeriodStart: e.target.value }))}
                            />
                        </div>
                    )}

                    {/* Stepper input */}
                    {current.type === 'stepper' && (
                        <div className="ob-stepper">
                            <button
                                className="ob-stepper-btn"
                                onClick={() => setData(d => ({ ...d, [current.field]: Math.max(current.min, d[current.field] - 1) }))}
                            >−</button>
                            <div className="ob-stepper-value">
                                <span className="ob-stepper-num">{data[current.field]}</span>
                                <span className="ob-stepper-unit">{current.unit}</span>
                            </div>
                            <button
                                className="ob-stepper-btn"
                                onClick={() => setData(d => ({ ...d, [current.field]: Math.min(current.max, d[current.field] + 1) }))}
                            >+</button>
                        </div>
                    )}

                    {/* Multi-select */}
                    {current.type === 'multi-select' && (
                        <div className="ob-select-grid">
                            {current.options.map(opt => (
                                <button
                                    key={opt.id}
                                    className={`ob-select-item ${interests.includes(opt.id) ? 'selected' : ''}`}
                                    onClick={() => toggleInterest(opt.id)}
                                >
                                    <span className="ob-select-emoji">{opt.emoji}</span>
                                    <span className="ob-select-label">{opt.label}</span>
                                </button>
                            ))}
                        </div>
                    )}

                    {/* Cosmic reveal */}
                    {current.type === 'reveal' && (
                        <div className="ob-reveal">
                            <div className="ob-reveal-ring">
                                <div className="ob-reveal-moon">{moonData?.emoji || '🌙'}</div>
                            </div>
                            <div className="ob-reveal-stats">
                                <div className="ob-reveal-stat">
                                    <span className="ob-reveal-num">{data.cycleLength}</span>
                                    <span className="ob-reveal-label">day cycle</span>
                                </div>
                                <div className="ob-reveal-divider" />
                                <div className="ob-reveal-stat">
                                    <span className="ob-reveal-num">{moonData?.phaseName || 'Waxing'}</span>
                                    <span className="ob-reveal-label">current moon</span>
                                </div>
                                <div className="ob-reveal-divider" />
                                <div className="ob-reveal-stat">
                                    <span className="ob-reveal-num">3,000+</span>
                                    <span className="ob-reveal-label">sisters synced</span>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Welcome step description */}
                    {current.id === 'welcome' && (
                        <p className="ob-description">{current.description}</p>
                    )}
                </div>

                {/* Navigation buttons */}
                <div className="ob-actions">
                    {step > 0 && (
                        <button className="ob-back" onClick={goBack}>← Back</button>
                    )}
                    <button className="ob-next" onClick={goNext}>
                        {step === 0 ? 'Get Started' : step >= STEPS.length - 1 ? 'Enter Global Fycle ✨' : 'Continue'}
                    </button>
                </div>

                {step === 0 && (
                    <button className="ob-skip" onClick={() => onComplete(data)}>
                        Skip — I've done this before
                    </button>
                )}
            </div>
        </div>
    );
}
