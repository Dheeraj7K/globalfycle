import React, { useState } from 'react';

const FLOW_OPTIONS = [
    { value: 0, label: 'No flow', emoji: '⚪', color: 'rgba(255,255,255,0.15)' },
    { value: 1, label: 'Spotting', emoji: '🩸', color: '#ff9eb5' },
    { value: 2, label: 'Light', emoji: '🩸', color: '#ff5c9e' },
    { value: 3, label: 'Medium', emoji: '🩸🩸', color: '#ff2d78' },
    { value: 4, label: 'Heavy', emoji: '🩸🩸🩸', color: '#cc0044' },
];

const MOOD_OPTIONS = [
    { value: 'great', emoji: '😊', label: 'Great' },
    { value: 'good', emoji: '🙂', label: 'Good' },
    { value: 'meh', emoji: '😐', label: 'Meh' },
    { value: 'low', emoji: '😔', label: 'Low' },
    { value: 'anxious', emoji: '😰', label: 'Anxious' },
    { value: 'irritable', emoji: '😤', label: 'Irritable' },
    { value: 'emotional', emoji: '🥺', label: 'Emotional' },
    { value: 'energetic', emoji: '⚡', label: 'Energetic' },
];

const SYMPTOM_OPTIONS = [
    { value: 'cramps', emoji: '😣', label: 'Cramps' },
    { value: 'bloating', emoji: '🫃', label: 'Bloating' },
    { value: 'headache', emoji: '🤕', label: 'Headache' },
    { value: 'fatigue', emoji: '😴', label: 'Fatigue' },
    { value: 'breast_tenderness', emoji: '💗', label: 'Breast Pain' },
    { value: 'backache', emoji: '🔙', label: 'Back Pain' },
    { value: 'nausea', emoji: '🤢', label: 'Nausea' },
    { value: 'acne', emoji: '😖', label: 'Acne' },
    { value: 'insomnia', emoji: '🌙', label: 'Insomnia' },
    { value: 'cravings', emoji: '🍫', label: 'Cravings' },
    { value: 'dizziness', emoji: '💫', label: 'Dizzy' },
    { value: 'hot_flashes', emoji: '🥵', label: 'Hot Flashes' },
];

export default function DailyCheckin({ cycleInfo, moonData, onComplete, onSkip }) {
    const [step, setStep] = useState(0); // 0=flow, 1=mood, 2=symptoms, 3=done
    const [flow, setFlow] = useState(null);
    const [mood, setMood] = useState(null);
    const [symptoms, setSymptoms] = useState([]);

    const todayStr = new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });

    const toggleSymptom = (val) => {
        setSymptoms(prev => prev.includes(val) ? prev.filter(s => s !== val) : [...prev, val]);
    };

    const handleComplete = () => {
        onComplete({
            flow: flow ?? 0,
            mood,
            symptoms,
        });
    };

    const handleNext = () => {
        if (step < 2) {
            setStep(step + 1);
        } else {
            handleComplete();
        }
    };

    return (
        <div className="briefing-overlay" onClick={onSkip}>
            <div className="briefing-sheet" onClick={e => e.stopPropagation()} style={{ maxWidth: 420 }}>
                <div className="briefing-handle" />

                {/* Header */}
                <div style={{ textAlign: 'center', marginBottom: 20 }}>
                    <div style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.4)', letterSpacing: 1, textTransform: 'uppercase', marginBottom: 4 }}>
                        Daily Check-in
                    </div>
                    <div style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.6)' }}>{todayStr}</div>
                    <div style={{ display: 'flex', justifyContent: 'center', gap: 8, marginTop: 10 }}>
                        <span className="pill pill-magenta">{cycleInfo.phaseEmoji} Day {cycleInfo.dayOfCycle}</span>
                        <span className="pill pill-gold">{moonData.emoji} {moonData.phaseName}</span>
                    </div>
                </div>

                {/* Progress dots */}
                <div style={{ display: 'flex', justifyContent: 'center', gap: 6, marginBottom: 20 }}>
                    {['Flow', 'Mood', 'Symptoms'].map((s, i) => (
                        <div key={s} style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                            <div style={{
                                width: 8, height: 8, borderRadius: '50%',
                                background: step >= i ? (step === i ? '#ff2d78' : '#00f5d4') : 'rgba(255,255,255,0.1)',
                                transition: 'all 0.3s',
                            }} />
                            <span style={{
                                fontSize: '0.65rem',
                                color: step >= i ? '#fff' : 'rgba(255,255,255,0.3)',
                                fontWeight: step === i ? 600 : 400,
                            }}>{s}</span>
                        </div>
                    ))}
                </div>

                {/* ─── Step 0: Flow ─── */}
                {step === 0 && (
                    <div>
                        <h3 style={{ color: '#fff', textAlign: 'center', fontSize: '1.1rem', marginBottom: 4 }}>
                            How's your flow today?
                        </h3>
                        <p style={{ textAlign: 'center', fontSize: '0.75rem', color: 'rgba(255,255,255,0.35)', marginBottom: 16 }}>
                            Tap to select your flow level
                        </p>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                            {FLOW_OPTIONS.map(opt => (
                                <button key={opt.value} onClick={() => setFlow(opt.value)}
                                    style={{
                                        display: 'flex', alignItems: 'center', gap: 12,
                                        background: flow === opt.value ? `${opt.color}25` : 'rgba(255,255,255,0.03)',
                                        border: flow === opt.value ? `2px solid ${opt.color}` : '2px solid rgba(255,255,255,0.06)',
                                        borderRadius: 14, padding: '12px 16px', cursor: 'pointer',
                                        transition: 'all 0.2s', width: '100%', textAlign: 'left',
                                    }}>
                                    <span style={{ fontSize: '1.3rem', width: 40, textAlign: 'center' }}>{opt.emoji}</span>
                                    <span style={{ color: flow === opt.value ? opt.color : 'rgba(255,255,255,0.6)', fontWeight: 500, fontSize: '0.9rem' }}>
                                        {opt.label}
                                    </span>
                                    {flow === opt.value && <span style={{ marginLeft: 'auto', color: opt.color }}>✓</span>}
                                </button>
                            ))}
                        </div>
                    </div>
                )}

                {/* ─── Step 1: Mood ─── */}
                {step === 1 && (
                    <div>
                        <h3 style={{ color: '#fff', textAlign: 'center', fontSize: '1.1rem', marginBottom: 4 }}>
                            How are you feeling?
                        </h3>
                        <p style={{ textAlign: 'center', fontSize: '0.75rem', color: 'rgba(255,255,255,0.35)', marginBottom: 16 }}>
                            Choose the mood that fits best
                        </p>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 8 }}>
                            {MOOD_OPTIONS.map(opt => (
                                <button key={opt.value} onClick={() => setMood(opt.value)}
                                    style={{
                                        display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4,
                                        background: mood === opt.value ? 'rgba(255,215,0,0.12)' : 'rgba(255,255,255,0.03)',
                                        border: mood === opt.value ? '2px solid #ffd700' : '2px solid rgba(255,255,255,0.06)',
                                        borderRadius: 14, padding: '14px 8px', cursor: 'pointer',
                                        transition: 'all 0.2s',
                                    }}>
                                    <span style={{ fontSize: '1.5rem' }}>{opt.emoji}</span>
                                    <span style={{
                                        fontSize: '0.65rem', fontWeight: 500,
                                        color: mood === opt.value ? '#ffd700' : 'rgba(255,255,255,0.5)',
                                    }}>{opt.label}</span>
                                </button>
                            ))}
                        </div>
                    </div>
                )}

                {/* ─── Step 2: Symptoms ─── */}
                {step === 2 && (
                    <div>
                        <h3 style={{ color: '#fff', textAlign: 'center', fontSize: '1.1rem', marginBottom: 4 }}>
                            Any symptoms today?
                        </h3>
                        <p style={{ textAlign: 'center', fontSize: '0.75rem', color: 'rgba(255,255,255,0.35)', marginBottom: 16 }}>
                            Tap all that apply (or skip if none)
                        </p>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 8 }}>
                            {SYMPTOM_OPTIONS.map(opt => {
                                const isActive = symptoms.includes(opt.value);
                                return (
                                    <button key={opt.value} onClick={() => toggleSymptom(opt.value)}
                                        style={{
                                            display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4,
                                            background: isActive ? 'rgba(168,85,247,0.12)' : 'rgba(255,255,255,0.03)',
                                            border: isActive ? '2px solid #a855f7' : '2px solid rgba(255,255,255,0.06)',
                                            borderRadius: 14, padding: '12px 6px', cursor: 'pointer',
                                            transition: 'all 0.2s',
                                        }}>
                                        <span style={{ fontSize: '1.3rem' }}>{opt.emoji}</span>
                                        <span style={{
                                            fontSize: '0.6rem', fontWeight: 500,
                                            color: isActive ? '#a855f7' : 'rgba(255,255,255,0.5)',
                                        }}>{opt.label}</span>
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                )}

                {/* Actions */}
                <div style={{ display: 'flex', gap: 10, marginTop: 24 }}>
                    {step > 0 && (
                        <button onClick={() => setStep(step - 1)}
                            style={{
                                flex: 0, background: 'rgba(255,255,255,0.06)', border: 'none',
                                borderRadius: 12, padding: '12px 18px', color: 'rgba(255,255,255,0.5)',
                                cursor: 'pointer', fontWeight: 600, fontSize: '0.85rem',
                            }}>← Back</button>
                    )}
                    <button onClick={handleNext}
                        style={{
                            flex: 1, border: 'none', borderRadius: 12, padding: '14px 20px',
                            fontWeight: 700, fontSize: '0.9rem', cursor: 'pointer',
                            background: 'linear-gradient(135deg, #ff2d78, #a855f7)',
                            color: '#fff', transition: 'all 0.2s',
                        }}>
                        {step < 2 ? 'Next →' : 'Save & Continue ✓'}
                    </button>
                </div>

                <button onClick={onSkip}
                    style={{
                        display: 'block', width: '100%', marginTop: 10, background: 'none',
                        border: 'none', color: 'rgba(255,255,255,0.25)', fontSize: '0.75rem',
                        cursor: 'pointer', padding: 8,
                    }}>
                    Skip for today
                </button>
            </div>
        </div>
    );
}
