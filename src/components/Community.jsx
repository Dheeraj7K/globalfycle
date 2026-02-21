import React, { useState } from 'react';
import { useApp } from '../App';

const COMMUNITIES = [
    { id: 1, emoji: '🌙', name: 'New Moon Bleeders', desc: 'For women whose periods align with the New Moon — the ancient White Moon Cycle.', members: 4289, category: 'sync' },
    { id: 2, emoji: '🌕', name: 'Full Moon Ovulators', desc: 'Peak ovulation during Full Moon. The most fertile cosmic alignment.', members: 3712, category: 'sync' },
    { id: 3, emoji: '🔥', name: 'Fire Signs Collective', desc: 'Aries, Leo, Sagittarius — tracking how fire element shapes our cycles.', members: 5641, category: 'zodiac' },
    { id: 4, emoji: '💧', name: 'Water Signs Circle', desc: 'Cancer, Scorpio, Pisces — the most intuitive cycle trackers.', members: 6103, category: 'zodiac' },
    { id: 5, emoji: '🍃', name: 'Herbal Healing Hub', desc: 'Natural remedies, herbs, and traditional medicine for cycle health.', members: 8952, category: 'wellness' },
    { id: 6, emoji: '🧘', name: 'Cycle Yoga Flow', desc: 'Phase-specific yoga sequences. Move with your body, not against it.', members: 7234, category: 'wellness' },
    { id: 7, emoji: '🌍', name: 'Global Sync Sisters', desc: 'Cross-continent connections. Finding your cycle twins worldwide.', members: 12456, category: 'global' },
    { id: 8, emoji: '✊', name: 'Period Activism', desc: 'Fighting period poverty, stigma, and advocating for menstrual equity.', members: 9871, category: 'activism' },
    { id: 9, emoji: '👩‍🔬', name: 'FemTech Pioneers', desc: 'Technology, science, and innovation in women\'s health.', members: 3891, category: 'tech' },
    { id: 10, emoji: '🔮', name: 'Cosmic Consciousness', desc: 'Exploring the noosphere, collective awareness, and spiritual evolution.', members: 5432, category: 'spiritual' },
    { id: 11, emoji: '🎨', name: 'Creative Cycles', desc: 'Art, writing, music inspired by menstrual phases and moon energy.', members: 4567, category: 'creative' },
    { id: 12, emoji: '💪', name: 'Cycle Athletes', desc: 'Optimizing athletic performance by training with your cycle.', members: 6789, category: 'fitness' },
];

const CHAT_MESSAGES = [
    { name: 'Luna', avatar: '🌙', msg: 'Just realized my period started on the exact same day as 3 other women in this group! The sync is real 🤯', time: '2m ago' },
    { name: 'Aurora', avatar: '✨', msg: 'The Full Moon meditation last night was incredible. My cramps actually reduced. Anyone else?', time: '5m ago' },
    { name: 'Sage', avatar: '🌿', msg: 'Raspberry leaf tea during menstrual phase is a game changer. My flow is so much more manageable now.', time: '12m ago' },
    { name: 'Priya', avatar: '🪷', msg: 'Day 14 and feeling absolutely unstoppable! Ovulation energy is my favorite superhero power 💫', time: '18m ago' },
    { name: 'Willow', avatar: '🌳', msg: 'Looking at the Global Map right now — there are women in São Paulo AND Lagos on the same day as me. This connection is beautiful.', time: '25m ago' },
    { name: 'Nadia', avatar: '⭐', msg: 'Mercury retrograde + luteal phase = maximum introspection mode. Journal game is strong this week 📓', time: '31m ago' },
];

export default function Community() {
    const [activeTab, setActiveTab] = useState('groups');
    const [selectedGroup, setSelectedGroup] = useState(null);
    const [chatInput, setChatInput] = useState('');
    const [chatMsgs, setChatMsgs] = useState(CHAT_MESSAGES);

    const handleSendChat = () => {
        if (!chatInput.trim()) return;
        setChatMsgs(prev => [{ name: 'You', avatar: '🌙', msg: chatInput, time: 'now' }, ...prev]);
        setChatInput('');
    };

    return (
        <div className="animate-fadeIn">
            <div className="section-title">Community</div>
            <div className="section-subtitle">Connect with your cosmic sisters — communities, chat, and shared wisdom</div>

            <div className="tabs">
                {['groups', 'chat', 'create'].map(t => (
                    <button key={t} className={`tab ${activeTab === t ? 'active' : ''}`} onClick={() => setActiveTab(t)}>
                        {t === 'groups' ? '👯 Communities' : t === 'chat' ? '💬 Live Chat' : '➕ Create Group'}
                    </button>
                ))}
            </div>

            {activeTab === 'groups' && (
                <div className="community-grid">
                    {COMMUNITIES.map(c => (
                        <div key={c.id} className="glass-card community-card" onClick={() => { setSelectedGroup(c); setActiveTab('chat'); }}>
                            <div className="community-emoji">{c.emoji}</div>
                            <h4>{c.name}</h4>
                            <p>{c.desc}</p>
                            <div className="members-count">👥 {c.members.toLocaleString()} members</div>
                        </div>
                    ))}
                </div>
            )}

            {activeTab === 'chat' && (
                <div>
                    {selectedGroup && (
                        <div className="glass-card" style={{ marginBottom: 16, display: 'flex', alignItems: 'center', gap: 12 }}>
                            <span style={{ fontSize: '1.5rem' }}>{selectedGroup.emoji}</span>
                            <div>
                                <h4 style={{ color: '#fff', fontSize: '0.95rem' }}>{selectedGroup.name}</h4>
                                <span style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.4)' }}>👥 {selectedGroup.members.toLocaleString()} members • 🟢 {Math.floor(selectedGroup.members * 0.03)} online</span>
                            </div>
                            <button className="btn btn-ghost btn-sm" style={{ marginLeft: 'auto' }} onClick={() => { setSelectedGroup(null); setActiveTab('groups'); }}>← Back</button>
                        </div>
                    )}
                    <div className="chat-room">
                        <div className="chat-messages">
                            {chatMsgs.map((m, i) => (
                                <div key={i} className="chat-msg">
                                    <div className="avatar">{m.avatar}</div>
                                    <div>
                                        <div className="msg-name">{m.name} <span style={{ color: 'rgba(255,255,255,0.3)', fontWeight: 400, fontSize: '0.6rem' }}>{m.time}</span></div>
                                        <div className="msg-body">{m.msg}</div>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div className="ai-input-bar">
                            <input value={chatInput} onChange={e => setChatInput(e.target.value)}
                                onKeyDown={e => e.key === 'Enter' && handleSendChat()}
                                placeholder="Share with your sisters..." />
                            <button onClick={handleSendChat}>→</button>
                        </div>
                    </div>
                </div>
            )}

            {activeTab === 'create' && (
                <div className="glass-card" style={{ maxWidth: 500 }}>
                    <div className="section-header"><span className="section-icon">✨</span><h3>Create a Community</h3></div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                        <input className="input-field" placeholder="Community Name" />
                        <textarea className="input-field" placeholder="Description — what connects your group?" style={{ minHeight: 80 }} />
                        <select className="input-field">
                            <option>Sync Pattern</option><option>Zodiac</option><option>Wellness</option><option>Spiritual</option><option>Activism</option><option>Creative</option>
                        </select>
                        <button className="btn btn-primary" style={{ justifyContent: 'center' }}>🌙 Create Community</button>
                    </div>
                </div>
            )}
        </div>
    );
}
