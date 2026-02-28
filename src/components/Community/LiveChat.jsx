import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../../App';
import { sendChatMessage, subscribeToChatRoom, deleteChatMessage } from '../../firebase';

const CHAT_ROOMS = [
    { id: 'general', name: '🌍 General', desc: 'Open chat for all sisters', color: '#00f5d4' },
    { id: 'moon-talk', name: '🌙 Moon Talk', desc: 'Lunar rhythms & rituals', color: '#ffd700' },
    { id: 'cycle-support', name: '💗 Cycle Support', desc: 'Questions, advice, comfort', color: '#ff5c9e' },
    { id: 'cosmic-vibes', name: '✨ Cosmic Vibes', desc: 'Astrology & spiritual chat', color: '#a855f7' },
    { id: 'wellness', name: '🧘 Wellness', desc: 'Nutrition, yoga, self-care', color: '#4da6ff' },
];

const PHASE_COLORS = {
    menstrual: '#ff2d78',
    follicular: '#00f5d4',
    ovulation: '#ffd700',
    luteal: '#a855f7',
};

function timeAgo(date) {
    const now = new Date();
    const diff = Math.floor((now - date) / 1000);
    if (diff < 60) return 'now';
    if (diff < 3600) return `${Math.floor(diff / 60)}m`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h`;
    return `${Math.floor(diff / 86400)}d`;
}

export default function LiveChat() {
    const { user, cycleInfo } = useApp();
    const [activeRoom, setActiveRoom] = useState('general');
    const [messages, setMessages] = useState([]);
    const [inputText, setInputText] = useState('');
    const [sending, setSending] = useState(false);
    const [showRooms, setShowRooms] = useState(false);
    const messagesEndRef = useRef(null);
    const inputRef = useRef(null);
    const [reactions, setReactions] = useState(() => {
        try { return JSON.parse(localStorage.getItem('fycle_chat_reactions') || '{}'); }
        catch { return {}; }
    });
    const [openReactionPicker, setOpenReactionPicker] = useState(null);

    const REACTION_EMOJIS = ['❤️', '🔥', '🌙', '✨', '🤗', '💪'];

    const toggleReaction = (msgId, emoji) => {
        setReactions(prev => {
            const msgReactions = { ...(prev[msgId] || {}) };
            if (msgReactions[emoji]) { delete msgReactions[emoji]; }
            else { msgReactions[emoji] = true; }
            const next = { ...prev, [msgId]: msgReactions };
            localStorage.setItem('fycle_chat_reactions', JSON.stringify(next));
            return next;
        });
        setOpenReactionPicker(null);
    };

    // Subscribe to real-time messages
    useEffect(() => {
        const unsubscribe = subscribeToChatRoom(activeRoom, (msgs) => {
            setMessages(msgs);
        });
        return () => unsubscribe();
    }, [activeRoom]);

    // Auto-scroll to bottom on new messages
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const handleSend = async () => {
        if (!inputText.trim() || sending || !user) return;
        setSending(true);
        try {
            await sendChatMessage(activeRoom, {
                uid: user.uid,
                cosmicName: user.name,
                text: inputText.trim(),
                cyclePhase: cycleInfo.phase,
            });
            setInputText('');
            inputRef.current?.focus();
        } catch (err) {
            console.error('Send failed:', err);
        }
        setSending(false);
    };

    const handleDelete = async (msgId) => {
        try {
            await deleteChatMessage(activeRoom, msgId);
        } catch (err) {
            console.error('Delete failed:', err);
        }
    };

    const currentRoom = CHAT_ROOMS.find(r => r.id === activeRoom);

    return (
        <div style={{ display: 'flex', flexDirection: 'column', height: 'calc(100vh - 220px)', minHeight: 400 }}>
            {/* Room selector bar */}
            <div style={{ display: 'flex', gap: 6, marginBottom: 12, overflowX: 'auto', paddingBottom: 4 }}>
                {CHAT_ROOMS.map(room => (
                    <button key={room.id} onClick={() => setActiveRoom(room.id)}
                        style={{
                            background: activeRoom === room.id ? room.color : 'rgba(255,255,255,0.04)',
                            color: activeRoom === room.id ? '#000' : 'rgba(255,255,255,0.5)',
                            border: 'none', borderRadius: 20, padding: '6px 14px',
                            fontSize: '0.75rem', fontWeight: 600, cursor: 'pointer',
                            whiteSpace: 'nowrap', transition: 'all 0.2s',
                            flexShrink: 0,
                        }}>
                        {room.name}
                    </button>
                ))}
            </div>

            {/* Chat header */}
            <div className="glass-card" style={{ padding: '10px 16px', marginBottom: 8, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                    <div style={{ color: currentRoom.color, fontWeight: 600, fontSize: '0.9rem' }}>{currentRoom.name}</div>
                    <div style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.35)' }}>
                        {currentRoom.desc} • {messages.length} messages
                    </div>
                </div>
                <div style={{ fontSize: '0.65rem', color: 'rgba(255,255,255,0.25)' }}>
                    You: <span style={{ color: '#ffd700' }}>{user?.name || 'Anonymous'}</span>
                </div>
            </div>

            {/* Messages area */}
            <div className="glass-card" style={{
                flex: 1, overflowY: 'auto', padding: '12px 16px',
                display: 'flex', flexDirection: 'column', gap: 6,
                marginBottom: 8,
            }}>
                {messages.length === 0 && (
                    <div style={{ textAlign: 'center', padding: 40, color: 'rgba(255,255,255,0.3)' }}>
                        <div style={{ fontSize: '2rem', marginBottom: 8 }}>💬</div>
                        <div style={{ fontSize: '0.85rem' }}>Be the first to say something in {currentRoom.name}!</div>
                        <div style={{ fontSize: '0.7rem', marginTop: 4 }}>Messages are visible to everyone in this room.</div>
                    </div>
                )}

                {messages.map(msg => {
                    const isOwn = msg.uid === user?.uid;
                    const phaseColor = PHASE_COLORS[msg.cyclePhase] || 'rgba(255,255,255,0.3)';
                    return (
                        <div key={msg.id} style={{
                            display: 'flex', flexDirection: 'column',
                            alignItems: isOwn ? 'flex-end' : 'flex-start',
                            maxWidth: '85%', alignSelf: isOwn ? 'flex-end' : 'flex-start',
                        }}>
                            {/* Sender name + phase dot */}
                            <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginBottom: 2, padding: '0 4px' }}>
                                <div style={{ width: 6, height: 6, borderRadius: '50%', background: phaseColor, flexShrink: 0 }} />
                                <span style={{ fontSize: '0.65rem', color: isOwn ? currentRoom.color : '#ffd700', fontWeight: 600 }}>
                                    {isOwn ? 'You' : msg.cosmicName}
                                </span>
                                <span style={{ fontSize: '0.6rem', color: 'rgba(255,255,255,0.2)' }}>
                                    {timeAgo(msg.createdAt)}
                                </span>
                            </div>
                            {/* Message bubble */}
                            <div style={{
                                background: isOwn ? `${currentRoom.color}18` : 'rgba(255,255,255,0.04)',
                                borderRadius: isOwn ? '14px 14px 4px 14px' : '14px 14px 14px 4px',
                                padding: '8px 14px',
                                border: isOwn ? `1px solid ${currentRoom.color}30` : '1px solid rgba(255,255,255,0.04)',
                                position: 'relative',
                            }}>
                                <div style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.8)', lineHeight: 1.5, wordBreak: 'break-word' }}>
                                    {msg.text}
                                </div>
                                {isOwn && (
                                    <button onClick={() => handleDelete(msg.id)}
                                        style={{
                                            position: 'absolute', top: -6, right: -6,
                                            background: 'rgba(255,68,68,0.8)', border: 'none', borderRadius: '50%',
                                            width: 16, height: 16, fontSize: '0.55rem', color: '#fff',
                                            cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
                                            opacity: 0.5, transition: 'opacity 0.2s',
                                        }}
                                        onMouseEnter={e => e.target.style.opacity = 1}
                                        onMouseLeave={e => e.target.style.opacity = 0.5}
                                        title="Delete message">✕</button>
                                )}
                            </div>
                            {/* Reactions row */}
                            <div style={{ display: 'flex', gap: 4, marginTop: 3, padding: '0 4px', alignItems: 'center', flexWrap: 'wrap' }}>
                                {Object.entries(reactions[msg.id] || {}).filter(([, v]) => v).map(([emoji]) => (
                                    <button key={emoji} onClick={() => toggleReaction(msg.id, emoji)}
                                        style={{
                                            background: 'rgba(168,85,247,0.15)', border: '1px solid rgba(168,85,247,0.3)',
                                            borderRadius: 16, padding: '1px 6px', cursor: 'pointer',
                                            fontSize: '0.7rem', display: 'flex', alignItems: 'center', gap: 2,
                                        }}>
                                        <span>{emoji}</span>
                                        <span style={{ color: '#a855f7', fontSize: '0.55rem', fontWeight: 600 }}>1</span>
                                    </button>
                                ))}
                                <div style={{ position: 'relative' }}>
                                    <button onClick={() => setOpenReactionPicker(openReactionPicker === msg.id ? null : msg.id)}
                                        style={{
                                            background: 'transparent', border: 'none',
                                            fontSize: '0.6rem', cursor: 'pointer',
                                            color: 'rgba(255,255,255,0.2)', padding: '2px 4px',
                                            transition: 'color 0.2s',
                                        }}
                                        onMouseEnter={e => e.currentTarget.style.color = 'rgba(255,255,255,0.5)'}
                                        onMouseLeave={e => e.currentTarget.style.color = 'rgba(255,255,255,0.2)'}>
                                        😊+
                                    </button>
                                    {openReactionPicker === msg.id && (
                                        <div style={{
                                            position: 'absolute', bottom: '100%',
                                            [isOwn ? 'right' : 'left']: 0, marginBottom: 4,
                                            background: 'rgba(20,10,30,0.95)', border: '1px solid rgba(168,85,247,0.3)',
                                            borderRadius: 12, padding: '4px 6px', display: 'flex', gap: 1,
                                            boxShadow: '0 6px 20px rgba(0,0,0,0.6)', zIndex: 10,
                                        }}>
                                            {REACTION_EMOJIS.map(emoji => (
                                                <button key={emoji} onClick={() => toggleReaction(msg.id, emoji)}
                                                    style={{
                                                        background: reactions[msg.id]?.[emoji] ? 'rgba(168,85,247,0.2)' : 'transparent',
                                                        border: 'none', borderRadius: 6, padding: '4px 5px',
                                                        fontSize: '1rem', cursor: 'pointer', transition: 'all 0.15s',
                                                    }}
                                                    onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.3)'}
                                                    onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}>
                                                    {emoji}
                                                </button>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    );
                })}
                <div ref={messagesEndRef} />
            </div>

            {/* Input area */}
            <div className="glass-card" style={{ padding: '8px 12px' }}>
                {!user ? (
                    <div style={{ textAlign: 'center', padding: 12, color: 'rgba(255,255,255,0.4)', fontSize: '0.85rem' }}>
                        Sign in to chat with your cosmic sisters
                    </div>
                ) : (
                    <div style={{ display: 'flex', gap: 8, alignItems: 'flex-end' }}>
                        {/* Phase indicator */}
                        <div style={{
                            width: 8, height: 8, borderRadius: '50%',
                            background: PHASE_COLORS[cycleInfo.phase] || '#888',
                            flexShrink: 0, marginBottom: 12,
                        }} title={`${cycleInfo.phaseName} phase`} />
                        {/* Text input */}
                        <div style={{ flex: 1 }}>
                            <textarea ref={inputRef}
                                placeholder={`Message ${currentRoom.name}...`}
                                value={inputText}
                                onChange={e => setInputText(e.target.value)}
                                onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(); } }}
                                maxLength={500}
                                style={{
                                    width: '100%', background: 'rgba(255,255,255,0.04)',
                                    border: '1px solid rgba(255,255,255,0.08)', borderRadius: 12,
                                    color: '#fff', padding: '10px 14px', fontSize: '0.85rem',
                                    resize: 'none', minHeight: 40, maxHeight: 100, fontFamily: 'inherit',
                                    outline: 'none', transition: 'border-color 0.2s',
                                }}
                                onFocus={e => e.target.style.borderColor = currentRoom.color + '60'}
                                onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.08)'}
                            />
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 4, padding: '0 4px' }}>
                                <span style={{ fontSize: '0.6rem', color: 'rgba(255,255,255,0.2)' }}>
                                    As {user.name} • {cycleInfo.phaseEmoji} {cycleInfo.phaseName}
                                </span>
                                <span style={{ fontSize: '0.6rem', color: inputText.length > 450 ? '#ff4444' : 'rgba(255,255,255,0.15)' }}>
                                    {inputText.length}/500
                                </span>
                            </div>
                        </div>
                        {/* Send button */}
                        <button onClick={handleSend} disabled={sending || !inputText.trim()}
                            style={{
                                background: inputText.trim() ? currentRoom.color : 'rgba(255,255,255,0.08)',
                                color: inputText.trim() ? '#000' : 'rgba(255,255,255,0.3)',
                                border: 'none', borderRadius: 12, padding: '10px 18px',
                                fontWeight: 700, fontSize: '0.8rem', cursor: inputText.trim() ? 'pointer' : 'default',
                                transition: 'all 0.2s', flexShrink: 0,
                                opacity: sending ? 0.5 : 1,
                            }}>
                            {sending ? '...' : '→'}
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}
