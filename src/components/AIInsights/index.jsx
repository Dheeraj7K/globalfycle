import React, { useState } from 'react';
import { useApp } from '../../App';
import { AI_INITIAL_MESSAGES, getAIResponse } from '../../data/aiInsights';

// Education content organized by topic
const EDUCATION_TOPICS = [
    {
        id: 'basics', emoji: '🔴', title: 'Menstrual Cycle Basics',
        sections: [
            { heading: 'What is the menstrual cycle?', text: 'The menstrual cycle is a monthly series of hormonal changes that prepare the body for pregnancy. It typically lasts 21–35 days, with an average of 28 days. The cycle is controlled by hormones including estrogen, progesterone, FSH, and LH.' },
            { heading: 'The 4 Phases', text: '1. Menstrual (Days 1-5): Uterine lining sheds. Hormone levels are lowest.\n2. Follicular (Days 6-13): Estrogen rises, follicles develop in ovaries.\n3. Ovulation (Day ~14): An egg is released. Peak fertility.\n4. Luteal (Days 15-28): Progesterone rises to support potential pregnancy. If no pregnancy, hormone levels drop and the cycle restarts.' },
            { heading: 'What\'s Normal?', text: 'Cycle lengths of 21-35 days are considered normal. Periods typically last 3-7 days. Flow varies from person to person. Slight variations between cycles are common — your body isn\'t a clock, it\'s a living system.' },
        ]
    },
    {
        id: 'ovulation', emoji: '🥚', title: 'Ovulation & Fertility',
        sections: [
            { heading: 'When does ovulation occur?', text: 'Ovulation typically happens about 14 days before your next period starts (not 14 days after your last period). For a 28-day cycle, this is around day 14. For a 32-day cycle, it\'s around day 18.' },
            { heading: 'The Fertile Window', text: 'Sperm can survive up to 5 days inside the body, and the egg lives for 12-24 hours after release. This means the fertile window is approximately 6 days: the 5 days before ovulation and the day of ovulation itself.' },
            { heading: 'Signs of Ovulation', text: '• Cervical mucus becomes clear, stretchy, and egg white-like\n• Slight rise in basal body temperature (0.2-0.5°F)\n• Some women feel mild pain on one side (mittelschmerz)\n• Increased libido and energy\n• LH surge detectable by ovulation test kits' },
        ]
    },
    {
        id: 'hormones', emoji: '⚗️', title: 'Hormones & Your Body',
        sections: [
            { heading: 'Estrogen', text: 'Peaks during the follicular phase and at ovulation. Responsible for building the uterine lining, boosting mood and energy, improving skin clarity, and enhancing cognitive function.' },
            { heading: 'Progesterone', text: 'Rises during the luteal phase after ovulation. Prepares the uterus for potential pregnancy, raises body temperature slightly, can cause mood changes (PMS), and supports sleep.' },
            { heading: 'Testosterone', text: 'Yes, women produce testosterone too! It peaks around ovulation, contributing to increased libido, confidence, and energy. It plays a role in muscle maintenance and bone density.' },
        ]
    },
    {
        id: 'health', emoji: '💊', title: 'Cycle Health Tips',
        sections: [
            { heading: 'Nutrition by Phase', text: '• Menstrual: Iron-rich foods (spinach, lentils, red meat), vitamin C for iron absorption, warm soups\n• Follicular: Fermented foods, sprouted seeds, light proteins, citrus\n• Ovulation: Raw vegetables, lighter grains, antioxidant-rich berries\n• Luteal: Complex carbs, magnesium-rich foods (dark chocolate, nuts), root vegetables' },
            { heading: 'Exercise by Phase', text: '• Menstrual: Gentle yoga, walking, stretching — honor low energy\n• Follicular: Try new activities, cardio, dance, hiking\n• Ovulation: High-intensity training, group sports, power workouts\n• Luteal: Strength training, swimming, moderate yoga, pilates' },
            { heading: 'When to See a Doctor', text: 'Consult a healthcare provider if you experience: periods longer than 7 days, cycles shorter than 21 or longer than 35 days consistently, extremely heavy bleeding (soaking through a pad/tampon every hour), severe pain that interferes with daily life, or sudden cycle changes.' },
        ]
    },
];

const HEALTH_RESOURCES = [
    { name: 'ACOG (Amer. College of OB-GYN)', url: 'https://www.acog.org/womens-health', emoji: '🏥' },
    { name: 'WHO Reproductive Health', url: 'https://www.who.int/health-topics/sexual-and-reproductive-health', emoji: '🌍' },
    { name: 'Planned Parenthood', url: 'https://www.plannedparenthood.org/learn/health-and-wellness/menstruation', emoji: '💜' },
    { name: 'NHS Periods Guide', url: 'https://www.nhs.uk/conditions/periods/', emoji: '🇬🇧' },
    { name: 'Mayo Clinic: Menstrual Cycle', url: 'https://www.mayoclinic.org/healthy-lifestyle/womens-health/in-depth/menstrual-cycle/art-20047186', emoji: '📋' },
];

export default function AIInsights() {
    const { cycleInfo, moonData, noosphere, syncStats } = useApp();
    const [activeTab, setActiveTab] = useState('chat');
    const [messages, setMessages] = useState([
        ...AI_INITIAL_MESSAGES,
        { from: 'ai', text: `📊 Your Quick Stats: Day ${cycleInfo.dayOfCycle} of ${cycleInfo.totalDays} (${cycleInfo.phaseName} Phase) • ${moonData.emoji} ${moonData.phaseName} (${moonData.illumination}% illuminated) • Noosphere Index: ${noosphere.index}` }
    ]);
    const [input, setInput] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const [expandedTopic, setExpandedTopic] = useState(null);

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
            <div className="section-title">Fycle AI & Learn</div>
            <div className="section-subtitle">Your cosmic cycle intelligence — medical, astrological, and educational insights</div>

            <div className="tabs">
                {['chat', 'learn', 'resources'].map(t => (
                    <button key={t} className={`tab ${activeTab === t ? 'active' : ''}`} onClick={() => setActiveTab(t)}>
                        {t === 'chat' ? '🤖 AI Chat' : t === 'learn' ? '📚 Learn' : '🔗 Resources'}
                    </button>
                ))}
            </div>

            {activeTab === 'chat' && (
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
            )}

            {activeTab === 'learn' && (
                <div style={{ maxWidth: 700 }}>
                    {EDUCATION_TOPICS.map(topic => (
                        <div key={topic.id} className="glass-card" style={{ marginBottom: 12 }}>
                            <div
                                className="section-header"
                                style={{ cursor: 'pointer', userSelect: 'none' }}
                                onClick={() => setExpandedTopic(expandedTopic === topic.id ? null : topic.id)}
                            >
                                <span className="section-icon">{topic.emoji}</span>
                                <h3 style={{ flex: 1 }}>{topic.title}</h3>
                                <span style={{
                                    color: 'rgba(255,255,255,0.3)', fontSize: '0.8rem',
                                    transition: 'transform 0.2s',
                                    transform: expandedTopic === topic.id ? 'rotate(180deg)' : 'rotate(0deg)',
                                }}>▼</span>
                            </div>
                            {expandedTopic === topic.id && (
                                <div style={{ marginTop: 12 }}>
                                    {topic.sections.map((s, i) => (
                                        <div key={i} style={{ marginBottom: 16 }}>
                                            <h4 style={{ color: '#ffd700', fontSize: '0.9rem', marginBottom: 6 }}>{s.heading}</h4>
                                            <p style={{
                                                fontSize: '0.85rem', color: 'rgba(255,255,255,0.7)',
                                                lineHeight: 1.7, whiteSpace: 'pre-line',
                                            }}>{s.text}</p>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}

            {activeTab === 'resources' && (
                <div style={{ maxWidth: 700 }}>
                    <div className="glass-card">
                        <div className="section-header"><span className="section-icon">🏥</span><h3>Trusted Health Resources</h3></div>
                        <p style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.5)', marginBottom: 16 }}>
                            These are reputable medical organizations. Always consult a healthcare provider for personal medical advice.
                        </p>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                            {HEALTH_RESOURCES.map((r, i) => (
                                <a key={i} href={r.url} target="_blank" rel="noopener noreferrer"
                                    className="glass-card" style={{
                                        display: 'flex', alignItems: 'center', gap: 12,
                                        padding: '12px 16px', textDecoration: 'none',
                                        transition: 'all 0.2s', cursor: 'pointer',
                                    }}>
                                    <span style={{ fontSize: '1.3rem' }}>{r.emoji}</span>
                                    <div style={{ flex: 1 }}>
                                        <div style={{ fontSize: '0.85rem', color: '#fff', fontWeight: 500 }}>{r.name}</div>
                                        <div style={{ fontSize: '0.65rem', color: 'rgba(255,255,255,0.35)' }}>{r.url}</div>
                                    </div>
                                    <span style={{ color: 'rgba(255,255,255,0.3)', fontSize: '0.8rem' }}>↗</span>
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* Phase-specific tips */}
                    <div className="glass-card" style={{ marginTop: 16 }}>
                        <div className="section-header"><span className="section-icon">💡</span><h3>Tips for Your Current Phase</h3></div>
                        <div style={{ padding: '12px 16px', background: `${cycleInfo.phaseColor}10`, borderRadius: 12, borderLeft: `3px solid ${cycleInfo.phaseColor}` }}>
                            <div style={{ fontSize: '0.7rem', color: cycleInfo.phaseColor, fontWeight: 600, textTransform: 'uppercase', marginBottom: 6 }}>
                                {cycleInfo.phaseEmoji} {cycleInfo.phaseName} Phase — Day {cycleInfo.dayOfCycle}
                            </div>
                            <p style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.7)', lineHeight: 1.6 }}>
                                {cycleInfo.phaseDescription}
                            </p>
                            <div style={{ marginTop: 10, display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                                <span className="pill pill-gold">Fertility: {cycleInfo.fertilityStatus}</span>
                                <span className="pill pill-teal">Energy: {cycleInfo.socialEnergy}/10</span>
                                <span className="pill pill-purple">Intuition: {cycleInfo.intuitionStrength}/10</span>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
