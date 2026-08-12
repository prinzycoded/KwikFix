import { createContext, useContext, useEffect, useRef, useState, useCallback } from 'react';
import { ref, onValue, push, set, update, remove, get } from 'firebase/database';
import { db } from '../lib/firebase';
import { useAuth } from './AuthContext';

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
  const [connectionReady, setConnectionReady] = useState(false);

  const handymanRegistrationRef = useRef(defaultHandymanRegistration);
  const [handymanRegistration, setHandymanRegistrationState] = useState(defaultHandymanRegistration);

  // demo-mode (no Firebase config) fallback stores
  const demo = useRef({ bookings: [], jobs: [], notifications: [] });

  // ---------- real-time listeners ----------
  useEffect(() => {
    if (!firebaseReady || !db) return;

    const unsubs = [];

    if (uid) {
      unsubs.push(
        onValue(ref(db, `bookings/${uid}`), (snap) => setBookings(toArray(snap.val()))),
      );
      unsubs.push(
        onValue(ref(db, `jobs/${uid}`), (snap) => setJobs(toArray(snap.val()))),
      );
      unsubs.push(
        onValue(ref(db, `notifications/${uid}`), (snap) => setNotifications(toArray(snap.val()))),
      );
      unsubs.push(
        onValue(ref(db, `withdrawals/${uid}`), (snap) => setWithdrawals(toArray(snap.val()))),
      );
    }

    if (role === 'handyman') {
      unsubs.push(
        onValue(ref(db, 'availableJobs'), (snap) => setAvailableJobs(toArray(snap.val() || {}))),
      );
    }
    unsubs.push(
      onValue(ref(db, 'presence'), (snap) =>
        setPresenceStatuses(snap.val() || {}),
      ),
    );

    if (chatConvoId) {
      unsubs.push(
        onValue(ref(db, `messages/${chatConvoId}`), (snap) =>
          setChatMessages(toArray(snap.val())),
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
        }),
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
        return;
      }

      // demo fallback: keep the job in the available list for the customer to see in matching
      demo.current.bookings = (demo.current.bookings || []).map((b) =>
        b.id === job.id ? { ...b, status: 'accepted' } : b,
      );
      setBookings([...demo.current.bookings]);
    },
    [firebaseReady, db, uid, currentUser],
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
      if (nextState === 'both_ended') updates.status = 'completed';

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