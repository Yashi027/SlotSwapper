import React, { createContext, useState, useEffect } from "react";

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const storedUser = localStorage.getItem("slot_user");
    return storedUser ? JSON.parse(storedUser) : null;
  });

  const [token, setToken] = useState(() => localStorage.getItem("slot_token") || null);

  useEffect(() => {
    if (user) localStorage.setItem("slot_user", JSON.stringify(user));
    else localStorage.removeItem("slot_user");

    if (token) localStorage.setItem("slot_token", token);
    else localStorage.removeItem("slot_token");
  }, [user, token]);


  const login = ({ user, token }) => {
    setUser(user);
    setToken(token);
  };

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
