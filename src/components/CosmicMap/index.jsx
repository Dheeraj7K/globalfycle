import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../../App';
import { getPlanetaryPositions, getRetrogrades, getCosmicEvents, getZodiacSign } from '../../utils/cosmicEngine';

export default function CosmicMap() {
    const { moonData, zodiac, cycleInfo, noosphere } = useApp();
    const canvasRef = useRef(null);
    const [planets] = useState(() => getPlanetaryPositions());
    const [retrogrades] = useState(() => getRetrogrades());
    const [cosmicEvents] = useState(() => getCosmicEvents());
    const [rotation, setRotation] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => setRotation(r => r + 0.1), 50);
        return () => clearInterval(interval);
    }, []);

    const ZODIAC_SIGNS = ['♈', '♉', '♊', '♋', '♌', '♍', '♎', '♏', '♐', '♑', '♒', '♓'];
    const ZODIAC_NAMES = ['Aries', 'Taurus', 'Gemini', 'Cancer', 'Leo', 'Virgo', 'Libra', 'Scorpio', 'Sagittarius', 'Capricorn', 'Aquarius', 'Pisces'];

    return (
        <div className="animate-fadeIn">
            <div className="section-title">Cosmic Map</div>
            <div className="section-subtitle">Your cycle in the cosmos — real-time planetary positions & astrological alignment</div>

            <div className="dashboard-grid two-col" style={{ marginBottom: 20 }}>
                {/* Solar System Visualization */}
                <div className="glass-card" style={{ padding: 0, overflow: 'hidden' }}>
                    <div className="cosmic-canvas" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <svg viewBox="-250 -250 500 500" style={{ width: '100%', height: '100%' }}>
                            {/* Zodiac ring */}
                            <circle cx="0" cy="0" r="230" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="1" />
                            {ZODIAC_SIGNS.map((sign, i) => {
                                const angle = (i * 30 + rotation) * Math.PI / 180;
                                const x = 230 * Math.cos(angle);
                                const y = 230 * Math.sin(angle);
                                const isCurrentSign = ZODIAC_NAMES[i] === zodiac.sign;
                                return (
                                    <g key={i}>
                                        <text x={x} y={y} textAnchor="middle" dominantBaseline="middle"
                                            fill={isCurrentSign ? '#ffd700' : 'rgba(255,255,255,0.3)'} fontSize={isCurrentSign ? '16' : '12'}
                                            style={{ transition: 'all 0.3s' }}>
                                            {sign}
                                        </text>
                                        {isCurrentSign && <circle cx={x} cy={y} r="18" fill="none" stroke="#ffd700" strokeWidth="0.5" opacity="0.5" />}
                                    </g>
                                );
                            })}

                            {/* Orbit rings */}
                            {planets.map(p => (
                                <circle key={p.name + 'orbit'} cx="0" cy="0" r={p.orbitRadius} fill="none"
                                    stroke="rgba(255,255,255,0.04)" strokeWidth="0.5" strokeDasharray="4,4" />
                            ))}

                            {/* Sun */}
                            <circle cx="0" cy="0" r="14" fill="#ffd700" opacity="0.9" />
                            <circle cx="0" cy="0" r="20" fill="none" stroke="#ffd700" strokeWidth="0.5" opacity="0.3" />

                            {/* Planets */}
                            {planets.map(p => {
                                const angle = (p.angle + rotation * 2) * Math.PI / 180;
                                const x = p.orbitRadius * Math.cos(angle);
                                const y = p.orbitRadius * Math.sin(angle);
                                const isRetrograde = retrogrades.some(r => r.planet === p.name);
                                return (
                                    <g key={p.name}>
                                        <circle cx={x} cy={y} r={p.size / 2} fill={p.color} opacity="0.9" />
                                        {isRetrograde && (
                                            <text x={x + p.size / 2 + 4} y={y} fill="#ff4444" fontSize="8" dominantBaseline="middle">℞</text>
                                        )}
                                        <text x={x} y={y + p.size / 2 + 10} textAnchor="middle" fill="rgba(255,255,255,0.5)" fontSize="7">
                                            {p.name}
                                        </text>
                                    </g>
                                );
                            })}

                            {/* Moon */}
                            {(() => {
                                const moonAngle = (moonData.phase / 29.53 * 360 + rotation * 3) * Math.PI / 180;
                                const mx = 40 * Math.cos(moonAngle) + (planets[2]?.x ?? 0);
                                const my = 40 * Math.sin(moonAngle) + (planets[2]?.y ?? 0);
                                return (
                                    <g>
                                        <circle cx={mx} cy={my} r="4" fill="#e0e0e0" />
                                        <circle cx={mx} cy={my} r="8" fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="0.3" />
                                    </g>
                                );
                            })()}
                        </svg>
                    </div>
                </div>

                {/* Cosmic Info Panel */}
                <div>
                    {/* Current Zodiac */}
                    <div className="glass-card" style={{ marginBottom: 16 }}>
                        <div className="section-header"><span className="section-icon">{zodiac.emoji}</span><h3>{zodiac.sign} Season</h3></div>
                        <p style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.7)', lineHeight: 1.5, marginBottom: 12 }}>
                            {zodiac.cycleInfluence}
                        </p>
                        <div style={{ display: 'flex', gap: 8 }}>
                            <span className="pill pill-gold">Element: {zodiac.element}</span>
                            <span className="pill pill-purple">Ruling: {zodiac.ruling}</span>
                        </div>
                    </div>

                    {/* Moon Phase Detail */}
                    <div className="glass-card" style={{ marginBottom: 16 }}>
                        <div className="section-header">
                            <span style={{ fontSize: '2rem' }}>{moonData.emoji}</span>
                            <div>
                                <h3 style={{ fontFamily: "'Playfair Display', serif", color: '#fff' }}>{moonData.phaseName}</h3>
                                <div style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.4)' }}>{moonData.illumination}% illuminated • Day {moonData.synodicDay} of cycle</div>
                            </div>
                        </div>
                        <p style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.7)', lineHeight: 1.5, marginTop: 8 }}>
                            {moonData.menstrualCorrelation.desc}
                        </p>
                        <div style={{ marginTop: 8 }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', marginBottom: 4 }}>
                                <span style={{ color: 'rgba(255,255,255,0.5)' }}>Moon-Cycle Resonance</span>
                                <span style={{ color: '#ffd700' }}>{moonData.menstrualCorrelation.resonance}%</span>
                            </div>
                            <div style={{ height: 6, background: 'rgba(255,255,255,0.08)', borderRadius: 3 }}>
                                <div style={{ height: '100%', borderRadius: 3, background: '#ffd700', width: `${moonData.menstrualCorrelation.resonance}%` }} />
                            </div>
                        </div>
                    </div>

                    {/* Retrogrades */}
                    {retrogrades.length > 0 && (
                        <div className="glass-card" style={{ borderLeft: '3px solid #ff4444', marginBottom: 16 }}>
                            <div style={{ fontSize: '0.65rem', color: '#ff4444', fontWeight: 600, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 6 }}>⚠️ Retrograde Alert</div>
                            {retrogrades.map((r, i) => (
                                <div key={i} style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.7)' }}>
                                    {r.symbol} {r.planet} is retrograde — review, reflect, don't rush decisions
                                </div>
                            ))}
                        </div>
                    )}

                    {/* Upcoming Cosmic Events */}
                    {cosmicEvents.length > 0 && (
                        <div className="glass-card">
                            <div className="section-header"><span className="section-icon">🗓️</span><h3>Upcoming Cosmic Events</h3></div>
                            {cosmicEvents.map((e, i) => (
                                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 0', borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                                    <span style={{ fontSize: '1.2rem' }}>{e.emoji}</span>
                                    <div style={{ flex: 1 }}>
                                        <div style={{ fontSize: '0.85rem', color: '#fff' }}>{e.name}</div>
                                        <div style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.4)' }}>
                                            {e.daysAway === 0 ? 'Today!' : `In ${e.daysAway} days`}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
