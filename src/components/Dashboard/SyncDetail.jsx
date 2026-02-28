import React from 'react';

export default function SyncDetail({ syncStats, cycleInfo }) {
    return (
        <>
            <div className="detail-hero" style={{ background: 'linear-gradient(135deg, rgba(0,245,212,0.15), rgba(168,85,247,0.1))' }}>
                <div style={{ fontSize: '3rem' }}>🌍</div>
                <div style={{ fontSize: '2.5rem', fontWeight: 800, color: '#00f5d4' }}>{syncStats?.synced?.toLocaleString() || '—'}</div>
                <div style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.85rem' }}>women globally synced with your cycle</div>
            </div>
            <div className="detail-grid">
                <div className="detail-item">
                    <div className="detail-item-label">Total Community</div>
                    <div className="detail-item-value">{syncStats?.total?.toLocaleString() || '—'}</div>
                </div>
                <div className="detail-item">
                    <div className="detail-item-label">Same Day</div>
                    <div className="detail-item-value" style={{ color: '#00f5d4' }}>{syncStats?.sameDay?.toLocaleString() || '—'}</div>
                </div>
                <div className="detail-item">
                    <div className="detail-item-label">Same Phase</div>
                    <div className="detail-item-value" style={{ color: '#a855f7' }}>{syncStats?.samePhase?.toLocaleString() || '—'}</div>
                </div>
                <div className="detail-item">
                    <div className="detail-item-label">Exact Twins</div>
                    <div className="detail-item-value" style={{ color: '#ffd700' }}>{syncStats?.exactTwins?.toLocaleString() || '—'} 👯</div>
                </div>
            </div>
            <div className="detail-section">
                <h4>🔗 What is Cycle Syncing?</h4>
                <p>Menstrual synchrony (the "McClintock effect") suggests women who live or spend time together may synchronize their cycles. Global Fycle extends this concept — tracking how thousands of women worldwide share similar cycle timing, creating an invisible web of biological connection.</p>
            </div>
            <div className="detail-section">
                <h4>📊 Your Sync Breakdown</h4>
                <p><strong style={{ color: '#00f5d4' }}>Same Day ({syncStats?.sameDay || 0})</strong> — These women are on the exact same cycle day as you right now.</p>
                <p><strong style={{ color: '#a855f7' }}>Same Phase ({syncStats?.samePhase || 0})</strong> — In the same menstrual phase (menstrual, follicular, ovulation, or luteal).</p>
                <p><strong style={{ color: '#ffd700' }}>Cycle Twins ({syncStats?.exactTwins || 0})</strong> — Women with nearly identical cycle timing — your cosmic sisters!</p>
            </div>
            {syncStats?.topCountries?.length > 0 && (
                <div className="detail-section">
                    <h4>🌐 Top Synced Countries</h4>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                        {syncStats.topCountries.map((c, i) => (
                            <span key={i} className="pill pill-teal">{c.country}: {c.count}</span>
                        ))}
                    </div>
                </div>
            )}
        </>
    );
}
