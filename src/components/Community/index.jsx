import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../../App';
import LiveChat from './LiveChat';

// ─── Seeded random for stable community data ───
function seededRandom(seed) {
    let s = seed;
    return () => { s = (s * 16807 + 0) % 2147483647; return s / 2147483647; };
}

const COMMUNITIES = [
    {
        id: 'moon-circle',
        name: '🌙 Moon Circle',
        desc: 'Align your life with lunar rhythms. Share your moon phase experiences, track how the moon affects your cycle, and join monthly Full Moon & New Moon rituals.',
        color: '#ffd700',
        members: 1247,
        tags: ['lunar', 'rituals', 'menstrual'],
        icon: '🌙',
    },
    {
        id: 'cycle-wellness',
        name: '🧘 Cycle Wellness',
        desc: 'Movement, nutrition, and self-care tailored to each phase. Exchange yoga routines, recipes, and healing practices that honor your cycle.',
        color: '#00f5d4',
        members: 982,
        tags: ['yoga', 'nutrition', 'self-care'],
        icon: '🧘',
    },
    {
        id: 'cosmic-sisters',
        name: '✨ Cosmic Sisters',
        desc: 'Explore astrology, birth charts, and cosmic timing. Discuss how retrogrades, eclipses, and planetary transits impact your body and life.',
        color: '#a855f7',
        members: 763,
        tags: ['astrology', 'zodiac', 'transits'],
        icon: '✨',
    },
    {
        id: 'first-period',
        name: '🌸 First Period Support',
        desc: 'A safe, nurturing space for those new to menstruation. Ask questions, share experiences, and find guidance from supportive cycle sisters.',
        color: '#ff5c9e',
        members: 2104,
        tags: ['support', 'education', 'teens'],
        icon: '🌸',
    },
    {
        id: 'global-sync',
        name: '🌍 Global Sync',
        desc: 'Connect with women worldwide who share your cycle timing. Find your cycle twins, discuss the science of menstrual synchrony, and feel the invisible web.',
        color: '#4da6ff',
        members: 1589,
        tags: ['sync', 'community', 'science'],
        icon: '🌍',
    },
];

// Generate stable fake discussion posts per community
function generatePosts(communityId, userCosmicName) {
    const rng = seededRandom(communityId.length * 7919 + new Date().getDate());
    const names = [
        'Luna Starweaver', 'Celeste Moonfire', 'Aria Dreamwalker', 'Nova Spiritwind',
        'Sage Wildbloom', 'Ember Crystalveil', 'Ivy Nightglow', 'Rose Sunshard',
        'Willow Stardust', 'Coral Moonwhisper', 'Fern Lightsong', 'Pearl Cosmicray',
    ];
    const dayAgo = (h) => h < 1 ? 'just now' : h < 24 ? `${Math.floor(h)}h ago` : `${Math.floor(h / 24)}d ago`;

    const postTemplates = {
        'moon-circle': [
            { text: 'Full Moon tonight was incredible! My cramps actually lessened during meditation 🌕', likes: 42, replies: 8 },
            { text: 'Does anyone else feel more emotional during Waning Gibbous? I had the most vivid dreams last night', likes: 31, replies: 12 },
            { text: 'New Moon intention setting ritual worked beautifully. Sharing my crystal grid setup ✨', likes: 56, replies: 15 },
            { text: "My period started on the Full Moon again! 3rd month in a row. So connected 🌙", likes: 89, replies: 23 },
        ],
        'cycle-wellness': [
            { text: 'Sharing my luteal phase smoothie recipe: banana, cacao, magnesium powder, almond milk 🍫', likes: 67, replies: 19 },
            { text: 'Gentle yoga flow for menstrual phase — this 15 min routine saved my day', likes: 54, replies: 11 },
            { text: 'Iron-rich foods that actually taste good during your period? My list inside 🥬', likes: 73, replies: 24 },
            { text: 'Follicular phase energy is REAL. Just ran my first 10k!! 🏃‍♀️', likes: 91, replies: 16 },
        ],
        'cosmic-sisters': [
            { text: 'Mercury retrograde starting soon — how do you prepare your cycle tracking during Rx?', likes: 38, replies: 21 },
            { text: 'Any other Pisces Suns feeling this planetary parade energy? Literally buzzing ♓', likes: 45, replies: 18 },
            { text: 'Birth chart reading: Moon in Cancer = the most intuitive cycles. Who else? 🦀', likes: 52, replies: 14 },
            { text: 'Saturn return hit different when you track your cycles. Everything clicked into place 🪐', likes: 34, replies: 9 },
        ],
        'first-period': [
            { text: "Just got my first period and I'm scared. Is it normal to feel dizzy? 💗", likes: 127, replies: 43 },
            { text: 'My daughter started today. What products do you recommend for beginners?', likes: 89, replies: 38 },
            { text: "Period survival kit for school: here's what I keep in my bag 🎒", likes: 156, replies: 29 },
            { text: 'Reminder: your cycle is a SUPERPOWER, not a weakness. Welcome to the sisterhood 🌸', likes: 234, replies: 51 },
        ],
        'global-sync': [
            { text: "Found my cycle twin from Brazil! We're on the exact same day. Mind = blown 🇧🇷", likes: 78, replies: 22 },
            { text: 'The McClintock effect might be debated but I literally synced with my roommate in 2 months', likes: 45, replies: 31 },
            { text: '1,200 women in the same menstrual phase right now. We are powerful together 🌍', likes: 112, replies: 18 },
            { text: "Anyone in Mumbai area want to start a local sync circle? Let's meet! 🇮🇳", likes: 34, replies: 15 },
        ],
    };

    return (postTemplates[communityId] || []).map((post, i) => ({
        ...post,
        id: `${communityId}-${i}`,
        author: names[Math.floor(rng() * names.length)],
        timeAgo: dayAgo(rng() * 72),
    }));
}

export default function Community() {
    const [activeTab, setActiveTab] = useState('groups');
    const { user, cycleInfo } = useApp();
    const [joinedGroups, setJoinedGroups] = useState(() => {
        try { return JSON.parse(localStorage.getItem('fycle_joined_groups') || '[]'); }
        catch { return []; }
    });
    const [selectedGroup, setSelectedGroup] = useState(null);
    const [newMessage, setNewMessage] = useState('');
    const [localMessages, setLocalMessages] = useState({});

    // Persist joins
    useEffect(() => {
        localStorage.setItem('fycle_joined_groups', JSON.stringify(joinedGroups));
    }, [joinedGroups]);

    const toggleJoin = (id) => {
        setJoinedGroups(prev => prev.includes(id) ? prev.filter(g => g !== id) : [...prev, id]);
    };

    const sendMessage = (groupId) => {
        if (!newMessage.trim()) return;
        const msg = {
            id: Date.now(),
            author: user?.name || 'Cosmic Soul',
            text: newMessage.trim(),
            timeAgo: 'just now',
            likes: 0,
            replies: 0,
            isOwn: true,
        };
        setLocalMessages(prev => ({
            ...prev,
            [groupId]: [...(prev[groupId] || []), msg],
        }));
        setNewMessage('');
    };

    return (
        <div className="animate-fadeIn">
            <div className="section-title">Community</div>
            <div className="section-subtitle">Connect with your cosmic sisters — {joinedGroups.length} group{joinedGroups.length !== 1 ? 's' : ''} joined</div>

            <div className="tabs">
                {['groups', 'chat', 'create'].map(t => (
                    <button key={t} className={`tab ${activeTab === t ? 'active' : ''}`} onClick={() => setActiveTab(t)}>
                        {t === 'groups' ? '👯 Communities' : t === 'chat' ? '💬 Live Chat' : '➕ Create Group'}
                    </button>
                ))}
            </div>

            {activeTab === 'groups' && !selectedGroup && (
                <div className="dashboard-grid two-col">
                    {COMMUNITIES.map(group => {
                        const isJoined = joinedGroups.includes(group.id);
                        return (
                            <div key={group.id} className="glass-card" style={{ borderLeft: `3px solid ${group.color}`, cursor: 'pointer' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                    <div onClick={() => { if (isJoined) setSelectedGroup(group.id); }}>
                                        <div style={{ fontSize: '1.5rem', marginBottom: 6 }}>{group.icon}</div>
                                        <h3 style={{ color: '#fff', fontSize: '1rem', marginBottom: 4 }}>{group.name}</h3>
                                        <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.8rem', lineHeight: 1.5, marginBottom: 10 }}>
                                            {group.desc}
                                        </p>
                                    </div>
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <div style={{ display: 'flex', gap: 6 }}>
                                        {group.tags.map(tag => (
                                            <span key={tag} className="pill pill-purple" style={{ fontSize: '0.65rem', opacity: 0.6 }}>{tag}</span>
                                        ))}
                                    </div>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                                        <span style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.3)' }}>
                                            {(group.members + (isJoined ? 1 : 0)).toLocaleString()} members
                                        </span>
                                        <button className="btn btn-sm" onClick={(e) => { e.stopPropagation(); toggleJoin(group.id); }}
                                            style={{
                                                background: isJoined ? 'rgba(255,255,255,0.08)' : group.color,
                                                color: isJoined ? 'rgba(255,255,255,0.6)' : '#000',
                                                border: 'none', borderRadius: 8, padding: '6px 14px',
                                                fontWeight: 600, fontSize: '0.75rem', cursor: 'pointer',
                                            }}>
                                            {isJoined ? '✓ Joined' : 'Join'}
                                        </button>
                                    </div>
                                </div>
                                {isJoined && (
                                    <div style={{ marginTop: 10, paddingTop: 10, borderTop: '1px solid rgba(255,255,255,0.06)', cursor: 'pointer' }}
                                        onClick={() => setSelectedGroup(group.id)}>
                                        <div style={{ fontSize: '0.75rem', color: group.color }}>View discussions →</div>
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            )}

            {/* Selected Group Discussion View */}
            {activeTab === 'groups' && selectedGroup && (() => {
                const group = COMMUNITIES.find(g => g.id === selectedGroup);
                if (!group) return null;
                const posts = [...generatePosts(group.id, user?.name), ...(localMessages[group.id] || [])];
                return (
                    <div>
                        <button className="btn btn-ghost btn-sm" onClick={() => setSelectedGroup(null)}
                            style={{ marginBottom: 16, fontSize: '0.8rem' }}>← Back to Communities</button>

                        <div className="glass-card" style={{ borderLeft: `3px solid ${group.color}`, marginBottom: 16 }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <div>
                                    <h3 style={{ color: '#fff' }}>{group.name}</h3>
                                    <div style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.4)' }}>
                                        {(group.members + 1).toLocaleString()} members • {posts.length} discussions
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Post input */}
                        <div className="glass-card" style={{ marginBottom: 16, padding: 12 }}>
                            <div style={{ display: 'flex', gap: 10, alignItems: 'flex-end' }}>
                                <div style={{ flex: 1 }}>
                                    <textarea placeholder={`Share with ${group.name}...`}
                                        value={newMessage} onChange={e => setNewMessage(e.target.value)}
                                        onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(group.id); } }}
                                        style={{
                                            width: '100%', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)',
                                            borderRadius: 10, color: '#fff', padding: '10px 14px', fontSize: '0.85rem',
                                            resize: 'none', minHeight: 44, fontFamily: 'inherit',
                                        }} />
                                </div>
                                <button className="btn btn-sm" onClick={() => sendMessage(group.id)}
                                    style={{
                                        background: group.color, color: '#000', border: 'none', borderRadius: 8,
                                        padding: '10px 16px', fontWeight: 600, cursor: 'pointer',
                                    }}>Send</button>
                            </div>
                        </div>

                        {/* Posts */}
                        {posts.reverse().map(post => (
                            <div key={post.id} className="glass-card" style={{ marginBottom: 8, padding: '12px 16px' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                                    <span style={{ fontSize: '0.8rem', color: post.isOwn ? group.color : '#ffd700', fontWeight: 600 }}>
                                        {post.author} {post.isOwn && '(you)'}
                                    </span>
                                    <span style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.3)' }}>{post.timeAgo}</span>
                                </div>
                                <p style={{ color: 'rgba(255,255,255,0.75)', fontSize: '0.85rem', lineHeight: 1.5, margin: 0 }}>{post.text}</p>
                                <div style={{ display: 'flex', gap: 16, marginTop: 8 }}>
                                    <span style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.3)', cursor: 'pointer' }}>❤️ {post.likes}</span>
                                    <span style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.3)', cursor: 'pointer' }}>💬 {post.replies}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                );
            })()}

            {activeTab === 'chat' && <LiveChat />}

            {activeTab === 'create' && (
                <div className="glass-card" style={{ textAlign: 'center', padding: 48 }}>
                    <div style={{ fontSize: '3rem', marginBottom: 16 }}>✨</div>
                    <h3 style={{ color: '#fff', marginBottom: 8 }}>Create Groups — Coming Soon</h3>
                    <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.85rem', maxWidth: 400, margin: '0 auto', lineHeight: 1.6 }}>
                        Start your own community around shared interests, cycle patterns, or cosmic connections.
                        Available when community membership reaches 500 users.
                    </p>
                </div>
            )}
        </div>
    );
}
