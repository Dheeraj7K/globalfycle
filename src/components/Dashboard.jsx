import React from 'react';
import { useApp } from '../App';

export default function Dashboard() {
    const { cycleInfo, moonData, zodiac, noosphere, syncStats, dailyLog } = useApp();
    const today = new Date();
    const dateStr = today.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });

    return (
        <div className="animate-fadeIn">
            <div className="dashboard-header">
                <div>
                    <h2>Good {today.getHours() < 12 ? 'Morning' : today.getHours() < 18 ? 'Afternoon' : 'Evening'}, <span>Goddess</span></h2>
                    <div className="date-display">{dateStr}</div>
                </div>
                <div style={{ display: 'flex', gap: 8 }}>
                    <span className="pill pill-magenta">{cycleInfo.phaseEmoji} {cycleInfo.phaseName}</span>
                    <span className="pill pill-gold">{moonData.emoji} {moonData.phaseName}</span>
                </div>
            </div>

            {/* Top Stats Row */}
            <div className="dashboard-grid three-col" style={{ marginBottom: 20 }}>
                <div className="glass-card stat-card">
                    <div className="stat-icon magenta">🩸</div>
                    <div>
                        <div className="stat-value">{cycleInfo.daysUntilNextPeriod}</div>
                        <div className="stat-label">Days Until Period</div>
                    </div>
                </div>
                <div className="glass-card stat-card">
                    <div className="stat-icon teal">🌍</div>
                    <div>
                        <div className="stat-value">{syncStats && syncStats.synced > 0 ? syncStats.synced.toLocaleString() : '—'}</div>
                        <div className="stat-label">Global Sync</div>
                    </div>
                </div>
                <div className="glass-card stat-card">
                    <div className="stat-icon gold">✨</div>
                    <div>
                        <div className="stat-value">{noosphere.index}</div>
                        <div className="stat-label">Consciousness Index</div>
                    </div>
                </div>
            </div>

            <div className="dashboard-grid two-col" style={{ marginBottom: 20 }}>
                {/* Cycle Overview Card */}
                <div className="glass-card">
                    <div className="section-header"><span className="section-icon">🌀</span><h3>Cycle Overview</h3></div>
                    <div className="cycle-wheel-container">
                        <div className="cycle-wheel">
                            <svg viewBox="0 0 200 200">
                                {/* Background ring */}
                                <circle cx="100" cy="100" r="85" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="16" />
                                {/* Phase segments */}
                                {['menstrual', 'follicular', 'ovulation', 'luteal'].map((phase, idx) => {
                                    const colors = { menstrual: '#ff2d78', follicular: '#00f5d4', ovulation: '#ffd700', luteal: '#a855f7' };
                                    const starts = [0, cycleInfo.periodLength / cycleInfo.totalDays, 0.46, 0.54];
                                    const ends = [cycleInfo.periodLength / cycleInfo.totalDays, 0.46, 0.54, 1];
                                    const circumference = 2 * Math.PI * 85;
                                    const startOffset = starts[idx] * circumference;
                                    const length = (ends[idx] - starts[idx]) * circumference;
                                    return (
                                        <circle key={phase} cx="100" cy="100" r="85" fill="none"
                                            stroke={colors[phase]} strokeWidth="16" strokeLinecap="butt"
                                            strokeDasharray={`${length} ${circumference - length}`}
                                            strokeDashoffset={-startOffset}
                                            opacity={cycleInfo.phase === phase ? 1 : 0.3}
                                        />
                                    );
                                })}
                                {/* Current day marker */}
                                {(() => {
                                    const angle = ((cycleInfo.dayOfCycle - 1) / cycleInfo.totalDays) * 360 - 90;
                                    const rad = (angle * Math.PI) / 180;
                                    const x = 100 + 85 * Math.cos(rad);
                                    const y = 100 + 85 * Math.sin(rad);
                                    return <circle cx={x} cy={y} r="6" fill="white" stroke={cycleInfo.phaseColor} strokeWidth="2" />;
                                })()}
                            </svg>
                            <div className="wheel-center">
                                <div className="current-day">{cycleInfo.dayOfCycle}</div>
                                <div className="phase-name">{cycleInfo.phaseName}</div>
                                <div className="days-until">{cycleInfo.daysUntilNextPeriod}d until period</div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Noosphere Card */}
                <div className="glass-card noosphere-card">
                    <div className="noosphere-content">
                        <div className="section-header"><span className="section-icon">🧠</span><h3>Noosphere Index</h3></div>
                        <div className="noosphere-value">{noosphere.index}</div>
                        <div className="noosphere-label">{noosphere.level} Consciousness</div>
                        <div className="noosphere-description">{noosphere.description}</div>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12, marginTop: 16 }}>
                            <div style={{ textAlign: 'center' }}>
                                <div style={{ fontSize: '1.2rem', fontWeight: 600, color: '#ffd700' }}>{noosphere.lunarFactor}%</div>
                                <div style={{ fontSize: '0.65rem', color: 'rgba(255,255,255,0.4)' }}>Lunar Factor</div>
                            </div>
                            <div style={{ textAlign: 'center' }}>
                                <div style={{ fontSize: '1.2rem', fontWeight: 600, color: '#00f5d4' }}>{noosphere.schumannResonance}</div>
                                <div style={{ fontSize: '0.65rem', color: 'rgba(255,255,255,0.4)' }}>Schumann Hz</div>
                            </div>
                            <div style={{ textAlign: 'center' }}>
                                <div style={{ fontSize: '1.2rem', fontWeight: 600, color: '#a855f7' }}>{noosphere.globalSyncWave}%</div>
                                <div style={{ fontSize: '0.65rem', color: 'rgba(255,255,255,0.4)' }}>Sync Wave</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="dashboard-grid three-col" style={{ marginBottom: 20 }}>
                {/* Cosmic Card */}
                <div className="glass-card cosmic-insight-card">
                    <div className="insight-type">🌙 Moon Insight</div>
                    <div className="insight-text">{moonData.menstrualCorrelation.desc.slice(0, 120)}...</div>
                    <div style={{ marginTop: 8, fontSize: '0.7rem', color: 'rgba(255,255,255,0.4)' }}>
                        Lunar Resonance: {moonData.menstrualCorrelation.resonance}%
                    </div>
                </div>

                {/* Zodiac Card */}
                <div className="glass-card cosmic-insight-card" style={{ borderLeftColor: '#a855f7' }}>
                    <div className="insight-type" style={{ color: '#a855f7' }}>{zodiac.emoji} {zodiac.sign} Season</div>
                    <div className="insight-text">{zodiac.cycleInfluence.slice(0, 120)}...</div>
                    <div style={{ marginTop: 8, fontSize: '0.7rem', color: 'rgba(255,255,255,0.4)' }}>
                        Element: {zodiac.element} | Ruling: {zodiac.ruling}
                    </div>
                </div>

                {/* Biorhythm Card */}
                <div className="glass-card">
                    <div className="section-header"><span className="section-icon">📊</span><h3>Biorhythm</h3></div>
                    {[
                        { name: 'Physical', value: cycleInfo.biorhythm.physical, color: '#ff2d78' },
                        { name: 'Emotional', value: cycleInfo.biorhythm.emotional, color: '#00f5d4' },
                        { name: 'Intellectual', value: cycleInfo.biorhythm.intellectual, color: '#ffd700' },
                    ].map(b => (
                        <div key={b.name} style={{ marginBottom: 10 }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', marginBottom: 4 }}>
                                <span style={{ color: 'rgba(255,255,255,0.6)' }}>{b.name}</span>
                                <span style={{ color: b.color }}>{b.value > 0 ? '+' : ''}{b.value}%</span>
                            </div>
                            <div style={{ height: 6, background: 'rgba(255,255,255,0.08)', borderRadius: 3 }}>
                                <div style={{
                                    height: '100%', borderRadius: 3, background: b.color,
                                    width: `${Math.abs(b.value)}%`, marginLeft: b.value < 0 ? 'auto' : 0,
                                    transition: 'width 1s ease',
                                }} />
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Daily phase guidance */}
            <div className="dashboard-grid two-col">
                <div className="glass-card">
                    <div className="section-header"><span className="section-icon">🍽️</span><h3>Food Alchemy Today</h3></div>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                        {cycleInfo.foodAlchemy.map((food, i) => (
                            <span key={i} className="pill pill-teal">{food}</span>
                        ))}
                    </div>
                    <div style={{ marginTop: 16 }}>
                        <div className="section-header"><span className="section-icon">💎</span><h3>Crystals & Herbs</h3></div>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                            {cycleInfo.crystals.map((c, i) => <span key={i} className="pill pill-purple">{c}</span>)}
                            {cycleInfo.herbs.map((h, i) => <span key={i} className="pill pill-gold">{h}</span>)}
                        </div>
                    </div>
                </div>

                <div className="glass-card">
                    <div className="section-header"><span className="section-icon">🎯</span><h3>Today's Power Index</h3></div>
                    {[
                        { name: 'Creative Power', value: cycleInfo.creativeIndex, max: 10, color: '#ffd700' },
                        { name: 'Intuition Strength', value: cycleInfo.intuitionStrength, max: 10, color: '#a855f7' },
                        { name: 'Social Energy', value: cycleInfo.socialEnergy, max: 10, color: '#00f5d4' },
                        { name: 'Dream Intensity', value: cycleInfo.dreamIntensity, max: 10, color: '#ff2d78' },
                    ].map(p => (
                        <div key={p.name} style={{ marginBottom: 10 }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', marginBottom: 4 }}>
                                <span style={{ color: 'rgba(255,255,255,0.6)' }}>{p.name}</span>
                                <span style={{ color: p.color }}>{p.value}/{p.max}</span>
                            </div>
                            <div style={{ height: 6, background: 'rgba(255,255,255,0.08)', borderRadius: 3 }}>
                                <div style={{ height: '100%', borderRadius: 3, background: p.color, width: `${(p.value / p.max) * 100}%`, transition: 'width 1s ease' }} />
                            </div>
                        </div>
                    ))}
                    <div style={{ marginTop: 16, padding: '12px 16px', background: 'rgba(255,45,120,0.08)', borderRadius: 12, borderLeft: '3px solid #ff2d78' }}>
                        <div style={{ fontSize: '0.7rem', color: '#ff2d78', marginBottom: 4, fontWeight: 600 }}>TODAY'S MANIFESTATION</div>
                        <div style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.8)' }}>{cycleInfo.manifestationType}</div>
                    </div>
                </div>
            </div>
        </div>
    );
}
