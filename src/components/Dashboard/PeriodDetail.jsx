import React from 'react';

export default function PeriodDetail({ cycleInfo, moonData }) {
    return (
        <>
            <div className="detail-hero" style={{ background: 'linear-gradient(135deg, rgba(255,45,120,0.15), rgba(168,85,247,0.1))' }}>
                <div style={{ fontSize: '3rem' }}>{cycleInfo.phaseEmoji}</div>
                <div style={{ fontSize: '2.5rem', fontWeight: 800, color: '#ff2d78' }}>{cycleInfo.daysUntilNextPeriod}</div>
                <div style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.85rem' }}>days until your next period</div>
            </div>
            <div className="detail-grid">
                <div className="detail-item">
                    <div className="detail-item-label">Current Phase</div>
                    <div className="detail-item-value" style={{ color: cycleInfo.phaseColor }}>{cycleInfo.phaseEmoji} {cycleInfo.phaseName}</div>
                </div>
                <div className="detail-item">
                    <div className="detail-item-label">Cycle Day</div>
                    <div className="detail-item-value">{cycleInfo.dayOfCycle} / {cycleInfo.totalDays}</div>
                </div>
                <div className="detail-item">
                    <div className="detail-item-label">Period Length</div>
                    <div className="detail-item-value">{cycleInfo.periodLength} days</div>
                </div>
                <div className="detail-item">
                    <div className="detail-item-label">Fertility Window</div>
                    <div className="detail-item-value" style={{ color: '#ffd700' }}>{cycleInfo.fertilityStatus}</div>
                </div>
            </div>
            <div className="detail-section">
                <h4>🌀 What's happening in your body</h4>
                <p>{cycleInfo.phase === 'menstrual'
                    ? 'Your uterine lining is shedding. Hormone levels (estrogen & progesterone) are at their lowest. Your body is in rest-and-release mode. Honor this time with gentle movement and warm foods.'
                    : cycleInfo.phase === 'follicular'
                        ? 'Estrogen is rising! Your body is building up energy. Follicles in your ovaries are maturing. This is your "spring" — creativity and confidence are growing. Great time for new projects.'
                        : cycleInfo.phase === 'ovulation'
                            ? 'Estrogen peaks and triggers a surge of luteinizing hormone (LH), releasing an egg. You\'re at peak fertility, energy, and social magnetism. Your voice even changes to be more attractive!'
                            : 'Progesterone rises to prepare the uterine lining. If no pregnancy occurs, hormone levels will drop, triggering your next period. Energy turns inward — perfect for completing tasks and nesting.'
                }</p>
            </div>
            <div className="detail-section">
                <h4>🧘 Phase Recommendations</h4>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                    {cycleInfo.movementMedicine?.map((m, i) => <span key={i} className="pill pill-magenta">{m}</span>)}
                    {cycleInfo.herbs?.map((h, i) => <span key={i} className="pill pill-gold">{h}</span>)}
                    {cycleInfo.crystals?.map((c, i) => <span key={i} className="pill pill-purple">{c}</span>)}
                </div>
            </div>
            <div className="detail-section">
                <h4>🍽️ Food Alchemy</h4>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                    {cycleInfo.foodAlchemy?.map((f, i) => <span key={i} className="pill pill-teal">{f}</span>)}
                </div>
            </div>
        </>
    );
}
