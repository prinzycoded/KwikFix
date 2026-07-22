import { createContext, useContext, useState } from 'react';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userRole, setUserRole] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);
  const [darkMode, setDarkMode] = useState(() => {
    if (typeof window !== 'undefined') {
      return window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    return false;
  });

  const login = (role, email, password) => {
    setCurrentUser({
      id: crypto.randomUUID(),
      fullName: '',
      email,
      phone: '',
      role,
      avatar: '',
      niche: 'other',
      rating: 0,
      isVerified: false,
      isDIYProfessional: false,
      status: 'offline',
      createdAt: new Date().toISOString(),
    });
    setUserRole(role);
    setIsAuthenticated(true);
  };

  const signup = (data) => {
    const newUser = {
      id: crypto.randomUUID(),
      fullName: data.fullName ?? '',
      email: data.email ?? '',
      phone: data.phone ?? '',
      role: data.role ?? 'handyman',
      avatar: data.avatar ?? '',
      niche: data.niche ?? 'other',
      rating: 0,
      isVerified: false,
      isDIYProfessional: false,
      status: 'offline',
      createdAt: new Date().toISOString(),
    };
    setCurrentUser(newUser);
    setUserRole(newUser.role);
    setIsAuthenticated(true);
  };

  const toggleDarkMode = () => {
    setDarkMode((prev) => !prev);
  };

  const logout = () => {
    setIsAuthenticated(false);
    setUserRole(null);
    setCurrentUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        userRole,
        currentUser,
        darkMode,
        login,
        signup,
        toggleDarkMode,
        logout,
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
