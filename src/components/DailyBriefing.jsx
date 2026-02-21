import React, { useState } from 'react';

// CoStar-style "Do / Don't" briefings based on cycle phase + cosmic data
const PHASE_BRIEFINGS = {
    menstrual: {
        energy: 'Low & Inward',
        doItems: [
            'Rest without guilt — your body is literally regenerating',
            'Journal by candlelight about what you\'re releasing',
            'Eat warm, iron-rich foods: dark chocolate, lentils, beets',
            'Take a bath with magnesium salt and rosemary',
        ],
        dontItems: [
            'Overcommit to social plans you\'ll want to cancel',
            'Start a new intense workout routine',
            'Make major life decisions from a place of depletion',
            'Ignore cravings — they\'re your body talking',
        ],
        cosmicAdvice: 'The moon of your cycle is dark. Like the New Moon, you hold infinite potential in stillness.',
        shareQuote: 'I am not withdrawing. I am recharging at a cosmic level. ✨',
    },
    follicular: {
        energy: 'Rising & Creative',
        doItems: [
            'Brain-dump every wild idea — your neuroplasticity is peaking',
            'Start the project you\'ve been putting off',
            'Try a new recipe, route, or routine',
            'Schedule important work meetings this week',
        ],
        dontItems: [
            'Stay in the same routine just because it\'s comfortable',
            'Dismiss your ideas as "too ambitious"',
            'Skip meals — your metabolism needs fuel for creation',
            'Waste this energy on things that drain you',
        ],
        cosmicAdvice: 'Estrogen is your springtime. Plant seeds now that your ovulation will bloom.',
        shareQuote: 'My follicular phase is my secret weapon. Everything I imagine now becomes real. 🌱',
    },
    ovulation: {
        energy: 'Peak & Magnetic',
        doItems: [
            'Have the hard conversation — your communication peaks today',
            'Network, present, pitch — you\'re literally magnetic right now',
            'Wear what makes you feel powerful',
            'Connect deeply — your empathy and charisma are maxed',
        ],
        dontItems: [
            'Hide from visibility — this is your time to be seen',
            'People-please at the cost of your own boundaries',
            'Ignore your body\'s signals about who/what feels right',
            'Compare yourself to anyone — you\'re in your full power',
        ],
        cosmicAdvice: 'You are the Full Moon. Your light illuminates everything it touches today.',
        shareQuote: 'I\'m ovulating and I\'m unstoppable. The universe arranged this. 🌕',
    },
    luteal: {
        energy: 'Focused & Discerning',
        doItems: [
            'Finish what you started — your detail-focus is razor sharp',
            'Meal prep and nest — honor the urge to organize',
            'Set boundaries clearly and without apology',
            'Practice breathwork or gentle yoga before bed',
        ],
        dontItems: [
            'Start new ambitious projects (finish existing ones instead)',
            'Take criticism personally — your sensitivity is heightened',
            'Skip magnesium-rich foods (dark leafy greens, nuts, seeds)',
            'Fight the nesting instinct — lean into comfort',
        ],
        cosmicAdvice: 'The Waning Moon mirrors your phase. Completion, not initiation.',
        shareQuote: 'My luteal phase is not PMS. It\'s my inner editor, completing masterpieces. 🌖',
    },
};

export default function DailyBriefing({ cycleInfo, moonData, zodiac, noosphere, onDismiss }) {
    const [activeSection, setActiveSection] = useState('do');
    const phase = cycleInfo.phase || 'follicular';
    const briefing = PHASE_BRIEFINGS[phase] || PHASE_BRIEFINGS.follicular;

    const todayStr = new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });

    const handleShare = () => {
        if (navigator.share) {
            navigator.share({
                title: 'My Daily Cosmic Briefing — Global Fycle',
                text: briefing.shareQuote,
            }).catch(() => { });
        } else {
            navigator.clipboard?.writeText(briefing.shareQuote);
        }
    };

    return (
        <div className="briefing-overlay" onClick={onDismiss}>
            <div className="briefing-sheet" onClick={e => e.stopPropagation()}>
                <div className="briefing-handle" />

                {/* Header */}
                <div className="briefing-header">
                    <div className="briefing-date">{todayStr}</div>
                    <h2 className="briefing-title">Your Daily Briefing</h2>
                    <div className="briefing-meta">
                        <span className="briefing-pill" style={{ background: 'rgba(255,45,120,0.15)', color: '#ff2d78' }}>
                            Day {cycleInfo.dayOfCycle} • {cycleInfo.phaseName}
                        </span>
                        <span className="briefing-pill" style={{ background: 'rgba(255,215,0,0.15)', color: '#ffd700' }}>
                            {moonData.emoji} {moonData.phaseName}
                        </span>
                        <span className="briefing-pill" style={{ background: 'rgba(0,245,212,0.15)', color: '#00f5d4' }}>
                            {zodiac.sign} {zodiac.emoji}
                        </span>
                    </div>
                </div>

                {/* Energy meter */}
                <div className="briefing-energy">
                    <span className="energy-label">Today's Energy</span>
                    <span className="energy-value">{briefing.energy}</span>
                </div>

                {/* Do / Don't toggle */}
                <div className="briefing-toggle">
                    <button
                        className={`bt-btn ${activeSection === 'do' ? 'active-do' : ''}`}
                        onClick={() => setActiveSection('do')}
                    >✓ Do</button>
                    <button
                        className={`bt-btn ${activeSection === 'dont' ? 'active-dont' : ''}`}
                        onClick={() => setActiveSection('dont')}
                    >✕ Don't</button>
                </div>

                {/* List */}
                <div className="briefing-list">
                    {(activeSection === 'do' ? briefing.doItems : briefing.dontItems).map((item, i) => (
                        <div key={i} className={`briefing-item ${activeSection === 'do' ? 'do-item' : 'dont-item'}`}>
                            <span className="item-marker">
                                {activeSection === 'do' ? '✓' : '✕'}
                            </span>
                            <span className="item-text">{item}</span>
                        </div>
                    ))}
                </div>

                {/* Cosmic advice */}
                <div className="briefing-cosmic">
                    <div className="cosmic-quote">{briefing.cosmicAdvice}</div>
                </div>

                {/* Share + Dismiss */}
                <div className="briefing-actions">
                    <button className="briefing-share" onClick={handleShare}>
                        📤 Share Today's Insight
                    </button>
                    <button className="briefing-dismiss" onClick={onDismiss}>
                        Enter App →
                    </button>
                </div>

                {/* Noosphere */}
                <div className="briefing-noosphere">
                    Collective Consciousness: <strong>{noosphere.index}</strong>/100 — {noosphere.description || 'Elevated awareness'}
                </div>
            </div>
        </div>
    );
}
