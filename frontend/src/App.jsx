import { Outlet, Link } from "react-router-dom";
import React from "react";
import { AuthContext } from "./contexts/AuthContext";
import "./App.css";

export default function App() {
  const { user, logout } = React.useContext(AuthContext);
  return (
    <div className="app-container">
      <header className="navbar">
        <h2>SlotSwapper</h2>
        {user && (
          <>
            <nav>
              <Link to="/">Dashboard</Link>
              <Link to="/marketplace">Marketplace</Link>
              <Link to="/requests">Requests</Link>
            </nav>
            <div className="user-info">
              Hi, {user.name}
              <button className="logout-btn" onClick={logout}>Logout</button>
            </div>
          </>
        )}
      </header>
      <main>
        <Outlet />
      </main>
    </div>
  );
}
