import React, { useState, useEffect } from "react";
import { Outlet, NavLink, useNavigate, useLocation } from "react-router-dom";
import {
  FaBars,
  FaTimes,
  FaTachometerAlt,
  FaPassport,
  FaUserPlus,
  FaSignOutAlt,
  FaUserCircle,
} from "react-icons/fa";

import "./AdminLayout.css";

const menuItems = [
  { to: "/dashboard", label: "Dashboard", icon: <FaTachometerAlt /> },
  { to: "/passports", label: "All Passports", icon: <FaPassport /> },
  { to: "/add-passport", label: "Add Passport", icon: <FaUserPlus /> },
];

export default function AdminLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(window.innerWidth > 992);
  const [adminName, setAdminName] = useState("Administrator");
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    try {
      const info = JSON.parse(localStorage.getItem("adminInfo") || "{}");
      if (info?.name) setAdminName(info.name);
    } catch {
      // ignore parse errors, fallback stays "Administrator"
    }
  }, []);

  const logout = () => {
    localStorage.removeItem("adminToken");
    localStorage.removeItem("adminInfo");
    navigate("/");
  };

  const closeOnMobile = () => {
    if (window.innerWidth <= 992) setSidebarOpen(false);
  };

  // Current route ke hisab se page title nikalo
  const currentTitle =
    menuItems.find((item) =>
      item.to === "/passports"
        ? location.pathname.startsWith("/passports")
        : location.pathname === item.to
    )?.label || "Dashboard";

  return (
    <div className="admin-layout">
      {/* ================= Sidebar ================= */}
      <aside className={sidebarOpen ? "sidebar open" : "sidebar close"}>
        <div className="logo-section">
          <div className="logo-text">
            <h2>🛂 Passport</h2>
            <small>Management System</small>
          </div>
          {/* Ye toggle sirf DESKTOP ke liye hai (CSS se mobile par hide hai) */}
          <button
            className="toggle-btn"
            onClick={() => setSidebarOpen(!sidebarOpen)}
            aria-label="Toggle sidebar"
          >
            {sidebarOpen ? <FaTimes /> : <FaBars />}
          </button>
        </div>

        <nav>
          {menuItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              onClick={closeOnMobile}
              className={({ isActive }) => (isActive ? "menu active" : "menu")}
              title={item.label}
            >
              {item.icon}
              <span>{item.label}</span>
            </NavLink>
          ))}
        </nav>

        <div className="sidebar-footer">
          <small>REC. SYS. v1</small>
        </div>
      </aside>

      {/* Mobile overlay — sidebar band karne ke liye bahar click karo */}
      {sidebarOpen && window.innerWidth <= 992 && (
        <div className="sidebar-overlay" onClick={() => setSidebarOpen(false)} />
      )}

      {/* ================= Main ================= */}
      <div className="main-container">
        <header className="navbar">
          <div className="left-navbar">
            {/* Ye button sirf MOBILE ke liye hai (CSS se desktop par hide hai) */}
            <button
              className="menu-icon"
              onClick={() => setSidebarOpen(!sidebarOpen)}
              aria-label="Toggle menu"
            >
              <FaBars />
            </button>
            <h2>{currentTitle}</h2>
          </div>

          <div className="right-navbar">
            <div className="profile-box">
              <FaUserCircle size={42} />
              <div>
                <h4>{adminName}</h4>
                <small>Super Admin</small>
              </div>
            </div>

            <button className="logout-btn" onClick={logout}>
              <FaSignOutAlt />
              <span>Logout</span>
            </button>
          </div>
        </header>

        <div className="page-content">
          <Outlet />
        </div>
      </div>
    </div>
  );
}