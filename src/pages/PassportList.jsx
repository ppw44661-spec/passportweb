import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import "./PassportList.css";

const api = axios.create({ baseURL: "https://passport-o7j6.onrender.com/api" });
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("adminToken");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

const viewPdf = async (id) => {
  try {
    const res = await api.get(`/passports/${id}/view-pdf`, { responseType: "blob" });
    const url = window.URL.createObjectURL(new Blob([res.data], { type: "application/pdf" }));
    window.open(url, "_blank");
  } catch (err) {
    alert("PDF load nahi ho payi.");
  }
};

const downloadPdf = async (id, applicationId) => {
  try {
    const res = await api.get(`/passports/${id}/download-pdf`, { responseType: "blob" });
    const url = window.URL.createObjectURL(new Blob([res.data], { type: "application/pdf" }));
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `Passport_${applicationId || id}.pdf`);
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(url);
  } catch (err) {
    alert("PDF download nahi ho payi.");
  }
};

export default function PassportList() {
  const [passports, setPassports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [error, setError] = useState("");

  const fetchPassports = async () => {
    setLoading(true);
    try {
      const res = await api.get("/passports");
      setPassports(res.data.data || []);
    } catch (err) {
      setError(err.response?.data?.message || "Data load nahi ho paaya.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPassports();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Kya aap sach me is passport record ko delete karna chahte hain?")) return;
    try {
      await api.delete(`/passports/${id}`);
      setPassports((prev) => prev.filter((p) => p._id !== id));
    } catch (err) {
      alert(err.response?.data?.message || "Delete nahi ho paaya.");
    }
  };

  const filtered = passports.filter((p) => {
    const q = search.toLowerCase();
    return (
      p.fullName?.toLowerCase().includes(q) ||
      p.applicationId?.toLowerCase().includes(q) ||
      p.passportNumber?.toLowerCase().includes(q) ||
      p.status?.toLowerCase().includes(q)
    );
  });

  return (
    <div className="pl-wrap">
      <div className="pl-header">
        <h2>All Passports</h2>
        <Link to="/add-passport" className="pl-add-btn">+ Add New Passport</Link>
      </div>

      <input
        className="pl-search"
        type="text"
        placeholder="Search by name, application ID, passport number, status..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      {error && <div className="pl-error">{error}</div>}

      {loading ? (
        <p>Loading...</p>
      ) : filtered.length === 0 ? (
        <p>Koi record nahi mila.</p>
      ) : (
        <div className="pl-table-wrap">
          <table className="pl-table">
            <thead>
              <tr>
                <th>Application ID</th>
                <th>Full Name</th>
                <th>Passport Number</th>
                <th>Status</th>
                <th>Applied On</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((p) => (
                <tr key={p._id}>
                  <td>{p.applicationId}</td>
                  <td>{p.fullName}</td>
                  <td>{p.passportNumber}</td>
                  <td>
                    <span className={`pl-status pl-status-${p.status?.replace(/\s+/g, "-").toLowerCase()}`}>
                      {p.status}
                    </span>
                  </td>
                  <td>{p.applicationDate ? new Date(p.applicationDate).toLocaleDateString() : "-"}</td>
                  <td className="pl-actions">
                    <Link to={`/passports/${p._id}`} className="pl-btn pl-view">View</Link>
                    <Link to={`/passports/edit/${p._id}`} className="pl-btn pl-edit">Edit</Link>
                    <button className="pl-btn pl-pdf" onClick={() => viewPdf(p._id)}>PDF</button>
                    <button className="pl-btn pl-download" onClick={() => downloadPdf(p._id, p.applicationId)}>⬇</button>
                    <button className="pl-btn pl-delete" onClick={() => handleDelete(p._id)}>Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}