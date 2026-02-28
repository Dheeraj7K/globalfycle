import React, { useState, useMemo, useEffect } from 'react';
import { MapContainer, TileLayer, CircleMarker, Popup } from 'react-leaflet';
import { useApp } from '../../App';

export default function GlobalSyncMap() {
    const { globalUsers, syncStats, cycleInfo, user, userLocation } = useApp();
    const [filter, setFilter] = useState('synced');
    const [livePulse, setLivePulse] = useState(true);
    const [liveCount, setLiveCount] = useState(0);

    // Simulate real-time "users joining" counter
    useEffect(() => {
        if (!globalUsers?.length) return;
        const base = globalUsers.length;
        setLiveCount(base);
        const interval = setInterval(() => {
            setLiveCount(prev => prev + Math.floor(Math.random() * 3));
        }, 8000 + Math.random() * 5000);
        return () => clearInterval(interval);
    }, [globalUsers?.length]);

    const filteredUsers = useMemo(() => {
        if (!globalUsers || !globalUsers.length) return [];
        switch (filter) {
            case 'sameDay': return globalUsers.filter(u => u.isSameDay);
            case 'samePhase': return globalUsers.filter(u => u.isSamePhase);
            case 'twins': return globalUsers.filter(u => u.isExactTwin);
            case 'synced': return globalUsers.filter(u => u.isSynced);
            default: return globalUsers.filter(u => u.isSynced);
        }
    }, [globalUsers, filter]);

    const phaseColors = { menstrual: '#ff2d78', follicular: '#00f5d4', ovulation: '#ffd700', luteal: '#a855f7' };
    const hasUsers = globalUsers && globalUsers.length > 0;

    return (
        <div className="animate-fadeIn">
            <div className="section-title">Global Sync Map</div>
            <div className="section-subtitle">
                {hasUsers
                    ? 'Real-time view of your cycle connections across the planet'
                    : 'As more women join Global Fycle, their cycle connections will appear here'}
            </div>

            {/* Live indicator */}
            {hasUsers && (
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
                    <div className={`live-dot ${livePulse ? 'pulsing' : ''}`} />
                    <span style={{ fontSize: '0.75rem', color: '#ff2d78', fontWeight: 600, textTransform: 'uppercase', letterSpacing: 1 }}>
                        LIVE
                    </span>
                    <span style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.4)' }}>
                        {liveCount.toLocaleString()} sisters connected worldwide
                    </span>
                </div>
            )}

            {/* Stats Bar */}
            <div className="dashboard-grid" style={{ gridTemplateColumns: 'repeat(5, 1fr)', gap: 12, marginBottom: 20 }}>
                {[
                    { label: 'Total Active', value: hasUsers ? liveCount.toLocaleString() : '—', color: '#fff' },
                    { label: 'Synced With You', value: hasUsers ? syncStats?.synced?.toLocaleString() : '—', color: '#ff2d78' },
                    { label: 'Same Day', value: hasUsers ? syncStats?.sameDay?.toLocaleString() : '—', color: '#00f5d4' },
                    { label: 'Same Phase', value: hasUsers ? syncStats?.samePhase?.toLocaleString() : '—', color: '#a855f7' },
                    { label: 'Exact Twins', value: hasUsers ? syncStats?.exactTwins?.toLocaleString() : '—', color: '#ffd700' },
                ].map((s, i) => (
                    <div key={i} className="glass-card" style={{ padding: 14, textAlign: 'center' }}>
                        <div style={{ fontSize: '1.5rem', fontWeight: 700, color: s.color }}>{s.value}</div>
                        <div style={{ fontSize: '0.65rem', color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: 1 }}>{s.label}</div>
                    </div>
                ))}
            </div>

            {/* Map */}
            <div style={{ position: 'relative' }}>
                <div className="map-container">
                    <MapContainer center={[20, 0]} zoom={2} scrollWheelZoom={true} style={{ height: '100%', width: '100%', background: '#0a0612' }}
                        attributionControl={false}>
                        <TileLayer url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png" />

                        {/* Your location marker */}
                        <CircleMarker center={userLocation ? [userLocation.lat, userLocation.lng] : [20.5937, 78.9629]} radius={10}
                            pathOptions={{ color: '#ffd700', fillColor: '#ffd700', fillOpacity: 0.8, weight: 3 }}>
                            <Popup>
                                <div style={{ color: '#e0d6ff', fontFamily: "'Inter', sans-serif", minWidth: 160 }}>
                                    <div style={{ fontWeight: 700, fontSize: '0.9rem', marginBottom: 4, color: '#ffd700' }}>⭐ YOU</div>
                                    <div style={{ fontSize: '0.8rem', marginBottom: 2 }}>
                                        {cycleInfo.phaseEmoji} {cycleInfo.phaseName} Phase — Day {cycleInfo.dayOfCycle}
                                    </div>
                                    <div style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.5)' }}>
                                        ✦ {user?.name} ✦
                                    </div>
                                </div>
                            </Popup>
                        </CircleMarker>

                        {/* Synced users */}
                        {filteredUsers.slice(0, 500).map(u => (
                            <CircleMarker key={u.id} center={[u.lat, u.lng]}
                                radius={u.isExactTwin ? 7 : u.isSameDay ? 5 : 3}
                                pathOptions={{
                                    color: phaseColors[u.phase], fillColor: phaseColors[u.phase],
                                    fillOpacity: u.syncScore / 100 * 0.8, weight: u.isExactTwin ? 2 : 1,
                                }}>
                                <Popup>
                                    <div style={{ color: '#e0d6ff', fontFamily: "'Inter', sans-serif", minWidth: 180 }}>
                                        <div style={{ fontWeight: 600, fontSize: '0.9rem', marginBottom: 4 }}>🌙 {u.name}</div>
                                        <div style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.4)', marginBottom: 4 }}>{u.city}</div>
                                        <div style={{ fontSize: '0.8rem', color: phaseColors[u.phase], marginBottom: 2 }}>
                                            {u.phaseData?.emoji} {u.phaseData?.name} Phase — Day {u.cycleDay}
                                        </div>
                                        <div style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.5)', marginBottom: 4 }}>
                                            Sync Score: {u.syncScore}%
                                        </div>
                                        {u.isExactTwin && <div style={{ fontSize: '0.75rem', color: '#ffd700', fontWeight: 600 }}>✨ Cycle Twin!</div>}
                                        <div style={{ marginTop: 6, fontSize: '0.65rem', color: 'rgba(255,255,255,0.3)' }}>
                                            Active {u.lastActiveMinutes}m ago
                                        </div>
                                    </div>
                                </Popup>
                            </CircleMarker>
                        ))}
                    </MapContainer>
                </div>

                {/* Overlay */}
                <div className="map-overlay">
                    <div className="sync-counter">
                        {hasUsers ? (
                            <>
                                <div className="count">{filteredUsers.length.toLocaleString()}</div>
                                <div className="count-label">women {filter === 'twins' ? 'are your cycle twins' : `${filter} with you`}</div>
                            </>
                        ) : (
                            <>
                                <div className="count" style={{ fontSize: '1.2rem' }}>🌍</div>
                                <div className="count-label">Invite friends to see sync connections</div>
                            </>
                        )}
                    </div>
                </div>

                {/* Filters */}
                <div className="map-filters">
                    {[
                        { id: 'synced', label: '🔗 All Synced' },
                        { id: 'sameDay', label: '📅 Same Day' },
                        { id: 'samePhase', label: '🌙 Same Phase' },
                        { id: 'twins', label: '👯 Cycle Twins' },
                    ].map(f => (
                        <button key={f.id} className={`filter-btn ${filter === f.id ? 'active' : ''}`} onClick={() => setFilter(f.id)}>
                            {f.label}
                        </button>
                    ))}
                </div>
            </div>

            {/* Recently Active Users */}
            {hasUsers && (
                <div className="glass-card" style={{ marginTop: 20 }}>
                    <div className="section-header"><span className="section-icon">⚡</span><h3>Recently Active Sisters</h3></div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                        {filteredUsers.slice(0, 8).map((u, i) => (
                            <div key={u.id} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '8px 12px', background: 'rgba(255,255,255,0.03)', borderRadius: 10 }}>
                                <div style={{ width: 8, height: 8, borderRadius: '50%', background: phaseColors[u.phase], flexShrink: 0 }} />
                                <div style={{ flex: 1 }}>
                                    <div style={{ fontSize: '0.8rem', color: '#fff', fontWeight: 500 }}>{u.name}</div>
                                    <div style={{ fontSize: '0.65rem', color: 'rgba(255,255,255,0.4)' }}>{u.city} • Day {u.cycleDay}</div>
                                </div>
                                <span className="pill" style={{ fontSize: '0.6rem', padding: '2px 8px', background: `${phaseColors[u.phase]}15`, color: phaseColors[u.phase] }}>
                                    {u.phaseData?.name}
                                </span>
                                <span style={{ fontSize: '0.6rem', color: 'rgba(255,255,255,0.3)' }}>
                                    {u.lastActiveMinutes}m ago
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Top Countries */}
            {syncStats?.topCountries && syncStats.topCountries.length > 0 && (
                <div className="glass-card" style={{ marginTop: 20 }}>
                    <div className="section-header"><span className="section-icon">🌐</span><h3>Top Synced Countries</h3></div>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 8 }}>
                        {syncStats.topCountries.map((c, i) => (
                            <div key={i} className="glass-card" style={{ padding: 12, textAlign: 'center' }}>
                                <div style={{ fontSize: '1rem', fontWeight: 600, color: '#fff' }}>{c.count}</div>
                                <div style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.5)' }}>{c.country}</div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
