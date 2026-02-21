import React, { useState } from 'react';
import { useApp } from '../App';
import { SYMPTOMS, MOODS, FLOW_LEVELS } from '../utils/cycleEngine';

export default function CycleTracker() {
    const { cycleInfo, dailyLog, setDailyLog, cycleData, setCycleData } = useApp();
    const [activeTab, setActiveTab] = useState('log');

    const toggleSymptom = (id) => {
        setDailyLog(prev => ({
            ...prev,
            symptoms: prev.symptoms.includes(id) ? prev.symptoms.filter(s => s !== id) : [...prev.symptoms, id],
        }));
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
                <div className="dashboard-grid two-col">
                    {/* Flow Tracker */}
                    <div className="glass-card">
                        <div className="section-header"><span className="section-icon">🩸</span><h3>Flow Level</h3></div>
                        <div className="flow-slider-container">
                            <input type="range" className="flow-slider" min="0" max="5" value={dailyLog.flow}
                                onChange={e => setDailyLog(prev => ({ ...prev, flow: parseInt(e.target.value) }))} />
                            <div className="flow-labels">
                                {FLOW_LEVELS.map(f => <span key={f.id}>{f.label}</span>)}
                            </div>
                        </div>
                        <div style={{ textAlign: 'center', marginTop: 12, fontSize: '0.85rem', color: FLOW_LEVELS[dailyLog.flow].color }}>
                            {FLOW_LEVELS[dailyLog.flow].label}
                        </div>

                        <div style={{ marginTop: 24 }}>
                            <div className="section-header"><span className="section-icon">😊</span><h3>Mood</h3></div>
                            <div className="quick-log-grid">
                                {MOODS.map(m => (
                                    <button key={m.id} className={`quick-log-btn ${dailyLog.mood === m.id ? 'selected' : ''}`}
                                        onClick={() => setDailyLog(prev => ({ ...prev, mood: m.id }))}>
                                        <span className="log-emoji">{m.emoji}</span>
                                        {m.label}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Symptoms */}
                    <div className="glass-card">
                        <div className="section-header"><span className="section-icon">🏥</span><h3>Symptoms</h3></div>
                        <div className="quick-log-grid">
                            {SYMPTOMS.map(s => (
                                <button key={s.id} className={`quick-log-btn ${dailyLog.symptoms.includes(s.id) ? 'selected' : ''}`}
                                    onClick={() => toggleSymptom(s.id)}>
                                    <span className="log-emoji">{s.emoji}</span>
                                    {s.label}
                                </button>
                            ))}
                        </div>
                        <div style={{ marginTop: 16 }}>
                            <textarea className="input-field" placeholder="Additional notes for today..."
                                value={dailyLog.notes} onChange={e => setDailyLog(prev => ({ ...prev, notes: e.target.value }))}
                                style={{ minHeight: 80, resize: 'vertical' }} />
                        </div>
                        <button className="btn btn-primary" style={{ marginTop: 12, width: '100%', justifyContent: 'center' }}>
                            ✨ Save Today's Log
                        </button>
                    </div>
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
                            <div style={{ fontSize: '1.4rem', fontWeight: 700, color: '#a855f7' }}>12</div>
                            <div style={{ fontSize: '0.65rem', color: 'rgba(255,255,255,0.4)' }}>Cycles Tracked</div>
                        </div>
                    </div>
                    <div className="timeline">
                        {[
                            { date: 'Feb 9, 2026', content: 'Period started — Light flow, mild cramps' },
                            { date: 'Jan 12, 2026', content: 'Period started — Medium flow, fatigue noted' },
                            { date: 'Dec 15, 2025', content: 'Period started — Heavy flow, aligned with Full Moon' },
                            { date: 'Nov 17, 2025', content: 'Period started — Light flow, high energy noted' },
                            { date: 'Oct 20, 2025', content: 'Period started — Medium flow, synced with 3 friends' },
                        ].map((entry, i) => (
                            <div key={i} className="timeline-item">
                                <div className="timeline-date">{entry.date}</div>
                                <div className="timeline-content">{entry.content}</div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
