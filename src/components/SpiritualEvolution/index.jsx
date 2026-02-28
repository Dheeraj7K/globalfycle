import React, { useState, useEffect } from 'react';
import { useApp } from '../../App';
import { saveJournalEntry, getJournalEntries } from '../../firebase';

const FEED_ITEMS = [
    { id: 1, emoji: '🧘', title: 'Menstrual Phase Yoga', desc: 'Gentle yin poses to honor your body during menstruation. Hold each for 3-5 breaths.', category: 'Movement', height: 180 },
    { id: 2, emoji: '🌿', title: 'Raspberry Leaf Tea Ritual', desc: 'Ancient remedy for cycle balance. Steep fresh leaves, add honey, drink during follicular phase.', category: 'Herbal', height: 160 },
    { id: 3, emoji: '💎', title: 'Moonstone Meditation', desc: 'Place moonstone on your sacral chakra during the waxing moon to enhance receptivity and intuition.', category: 'Crystal', height: 200 },
    { id: 4, emoji: '🎨', title: 'Cycle Art Journaling', desc: 'Draw your inner landscape each phase. Menstrual = deep reds, Follicular = spring greens, Ovulation = golds, Luteal = purples.', category: 'Creative', height: 220 },
    { id: 5, emoji: '🌙', title: 'New Moon Intention Setting', desc: 'Write intentions during the New Moon. Your menstrual phase amplifies this manifestation power tenfold.', category: 'Ritual', height: 170 },
    { id: 6, emoji: '📖', title: 'Wild Power by Alexandra Pope', desc: 'The revolutionary guide to understanding your menstrual cycle as a source of creative, spiritual, and professional power.', category: 'Reading', height: 150 },
    { id: 7, emoji: '🍫', title: 'Cacao Ceremony for PMS', desc: 'Ceremonial cacao opens the heart chakra and releases feel-good chemicals. Perfect for the luteal phase.', category: 'Ritual', height: 190 },
    { id: 8, emoji: '⚡', title: 'Ovulation Power Moves', desc: 'Schedule your biggest presentations, asks, and creative launches during your ovulation phase. Your magnetism peaks here.', category: 'Career', height: 160 },
    { id: 9, emoji: '🌊', title: 'Womb Breathing Practice', desc: 'Deep belly breathing that connects you to your womb space. 4 counts in, 7 hold, 8 out. Repeat 4 times.', category: 'Breathwork', height: 140 },
    { id: 10, emoji: '🔮', title: 'Tarot for Each Phase', desc: 'Menstrual: The High Priestess. Follicular: The Empress. Ovulation: The Sun. Luteal: The Moon.', category: 'Divination', height: 180 },
    { id: 11, emoji: '🌺', title: 'Sacred Flower Bath', desc: 'Rose petals + lavender + salt bath during menstruation. Transform pain into a ritual of self-love.', category: 'Ritual', height: 200 },
    { id: 12, emoji: '🧬', title: 'Epigenetic Cycle Memory', desc: 'Your cycle patterns carry ancestral wisdom. Track consistently to discover your personal patterns.', category: 'Science', height: 170 },
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
    const { cycleInfo, user } = useApp();
    const [activeTab, setActiveTab] = useState('feed');
    const [completedRituals, setCompletedRituals] = useState([]);

    // Journal state
    const [journalText, setJournalText] = useState('');
    const [journalMood, setJournalMood] = useState(null);
    const [journalPublic, setJournalPublic] = useState(false);
    const [journalEntries, setJournalEntries] = useState([]);
    const [journalSaving, setJournalSaving] = useState(false);
    const [journalSaved, setJournalSaved] = useState(false);

    // Custom rituals state
    const [customRituals, setCustomRituals] = useState(() => {
        try { return JSON.parse(localStorage.getItem('fycle_custom_rituals') || '[]'); }
        catch { return []; }
    });
    const [showAddRitual, setShowAddRitual] = useState(false);
    const [newRitual, setNewRitual] = useState({ emoji: '🕯️', name: '', desc: '', xp: 10 });

    // Persist custom rituals
    useEffect(() => {
        localStorage.setItem('fycle_custom_rituals', JSON.stringify(customRituals));
    }, [customRituals]);

    const saveCustomRitual = () => {
        if (!newRitual.name.trim()) return;
        const ritual = {
            ...newRitual,
            id: Date.now(),
            isCustom: true,
            desc: newRitual.desc || `Your custom ritual: ${newRitual.name}`,
        };
        setCustomRituals(prev => [...prev, ritual]);
        setNewRitual({ emoji: '🕯️', name: '', desc: '', xp: 10 });
        setShowAddRitual(false);
    };

    const deleteCustomRitual = (id) => {
        setCustomRituals(prev => prev.filter(r => r.id !== id));
        setCompletedRituals(prev => prev.filter(r => r.id !== id));
    };

    // Load journal entries
    useEffect(() => {
        if (user?.uid) {
            getJournalEntries(user.uid, 30).then(entries => {
                setJournalEntries(entries);
            }).catch(err => console.warn('Failed to load journal:', err));
        }
    }, [user?.uid]);

    const handleSaveJournal = async () => {
        if (!journalText.trim() || !user?.uid) return;
        setJournalSaving(true);
        try {
            const entry = {
                text: journalText,
                mood: journalMood,
                phase: cycleInfo.phaseName,
                phaseEmoji: cycleInfo.phaseEmoji,
                cycleDay: cycleInfo.dayOfCycle,
                isPublic: journalPublic,
                cosmicName: user.name,
                date: new Date().toISOString().split('T')[0],
            };
            await saveJournalEntry(user.uid, entry);
            setJournalEntries(prev => [{ ...entry, id: Date.now().toString() }, ...prev]);
            setJournalText('');
            setJournalMood(null);
            setJournalSaved(true);
            setTimeout(() => setJournalSaved(false), 3000);
        } catch (err) {
            console.warn('Failed to save journal entry:', err);
        } finally {
            setJournalSaving(false);
        }
    };

    // XP is derived from completed rituals + journal entries
    const currentXP = completedRituals.reduce((sum, r) => sum + r.xp, 0) + (journalEntries.length * 15);
    // Find the highest level the user qualifies for (iterate backward)
    let currentLevel = LEVELS[0];
    for (let i = LEVELS.length - 1; i >= 0; i--) {
        if (currentXP >= LEVELS[i].xp) { currentLevel = LEVELS[i]; break; }
    }
    const nextLevel = LEVELS[LEVELS.indexOf(currentLevel) + 1] || LEVELS[LEVELS.length - 1];
    const progress = nextLevel.xp > currentLevel.xp ? ((currentXP - currentLevel.xp) / (nextLevel.xp - currentLevel.xp)) * 100 : 100;

    const toggleRitual = (ritual) => {
        setCompletedRituals(prev => {
            const exists = prev.find(r => r.name === ritual.name);
            if (exists) return prev.filter(r => r.name !== ritual.name);
            return [...prev, ritual];
        });
    };

    const dailyRituals = [
        { emoji: '🌅', name: 'Morning Moon Check', desc: 'Check the moon phase and set an intention aligned with its energy', xp: 5 },
        { emoji: '🧘', name: 'Phase-Aligned Movement', desc: `Practice ${cycleInfo.movementMedicine[0]} — matched to your ${cycleInfo.phaseName} phase`, xp: 10 },
        { emoji: '🍵', name: 'Herbal Tea Ritual', desc: `Brew ${cycleInfo.herbs[0]} tea — your phase-specific herb`, xp: 5 },
        { emoji: '💎', name: 'Crystal Connection', desc: `Carry or meditate with ${cycleInfo.crystals[0]} today`, xp: 5 },
        { emoji: '📓', name: 'Evening Reflection', desc: 'Write 3 things you\'re grateful for in your cycle journal', xp: 10 },
        { emoji: '🌙', name: `${cycleInfo.soundFrequency}Hz Sound Bath`, desc: `Listen to ${cycleInfo.soundFrequency}Hz frequency for 5 minutes — your phase-specific healing tone`, xp: 10 },
    ];

    const MOOD_OPTIONS = [
        { id: 'peaceful', emoji: '😌', label: 'Peaceful' },
        { id: 'joyful', emoji: '😊', label: 'Joyful' },
        { id: 'reflective', emoji: '🤔', label: 'Reflective' },
        { id: 'empowered', emoji: '💪', label: 'Empowered' },
        { id: 'tender', emoji: '🥺', label: 'Tender' },
        { id: 'creative', emoji: '🎨', label: 'Creative' },
        { id: 'restless', emoji: '😤', label: 'Restless' },
        { id: 'grateful', emoji: '🙏', label: 'Grateful' },
    ];

    const journalPrompt = cycleInfo.phase === 'menstrual' ? '"What am I ready to release?"'
        : cycleInfo.phase === 'follicular' ? '"What new seeds am I planting in my life?"'
            : cycleInfo.phase === 'ovulation' ? '"Where am I shining brightest right now?"'
                : '"What needs completing before my next renewal?"';

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
                    {currentXP === 0 && (
                        <div style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.35)', marginTop: 6 }}>
                            Complete daily rituals and write journal entries to earn XP ✨
                        </div>
                    )}
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
                <div style={{ maxWidth: 650 }}>
                    {/* Write Entry */}
                    <div className="glass-card" style={{ marginBottom: 20 }}>
                        <div className="section-header"><span className="section-icon">📓</span><h3>New Journal Entry</h3></div>
                        <p style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.5)', marginBottom: 12 }}>
                            Reflect on your {cycleInfo.phaseName} phase. What is your body telling you today?
                        </p>

                        {/* Phase prompt */}
                        <div style={{ marginBottom: 16, padding: 14, background: 'rgba(255,45,120,0.06)', borderRadius: 12, borderLeft: '3px solid #ff2d78' }}>
                            <div style={{ fontSize: '0.65rem', color: '#ff2d78', fontWeight: 600, marginBottom: 4 }}>JOURNAL PROMPT</div>
                            <div style={{ fontSize: '0.88rem', fontStyle: 'italic', color: 'rgba(255,255,255,0.7)' }}>{journalPrompt}</div>
                        </div>

                        {/* Mood selector */}
                        <div style={{ marginBottom: 12 }}>
                            <div style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.4)', marginBottom: 8, textTransform: 'uppercase', letterSpacing: 1 }}>How are you feeling?</div>
                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                                {MOOD_OPTIONS.map(m => (
                                    <button key={m.id}
                                        className={`pill ${journalMood === m.id ? 'pill-magenta' : ''}`}
                                        style={{ cursor: 'pointer', opacity: journalMood && journalMood !== m.id ? 0.4 : 1, transition: 'all 0.2s' }}
                                        onClick={() => setJournalMood(journalMood === m.id ? null : m.id)}
                                    >
                                        {m.emoji} {m.label}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Text area */}
                        <textarea
                            className="input-field"
                            placeholder="Write freely... your thoughts, feelings, dreams, and reflections."
                            style={{ minHeight: 180, resize: 'vertical' }}
                            value={journalText}
                            onChange={e => setJournalText(e.target.value)}
                        />

                        {/* Privacy toggle */}
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 12, padding: '10px 14px', background: 'rgba(255,255,255,0.03)', borderRadius: 12 }}>
                            <div>
                                <div style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.7)' }}>
                                    {journalPublic ? '🌍 Share with sisterhood' : '🔒 Private — only you can see'}
                                </div>
                                <div style={{ fontSize: '0.65rem', color: 'rgba(255,255,255,0.3)' }}>
                                    {journalPublic ? 'Others can read your entry (with your cosmic name)' : 'This stays in your personal journal only'}
                                </div>
                            </div>
                            <div
                                className={`toggle ${journalPublic ? 'active' : ''}`}
                                onClick={() => setJournalPublic(!journalPublic)}
                            />
                        </div>

                        {/* Save button */}
                        <button
                            className="btn btn-primary"
                            style={{ marginTop: 14, width: '100%', justifyContent: 'center', opacity: journalText.trim() ? 1 : 0.5 }}
                            onClick={handleSaveJournal}
                            disabled={!journalText.trim() || journalSaving}
                        >
                            {journalSaving ? '✨ Saving...' : journalSaved ? '✓ Saved! +15 XP' : '💫 Save Entry (+15 XP)'}
                        </button>
                    </div>

                    {/* Past Entries */}
                    {journalEntries.length > 0 && (
                        <div className="glass-card">
                            <div className="section-header"><span className="section-icon">📖</span><h3>Past Entries ({journalEntries.length})</h3></div>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                                {journalEntries.map(entry => (
                                    <div key={entry.id} style={{ padding: 14, background: 'rgba(255,255,255,0.03)', borderRadius: 12, borderLeft: '3px solid rgba(168,85,247,0.4)' }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                                            <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
                                                <span style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.5)' }}>
                                                    {entry.date || (entry.createdAt?.toDate ? entry.createdAt.toDate().toLocaleDateString() : 'Recently')}
                                                </span>
                                                <span className="pill pill-purple" style={{ fontSize: '0.6rem', padding: '2px 8px' }}>{entry.phaseEmoji} {entry.phase}</span>
                                                {entry.mood && <span style={{ fontSize: '0.8rem' }}>{MOOD_OPTIONS.find(m => m.id === entry.mood)?.emoji || ''}</span>}
                                            </div>
                                            <span style={{ fontSize: '0.6rem', color: 'rgba(255,255,255,0.25)' }}>
                                                {entry.isPublic ? '🌍 Public' : '🔒 Private'} • Day {entry.cycleDay}
                                            </span>
                                        </div>
                                        <div style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.7)', lineHeight: 1.6, whiteSpace: 'pre-wrap' }}>
                                            {entry.text}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {journalEntries.length === 0 && (
                        <div className="glass-card" style={{ textAlign: 'center', padding: 30 }}>
                            <div style={{ fontSize: '2rem', marginBottom: 8 }}>📓</div>
                            <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.85rem' }}>Your journal is empty. Write your first entry above!</div>
                            <div style={{ color: 'rgba(255,255,255,0.3)', fontSize: '0.7rem', marginTop: 4 }}>Each entry earns you 15 XP towards your spiritual evolution</div>
                        </div>
                    )}
                </div>
            )}

            {activeTab === 'rituals' && (
                <div>
                    <div className="dashboard-grid two-col">
                        {[...dailyRituals, ...customRituals].map((r, i) => {
                            const done = completedRituals.some(cr => cr.name === r.name);
                            const isCustom = r.isCustom;
                            return (
                                <div key={i} className="glass-card" style={{ display: 'flex', gap: 14, alignItems: 'flex-start', opacity: done ? 0.6 : 1, cursor: 'pointer', position: 'relative' }}
                                    onClick={() => toggleRitual(r)}>
                                    <span style={{ fontSize: '1.6rem' }}>{r.emoji}</span>
                                    <div style={{ flex: 1 }}>
                                        <h4 style={{ color: '#fff', fontSize: '0.9rem', marginBottom: 4, textDecoration: done ? 'line-through' : 'none' }}>
                                            {r.name}
                                            {isCustom && <span style={{ fontSize: '0.6rem', color: '#a855f7', marginLeft: 6 }}>✦ Custom</span>}
                                        </h4>
                                        <p style={{ fontSize: '0.78rem', color: 'rgba(255,255,255,0.5)', marginBottom: 8 }}>{r.desc}</p>
                                        <span className="pill pill-gold">+{r.xp} XP</span>
                                    </div>
                                    <div className={`toggle ${done ? 'active' : ''}`} />
                                    {isCustom && (
                                        <button onClick={(e) => { e.stopPropagation(); deleteCustomRitual(r.id); }}
                                            style={{
                                                position: 'absolute', top: 8, right: 8,
                                                background: 'rgba(255,68,68,0.6)', border: 'none', borderRadius: '50%',
                                                width: 18, height: 18, fontSize: '0.55rem', color: '#fff',
                                                cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
                                                opacity: 0.4, transition: 'opacity 0.2s',
                                            }}
                                            onMouseEnter={e => e.target.style.opacity = 1}
                                            onMouseLeave={e => e.target.style.opacity = 0.4}
                                            title="Delete custom ritual">✕</button>
                                    )}
                                </div>
                            );
                        })}

                        {/* Add Custom Ritual Card */}
                        {!showAddRitual ? (
                            <div className="glass-card" onClick={() => setShowAddRitual(true)}
                                style={{
                                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
                                    cursor: 'pointer', border: '2px dashed rgba(168,85,247,0.3)',
                                    minHeight: 100, transition: 'all 0.2s',
                                }}
                                onMouseEnter={e => e.currentTarget.style.borderColor = '#a855f7'}
                                onMouseLeave={e => e.currentTarget.style.borderColor = 'rgba(168,85,247,0.3)'}>
                                <span style={{ fontSize: '1.5rem' }}>➕</span>
                                <div>
                                    <div style={{ color: '#a855f7', fontWeight: 600, fontSize: '0.9rem' }}>Add Custom Ritual</div>
                                    <div style={{ color: 'rgba(255,255,255,0.35)', fontSize: '0.75rem' }}>Create your own daily practice</div>
                                </div>
                            </div>
                        ) : (
                            <div className="glass-card" style={{ borderLeft: '3px solid #a855f7' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                                    <h4 style={{ color: '#a855f7', fontSize: '0.9rem' }}>✨ New Custom Ritual</h4>
                                    <button onClick={() => setShowAddRitual(false)} style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.3)', cursor: 'pointer', fontSize: '1rem' }}>✕</button>
                                </div>
                                {/* Emoji picker */}
                                <div style={{ marginBottom: 10 }}>
                                    <div style={{ fontSize: '0.65rem', color: 'rgba(255,255,255,0.4)', marginBottom: 6, textTransform: 'uppercase', letterSpacing: 1 }}>Choose an emoji</div>
                                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
                                        {['🕯️', '🧘', '🌿', '💎', '🌙', '📿', '🎶', '🌊', '🔥', '🪷', '🦋', '☕', '🫧', '💐', '🧿', '✍️'].map(e => (
                                            <button key={e} onClick={() => setNewRitual(prev => ({ ...prev, emoji: e }))}
                                                style={{
                                                    fontSize: '1.2rem', padding: '6px 8px', borderRadius: 8, cursor: 'pointer',
                                                    background: newRitual.emoji === e ? 'rgba(168,85,247,0.2)' : 'rgba(255,255,255,0.03)',
                                                    border: newRitual.emoji === e ? '2px solid #a855f7' : '2px solid transparent',
                                                }}>{e}</button>
                                        ))}
                                    </div>
                                </div>
                                {/* Name */}
                                <input type="text" placeholder="Ritual name (e.g., Evening Meditation)"
                                    value={newRitual.name} onChange={e => setNewRitual(prev => ({ ...prev, name: e.target.value }))}
                                    maxLength={50}
                                    style={{
                                        width: '100%', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)',
                                        borderRadius: 10, color: '#fff', padding: '10px 14px', fontSize: '0.85rem',
                                        marginBottom: 8, fontFamily: 'inherit', outline: 'none',
                                    }} />
                                {/* Description */}
                                <textarea placeholder="What does this ritual involve?"
                                    value={newRitual.desc} onChange={e => setNewRitual(prev => ({ ...prev, desc: e.target.value }))}
                                    maxLength={200}
                                    style={{
                                        width: '100%', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)',
                                        borderRadius: 10, color: '#fff', padding: '10px 14px', fontSize: '0.8rem',
                                        marginBottom: 8, fontFamily: 'inherit', resize: 'none', minHeight: 60, outline: 'none',
                                    }} />
                                {/* XP selector */}
                                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
                                    <span style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.5)' }}>XP reward:</span>
                                    {[5, 10, 15, 20].map(xp => (
                                        <button key={xp} onClick={() => setNewRitual(prev => ({ ...prev, xp }))}
                                            style={{
                                                padding: '4px 10px', borderRadius: 8, fontSize: '0.75rem', fontWeight: 600,
                                                cursor: 'pointer', border: 'none',
                                                background: newRitual.xp === xp ? '#ffd700' : 'rgba(255,255,255,0.06)',
                                                color: newRitual.xp === xp ? '#000' : 'rgba(255,255,255,0.4)',
                                            }}>+{xp}</button>
                                    ))}
                                </div>
                                {/* Save */}
                                <button onClick={saveCustomRitual} disabled={!newRitual.name.trim()}
                                    style={{
                                        width: '100%', padding: '10px 16px', border: 'none', borderRadius: 10,
                                        background: newRitual.name.trim() ? 'linear-gradient(135deg, #a855f7, #ff2d78)' : 'rgba(255,255,255,0.06)',
                                        color: newRitual.name.trim() ? '#fff' : 'rgba(255,255,255,0.3)',
                                        fontWeight: 600, fontSize: '0.85rem', cursor: newRitual.name.trim() ? 'pointer' : 'default',
                                    }}>
                                    ✨ Add Ritual
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
