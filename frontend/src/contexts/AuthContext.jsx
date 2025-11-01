import React, { createContext, useState, useEffect } from "react";

// Create context
export const AuthContext = createContext();

// Provider component
export function AuthProvider({ children }) {
  // Load user and token from localStorage (if any)
  const [user, setUser] = useState(() => {
    const storedUser = localStorage.getItem("slot_user");
    return storedUser ? JSON.parse(storedUser) : null;
  });

  const [token, setToken] = useState(() => localStorage.getItem("slot_token") || null);

  // Persist changes to localStorage
  useEffect(() => {
    if (user) localStorage.setItem("slot_user", JSON.stringify(user));
    else localStorage.removeItem("slot_user");

    if (token) localStorage.setItem("slot_token", token);
    else localStorage.removeItem("slot_token");
  }, [user, token]);

  // Login function (save user & token)
  const login = ({ user, token }) => {
    setUser(user);
    setToken(token);
  };

  // Logout function (clear everything)
  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem("slot_user");
    localStorage.removeItem("slot_token");
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
