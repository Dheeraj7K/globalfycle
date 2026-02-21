import React, { useState } from 'react';
import { useApp } from '../App';

export default function Profile() {
    const { user, cycleData, setCycleData, cycleInfo, zodiac, moonData, noosphere, birthData, natalChart, logHistory, periodLogs } = useApp();
    const [notifications, setNotifications] = useState({ period: true, ovulation: true, moon: true, community: false, ai: true });

    const calcAge = (dob) => {
        if (!dob) return null;
        const born = new Date(dob);
        const today = new Date();
        let age = today.getFullYear() - born.getFullYear();
        const m = today.getMonth() - born.getMonth();
        if (m < 0 || (m === 0 && today.getDate() < born.getDate())) age--;
        return age;
    };

    const age = birthData?.dob ? calcAge(birthData.dob) : null;

    return (
        <div className="animate-fadeIn">
            <div className="section-title">Profile & Settings</div>
            <div className="section-subtitle">Your cosmic identity and preferences</div>

            <div className="dashboard-grid two-col">
                {/* Profile Card */}
                <div className="glass-card">
                    <div className="profile-header">
                        <div className="profile-avatar">
                            {user?.avatar && user.avatar !== '🌙'
                                ? <img src={user.avatar} alt="" style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover' }} />
                                : '🌙'}
                        </div>
                        <div className="profile-info">
                            <h2>{birthData?.name || user?.name || 'Cosmic Soul'}</h2>
                            <p>
                                {age ? `${age} years old • ` : ''}
                                {user?.provider || 'Email'} • Member since {
                                    user?.joinDate ? new Date(user.joinDate).toLocaleDateString('en-US', { month: 'short', year: 'numeric' }) : 'Recently'
                                }
                            </p>
                            <div style={{ display: 'flex', gap: 6, marginTop: 8, flexWrap: 'wrap' }}>
                                {natalChart ? (
                                    <>
                                        <span className="pill pill-gold">{natalChart.sunSign.emoji} Sun: {natalChart.sunSign.sign}</span>
                                        <span className="pill pill-purple">{natalChart.moonSign.emoji} Moon: {natalChart.moonSign.sign}</span>
                                        {natalChart.risingSign && (
                                            <span className="pill pill-teal">{natalChart.risingSign.emoji} Rising: {natalChart.risingSign.sign}</span>
                                        )}
                                    </>
                                ) : (
                                    <>
                                        <span className="pill pill-magenta">{zodiac.emoji} {zodiac.sign}</span>
                                        <span className="pill pill-gold">{moonData.emoji} {moonData.phaseName}</span>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Natal Chart Details */}
                    {natalChart && (
                        <div style={{ marginTop: 16 }}>
                            <div style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 10 }}>Birth Chart</div>
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 8 }}>
                                <div className="glass-card" style={{ padding: 12 }}>
                                    <div style={{ fontSize: '0.6rem', color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase' }}>Dominant Element</div>
                                    <div style={{ fontSize: '1rem', color: '#ffd700', marginTop: 4 }}>
                                        {natalChart.dominantElement === 'Fire' ? '🔥' : natalChart.dominantElement === 'Water' ? '💧' : natalChart.dominantElement === 'Earth' ? '🌍' : '💨'} {natalChart.dominantElement}
                                    </div>
                                </div>
                                <div className="glass-card" style={{ padding: 12 }}>
                                    <div style={{ fontSize: '0.6rem', color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase' }}>Modality</div>
                                    <div style={{ fontSize: '1rem', color: '#a855f7', marginTop: 4 }}>{natalChart.dominantModality}</div>
                                </div>
                                <div className="glass-card" style={{ padding: 12 }}>
                                    <div style={{ fontSize: '0.6rem', color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase' }}>Sun Ruler</div>
                                    <div style={{ fontSize: '0.85rem', color: '#00f5d4', marginTop: 4 }}>{natalChart.sunSign.ruler}</div>
                                </div>
                                <div className="glass-card" style={{ padding: 12 }}>
                                    <div style={{ fontSize: '0.6rem', color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase' }}>Moon Ruler</div>
                                    <div style={{ fontSize: '0.85rem', color: '#ff5c9e', marginTop: 4 }}>{natalChart.moonSign.ruler}</div>
                                </div>
                            </div>
                            {birthData?.birthPlace && (
                                <div style={{ marginTop: 8, fontSize: '0.75rem', color: 'rgba(255,255,255,0.35)' }}>
                                    📍 Born in {birthData.birthPlace}
                                </div>
                            )}
                        </div>
                    )}

                    {/* Stats from real data */}
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 12, marginTop: 16 }}>
                        {[
                            { label: 'Periods Logged', value: periodLogs?.length || '—', color: '#ff2d78' },
                            { label: 'Days Logged', value: logHistory?.length || '—', color: '#00f5d4' },
                            { label: 'Current Phase', value: cycleInfo.phaseName, color: '#a855f7' },
                            { label: 'Noosphere', value: noosphere.index, color: '#ffd700' },
                        ].map((s, i) => (
                            <div key={i} className="glass-card" style={{ padding: 14, textAlign: 'center' }}>
                                <div style={{ fontSize: '1.3rem', fontWeight: 700, color: s.color }}>{s.value}</div>
                                <div style={{ fontSize: '0.65rem', color: 'rgba(255,255,255,0.4)' }}>{s.label}</div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Settings */}
                <div>
                    <div className="glass-card" style={{ marginBottom: 16 }}>
                        <div className="settings-group">
                            <h4>Cycle Settings</h4>
                            <div className="setting-row">
                                <div className="setting-label">Average Cycle Length</div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                    <button className="btn btn-ghost btn-sm" onClick={() => setCycleData(p => ({ ...p, cycleLength: Math.max(21, p.cycleLength - 1) }))}>−</button>
                                    <span style={{ color: '#fff', fontWeight: 600, minWidth: 40, textAlign: 'center' }}>{cycleData.cycleLength}d</span>
                                    <button className="btn btn-ghost btn-sm" onClick={() => setCycleData(p => ({ ...p, cycleLength: Math.min(40, p.cycleLength + 1) }))}>+</button>
                                </div>
                            </div>
                            <div className="setting-row">
                                <div className="setting-label">Average Period Length</div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                    <button className="btn btn-ghost btn-sm" onClick={() => setCycleData(p => ({ ...p, periodLength: Math.max(2, p.periodLength - 1) }))}>−</button>
                                    <span style={{ color: '#fff', fontWeight: 600, minWidth: 40, textAlign: 'center' }}>{cycleData.periodLength}d</span>
                                    <button className="btn btn-ghost btn-sm" onClick={() => setCycleData(p => ({ ...p, periodLength: Math.min(10, p.periodLength + 1) }))}>+</button>
                                </div>
                            </div>
                            <div className="setting-row">
                                <div>
                                    <div className="setting-label">Last Period Start</div>
                                    <div className="setting-desc">{cycleData.lastPeriodStart}</div>
                                </div>
                                <input type="date" className="input-field" style={{ width: 'auto' }} value={cycleData.lastPeriodStart}
                                    onChange={e => setCycleData(p => ({ ...p, lastPeriodStart: e.target.value }))} />
                            </div>
                        </div>
                    </div>

                    <div className="glass-card" style={{ marginBottom: 16 }}>
                        <div className="settings-group">
                            <h4>Notifications</h4>
                            {[
                                { key: 'period', label: 'Period Reminders', desc: '3 days before predicted period' },
                                { key: 'ovulation', label: 'Ovulation Alerts', desc: 'Fertile window notifications' },
                                { key: 'moon', label: 'Moon Phase Updates', desc: 'Full Moon & New Moon notifications' },
                                { key: 'community', label: 'Community Activity', desc: 'New messages and group updates' },
                                { key: 'ai', label: 'AI Daily Insights', desc: 'Morning cosmic cycle briefing' },
                            ].map(n => (
                                <div key={n.key} className="setting-row">
                                    <div>
                                        <div className="setting-label">{n.label}</div>
                                        <div className="setting-desc">{n.desc}</div>
                                    </div>
                                    <div className={`toggle ${notifications[n.key] ? 'active' : ''}`}
                                        onClick={() => setNotifications(p => ({ ...p, [n.key]: !p[n.key] }))} />
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="glass-card">
                        <div className="settings-group">
                            <h4>Privacy & Anonymity</h4>
                            <div className="setting-row">
                                <div>
                                    <div className="setting-label">Global Map Visibility</div>
                                    <div className="setting-desc">Show as anonymous dot on global sync map</div>
                                </div>
                                <div className="toggle active" />
                            </div>
                            <div className="setting-row">
                                <div>
                                    <div className="setting-label">Anonymous Chat Name</div>
                                    <div className="setting-desc">Use cosmic name instead of real name</div>
                                </div>
                                <div className="toggle active" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
