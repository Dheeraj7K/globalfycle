/* SYNC ENGINE — Global Period Synchronization */
/* Note: Real sync requires backend. This module provides the framework. */
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
];

export { CITIES };

// Placeholder: returns empty until real users exist in Firestore
export function generateGlobalUsers(count = 0) {
    return [];
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
