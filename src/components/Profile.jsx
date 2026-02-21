import React, { useState } from 'react';
import { useApp } from '../App';

export default function Profile() {
    const { user, cycleData, setCycleData, cycleInfo, zodiac, moonData, noosphere } = useApp();
    const [notifications, setNotifications] = useState({ period: true, ovulation: true, moon: true, community: false, ai: true });

    return (
        <div className="animate-fadeIn">
            <div className="section-title">Profile & Settings</div>
            <div className="section-subtitle">Your cosmic identity and preferences</div>

            <div className="dashboard-grid two-col">
                {/* Profile Card */}
                <div className="glass-card">
                    <div className="profile-header">
                        <div className="profile-avatar">🌙</div>
                        <div className="profile-info">
                            <h2>Cosmic Goddess</h2>
                            <p>Connected via {user?.provider || 'Email'} • Member since Feb 2026</p>
                            <div style={{ display: 'flex', gap: 6, marginTop: 8 }}>
                                <span className="pill pill-magenta">{zodiac.emoji} {zodiac.sign}</span>
                                <span className="pill pill-gold">{moonData.emoji} {moonData.phaseName}</span>
                                <span className="pill pill-teal">🧠 Noosphere {noosphere.index}</span>
                            </div>
                        </div>
                    </div>

                    {/* Connected Accounts */}
                    <div className="settings-group">
                        <h4>Connected Accounts</h4>
                        {[
                            { name: 'Apple', icon: '🍎', connected: user?.provider === 'apple' },
                            { name: 'Google', icon: '🔵', connected: user?.provider === 'google' },
                            { name: 'Pinterest', icon: '📌', connected: user?.provider === 'pinterest' },
                        ].map(a => (
                            <div key={a.name} className="setting-row">
                                <div>
                                    <div className="setting-label">{a.icon} {a.name}</div>
                                    <div className="setting-desc">{a.connected ? 'Connected' : 'Not connected'}</div>
                                </div>
                                <button className="btn btn-ghost btn-sm">{a.connected ? '✓ Connected' : 'Connect'}</button>
                            </div>
                        ))}
                    </div>

                    {/* Stats */}
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 12, marginTop: 16 }}>
                        {[
                            { label: 'Cycles Tracked', value: '12', color: '#ff2d78' },
                            { label: 'Days Logged', value: '287', color: '#00f5d4' },
                            { label: 'Communities', value: '4', color: '#a855f7' },
                            { label: 'Spiritual Level', value: 'Intuitive', color: '#ffd700' },
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
