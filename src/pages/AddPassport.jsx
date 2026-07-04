// import React, { useEffect, useState } from "react";
// import { useNavigate, useParams } from "react-router-dom";
// import axios from "axios";
// import "./AddPassport.css";

// // ---- Axios instance inline (isi file ke andar) ----
// const api = axios.create({ baseURL: "https://passport-o7j6.onrender.com/api" });
// api.interceptors.request.use((config) => {
//   const token = localStorage.getItem("adminToken");
//   if (token) config.headers.Authorization = `Bearer ${token}`;
//   return config;
// });

// // ---- PDF helpers inline ----
// const viewPdf = async (id) => {
//   try {
//     const res = await api.get(`/passports/${id}/view-pdf`, { responseType: "blob" });
//     const url = window.URL.createObjectURL(new Blob([res.data], { type: "application/pdf" }));
//     window.open(url, "_blank");
//   } catch (err) {
//     alert("PDF load nahi ho payi. " + (err.message || ""));
//   }
// };

// const downloadPdf = async (id, applicationId) => {
//   try {
//     const res = await api.get(`/passports/${id}/download-pdf`, { responseType: "blob" });
//     const url = window.URL.createObjectURL(new Blob([res.data], { type: "application/pdf" }));
//     const link = document.createElement("a");
//     link.href = url;
//     link.setAttribute("download", `Passport_${applicationId || id}.pdf`);
//     document.body.appendChild(link);
//     link.click();
//     link.remove();
//     window.URL.revokeObjectURL(url);
//   } catch (err) {
//     alert("PDF download nahi ho payi. " + (err.message || ""));
//   }
// };

// const fileFieldsList = [
//   "profilePhoto",
//   "passportFront",
//   "passportBack",
//   "aadhaarCard",
//   "panCard",
//   "visaPdf",
//   "contractPdf",
//   "approvalPdf",
//   "otherDocument",
// ];

// const initialState = {
//   fullName: "",
//   fatherName: "",
//   motherName: "",
//   gender: "",
//   dob: "",
//   nationality: "Indian",
//   phone: "",
//   email: "",
//   address: "",
//   city: "",
//   state: "",
//   country: "India",
//   pincode: "",

//   applicationId: "",
//   passportNumber: "",
//   passportType: "Normal",
//   issueDate: "",
//   expiryDate: "",
//   placeOfIssue: "",
//   issuingCountry: "India",
//   processingOffice: "",
//   assignedExecutive: "",
//   currentRemarks: "",

//   employerName: "",
//   jobTitle: "",
//   employmentType: "",
//   companyAddress: "",
//   companyCountry: "",
//   salary: "",
//   contractDuration: "",
//   offerLetterDate: "",
//   joiningDate: "",
//   employmentRemarks: "",

//   visaType: "",
//   visaNumber: "",
//   visaCountry: "",
//   visaCategory: "",
//   visaIssueDate: "",
//   visaExpiryDate: "",
//   visaDuration: "",
//   embassyName: "",
//   embassyReference: "",

//   status: "Application Submitted",
//   officerRemark: "",
//   expectedCompletion: "",
// };

// const toInputDate = (value) => {
//   if (!value) return "";
//   const d = new Date(value);
//   if (isNaN(d)) return "";
//   return d.toISOString().split("T")[0];
// };

// export default function AddPassport() {
//   const { id } = useParams();
//   const isEdit = Boolean(id);
//   const navigate = useNavigate();

//   const [formData, setFormData] = useState(initialState);
//   const [files, setFiles] = useState({});
//   const [loading, setLoading] = useState(false);
//   const [banner, setBanner] = useState({ type: "", message: "" });
//   const [createdId, setCreatedId] = useState(null);
//   const [createdAppId, setCreatedAppId] = useState(null);

//   useEffect(() => {
//     if (isEdit) {
//       (async () => {
//         try {
//           const res = await api.get(`/passports/${id}`);
//           const p = res.data.data;
//           setFormData({
//             ...initialState,
//             ...p,
//             dob: toInputDate(p.dob),
//             issueDate: toInputDate(p.issueDate),
//             expiryDate: toInputDate(p.expiryDate),
//             offerLetterDate: toInputDate(p.offerLetterDate),
//             joiningDate: toInputDate(p.joiningDate),
//             visaIssueDate: toInputDate(p.visaIssueDate),
//             visaExpiryDate: toInputDate(p.visaExpiryDate),
//             expectedCompletion: toInputDate(p.expectedCompletion),
//           });
//         } catch (err) {
//           setBanner({ type: "error", message: "Passport load nahi ho payi." });
//         }
//       })();
//     }
//     // eslint-disable-next-line
//   }, [id]);

//   const handleChange = (e) => {
//     setFormData({ ...formData, [e.target.name]: e.target.value });
//   };

//   const handleFileChange = (e) => {
//     setFiles({ ...files, [e.target.name]: e.target.files[0] });
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setBanner({ type: "", message: "" });
//     setLoading(true);

//     try {
//       const payload = new FormData();

//       Object.entries(formData).forEach(([key, value]) => {
//         if (value !== null && value !== undefined) {
//           payload.append(key, value);
//         }
//       });

//       fileFieldsList.forEach((field) => {
//         if (files[field]) {
//           payload.append(field, files[field]);
//         }
//       });

//       let res;
//       if (isEdit) {
//         res = await api.put(`/passports/${id}`, payload);
//       } else {
//         res = await api.post(`/passports`, payload);
//       }

//       setBanner({
//         type: "success",
//         message: isEdit ? "Passport Updated Successfully!" : "Passport Created Successfully!",
//       });

//       const saved = res.data.data;
//       setCreatedId(saved._id);
//       setCreatedAppId(saved.applicationId);

//       if (!isEdit) {
//         setFormData(initialState);
//         setFiles({});
//       }
//     } catch (err) {
//       setBanner({
//         type: "error",
//         message: err.response?.data?.message || err.message || "Kuch galat ho gaya.",
//       });
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="passport-form-wrap">
//       <h2>{isEdit ? "Edit Passport" : "Add New Passport"}</h2>

//       {banner.message && <div className={`pf-banner ${banner.type}`}>{banner.message}</div>}

//       {createdId && (
//         <div className="pdf-action-box">
//           <span>Form saved ho gaya. PDF check karo:</span>
//           <button type="button" onClick={() => viewPdf(createdId)}>View PDF</button>
//           <button type="button" onClick={() => downloadPdf(createdId, createdAppId)}>Download PDF</button>
//           <button type="button" onClick={() => navigate(`/passports/${createdId}`)}>Open Details</button>
//         </div>
//       )}

//       <form onSubmit={handleSubmit} className="passport-form">
//         {/* PERSONAL DETAILS */}
//         <fieldset>
//           <legend>Personal Details</legend>
//           <div className="pf-grid">
//             <div className="pf-field">
//               <label>Full Name *</label>
//               <input name="fullName" value={formData.fullName} onChange={handleChange} required />
//             </div>
//             <div className="pf-field">
//               <label>Father's Name</label>
//               <input name="fatherName" value={formData.fatherName} onChange={handleChange} />
//             </div>
//             <div className="pf-field">
//               <label>Mother's Name</label>
//               <input name="motherName" value={formData.motherName} onChange={handleChange} />
//             </div>
//             <div className="pf-field">
//               <label>Gender *</label>
//               <select name="gender" value={formData.gender} onChange={handleChange} required>
//                 <option value="">Select</option>
//                 <option value="Male">Male</option>
//                 <option value="Female">Female</option>
//                 <option value="Other">Other</option>
//               </select>
//             </div>
//             <div className="pf-field">
//               <label>Date of Birth *</label>
//               <input type="date" name="dob" value={formData.dob} onChange={handleChange} required />
//             </div>
//             <div className="pf-field">
//               <label>Nationality</label>
//               <input name="nationality" value={formData.nationality} onChange={handleChange} />
//             </div>
//             <div className="pf-field">
//               <label>Phone *</label>
//               <input name="phone" value={formData.phone} onChange={handleChange} required />
//             </div>
//             <div className="pf-field">
//               <label>Email</label>
//               <input type="email" name="email" value={formData.email} onChange={handleChange} />
//             </div>
//             <div className="pf-field pf-span2">
//               <label>Address *</label>
//               <input name="address" value={formData.address} onChange={handleChange} required />
//             </div>
//             <div className="pf-field">
//               <label>City</label>
//               <input name="city" value={formData.city} onChange={handleChange} />
//             </div>
//             <div className="pf-field">
//               <label>State</label>
//               <input name="state" value={formData.state} onChange={handleChange} />
//             </div>
//             <div className="pf-field">
//               <label>Country</label>
//               <input name="country" value={formData.country} onChange={handleChange} />
//             </div>
//             <div className="pf-field">
//               <label>Pincode</label>
//               <input name="pincode" value={formData.pincode} onChange={handleChange} />
//             </div>
//           </div>
//         </fieldset>

//         {/* PASSPORT DETAILS */}
//         <fieldset>
//           <legend>Passport Details</legend>
//           <div className="pf-grid">
//             <div className="pf-field">
//               <label>Application ID *</label>
//               <input name="applicationId" value={formData.applicationId} onChange={handleChange} required disabled={isEdit} />
//             </div>
//             <div className="pf-field">
//               <label>Passport Number *</label>
//               <input name="passportNumber" value={formData.passportNumber} onChange={handleChange} required />
//             </div>
//             <div className="pf-field">
//               <label>Passport Type</label>
//               <select name="passportType" value={formData.passportType} onChange={handleChange}>
//                 <option value="Normal">Normal</option>
//                 <option value="Tatkal">Tatkal</option>
//                 <option value="Official">Official</option>
//                 <option value="Diplomatic">Diplomatic</option>
//                 <option value="Ordinary">Ordinary</option>
//               </select>
//             </div>
//             <div className="pf-field">
//               <label>Issue Date</label>
//               <input type="date" name="issueDate" value={formData.issueDate} onChange={handleChange} />
//             </div>
//             <div className="pf-field">
//               <label>Expiry Date</label>
//               <input type="date" name="expiryDate" value={formData.expiryDate} onChange={handleChange} />
//             </div>
//             <div className="pf-field">
//               <label>Place of Issue</label>
//               <input name="placeOfIssue" value={formData.placeOfIssue} onChange={handleChange} />
//             </div>
//             <div className="pf-field">
//               <label>Issuing Country</label>
//               <input name="issuingCountry" value={formData.issuingCountry} onChange={handleChange} />
//             </div>
//             <div className="pf-field">
//               <label>Processing Office</label>
//               <input name="processingOffice" value={formData.processingOffice} onChange={handleChange} />
//             </div>
//             <div className="pf-field">
//               <label>Assigned Executive</label>
//               <input name="assignedExecutive" value={formData.assignedExecutive} onChange={handleChange} />
//             </div>
//             <div className="pf-field pf-span2">
//               <label>Current Remarks</label>
//               <input name="currentRemarks" value={formData.currentRemarks} onChange={handleChange} />
//             </div>

//             {isEdit && (
//               <>
//                 <div className="pf-field">
//                   <label>Status</label>
//                   <select name="status" value={formData.status} onChange={handleChange}>
//                     {[
//                       "Application Submitted", "Documents Uploaded", "Verification Started",
//                       "Document Verification", "Police Verification", "Under Review",
//                       "Employment Approved", "Visa Approved", "Embassy Review", "Approved",
//                       "Passport Printed", "Printed", "Passport Dispatched", "Dispatched",
//                       "Completed", "Rejected",
//                     ].map((s) => (
//                       <option key={s} value={s}>{s}</option>
//                     ))}
//                   </select>
//                 </div>
//                 <div className="pf-field">
//                   <label>Expected Completion</label>
//                   <input type="date" name="expectedCompletion" value={formData.expectedCompletion} onChange={handleChange} />
//                 </div>
//                 <div className="pf-field pf-span2">
//                   <label>Officer Remark</label>
//                   <input name="officerRemark" value={formData.officerRemark} onChange={handleChange} />
//                 </div>
//               </>
//             )}
//           </div>
//         </fieldset>

//         {/* EMPLOYMENT DETAILS */}
//         <fieldset>
//           <legend>Employment Details (optional)</legend>
//           <div className="pf-grid">
//             <div className="pf-field">
//               <label>Employer Name</label>
//               <input name="employerName" value={formData.employerName} onChange={handleChange} />
//             </div>
//             <div className="pf-field">
//               <label>Job Title</label>
//               <input name="jobTitle" value={formData.jobTitle} onChange={handleChange} />
//             </div>
//             <div className="pf-field">
//               <label>Employment Type</label>
//               <select name="employmentType" value={formData.employmentType} onChange={handleChange}>
//                 <option value="">Select</option>
//                 <option value="Full-time">Full-time</option>
//                 <option value="Part-time">Part-time</option>
//                 <option value="Contract">Contract</option>
//                 <option value="Temporary">Temporary</option>
//               </select>
//             </div>
//             <div className="pf-field">
//               <label>Company Address</label>
//               <input name="companyAddress" value={formData.companyAddress} onChange={handleChange} />
//             </div>
//             <div className="pf-field">
//               <label>Company Country</label>
//               <input name="companyCountry" value={formData.companyCountry} onChange={handleChange} />
//             </div>
//             <div className="pf-field">
//               <label>Salary</label>
//               <input name="salary" value={formData.salary} onChange={handleChange} />
//             </div>
//             <div className="pf-field">
//               <label>Contract Duration</label>
//               <input name="contractDuration" value={formData.contractDuration} onChange={handleChange} />
//             </div>
//             <div className="pf-field">
//               <label>Offer Letter Date</label>
//               <input type="date" name="offerLetterDate" value={formData.offerLetterDate} onChange={handleChange} />
//             </div>
//             <div className="pf-field">
//               <label>Joining Date</label>
//               <input type="date" name="joiningDate" value={formData.joiningDate} onChange={handleChange} />
//             </div>
//             <div className="pf-field pf-span2">
//               <label>Employment Remarks</label>
//               <input name="employmentRemarks" value={formData.employmentRemarks} onChange={handleChange} />
//             </div>
//           </div>
//         </fieldset>

//         {/* VISA DETAILS */}
//         <fieldset>
//           <legend>Visa Details (optional)</legend>
//           <div className="pf-grid">
//             <div className="pf-field">
//               <label>Visa Type</label>
//               <input name="visaType" value={formData.visaType} onChange={handleChange} />
//             </div>
//             <div className="pf-field">
//               <label>Visa Number</label>
//               <input name="visaNumber" value={formData.visaNumber} onChange={handleChange} />
//             </div>
//             <div className="pf-field">
//               <label>Visa Country</label>
//               <input name="visaCountry" value={formData.visaCountry} onChange={handleChange} />
//             </div>
//             <div className="pf-field">
//               <label>Visa Category</label>
//               <input name="visaCategory" value={formData.visaCategory} onChange={handleChange} />
//             </div>
//             <div className="pf-field">
//               <label>Visa Issue Date</label>
//               <input type="date" name="visaIssueDate" value={formData.visaIssueDate} onChange={handleChange} />
//             </div>
//             <div className="pf-field">
//               <label>Visa Expiry Date</label>
//               <input type="date" name="visaExpiryDate" value={formData.visaExpiryDate} onChange={handleChange} />
//             </div>
//             <div className="pf-field">
//               <label>Visa Duration</label>
//               <input name="visaDuration" value={formData.visaDuration} onChange={handleChange} />
//             </div>
//             <div className="pf-field">
//               <label>Embassy Name</label>
//               <input name="embassyName" value={formData.embassyName} onChange={handleChange} />
//             </div>
//             <div className="pf-field">
//               <label>Embassy Reference</label>
//               <input name="embassyReference" value={formData.embassyReference} onChange={handleChange} />
//             </div>
//           </div>
//         </fieldset>

//         {/* FILE UPLOADS */}
//         <fieldset>
//           <legend>Documents Upload</legend>
//           <div className="pf-grid">
//             <div className="pf-field">
//               <label>Profile Photo</label>
//               <input type="file" name="profilePhoto" accept="image/*" onChange={handleFileChange} />
//             </div>
//             <div className="pf-field">
//               <label>Passport Front</label>
//               <input type="file" name="passportFront" accept="image/*,.pdf" onChange={handleFileChange} />
//             </div>
//             <div className="pf-field">
//               <label>Passport Back</label>
//               <input type="file" name="passportBack" accept="image/*,.pdf" onChange={handleFileChange} />
//             </div>
//             <div className="pf-field">
//               <label>Aadhaar Card</label>
//               <input type="file" name="aadhaarCard" accept="image/*,.pdf" onChange={handleFileChange} />
//             </div>
//             <div className="pf-field">
//               <label>PAN Card</label>
//               <input type="file" name="panCard" accept="image/*,.pdf" onChange={handleFileChange} />
//             </div>
//             <div className="pf-field">
//               <label>Visa PDF</label>
//               <input type="file" name="visaPdf" accept=".pdf" onChange={handleFileChange} />
//             </div>
//             <div className="pf-field">
//               <label>Contract PDF</label>
//               <input type="file" name="contractPdf" accept=".pdf" onChange={handleFileChange} />
//             </div>
//             <div className="pf-field">
//               <label>Approval PDF</label>
//               <input type="file" name="approvalPdf" accept=".pdf" onChange={handleFileChange} />
//             </div>
//             <div className="pf-field">
//               <label>Other Document</label>
//               <input type="file" name="otherDocument" onChange={handleFileChange} />
//             </div>
//           </div>
//           <p className="pf-hint">Har file max 10MB. Naya upload karne par purani file replace ho jaayegi (edit mode mein).</p>
//         </fieldset>

//         <div className="pf-submit-row">
//           <button type="submit" className="pf-submit-btn" disabled={loading}>
//             {loading ? "Saving..." : isEdit ? "Update Passport" : "Save Passport"}
//           </button>
//           <button type="button" className="pf-cancel-btn" onClick={() => navigate("/passports")}>
//             Cancel
//           </button>
//         </div>
//       </form>
//     </div>
//   );
// }

import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import "./AddPassport.css";

// ---- Axios instance inline (isi file ke andar) ----
const api = axios.create({ baseURL: "https://passport-o7j6.onrender.com/api" });
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("adminToken");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// ---- PDF helpers inline ----
const viewPdf = async (id) => {
  try {
    const res = await api.get(`/passports/${id}/view-pdf`, { responseType: "blob" });
    const url = window.URL.createObjectURL(new Blob([res.data], { type: "application/pdf" }));
    window.open(url, "_blank");
  } catch (err) {
    alert("PDF load nahi ho payi. " + (err.message || ""));
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
    alert("PDF download nahi ho payi. " + (err.message || ""));
  }
};

const fileFieldsList = [
  "profilePhoto",
  "passportFront",
  "passportBack",
  "aadhaarCard",
  "panCard",
  "visaPdf",
  "contractPdf",
  "approvalPdf",
  "otherDocument",
];

// Ye fields backend khud manage karta hai / DB internal hain —
// inhe edit form se wapas body mein bhejna zaroori nahi, isliye exclude
const excludedFields = [
  "_id",
  "__v",
  "tracking",
  "createdAt",
  "updatedAt",
  "createdBy",
  "updatedBy",
  "qrCode",
  ...fileFieldsList,
];

const initialState = {
  fullName: "",
  fatherName: "",
  motherName: "",
  gender: "",
  dob: "",
  nationality: "Indian",
  phone: "",
  email: "",
  address: "",
  city: "",
  state: "",
  country: "India",
  pincode: "",

  applicationId: "",
  passportNumber: "",
  passportType: "Normal",
  issueDate: "",
  expiryDate: "",
  placeOfIssue: "",
  issuingCountry: "India",
  processingOffice: "",
  assignedExecutive: "",
  currentRemarks: "",

  employerName: "",
  jobTitle: "",
  employmentType: "",
  companyAddress: "",
  companyCountry: "",
  salary: "",
  contractDuration: "",
  offerLetterDate: "",
  joiningDate: "",
  employmentRemarks: "",

  visaType: "",
  visaNumber: "",
  visaCountry: "",
  visaCategory: "",
  visaIssueDate: "",
  visaExpiryDate: "",
  visaDuration: "",
  embassyName: "",
  embassyReference: "",

  status: "Application Submitted",
  officerRemark: "",
  expectedCompletion: "",
};

const toInputDate = (value) => {
  if (!value) return "";
  const d = new Date(value);
  if (isNaN(d)) return "";
  return d.toISOString().split("T")[0];
};

export default function AddPassport() {
  const { id } = useParams();
  const isEdit = Boolean(id);
  const navigate = useNavigate();

  const [formData, setFormData] = useState(initialState);
  const [files, setFiles] = useState({});
  const [loading, setLoading] = useState(false);
  const [banner, setBanner] = useState({ type: "", message: "" });
  const [createdId, setCreatedId] = useState(null);
  const [createdAppId, setCreatedAppId] = useState(null);

  useEffect(() => {
    if (isEdit) {
      (async () => {
        try {
          const res = await api.get(`/passports/${id}`);
          const p = res.data.data;
          setFormData({
            ...initialState,
            ...p,
            dob: toInputDate(p.dob),
            issueDate: toInputDate(p.issueDate),
            expiryDate: toInputDate(p.expiryDate),
            offerLetterDate: toInputDate(p.offerLetterDate),
            joiningDate: toInputDate(p.joiningDate),
            visaIssueDate: toInputDate(p.visaIssueDate),
            visaExpiryDate: toInputDate(p.visaExpiryDate),
            expectedCompletion: toInputDate(p.expectedCompletion),
          });
        } catch (err) {
          setBanner({ type: "error", message: "Passport load nahi ho payi." });
        }
      })();
    }
    // eslint-disable-next-line
  }, [id]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    setFiles({ ...files, [e.target.name]: e.target.files[0] });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setBanner({ type: "", message: "" });
    setLoading(true);

    try {
      const payload = new FormData();

      Object.entries(formData).forEach(([key, value]) => {
        if (excludedFields.includes(key)) return;
        if (value !== null && value !== undefined) {
          payload.append(key, value);
        }
      });

      fileFieldsList.forEach((field) => {
        if (files[field]) {
          payload.append(field, files[field]);
        }
      });

      let res;
      if (isEdit) {
        res = await api.put(`/passports/${id}`, payload);
      } else {
        res = await api.post(`/passports`, payload);
      }

      setBanner({
        type: "success",
        message: isEdit ? "Passport Updated Successfully!" : "Passport Created Successfully!",
      });

      const saved = res.data.data;
      setCreatedId(saved._id);
      setCreatedAppId(saved.applicationId);

      if (!isEdit) {
        setFormData(initialState);
        setFiles({});
      }
    } catch (err) {
      setBanner({
        type: "error",
        message: err.response?.data?.message || err.message || "Kuch galat ho gaya.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="passport-form-wrap">
      <h2>{isEdit ? "Edit Passport" : "Add New Passport"}</h2>

      {banner.message && <div className={`pf-banner ${banner.type}`}>{banner.message}</div>}

      {createdId && (
        <div className="pdf-action-box">
          <span>Form saved ho gaya. PDF check karo:</span>
          <button type="button" onClick={() => viewPdf(createdId)}>View PDF</button>
          <button type="button" onClick={() => downloadPdf(createdId, createdAppId)}>Download PDF</button>
          <button type="button" onClick={() => navigate(`/passports/${createdId}`)}>Open Details</button>
        </div>
      )}

      <form onSubmit={handleSubmit} className="passport-form">
        {/* PERSONAL DETAILS */}
        <fieldset>
          <legend>Personal Details</legend>
          <div className="pf-grid">
            <div className="pf-field">
              <label>Full Name *</label>
              <input name="fullName" value={formData.fullName} onChange={handleChange} required />
            </div>
            <div className="pf-field">
              <label>Father's Name</label>
              <input name="fatherName" value={formData.fatherName} onChange={handleChange} />
            </div>
            <div className="pf-field">
              <label>Mother's Name</label>
              <input name="motherName" value={formData.motherName} onChange={handleChange} />
            </div>
            <div className="pf-field">
              <label>Gender *</label>
              <select name="gender" value={formData.gender} onChange={handleChange} required>
                <option value="">Select</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>
            <div className="pf-field">
              <label>Date of Birth *</label>
              <input type="date" name="dob" value={formData.dob} onChange={handleChange} required />
            </div>
            <div className="pf-field">
              <label>Nationality</label>
              <input name="nationality" value={formData.nationality} onChange={handleChange} />
            </div>
            <div className="pf-field">
              <label>Phone *</label>
              <input name="phone" value={formData.phone} onChange={handleChange} required />
            </div>
            <div className="pf-field">
              <label>Email</label>
              <input type="email" name="email" value={formData.email} onChange={handleChange} />
            </div>
            <div className="pf-field pf-span2">
              <label>Address *</label>
              <input name="address" value={formData.address} onChange={handleChange} required />
            </div>
            <div className="pf-field">
              <label>City</label>
              <input name="city" value={formData.city} onChange={handleChange} />
            </div>
            <div className="pf-field">
              <label>State</label>
              <input name="state" value={formData.state} onChange={handleChange} />
            </div>
            <div className="pf-field">
              <label>Country</label>
              <input name="country" value={formData.country} onChange={handleChange} />
            </div>
            <div className="pf-field">
              <label>Pincode</label>
              <input name="pincode" value={formData.pincode} onChange={handleChange} />
            </div>
          </div>
        </fieldset>

        {/* PASSPORT DETAILS */}
        <fieldset>
          <legend>Passport Details</legend>
          <div className="pf-grid">
            <div className="pf-field">
              <label>Application ID *</label>
              <input name="applicationId" value={formData.applicationId} onChange={handleChange} required disabled={isEdit} />
            </div>
            <div className="pf-field">
              <label>Passport Number *</label>
              <input name="passportNumber" value={formData.passportNumber} onChange={handleChange} required />
            </div>
            <div className="pf-field">
              <label>Passport Type</label>
              <select name="passportType" value={formData.passportType} onChange={handleChange}>
                <option value="Normal">Normal</option>
                <option value="Tatkal">Tatkal</option>
                <option value="Official">Official</option>
                <option value="Diplomatic">Diplomatic</option>
                <option value="Ordinary">Ordinary</option>
              </select>
            </div>
            <div className="pf-field">
              <label>Issue Date</label>
              <input type="date" name="issueDate" value={formData.issueDate} onChange={handleChange} />
            </div>
            <div className="pf-field">
              <label>Expiry Date</label>
              <input type="date" name="expiryDate" value={formData.expiryDate} onChange={handleChange} />
            </div>
            <div className="pf-field">
              <label>Place of Issue</label>
              <input name="placeOfIssue" value={formData.placeOfIssue} onChange={handleChange} />
            </div>
            <div className="pf-field">
              <label>Issuing Country</label>
              <input name="issuingCountry" value={formData.issuingCountry} onChange={handleChange} />
            </div>
            <div className="pf-field">
              <label>Processing Office</label>
              <input name="processingOffice" value={formData.processingOffice} onChange={handleChange} />
            </div>
            <div className="pf-field">
              <label>Assigned Executive</label>
              <input name="assignedExecutive" value={formData.assignedExecutive} onChange={handleChange} />
            </div>
            <div className="pf-field pf-span2">
              <label>Current Remarks</label>
              <input name="currentRemarks" value={formData.currentRemarks} onChange={handleChange} />
            </div>

            {isEdit && (
              <>
                <div className="pf-field">
                  <label>Status</label>
                  <select name="status" value={formData.status} onChange={handleChange}>
                    {[
                      "Application Submitted", "Documents Uploaded", "Verification Started",
                      "Document Verification", "Police Verification", "Under Review",
                      "Employment Approved", "Visa Approved", "Embassy Review", "Approved",
                      "Passport Printed", "Printed", "Passport Dispatched", "Dispatched",
                      "Completed", "Rejected",
                    ].map((s) => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                </div>
                <div className="pf-field">
                  <label>Expected Completion</label>
                  <input type="date" name="expectedCompletion" value={formData.expectedCompletion} onChange={handleChange} />
                </div>
                <div className="pf-field pf-span2">
                  <label>Officer Remark</label>
                  <input name="officerRemark" value={formData.officerRemark} onChange={handleChange} />
                </div>
              </>
            )}
          </div>
        </fieldset>

        {/* EMPLOYMENT DETAILS */}
        <fieldset>
          <legend>Employment Details (optional)</legend>
          <div className="pf-grid">
            <div className="pf-field">
              <label>Employer Name</label>
              <input name="employerName" value={formData.employerName} onChange={handleChange} />
            </div>
            <div className="pf-field">
              <label>Job Title</label>
              <input name="jobTitle" value={formData.jobTitle} onChange={handleChange} />
            </div>
            <div className="pf-field">
              <label>Employment Type</label>
              <select name="employmentType" value={formData.employmentType} onChange={handleChange}>
                <option value="">Select</option>
                <option value="Full-time">Full-time</option>
                <option value="Part-time">Part-time</option>
                <option value="Contract">Contract</option>
                <option value="Temporary">Temporary</option>
              </select>
            </div>
            <div className="pf-field">
              <label>Company Address</label>
              <input name="companyAddress" value={formData.companyAddress} onChange={handleChange} />
            </div>
            <div className="pf-field">
              <label>Company Country</label>
              <input name="companyCountry" value={formData.companyCountry} onChange={handleChange} />
            </div>
            <div className="pf-field">
              <label>Salary</label>
              <input name="salary" value={formData.salary} onChange={handleChange} />
            </div>
            <div className="pf-field">
              <label>Contract Duration</label>
              <input name="contractDuration" value={formData.contractDuration} onChange={handleChange} />
            </div>
            <div className="pf-field">
              <label>Offer Letter Date</label>
              <input type="date" name="offerLetterDate" value={formData.offerLetterDate} onChange={handleChange} />
            </div>
            <div className="pf-field">
              <label>Joining Date</label>
              <input type="date" name="joiningDate" value={formData.joiningDate} onChange={handleChange} />
            </div>
            <div className="pf-field pf-span2">
              <label>Employment Remarks</label>
              <input name="employmentRemarks" value={formData.employmentRemarks} onChange={handleChange} />
            </div>
          </div>
        </fieldset>

        {/* VISA DETAILS */}
        <fieldset>
          <legend>Visa Details (optional)</legend>
          <div className="pf-grid">
            <div className="pf-field">
              <label>Visa Type</label>
              <input name="visaType" value={formData.visaType} onChange={handleChange} />
            </div>
            <div className="pf-field">
              <label>Visa Number</label>
              <input name="visaNumber" value={formData.visaNumber} onChange={handleChange} />
            </div>
            <div className="pf-field">
              <label>Visa Country</label>
              <input name="visaCountry" value={formData.visaCountry} onChange={handleChange} />
            </div>
            <div className="pf-field">
              <label>Visa Category</label>
              <input name="visaCategory" value={formData.visaCategory} onChange={handleChange} />
            </div>
            <div className="pf-field">
              <label>Visa Issue Date</label>
              <input type="date" name="visaIssueDate" value={formData.visaIssueDate} onChange={handleChange} />
            </div>
            <div className="pf-field">
              <label>Visa Expiry Date</label>
              <input type="date" name="visaExpiryDate" value={formData.visaExpiryDate} onChange={handleChange} />
            </div>
            <div className="pf-field">
              <label>Visa Duration</label>
              <input name="visaDuration" value={formData.visaDuration} onChange={handleChange} />
            </div>
            <div className="pf-field">
              <label>Embassy Name</label>
              <input name="embassyName" value={formData.embassyName} onChange={handleChange} />
            </div>
            <div className="pf-field">
              <label>Embassy Reference</label>
              <input name="embassyReference" value={formData.embassyReference} onChange={handleChange} />
            </div>
          </div>
        </fieldset>

        {/* FILE UPLOADS */}
        <fieldset>
          <legend>Documents Upload</legend>
          <div className="pf-grid">
            <div className="pf-field">
              <label>Profile Photo</label>
              <input type="file" name="profilePhoto" accept="image/*" onChange={handleFileChange} />
            </div>
            <div className="pf-field">
              <label>Passport Front</label>
              <input type="file" name="passportFront" accept="image/*,.pdf" onChange={handleFileChange} />
            </div>
            <div className="pf-field">
              <label>Passport Back</label>
              <input type="file" name="passportBack" accept="image/*,.pdf" onChange={handleFileChange} />
            </div>
            <div className="pf-field">
              <label>Aadhaar Card</label>
              <input type="file" name="aadhaarCard" accept="image/*,.pdf" onChange={handleFileChange} />
            </div>
            <div className="pf-field">
              <label>PAN Card</label>
              <input type="file" name="panCard" accept="image/*,.pdf" onChange={handleFileChange} />
            </div>
            <div className="pf-field">
              <label>Visa PDF</label>
              <input type="file" name="visaPdf" accept=".pdf" onChange={handleFileChange} />
            </div>
            <div className="pf-field">
              <label>Contract PDF</label>
              <input type="file" name="contractPdf" accept=".pdf" onChange={handleFileChange} />
            </div>
            <div className="pf-field">
              <label>Approval PDF</label>
              <input type="file" name="approvalPdf" accept=".pdf" onChange={handleFileChange} />
            </div>
            <div className="pf-field">
              <label>Other Document</label>
              <input type="file" name="otherDocument" onChange={handleFileChange} />
            </div>
          </div>
          <p className="pf-hint">Har file max 10MB. Naya upload karne par purani file replace ho jaayegi (edit mode mein).</p>
        </fieldset>

        <div className="pf-submit-row">
          <button type="submit" className="pf-submit-btn" disabled={loading}>
            {loading ? "Saving..." : isEdit ? "Update Passport" : "Save Passport"}
          </button>
          <button type="button" className="pf-cancel-btn" onClick={() => navigate("/passports")}>
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}