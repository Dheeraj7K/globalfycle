import React, { useState } from 'react';
import { useApp } from '../../App';

export default function Profile() {
    const { user, cycleData, setCycleData, cycleInfo, zodiac, moonData, noosphere, birthData, natalChart, logHistory, periodLogs, logOut, deleteAccount } = useApp();
    const [notifications, setNotifications] = useState({ period: true, ovulation: true, moon: true, community: false, ai: true });
    const [showPrivacy, setShowPrivacy] = useState(false);
    const [exportMsg, setExportMsg] = useState('');
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [deleting, setDeleting] = useState(false);

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
                            <h2>{user?.name || 'Cosmic Soul'}</h2>
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
                                    <div className="setting-label">Your Cosmic Name</div>
                                    <div className="setting-desc" style={{ color: '#ffd700', fontWeight: 600, fontSize: '0.8rem' }}>✦ {user?.name} ✦</div>
                                    <div className="setting-desc">This is how others see you in chats & on the map</div>
                                </div>
                            </div>
                            <div className="setting-row">
                                <div>
                                    <div className="setting-label">Global Map Visibility</div>
                                    <div className="setting-desc">Show as anonymous dot on global sync map</div>
                                </div>
                                <div className="toggle active" />
                            </div>
                        </div>
                    </div>

                    {/* Data Management */}
                    <div className="glass-card">
                        <div className="settings-group">
                            <h4>Data Management</h4>
                            <div className="setting-row">
                                <div>
                                    <div className="setting-label">Export All Data</div>
                                    <div className="setting-desc">Download your cycle, log, and period history as CSV</div>
                                </div>
                                <button className="btn btn-ghost btn-sm" onClick={() => {
                                    // Generate CSV
                                    let csv = 'Date,Flow,Mood,Symptoms,Sleep,Exercise,Stress,Notes\n';
                                    logHistory.forEach(l => {
                                        csv += `${l.date || l.id},${l.flow || 0},${l.mood || ''},"${(l.symptoms || []).join(';')}",${l.sleep || ''},${l.exercise || ''},${l.stress || ''},"${(l.notes || '').replace(/"/g, '""')}"\n`;
                                    });
                                    csv += '\nPeriod Start,Period End\n';
                                    periodLogs.forEach(p => { csv += `${p.startDate},${p.endDate || 'ongoing'}\n`; });
                                    csv += `\nCycle Length,${cycleData.cycleLength}\nPeriod Length,${cycleData.periodLength}\nLast Period Start,${cycleData.lastPeriodStart}\n`;
                                    const blob = new Blob([csv], { type: 'text/csv' });
                                    const url = URL.createObjectURL(blob);
                                    const a = document.createElement('a');
                                    a.href = url; a.download = `fycle-data-${new Date().toISOString().split('T')[0]}.csv`;
                                    a.click(); URL.revokeObjectURL(url);
                                    setExportMsg('✅ Data exported!');
                                    setTimeout(() => setExportMsg(''), 3000);
                                }}>
                                    {exportMsg || '📥 Export CSV'}
                                </button>
                            </div>
                            <div className="setting-row">
                                <div>
                                    <div className="setting-label">Privacy Policy</div>
                                    <div className="setting-desc">How we handle your data</div>
                                </div>
                                <button className="btn btn-ghost btn-sm" onClick={() => setShowPrivacy(true)}>View</button>
                            </div>
                        </div>
                    </div>

                    {/* Account Actions */}
                    <div className="glass-card">
                        <div className="settings-group">
                            <h4>Account</h4>
                            <div className="setting-row">
                                <div>
                                    <div className="setting-label">Sign Out</div>
                                    <div className="setting-desc">Log out of your account</div>
                                </div>
                                <button className="btn btn-ghost btn-sm" onClick={logOut}
                                    style={{ color: '#ffd700' }}>🚪 Logout</button>
                            </div>
                            <div className="setting-row">
                                <div>
                                    <div className="setting-label" style={{ color: '#ff4444' }}>Delete Account</div>
                                    <div className="setting-desc">Permanently remove all your data</div>
                                </div>
                                <button className="btn btn-ghost btn-sm" onClick={() => setShowDeleteConfirm(true)}
                                    style={{ color: '#ff4444', borderColor: 'rgba(255,68,68,0.3)' }}>🗑️ Delete</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Privacy Policy Modal */}
            {showPrivacy && (
                <div className="modal-overlay" onClick={() => setShowPrivacy(false)}>
                    <div className="modal-content detail-modal" onClick={e => e.stopPropagation()} style={{ maxWidth: 550 }}>
                        <div className="modal-header">
                            <h2 style={{ color: '#fff', fontSize: '1.2rem' }}>🔒 Privacy Policy</h2>
                            <button className="modal-close" onClick={() => setShowPrivacy(false)}>✕</button>
                        </div>
                        <div className="modal-body" style={{ maxHeight: '60vh', overflowY: 'auto' }}>
                            <div style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.7)', lineHeight: 1.7 }}>
                                <h4 style={{ color: '#ff2d78', marginBottom: 8 }}>Your Data, Your Control</h4>
                                <p>Global Fycle is designed with privacy at its core. Here's how we protect you:</p>
                                <ul style={{ paddingLeft: 20, marginTop: 10 }}>
                                    <li><strong>Encrypted Storage</strong> — All data stored in Firebase with encryption at rest and in transit.</li>
                                    <li><strong>Anonymous Identity</strong> — Your cosmic name shields your real identity. Other users never see your real name or email.</li>
                                    <li><strong>No Data Selling</strong> — We never sell, share, or monetize your health data. Period.</li>
                                    <li><strong>Local Processing</strong> — Cycle predictions and insights are computed on-device, not on our servers.</li>
                                    <li><strong>Export Anytime</strong> — Download all your data as CSV at any time from the button above.</li>
                                    <li><strong>Delete Anytime</strong> — Request account deletion and all data is permanently removed.</li>
                                </ul>
                                <h4 style={{ color: '#00f5d4', marginTop: 16, marginBottom: 8 }}>Data We Collect</h4>
                                <p>Only what you explicitly enter: cycle dates, symptoms, moods, journal entries, and birth chart data. We collect no location data, browsing history, or device identifiers.</p>
                                <h4 style={{ color: '#ffd700', marginTop: 16, marginBottom: 8 }}>Global Map</h4>
                                <p>The Global Sync Map uses your cycle phase (not personal details) to show anonymous connections. Your location on the map uses browser geolocation only when you grant permission and is never stored on our servers.</p>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Delete Account Confirmation Modal */}
            {showDeleteConfirm && (
                <div className="modal-overlay" onClick={() => setShowDeleteConfirm(false)}>
                    <div className="modal-content detail-modal" onClick={e => e.stopPropagation()} style={{ maxWidth: 420 }}>
                        <div className="modal-header">
                            <h2 style={{ color: '#ff4444', fontSize: '1.2rem' }}>⚠️ Delete Account</h2>
                            <button className="modal-close" onClick={() => setShowDeleteConfirm(false)}>✕</button>
                        </div>
                        <div className="modal-body">
                            <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.9rem', lineHeight: 1.7 }}>
                                This will <strong style={{ color: '#ff4444' }}>permanently delete</strong> your account and all associated data:
                            </p>
                            <ul style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.85rem', lineHeight: 1.8, paddingLeft: 20, marginTop: 10 }}>
                                <li>All daily logs and period history</li>
                                <li>Journal entries and spiritual progress</li>
                                <li>Cycle settings and birth chart data</li>
                                <li>Your cosmic identity</li>
                            </ul>
                            <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.8rem', marginTop: 12, fontStyle: 'italic' }}>
                                💡 Tip: Export your data first using the Export CSV button above.
                            </p>
                            <div style={{ display: 'flex', gap: 10, marginTop: 20, justifyContent: 'flex-end' }}>
                                <button className="btn btn-ghost" onClick={() => setShowDeleteConfirm(false)}
                                    style={{ padding: '10px 20px' }}>Cancel</button>
                                <button className="btn" disabled={deleting} onClick={async () => {
                                    setDeleting(true);
                                    try {
                                        await deleteAccount();
                                    } catch (err) {
                                        setDeleting(false);
                                        alert('Could not delete account. You may need to log in again first.');
                                    }
                                }} style={{
                                    padding: '10px 20px', background: '#ff4444', color: '#fff', border: 'none',
                                    borderRadius: 10, fontWeight: 600, cursor: deleting ? 'wait' : 'pointer',
                                    opacity: deleting ? 0.6 : 1,
                                }}>
                                    {deleting ? '⏳ Deleting...' : '🗑️ Delete Forever'}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
