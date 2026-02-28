import React, { useState, useMemo } from 'react';
import { useApp } from '../../App';
import { getPlanetaryPositions, getRetrogrades, getCosmicEvents, getZodiacSign } from '../../utils/cosmicEngine';

// Scale AU to SVG pixels for the orrery
// Inner planets use one scale, outer planets use log scale to fit nicely
function auToPixel(r_AU, isInner) {
    if (isInner) return r_AU * 90; // Mercury~35px, Mars~137px
    // Logarithmic compression for outer planets
    return 90 + Math.log(r_AU) * 60; // Jupiter~190px, Neptune~295px
}

export default function CosmicMap() {
    const { moonData, zodiac, cycleInfo, noosphere } = useApp();
    const [activeTab, setActiveTab] = useState('orrery');
    const [selectedPlanet, setSelectedPlanet] = useState(null);
    const [viewMode, setViewMode] = useState('inner'); // 'inner' or 'full'

    const planets = useMemo(() => getPlanetaryPositions(), []);
    const retrogrades = useMemo(() => getRetrogrades(), []);
    const cosmicEvents = useMemo(() => getCosmicEvents(), []);

    const ZODIAC_SIGNS = ['♈', '♉', '♊', '♋', '♌', '♍', '♎', '♏', '♐', '♑', '♒', '♓'];
    const ZODIAC_NAMES = ['Aries', 'Taurus', 'Gemini', 'Cancer', 'Leo', 'Virgo', 'Libra', 'Scorpio', 'Sagittarius', 'Capricorn', 'Aquarius', 'Pisces'];

    const innerPlanets = planets.filter(p => ['Mercury', 'Venus', 'Earth', 'Mars'].includes(p.name));
    const outerPlanets = planets.filter(p => ['Jupiter', 'Saturn', 'Uranus', 'Neptune'].includes(p.name));
    const displayPlanets = viewMode === 'inner' ? innerPlanets : planets;

    // Compute orbit radii for SVG
    const maxOrbitRadius = viewMode === 'inner' ? 160 : 310;
    const svgSize = maxOrbitRadius + 40;

    const PLANET_INFO = {
        Mercury: { desc: 'Communication, intellect, travel. Governs how you think and express ideas.', ruler: 'Gemini & Virgo', period: '88 days' },
        Venus: { desc: 'Love, beauty, harmony, relationships. Governs attraction and aesthetic sense.', ruler: 'Taurus & Libra', period: '225 days' },
        Earth: { desc: 'Your physical home. The vernal equinox defines the zodiac coordinate system.', ruler: '—', period: '365.25 days' },
        Mars: { desc: 'Action, desire, courage, energy. Governs how you assert yourself and pursue goals.', ruler: 'Aries & Scorpio', period: '687 days' },
        Jupiter: { desc: 'Expansion, abundance, wisdom, optimism. Governs growth and good fortune.', ruler: 'Sagittarius & Pisces', period: '11.86 years' },
        Saturn: { desc: 'Discipline, structure, responsibility, karma. Governs limitations and life lessons.', ruler: 'Capricorn & Aquarius', period: '29.46 years' },
        Uranus: { desc: 'Revolution, innovation, sudden change. Governs breakthroughs and liberation.', ruler: 'Aquarius', period: '84.01 years' },
        Neptune: { desc: 'Dreams, intuition, spirituality, illusion. Governs the subconscious and mystical realms.', ruler: 'Pisces', period: '164.8 years' },
    };

    return (
        <div className="animate-fadeIn">
            <div className="section-title">Cosmic Map</div>
            <div className="section-subtitle">Real-time planetary positions computed from NASA/JPL orbital elements — accurate to ~1°</div>

            <div className="tabs" style={{ marginBottom: 16 }}>
                {['orrery', 'planets', 'events'].map(t => (
                    <button key={t} className={`tab ${activeTab === t ? 'active' : ''}`} onClick={() => setActiveTab(t)}>
                        {t === 'orrery' ? '🪐 Solar System' : t === 'planets' ? '📊 Planet Data' : '🗓️ Cosmic Events'}
                    </button>
                ))}
            </div>

            {activeTab === 'orrery' && (
                <div className="dashboard-grid two-col" style={{ marginBottom: 20 }}>
                    {/* Solar System Orrery */}
                    <div className="glass-card" style={{ padding: 0, overflow: 'hidden' }}>
                        <div style={{ display: 'flex', justifyContent: 'flex-end', padding: '8px 12px', borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                            <div style={{ display: 'flex', gap: 4 }}>
                                <button className={`btn btn-ghost btn-sm ${viewMode === 'inner' ? '' : ''}`}
                                    onClick={() => setViewMode('inner')}
                                    style={{ fontSize: '0.7rem', opacity: viewMode === 'inner' ? 1 : 0.4, background: viewMode === 'inner' ? 'rgba(255,255,255,0.08)' : 'transparent' }}>
                                    Inner Planets
                                </button>
                                <button className={`btn btn-ghost btn-sm`}
                                    onClick={() => setViewMode('full')}
                                    style={{ fontSize: '0.7rem', opacity: viewMode === 'full' ? 1 : 0.4, background: viewMode === 'full' ? 'rgba(255,255,255,0.08)' : 'transparent' }}>
                                    Full System
                                </button>
                            </div>
                        </div>
                        <div className="cosmic-canvas" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <svg viewBox={`${-svgSize} ${-svgSize} ${svgSize * 2} ${svgSize * 2}`} style={{ width: '100%', height: '100%' }}>
                                {/* Star field background dots */}
                                {[...Array(80)].map((_, i) => (
                                    <circle key={`star${i}`} cx={(Math.sin(i * 137.5) * svgSize * 0.95)}
                                        cy={(Math.cos(i * 87.3) * svgSize * 0.95)}
                                        r={0.3 + (i % 3) * 0.3} fill="rgba(255,255,255,0.15)" />
                                ))}

                                {/* Zodiac ring */}
                                <circle cx="0" cy="0" r={maxOrbitRadius + 20} fill="none" stroke="rgba(255,255,255,0.04)" strokeWidth="1" />
                                {ZODIAC_SIGNS.map((sign, i) => {
                                    const angle = (i * 30 - 80) * Math.PI / 180; // align Aries ~0° ecliptic
                                    const rx = (maxOrbitRadius + 20) * Math.cos(angle);
                                    const ry = (maxOrbitRadius + 20) * Math.sin(angle);
                                    const isCurrentSign = ZODIAC_NAMES[i] === zodiac.sign;
                                    return (
                                        <g key={i}>
                                            <text x={rx} y={ry} textAnchor="middle" dominantBaseline="middle"
                                                fill={isCurrentSign ? '#ffd700' : 'rgba(255,255,255,0.2)'} fontSize={isCurrentSign ? '14' : '10'}>
                                                {sign}
                                            </text>
                                            {isCurrentSign && <circle cx={rx} cy={ry} r="16" fill="none" stroke="#ffd700" strokeWidth="0.5" opacity="0.4" />}
                                        </g>
                                    );
                                })}

                                {/* Orbit ellipses for displayed planets */}
                                {displayPlanets.map(p => {
                                    const orbitR = auToPixel(p.a, viewMode === 'inner' || p.a < 2);
                                    return (
                                        <ellipse key={p.name + 'orbit'} cx="0" cy="0"
                                            rx={orbitR} ry={orbitR * (1 - p.e * 0.3)} // slight eccentricity visual
                                            fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="0.5"
                                            strokeDasharray={p.name === 'Earth' ? '0' : '3,3'} />
                                    );
                                })}

                                {/* Sun */}
                                <circle cx="0" cy="0" r="12" fill="#ffd700" opacity="0.9" />
                                <circle cx="0" cy="0" r="16" fill="none" stroke="#ffd700" strokeWidth="0.3" opacity="0.3" />
                                <text x="0" y="22" textAnchor="middle" fill="rgba(255,255,255,0.4)" fontSize="6">Sun</text>

                                {/* Planets at real positions */}
                                {displayPlanets.map(p => {
                                    const lonRad = p.helioLon * Math.PI / 180;
                                    const orbitR = auToPixel(p.r, viewMode === 'inner' || p.a < 2);
                                    const x = orbitR * Math.cos(lonRad);
                                    const y = -orbitR * Math.sin(lonRad); // negate Y for SVG coords
                                    const isRetrograde = retrogrades.some(r => r.planet === p.name);
                                    const isSelected = selectedPlanet === p.name;
                                    return (
                                        <g key={p.name} style={{ cursor: 'pointer' }} onClick={() => setSelectedPlanet(selectedPlanet === p.name ? null : p.name)}>
                                            {/* Selection ring */}
                                            {isSelected && <circle cx={x} cy={y} r={p.size / 2 + 6} fill="none" stroke={p.color} strokeWidth="1" opacity="0.5" />}
                                            {/* Planet body */}
                                            <circle cx={x} cy={y} r={p.size / 2} fill={p.color} opacity="0.9" />
                                            {/* Retrograde marker */}
                                            {isRetrograde && (
                                                <text x={x + p.size / 2 + 3} y={y - 2} fill="#ff4444" fontSize="7" fontWeight="bold">℞</text>
                                            )}
                                            {/* Label */}
                                            <text x={x} y={y + p.size / 2 + 9} textAnchor="middle" fill="rgba(255,255,255,0.5)" fontSize="6">
                                                {p.name}
                                            </text>
                                            {/* Zodiac position */}
                                            <text x={x} y={y + p.size / 2 + 17} textAnchor="middle" fill="rgba(255,255,255,0.25)" fontSize="5">
                                                {p.geoZodiac.emoji} {p.geoZodiac.degree}°
                                            </text>
                                        </g>
                                    );
                                })}

                                {/* Moon orbiting Earth */}
                                {(() => {
                                    const earthP = displayPlanets.find(p => p.name === 'Earth');
                                    if (!earthP) return null;
                                    const earthLonRad = earthP.helioLon * Math.PI / 180;
                                    const earthOrbitR = auToPixel(earthP.r, viewMode === 'inner' || earthP.a < 2);
                                    const ex = earthOrbitR * Math.cos(earthLonRad);
                                    const ey = -earthOrbitR * Math.sin(earthLonRad);
                                    const moonAngle = (moonData.phase / 29.53 * 360) * Math.PI / 180;
                                    const moonDist = viewMode === 'inner' ? 18 : 12;
                                    const mx = ex + moonDist * Math.cos(moonAngle);
                                    const my = ey - moonDist * Math.sin(moonAngle);
                                    return (
                                        <g>
                                            <circle cx={ex} cy={ey} r={moonDist} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="0.3" />
                                            <circle cx={mx} cy={my} r="3" fill="#e0e0e0" />
                                        </g>
                                    );
                                })()}

                                {/* Date label */}
                                <text x={-svgSize + 10} y={-svgSize + 15} fill="rgba(255,255,255,0.3)" fontSize="7">
                                    {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}
                                </text>
                                <text x={-svgSize + 10} y={-svgSize + 25} fill="rgba(255,255,255,0.2)" fontSize="5">
                                    Heliocentric ecliptic view • J2000 elements
                                </text>
                            </svg>
                        </div>
                    </div>

                    {/* Right Panel */}
                    <div>
                        {/* Selected planet info */}
                        {selectedPlanet && (() => {
                            const p = planets.find(x => x.name === selectedPlanet);
                            const info = PLANET_INFO[selectedPlanet];
                            if (!p) return null;
                            return (
                                <div className="glass-card" style={{ marginBottom: 16, borderLeft: `3px solid ${p.color}` }}>
                                    <div className="section-header">
                                        <span style={{ fontSize: '1.5rem' }}>{p.symbol}</span>
                                        <div>
                                            <h3 style={{ color: p.color }}>{p.name}</h3>
                                            <div style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.4)' }}>
                                                {p.geoZodiac.emoji} {p.geoZodiac.sign} {p.geoZodiac.degree}° • {info.period} orbit
                                            </div>
                                        </div>
                                    </div>
                                    <p style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.7)', lineHeight: 1.5, marginTop: 8 }}>{info.desc}</p>
                                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginTop: 12 }}>
                                        <div className="glass-card" style={{ padding: 10 }}>
                                            <div style={{ fontSize: '0.6rem', color: 'rgba(255,255,255,0.4)' }}>Distance from Sun</div>
                                            <div style={{ fontSize: '0.95rem', color: p.color, fontWeight: 600 }}>{p.r.toFixed(3)} AU</div>
                                        </div>
                                        <div className="glass-card" style={{ padding: 10 }}>
                                            <div style={{ fontSize: '0.6rem', color: 'rgba(255,255,255,0.4)' }}>Ecliptic Longitude</div>
                                            <div style={{ fontSize: '0.95rem', color: '#ffd700', fontWeight: 600 }}>{p.helioLon.toFixed(1)}°</div>
                                        </div>
                                        <div className="glass-card" style={{ padding: 10 }}>
                                            <div style={{ fontSize: '0.6rem', color: 'rgba(255,255,255,0.4)' }}>Geocentric Lon</div>
                                            <div style={{ fontSize: '0.95rem', color: '#00f5d4', fontWeight: 600 }}>{p.geoLon.toFixed(1)}°</div>
                                        </div>
                                        <div className="glass-card" style={{ padding: 10 }}>
                                            <div style={{ fontSize: '0.6rem', color: 'rgba(255,255,255,0.4)' }}>Rules</div>
                                            <div style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.7)' }}>{info.ruler}</div>
                                        </div>
                                    </div>
                                </div>
                            );
                        })()}

                        {/* Current Zodiac Season */}
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
                    </div>
                </div>
            )}

            {activeTab === 'planets' && (
                <div style={{ maxWidth: 900 }}>
                    {/* Planetary Positions Table */}
                    <div className="glass-card" style={{ marginBottom: 16 }}>
                        <div className="section-header"><span className="section-icon">🪐</span><h3>Current Planetary Positions</h3></div>
                        <div style={{ fontSize: '0.65rem', color: 'rgba(255,255,255,0.3)', marginBottom: 12 }}>
                            Computed from J2000 Keplerian elements • {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                        </div>
                        <div style={{ overflowX: 'auto' }}>
                            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.8rem' }}>
                                <thead>
                                    <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
                                        <th style={{ textAlign: 'left', padding: '8px 6px', color: 'rgba(255,255,255,0.4)', fontWeight: 500, fontSize: '0.7rem' }}>Planet</th>
                                        <th style={{ textAlign: 'center', padding: '8px 6px', color: 'rgba(255,255,255,0.4)', fontWeight: 500, fontSize: '0.7rem' }}>Geocentric Sign</th>
                                        <th style={{ textAlign: 'center', padding: '8px 6px', color: 'rgba(255,255,255,0.4)', fontWeight: 500, fontSize: '0.7rem' }}>Helio Lon</th>
                                        <th style={{ textAlign: 'center', padding: '8px 6px', color: 'rgba(255,255,255,0.4)', fontWeight: 500, fontSize: '0.7rem' }}>Distance (AU)</th>
                                        <th style={{ textAlign: 'center', padding: '8px 6px', color: 'rgba(255,255,255,0.4)', fontWeight: 500, fontSize: '0.7rem' }}>Status</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {planets.map(p => {
                                        const isRetro = retrogrades.some(r => r.planet === p.name);
                                        return (
                                            <tr key={p.name} style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}
                                                onClick={() => setSelectedPlanet(p.name === selectedPlanet ? null : p.name)}>
                                                <td style={{ padding: '10px 6px' }}>
                                                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                                        <div style={{ width: 10, height: 10, borderRadius: '50%', background: p.color }} />
                                                        <span style={{ color: '#fff', fontWeight: 500 }}>{p.symbol} {p.name}</span>
                                                    </div>
                                                </td>
                                                <td style={{ textAlign: 'center', padding: '10px 6px' }}>
                                                    <span style={{ color: '#ffd700' }}>{p.geoZodiac.emoji} {p.geoZodiac.sign}</span>
                                                    <span style={{ color: 'rgba(255,255,255,0.3)', marginLeft: 4 }}>{p.geoZodiac.degree}°</span>
                                                </td>
                                                <td style={{ textAlign: 'center', padding: '10px 6px', color: 'rgba(255,255,255,0.6)' }}>
                                                    {p.helioLon.toFixed(1)}°
                                                </td>
                                                <td style={{ textAlign: 'center', padding: '10px 6px', color: '#00f5d4' }}>
                                                    {p.r.toFixed(3)}
                                                </td>
                                                <td style={{ textAlign: 'center', padding: '10px 6px' }}>
                                                    {isRetro ? <span style={{ color: '#ff4444', fontWeight: 600 }}>℞ Rx</span> : <span style={{ color: '#00f5d4' }}>Direct</span>}
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* Selected Planet Detail */}
                    {selectedPlanet && (() => {
                        const p = planets.find(x => x.name === selectedPlanet);
                        const info = PLANET_INFO[selectedPlanet];
                        if (!p || !info) return null;
                        return (
                            <div className="glass-card" style={{ borderLeft: `3px solid ${p.color}` }}>
                                <div className="section-header">
                                    <span style={{ fontSize: '1.5rem' }}>{p.symbol}</span>
                                    <h3 style={{ color: p.color }}>{p.name} in {p.geoZodiac.sign}</h3>
                                </div>
                                <p style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.7)', lineHeight: 1.6 }}>{info.desc}</p>
                                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginTop: 10 }}>
                                    <span className="pill pill-gold">Rules: {info.ruler}</span>
                                    <span className="pill pill-teal">Orbit: {info.period}</span>
                                    <span className="pill pill-purple">Eccentricity: {p.e.toFixed(4)}</span>
                                </div>
                            </div>
                        );
                    })()}
                </div>
            )}

            {activeTab === 'events' && (
                <div className="dashboard-grid two-col">
                    {/* Upcoming Cosmic Events */}
                    <div className="glass-card">
                        <div className="section-header"><span className="section-icon">🗓️</span><h3>Upcoming Cosmic Events</h3></div>
                        {cosmicEvents.length > 0 ? cosmicEvents.map((e, i) => (
                            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 0', borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                                <span style={{ fontSize: '1.4rem' }}>{e.emoji}</span>
                                <div style={{ flex: 1 }}>
                                    <div style={{ fontSize: '0.85rem', color: '#fff', fontWeight: 500 }}>{e.name}</div>
                                    <div style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.4)' }}>
                                        {e.daysAway === 0 ? '⚡ Today!' : `In ${e.daysAway} days`}
                                    </div>
                                </div>
                            </div>
                        )) : (
                            <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.85rem' }}>No major cosmic events in the near future.</p>
                        )}
                    </div>

                    {/* Retrograde Status + Cycle Connection */}
                    <div>
                        <div className="glass-card" style={{ marginBottom: 16 }}>
                            <div className="section-header"><span className="section-icon">🔄</span><h3>Retrograde Status</h3></div>
                            {['Mercury', 'Venus', 'Mars', 'Jupiter', 'Saturn', 'Uranus', 'Neptune'].map(name => {
                                const isRetro = retrogrades.some(r => r.planet === name);
                                const p = planets.find(x => x.name === name);
                                return (
                                    <div key={name} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                            <div style={{ width: 8, height: 8, borderRadius: '50%', background: p?.color || '#888' }} />
                                            <span style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.7)' }}>{p?.symbol} {name}</span>
                                        </div>
                                        {isRetro
                                            ? <span style={{ fontSize: '0.75rem', color: '#ff4444', fontWeight: 600 }}>℞ Retrograde</span>
                                            : <span style={{ fontSize: '0.75rem', color: '#00f5d4' }}>Direct ✓</span>}
                                    </div>
                                );
                            })}
                        </div>

                        <div className="glass-card">
                            <div className="section-header"><span className="section-icon">🌀</span><h3>Cosmic Cycle Connection</h3></div>
                            <p style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.7)', lineHeight: 1.6, marginBottom: 12 }}>
                                You are in your <strong style={{ color: cycleInfo.phaseColor }}>{cycleInfo.phaseName}</strong> phase
                                during <strong style={{ color: '#ffd700' }}>{zodiac.sign}</strong> season with
                                a <strong style={{ color: '#e0e0e0' }}>{moonData.phaseName}</strong> moon.
                            </p>
                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                                <span className="pill pill-magenta">{cycleInfo.phaseEmoji} Day {cycleInfo.dayOfCycle}</span>
                                <span className="pill pill-gold">{moonData.emoji} {moonData.phaseName}</span>
                                <span className="pill pill-teal">Noosphere: {noosphere.index}</span>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
