import React, { useState, useEffect } from 'react';
import { useApp } from '../../App';
import {
    SYMPTOMS, MOODS, FLOW_LEVELS,
    DISCHARGE_OPTIONS, SEX_OPTIONS, SEX_DRIVE_OPTIONS,
    DIGESTIVE_OPTIONS, PREGNANCY_TEST_OPTIONS, OVULATION_TEST_OPTIONS,
    CONTRACEPTIVE_OPTIONS, EMERGENCY_CONTRACEPTIVE_OPTIONS,
    SLEEP_OPTIONS, EXERCISE_OPTIONS, STRESS_OPTIONS,
} from '../../utils/cycleEngine';
import { getDailyLog } from '../../firebase';

function Section({ title, icon, children, defaultOpen = false }) {
    const [open, setOpen] = useState(defaultOpen);
    return (
        <div className="glass-card" style={{ marginBottom: 12 }}>
            <div className="section-header" style={{ cursor: 'pointer', userSelect: 'none' }} onClick={() => setOpen(o => !o)}>
                <span className="section-icon">{icon}</span>
                <h3 style={{ flex: 1 }}>{title}</h3>
                <span style={{ color: 'rgba(255,255,255,0.3)', fontSize: '0.8rem', transition: 'transform 0.2s', transform: open ? 'rotate(180deg)' : 'rotate(0deg)' }}>▼</span>
            </div>
            {open && <div style={{ marginTop: 12 }}>{children}</div>}
        </div>
    );
}

function OptionGrid({ options, selected, onSelect, multi = false }) {
    return (
        <div className="quick-log-grid">
            {options.map(o => (
                <button
                    key={o.id}
                    className={`quick-log-btn ${multi ? (selected?.includes?.(o.id) ? 'selected' : '') : (selected === o.id ? 'selected' : '')}`}
                    onClick={() => onSelect(o.id)}
                >
                    <span className="log-emoji">{o.emoji}</span>
                    {o.label}
                </button>
            ))}
        </div>
    );
}

export default function CycleTracker() {
    const { cycleInfo, dailyLog, setDailyLog, cycleData, setCycleData, user, periodLogs, logHistory, handlePeriodLog, irregularityData } = useApp();
    const [activeTab, setActiveTab] = useState('log');
    const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
    const [localLog, setLocalLog] = useState({ ...dailyLog });
    const [saving, setSaving] = useState(false);
    const [saved, setSaved] = useState(false);

    const today = new Date().toISOString().split('T')[0];
    const isToday = selectedDate === today;

    // Load log for selected date
    useEffect(() => {
        if (isToday) {
            setLocalLog({ ...dailyLog });
        } else if (user?.uid) {
            getDailyLog(user.uid, selectedDate).then(log => {
                setLocalLog(log || { symptoms: [], mood: null, flow: 0, notes: '', discharge: null, sexActivity: null, sexDrive: null, digestive: null, pregnancyTest: null, ovulationTest: null, contraceptive: null, emergencyContraceptive: null });
            });
        }
    }, [selectedDate, dailyLog]);

    const updateLocal = (field, value) => {
        setLocalLog(prev => ({ ...prev, [field]: value }));
        setSaved(false);
    };

    const toggleSymptom = (id) => {
        setLocalLog(prev => ({
            ...prev,
            symptoms: prev.symptoms.includes(id) ? prev.symptoms.filter(s => s !== id) : [...prev.symptoms, id],
        }));
        setSaved(false);
    };

    const handleSave = async () => {
        setSaving(true);
        try {
            await setDailyLog(localLog, selectedDate);
            setSaved(true);
        } catch (err) {
            console.warn('Save failed:', err);
        }
        setSaving(false);
    };

    const handlePeriodStarted = () => {
        handlePeriodLog(selectedDate, null);
        updateLocal('flow', Math.max(localLog.flow, 2));
    };

    const handlePeriodEnded = () => {
        // Find the most recent period that has no end date
        const openPeriod = periodLogs.find(p => !p.endDate);
        if (openPeriod) {
            handlePeriodLog(openPeriod.startDate, selectedDate);
        }
    };

    const formatDate = (dateStr) => {
        const d = new Date(dateStr + 'T12:00:00');
        return d.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' });
    };

    return (
        <div className="animate-fadeIn">
            <div className="section-title">Cycle Tracker</div>
            <div className="section-subtitle">Track, understand, and honor your body's rhythm</div>

            <div className="tabs">
                {['log', 'insights', 'history'].map(t => (
                    <button key={t} className={`tab ${activeTab === t ? 'active' : ''}`} onClick={() => setActiveTab(t)}>
                        {t === 'log' ? '📝 Daily Log' : t === 'insights' ? '💡 Phase Insights' : '📊 History'}
                    </button>
                ))}
            </div>

            {activeTab === 'log' && (
                <div>
                    {/* Date Selector */}
                    <div className="glass-card" style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16, padding: '12px 16px' }}>
                        <span style={{ fontSize: '1.2rem' }}>📅</span>
                        <input
                            type="date"
                            className="input-field"
                            style={{ flex: 1, background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', colorScheme: 'dark' }}
                            value={selectedDate}
                            max={today}
                            onChange={e => setSelectedDate(e.target.value)}
                        />
                        {!isToday && (
                            <button className="btn btn-ghost btn-sm" onClick={() => setSelectedDate(today)}>
                                Today
                            </button>
                        )}
                    </div>

                    {/* Period Start/End */}
                    <div className="glass-card" style={{ marginBottom: 16, display: 'flex', gap: 10 }}>
                        <button
                            className="btn btn-primary"
                            style={{ flex: 1, justifyContent: 'center', background: 'rgba(255,45,120,0.2)', border: '1px solid rgba(255,45,120,0.4)', color: '#ff2d78' }}
                            onClick={handlePeriodStarted}
                        >
                            🩸 Period Started
                        </button>
                        <button
                            className="btn btn-primary"
                            style={{ flex: 1, justifyContent: 'center', background: 'rgba(0,245,212,0.1)', border: '1px solid rgba(0,245,212,0.3)', color: '#00f5d4' }}
                            onClick={handlePeriodEnded}
                        >
                            ✓ Period Ended
                        </button>
                    </div>

                    <div className="dashboard-grid two-col">
                        {/* Left Column */}
                        <div>
                            <Section title="Flow Level" icon="🩸" defaultOpen={true}>
                                <div className="flow-slider-container">
                                    <input type="range" className="flow-slider" min="0" max="5" value={localLog.flow}
                                        onChange={e => updateLocal('flow', parseInt(e.target.value))} />
                                    <div className="flow-labels">
                                        {FLOW_LEVELS.map(f => <span key={f.id}>{f.label}</span>)}
                                    </div>
                                </div>
                                <div style={{ textAlign: 'center', marginTop: 8, fontSize: '0.85rem', color: FLOW_LEVELS[localLog.flow].color }}>
                                    {FLOW_LEVELS[localLog.flow].label}
                                </div>
                            </Section>

                            <Section title="Mood" icon="😊" defaultOpen={true}>
                                <OptionGrid options={MOODS} selected={localLog.mood} onSelect={(id) => updateLocal('mood', localLog.mood === id ? null : id)} />
                            </Section>

                            <Section title="Symptoms" icon="🏥" defaultOpen={true}>
                                <OptionGrid options={SYMPTOMS} selected={localLog.symptoms} onSelect={toggleSymptom} multi={true} />
                            </Section>

                            <Section title="Notes" icon="📝">
                                <textarea className="input-field" placeholder="How are you feeling today?"
                                    value={localLog.notes || ''} onChange={e => updateLocal('notes', e.target.value)}
                                    style={{ minHeight: 80, resize: 'vertical', width: '100%' }} />
                            </Section>
                        </div>

                        {/* Right Column */}
                        <div>
                            <Section title="Vaginal Discharge" icon="💧">
                                <OptionGrid options={DISCHARGE_OPTIONS} selected={localLog.discharge} onSelect={(id) => updateLocal('discharge', localLog.discharge === id ? null : id)} />
                            </Section>

                            <Section title="Sex & Sex Drive" icon="💑">
                                <div style={{ marginBottom: 12 }}>
                                    <div style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.4)', marginBottom: 6, textTransform: 'uppercase', letterSpacing: 1 }}>Activity</div>
                                    <OptionGrid options={SEX_OPTIONS} selected={localLog.sexActivity} onSelect={(id) => updateLocal('sexActivity', localLog.sexActivity === id ? null : id)} />
                                </div>
                                <div>
                                    <div style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.4)', marginBottom: 6, textTransform: 'uppercase', letterSpacing: 1 }}>Drive</div>
                                    <OptionGrid options={SEX_DRIVE_OPTIONS} selected={localLog.sexDrive} onSelect={(id) => updateLocal('sexDrive', localLog.sexDrive === id ? null : id)} />
                                </div>
                            </Section>

                            <Section title="Digestive & Stool" icon="🫄">
                                <OptionGrid options={DIGESTIVE_OPTIONS} selected={localLog.digestive} onSelect={(id) => updateLocal('digestive', localLog.digestive === id ? null : id)} />
                            </Section>

                            <Section title="Pregnancy Test" icon="🤰">
                                <OptionGrid options={PREGNANCY_TEST_OPTIONS} selected={localLog.pregnancyTest} onSelect={(id) => updateLocal('pregnancyTest', localLog.pregnancyTest === id ? null : id)} />
                            </Section>

                            <Section title="Ovulation Test" icon="🧪">
                                <OptionGrid options={OVULATION_TEST_OPTIONS} selected={localLog.ovulationTest} onSelect={(id) => updateLocal('ovulationTest', localLog.ovulationTest === id ? null : id)} />
                            </Section>

                            <Section title="Oral Contraceptive" icon="💊">
                                <OptionGrid options={CONTRACEPTIVE_OPTIONS} selected={localLog.contraceptive} onSelect={(id) => updateLocal('contraceptive', localLog.contraceptive === id ? null : id)} />
                            </Section>

                            <Section title="Emergency Contraceptive" icon="🆘">
                                <OptionGrid options={EMERGENCY_CONTRACEPTIVE_OPTIONS} selected={localLog.emergencyContraceptive} onSelect={(id) => updateLocal('emergencyContraceptive', localLog.emergencyContraceptive === id ? null : id)} />
                            </Section>

                            <Section title="Sleep Quality" icon="😴">
                                <OptionGrid options={SLEEP_OPTIONS} selected={localLog.sleep} onSelect={(id) => updateLocal('sleep', localLog.sleep === id ? null : id)} />
                            </Section>

                            <Section title="Exercise" icon="🏃">
                                <OptionGrid options={EXERCISE_OPTIONS} selected={localLog.exercise} onSelect={(id) => updateLocal('exercise', localLog.exercise === id ? null : id)} />
                            </Section>

                            <Section title="Stress Level" icon="😰">
                                <OptionGrid options={STRESS_OPTIONS} selected={localLog.stress} onSelect={(id) => updateLocal('stress', localLog.stress === id ? null : id)} />
                            </Section>
                        </div>
                    </div>

                    {/* Save Button */}
                    <button
                        className="btn btn-primary"
                        style={{ marginTop: 16, width: '100%', justifyContent: 'center', fontSize: '1rem', padding: '14px 24px' }}
                        onClick={handleSave}
                        disabled={saving}
                    >
                        {saving ? '⏳ Saving...' : saved ? '✅ Saved!' : `✨ Save Log for ${isToday ? 'Today' : formatDate(selectedDate)}`}
                    </button>
                </div>
            )}

            {activeTab === 'insights' && (
                <div className="dashboard-grid two-col">
                    <div className="glass-card">
                        <div className="section-header"><span className="section-icon">{cycleInfo.phaseEmoji}</span><h3>{cycleInfo.phaseName} Phase</h3></div>
                        <p style={{ fontSize: '0.9rem', color: 'rgba(255,255,255,0.7)', lineHeight: 1.6, marginBottom: 16 }}>{cycleInfo.phaseDescription}</p>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                            <div className="glass-card" style={{ padding: 14 }}>
                                <div style={{ fontSize: '0.65rem', color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: 1 }}>Element</div>
                                <div style={{ fontSize: '1.1rem', color: '#ffd700', marginTop: 4 }}>{cycleInfo.element}</div>
                            </div>
                            <div className="glass-card" style={{ padding: 14 }}>
                                <div style={{ fontSize: '0.65rem', color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: 1 }}>Chakra</div>
                                <div style={{ fontSize: '0.85rem', color: '#a855f7', marginTop: 4 }}>{cycleInfo.chakra}</div>
                            </div>
                            <div className="glass-card" style={{ padding: 14 }}>
                                <div style={{ fontSize: '0.65rem', color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: 1 }}>Sacred Geometry</div>
                                <div style={{ fontSize: '0.8rem', color: '#00f5d4', marginTop: 4 }}>{cycleInfo.sacredGeometry}</div>
                            </div>
                            <div className="glass-card" style={{ padding: 14 }}>
                                <div style={{ fontSize: '0.65rem', color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: 1 }}>Sound Rx</div>
                                <div style={{ fontSize: '1.1rem', color: '#ff2d78', marginTop: 4 }}>{cycleInfo.soundFrequency} Hz</div>
                            </div>
                        </div>
                        <div style={{ marginTop: 16, padding: 14, background: 'rgba(255,45,120,0.06)', borderRadius: 12, borderLeft: '3px solid #ff2d78' }}>
                            <div style={{ fontSize: '0.65rem', color: '#ff2d78', fontWeight: 600, marginBottom: 4 }}>TODAY'S AFFIRMATION</div>
                            <div style={{ fontSize: '0.9rem', fontStyle: 'italic', color: 'rgba(255,255,255,0.8)' }}>"{cycleInfo.affirmation}"</div>
                        </div>
                    </div>

                    <div>
                        <div className="glass-card" style={{ marginBottom: 16 }}>
                            <div className="section-header"><span className="section-icon">🏃‍♀️</span><h3>Movement Medicine</h3></div>
                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                                {cycleInfo.movementMedicine.map((m, i) => <span key={i} className="pill pill-teal">{m}</span>)}
                            </div>
                        </div>
                        <div className="glass-card" style={{ marginBottom: 16 }}>
                            <div className="section-header"><span className="section-icon">🎨</span><h3>Color Therapy</h3></div>
                            <div style={{ display: 'flex', gap: 12 }}>
                                {cycleInfo.colorTherapy.map((c, i) => (
                                    <div key={i} style={{ textAlign: 'center' }}>
                                        <div style={{ width: 48, height: 48, borderRadius: 12, background: c.toLowerCase().includes('red') ? '#8b0000' : c.toLowerCase().includes('gold') ? '#ffd700' : c.toLowerCase().includes('green') ? '#228b22' : c.toLowerCase().includes('blue') ? '#4169e1' : c.toLowerCase().includes('purple') ? '#6b21a8' : c.toLowerCase().includes('orange') ? '#ff8c00' : c.toLowerCase().includes('coral') ? '#ff7f50' : c.toLowerCase().includes('white') ? '#f5f5dc' : c.toLowerCase().includes('black') ? '#1a1a1a' : '#666', margin: '0 auto 6px', border: '1px solid rgba(255,255,255,0.1)' }} />
                                        <span style={{ fontSize: '0.65rem', color: 'rgba(255,255,255,0.5)' }}>{c}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div className="glass-card">
                            <div className="section-header"><span className="section-icon">🍽️</span><h3>Food Alchemy</h3></div>
                            {cycleInfo.foodAlchemy.map((f, i) => (
                                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '6px 0', borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                                    <span style={{ color: '#00f5d4', fontSize: '0.8rem' }}>✦</span>
                                    <span style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.7)' }}>{f}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}

            {activeTab === 'history' && (
                <div className="glass-card">
                    <div className="section-header"><span className="section-icon">📅</span><h3>Cycle History</h3></div>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12, marginBottom: 20 }}>
                        <div className="glass-card" style={{ padding: 14, textAlign: 'center' }}>
                            <div style={{ fontSize: '1.4rem', fontWeight: 700, color: '#ff2d78' }}>{cycleData.cycleLength}</div>
                            <div style={{ fontSize: '0.65rem', color: 'rgba(255,255,255,0.4)' }}>Avg Cycle Length</div>
                        </div>
                        <div className="glass-card" style={{ padding: 14, textAlign: 'center' }}>
                            <div style={{ fontSize: '1.4rem', fontWeight: 700, color: '#00f5d4' }}>{cycleData.periodLength}</div>
                            <div style={{ fontSize: '0.65rem', color: 'rgba(255,255,255,0.4)' }}>Avg Period Length</div>
                        </div>
                        <div className="glass-card" style={{ padding: 14, textAlign: 'center' }}>
                            <div style={{ fontSize: '1.4rem', fontWeight: 700, color: '#ffd700' }}>{cycleInfo.ovulationDay}</div>
                            <div style={{ fontSize: '0.65rem', color: 'rgba(255,255,255,0.4)' }}>Ovulation Day</div>
                        </div>
                        <div className="glass-card" style={{ padding: 14, textAlign: 'center' }}>
                            <div style={{ fontSize: '1.4rem', fontWeight: 700, color: '#a855f7' }}>{logHistory.length || '—'}</div>
                            <div style={{ fontSize: '0.65rem', color: 'rgba(255,255,255,0.4)' }}>Days Logged</div>
                        </div>
                    </div>

                    {/* Irregularity Alerts */}
                    {irregularityData?.alerts?.length > 0 && (
                        <div style={{ marginBottom: 20 }}>
                            <div style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 10 }}>⚠️ Cycle Alerts</div>
                            {irregularityData.alerts.map((a, i) => (
                                <div key={i} style={{
                                    padding: '10px 14px', marginBottom: 6, borderRadius: 10,
                                    background: a.type === 'warning' ? 'rgba(255,45,120,0.08)' : 'rgba(168,85,247,0.08)',
                                    borderLeft: `3px solid ${a.type === 'warning' ? '#ff2d78' : '#a855f7'}`,
                                    fontSize: '0.8rem', color: 'rgba(255,255,255,0.7)',
                                }}>{a.message}</div>
                            ))}
                        </div>
                    )}

                    {/* Symptom Frequency Chart */}
                    {logHistory.length > 0 && (() => {
                        const symptomFreq = {};
                        logHistory.forEach(log => {
                            if (log.symptoms) log.symptoms.forEach(s => { symptomFreq[s] = (symptomFreq[s] || 0) + 1; });
                        });
                        const sortedSymptoms = Object.entries(symptomFreq).sort((a, b) => b[1] - a[1]).slice(0, 8);
                        if (sortedSymptoms.length === 0) return null;
                        const maxFreq = sortedSymptoms[0][1];
                        return (
                            <div style={{ marginBottom: 20 }}>
                                <div style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 10 }}>📊 Top Symptoms</div>
                                {sortedSymptoms.map(([id, count]) => {
                                    const sym = SYMPTOMS.find(s => s.id === id);
                                    return (
                                        <div key={id} style={{ marginBottom: 8 }}>
                                            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', marginBottom: 3 }}>
                                                <span style={{ color: 'rgba(255,255,255,0.6)' }}>{sym?.emoji} {sym?.label || id}</span>
                                                <span style={{ color: '#ff2d78' }}>{count}x</span>
                                            </div>
                                            <div style={{ height: 6, background: 'rgba(255,255,255,0.06)', borderRadius: 3 }}>
                                                <div style={{ height: '100%', borderRadius: 3, background: 'linear-gradient(90deg, #ff2d78, #a855f7)', width: `${(count / maxFreq) * 100}%`, transition: 'width 0.5s ease' }} />
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        );
                    })()}

                    {/* Mood Pattern */}
                    {logHistory.length > 0 && (() => {
                        const moodFreq = {};
                        logHistory.forEach(log => { if (log.mood) moodFreq[log.mood] = (moodFreq[log.mood] || 0) + 1; });
                        const sorted = Object.entries(moodFreq).sort((a, b) => b[1] - a[1]);
                        if (sorted.length === 0) return null;
                        return (
                            <div style={{ marginBottom: 20 }}>
                                <div style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 10 }}>😊 Mood Patterns</div>
                                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                                    {sorted.map(([id, count]) => {
                                        const m = MOODS.find(x => x.id === id);
                                        return (
                                            <div key={id} style={{ padding: '8px 12px', background: 'rgba(255,255,255,0.04)', borderRadius: 10, textAlign: 'center' }}>
                                                <div style={{ fontSize: '1.2rem' }}>{m?.emoji || '😐'}</div>
                                                <div style={{ fontSize: '0.65rem', color: 'rgba(255,255,255,0.5)' }}>{m?.label || id}</div>
                                                <div style={{ fontSize: '0.7rem', color: '#00f5d4', fontWeight: 600 }}>{count}x</div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        );
                    })()}

                    {/* Period Logs */}
                    {periodLogs.length > 0 && (
                        <div style={{ marginBottom: 20 }}>
                            <div style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 10 }}>Period History</div>
                            <div className="timeline">
                                {periodLogs.map((p, i) => (
                                    <div key={i} className="timeline-item">
                                        <div className="timeline-date">{formatDate(p.startDate)}</div>
                                        <div className="timeline-content">
                                            Period started{p.endDate ? ` — ended ${formatDate(p.endDate)}` : ' — ongoing'}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Daily Log History */}
                    {logHistory.length > 0 ? (
                        <div>
                            <div style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 10 }}>Daily Log History</div>
                            <div className="timeline">
                                {logHistory.slice(0, 20).map((entry, i) => {
                                    const parts = [];
                                    if (entry.flow > 0) parts.push(`Flow: ${FLOW_LEVELS[entry.flow]?.label || entry.flow}`);
                                    if (entry.mood) parts.push(`Mood: ${MOODS.find(m => m.id === entry.mood)?.label || entry.mood}`);
                                    if (entry.symptoms?.length) parts.push(`${entry.symptoms.length} symptom${entry.symptoms.length > 1 ? 's' : ''}`);
                                    if (entry.discharge) parts.push(`Discharge: ${entry.discharge}`);
                                    if (entry.sleep) parts.push(`Sleep: ${SLEEP_OPTIONS.find(s => s.id === entry.sleep)?.label || entry.sleep}`);
                                    if (entry.exercise) parts.push(`Exercise: ${EXERCISE_OPTIONS.find(e => e.id === entry.exercise)?.label || entry.exercise}`);
                                    if (entry.stress) parts.push(`Stress: ${STRESS_OPTIONS.find(s => s.id === entry.stress)?.label || entry.stress}`);
                                    if (entry.contraceptive && entry.contraceptive !== 'na') parts.push(`Pill: ${entry.contraceptive}`);
                                    return (
                                        <div key={i} className="timeline-item">
                                            <div className="timeline-date">{formatDate(entry.date || entry.id)}</div>
                                            <div className="timeline-content">{parts.join(' • ') || 'Log entry'}</div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    ) : (
                        <div style={{ textAlign: 'center', padding: 32, color: 'rgba(255,255,255,0.4)' }}>
                            <div style={{ fontSize: '2rem', marginBottom: 8 }}>📝</div>
                            <p>No logs yet. Start tracking in the Daily Log tab!</p>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
