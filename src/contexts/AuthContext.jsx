import { createContext, useContext, useState } from 'react';

const genId = () => {
  try {
    return crypto.randomUUID();
  } catch {
    return Date.now().toString(36) + Math.random().toString(36).substring(2, 10);
  }
};

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userRole, setUserRole] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);

  const login = (role, email, password) => {
    setCurrentUser({
      id: genId(),
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
      id: genId(),
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
        login,
        signup,
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
