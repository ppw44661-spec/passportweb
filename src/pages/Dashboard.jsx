import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import {
  FaPassport,
  FaCheckCircle,
  FaClock,
  FaTimesCircle,
  FaUserPlus,
} from "react-icons/fa";
import "./Dashboard.css";

const api = axios.create({ baseURL: "https://passport-o7j6.onrender.com/api" });
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("adminToken");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

const COMPLETED_STATUSES = ["Completed", "Passport Dispatched", "Dispatched"];
const REJECTED_STATUSES = ["Rejected"];

export default function Dashboard() {
  const [passports, setPassports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [adminName, setAdminName] = useState("Admin");

  useEffect(() => {
    try {
      const info = JSON.parse(localStorage.getItem("adminInfo") || "{}");
      if (info?.name) setAdminName(info.name);
    } catch {
      // ignore
    }

    (async () => {
      try {
        const res = await api.get("/passports");
        setPassports(res.data.data || []);
      } catch (err) {
        setError(err.response?.data?.message || "Data load nahi ho paaya.");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const total = passports.length;
  const completed = passports.filter((p) => COMPLETED_STATUSES.includes(p.status)).length;
  const pending = passports.filter(
    (p) => !COMPLETED_STATUSES.includes(p.status) && !REJECTED_STATUSES.includes(p.status)
  ).length;
  const rejected = passports.filter((p) => REJECTED_STATUSES.includes(p.status)).length;

  const statusCounts = passports.reduce((acc, p) => {
    acc[p.status] = (acc[p.status] || 0) + 1;
    return acc;
  }, {});

  const recent = [...passports]
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 6);

  const statCards = [
    { label: "Total Applications", value: total, icon: <FaPassport />, cls: "sc-blue" },
    { label: "Completed", value: completed, icon: <FaCheckCircle />, cls: "sc-green" },
    { label: "In Progress", value: pending, icon: <FaClock />, cls: "sc-orange" },
    { label: "Rejected", value: rejected, icon: <FaTimesCircle />, cls: "sc-red" },
  ];

  return (
    <div className="dash-wrap">
      <div className="dash-header">
        <div>
          <h1>Welcome back, {adminName} 👋</h1>
          <p>Yahan hai aapke passport records ka summary aur latest activity.</p>
        </div>
        <Link to="/add-passport" className="dash-add-btn">
          <FaUserPlus /> Add Passport
        </Link>
      </div>

      {error && <div className="dash-error">{error}</div>}

      {loading ? (
        <p className="dash-loading">Loading dashboard...</p>
      ) : (
        <>
          {/* ===== Stat Cards ===== */}
          <div className="stat-grid">
            {statCards.map((card) => (
              <div className={`stat-card ${card.cls}`} key={card.label}>
                <div className="stat-icon">{card.icon}</div>
                <div>
                  <h2>{card.value}</h2>
                  <span>{card.label}</span>
                </div>
              </div>
            ))}
          </div>

          <div className="dash-grid">
            {/* ===== Status Breakdown ===== */}
            <div className="dash-panel">
              <h3>Status Breakdown</h3>
              {Object.keys(statusCounts).length === 0 ? (
                <p className="dash-empty">Koi data nahi hai.</p>
              ) : (
                <div className="status-list">
                  {Object.entries(statusCounts)
                    .sort((a, b) => b[1] - a[1])
                    .map(([status, count]) => (
                      <div className="status-row" key={status}>
                        <div className="status-row-top">
                          <span>{status}</span>
                          <span>{count}</span>
                        </div>
                        <div className="status-bar-bg">
                          <div
                            className="status-bar-fill"
                            style={{ width: `${total ? (count / total) * 100 : 0}%` }}
                          />
                        </div>
                      </div>
                    ))}
                </div>
              )}
            </div>

            {/* ===== Recent Applications ===== */}
            <div className="dash-panel dash-panel-wide">
              <div className="dash-panel-header">
                <h3>Recent Applications</h3>
                <Link to="/passports">View All →</Link>
              </div>

              {recent.length === 0 ? (
                <p className="dash-empty">Abhi tak koi passport add nahi hua.</p>
              ) : (
                <div className="recent-table-wrap">
                  <table className="recent-table">
                    <thead>
                      <tr>
                        <th>Application ID</th>
                        <th>Full Name</th>
                        <th>Status</th>
                        <th>Applied On</th>
                        <th></th>
                      </tr>
                    </thead>
                    <tbody>
                      {recent.map((p) => (
                        <tr key={p._id}>
                          <td>{p.applicationId}</td>
                          <td>{p.fullName}</td>
                          <td>
                            <span
                              className={`recent-status ${
                                COMPLETED_STATUSES.includes(p.status)
                                  ? "st-green"
                                  : REJECTED_STATUSES.includes(p.status)
                                  ? "st-red"
                                  : "st-orange"
                              }`}
                            >
                              {p.status}
                            </span>
                          </td>
                          <td>
                            {p.applicationDate
                              ? new Date(p.applicationDate).toLocaleDateString()
                              : "-"}
                          </td>
                          <td>
                            <Link to={`/passports/${p._id}`} className="recent-link">
                              View
                            </Link>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}