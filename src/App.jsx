import React, { useState, useEffect, createContext, useContext } from 'react';
import Navigation from './components/Navigation';
import Dashboard from './components/Dashboard';
import CycleTracker from './components/CycleTracker';
import GlobalSyncMap from './components/GlobalSyncMap';
import CosmicMap from './components/CosmicMap';
import AIInsights from './components/AIInsights';
import Community from './components/Community';
import SpiritualEvolution from './components/SpiritualEvolution';
import MoonCalendar from './components/MoonCalendar';
import Profile from './components/Profile';
import Login from './components/Login';
import Onboarding, { generateCosmicName } from './components/Onboarding';
import DailyBriefing from './components/DailyBriefing';
import { DEFAULT_CYCLE, getCycleInfo } from './utils/cycleEngine';
import { getMoonPhase, getZodiacSign, getNoosphereIndex, getNatalChart } from './utils/cosmicEngine';
import { generateGlobalUsers, calculateSyncScores, getSyncStats } from './utils/syncEngine';
import { onAuthChange, getUserProfile, saveCycleData, saveBirthData, saveDailyLog, getDailyLog, getDailyLogs, savePeriodLog, getPeriodLogs, logOut } from './firebase';

// Global app context
export const AppContext = createContext();
export const useApp = () => useContext(AppContext);

// Default daily log with all tracking categories
const DEFAULT_DAILY_LOG = {
    symptoms: [],
    mood: null,
    flow: 0,
    notes: '',
    discharge: null,
    sexActivity: null,
    sexDrive: null,
    digestive: null,
    pregnancyTest: null,
    ovulationTest: null,
    contraceptive: null,
    emergencyContraceptive: null,
};

export default function App() {
    const [authState, setAuthState] = useState('loading');
    const [firebaseUser, setFirebaseUser] = useState(null);
    const [userProfile, setUserProfile] = useState(null);
    const [hasOnboarded, setHasOnboarded] = useState(false);
    const [showBriefing, setShowBriefing] = useState(false);
    const [currentPage, setCurrentPage] = useState('dashboard');
    const [transitioning, setTransitioning] = useState(false);
    const [cycleData, setCycleData] = useState(DEFAULT_CYCLE);
    const [dailyLog, setDailyLog] = useState({ ...DEFAULT_DAILY_LOG });
    const [birthData, setBirthData] = useState(null);
    const [periodLogs, setPeriodLogs] = useState([]);
    const [logHistory, setLogHistory] = useState([]);

    // Computed data
    const cycleInfo = getCycleInfo(cycleData.lastPeriodStart, cycleData.cycleLength, cycleData.periodLength);
    const moonData = getMoonPhase();
    const zodiac = getZodiacSign();
    const noosphere = getNoosphereIndex();
    const natalChart = birthData?.dob ? getNatalChart(birthData.dob, birthData.birthTime, birthData.birthPlace) : null;

    // Global users (generated once)
    const [globalUsers, setGlobalUsers] = useState([]);
    const [syncStats, setSyncStats] = useState(null);

    // ─── Firebase Auth Listener ───
    useEffect(() => {
        const unsubscribe = onAuthChange(async (user) => {
            if (user) {
                setFirebaseUser(user);
                const profile = await getUserProfile(user.uid);
                setUserProfile(profile);
                setHasOnboarded(profile?.onboarded || false);
                if (profile?.cycleData) setCycleData(profile.cycleData);
                if (profile?.birthData) setBirthData(profile.birthData);
                setAuthState('authenticated');
            } else {
                setFirebaseUser(null);
                setUserProfile(null);
                setHasOnboarded(false);
                setBirthData(null);
                setAuthState('unauthenticated');
            }
        });
        return () => unsubscribe();
    }, []);

    // Generate global users after auth + onboard
    useEffect(() => {
        if (authState === 'authenticated' && hasOnboarded) {
            const users = generateGlobalUsers(3000);
            const scored = calculateSyncScores(users, cycleInfo.dayOfCycle, cycleInfo.phase, cycleData.cycleLength);
            setGlobalUsers(scored);
            setSyncStats(getSyncStats(scored));
        }
    }, [authState, hasOnboarded, cycleInfo.dayOfCycle]);

    // ─── Load today's log + history from Firestore ───
    useEffect(() => {
        if (firebaseUser && hasOnboarded) {
            const today = new Date().toISOString().split('T')[0];
            getDailyLog(firebaseUser.uid, today).then(log => {
                if (log) setDailyLog(prev => ({ ...DEFAULT_DAILY_LOG, ...log }));
            });
            // Load log history
            getDailyLogs(firebaseUser.uid, 60).then(logs => {
                if (logs) setLogHistory(logs);
            });
            // Load period logs
            getPeriodLogs(firebaseUser.uid).then(logs => {
                if (logs) setPeriodLogs(logs);
            });
        }
    }, [firebaseUser, hasOnboarded]);

    // ─── Handlers ───
    const handleLogin = (user) => {
        if (user?.uid === 'demo') {
            setFirebaseUser(user);
            setAuthState('authenticated');
        }
    };

    const handleOnboardComplete = async (onboardData) => {
        const { birthData: bd, ...cycleFields } = onboardData;
        const newCycleData = { ...cycleData, ...cycleFields };
        setCycleData(newCycleData);
        if (bd) setBirthData(bd);
        setHasOnboarded(true);
        setShowBriefing(true);

        if (firebaseUser?.uid && firebaseUser.uid !== 'demo') {
            try {
                await saveCycleData(firebaseUser.uid, newCycleData);
                if (bd) await saveBirthData(firebaseUser.uid, bd);
            } catch (err) {
                console.warn('Failed to save onboarding data:', err);
            }
        }
    };

    const handleDismissBriefing = () => setShowBriefing(false);

    const handleLogOut = async () => {
        try { await logOut(); } catch (err) { console.warn('Logout error:', err); }
    };

    // Save daily log with Firestore sync
    const handleSetDailyLog = async (newLogOrUpdater, dateOverride) => {
        const newLog = typeof newLogOrUpdater === 'function' ? newLogOrUpdater(dailyLog) : newLogOrUpdater;
        const date = dateOverride || new Date().toISOString().split('T')[0];

        // Only update in-memory state if logging for today
        if (!dateOverride || dateOverride === new Date().toISOString().split('T')[0]) {
            setDailyLog(newLog);
        }

        if (firebaseUser?.uid && firebaseUser.uid !== 'demo') {
            try {
                await saveDailyLog(firebaseUser.uid, date, newLog);
                // Refresh history
                const logs = await getDailyLogs(firebaseUser.uid, 60);
                if (logs) setLogHistory(logs);
            } catch (err) {
                console.warn('Failed to save daily log:', err);
            }
        }
    };

    // Period start/end handler
    const handlePeriodLog = async (startDate, endDate) => {
        const log = { startDate, endDate: endDate || null };
        setPeriodLogs(prev => {
            const filtered = prev.filter(p => p.startDate !== startDate);
            return [log, ...filtered].sort((a, b) => b.startDate.localeCompare(a.startDate));
        });
        // Update lastPeriodStart if this is the most recent period
        const newCycleData = { ...cycleData, lastPeriodStart: startDate };
        setCycleData(newCycleData);

        if (firebaseUser?.uid && firebaseUser.uid !== 'demo') {
            try {
                await savePeriodLog(firebaseUser.uid, log);
                await saveCycleData(firebaseUser.uid, newCycleData);
            } catch (err) {
                console.warn('Failed to save period log:', err);
            }
        }
    };

    // Page transition handler
    const navigateTo = (page) => {
        if (page === currentPage) return;
        setTransitioning(true);
        setTimeout(() => {
            setCurrentPage(page);
            setTransitioning(false);
        }, 200);
    };

    const cosmicName = birthData?.cosmicName || generateCosmicName(firebaseUser?.uid);
    const user = firebaseUser ? {
        name: cosmicName,
        realName: birthData?.name || null,
        email: firebaseUser.email,
        avatar: firebaseUser.photoURL || '🌙',
        provider: firebaseUser.providerData?.[0]?.providerId || 'email',
        joinDate: userProfile?.createdAt?.toDate?.()?.toISOString() || new Date().toISOString(),
        zodiacSign: natalChart?.sunSign?.sign || zodiac.sign,
        uid: firebaseUser.uid,
    } : null;

    const contextValue = {
        user, cycleData, setCycleData, cycleInfo, moonData, zodiac, noosphere,
        globalUsers, syncStats, dailyLog, setDailyLog: handleSetDailyLog, currentPage,
        setCurrentPage: navigateTo, logOut: handleLogOut,
        showBriefing: () => setShowBriefing(true),
        birthData, natalChart, periodLogs, logHistory, handlePeriodLog,
    };

    // Loading screen
    if (authState === 'loading') {
        return (
            <div style={{
                minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
                background: '#0a0612', flexDirection: 'column', gap: 16,
            }}>
                <div style={{
                    width: 60, height: 60, borderRadius: 16,
                    background: 'linear-gradient(135deg, #ff2d78, #a855f7, #00f5d4)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2rem',
                    animation: 'float 2s ease infinite',
                }}>🌙</div>
                <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.8rem' }}>Loading your cosmic data...</p>
            </div>
        );
    }

    // Login screen
    if (authState === 'unauthenticated') {
        return <Login onLogin={handleLogin} moonData={moonData} />;
    }

    // Onboarding screen
    if (!hasOnboarded) {
        return <Onboarding onComplete={handleOnboardComplete} moonData={moonData} />;
    }

    const pages = {
        dashboard: Dashboard,
        tracker: CycleTracker,
        'global-map': GlobalSyncMap,
        cosmic: CosmicMap,
        'moon-calendar': MoonCalendar,
        ai: AIInsights,
        community: Community,
        spiritual: SpiritualEvolution,
        profile: Profile,
    };
    const PageComponent = pages[currentPage] || Dashboard;

    return (
        <AppContext.Provider value={contextValue}>
            <div className="app-layout">
                <Navigation currentPage={currentPage} onNavigate={navigateTo} cycleInfo={cycleInfo} moonData={moonData} />
                <main className={`main-content ${transitioning ? 'page-exit' : 'page-enter'}`}>
                    <PageComponent />
                </main>
            </div>

            {showBriefing && (
                <DailyBriefing
                    cycleInfo={cycleInfo}
                    moonData={moonData}
                    zodiac={zodiac}
                    noosphere={noosphere}
                    onDismiss={handleDismissBriefing}
                />
            )}
        </AppContext.Provider>
    );
}
