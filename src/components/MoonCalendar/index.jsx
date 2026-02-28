import React, { useMemo, useState } from 'react';
import { useApp } from '../../App';
import { getMoonPhasesForMonth, getMoonPhase } from '../../utils/cosmicEngine';
import { getCycleDayForDate } from '../../utils/cycleEngine';

const MONTH_NAMES = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
const DAY_NAMES = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];

export default function MoonCalendar() {
    const { cycleData, cycleInfo } = useApp();
    const [year, setYear] = useState(new Date().getFullYear());
    const currentMonth = new Date().getMonth();

    const monthsData = useMemo(() => {
        return Array.from({ length: 12 }, (_, m) => {
            const moonPhases = getMoonPhasesForMonth(year, m);
            const firstDay = new Date(year, m, 1).getDay();
            const daysInMonth = new Date(year, m + 1, 0).getDate();
            return { month: m, name: MONTH_NAMES[m], firstDay, daysInMonth, moonPhases };
        });
    }, [year]);

    return (
        <div className="animate-fadeIn">
            <div style={{ textAlign: 'center', marginBottom: 8 }}>
                <div style={{ fontSize: '2.5rem', marginBottom: 8 }}>🌙</div>
                <div className="section-title">Moon & Cycle Calendar</div>
                <div className="section-subtitle">Inspired by the sacred union of lunar and menstrual rhythms — your cosmic calendar for every year</div>
            </div>

            {/* Year selector */}
            <div className="moon-calendar-year-select">
                <button onClick={() => setYear(y => y - 1)}>←</button>
                <span className="year-label">{year}</span>
                <button onClick={() => setYear(y => y + 1)}>→</button>
            </div>

            {/* Legend */}
            <div style={{ display: 'flex', justifyContent: 'center', gap: 20, marginBottom: 20, flexWrap: 'wrap' }}>
                {[
                    { color: 'rgba(255,45,120,0.3)', border: 'rgba(255,45,120,0.5)', label: 'Period Days' },
                    { color: 'rgba(0,245,212,0.2)', border: 'rgba(0,245,212,0.4)', label: 'Fertile Window' },
                ].map((l, i) => (
                    <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.75rem', color: 'rgba(255,255,255,0.6)' }}>
                        <div style={{ width: 14, height: 14, borderRadius: 4, background: l.color, border: `1px solid ${l.border}` }} />
                        {l.label}
                    </div>
                ))}
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.75rem', color: 'rgba(255,255,255,0.6)' }}>
                    🌑🌒🌓🌔🌕🌖🌗🌘 Moon Phases
                </div>
            </div>

            {/* Months Grid */}
            <div className="moon-months-grid">
                {monthsData.map(md => {
                    const isCurrentMonth = year === new Date().getFullYear() && md.month === currentMonth;
                    return (
                        <div key={md.month} className="moon-month-card" style={isCurrentMonth ? { borderColor: 'rgba(255,45,120,0.4)', background: 'rgba(255,45,120,0.05)' } : {}}>
                            <div className="month-name">{md.name}</div>
                            {/* Day headers */}
                            <div className="moon-days" style={{ marginBottom: 4 }}>
                                {DAY_NAMES.map(d => (
                                    <div key={d} style={{ fontSize: '0.5rem', color: 'rgba(255,255,255,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{d}</div>
                                ))}
                            </div>
                            {/* Calendar days */}
                            <div className="moon-days">
                                {/* Empty cells for offset */}
                                {Array.from({ length: md.firstDay }, (_, i) => <div key={`e${i}`} />)}
                                {/* Day cells */}
                                {md.moonPhases.map(mp => {
                                    const dateStr = `${year}-${String(md.month + 1).padStart(2, '0')}-${String(mp.day).padStart(2, '0')}`;
                                    const cycleDay = getCycleDayForDate(dateStr, cycleData.lastPeriodStart, cycleData.cycleLength, cycleData.periodLength);
                                    const isPeriod = cycleDay?.isPeriod || false;
                                    const isFertile = cycleDay?.isFertile || false;
                                    const isToday = year === new Date().getFullYear() && md.month === new Date().getMonth() && mp.day === new Date().getDate();
                                    return (
                                        <div key={mp.day} className={`moon-day ${isPeriod ? 'period-day' : ''} ${isFertile ? 'fertile-day' : ''}`}
                                            style={isToday ? { border: '1px solid #ffd700', boxShadow: '0 0 6px rgba(255,215,0,0.3)' } : {}}
                                            title={`${mp.phaseName} • ${mp.illumination}% illuminated${isPeriod ? ' • Period' : ''}${isFertile ? ' • Fertile' : ''}`}>
                                            <span className="moon-emoji">{mp.emoji}</span>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Today's Moon Detail */}
            <div className="glass-card" style={{ marginTop: 24, textAlign: 'center' }}>
                <div style={{ fontSize: '3rem', marginBottom: 8 }}>{getMoonPhase().emoji}</div>
                <h3 style={{ fontFamily: "'Playfair Display', serif", color: '#ffd700', fontSize: '1.3rem' }}>
                    Today: {getMoonPhase().phaseName}
                </h3>
                <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.85rem', maxWidth: 500, margin: '8px auto 0' }}>
                    {getMoonPhase().menstrualCorrelation.desc}
                </p>
            </div>
        </div>
    );
}
