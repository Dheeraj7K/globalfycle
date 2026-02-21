import React, { useState } from 'react';
import { useApp } from '../App';

export default function Community() {
    const [activeTab, setActiveTab] = useState('groups');
    const { user } = useApp();

    return (
        <div className="animate-fadeIn">
            <div className="section-title">Community</div>
            <div className="section-subtitle">Connect with your cosmic sisters — coming soon</div>

            <div className="tabs">
                {['groups', 'chat', 'create'].map(t => (
                    <button key={t} className={`tab ${activeTab === t ? 'active' : ''}`} onClick={() => setActiveTab(t)}>
                        {t === 'groups' ? '👯 Communities' : t === 'chat' ? '💬 Live Chat' : '➕ Create Group'}
                    </button>
                ))}
            </div>

            {activeTab === 'groups' && (
                <div className="glass-card" style={{ textAlign: 'center', padding: 48 }}>
                    <div style={{ fontSize: '3rem', marginBottom: 16 }}>👯‍♀️</div>
                    <h3 style={{ color: '#fff', marginBottom: 8 }}>Communities Coming Soon</h3>
                    <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.85rem', maxWidth: 400, margin: '0 auto', lineHeight: 1.6 }}>
                        Join groups based on your cycle phase, zodiac sign, wellness interests, and more.
                        Connect with women worldwide who share your rhythm.
                    </p>
                    <div style={{ marginTop: 24, display: 'flex', flexWrap: 'wrap', gap: 8, justifyContent: 'center' }}>
                        {['🌙 Moon Bleeders', '🔥 Fire Signs', '🧘 Cycle Yoga', '🌍 Global Sync', '✊ Period Activism', '🎨 Creative Cycles'].map((name, i) => (
                            <span key={i} className="pill pill-purple" style={{ opacity: 0.6 }}>{name}</span>
                        ))}
                    </div>
                    <p style={{ color: 'rgba(255,255,255,0.3)', fontSize: '0.7rem', marginTop: 20 }}>
                        Be one of the first — invite your friends to Global Fycle to unlock communities.
                    </p>
                </div>
            )}

            {activeTab === 'chat' && (
                <div className="glass-card" style={{ textAlign: 'center', padding: 48 }}>
                    <div style={{ fontSize: '3rem', marginBottom: 16 }}>💬</div>
                    <h3 style={{ color: '#fff', marginBottom: 8 }}>Live Chat Coming Soon</h3>
                    <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.85rem', maxWidth: 400, margin: '0 auto' }}>
                        Real-time conversations with your cycle sisters. Share experiences, ask questions, and support each other.
                    </p>
                </div>
            )}

            {activeTab === 'create' && (
                <div className="glass-card" style={{ textAlign: 'center', padding: 48 }}>
                    <div style={{ fontSize: '3rem', marginBottom: 16 }}>✨</div>
                    <h3 style={{ color: '#fff', marginBottom: 8 }}>Create Groups — Coming Soon</h3>
                    <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.85rem', maxWidth: 400, margin: '0 auto' }}>
                        Start your own community around shared interests, cycle patterns, or cosmic connections.
                    </p>
                </div>
            )}
        </div>
    );
}
