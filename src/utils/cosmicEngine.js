/* ═══════════════════════════════════════════════════════
   COSMIC ENGINE — Astronomical & Astrological Calculations
   ═══════════════════════════════════════════════════════ */

// Real moon phase calculation using Conway's algorithm
export function getMoonPhase(date = new Date()) {
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();

    let c = 0, e = 0;
    if (month < 3) {
        c = year - 1;
        e = month + 9;
    } else {
        c = year;
        e = month - 3;
    }

    const jd = Math.floor(365.25 * (c + 4716)) + Math.floor(30.6001 * (e + 1)) + day - 1524.5;
    const daysSinceNew = jd - 2451549.5;
    const synodicMonth = 29.53059;
    const phase = ((daysSinceNew % synodicMonth) + synodicMonth) % synodicMonth;
    const illumination = (1 - Math.cos((phase / synodicMonth) * 2 * Math.PI)) / 2;

    let phaseName, emoji, phaseIndex;
    const phaseDay = phase;

    if (phaseDay < 1.85) {
        phaseName = 'New Moon'; emoji = '🌑'; phaseIndex = 0;
    } else if (phaseDay < 7.38) {
        phaseName = 'Waxing Crescent'; emoji = '🌒'; phaseIndex = 1;
    } else if (phaseDay < 9.23) {
        phaseName = 'First Quarter'; emoji = '🌓'; phaseIndex = 2;
    } else if (phaseDay < 14.77) {
        phaseName = 'Waxing Gibbous'; emoji = '🌔'; phaseIndex = 3;
    } else if (phaseDay < 16.61) {
        phaseName = 'Full Moon'; emoji = '🌕'; phaseIndex = 4;
    } else if (phaseDay < 22.15) {
        phaseName = 'Waning Gibbous'; emoji = '🌖'; phaseIndex = 5;
    } else if (phaseDay < 24.0) {
        phaseName = 'Last Quarter'; emoji = '🌗'; phaseIndex = 6;
    } else {
        phaseName = 'Waning Crescent'; emoji = '🌘'; phaseIndex = 7;
    }

    // Moon-menstrual correlation
    const menstrualCorrelation = getMoonMenstrualCorrelation(phaseIndex);

    return {
        phase: phaseDay,
        phaseName,
        emoji,
        phaseIndex,
        illumination: Math.round(illumination * 100),
        daysIntoPhase: Math.round(phaseDay * 10) / 10,
        synodicDay: Math.round(phaseDay * 10) / 10,
        menstrualCorrelation,
    };
}

function getMoonMenstrualCorrelation(phaseIndex) {
    const correlations = [
        { phase: 'New Moon', menstrualLink: 'Menstruation', desc: 'Ancient alignment — New Moon bleeds are called "White Moon Cycles." Your body mirrors cosmic darkness, shedding to renew. Deepest intuition and psychic power activated.', resonance: 95 },
        { phase: 'Waxing Crescent', menstrualLink: 'Late Menstrual/Early Follicular', desc: 'Energy begins to build as the moon returns. Your body mirrors this rising light with new follicle development.', resonance: 78 },
        { phase: 'First Quarter', menstrualLink: 'Follicular', desc: 'Half-moon balance point. Decision-making energy peaks. Your estrogen rises in harmony with lunar illumination.', resonance: 72 },
        { phase: 'Waxing Gibbous', menstrualLink: 'Late Follicular', desc: 'Almost full — almost ovulation. Creative and social powers surge. The egg prepares for release.', resonance: 85 },
        { phase: 'Full Moon', menstrualLink: 'Ovulation', desc: 'Full Moon ovulation is called a "White Moon Cycle" — the most fertile alignment. Maximum radiance, magnetism, and sexual energy.', resonance: 98 },
        { phase: 'Waning Gibbous', menstrualLink: 'Early Luteal', desc: 'Post-ovulation integration. The body and moon both begin turning inward. Gratitude and reflection energy.', resonance: 75 },
        { phase: 'Last Quarter', menstrualLink: 'Mid-Luteal', desc: 'Another balance point. PMS may arise. The moon teaches you to release what no longer serves you.', resonance: 70 },
        { phase: 'Waning Crescent', menstrualLink: 'Late Luteal/Pre-Menstrual', desc: 'The balsamic moon. Deepest introspection before renewal. Dreams are most vivid. Journaling is powerful.', resonance: 82 },
    ];
    return correlations[phaseIndex];
}

// Calculate moon phase for any date (for calendar)
export function getMoonPhaseForDate(date) {
    return getMoonPhase(new Date(date));
}

// Get all moon phases for a given month/year
export function getMoonPhasesForMonth(year, month) {
    const phases = [];
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    for (let d = 1; d <= daysInMonth; d++) {
        const date = new Date(year, month, d);
        phases.push({
            day: d,
            date: date,
            ...getMoonPhase(date),
        });
    }
    return phases;
}

// Zodiac calculation
export function getZodiacSign(date = new Date()) {
    const month = date.getMonth() + 1;
    const day = date.getDate();

    const signs = [
        { sign: 'Capricorn', symbol: '♑', emoji: '🐐', element: 'Earth', start: [1, 1], end: [1, 19], ruling: 'Saturn', cycleInfluence: 'Discipline and structure. Your cycle benefits from routine and grounding practices.' },
        { sign: 'Aquarius', symbol: '♒', emoji: '🏺', element: 'Air', start: [1, 20], end: [2, 18], ruling: 'Uranus', cycleInfluence: 'Innovation and freedom. Break patterns that don\'t serve your body. Experiment with new self-care.' },
        { sign: 'Pisces', symbol: '♓', emoji: '🐟', element: 'Water', start: [2, 19], end: [3, 20], ruling: 'Neptune', cycleInfluence: 'Deep intuition and spiritual connection. Your cycle becomes a portal to inner wisdom.' },
        { sign: 'Aries', symbol: '♈', emoji: '🐏', element: 'Fire', start: [3, 21], end: [4, 19], ruling: 'Mars', cycleInfluence: 'Bold energy and new beginnings. Ovulation during Aries brings peak confidence and initiative.' },
        { sign: 'Taurus', symbol: '♉', emoji: '🐂', element: 'Earth', start: [4, 20], end: [5, 20], ruling: 'Venus', cycleInfluence: 'Sensuality and body awareness. Your cycle craves comfort, art, and beautiful surroundings.' },
        { sign: 'Gemini', symbol: '♊', emoji: '👯', element: 'Air', start: [5, 21], end: [6, 20], ruling: 'Mercury', cycleInfluence: 'Communication and duality. Track how your verbal energy shifts across phases.' },
        { sign: 'Cancer', symbol: '♋', emoji: '🦀', element: 'Water', start: [6, 21], end: [7, 22], ruling: 'Moon', cycleInfluence: 'The Moon rules Cancer AND menstruation. This is the most powerful cycle-astrology alignment.' },
        { sign: 'Leo', symbol: '♌', emoji: '🦁', element: 'Fire', start: [7, 23], end: [8, 22], ruling: 'Sun', cycleInfluence: 'Self-expression and radiance. Your ovulation phase shines brightest during Leo season.' },
        { sign: 'Virgo', symbol: '♍', emoji: '👸', element: 'Earth', start: [8, 23], end: [9, 22], ruling: 'Mercury', cycleInfluence: 'Health and precision. Perfect time to optimize your cycle tracking and nutrition.' },
        { sign: 'Libra', symbol: '♎', emoji: '⚖️', element: 'Air', start: [9, 23], end: [10, 22], ruling: 'Venus', cycleInfluence: 'Balance and beauty. Seek harmony between rest and activity across your cycle.' },
        { sign: 'Scorpio', symbol: '♏', emoji: '🦂', element: 'Water', start: [10, 23], end: [11, 21], ruling: 'Pluto', cycleInfluence: 'Transformation and depth. Menstruation during Scorpio embodies death-rebirth power.' },
        { sign: 'Sagittarius', symbol: '♐', emoji: '🏹', element: 'Fire', start: [11, 22], end: [12, 21], ruling: 'Jupiter', cycleInfluence: 'Expansion and adventure. Your follicular phase gets extra optimism and wanderlust.' },
        { sign: 'Capricorn', symbol: '♑', emoji: '🐐', element: 'Earth', start: [12, 22], end: [12, 31], ruling: 'Saturn', cycleInfluence: 'Discipline and structure. Your cycle benefits from routine and grounding practices.' },
    ];

    for (const s of signs) {
        const [sm, sd] = s.start;
        const [em, ed] = s.end;
        if ((month === sm && day >= sd) || (month === em && day <= ed)) {
            return s;
        }
    }
    return signs[0]; // Default Capricorn
}

// Planetary positions (simplified ephemeris)
export function getPlanetaryPositions(date = new Date()) {
    const dayOfYear = Math.floor((date - new Date(date.getFullYear(), 0, 0)) / (1000 * 60 * 60 * 24));
    const year = date.getFullYear();

    const planets = [
        { name: 'Mercury', symbol: '☿', period: 87.97, color: '#b5b5b5', size: 8, orbitRadius: 60 },
        { name: 'Venus', symbol: '♀', period: 224.7, color: '#ffcc66', size: 10, orbitRadius: 85 },
        { name: 'Earth', symbol: '🜨', period: 365.25, color: '#4da6ff', size: 11, orbitRadius: 115 },
        { name: 'Mars', symbol: '♂', period: 686.97, color: '#ff4444', size: 9, orbitRadius: 145 },
        { name: 'Jupiter', symbol: '♃', period: 4332.59, color: '#f5c842', size: 16, orbitRadius: 180 },
        { name: 'Saturn', symbol: '♄', period: 10759.22, color: '#e8d5a3', size: 14, orbitRadius: 210 },
    ];

    return planets.map(p => {
        const angle = ((dayOfYear + (year * 365.25)) / p.period) * 360 % 360;
        const radians = (angle * Math.PI) / 180;
        return {
            ...p,
            angle,
            x: Math.cos(radians) * p.orbitRadius,
            y: Math.sin(radians) * p.orbitRadius,
        };
    });
}

// Check retrogrades (simplified)
export function getRetrogrades(date = new Date()) {
    const year = date.getFullYear();
    // Approximate retrograde periods for 2025-2027
    const retrogrades = [
        {
            planet: 'Mercury', symbol: '☿', periods: [
                { start: `${year}-03-14`, end: `${year}-04-07` },
                { start: `${year}-07-17`, end: `${year}-08-11` },
                { start: `${year}-11-09`, end: `${year}-11-29` },
            ]
        },
        {
            planet: 'Venus', symbol: '♀', periods: [
                { start: `${year}-03-01`, end: `${year}-04-12` },
            ]
        },
        {
            planet: 'Mars', symbol: '♂', periods: [
                { start: `${year}-01-06`, end: `${year}-02-23` },
            ]
        },
    ];

    const dateStr = date.toISOString().split('T')[0];
    return retrogrades.map(r => {
        const isRetrograde = r.periods.some(p => dateStr >= p.start && dateStr <= p.end);
        return { ...r, isRetrograde };
    }).filter(r => r.isRetrograde);
}

// Noosphere / Consciousness Index
export function getNoosphereIndex(date = new Date()) {
    const dayOfYear = Math.floor((date - new Date(date.getFullYear(), 0, 0)) / (1000 * 60 * 60 * 24));
    const moon = getMoonPhase(date);

    // Composite consciousness index based on:
    // - Moon phase (full moon = peak collective consciousness)
    // - Time of year (equinoxes and solstices are peaks)
    // - Schumann resonance simulation (7.83 Hz base)

    const lunarFactor = moon.illumination / 100;
    const equinoxProximity = Math.cos((dayOfYear - 80) * 2 * Math.PI / 365.25) * 0.5 + 0.5; // March equinox baseline
    const schumannVariation = Math.sin(dayOfYear * 0.1) * 0.15 + 0.85;
    const collectiveSync = (lunarFactor * 0.4 + equinoxProximity * 0.3 + schumannVariation * 0.3);

    const index = Math.round(collectiveSync * 100);

    let level, description, color;
    if (index >= 85) {
        level = 'Transcendent'; description = 'Global feminine consciousness is at peak resonance. Deep connections form across continents. Trust your intuition completely.'; color = '#ffd700';
    } else if (index >= 70) {
        level = 'Elevated'; description = 'Strong collective awareness. Women worldwide are experiencing heightened synchronicity and shared dreams.'; color = '#00f5d4';
    } else if (index >= 50) {
        level = 'Balanced'; description = 'Steady consciousness flow. Individual awareness is strong. Community connections are nurturing and supportive.'; color = '#a855f7';
    } else if (index >= 30) {
        level = 'Introspective'; description = 'Collective energy turns inward. A time for personal reflection and solo spiritual practice.'; color = '#ff5c9e';
    } else {
        level = 'Resting'; description = 'The global consciousness field is in restoration. Like the new moon, the noosphere gathers energy for its next expansion.'; color = '#6b21a8';
    }

    return {
        index,
        level,
        description,
        color,
        lunarFactor: Math.round(lunarFactor * 100),
        schumannResonance: (7.83 * schumannVariation).toFixed(2),
        globalSyncWave: Math.round(equinoxProximity * 100),
    };
}

// Get cosmic events near a date
export function getCosmicEvents(date = new Date()) {
    const month = date.getMonth();
    const day = date.getDate();

    const events = [
        { month: 0, day: 20, name: 'Aquarius Season Begins', type: 'zodiac', emoji: '♒' },
        { month: 1, day: 19, name: 'Pisces Season Begins', type: 'zodiac', emoji: '♓' },
        { month: 2, day: 20, name: 'Spring Equinox', type: 'solar', emoji: '🌸' },
        { month: 2, day: 21, name: 'Aries Season Begins', type: 'zodiac', emoji: '♈' },
        { month: 3, day: 20, name: 'Taurus Season Begins', type: 'zodiac', emoji: '♉' },
        { month: 4, day: 21, name: 'Gemini Season Begins', type: 'zodiac', emoji: '♊' },
        { month: 5, day: 21, name: 'Summer Solstice', type: 'solar', emoji: '☀️' },
        { month: 5, day: 21, name: 'Cancer Season Begins', type: 'zodiac', emoji: '♋' },
        { month: 6, day: 23, name: 'Leo Season Begins', type: 'zodiac', emoji: '♌' },
        { month: 7, day: 23, name: 'Virgo Season Begins', type: 'zodiac', emoji: '♍' },
        { month: 8, day: 22, name: 'Autumn Equinox', type: 'solar', emoji: '🍂' },
        { month: 8, day: 23, name: 'Libra Season Begins', type: 'zodiac', emoji: '♎' },
        { month: 9, day: 23, name: 'Scorpio Season Begins', type: 'zodiac', emoji: '♏' },
        { month: 10, day: 22, name: 'Sagittarius Season Begins', type: 'zodiac', emoji: '♐' },
        { month: 11, day: 21, name: 'Winter Solstice', type: 'solar', emoji: '❄️' },
        { month: 11, day: 22, name: 'Capricorn Season Begins', type: 'zodiac', emoji: '♑' },
    ];

    // Find upcoming events within 14 days
    const upcoming = [];
    for (let i = 0; i < 14; i++) {
        const checkDate = new Date(date);
        checkDate.setDate(checkDate.getDate() + i);
        const cm = checkDate.getMonth();
        const cd = checkDate.getDate();
        events.forEach(e => {
            if (e.month === cm && e.day === cd) {
                upcoming.push({ ...e, daysAway: i, date: new Date(checkDate) });
            }
        });
    }

    return upcoming;
}
