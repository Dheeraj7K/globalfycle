import React, { useState, useEffect } from 'react';

function Tooltip({ text, children }) {
    const [show, setShow] = useState(false);
    return (
        <div style={{ position: 'relative', display: 'inline-block' }}
            onMouseEnter={() => setShow(true)} onMouseLeave={() => setShow(false)}
            onClick={() => setShow(s => !s)}>
            {children}
            {show && (
                <div className="ob-tooltip">
                    <div className="ob-tooltip-arrow" />
                    {text}
                </div>
            )}
        </div>
    );
}

const STEPS = [
    {
        id: 'welcome',
        emoji: '🌙',
        title: 'Welcome to Global Fycle',
        subtitle: 'The world\'s first cosmic period synchronization platform',
        description: 'Connect with your body, the moon, and women across the planet.',
    },
    {
        id: 'about',
        emoji: '✨',
        title: 'Tell us about you',
        subtitle: 'Your identity in the cosmic sisterhood',
        type: 'about',
    },
    {
        id: 'birth',
        emoji: '🌟',
        title: 'When & where were you born?',
        subtitle: 'This helps us calculate your personal birth chart',
        type: 'birth',
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
        subtitle: 'Welcome to the global sisterhood',
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
    const [birthData, setBirthData] = useState({
        name: '',
        dob: '',
        birthTime: '',
        birthTimeUnknown: false,
        birthPlace: '',
    });
    const [interests, setInterests] = useState([]);
    const [animating, setAnimating] = useState(false);
    const [particles, setParticles] = useState([]);

    const current = STEPS[step];

    // Calculate age from DOB
    const calcAge = (dob) => {
        if (!dob) return null;
        const born = new Date(dob);
        const today = new Date();
        let age = today.getFullYear() - born.getFullYear();
        const m = today.getMonth() - born.getMonth();
        if (m < 0 || (m === 0 && today.getDate() < born.getDate())) age--;
        return age;
    };

    const age = calcAge(birthData.dob);

    // Get zodiac sign from DOB (preview)
    const getSignFromDOB = (dob) => {
        if (!dob) return null;
        const d = new Date(dob);
        const month = d.getMonth() + 1;
        const day = d.getDate();
        const signs = [
            { sign: 'Capricorn', emoji: '♑', start: [1, 1], end: [1, 19] },
            { sign: 'Aquarius', emoji: '♒', start: [1, 20], end: [2, 18] },
            { sign: 'Pisces', emoji: '♓', start: [2, 19], end: [3, 20] },
            { sign: 'Aries', emoji: '♈', start: [3, 21], end: [4, 19] },
            { sign: 'Taurus', emoji: '♉', start: [4, 20], end: [5, 20] },
            { sign: 'Gemini', emoji: '♊', start: [5, 21], end: [6, 20] },
            { sign: 'Cancer', emoji: '♋', start: [6, 21], end: [7, 22] },
            { sign: 'Leo', emoji: '♌', start: [7, 23], end: [8, 22] },
            { sign: 'Virgo', emoji: '♍', start: [8, 23], end: [9, 22] },
            { sign: 'Libra', emoji: '♎', start: [9, 23], end: [10, 22] },
            { sign: 'Scorpio', emoji: '♏', start: [10, 23], end: [11, 21] },
            { sign: 'Sagittarius', emoji: '♐', start: [11, 22], end: [12, 21] },
            { sign: 'Capricorn', emoji: '♑', start: [12, 22], end: [12, 31] },
        ];
        for (const s of signs) {
            const [sm, sd] = s.start;
            const [em, ed] = s.end;
            if ((month === sm && day >= sd) || (month === em && day <= ed)) return s;
        }
        return signs[0];
    };

    const sunSign = getSignFromDOB(birthData.dob);

    useEffect(() => {
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
            onComplete({ ...data, birthData });
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

    const canProceed = () => {
        if (current.id === 'about') return birthData.name.trim().length >= 1 && birthData.dob;
        if (current.id === 'birth') return true; // birth time and place are optional
        return true;
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

                    {/* About You step */}
                    {current.type === 'about' && (
                        <div className="ob-input-group" style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                            <div>
                                <div className="ob-field-header">
                                    <label className="ob-field-label">Your Name</label>
                                    <Tooltip text="This is what we'll call you! Like your superpower name ✨">
                                        <span className="ob-help-icon">?</span>
                                    </Tooltip>
                                </div>
                                <input
                                    type="text"
                                    className="ob-text-input"
                                    placeholder="Enter your name"
                                    value={birthData.name}
                                    onChange={e => setBirthData(d => ({ ...d, name: e.target.value }))}
                                    autoFocus
                                />
                            </div>
                            <div>
                                <div className="ob-field-header">
                                    <label className="ob-field-label">Date of Birth</label>
                                    <Tooltip text="The day you were born! The stars and moon were in a special place just for you 🌟">
                                        <span className="ob-help-icon">?</span>
                                    </Tooltip>
                                </div>
                                <input
                                    type="date"
                                    className="ob-date-input"
                                    value={birthData.dob}
                                    onChange={e => setBirthData(d => ({ ...d, dob: e.target.value }))}
                                />
                                {birthData.dob && (
                                    <div className="ob-dob-preview">
                                        <span className="ob-age-badge">{age} years old</span>
                                        {sunSign && <span className="ob-sign-badge">{sunSign.emoji} {sunSign.sign}</span>}
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    {/* Birth Details step */}
                    {current.type === 'birth' && (
                        <div className="ob-input-group" style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                            <div>
                                <div className="ob-field-header">
                                    <label className="ob-field-label">Birth Time</label>
                                    <Tooltip text="What time you were born tells us which stars were rising in the sky when you took your first breath 🌅">
                                        <span className="ob-help-icon">?</span>
                                    </Tooltip>
                                </div>
                                {!birthData.birthTimeUnknown ? (
                                    <input
                                        type="time"
                                        className="ob-date-input"
                                        value={birthData.birthTime}
                                        onChange={e => setBirthData(d => ({ ...d, birthTime: e.target.value }))}
                                    />
                                ) : (
                                    <div className="ob-unknown-msg">That's okay! We'll calculate what we can without it 💫</div>
                                )}
                                <button
                                    className={`ob-toggle-btn ${birthData.birthTimeUnknown ? 'active' : ''}`}
                                    onClick={() => setBirthData(d => ({ ...d, birthTimeUnknown: !d.birthTimeUnknown, birthTime: '' }))}
                                >
                                    {birthData.birthTimeUnknown ? '✓ ' : ''}I don't know my birth time
                                </button>
                            </div>
                            <div>
                                <div className="ob-field-header">
                                    <label className="ob-field-label">Birth Place</label>
                                    <Tooltip text="Where you were born matters because the sky looks different from different places on Earth 🌍">
                                        <span className="ob-help-icon">?</span>
                                    </Tooltip>
                                </div>
                                <input
                                    type="text"
                                    className="ob-text-input"
                                    placeholder="City, Country (e.g. Mumbai, India)"
                                    value={birthData.birthPlace}
                                    onChange={e => setBirthData(d => ({ ...d, birthPlace: e.target.value }))}
                                />
                                <div style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.35)', marginTop: 6 }}>
                                    Optional — helps calculate your rising sign more precisely
                                </div>
                            </div>
                        </div>
                    )}

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
                                    <span className="ob-reveal-num">{sunSign ? sunSign.emoji : '🌙'}</span>
                                    <span className="ob-reveal-label">{sunSign ? sunSign.sign : 'your sign'}</span>
                                </div>
                                <div className="ob-reveal-divider" />
                                <div className="ob-reveal-stat">
                                    <span className="ob-reveal-num">{moonData?.phaseName || 'Waxing'}</span>
                                    <span className="ob-reveal-label">current moon</span>
                                </div>
                            </div>
                            {birthData.name && (
                                <div style={{ marginTop: 16, fontSize: '1rem', color: 'rgba(255,255,255,0.7)' }}>
                                    Welcome, <span style={{ color: '#ffd700', fontWeight: 600 }}>{birthData.name}</span> ✨
                                </div>
                            )}
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
                    <button className="ob-next" onClick={goNext} disabled={!canProceed()}
                        style={{ opacity: canProceed() ? 1 : 0.5 }}>
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
