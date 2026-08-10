import { createContext, useContext, useState } from 'react';

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

const AppContext = createContext(null);

export function AppProvider({ children }) {
  const [bookings, setBookings] = useState([]);
  const [jobs, setJobs] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [handymanRegistration, setHandymanRegistration] =
    useState(defaultHandymanRegistration);

  const addBooking = (booking) => {
    setBookings((prev) => [...prev, booking]);
  };

  const updateBooking = (id, updates) => {
    setBookings((prev) =>
      prev.map((b) => (b.id === id ? { ...b, ...updates } : b)),
    );
  };

  const addJob = (job) => {
    setJobs((prev) => [...prev, job]);
  };

  const updateJob = (id, updates) => {
    setJobs((prev) => prev.map((j) => (j.id === id ? { ...j, ...updates } : j)));
  };

  const addNotification = (notification) => {
    setNotifications((prev) => [...prev, notification]);
  };

  const markAsRead = (id) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n)),
    );
  };

  const clearNotifications = () => {
    setNotifications([]);
  };

  const updateHandymanRegistration = (step, data) => {
    setHandymanRegistration((prev) => ({
      ...prev,
      [step]: { ...prev[step], ...data },
    }));
  };

  return (
    <AppContext.Provider
      value={{
        bookings,
        jobs,
        notifications,
        addBooking,
        updateBooking,
        addJob,
        updateJob,
        addNotification,
        markAsRead,
        clearNotifications,
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
