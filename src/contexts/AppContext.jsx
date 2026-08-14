import { createContext, useContext, useEffect, useRef, useState, useCallback } from 'react';
import { ref, onValue, push, set, update, remove, get } from 'firebase/database';
import { db } from '../lib/firebase';
import { useAuth } from './AuthContext';
import { buildMockJourney } from '../lib/mockData';
import { normalizeNiche } from '../lib/niches';

const defaultHandymanRegistration = {
  step1: {
    name: '',
    age: 0,
    gender: 'other',
    dateOfBirth: '',
    areaOfSpecialization: 'other',
  },
  step2: {
    pastWorkImages: [],
    highestEducation: 'bece',
    yearsOfExperience: 0,
    references: [],
  },
  step3: {
    nin: '',
    bvn: '',
  },
  step4: {
    email: '',
  },
  step5: {
    username: '',
    profilePicture: '',
    permissions: {
      location: false,
      audio: false,
    },
  },
};

const toArray = (snap) => {
  if (!snap) return [];
  const ids = Object.keys(snap || {});
  return ids
    .map((id) => ({ id, ...(snap[id] || {}) }))
    .sort((a, b) => String(b.createdAt || '').localeCompare(String(a.createdAt || '')));
};

const AppContext = createContext(null);

export function AppProvider({ children }) {
  const { currentUser, firebaseReady } = useAuth();
  const uid = currentUser?.id || null;
  const role = currentUser?.role || null;

  const [bookings, setBookings] = useState([]);
  const [availableJobs, setAvailableJobs] = useState([]);
  const [jobs, setJobs] = useState([]);
  const [assignedBookings, setAssignedBookings] = useState({});
  const [notifications, setNotifications] = useState([]);
  const [chatMessages, setChatMessages] = useState([]);
  const [chatConvoId, setChatConvoId] = useState(null);
  const [presenceStatuses, setPresenceStatuses] = useState({});
  const [withdrawals, setWithdrawals] = useState([]);
  const [registeredHandymen, setRegisteredHandymen] = useState([]);
  const [connectionReady, setConnectionReady] = useState(false);

  const handymanRegistrationRef = useRef(defaultHandymanRegistration);
  const [handymanRegistration, setHandymanRegistrationState] = useState(defaultHandymanRegistration);

  // demo-mode (no Firebase config) fallback stores
  const demo = useRef({ bookings: [], jobs: [], notifications: [], registeredHandymen: {} });

  // ---------- real-time listeners ----------
  useEffect(() => {
    if (!firebaseReady || !db) return;

    const unsubs = [];

    // Permission-denied reads are ignored (they log to console) so a single
    // denied path can never crash the whole app.
    const ignore = (err) => console.warn('Listener denied', err?.code || err?.message || err);

    if (uid) {
      unsubs.push(
        onValue(ref(db, `bookings/${uid}`), (snap) => setBookings(toArray(snap.val())), ignore),
      );
      unsubs.push(
        onValue(ref(db, `jobs/${uid}`), (snap) => setJobs(toArray(snap.val())), ignore),
      );
      unsubs.push(
        onValue(ref(db, `notifications/${uid}`), (snap) => setNotifications(toArray(snap.val())), ignore),
      );
      unsubs.push(
        onValue(ref(db, `withdrawals/${uid}`), (snap) => setWithdrawals(toArray(snap.val())), ignore),
      );
    }

    if (role === 'handyman') {
      unsubs.push(
        onValue(ref(db, 'availableJobs'), (snap) => setAvailableJobs(toArray(snap.val() || {})), ignore),
      );
    }
    // directory of handymen who registered an account (real Firebase Auth users).
    // The client may only ever connect to handymen listed here.
    unsubs.push(
      onValue(ref(db, 'registeredHandymen'), (snap) =>
        setRegisteredHandymen(toArray(snap.val() || {})),
        ignore,
      ),
    );
    unsubs.push(
      onValue(ref(db, 'presence'), (snap) =>
        setPresenceStatuses(snap.val() || {}),
        ignore,
      ),
    );

    if (chatConvoId) {
      unsubs.push(
        onValue(ref(db, `messages/${chatConvoId}`), (snap) =>
          setChatMessages(toArray(snap.val())),
          ignore,
        ),
      );
    }

    setConnectionReady(true);
    return () => {
      unsubs.forEach((u) => u());
      setConnectionReady(false);
    };
  }, [firebaseReady, db, uid, role, chatConvoId]);

  // live subscription to each active booking so the handyman's end-state
  // and status stays in sync (customers cannot write to jobs/{handymanUid})
  useEffect(() => {
    if (!firebaseReady || !db || role !== 'handyman' || !uid) return;
    const ignore = (err) => console.warn('Listener denied', err?.code || err?.message || err);
    const unsubs = jobs
      .filter((j) => j.customerUid && j.id)
      .map((j) =>
        onValue(ref(db, `bookings/${j.customerUid}/${j.id}`), (snap) => {
          const val = snap.val();
          setAssignedBookings((prev) => {
            const next = { ...prev };
            if (val) next[j.id] = { id: j.id, ...val };
            else delete next[j.id];
            return next;
          });
        }, ignore),
      );
    return () => {
      setAssignedBookings({});
      unsubs.forEach((u) => u());
    };
  }, [firebaseReady, db, role, uid, jobs]);

  // ---------- public helpers ----------
  const createBooking = useCallback(
    async (booking) => {
      if (firebaseReady && db && uid) {
        const id = push(ref(db, `bookings/${uid}`)).key;
        const data = {
          id,
          customerUid: uid,
          customerName: currentUser?.fullName || 'Customer',
          status: 'pending',
          endState: 'none',
          handymanId: '',
          handymanName: '',
          createdAt: new Date().toISOString(),
          ...booking,
        };
        try {
          await set(ref(db, `bookings/${uid}/${id}`), data);
        } catch (err) {
          throw new Error(
            `Booking write to "bookings/${uid}/${id}" was rejected (${err.message}). The Realtime Database rules in the Firebase console (not the repo file) must be updated — paste database.rules.json into Console → Realtime Database → Rules and publish.`,
          );
        }
        try {
          await set(ref(db, `availableJobs/${id}`), data);
        } catch (err) {
          throw new Error(
            `Booking mirror write to "availableJobs/${id}" was rejected (${err.message}). Update + publish the rules in Console → Realtime Database → Rules (database.rules.json) so authenticated users can write the job feed.`,
          );
        }
        return id;
      }
      // demo fallback
      const id = `b${Date.now()}`;
      demo.current.bookings = [{ id, customerUid: uid, status: 'pending', endState: 'none', ...booking }, ...demo.current.bookings];
      setBookings([...demo.current.bookings]);
      return id;
    },
    [firebaseReady, db, uid, currentUser],
  );

  const updateBooking = useCallback(
    async (id, updates) => {
      if (firebaseReady && db && uid) {
        const path = ref(db, `bookings/${uid}/${id}`);
        const existing = await get(path);
        if (existing.exists()) {
          await update(path, updates);
        } else {
          await set(path, { id, customerUid: uid, createdAt: new Date().toISOString(), ...updates });
        }
        return;
      }
      demo.current.bookings = demo.current.bookings.map((b) =>
        b.id === id ? { ...b, ...updates } : b,
      );
      setBookings([...demo.current.bookings]);
    },
    [firebaseReady, db, uid],
  );

  const updateJob = useCallback(
    async (id, updates) => {
      if (firebaseReady && db && uid) {
        await update(ref(db, `jobs/${uid}/${id}`), updates);
        return;
      }
      demo.current.jobs = demo.current.jobs.map((j) =>
        j.id === id ? { ...j, ...updates } : j,
      );
      setJobs([...demo.current.jobs]);
    },
    [firebaseReady, db, uid],
  );

  // ---------- live tracking (simulated journey) ----------
  // Auto-starts when a handyman accepts. The journey is deterministic — both
  // parties recompute progress/ETA from `startedAt` + `totalMinutes`, so the
  // customer's countdown ticks live with zero extra writes.
  const startTracking = useCallback(
    async (bookingId, customerUid, customerAddress) => {
      if (!bookingId || !customerUid) return;
      const journey = buildMockJourney(customerAddress);
      if (firebaseReady && db) {
        await update(ref(db, `bookings/${customerUid}/${bookingId}`), { tracking: journey });
        return;
      }
      demo.current.bookings = (demo.current.bookings || []).map((b) =>
        b.id === bookingId ? { ...b, tracking: journey } : b,
      );
      setBookings([...demo.current.bookings]);
    },
    [firebaseReady, db],
  );

  const acceptJob = useCallback(
    async (job) => {
      const customerUid = job.customerUid;
      if (!customerUid) return;

      if (firebaseReady && db && uid) {
        const id = job.id;
        const jobData = {
          id,
          bookingId: id,
          handymanId: uid,
          customerUid,
          customerName: job.customerName || 'Customer',
          service: job.service,
          address: job.address || '',
          date: job.date || '',
          time: job.time || '',
          price: job.price || 0,
          status: 'active',
          endState: 'none',
          createdAt: job.createdAt || new Date().toISOString(),
        };
        await set(ref(db, `jobs/${uid}/${id}`), jobData);
        await push(ref(db, `notifications/${customerUid}`), {
          type: 'job_accepted',
          message: `A KWIKFIXER accepted your ${job.service || 'job'} request!`,
          read: false,
          fromUid: uid,
          createdAt: new Date().toISOString(),
        });
        await update(ref(db, `bookings/${customerUid}/${id}`), {
          handymanId: uid,
          handymanName: currentUser?.fullName || 'KWIKFIXER',
          status: 'accepted',
          endState: 'none',
        });
        await remove(ref(db, `availableJobs/${id}`));
        // the customer immediately sees a live ETA countdown
        await startTracking(id, customerUid, job.address);
        return;
      }

      // demo fallback: keep the job in the available list for the customer to see in matching
      demo.current.bookings = (demo.current.bookings || []).map((b) =>
        b.id === job.id ? { ...b, status: 'accepted', handymanName: currentUser?.fullName || 'KWIKFIXER' } : b,
      );
      setBookings([...demo.current.bookings]);
      await startTracking(job.id, customerUid, job.address);
    },
    [firebaseReady, db, uid, currentUser, startTracking],
  );

  const endJob = useCallback(
    async (id, clickedBy) => {
      const record = bookings.find((b) => b.id === id) || jobs.find((j) => j.id === id);
      const live = assignedBookings[id];
      const currentState = live?.endState || record?.endState || 'none';

      let nextState;
      if (currentState === 'none') {
        nextState = clickedBy === 'customer' ? 'customer_ended' : 'handyman_ended';
      } else if (currentState === 'customer_ended' && clickedBy === 'handyman') {
        nextState = 'both_ended';
      } else if (currentState === 'handyman_ended' && clickedBy === 'customer') {
        nextState = 'both_ended';
      } else {
        nextState = currentState;
      }

      const updates = { endState: nextState };
      if (nextState === 'both_ended') {
        updates.status = 'completed';
        updates.tracking = { status: 'completed', completedAt: new Date().toISOString() };
      }

      const customerUid = record?.customerUid || uid;
      const handymanId = record?.handymanId || (role === 'handyman' ? uid : '');

      if (firebaseReady && db) {
        if (customerUid) await update(ref(db, `bookings/${customerUid}/${id}`), updates);
        if (role === 'handyman' && handymanId && handymanId !== customerUid) {
          await update(ref(db, `jobs/${handymanId}/${id}`), updates);
        }
        const otherUid = role === 'handyman' ? customerUid : handymanId;
        if (otherUid) {
          await push(ref(db, `notifications/${otherUid}`), {
            type: 'job_end',
            message: nextState === 'both_ended' ? 'Job Completed!' : 'The other party ended the job — waiting for your confirmation',
            read: false,
            fromUid: uid,
            createdAt: new Date().toISOString(),
          });
        }
        return;
      }

      // demo fallback
      const apply = (list) => list.map((x) => (x.id === id ? { ...x, ...updates } : x));
      demo.current.bookings = apply(demo.current.bookings);
      demo.current.jobs = apply(demo.current.jobs);
      setBookings([...demo.current.bookings]);
      setJobs([...demo.current.jobs]);
    },
    [bookings, jobs, assignedBookings, role, uid, firebaseReady, db],
  );

  const addNotification = useCallback(
    async (notification) => {
      if (firebaseReady && db && uid) {
        await push(ref(db, `notifications/${uid}`), {
          ...notification,
          read: false,
          fromUid: uid,
          createdAt: new Date().toISOString(),
        });
        return;
      }
      const id = `n${Date.now()}`;
      demo.current.notifications = [{ id, ...notification, read: false, createdAt: new Date().toISOString() }, ...demo.current.notifications];
      setNotifications([...demo.current.notifications]);
    },
    [firebaseReady, db, uid],
  );

  const markAsRead = useCallback(
    async (id) => {
      if (firebaseReady && db && uid) {
        await update(ref(db, `notifications/${uid}/${id}`), { read: true });
        return;
      }
      demo.current.notifications = demo.current.notifications.map((n) =>
        n.id === id ? { ...n, read: true } : n,
      );
      setNotifications([...demo.current.notifications]);
    },
    [firebaseReady, db, uid],
  );

  const clearNotifications = useCallback(async () => {
    if (firebaseReady && db && uid) {
      const existing = await get(ref(db, `notifications/${uid}`));
      const snap = existing.val() || {};
      await Promise.all(
        Object.keys(snap).map((id) => update(ref(db, `notifications/${uid}/${id}`), { read: true })),
      );
      return;
    }
    setNotifications([]);
  }, [firebaseReady, db, uid]);

  const setUserStatus = useCallback(
    async (status) => {
      if (firebaseReady && db && uid) {
        await set(ref(db, `presence/${uid}`), { status, lastSeen: new Date().toISOString() });
        return;
      }
    },
    [firebaseReady, db, uid],
  );

  const sendMessage = useCallback(
    async (convoId, text) => {
      if (!convoId || !text?.trim()) return;
      if (firebaseReady && db && uid) {
        await push(ref(db, `messages/${convoId}`), {
          text: text.trim(),
          senderId: uid,
          senderName: currentUser?.fullName || 'You',
          createdAt: new Date().toISOString(),
        });
        return;
      }
      setChatMessages((prev) => [
        ...prev,
        {
          id: `m${Date.now()}`,
          text: text.trim(),
          senderId: uid,
          senderName: 'You',
          createdAt: new Date().toISOString(),
        },
      ]);
    },
    [firebaseReady, db, uid, currentUser],
  );

  const addWithdrawal = useCallback(
    async (data) => {
      if (firebaseReady && db && uid) {
        await push(ref(db, `withdrawals/${uid}`), {
          ...data,
          status: 'pending',
          createdAt: new Date().toISOString(),
        });
        return;
      }
      demo.current.notifications = [
        { id: `w${Date.now()}`, type: 'withdrawal', message: `Withdrawal of ${data.amount} requested`, read: false, createdAt: new Date().toISOString() },
        ...demo.current.notifications,
      ];
      setNotifications([...demo.current.notifications]);
    },
    [firebaseReady, db, uid],
  );

  const updateHandymanRegistration = (step, data) => {
    handymanRegistrationRef.current = {
      ...handymanRegistrationRef.current,
      [step]: { ...handymanRegistrationRef.current[step], ...data },
    };
    setHandymanRegistrationState(handymanRegistrationRef.current);
  };

  // ---------- handyman registration & directory ----------
  // Persists the full registration (incl. verified NIN) and publishes a
  // public entry in `registeredHandymen/{uid}` — the directory customers
  // match against. Only handymen with a real Firebase Auth account reach
  // this point, so the directory can never contain a fabricated handyman.
  const saveHandymanProfile = useCallback(
    async (registration) => {
      if (!uid) return;
      const step1 = registration.step1 || {};
      const step2 = registration.step2 || {};
      const step3 = registration.step3 || {};
      const step4 = registration.step4 || {};
      const step5 = registration.step5 || {};
      const niches = [
        ...new Set(
          (Array.isArray(step1.niches) && step1.niches.length
            ? step1.niches
            : [step1.areaOfSpecialization]
          ).map(normalizeNiche).filter(Boolean),
        ),
      ];
      const profile = {
        uid,
        fullName: step1.name || '',
        email: step4.email || '',
        username: step5.username || '',
        profilePicture: step5.profilePicture || '',
        niche: niches[0] || 'other',
        niches,
        age: step1.age || 0,
        gender: step1.gender || 'other',
        dateOfBirth: step1.dateOfBirth || '',
        highestEducation: step2.highestEducation || '',
        yearsOfExperience: step2.yearsOfExperience || 0,
        references: step2.references || [],
        pastWorkImages: step2.pastWorkImages || [],
        nin: step3.nin || '',
        ninVerified: Boolean(step3.ninVerified),
        verifiedNinName: step3.verifiedNinName || '',
        permissions: step5.permissions || { location: false, audio: false },
        isVerified: Boolean(step3.ninVerified),
        createdAt: new Date().toISOString(),
      };

      if (firebaseReady && db) {
        await set(ref(db, `handymanProfiles/${uid}`), profile);
        await set(ref(db, `registeredHandymen/${uid}`), {
          uid,
          fullName: profile.fullName,
          username: profile.username,
          profilePicture: profile.profilePicture,
          niche: profile.niche,
          niches: profile.niches,
          yearsOfExperience: profile.yearsOfExperience,
          rating: 0,
          isVerified: profile.isVerified,
          createdAt: profile.createdAt,
        });
        return;
      }
      // demo fallback (no Firebase): treat the in-memory record as registered
      demo.current.registeredHandymen = {
        ...(demo.current.registeredHandymen || {}),
        [uid]: { id: uid, ...profile },
      };
      setRegisteredHandymen(toArray(demo.current.registeredHandymen));
    },
    [firebaseReady, db, uid],
  );

  // ---------- live tracking (simulated journey) ----------
  // Auto-starts when a handyman accepts. The journey is deterministic — both
  // parties recompute progress/ETA from `startedAt` + `totalMinutes`, so the
  // customer's countdown ticks live with zero extra writes.

  return (
    <AppContext.Provider
      value={{
        bookings,
        availableJobs,
        jobs,
        assignedBookings,
        notifications,
        chatMessages,
        chatConvoId,
        presenceStatuses,
        withdrawals,
        registeredHandymen,
        connectionReady,
        createBooking,
        updateBooking,
        updateJob,
        acceptJob,
        endJob,
        addNotification,
        markAsRead,
        clearNotifications,
        setUserStatus,
        setChatConvoId,
        sendMessage,
        addWithdrawal,
        handymanRegistration,
        updateHandymanRegistration,
        saveHandymanProfile,
        startTracking,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return ctx;
}