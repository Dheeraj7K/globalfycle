/* SYNC ENGINE — Global Period Synchronization */
import { PHASES } from './cycleEngine.js';

const CITIES = [
    { city: 'São Paulo', country: 'Brazil', lat: -23.55, lng: -46.63, region: 'South America' },
    { city: 'Buenos Aires', country: 'Argentina', lat: -34.60, lng: -58.38, region: 'South America' },
    { city: 'Bogotá', country: 'Colombia', lat: 4.71, lng: -74.07, region: 'South America' },
    { city: 'Lima', country: 'Peru', lat: -12.04, lng: -77.03, region: 'South America' },
    { city: 'Mexico City', country: 'Mexico', lat: 19.43, lng: -99.13, region: 'North America' },
    { city: 'New York', country: 'USA', lat: 40.71, lng: -74.01, region: 'North America' },
    { city: 'Los Angeles', country: 'USA', lat: 34.05, lng: -118.24, region: 'North America' },
    { city: 'Toronto', country: 'Canada', lat: 43.65, lng: -79.38, region: 'North America' },
    { city: 'London', country: 'UK', lat: 51.51, lng: -0.13, region: 'Europe' },
    { city: 'Paris', country: 'France', lat: 48.86, lng: 2.35, region: 'Europe' },
    { city: 'Berlin', country: 'Germany', lat: 52.52, lng: 13.41, region: 'Europe' },
    { city: 'Moscow', country: 'Russia', lat: 55.76, lng: 37.62, region: 'Europe' },
    { city: 'Rome', country: 'Italy', lat: 41.90, lng: 12.50, region: 'Europe' },
    { city: 'Istanbul', country: 'Turkey', lat: 41.01, lng: 28.98, region: 'Europe' },
    { city: 'Tokyo', country: 'Japan', lat: 35.68, lng: 139.69, region: 'Asia' },
    { city: 'Mumbai', country: 'India', lat: 19.08, lng: 72.88, region: 'Asia' },
    { city: 'Delhi', country: 'India', lat: 28.61, lng: 77.21, region: 'Asia' },
    { city: 'Shanghai', country: 'China', lat: 31.23, lng: 121.47, region: 'Asia' },
    { city: 'Bangkok', country: 'Thailand', lat: 13.76, lng: 100.50, region: 'Asia' },
    { city: 'Jakarta', country: 'Indonesia', lat: -6.21, lng: 106.85, region: 'Asia' },
    { city: 'Seoul', country: 'South Korea', lat: 37.57, lng: 126.98, region: 'Asia' },
    { city: 'Singapore', country: 'Singapore', lat: 1.35, lng: 103.82, region: 'Asia' },
    { city: 'Lagos', country: 'Nigeria', lat: 6.52, lng: 3.38, region: 'Africa' },
    { city: 'Cairo', country: 'Egypt', lat: 30.04, lng: 31.24, region: 'Africa' },
    { city: 'Nairobi', country: 'Kenya', lat: -1.29, lng: 36.82, region: 'Africa' },
    { city: 'Cape Town', country: 'South Africa', lat: -33.93, lng: 18.42, region: 'Africa' },
    { city: 'Sydney', country: 'Australia', lat: -33.87, lng: 151.21, region: 'Oceania' },
    { city: 'Auckland', country: 'New Zealand', lat: -36.85, lng: 174.76, region: 'Oceania' },
    { city: 'Dubai', country: 'UAE', lat: 25.20, lng: 55.27, region: 'Middle East' },
    { city: 'Tehran', country: 'Iran', lat: 35.69, lng: 51.39, region: 'Middle East' },
];

const NAMES = ['Luna', 'Aurora', 'Stella', 'Celeste', 'Iris', 'Nova', 'Aria', 'Maya', 'Sage', 'Ivy', 'Jade', 'Ruby', 'Pearl', 'Coral', 'Flora', 'Violet', 'Ember', 'Willow', 'Rain', 'Sky', 'Dawn', 'Harmony', 'Serena', 'Sol', 'Gaia', 'Freya', 'Kira', 'Zara', 'Amara', 'Nadia', 'Yuki', 'Mei', 'Priya', 'Asha', 'Lila', 'Suki', 'Nia', 'Alina', 'Rosa', 'Thea'];

function seededRandom(seed) {
    const x = Math.sin(seed) * 10000;
    return x - Math.floor(x);
}

export function generateGlobalUsers(count = 3000) {
    const users = [];
    for (let i = 0; i < count; i++) {
        const city = CITIES[Math.floor(seededRandom(i * 7 + 3) * CITIES.length)];
        const lat = city.lat + (seededRandom(i * 13 + 1) - 0.5) * 3;
        const lng = city.lng + (seededRandom(i * 17 + 2) - 0.5) * 3;
        const cycleLength = 25 + Math.floor(seededRandom(i * 23 + 5) * 10);
        const periodLength = 3 + Math.floor(seededRandom(i * 29 + 7) * 4);
        const currentDay = 1 + Math.floor(seededRandom(i * 31 + 11) * cycleLength);
        let phase;
        if (currentDay <= periodLength) phase = 'menstrual';
        else if (currentDay <= Math.floor(cycleLength * 0.46)) phase = 'follicular';
        else if (currentDay <= Math.floor(cycleLength * 0.54)) phase = 'ovulation';
        else phase = 'luteal';
        users.push({
            id: `u${i}`, name: NAMES[Math.floor(seededRandom(i * 37 + 13) * NAMES.length)],
            city: city.city, country: city.country, region: city.region, lat, lng,
            cycleDay: currentDay, cycleLength, periodLength, phase,
            phaseData: PHASES[phase], flowLevel: phase === 'menstrual' ? 1 + Math.floor(seededRandom(i * 41) * 5) : 0,
            syncScore: 0,
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
        syncPercentage: Math.round((synced / total) * 100),
        topCountries: Object.entries(countries).sort((a, b) => b[1] - a[1]).slice(0, 10).map(([country, count]) => ({ country, count })),
    };
}

export const GLOBAL_EVENTS = [
    { lat: 40.71, lng: -74.01, name: "Women's Health Summit", type: 'event', emoji: '🎗️' },
    { lat: 48.86, lng: 2.35, name: "Int'l Women's Day March", type: 'event', emoji: '✊' },
    { lat: 35.68, lng: 139.69, name: 'Moon Festival Gathering', type: 'spiritual', emoji: '🌕' },
    { lat: -33.87, lng: 151.21, name: 'Sacred Feminine Workshop', type: 'spiritual', emoji: '🔮' },
    { lat: 19.08, lng: 72.88, name: 'Ayurvedic Cycle Retreat', type: 'wellness', emoji: '🧘' },
    { lat: -1.29, lng: 36.82, name: "African Women's Circle", type: 'community', emoji: '🌍' },
    { lat: 52.52, lng: 13.41, name: 'FemTech Conference', type: 'event', emoji: '💻' },
    { lat: -23.55, lng: -46.63, name: 'Goddess Ritual Gathering', type: 'spiritual', emoji: '🌸' },
];
