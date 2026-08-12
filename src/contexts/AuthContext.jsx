import { createContext, useContext, useEffect, useState } from 'react';
import {
  onAuthStateChanged,
  signOut,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  updateProfile,
  sendEmailVerification,
  reload,
} from 'firebase/auth';
import { ref, get, set, onDisconnect } from 'firebase/database';
import { auth, db, firebaseReady } from '../lib/firebase';

const AuthContext = createContext(null);

const DEFAULT_PROFILE = {
  fullName: '',
  email: '',
  phone: '',
  role: 'customer',
  avatar: '',
  username: '',
  niche: 'other',
  rating: 0,
  isVerified: false,
  isDIYProfessional: false,
  status: 'offline',
};

export function AuthProvider({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userRole, setUserRole] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);
  const [firebaseUser, setFirebaseUser] = useState(null);
  const [initializing, setInitializing] = useState(true);

  useEffect(() => {
    if (!auth) {
      setInitializing(false);
      return () => {};
    }
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        try {
          const snap = await get(ref(db, `users/${user.uid}`));
          const profile = snap.exists() ? snap.val() : {};
          const role = profile.role || 'customer';
          setCurrentUser({
            id: user.uid,
            fullName: profile.fullName || user.displayName || '',
            email: profile.email || user.email || '',
            phone: profile.phone || user.phoneNumber || '',
            role,
            avatar: profile.avatar || user.photoURL || '',
            username: profile.username || '',
            niche: profile.niche || 'other',
            rating: profile.rating || 0,
            isVerified: profile.isVerified || false,
            isDIYProfessional: profile.isDIYProfessional || false,
            status: profile.status || 'offline',
            createdAt: profile.createdAt || new Date().toISOString(),
          });
          setUserRole(role);
          setIsAuthenticated(true);
          setFirebaseUser(user);
        } catch (err) {
          console.warn('Failed to load profile from Realtime DB', err);
          setCurrentUser({ id: user.uid, email: user.email || '', phone: user.phoneNumber || '', ...DEFAULT_PROFILE });
          setUserRole('customer');
          setIsAuthenticated(true);
          setFirebaseUser(user);
        }
      } else {
        setCurrentUser(null);
        setFirebaseUser(null);
        setUserRole(null);
        setIsAuthenticated(false);
      }
      setInitializing(false);
    });
    return unsubscribe;
  }, []);

  // presence: mark online + auto-offline on disconnect
  useEffect(() => {
    if (!auth || !db || !firebaseUser) return;
    const presenceRef = ref(db, `presence/${firebaseUser.uid}`);
    const offlineData = { status: 'offline', lastSeen: new Date().toISOString() };
    onDisconnect(presenceRef).set(offlineData);
    set(presenceRef, { status: 'online', lastSeen: new Date().toISOString() }).catch(() => {});
  }, [firebaseUser]);

  const writeProfile = async (uid, data) => {
    const profile = {
      id: uid,
      ...DEFAULT_PROFILE,
      fullName: data.fullName ?? '',
      email: data.email ?? '',
      phone: data.phone ?? '',
      role: data.role ?? 'customer',
      avatar: data.avatar ?? '',
      username: data.username ?? '',
      niche: data.niche ?? 'other',
      createdAt: new Date().toISOString(),
    };
    await set(ref(db, `users/${uid}`), profile);
    return profile;
  };

  const login = async (email, password) => {
    if (!auth) throw new Error('Firebase is not configured. Add your config to .env');
    return signInWithEmailAndPassword(auth, email, password);
  };

  const signup = async (data) => {
    if (!auth) throw new Error('Firebase is not configured. Add your config to .env');
    const cred = await createUserWithEmailAndPassword(auth, data.email, data.password);
    await updateProfile(cred.user, {
      displayName: data.fullName || null,
      photoURL: data.avatar || null,
    });
    const profile = await writeProfile(cred.user.uid, data);
    setCurrentUser({ id: cred.user.uid, ...profile });
    setFirebaseUser(cred.user);
    setUserRole(profile.role);
    setIsAuthenticated(true);
    return cred.user;
  };

  const logout = async () => {
    if (auth) await signOut(auth);
  };

  const sendVerificationEmail = async () => {
    if (!auth || !firebaseUser) throw new Error('You must be signed in');
    await sendEmailVerification(firebaseUser);
  };

  const refreshUser = async () => {
    if (!auth || !firebaseUser) return;
    await reload(firebaseUser);
    setFirebaseUser({ ...firebaseUser });
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        userRole,
        currentUser,
        firebaseUser,
        isEmailVerified: Boolean(firebaseUser?.emailVerified),
        initializing,
        firebaseReady,
        login,
        signup,
        logout,
        sendVerificationEmail,
        refreshUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return ctx;
}