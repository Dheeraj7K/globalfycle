/* SYNC ENGINE — Global Period Synchronization */
/* Note: Real sync requires backend. This module provides simulated framework. */
import { PHASES } from './cycleEngine.js';

// Real city coordinates for future Firestore-backed users
const CITIES = [
    { city: 'São Paulo', country: 'Brazil', lat: -23.55, lng: -46.63, region: 'South America' },
    { city: 'New York', country: 'USA', lat: 40.71, lng: -74.01, region: 'North America' },
    { city: 'London', country: 'UK', lat: 51.51, lng: -0.13, region: 'Europe' },
    { city: 'Tokyo', country: 'Japan', lat: 35.68, lng: 139.69, region: 'Asia' },
    { city: 'Mumbai', country: 'India', lat: 19.08, lng: 72.88, region: 'Asia' },
    { city: 'Lagos', country: 'Nigeria', lat: 6.52, lng: 3.38, region: 'Africa' },
    { city: 'Sydney', country: 'Australia', lat: -33.87, lng: 151.21, region: 'Oceania' },
    { city: 'Berlin', country: 'Germany', lat: 52.52, lng: 13.41, region: 'Europe' },
    { city: 'Dubai', country: 'UAE', lat: 25.20, lng: 55.27, region: 'Middle East' },
    { city: 'Seoul', country: 'South Korea', lat: 37.57, lng: 126.98, region: 'Asia' },
    { city: 'Mexico City', country: 'Mexico', lat: 19.43, lng: -99.13, region: 'North America' },
    { city: 'Paris', country: 'France', lat: 48.86, lng: 2.35, region: 'Europe' },
    { city: 'Jakarta', country: 'Indonesia', lat: -6.21, lng: 106.85, region: 'Asia' },
    { city: 'Cairo', country: 'Egypt', lat: 30.04, lng: 31.24, region: 'Africa' },
    { city: 'Lima', country: 'Peru', lat: -12.05, lng: -77.04, region: 'South America' },
    { city: 'Bangkok', country: 'Thailand', lat: 13.76, lng: 100.50, region: 'Asia' },
    { city: 'Nairobi', country: 'Kenya', lat: -1.29, lng: 36.82, region: 'Africa' },
    { city: 'Toronto', country: 'Canada', lat: 43.65, lng: -79.38, region: 'North America' },
    { city: 'Moscow', country: 'Russia', lat: 55.76, lng: 37.62, region: 'Europe' },
    { city: 'Buenos Aires', country: 'Argentina', lat: -34.60, lng: -58.38, region: 'South America' },
];

export { CITIES };

// Seeded PRNG for deterministic-per-day user generation
function seededRandom(seed) {
    let s = seed;
    return () => {
        s = (s * 16807 + 0) % 2147483647;
        return (s - 1) / 2147483646;
    };
}

// Name pool for simulated users
const FIRST_NAMES = [
    'Luna', 'Aria', 'Maya', 'Zara', 'Ines', 'Yuki', 'Priya', 'Amara', 'Sofia', 'Leila',
    'Noor', 'Sakura', 'Aditi', 'Nia', 'Mei', 'Freya', 'Isla', 'Diya', 'Lena', 'Kira',
    'Aisha', 'Mila', 'Jade', 'Hana', 'Rosa', 'Ava', 'Sia', 'Riya', 'Iris', 'Eve',
    'Sana', 'Zuri', 'Nyla', 'Kaya', 'Tara', 'Vera', 'Nina', 'Alma', 'Cleo', 'Yara',
    'Suki', 'Bao', 'Elin', 'Naia', 'Rumi', 'Lila', 'Uma', 'Faye', 'Sera', 'Anya',
];

// Generate simulated global users (deterministic per day so map stays consistent)
export function generateGlobalUsers(count = 3000) {
    const today = new Date();
    const daySeed = today.getFullYear() * 10000 + (today.getMonth() + 1) * 100 + today.getDate();
    const rng = seededRandom(daySeed);

    const phaseNames = Object.keys(PHASES);
    const users = [];

    for (let i = 0; i < count; i++) {
        const cityData = CITIES[Math.floor(rng() * CITIES.length)];
        // Add location jitter (±2 degrees) for visual spread
        const lat = cityData.lat + (rng() - 0.5) * 4;
        const lng = cityData.lng + (rng() - 0.5) * 4;

        const cycleLength = Math.floor(rng() * 14) + 24; // 24-37 days
        const cycleDay = Math.floor(rng() * cycleLength) + 1;
        const periodLength = Math.floor(rng() * 4) + 3; // 3-6 days
        const flowLevel = cycleDay <= periodLength ? Math.floor(rng() * 4) + 1 : 0;

        // Determine phase from cycle day
        let phase;
        if (cycleDay <= periodLength) phase = 'menstrual';
        else if (cycleDay <= Math.floor(cycleLength * 0.46)) phase = 'follicular';
        else if (cycleDay <= Math.floor(cycleLength * 0.54)) phase = 'ovulation';
        else phase = 'luteal';

        const phaseData = PHASES[phase];
        const firstName = FIRST_NAMES[Math.floor(rng() * FIRST_NAMES.length)];
        // Generate a stable "last active" time in minutes for this user
        const lastActiveMinutes = Math.floor(rng() * 120) + 1;

        users.push({
            id: `sim-${i}`,
            name: firstName,
            city: cityData.city,
            country: cityData.country,
            region: cityData.region,
            lat,
            lng,
            cycleDay,
            cycleLength,
            periodLength,
            phase,
            phaseData: { name: phaseData.name, emoji: phaseData.emoji },
            flowLevel,
            lastActiveMinutes,
        });
    }
    return users;
}

export function calculateSyncScores(users, userDay, userPhase, userCycleLength = 28) {
    return users.map(u => {
        let score = 0;
        const dayDiff = Math.abs(u.cycleDay - userDay);
        if (dayDiff === 0) score += 40; else if (dayDiff <= 1) score += 30; else if (dayDiff <= 3) score += 15;
        if (u.phase === userPhase) score += 35;
        if (Math.abs(u.cycleLength - userCycleLength) <= 1) score += 15;
        else if (Math.abs(u.cycleLength - userCycleLength) <= 3) score += 8;
        if (u.flowLevel > 0 && userPhase === 'menstrual') score += 10;
        return { ...u, syncScore: Math.min(score, 100), isSynced: score >= 30, isExactTwin: score >= 85, isSameDay: dayDiff === 0, isSamePhase: u.phase === userPhase };
    });
}

export function getSyncStats(syncedUsers) {
    const total = syncedUsers.length;
    const synced = syncedUsers.filter(u => u.isSynced).length;
    const countries = {};
    syncedUsers.filter(u => u.isSynced).forEach(u => { countries[u.country] = (countries[u.country] || 0) + 1; });
    return {
        total, synced, exactTwins: syncedUsers.filter(u => u.isExactTwin).length,
        sameDay: syncedUsers.filter(u => u.isSameDay).length, samePhase: syncedUsers.filter(u => u.isSamePhase).length,
        syncPercentage: total > 0 ? Math.round((synced / total) * 100) : 0,
        topCountries: Object.entries(countries).sort((a, b) => b[1] - a[1]).slice(0, 10).map(([country, count]) => ({ country, count })),
    };
}

export const GLOBAL_EVENTS = [];
