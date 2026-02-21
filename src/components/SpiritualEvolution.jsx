import React, { useState } from 'react';
import { useApp } from '../App';

const FEED_ITEMS = [
    { id: 1, emoji: '🧘', title: 'Menstrual Phase Yoga', desc: 'Gentle yin poses to honor your body during menstruation. Hold each for 3-5 breaths.', category: 'Movement', height: 180 },
    { id: 2, emoji: '🌿', title: 'Raspberry Leaf Tea Ritual', desc: 'Ancient remedy for cycle balance. Steep fresh leaves, add honey, drink during follicular phase.', category: 'Herbal', height: 160 },
    { id: 3, emoji: '💎', title: 'Moonstone Meditation', desc: 'Place moonstone on your sacral chakra during the waxing moon to enhance receptivity and intuition.', category: 'Crystal', height: 200 },
    { id: 4, emoji: '🎨', title: 'Cycle Art Journaling', desc: 'Draw your inner landscape each phase. Menstrual = deep reds, Follicular = spring greens, Ovulation = golds, Luteal = purples.', category: 'Creative', height: 220 },
    { id: 5, emoji: '🌙', title: 'New Moon Intention Setting', desc: 'Write intentions during the New Moon. Your menstrual phase amplifies this manifestation power tenfold.', category: 'Ritual', height: 170 },
    { id: 6, emoji: '📖', title: 'Wild Power by Alexandra Pope', desc: 'The revolutionary guide to understanding your menstrual cycle as a source of creative, spiritual, and professional power.', category: 'Reading', height: 150 },
    { id: 7, emoji: '🍫', title: 'Cacao Ceremony for PMS', desc: 'Ceremonial cacao opens the heart chakra and releases feel-good chemicals. Perfect for the luteal phase.', category: 'Ritual', height: 190 },
    { id: 8, emoji: '⚡', title: 'Ovulation Power Moves', desc: 'Schedule your biggest presentations, asks, and creative launches during days 12-16. Your magnetism peaks here.', category: 'Career', height: 160 },
    { id: 9, emoji: '🌊', title: 'Womb Breathing Practice', desc: 'Deep belly breathing that connects you to your womb space. 4 counts in, 7 hold, 8 out. Repeat 4 times.', category: 'Breathwork', height: 140 },
    { id: 10, emoji: '🔮', title: 'Tarot for Each Phase', desc: 'Menstrual: The High Priestess. Follicular: The Empress. Ovulation: The Sun. Luteal: The Moon.', category: 'Divination', height: 180 },
    { id: 11, emoji: '🌺', title: 'Sacred Flower Bath', desc: 'Rose petals + lavender + salt bath during menstruation. Transform pain into a ritual of self-love.', category: 'Ritual', height: 200 },
    { id: 12, emoji: '🧬', title: 'Epigenetic Cycle Memory', desc: 'Your cycle patterns carry ancestral wisdom. Track for 12+ cycles to discover your maternal lineage patterns.', category: 'Science', height: 170 },
];

const LEVELS = [
    { level: 1, name: 'Seeker', xp: 0, emoji: '🌱' },
    { level: 2, name: 'Awakened', xp: 100, emoji: '🌿' },
    { level: 3, name: 'Intuitive', xp: 300, emoji: '🌙' },
    { level: 4, name: 'Priestess', xp: 600, emoji: '🔮' },
    { level: 5, name: 'Oracle', xp: 1000, emoji: '👑' },
    { level: 6, name: 'Goddess', xp: 1500, emoji: '✨' },
    { level: 7, name: 'Cosmic Mother', xp: 2500, emoji: '🌌' },
];

export default function SpiritualEvolution() {
    const { cycleInfo } = useApp();
    const [activeTab, setActiveTab] = useState('feed');
    const currentXP = 420;
    const currentLevel = LEVELS.find((_, i) => i + 1 < LEVELS.length && currentXP >= LEVELS[i].xp && currentXP < LEVELS[i + 1].xp) || LEVELS[2];
    const nextLevel = LEVELS[LEVELS.indexOf(currentLevel) + 1] || LEVELS[LEVELS.length - 1];
    const progress = ((currentXP - currentLevel.xp) / (nextLevel.xp - currentLevel.xp)) * 100;

    return (
        <div className="animate-fadeIn">
            <div className="section-title">Spiritual Evolution</div>
            <div className="section-subtitle">Grow, discover, and evolve through the wisdom of your cycle</div>

            {/* XP / Level Card */}
            <div className="glass-card" style={{ marginBottom: 20, display: 'flex', alignItems: 'center', gap: 20 }}>
                <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: '2.5rem' }}>{currentLevel.emoji}</div>
                    <div style={{ color: '#ffd700', fontSize: '0.8rem', fontWeight: 600 }}>{currentLevel.name}</div>
                    <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.65rem' }}>Level {LEVELS.indexOf(currentLevel) + 1}</div>
                </div>
                <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', marginBottom: 6 }}>
                        <span style={{ color: 'rgba(255,255,255,0.6)' }}>{currentXP} XP</span>
                        <span style={{ color: 'rgba(255,255,255,0.4)' }}>Next: {nextLevel.emoji} {nextLevel.name} ({nextLevel.xp} XP)</span>
                    </div>
                    <div className="xp-bar"><div className="xp-bar-fill" style={{ width: `${progress}%` }} /></div>
                    <div style={{ marginTop: 8, display: 'flex', gap: 6 }}>
                        {LEVELS.map((l, i) => (
                            <div key={i} style={{ fontSize: currentXP >= l.xp ? '1rem' : '0.7rem', opacity: currentXP >= l.xp ? 1 : 0.3, transition: 'all 0.3s' }}>
                                {l.emoji}
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <div className="tabs">
                {['feed', 'journal', 'rituals'].map(t => (
                    <button key={t} className={`tab ${activeTab === t ? 'active' : ''}`} onClick={() => setActiveTab(t)}>
                        {t === 'feed' ? '📌 Discovery Feed' : t === 'journal' ? '📓 Journal' : '🕯️ Daily Rituals'}
                    </button>
                ))}
            </div>

            {activeTab === 'feed' && (
                <div className="masonry-feed">
                    {FEED_ITEMS.map(item => (
                        <div key={item.id} className="masonry-item">
                            <div className="masonry-img" style={{ minHeight: item.height, background: `linear-gradient(135deg, rgba(107,33,168,0.3), rgba(255,45,120,0.1))` }}>
                                {item.emoji}
                            </div>
                            <div className="masonry-content">
                                <span className="pill pill-purple" style={{ marginBottom: 6, display: 'inline-block' }}>{item.category}</span>
                                <h5>{item.title}</h5>
                                <p>{item.desc}</p>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {activeTab === 'journal' && (
                <div className="glass-card" style={{ maxWidth: 600 }}>
                    <div className="section-header"><span className="section-icon">📓</span><h3>Cycle Journal</h3></div>
                    <p style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.5)', marginBottom: 16 }}>
                        Reflect on your {cycleInfo.phaseName} phase. What is your body telling you today?
                    </p>
                    <div style={{ marginBottom: 12, padding: 14, background: 'rgba(255,45,120,0.06)', borderRadius: 12, borderLeft: '3px solid #ff2d78' }}>
                        <div style={{ fontSize: '0.65rem', color: '#ff2d78', fontWeight: 600, marginBottom: 4 }}>JOURNAL PROMPT</div>
                        <div style={{ fontSize: '0.88rem', fontStyle: 'italic', color: 'rgba(255,255,255,0.7)' }}>
                            {cycleInfo.phase === 'menstrual' ? '"What am I ready to release?"' :
                                cycleInfo.phase === 'follicular' ? '"What new seeds am I planting in my life?"' :
                                    cycleInfo.phase === 'ovulation' ? '"Where am I shining brightest right now?"' :
                                        '"What needs completing before my next renewal?"'}
                        </div>
                    </div>
                    <textarea className="input-field" placeholder="Write freely..." style={{ minHeight: 200, resize: 'vertical' }} />
                    <button className="btn btn-primary" style={{ marginTop: 12, width: '100%', justifyContent: 'center' }}>
                        💫 Save Entry (+15 XP)
                    </button>
                </div>
            )}

            {activeTab === 'rituals' && (
                <div className="dashboard-grid two-col">
                    {[
                        { emoji: '🌅', name: 'Morning Moon Check', desc: 'Check the moon phase and set an intention aligned with its energy', xp: 5, done: true },
                        { emoji: '🧘', name: 'Phase-Aligned Movement', desc: `Practice ${cycleInfo.movementMedicine[0]} — matched to your ${cycleInfo.phaseName} phase`, xp: 10, done: false },
                        { emoji: '🍵', name: 'Herbal Tea Ritual', desc: `Brew ${cycleInfo.herbs[0]} tea — your phase-specific herb`, xp: 5, done: false },
                        { emoji: '💎', name: 'Crystal Connection', desc: `Carry or meditate with ${cycleInfo.crystals[0]} today`, xp: 5, done: true },
                        { emoji: '📓', name: 'Evening Reflection', desc: 'Write 3 things you\'re grateful for in your cycle journal', xp: 10, done: false },
                        { emoji: '🌙', name: `${cycleInfo.soundFrequency}Hz Sound Bath`, desc: `Listen to ${cycleInfo.soundFrequency}Hz frequency for 5 minutes — your phase-specific healing tone`, xp: 10, done: false },
                    ].map((r, i) => (
                        <div key={i} className="glass-card" style={{ display: 'flex', gap: 14, alignItems: 'flex-start', opacity: r.done ? 0.6 : 1 }}>
                            <span style={{ fontSize: '1.6rem' }}>{r.emoji}</span>
                            <div style={{ flex: 1 }}>
                                <h4 style={{ color: '#fff', fontSize: '0.9rem', marginBottom: 4, textDecoration: r.done ? 'line-through' : 'none' }}>{r.name}</h4>
                                <p style={{ fontSize: '0.78rem', color: 'rgba(255,255,255,0.5)', marginBottom: 8 }}>{r.desc}</p>
                                <span className="pill pill-gold">+{r.xp} XP</span>
                            </div>
                            <div className={`toggle ${r.done ? 'active' : ''}`} />
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
