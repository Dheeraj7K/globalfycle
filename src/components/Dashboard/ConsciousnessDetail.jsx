import React from 'react';

export default function ConsciousnessDetail({ noosphere, moonData }) {
    return (
        <>
            <div className="detail-hero" style={{ background: 'linear-gradient(135deg, rgba(255,215,0,0.15), rgba(168,85,247,0.1))' }}>
                <div style={{ fontSize: '3rem' }}>🧠</div>
                <div style={{ fontSize: '2.5rem', fontWeight: 800, color: '#ffd700' }}>{noosphere.index}</div>
                <div style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.85rem' }}>{noosphere.level} Consciousness</div>
            </div>
            <div className="detail-grid">
                <div className="detail-item">
                    <div className="detail-item-label">Lunar Factor</div>
                    <div className="detail-item-value" style={{ color: '#ffd700' }}>{noosphere.lunarFactor}%</div>
                </div>
                <div className="detail-item">
                    <div className="detail-item-label">Schumann Hz</div>
                    <div className="detail-item-value" style={{ color: '#00f5d4' }}>{noosphere.schumannResonance}</div>
                </div>
                <div className="detail-item">
                    <div className="detail-item-label">Sync Wave</div>
                    <div className="detail-item-value" style={{ color: '#a855f7' }}>{noosphere.globalSyncWave}%</div>
                </div>
                <div className="detail-item">
                    <div className="detail-item-label">Moon Phase</div>
                    <div className="detail-item-value">{moonData.emoji} {moonData.phaseName}</div>
                </div>
            </div>
            <div className="detail-section">
                <h4>✨ What is the Consciousness Index?</h4>
                <p>The Noosphere Consciousness Index combines multiple cosmic and biological signals into a single number representing the collective feminine consciousness. It incorporates lunar cycles, Earth's Schumann resonance (the planet's electromagnetic heartbeat at ~7.83 Hz), and global menstrual synchronization patterns.</p>
            </div>
            <div className="detail-section">
                <h4>🌙 Current Cosmic Factors</h4>
                <p><strong style={{ color: '#ffd700' }}>Lunar Factor ({noosphere.lunarFactor}%)</strong> — How strongly the current moon phase influences collective energy. Full and New moons have the strongest pull.</p>
                <p><strong style={{ color: '#00f5d4' }}>Schumann Resonance ({noosphere.schumannResonance} Hz)</strong> — Earth's natural electromagnetic frequency. Variations correlate with collective mood shifts and heightened intuition.</p>
                <p><strong style={{ color: '#a855f7' }}>Global Sync Wave ({noosphere.globalSyncWave}%)</strong> — The percentage of women worldwide whose cycles are harmonically aligned right now.</p>
            </div>
            <div className="detail-section">
                <h4>📖 The Noosphere Theory</h4>
                <p>{noosphere.description}</p>
            </div>
        </>
    );
}
