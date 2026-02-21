import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, OAuthProvider, signInWithPopup, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut, onAuthStateChanged } from 'firebase/auth';
import { getFirestore, doc, setDoc, getDoc, updateDoc, collection, addDoc, query, where, orderBy, getDocs, serverTimestamp } from 'firebase/firestore';

// Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyD9B_TTi98E_xgPULqiGrwXVuQdPiMa5mI",
    authDomain: "gfycle-563fa.firebaseapp.com",
    projectId: "gfycle-563fa",
    storageBucket: "gfycle-563fa.firebasestorage.app",
    messagingSenderId: "808756369737",
    appId: "1:808756369737:web:75347db2c64434884ae298",
    measurementId: "G-Z4X6VP6SCJ"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);

// ─── Auth Providers ───
const googleProvider = new GoogleAuthProvider();
const appleProvider = new OAuthProvider('apple.com');

// ─── Auth Functions ───
export async function signInWithGoogle() {
    const result = await signInWithPopup(auth, googleProvider);
    await ensureUserProfile(result.user);
    return result.user;
}

export async function signInWithApple() {
    const result = await signInWithPopup(auth, appleProvider);
    await ensureUserProfile(result.user);
    return result.user;
}

export async function signInWithEmail(email, password) {
    const result = await signInWithEmailAndPassword(auth, email, password);
    return result.user;
}

export async function signUpWithEmail(email, password, displayName) {
    const result = await createUserWithEmailAndPassword(auth, email, password);
    await ensureUserProfile(result.user, displayName);
    return result.user;
}

export async function logOut() {
    await signOut(auth);
}

export function onAuthChange(callback) {
    return onAuthStateChanged(auth, callback);
}

// ─── User Profile ───
async function ensureUserProfile(user, displayName) {
    const ref = doc(db, 'users', user.uid);
    const snap = await getDoc(ref);
    if (!snap.exists()) {
        await setDoc(ref, {
            uid: user.uid,
            email: user.email,
            displayName: displayName || user.displayName || 'Cosmic Soul',
            photoURL: user.photoURL || null,
            provider: user.providerData?.[0]?.providerId || 'email',
            createdAt: serverTimestamp(),
            onboarded: false,
            cycleData: null,
            settings: {
                notifications: { periodReminder: true, moonAlerts: true, dailyInsight: true, syncUpdates: false },
                privacy: { anonymousMode: true, shareData: false },
            },
        });
    }
    return snap.exists() ? snap.data() : null;
}

export async function getUserProfile(uid) {
    const ref = doc(db, 'users', uid);
    const snap = await getDoc(ref);
    return snap.exists() ? snap.data() : null;
}

export async function updateUserProfile(uid, data) {
    const ref = doc(db, 'users', uid);
    await updateDoc(ref, data);
}

// ─── Birth Data ───
export async function saveBirthData(uid, birthData) {
    await updateDoc(doc(db, 'users', uid), { birthData });
}

// ─── Cycle Data ───
export async function saveCycleData(uid, cycleData) {
    await updateDoc(doc(db, 'users', uid), {
        cycleData,
        onboarded: true,
    });
}

export async function getCycleData(uid) {
    const profile = await getUserProfile(uid);
    return profile?.cycleData || null;
}

// ─── Daily Logs ───
export async function saveDailyLog(uid, date, logData) {
    const ref = doc(db, 'users', uid, 'dailyLogs', date);
    await setDoc(ref, {
        ...logData,
        date,
        updatedAt: serverTimestamp(),
    }, { merge: true });
}

export async function getDailyLog(uid, date) {
    const ref = doc(db, 'users', uid, 'dailyLogs', date);
    const snap = await getDoc(ref);
    return snap.exists() ? snap.data() : null;
}

export async function getDailyLogs(uid, limit = 30) {
    const ref = collection(db, 'users', uid, 'dailyLogs');
    const q = query(ref, orderBy('date', 'desc'));
    const snap = await getDocs(q);
    return snap.docs.map(d => ({ id: d.id, ...d.data() })).slice(0, limit);
}

// ─── Period Logs ───
export async function savePeriodLog(uid, periodLog) {
    const ref = doc(db, 'users', uid, 'periodLogs', periodLog.startDate);
    await setDoc(ref, {
        ...periodLog,
        updatedAt: serverTimestamp(),
    }, { merge: true });
}

export async function getPeriodLogs(uid, limit = 24) {
    const ref = collection(db, 'users', uid, 'periodLogs');
    const q = query(ref, orderBy('startDate', 'desc'));
    const snap = await getDocs(q);
    return snap.docs.map(d => ({ id: d.id, ...d.data() })).slice(0, limit);
}

// ─── Journal Entries ───
export async function saveJournalEntry(uid, entry) {
    const ref = collection(db, 'users', uid, 'journal');
    await addDoc(ref, {
        ...entry,
        createdAt: serverTimestamp(),
    });
}

export async function getJournalEntries(uid, limit = 20) {
    const ref = collection(db, 'users', uid, 'journal');
    const q = query(ref, orderBy('createdAt', 'desc'));
    const snap = await getDocs(q);
    return snap.docs.map(d => ({ id: d.id, ...d.data() })).slice(0, limit);
}
