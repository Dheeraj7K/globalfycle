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
import Onboarding from './components/Onboarding';
import DailyBriefing from './components/DailyBriefing';
import { DEFAULT_CYCLE, getCycleInfo } from './utils/cycleEngine';
import { getMoonPhase, getZodiacSign, getNoosphereIndex } from './utils/cosmicEngine';
import { generateGlobalUsers, calculateSyncScores, getSyncStats } from './utils/syncEngine';
import { onAuthChange, getUserProfile, saveCycleData, saveDailyLog, getDailyLog, logOut } from './firebase';

// Global app context
export const AppContext = createContext();
export const useApp = () => useContext(AppContext);

export default function App() {
    const [authState, setAuthState] = useState('loading'); // 'loading' | 'unauthenticated' | 'authenticated'
    const [firebaseUser, setFirebaseUser] = useState(null);
    const [userProfile, setUserProfile] = useState(null);
    const [hasOnboarded, setHasOnboarded] = useState(false);
    const [showBriefing, setShowBriefing] = useState(false);
    const [currentPage, setCurrentPage] = useState('dashboard');
    const [transitioning, setTransitioning] = useState(false);
    const [cycleData, setCycleData] = useState(DEFAULT_CYCLE);
    const [dailyLog, setDailyLog] = useState({ symptoms: [], mood: null, flow: 0, notes: '' });

    // Computed data
    const cycleInfo = getCycleInfo(cycleData.lastPeriodStart, cycleData.cycleLength, cycleData.periodLength);
    const moonData = getMoonPhase();
    const zodiac = getZodiacSign();
    const noosphere = getNoosphereIndex();

    // Global users (generated once)
    const [globalUsers, setGlobalUsers] = useState([]);
    const [syncStats, setSyncStats] = useState(null);

    // ─── Firebase Auth Listener ───
    useEffect(() => {
        const unsubscribe = onAuthChange(async (user) => {
            if (user) {
                setFirebaseUser(user);
                // Load profile from Firestore
                const profile = await getUserProfile(user.uid);
                setUserProfile(profile);
                setHasOnboarded(profile?.onboarded || false);
                if (profile?.cycleData) {
                    setCycleData(profile.cycleData);
                }
                setAuthState('authenticated');
            } else {
                setFirebaseUser(null);
                setUserProfile(null);
                setHasOnboarded(false);
                setAuthState('unauthenticated');
            }
        });
        return () => unsubscribe();
    }, []);

    // Generate global users after full auth + onboard
    useEffect(() => {
        if (authState === 'authenticated' && hasOnboarded) {
            const users = generateGlobalUsers(3000);
            const scored = calculateSyncScores(users, cycleInfo.dayOfCycle, cycleInfo.phase, cycleData.cycleLength);
            setGlobalUsers(scored);
            setSyncStats(getSyncStats(scored));
        }
    }, [authState, hasOnboarded, cycleInfo.dayOfCycle]);

    // ─── Load today's log from Firestore ───
    useEffect(() => {
        if (firebaseUser && hasOnboarded) {
            const today = new Date().toISOString().split('T')[0];
            getDailyLog(firebaseUser.uid, today).then(log => {
                if (log) setDailyLog(log);
            });
        }
    }, [firebaseUser, hasOnboarded]);

    // ─── Handlers ───
    const handleLogin = (user) => {
        // Auth state change listener will pick up the user
        // For demo/fallback users:
        if (user?.uid === 'demo') {
            setFirebaseUser(user);
            setAuthState('authenticated');
        }
    };

    const handleOnboardComplete = async (onboardData) => {
        const newCycleData = { ...cycleData, ...onboardData };
        setCycleData(newCycleData);
        setHasOnboarded(true);
        setShowBriefing(true);
        // Save to Firestore
        if (firebaseUser?.uid && firebaseUser.uid !== 'demo') {
            try {
                await saveCycleData(firebaseUser.uid, newCycleData);
            } catch (err) {
                console.warn('Failed to save cycle data:', err);
            }
        }
    };

    const handleDismissBriefing = () => {
        setShowBriefing(false);
    };

    const handleLogOut = async () => {
        try {
            await logOut();
        } catch (err) {
            console.warn('Logout error:', err);
        }
    };

    // Save daily log with Firestore sync
    const handleSetDailyLog = async (newLog) => {
        setDailyLog(newLog);
        if (firebaseUser?.uid && firebaseUser.uid !== 'demo') {
            const today = new Date().toISOString().split('T')[0];
            try {
                await saveDailyLog(firebaseUser.uid, today, newLog);
            } catch (err) {
                console.warn('Failed to save daily log:', err);
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

    const user = firebaseUser ? {
        name: firebaseUser.displayName || userProfile?.displayName || 'Cosmic Soul',
        email: firebaseUser.email,
        avatar: firebaseUser.photoURL || '🌙',
        provider: firebaseUser.providerData?.[0]?.providerId || 'email',
        joinDate: userProfile?.createdAt?.toDate?.()?.toISOString() || new Date().toISOString(),
        zodiacSign: zodiac.sign,
        uid: firebaseUser.uid,
    } : null;

    const contextValue = {
        user, cycleData, setCycleData, cycleInfo, moonData, zodiac, noosphere,
        globalUsers, syncStats, dailyLog, setDailyLog: handleSetDailyLog, currentPage,
        setCurrentPage: navigateTo, logOut: handleLogOut,
        showBriefing: () => setShowBriefing(true),
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

            {/* Daily Briefing Modal */}
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
