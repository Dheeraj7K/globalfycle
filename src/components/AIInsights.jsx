import React, { useState } from 'react';
import { useApp } from '../App';
import { AI_INITIAL_MESSAGES, getAIResponse } from '../data/aiInsights';

export default function AIInsights() {
    const { cycleInfo, moonData, noosphere, syncStats } = useApp();
    const [messages, setMessages] = useState([
        ...AI_INITIAL_MESSAGES,
        { from: 'ai', text: `📊 Your Quick Stats: Day ${cycleInfo.dayOfCycle} (${cycleInfo.phaseName}) • ${moonData.phaseName} (${moonData.illumination}%) • Noosphere: ${noosphere.index} • ${syncStats?.synced?.toLocaleString() || '—'} women synced globally` }
    ]);
    const [input, setInput] = useState('');
    const [isTyping, setIsTyping] = useState(false);

    const categories = [
        { id: 'medical', label: '🏥 Medical', desc: 'Ask about symptoms, health, nutrition' },
        { id: 'cosmic', label: '✨ Cosmic', desc: 'Astrology, moon, planetary influences' },
        { id: 'global', label: '🌍 Global', desc: 'Sync patterns, collective data' },
        { id: 'default', label: '🔮 General', desc: 'Anything about your cycle' },
    ];

    const handleSend = (text) => {
        const msg = text || input;
        if (!msg.trim()) return;
        setMessages(prev => [...prev, { from: 'user', text: msg }]);
        setInput('');
        setIsTyping(true);
        // Detect category
        const lower = msg.toLowerCase();
        let cat = 'default';
        if (lower.includes('symptom') || lower.includes('pain') || lower.includes('health') || lower.includes('food') || lower.includes('medical')) cat = 'medical';
        else if (lower.includes('moon') || lower.includes('zodiac') || lower.includes('planet') || lower.includes('cosmic') || lower.includes('astro')) cat = 'cosmic';
        else if (lower.includes('global') || lower.includes('sync') || lower.includes('world') || lower.includes('women')) cat = 'global';
        setTimeout(() => {
            setMessages(prev => [...prev, { from: 'ai', text: getAIResponse(cat) }]);
            setIsTyping(false);
        }, 1200 + Math.random() * 800);
    };

    return (
        <div className="animate-fadeIn">
            <div className="section-title">Fycle AI</div>
            <div className="section-subtitle">Your cosmic cycle intelligence — connecting medical, astrological, and global insights</div>

            <div className="dashboard-grid two-col">
                {/* Chat */}
                <div className="ai-chat-container">
                    <div className="ai-chat-header">
                        <div className="ai-avatar">🤖</div>
                        <div>
                            <div className="ai-name">Fycle AI</div>
                            <div className="ai-status">{isTyping ? 'Channeling cosmic data...' : 'Online — Connected to the Noosphere'}</div>
                        </div>
                    </div>
                    <div className="ai-messages">
                        {messages.map((m, i) => (
                            <div key={i} className={`ai-message ${m.from === 'ai' ? 'from-ai' : 'from-user'}`}>{m.text}</div>
                        ))}
                        {isTyping && (
                            <div className="ai-message from-ai" style={{ color: 'rgba(255,255,255,0.4)' }}>
                                ✨ Reading your cosmic data...
                            </div>
                        )}
                    </div>
                    <div className="ai-input-bar">
                        <input value={input} onChange={e => setInput(e.target.value)}
                            onKeyDown={e => e.key === 'Enter' && handleSend()}
                            placeholder="Ask about your cycle, the cosmos, or global patterns..." />
                        <button onClick={() => handleSend()}>→</button>
                    </div>
                </div>

                {/* Quick Actions & Insights */}
                <div>
                    {/* Quick Questions */}
                    <div className="glass-card" style={{ marginBottom: 16 }}>
                        <div className="section-header"><span className="section-icon">💬</span><h3>Quick Questions</h3></div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                            {[
                                "Why am I feeling low energy today?",
                                "How does today's moon affect my cycle?",
                                "Show me my global sync connections",
                                "What should I eat during this phase?",
                                "When is my next fertile window?",
                                "How does Mercury retrograde affect me?",
                            ].map((q, i) => (
                                <button key={i} className="btn btn-ghost btn-sm" onClick={() => handleSend(q)}
                                    style={{ justifyContent: 'flex-start', textAlign: 'left', fontSize: '0.78rem' }}>{q}</button>
                            ))}
                        </div>
                    </div>

                    {/* Category Cards */}
                    <div className="section-header"><span className="section-icon">🧭</span><h3>Explore by Category</h3></div>
                    {categories.map(c => (
                        <div key={c.id} className="glass-card cosmic-insight-card" style={{ marginBottom: 8, cursor: 'pointer', borderLeftColor: c.id === 'medical' ? '#00f5d4' : c.id === 'cosmic' ? '#ffd700' : c.id === 'global' ? '#ff2d78' : '#a855f7' }}
                            onClick={() => handleSend(`Tell me ${c.id} insights about my current cycle phase`)}>
                            <div className="insight-type" style={{ color: c.id === 'medical' ? '#00f5d4' : c.id === 'cosmic' ? '#ffd700' : c.id === 'global' ? '#ff2d78' : '#a855f7' }}>{c.label}</div>
                            <div className="insight-text">{c.desc}</div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
