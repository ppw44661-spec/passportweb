import React, { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import axios from "axios";
import "./PassportDetails.css";

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

const Row = ({ label, value }) => (
  <div className="pd-row">
    <span className="pd-label">{label}</span>
    <span className="pd-value">{value || "-"}</span>
  </div>
);

export default function PassportDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [passport, setPassport] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    (async () => {
      try {
        const res = await api.get(`/passports/${id}`);
        setPassport(res.data.data);
      } catch (err) {
        setError(err.response?.data?.message || "Record load nahi ho paaya.");
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p className="pd-error">{error}</p>;
  if (!passport) return null;

  const fmtDate = (d) => (d ? new Date(d).toDateString() : "-");

  return (
    <div className="pd-wrap">
      <div className="pd-header">
        <h2>{passport.fullName} — {passport.applicationId}</h2>
        <div className="pd-actions">
          <button onClick={() => viewPdf(passport._id)}>View PDF</button>
          <button onClick={() => downloadPdf(passport._id, passport.applicationId)}>Download PDF</button>
          <Link to={`/passports/edit/${passport._id}`}>Edit</Link>
          <button onClick={() => navigate("/passports")} className="pd-back">Back</button>
        </div>
      </div>

      <div className="pd-section">
        <h3>Personal Details</h3>
        <Row label="Full Name" value={passport.fullName} />
        <Row label="Father's Name" value={passport.fatherName} />
        <Row label="Mother's Name" value={passport.motherName} />
        <Row label="Gender" value={passport.gender} />
        <Row label="Date of Birth" value={fmtDate(passport.dob)} />
        <Row label="Nationality" value={passport.nationality} />
        <Row label="Phone" value={passport.phone} />
        <Row label="Email" value={passport.email} />
        <Row label="Address" value={`${passport.address}, ${passport.city}, ${passport.state}, ${passport.country} - ${passport.pincode}`} />
      </div>

      <div className="pd-section">
        <h3>Passport Details</h3>
        <Row label="Passport Number" value={passport.passportNumber} />
        <Row label="Passport Type" value={passport.passportType} />
        <Row label="Issue Date" value={fmtDate(passport.issueDate)} />
        <Row label="Expiry Date" value={fmtDate(passport.expiryDate)} />
        <Row label="Status" value={passport.status} />
        <Row label="Officer Remark" value={passport.officerRemark} />
      </div>

      {(passport.employerName || passport.jobTitle) && (
        <div className="pd-section">
          <h3>Employment Details</h3>
          <Row label="Employer" value={passport.employerName} />
          <Row label="Job Title" value={passport.jobTitle} />
          <Row label="Type" value={passport.employmentType} />
          <Row label="Salary" value={passport.salary} />
        </div>
      )}

      {(passport.visaType || passport.visaNumber) && (
        <div className="pd-section">
          <h3>Visa Details</h3>
          <Row label="Visa Type" value={passport.visaType} />
          <Row label="Visa Number" value={passport.visaNumber} />
          <Row label="Country" value={passport.visaCountry} />
          <Row label="Embassy" value={passport.embassyName} />
        </div>
      )}

      {passport.tracking?.length > 0 && (
        <div className="pd-section">
          <h3>Tracking History</h3>
          {passport.tracking.map((t, i) => (
            <div key={i} className="pd-track-item">
              <b>{t.status}</b> — {new Date(t.date).toLocaleString()}
              <br />
              <span>{t.remark || "No remark"}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}