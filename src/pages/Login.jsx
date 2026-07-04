// import React, { useState } from "react";
// import { useNavigate } from "react-router-dom";
// import "./Login.css";

// // Point this at your running backend (see server.js -> app.use("/api/admin", ...))
// const API_BASE_URL = "https://passport-o7j6.onrender.com/api/admin";

// function Login() {
//      const navigate = useNavigate();
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [emailError, setEmailError] = useState(false);
//   const [passwordError, setPasswordError] = useState(false);
//   const [banner, setBanner] = useState({ type: "", message: "" });
//   const [loading, setLoading] = useState(false);
//   const [granted, setGranted] = useState(false);
//   const [adminName, setAdminName] = useState("");

//   const isValidEmail = (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setBanner({ type: "", message: "" });

//     const trimmedEmail = email.trim();
//     const emailValid = isValidEmail(trimmedEmail);
//     const passwordValid = password.length > 0;

//     setEmailError(!emailValid);
//     setPasswordError(!passwordValid);
//     if (!emailValid || !passwordValid) return;

//     setLoading(true);
//     try {
//       const response = await fetch(`${API_BASE_URL}/login`, {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ email: trimmedEmail, password }),
//       });

//       let data;
//       try {
//         data = await response.json();
//       } catch {
//         throw new Error("Server returned an unexpected response.");
//       }

//       if (!response.ok || data.success === false) {
//         throw new Error(data.message || "Invalid credentials.");
//       }

//     //   localStorage.setItem("adminToken", data.token);
//     //   localStorage.setItem("adminInfo", JSON.stringify(data.admin || {}));
//     //   setAdminName(data.admin && data.admin.name ? data.admin.name : "");
//     //   setGranted(true);

//     localStorage.setItem("adminToken", data.token);
// localStorage.setItem("adminInfo", JSON.stringify(data.admin || {}));

// navigate("/dashboard");
//     } catch (err) {
//       setBanner({
//         type: "error",
//         message:
//           err.message === "Failed to fetch"
//             ? "Could not reach the server. Is the backend running and CORS enabled?"
//             : err.message,
//       });
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleContinue = () => {
//     setGranted(false);
//     // Hook up your route here once a dashboard exists, e.g.:
//     // navigate("/dashboard");
//   };

//   return (
//     <div className="login-frame">
//       {/* ============ LEFT / BRAND PANEL ============ */}
//       <div className="brand-panel">
//         <div>
//           <div className="brand-eyebrow">Administrative Access</div>
//           <h1 className="brand-title">
//             The Admin
//             <br />
//             <em>Registry.</em>
//           </h1>
//           <p className="brand-copy">
//             Credentials issued here govern the passport records system.
//             Every session is logged against the name on file — sign in
//             under your own registered identity.
//           </p>

//           <div className="seal-wrap">
//             <svg
//               className="seal"
//               viewBox="0 0 100 100"
//               xmlns="http://www.w3.org/2000/svg"
//               aria-hidden="true"
//             >
//               <circle cx="50" cy="50" r="46" fill="none" stroke="#B08D57" strokeWidth="2.5" />
//               <circle
//                 cx="50"
//                 cy="50"
//                 r="38"
//                 fill="none"
//                 stroke="#B08D57"
//                 strokeWidth="1"
//                 strokeDasharray="2 3"
//               />
//               <text
//                 x="50"
//                 y="34"
//                 textAnchor="middle"
//                 fontFamily="IBM Plex Mono, monospace"
//                 fontSize="7"
//                 fill="#D6B679"
//                 letterSpacing="1"
//               >
//                 ADMIN
//               </text>
//               <text
//                 x="50"
//                 y="70"
//                 textAnchor="middle"
//                 fontFamily="IBM Plex Mono, monospace"
//                 fontSize="7"
//                 fill="#D6B679"
//                 letterSpacing="1"
//               >
//                 REGISTRY
//               </text>
//               <path
//                 d="M32 50 L45 61 L70 38"
//                 fill="none"
//                 stroke="#D6B679"
//                 strokeWidth="4"
//                 strokeLinecap="round"
//                 strokeLinejoin="round"
//               />
//             </svg>
//             <div className="seal-caption">
//               <b>Verified access only.</b>
//               <br />
//               Every sign-in is timestamped against your record.
//             </div>
//           </div>
//         </div>

//         <div className="ledger">
//           <span>REC. SYS. v1</span>
//           <span>{new Date().toLocaleDateString(undefined, { day: "2-digit", month: "short", year: "numeric" })}</span>
//         </div>
//       </div>

//       {/* ============ RIGHT / FORM PANEL ============ */}
//       <div className="form-panel">
//         <div className="form-shell">
//           <h2 className="form-heading">Sign in</h2>
//           <p className="form-sub">Enter the credentials on your admin record.</p>

//           <form onSubmit={handleSubmit} noValidate>
//             <div className={`field ${emailError ? "has-error" : ""}`}>
//               <label htmlFor="email">Email</label>
//               <input
//                 id="email"
//                 type="email"
//                 placeholder="you@registry.gov"
//                 autoComplete="username"
//                 value={email}
//                 onChange={(e) => {
//                   setEmail(e.target.value);
//                   if (emailError) setEmailError(false);
//                 }}
//               />
//               <div className="field-error">Enter a valid email address.</div>
//             </div>

//             <div className={`field ${passwordError ? "has-error" : ""}`}>
//               <label htmlFor="password">Password</label>
//               <input
//                 id="password"
//                 type="password"
//                 placeholder="••••••••"
//                 autoComplete="current-password"
//                 value={password}
//                 onChange={(e) => {
//                   setPassword(e.target.value);
//                   if (passwordError) setPasswordError(false);
//                 }}
//               />
//               <div className="field-error">Password is required.</div>
//             </div>

//             <button className={`submit-btn ${loading ? "loading" : ""}`} type="submit" disabled={loading}>
//               <span className="spinner" />
//               <span className="btn-label">{loading ? "Please wait…" : "Sign In"}</span>
//             </button>

//             {banner.message && <div className={`banner show ${banner.type}`}>{banner.message}</div>}
//           </form>

//           <p className="config-note">
//             API base: <code>{API_BASE_URL}</code> — edit <code>API_BASE_URL</code> in{" "}
//             <code>Login.js</code> to point at your backend.
//           </p>
//         </div>
//       </div>

//       {/* ============ SUCCESS OVERLAY ============ */}
//       {granted && (
//         <div className="stamp-overlay show">
//           <div className="stamp-card">
//             <svg className="stamp-mark" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
//               <circle cx="50" cy="50" r="46" fill="none" stroke="#3E6B63" strokeWidth="3" />
//               <circle cx="50" cy="50" r="38" fill="none" stroke="#3E6B63" strokeWidth="1" strokeDasharray="2 3" />
//               <path
//                 d="M30 50 L44 63 L72 34"
//                 fill="none"
//                 stroke="#3E6B63"
//                 strokeWidth="5"
//                 strokeLinecap="round"
//                 strokeLinejoin="round"
//               />
//             </svg>
//             <div className="stamp-title">Access Granted</div>
//             <div className="stamp-sub">
//               Welcome back{adminName ? `, ${adminName}` : ""}.
//             </div>
//             <button className="stamp-close" type="button" onClick={handleContinue}>
//               Continue
//             </button>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }

// export default Login;

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Login.css";

const API_BASE_URL = "https://passport-o7j6.onrender.com/api/admin";

function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emailError, setEmailError] = useState(false);
  const [passwordError, setPasswordError] = useState(false);
  const [banner, setBanner] = useState({ type: "", message: "" });
  const [loading, setLoading] = useState(false);

  const isValidEmail = (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setBanner({ type: "", message: "" });

    const trimmedEmail = email.trim();
    const emailValid = isValidEmail(trimmedEmail);
    const passwordValid = password.length > 0;

    setEmailError(!emailValid);
    setPasswordError(!passwordValid);
    if (!emailValid || !passwordValid) return;

    setLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: trimmedEmail, password }),
      });

      let data;
      try {
        data = await response.json();
      } catch {
        throw new Error("Server returned an unexpected response.");
      }

      if (!response.ok || data.success === false) {
        throw new Error(data.message || "Invalid credentials.");
      }

      localStorage.setItem("adminToken", data.token);
      localStorage.setItem("adminInfo", JSON.stringify(data.admin || {}));

      navigate("/dashboard");
    } catch (err) {
      setBanner({
        type: "error",
        message:
          err.message === "Failed to fetch"
            ? "Could not reach the server. Is the backend running and CORS enabled?"
            : err.message,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-frame">
      {/* ============ LEFT / BRAND PANEL ============ */}
      <div className="brand-panel">
        <div>
          <div className="brand-eyebrow">Administrative Access</div>
          <h1 className="brand-title">
            The Admin
            <br />
            <em>Registry.</em>
          </h1>
          <p className="brand-copy">
            Credentials issued here govern the passport records system.
            Every session is logged against the name on file — sign in
            under your own registered identity.
          </p>

          <div className="seal-wrap">
            <svg
              className="seal"
              viewBox="0 0 100 100"
              xmlns="http://www.w3.org/2000/svg"
              aria-hidden="true"
            >
              <circle cx="50" cy="50" r="46" fill="none" stroke="#B08D57" strokeWidth="2.5" />
              <circle
                cx="50"
                cy="50"
                r="38"
                fill="none"
                stroke="#B08D57"
                strokeWidth="1"
                strokeDasharray="2 3"
              />
              <text
                x="50"
                y="34"
                textAnchor="middle"
                fontFamily="IBM Plex Mono, monospace"
                fontSize="7"
                fill="#D6B679"
                letterSpacing="1"
              >
                ADMIN
              </text>
              <text
                x="50"
                y="70"
                textAnchor="middle"
                fontFamily="IBM Plex Mono, monospace"
                fontSize="7"
                fill="#D6B679"
                letterSpacing="1"
              >
                REGISTRY
              </text>
              <path
                d="M32 50 L45 61 L70 38"
                fill="none"
                stroke="#D6B679"
                strokeWidth="4"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <div className="seal-caption">
              <b>Verified access only.</b>
              <br />
              Every sign-in is timestamped against your record.
            </div>
          </div>
        </div>

        <div className="ledger">
          <span>REC. SYS. v1</span>
          <span>
            {new Date().toLocaleDateString(undefined, {
              day: "2-digit",
              month: "short",
              year: "numeric",
            })}
          </span>
        </div>
      </div>

      {/* ============ RIGHT / FORM PANEL ============ */}
      <div className="form-panel">
        <div className="form-shell">
          <h2 className="form-heading">Sign in</h2>
          <p className="form-sub">Enter the credentials on your admin record.</p>

          <form onSubmit={handleSubmit} noValidate>
            <div className={`field ${emailError ? "has-error" : ""}`}>
              <label htmlFor="email">Email</label>
              <input
                id="email"
                type="email"
                placeholder="you@registry.gov"
                autoComplete="username"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (emailError) setEmailError(false);
                }}
              />
              <div className="field-error">Enter a valid email address.</div>
            </div>

            <div className={`field ${passwordError ? "has-error" : ""}`}>
              <label htmlFor="password">Password</label>
              <input
                id="password"
                type="password"
                placeholder="••••••••"
                autoComplete="current-password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  if (passwordError) setPasswordError(false);
                }}
              />
              <div className="field-error">Password is required.</div>
            </div>

            <button className={`submit-btn ${loading ? "loading" : ""}`} type="submit" disabled={loading}>
              <span className="spinner" />
              <span className="btn-label">{loading ? "Please wait…" : "Sign In"}</span>
            </button>

            {banner.message && <div className={`banner show ${banner.type}`}>{banner.message}</div>}
          </form>
{/* 
          <p className="config-note">
            API base: <code>{API_BASE_URL}</code> — edit <code>API_BASE_URL</code> in{" "}
            <code>Login.jsx</code> to point at your backend.
          </p> */}
        </div>
      </div>
    </div>
  );
}

export default Login;