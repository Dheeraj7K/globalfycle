import React, { useState } from 'react';

const NAV_ITEMS = [
    { id: 'dashboard', icon: '🏠', label: 'Home' },
    { id: 'tracker', icon: '🩸', label: 'Track' },
    { id: 'cosmic', icon: '✨', label: 'Cosmos' },
    { id: 'community', icon: '👯', label: 'Circle' },
    { id: 'profile', icon: '👤', label: 'You' },
];

const MORE_ITEMS = [
    { id: 'global-map', icon: '🌍', label: 'Global Sync Map', badge: 'LIVE' },
    { id: 'moon-calendar', icon: '🌙', label: 'Moon Calendar' },
    { id: 'ai', icon: '🤖', label: 'Fycle AI' },
    { id: 'spiritual', icon: '🔮', label: 'Spiritual Growth' },
];

// Desktop sidebar items (all pages, organized)
const SIDEBAR_ITEMS = [
    {
        section: 'Navigate', items: [
            { id: 'dashboard', icon: '🏠', label: 'Dashboard' },
            { id: 'tracker', icon: '🩸', label: 'Cycle Tracker' },
            { id: 'global-map', icon: '🌍', label: 'Global Sync Map', badge: 'LIVE' },
        ]
    },
    {
        section: 'Cosmos', items: [
            { id: 'moon-calendar', icon: '🌙', label: 'Moon Calendar' },
            { id: 'cosmic', icon: '✨', label: 'Cosmic Map' },
            { id: 'ai', icon: '🤖', label: 'Fycle AI' },
        ]
    },
    {
        section: 'Connect', items: [
            { id: 'community', icon: '👯', label: 'Community' },
            { id: 'spiritual', icon: '🔮', label: 'Spiritual Growth' },
            { id: 'profile', icon: '👤', label: 'Profile' },
        ]
    },
];

export default function Navigation({ currentPage, onNavigate, cycleInfo, moonData }) {
    const [moreOpen, setMoreOpen] = useState(false);

    const handleNavClick = (id) => {
        onNavigate(id);
        setMoreOpen(false);
    };

    return (
        <>
            {/* ─── Desktop Sidebar ─── */}
            <nav className="nav-sidebar">
                <div className="nav-logo">
                    <div className="nav-logo-icon">🌙</div>
                    <div className="nav-logo-text">
                        <h1>Global Fycle</h1>
                        <p>Cosmic Sync</p>
                    </div>
                </div>

                <div className="nav-cycle-badge">
                    <div className="cycle-day">{cycleInfo.dayOfCycle}</div>
                    <div className="cycle-label">Day of Cycle</div>
                    <div className="cycle-phase">{cycleInfo.phaseEmoji} {cycleInfo.phaseName} Phase</div>
                </div>

                <div className="nav-moon-badge">
                    <div className="moon-icon">{moonData.emoji}</div>
                    <div className="moon-info">
                        <div className="moon-phase-name">{moonData.phaseName}</div>
                        <div className="moon-illumination">{moonData.illumination}% illuminated</div>
                    </div>
                </div>

                {SIDEBAR_ITEMS.map(group => (
                    <React.Fragment key={group.section}>
                        <div className="nav-section-label">{group.section}</div>
                        {group.items.map(item => (
                            <div
                                key={item.id}
                                className={`nav-item ${currentPage === item.id ? 'active' : ''}`}
                                onClick={() => handleNavClick(item.id)}
                            >
                                <span className="nav-icon">{item.icon}</span>
                                <span>{item.label}</span>
                                {item.badge && <span className="nav-badge">{item.badge}</span>}
                            </div>
                        ))}
                    </React.Fragment>
                ))}
            </nav>

            {/* ─── Mobile Bottom Tab Bar ─── */}
            <nav className="mobile-tab-bar">
                {NAV_ITEMS.map(item => {
                    // "Cosmos" tab opens a more-sheet with sub-pages
                    if (item.id === 'cosmic') {
                        const isCosmosActive = ['cosmic', 'moon-calendar', 'ai', 'global-map', 'spiritual'].includes(currentPage);
                        return (
                            <button
                                key={item.id}
                                className={`tab-item ${isCosmosActive ? 'active' : ''}`}
                                onClick={() => setMoreOpen(!moreOpen)}
                            >
                                <span className="tab-icon">{item.icon}</span>
                                <span className="tab-label">{item.label}</span>
                            </button>
                        );
                    }
                    return (
                        <button
                            key={item.id}
                            className={`tab-item ${currentPage === item.id ? 'active' : ''}`}
                            onClick={() => handleNavClick(item.id)}
                        >
                            <span className="tab-icon">{item.icon}</span>
                            <span className="tab-label">{item.label}</span>
                        </button>
                    );
                })}
            </nav>

            {/* ─── Mobile More Sheet ─── */}
            {moreOpen && (
                <div className="more-sheet-overlay" onClick={() => setMoreOpen(false)}>
                    <div className="more-sheet" onClick={e => e.stopPropagation()}>
                        <div className="more-sheet-handle" />
                        <div className="more-sheet-header">
                            <h3>Explore</h3>
                            <button className="more-close" onClick={() => setMoreOpen(false)}>✕</button>
                        </div>
                        <div className="more-sheet-grid">
                            {MORE_ITEMS.map(item => (
                                <button
                                    key={item.id}
                                    className={`more-item ${currentPage === item.id ? 'active' : ''}`}
                                    onClick={() => handleNavClick(item.id)}
                                >
                                    <span className="more-icon">{item.icon}</span>
                                    <span className="more-label">{item.label}</span>
                                    {item.badge && <span className="more-badge">{item.badge}</span>}
                                </button>
                            ))}
                        </div>

                        {/* Cycle + Moon info for mobile */}
                        <div className="more-sheet-info">
                            <div className="more-info-item">
                                <span className="more-info-value" style={{ color: 'var(--magenta)' }}>Day {cycleInfo.dayOfCycle}</span>
                                <span className="more-info-label">{cycleInfo.phaseName} Phase</span>
                            </div>
                            <div className="more-info-divider" />
                            <div className="more-info-item">
                                <span className="more-info-value">{moonData.emoji} {moonData.phaseName}</span>
                                <span className="more-info-label">{moonData.illumination}% illuminated</span>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
