import React, { useState, useMemo } from 'react';
import { MapContainer, TileLayer, CircleMarker, Popup, Marker } from 'react-leaflet';
import { useApp } from '../App';
import { GLOBAL_EVENTS } from '../utils/syncEngine';

export default function GlobalSyncMap() {
    const { globalUsers, syncStats, cycleInfo } = useApp();
    const [filter, setFilter] = useState('synced');

    const filteredUsers = useMemo(() => {
        if (!globalUsers.length) return [];
        switch (filter) {
            case 'sameDay': return globalUsers.filter(u => u.isSameDay);
            case 'samePhase': return globalUsers.filter(u => u.isSamePhase);
            case 'twins': return globalUsers.filter(u => u.isExactTwin);
            case 'synced': return globalUsers.filter(u => u.isSynced);
            default: return globalUsers.filter(u => u.isSynced);
        }
    }, [globalUsers, filter]);

    const phaseColors = { menstrual: '#ff2d78', follicular: '#00f5d4', ovulation: '#ffd700', luteal: '#a855f7' };

    return (
        <div className="animate-fadeIn">
            <div className="section-title">Global Sync Map</div>
            <div className="section-subtitle">See how your cycle connects with women across the planet — in real time</div>

            {/* Stats Bar */}
            <div className="dashboard-grid" style={{ gridTemplateColumns: 'repeat(5, 1fr)', gap: 12, marginBottom: 20 }}>
                {[
                    { label: 'Total Users', value: syncStats?.total?.toLocaleString() || '—', color: '#fff' },
                    { label: 'Synced With You', value: syncStats?.synced?.toLocaleString() || '—', color: '#ff2d78' },
                    { label: 'Same Day', value: syncStats?.sameDay?.toLocaleString() || '—', color: '#00f5d4' },
                    { label: 'Same Phase', value: syncStats?.samePhase?.toLocaleString() || '—', color: '#a855f7' },
                    { label: 'Exact Twins', value: syncStats?.exactTwins?.toLocaleString() || '—', color: '#ffd700' },
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
                        <TileLayer
                            url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
                        />
                        {/* Synced users */}
                        {filteredUsers.slice(0, 500).map(user => (
                            <CircleMarker key={user.id} center={[user.lat, user.lng]}
                                radius={user.isExactTwin ? 6 : user.isSameDay ? 5 : 3}
                                pathOptions={{
                                    color: phaseColors[user.phase], fillColor: phaseColors[user.phase],
                                    fillOpacity: user.syncScore / 100 * 0.8, weight: user.isExactTwin ? 2 : 1,
                                }}>
                                <Popup>
                                    <div style={{ color: '#e0d6ff', fontFamily: "'Inter', sans-serif", minWidth: 160 }}>
                                        <div style={{ fontWeight: 600, fontSize: '0.9rem', marginBottom: 4 }}>🌙 {user.name} from {user.city}</div>
                                        <div style={{ fontSize: '0.8rem', color: phaseColors[user.phase], marginBottom: 2 }}>
                                            {user.phaseData.emoji} {user.phaseData.name} Phase — Day {user.cycleDay}
                                        </div>
                                        <div style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.5)', marginBottom: 6 }}>
                                            Sync Score: {user.syncScore}%{user.isExactTwin ? ' ✨ Cycle Twin!' : ''}
                                        </div>
                                        <button className="btn btn-primary btn-sm" style={{ width: '100%', justifyContent: 'center', fontSize: '0.7rem' }}>
                                            💬 Send Anonymous Message
                                        </button>
                                    </div>
                                </Popup>
                            </CircleMarker>
                        ))}
                        {/* Global events in red */}
                        {GLOBAL_EVENTS.map((evt, i) => (
                            <CircleMarker key={`evt-${i}`} center={[evt.lat, evt.lng]} radius={8}
                                pathOptions={{ color: '#ff0000', fillColor: '#ff0000', fillOpacity: 0.5, weight: 2 }}>
                                <Popup>
                                    <div style={{ color: '#e0d6ff', fontFamily: "'Inter', sans-serif" }}>
                                        <div style={{ fontWeight: 600 }}>{evt.emoji} {evt.name}</div>
                                        <div style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.5)' }}>{evt.type}</div>
                                    </div>
                                </Popup>
                            </CircleMarker>
                        ))}
                    </MapContainer>
                </div>

                {/* Overlay - Sync Counter */}
                <div className="map-overlay">
                    <div className="sync-counter">
                        <div className="count">{filteredUsers.length.toLocaleString()}</div>
                        <div className="count-label">women {filter === 'twins' ? 'are your cycle twins' : `${filter} with you`}</div>
                    </div>
                </div>

                {/* Overlay - Filters */}
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

            {/* Top Countries */}
            {syncStats?.topCountries && (
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
