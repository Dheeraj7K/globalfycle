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

// ─── Natal Chart from Birth Data ───
export function getNatalChart(dob, birthTime, birthPlace) {
    if (!dob) return null;

    const birthDate = new Date(dob);
    const sunSign = getZodiacSign(birthDate);

    // ─── Moon Sign (approximate from lunar position at birth) ───
    const ZODIAC_ORDER = ['Aries', 'Taurus', 'Gemini', 'Cancer', 'Leo', 'Virgo',
        'Libra', 'Scorpio', 'Sagittarius', 'Capricorn', 'Aquarius', 'Pisces'];
    const SIGN_EMOJIS = {
        Aries: '♈', Taurus: '♉', Gemini: '♊', Cancer: '♋', Leo: '♌', Virgo: '♍',
        Libra: '♎', Scorpio: '♏', Sagittarius: '♐', Capricorn: '♑', Aquarius: '♒', Pisces: '♓'
    };
    const ELEMENTS = {
        Aries: 'Fire', Taurus: 'Earth', Gemini: 'Air', Cancer: 'Water',
        Leo: 'Fire', Virgo: 'Earth', Libra: 'Air', Scorpio: 'Water',
        Sagittarius: 'Fire', Capricorn: 'Earth', Aquarius: 'Air', Pisces: 'Water'
    };
    const MODALITIES = {
        Aries: 'Cardinal', Taurus: 'Fixed', Gemini: 'Mutable', Cancer: 'Cardinal',
        Leo: 'Fixed', Virgo: 'Mutable', Libra: 'Cardinal', Scorpio: 'Fixed',
        Sagittarius: 'Mutable', Capricorn: 'Cardinal', Aquarius: 'Fixed', Pisces: 'Mutable'
    };
    const RULERS = {
        Aries: 'Mars', Taurus: 'Venus', Gemini: 'Mercury', Cancer: 'Moon',
        Leo: 'Sun', Virgo: 'Mercury', Libra: 'Venus', Scorpio: 'Pluto',
        Sagittarius: 'Jupiter', Capricorn: 'Saturn', Aquarius: 'Uranus', Pisces: 'Neptune'
    };

    // Moon moves ~13.2° per day, completing the zodiac in ~27.3 days
    // Use the same lunar algorithm to find where the moon was at birth
    const moonPhaseAtBirth = getMoonPhase(birthDate);
    const moonZodiacIndex = Math.floor((moonPhaseAtBirth.phase / 27.3) * 12) % 12;
    const moonSign = ZODIAC_ORDER[moonZodiacIndex];

    // ─── Rising Sign (Ascendant) — approximation from birth time ───
    // The ascendant changes every ~2 hours through the zodiac
    // At sunrise the ascendant = sun sign. Each 2hr block advances one sign.
    let risingSign = null;
    let risingAvailable = false;
    if (birthTime && birthTime.includes(':')) {
        const [h] = birthTime.split(':').map(Number);
        // Sunrise approximation = 6 AM. Hours from sunrise / 2 = signs offset from sun sign
        const hoursFromSunrise = ((h - 6) + 24) % 24;
        const signOffset = Math.floor(hoursFromSunrise / 2);
        const sunIndex = ZODIAC_ORDER.indexOf(sunSign.sign);
        const risingIndex = (sunIndex + signOffset) % 12;
        risingSign = ZODIAC_ORDER[risingIndex];
        risingAvailable = true;
    }

    // ─── Element Balance ───
    const signs = [sunSign.sign, moonSign, risingSign].filter(Boolean);
    const elementCount = { Fire: 0, Earth: 0, Air: 0, Water: 0 };
    signs.forEach(s => { if (ELEMENTS[s]) elementCount[ELEMENTS[s]]++; });
    const dominantElement = Object.entries(elementCount).sort((a, b) => b[1] - a[1])[0][0];

    // ─── Modality Balance ───
    const modalityCount = { Cardinal: 0, Fixed: 0, Mutable: 0 };
    signs.forEach(s => { if (MODALITIES[s]) modalityCount[MODALITIES[s]]++; });
    const dominantModality = Object.entries(modalityCount).sort((a, b) => b[1] - a[1])[0][0];

    return {
        sunSign: {
            sign: sunSign.sign,
            emoji: sunSign.emoji || SIGN_EMOJIS[sunSign.sign],
            element: sunSign.element,
            ruler: RULERS[sunSign.sign],
        },
        moonSign: {
            sign: moonSign,
            emoji: SIGN_EMOJIS[moonSign],
            element: ELEMENTS[moonSign],
            ruler: RULERS[moonSign],
            note: 'Approximate — based on lunar position at birth date',
        },
        risingSign: risingAvailable ? {
            sign: risingSign,
            emoji: SIGN_EMOJIS[risingSign],
            element: ELEMENTS[risingSign],
            ruler: RULERS[risingSign],
            note: 'Approximate — based on birth hour (exact requires location coordinates)',
        } : null,
        dominantElement,
        elementBalance: elementCount,
        dominantModality,
        modalityBalance: modalityCount,
        birthPlace: birthPlace || null,
    };
}

// ─── REAL Planetary Positions using J2000 Keplerian Orbital Elements ───
// Source: NASA/JPL "Keplerian Elements for Approximate Positions of the Major Planets"
// Accuracy: ~1° for inner planets, ~2° for outer planets (sufficient for visual orrery)

function julianDate(date) {
    const y = date.getFullYear();
    const m = date.getMonth() + 1;
    const d = date.getDate() + date.getHours() / 24;
    const a = Math.floor((14 - m) / 12);
    const yy = y + 4800 - a;
    const mm = m + 12 * a - 3;
    return d + Math.floor((153 * mm + 2) / 5) + 365 * yy + Math.floor(yy / 4) - Math.floor(yy / 100) + Math.floor(yy / 400) - 32045.5;
}

function solveKepler(M, e, tol = 1e-8) {
    // Solve Kepler's equation M = E - e*sin(E) via Newton-Raphson
    let E = M;
    for (let i = 0; i < 100; i++) {
        const dE = (E - e * Math.sin(E) - M) / (1 - e * Math.cos(E));
        E -= dE;
        if (Math.abs(dE) < tol) break;
    }
    return E;
}

// J2000 orbital elements [a(AU), e, I(deg), L(deg), longPeri(deg), longNode(deg)]
// and century rates       [da,     de, dI,     dL,    dwBar,       dOmega]
const ORBITAL_ELEMENTS = {
    Mercury: {
        a0: 0.38709927, da: 0.00000037, e0: 0.20563593, de: 0.00001906,
        I0: 7.00497902, dI: -0.00594749, L0: 252.25032350, dL: 149472.67411175,
        wBar0: 77.45779628, dwBar: 0.16047689, Om0: 48.33076593, dOm: -0.12534081,
        color: '#b5b5b5', size: 6, symbol: '☿',
    },
    Venus: {
        a0: 0.72333566, da: 0.00000390, e0: 0.00677672, de: -0.00004107,
        I0: 3.39467605, dI: -0.00078890, L0: 181.97909950, dL: 58517.81538729,
        wBar0: 131.60246718, dwBar: 0.00268329, Om0: 76.67984255, dOm: -0.27769418,
        color: '#ffcc66', size: 9, symbol: '♀',
    },
    Earth: {
        a0: 1.00000261, da: 0.00000562, e0: 0.01671123, de: -0.00004392,
        I0: -0.00001531, dI: -0.01294668, L0: 100.46457166, dL: 35999.37244981,
        wBar0: 102.93768193, dwBar: 0.32327364, Om0: 0.0, dOm: 0.0,
        color: '#4da6ff', size: 10, symbol: '🜨',
    },
    Mars: {
        a0: 1.52371034, da: 0.00001847, e0: 0.09339410, de: 0.00007882,
        I0: 1.84969142, dI: -0.00813131, L0: -4.55343205, dL: 19140.30268499,
        wBar0: -23.94362959, dwBar: 0.44441088, Om0: 49.55953891, dOm: -0.29257343,
        color: '#ff4444', size: 8, symbol: '♂',
    },
    Jupiter: {
        a0: 5.20288700, da: -0.00011607, e0: 0.04838624, de: -0.00013253,
        I0: 1.30439695, dI: -0.00183714, L0: 34.39644051, dL: 3034.74612775,
        wBar0: 14.72847983, dwBar: 0.21252668, Om0: 100.47390909, dOm: 0.20469106,
        color: '#f5c842', size: 14, symbol: '♃',
    },
    Saturn: {
        a0: 9.53667594, da: -0.00125060, e0: 0.05386179, de: -0.00050991,
        I0: 2.48599187, dI: 0.00193609, L0: 49.95424423, dL: 1222.49362201,
        wBar0: 92.59887831, dwBar: -0.41897216, Om0: 113.66242448, dOm: -0.28867794,
        color: '#e8d5a3', size: 12, symbol: '♄',
    },
    Uranus: {
        a0: 19.18916464, da: -0.00196176, e0: 0.04725744, de: -0.00004397,
        I0: 0.77263783, dI: -0.00242939, L0: 313.23810451, dL: 428.48202785,
        wBar0: 170.95427630, dwBar: 0.40805281, Om0: 74.01692503, dOm: 0.04240589,
        color: '#7fdbff', size: 11, symbol: '⛢',
    },
    Neptune: {
        a0: 30.06992276, da: 0.00026291, e0: 0.00859048, de: 0.00005105,
        I0: 1.77004347, dI: 0.00035372, L0: -55.12002969, dL: 218.45945325,
        wBar0: 44.96476227, dwBar: -0.32241464, Om0: 131.78422574, dOm: -0.00508664,
        color: '#4169e1', size: 11, symbol: '♆',
    },
};

const ZODIAC_SIGNS_30 = [
    { sign: 'Aries', emoji: '♈' }, { sign: 'Taurus', emoji: '♉' }, { sign: 'Gemini', emoji: '♊' },
    { sign: 'Cancer', emoji: '♋' }, { sign: 'Leo', emoji: '♌' }, { sign: 'Virgo', emoji: '♍' },
    { sign: 'Libra', emoji: '♎' }, { sign: 'Scorpio', emoji: '♏' }, { sign: 'Sagittarius', emoji: '♐' },
    { sign: 'Capricorn', emoji: '♑' }, { sign: 'Aquarius', emoji: '♒' }, { sign: 'Pisces', emoji: '♓' },
];

function eclipticLongitudeToZodiac(lon) {
    const norm = ((lon % 360) + 360) % 360;
    const idx = Math.floor(norm / 30);
    const deg = Math.floor(norm % 30);
    return { ...ZODIAC_SIGNS_30[idx], degree: deg, totalDegrees: norm };
}

export function getPlanetaryPositions(date = new Date()) {
    const JD = julianDate(date);
    const T = (JD - 2451545.0) / 36525.0; // centuries since J2000

    const results = [];
    let earthLon = 0; // we need Earth's longitude to compute geocentric positions

    // First pass: compute heliocentric ecliptic longitude for each planet
    for (const [name, el] of Object.entries(ORBITAL_ELEMENTS)) {
        const a = el.a0 + el.da * T;
        const e = el.e0 + el.de * T;
        const L = ((el.L0 + el.dL * T) % 360 + 360) % 360; // mean longitude (deg)
        const wBar = el.wBar0 + el.dwBar * T;               // longitude of perihelion (deg)

        // Mean anomaly
        const M = ((L - wBar) % 360 + 360) % 360;
        const M_rad = M * Math.PI / 180;

        // Solve Kepler's equation for Eccentric anomaly
        const E = solveKepler(M_rad, e);

        // True anomaly
        const nu = 2 * Math.atan2(
            Math.sqrt(1 + e) * Math.sin(E / 2),
            Math.sqrt(1 - e) * Math.cos(E / 2)
        );

        // Heliocentric ecliptic longitude
        const helioLon = ((nu * 180 / Math.PI + wBar) % 360 + 360) % 360;

        // Heliocentric distance
        const r = a * (1 - e * Math.cos(E));

        // Heliocentric cartesian (ecliptic plane, simplified — ignoring inclination for 2D orrery)
        const helioLonRad = helioLon * Math.PI / 180;
        const x_AU = r * Math.cos(helioLonRad);
        const y_AU = r * Math.sin(helioLonRad);

        if (name === 'Earth') earthLon = helioLon;

        results.push({
            name, symbol: el.symbol, color: el.color, size: el.size,
            a, e, helioLon, r,
            x_AU, y_AU,
            zodiac: eclipticLongitudeToZodiac(helioLon),
        });
    }

    // Second pass: compute geocentric ecliptic longitude for each planet
    const earthData = results.find(p => p.name === 'Earth');
    for (const p of results) {
        if (p.name === 'Earth') {
            // For Earth, geocentric longitude is Sun's position (opposite)
            p.geoLon = ((earthLon + 180) % 360 + 360) % 360;
        } else {
            // Geocentric longitude from Earth's perspective
            const dx = p.x_AU - earthData.x_AU;
            const dy = p.y_AU - earthData.y_AU;
            p.geoLon = ((Math.atan2(dy, dx) * 180 / Math.PI) % 360 + 360) % 360;
        }
        p.geoZodiac = eclipticLongitudeToZodiac(p.geoLon);
    }

    return results;
}

// ─── Detect retrogrades from real orbital motion ───
// A planet is retrograde when its geocentric longitude is decreasing (apparent backward motion)
export function getRetrogrades(date = new Date()) {
    const yesterday = new Date(date); yesterday.setDate(yesterday.getDate() - 2);
    const tomorrow = new Date(date); tomorrow.setDate(tomorrow.getDate() + 2);

    const posNow = getPlanetaryPositions(date);
    const posBefore = getPlanetaryPositions(yesterday);
    const posAfter = getPlanetaryPositions(tomorrow);

    const results = [];
    const PLANETS_TO_CHECK = ['Mercury', 'Venus', 'Mars', 'Jupiter', 'Saturn', 'Uranus', 'Neptune'];

    for (const name of PLANETS_TO_CHECK) {
        const now = posNow.find(p => p.name === name);
        const before = posBefore.find(p => p.name === name);
        const after = posAfter.find(p => p.name === name);
        if (!now || !before || !after) continue;

        // Check if geocentric longitude is decreasing (retrograde)
        // Handle wrap-around at 0°/360°
        let dLon = after.geoLon - before.geoLon;
        if (dLon > 180) dLon -= 360;
        if (dLon < -180) dLon += 360;

        if (dLon < 0) {
            results.push({
                planet: name,
                symbol: now.symbol,
                isRetrograde: true,
                apparentMotion: dLon.toFixed(2) + '°/day',
            });
        }
    }

    return results;
}

// Noosphere / Consciousness Index
export function getNoosphereIndex(date = new Date()) {
    const dayOfYear = Math.floor((date - new Date(date.getFullYear(), 0, 0)) / (1000 * 60 * 60 * 24));
    const moon = getMoonPhase(date);

    const lunarFactor = moon.illumination / 100;
    const equinoxProximity = Math.cos((dayOfYear - 80) * 2 * Math.PI / 365.25) * 0.5 + 0.5;
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
        index, level, description, color,
        lunarFactor: Math.round(lunarFactor * 100),
        schumannResonance: (7.83 * schumannVariation).toFixed(2),
        globalSyncWave: Math.round(equinoxProximity * 100),
    };
}

// ─── Comprehensive Cosmic Events Engine ───
// Combines: auto-detected alignments + known astronomical events + zodiac transitions

function angularDistance(lon1, lon2) {
    let d = Math.abs(lon1 - lon2);
    if (d > 180) d = 360 - d;
    return d;
}

function detectPlanetaryAlignments(date) {
    const events = [];
    const positions = getPlanetaryPositions(date);
    const visible = positions.filter(p => p.name !== 'Earth'); // only non-Earth planets

    // ─── Planetary Parade Detection ───
    // Check if 3+ planets are within a 40° arc (as seen geocentrically)
    const geoLons = visible.map(p => ({ name: p.name, symbol: p.symbol, geoLon: p.geoLon, geoZodiac: p.geoZodiac }));
    geoLons.sort((a, b) => a.geoLon - b.geoLon);

    // Sliding window to find clusters
    for (let i = 0; i < geoLons.length; i++) {
        const cluster = [geoLons[i]];
        for (let j = 1; j < geoLons.length; j++) {
            const idx = (i + j) % geoLons.length;
            let dist = geoLons[idx].geoLon - geoLons[i].geoLon;
            if (dist < 0) dist += 360;
            if (dist <= 45) {
                cluster.push(geoLons[idx]);
            }
        }

        if (cluster.length >= 6) {
            const names = cluster.map(c => c.name).join(', ');
            events.push({
                name: `Grand Planetary Parade: ${cluster.length} planets aligned!`,
                emoji: '🪐✨',
                type: 'parade',
                priority: 1,
                desc: `${names} are all visible within a ${Math.round(45)}° arc — a spectacular celestial event!`,
                planets: cluster,
            });
            break; // Don't double-count
        } else if (cluster.length >= 4) {
            const names = cluster.map(c => c.name).join(', ');
            events.push({
                name: `Planetary Parade: ${cluster.length} planets aligned`,
                emoji: '🪐',
                type: 'parade',
                priority: 2,
                desc: `${names} are clustered together in the sky — a beautiful alignment visible to the naked eye.`,
                planets: cluster,
            });
            break;
        } else if (cluster.length === 3) {
            const names = cluster.map(c => c.name).join(', ');
            events.push({
                name: `Triple Alignment: ${names}`,
                emoji: '🔱',
                type: 'alignment',
                priority: 3,
                desc: `Three planets gather closely — a noteworthy cosmic convergence.`,
                planets: cluster,
            });
            break;
        }
    }

    // ─── Close Conjunctions (2 planets within 8°) ───
    for (let i = 0; i < visible.length; i++) {
        for (let j = i + 1; j < visible.length; j++) {
            const dist = angularDistance(visible[i].geoLon, visible[j].geoLon);
            if (dist <= 8) {
                events.push({
                    name: `${visible[i].name}–${visible[j].name} Conjunction`,
                    emoji: '🤝',
                    type: 'conjunction',
                    priority: dist <= 3 ? 2 : 4,
                    desc: `${visible[i].symbol} and ${visible[j].symbol} are just ${dist.toFixed(1)}° apart — a close cosmic encounter.`,
                    separation: dist,
                });
            }
        }
    }

    // ─── Opposition Detection (outer planet 180° from Sun) ───
    const earthP = positions.find(p => p.name === 'Earth');
    const sunGeoLon = ((earthP.helioLon + 180) % 360 + 360) % 360;
    ['Mars', 'Jupiter', 'Saturn', 'Uranus', 'Neptune'].forEach(name => {
        const p = visible.find(x => x.name === name);
        if (!p) return;
        const dist = angularDistance(p.geoLon, sunGeoLon);
        if (dist >= 170) {
            events.push({
                name: `${name} at Opposition`,
                emoji: '🌟',
                type: 'opposition',
                priority: 3,
                desc: `${name} is opposite the Sun — at its brightest and closest to Earth. Best viewing conditions.`,
            });
        }
    });

    return events;
}

export function getCosmicEvents(date = new Date()) {
    const year = date.getFullYear();

    // ─── 1. Auto-detect live alignments from real positions ───
    const liveEvents = detectPlanetaryAlignments(date);
    // Mark as "today" events
    liveEvents.forEach(e => { e.daysAway = 0; e.isLive = true; });

    // ─── 2. Known astronomical events database (2025-2027) ───
    const knownEvents = [
        // 2025
        { date: '2025-03-14', name: 'Total Lunar Eclipse', emoji: '🌑', type: 'eclipse' },
        { date: '2025-03-20', name: 'Spring Equinox', emoji: '🌸', type: 'solar' },
        { date: '2025-04-22', name: 'Lyrids Meteor Shower Peak', emoji: '☄️', type: 'meteor' },
        { date: '2025-05-12', name: 'Mercury at Greatest Elongation', emoji: '☿', type: 'planet' },
        { date: '2025-06-21', name: 'Summer Solstice', emoji: '☀️', type: 'solar' },
        { date: '2025-07-07', name: 'Supermoon', emoji: '🌕', type: 'moon' },
        { date: '2025-08-12', name: 'Perseids Meteor Shower Peak', emoji: '☄️', type: 'meteor' },
        { date: '2025-09-07', name: 'Saturn at Opposition', emoji: '🪐', type: 'planet' },
        { date: '2025-09-21', name: 'Partial Lunar Eclipse', emoji: '🌘', type: 'eclipse' },
        { date: '2025-09-22', name: 'Autumn Equinox', emoji: '🍂', type: 'solar' },
        { date: '2025-10-21', name: 'Orionids Meteor Shower Peak', emoji: '☄️', type: 'meteor' },
        { date: '2025-12-14', name: 'Geminids Meteor Shower Peak', emoji: '☄️', type: 'meteor' },
        { date: '2025-12-21', name: 'Winter Solstice', emoji: '❄️', type: 'solar' },
        // 2026
        { date: '2026-01-03', name: 'Quadrantids Meteor Shower Peak', emoji: '☄️', type: 'meteor' },
        { date: '2026-02-17', name: 'Total Lunar Eclipse', emoji: '🌑', type: 'eclipse' },
        { date: '2026-02-28', name: 'Planetary Parade — 7 planets aligned', emoji: '🪐✨', type: 'parade' },
        { date: '2026-03-03', name: 'Venus at Greatest Brilliance', emoji: '✨', type: 'planet' },
        { date: '2026-03-20', name: 'Spring Equinox', emoji: '🌸', type: 'solar' },
        { date: '2026-04-22', name: 'Lyrids Meteor Shower Peak', emoji: '☄️', type: 'meteor' },
        { date: '2026-05-06', name: 'Eta Aquarids Meteor Shower Peak', emoji: '☄️', type: 'meteor' },
        { date: '2026-06-21', name: 'Summer Solstice', emoji: '☀️', type: 'solar' },
        { date: '2026-07-03', name: 'Supermoon', emoji: '🌕', type: 'moon' },
        { date: '2026-08-08', name: 'Annular Solar Eclipse', emoji: '🌖', type: 'eclipse' },
        { date: '2026-08-12', name: 'Perseids Meteor Shower Peak', emoji: '☄️', type: 'meteor' },
        { date: '2026-08-28', name: 'Total Solar Eclipse', emoji: '🌑☀️', type: 'eclipse' },
        { date: '2026-09-22', name: 'Autumn Equinox', emoji: '🍂', type: 'solar' },
        { date: '2026-10-21', name: 'Orionids Meteor Shower Peak', emoji: '☄️', type: 'meteor' },
        { date: '2026-11-04', name: 'Jupiter at Opposition', emoji: '🌟', type: 'planet' },
        { date: '2026-11-17', name: 'Leonids Meteor Shower Peak', emoji: '☄️', type: 'meteor' },
        { date: '2026-12-14', name: 'Geminids Meteor Shower Peak', emoji: '☄️', type: 'meteor' },
        { date: '2026-12-21', name: 'Winter Solstice', emoji: '❄️', type: 'solar' },
        // 2027
        { date: '2027-01-03', name: 'Quadrantids Meteor Shower Peak', emoji: '☄️', type: 'meteor' },
        { date: '2027-02-06', name: 'Annular Solar Eclipse', emoji: '🌖', type: 'eclipse' },
        { date: '2027-02-20', name: 'Penumbral Lunar Eclipse', emoji: '🌘', type: 'eclipse' },
        { date: '2027-03-20', name: 'Spring Equinox', emoji: '🌸', type: 'solar' },
        { date: '2027-06-21', name: 'Summer Solstice', emoji: '☀️', type: 'solar' },
        { date: '2027-07-18', name: 'Total Lunar Eclipse', emoji: '🌑', type: 'eclipse' },
        { date: '2027-08-02', name: 'Total Solar Eclipse', emoji: '🌑☀️', type: 'eclipse' },
        { date: '2027-08-12', name: 'Perseids Meteor Shower Peak', emoji: '☄️', type: 'meteor' },
        { date: '2027-09-22', name: 'Autumn Equinox', emoji: '🍂', type: 'solar' },
        { date: '2027-12-14', name: 'Geminids Meteor Shower Peak', emoji: '☄️', type: 'meteor' },
        { date: '2027-12-21', name: 'Winter Solstice', emoji: '❄️', type: 'solar' },
    ];

    // ─── 3. Zodiac season transitions (recurring yearly) ───
    const zodiacTransitions = [
        { month: 0, day: 20, name: 'Aquarius Season Begins', emoji: '♒' },
        { month: 1, day: 19, name: 'Pisces Season Begins', emoji: '♓' },
        { month: 2, day: 20, name: 'Aries Season Begins', emoji: '♈' },
        { month: 3, day: 20, name: 'Taurus Season Begins', emoji: '♉' },
        { month: 4, day: 21, name: 'Gemini Season Begins', emoji: '♊' },
        { month: 5, day: 21, name: 'Cancer Season Begins', emoji: '♋' },
        { month: 6, day: 23, name: 'Leo Season Begins', emoji: '♌' },
        { month: 7, day: 23, name: 'Virgo Season Begins', emoji: '♍' },
        { month: 8, day: 23, name: 'Libra Season Begins', emoji: '♎' },
        { month: 9, day: 23, name: 'Scorpio Season Begins', emoji: '♏' },
        { month: 10, day: 22, name: 'Sagittarius Season Begins', emoji: '♐' },
        { month: 11, day: 22, name: 'Capricorn Season Begins', emoji: '♑' },
    ];

    // ─── Compile: scan 30 days ahead ───
    const allUpcoming = [...liveEvents];

    for (let i = 0; i <= 30; i++) {
        const checkDate = new Date(date);
        checkDate.setDate(checkDate.getDate() + i);
        const checkStr = checkDate.toISOString().split('T')[0];
        const cm = checkDate.getMonth();
        const cd = checkDate.getDate();

        // Check known events
        knownEvents.forEach(e => {
            if (e.date === checkStr) {
                allUpcoming.push({ ...e, daysAway: i });
            }
        });

        // Check zodiac transitions
        zodiacTransitions.forEach(e => {
            if (e.month === cm && e.day === cd) {
                allUpcoming.push({ ...e, daysAway: i, type: 'zodiac' });
            }
        });

        // Auto-detect alignments for future dates (check every 3 days to stay performant)
        if (i > 0 && i % 3 === 0) {
            const futureAlignments = detectPlanetaryAlignments(checkDate);
            futureAlignments.forEach(e => {
                // Only add if we don't already have a similar event
                const isDuplicate = allUpcoming.some(existing =>
                    existing.type === e.type && existing.name === e.name
                );
                if (!isDuplicate) {
                    allUpcoming.push({ ...e, daysAway: i });
                }
            });
        }
    }

    // Deduplicate by name (keep closest)
    const seen = new Map();
    allUpcoming.forEach(e => {
        const key = e.name;
        if (!seen.has(key) || e.daysAway < seen.get(key).daysAway) {
            seen.set(key, e);
        }
    });

    // Sort by daysAway then priority
    return Array.from(seen.values()).sort((a, b) => {
        if (a.daysAway !== b.daysAway) return a.daysAway - b.daysAway;
        return (a.priority || 5) - (b.priority || 5);
    });
}
