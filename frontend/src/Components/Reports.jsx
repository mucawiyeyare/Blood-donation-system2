import React, { useState, useEffect } from "react";
import {
  FileText,
  Download,
  Calendar,
  Filter,
  Printer,
  Droplet,
  Building2,
  Users,
  CheckCircle2,
  Clock,
  Sparkles,
} from "lucide-react";
import axios from "axios";
import DhiigKaalLogo from "./DhiigKaalLogo.jsx";

function Reports() {
  const [users, setUsers] = useState([]);
  const [donors, setDonors] = useState([]);
  const [hospitals, setHospitals] = useState([]);
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [reportOutput, setReportOutput] = useState("");
  const [reportTitle, setReportTitle] = useState("");
  const [userRole, setUserRole] = useState("");

  useEffect(() => {
    const role = localStorage.getItem("role");
    setUserRole(role);
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const token = localStorage.getItem("token");
      const role = localStorage.getItem("role");

      if (role === "admin" || role === "health_institution") {
        const [usersRes, donorsRes, hospRes] = await Promise.all([
          axios.get("/api/admin/users", {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get("/api/users/donors", {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get("/api/admin/hospitals", {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);
        setUsers(usersRes.data);
        setDonors(donorsRes.data);
        setHospitals(hospRes.data);
      } else if (role === "hospital") {
        const [donorsRes, reqRes] = await Promise.all([
          axios.get("/api/users/donors", {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get("/api/requests/hospital", {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);
        setDonors(donorsRes.data);
        setRequests(reqRes.data);
      }
      setLoading(false);
    } catch (error) {
      console.error("Error fetching report data:", error);
      setLoading(false);
    }
  };

  const generateNationalSummaryReport = () => {
    setReportTitle("DHIIG KAAL - National Blood Donation Summary Report");
    const bloodTypes = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];
    const counts = {};
    bloodTypes.forEach((bt) => {
      counts[bt] = donors.filter((d) => d.bloodType === bt).length;
    });

    const report = `
═══════════════════════════════════════════════════════════════════════════
                              DHIIG KAAL
               NATIONAL BLOOD DONATION MANAGEMENT SYSTEM
═══════════════════════════════════════════════════════════════════════════
Date Generated: ${new Date().toLocaleString()}
Classification: Official Healthcare Summary (Somalia)

1. SYSTEM LEVEL OVERVIEW
───────────────────────────────────────────────────────────────────────────
• Total Registered Donors       : ${donors.length}
• Total Verified Hospitals      : ${hospitals.length}
• Total Registered Users        : ${users.length}
• Available Active Donors       : ${donors.filter((d) => d.status === "Available").length}
• Donors in Medical Cooldown    : ${donors.filter((d) => d.status === "Donated").length}

2. BLOOD TYPE DISTRIBUTION MATRIX
───────────────────────────────────────────────────────────────────────────
${bloodTypes
  .map((bt) => {
    const c = counts[bt];
    const pct = donors.length > 0 ? ((c / donors.length) * 100).toFixed(1) : 0;
    return `${bt.padEnd(6)}: ${c.toString().padStart(4)} donors  (${pct}%)`;
  })
  .join("\n")}

3. REGISTERED HEALTHCARE FACILITIES
───────────────────────────────────────────────────────────────────────────
${hospitals
  .map(
    (h, idx) =>
      `${idx + 1}. ${h.name.padEnd(30)} | Location: ${h.location.padEnd(20)} | Phone: ${h.phone}`
  )
  .join("\n")}

═══════════════════════════════════════════════════════════════════════════
                     END OF NATIONAL SUMMARY REPORT
═══════════════════════════════════════════════════════════════════════════
    `;
    setReportOutput(report.trim());
  };

  const generateHospitalReport = () => {
    setReportTitle("DHIIG KAAL - Hospital Blood Requests & Donation Report");
    const completed = requests.filter((r) => r.status === "Completed");
    const pending = requests.filter((r) => r.status === "Pending" || r.status === "Arrived");

    const report = `
═══════════════════════════════════════════════════════════════════════════
                              DHIIG KAAL
                 HOSPITAL CLINICAL ACTIVITY REPORT
═══════════════════════════════════════════════════════════════════════════
Date Generated : ${new Date().toLocaleString()}
Facility Name  : ${localStorage.getItem("userName") || "Hospital Clinic"}

1. REQUEST & DONATION METRICS
───────────────────────────────────────────────────────────────────────────
• Total Blood Requests Dispatched : ${requests.length}
• Completed / Donated Requests   : ${completed.length}
• Active / Pending Requests       : ${pending.length}
• Fulfillment Success Rate        : ${
      requests.length > 0 ? ((completed.length / requests.length) * 100).toFixed(1) : 0
    }%

2. FULFILLED DONATIONS LOG
───────────────────────────────────────────────────────────────────────────
${
  completed.length === 0
    ? "No completed donations recorded."
    : completed
        .map(
          (r, idx) =>
            `${idx + 1}. ${new Date(r.completionDate || r.requestDate).toLocaleDateString()} | Donor: ${
              r.donorId?.name || "N/A"
            } | Blood: ${r.bloodType} | ID: ${r.donorId?.nationalId || "N/A"}`
        )
        .join("\n")
}

═══════════════════════════════════════════════════════════════════════════
                       END OF HOSPITAL REPORT
═══════════════════════════════════════════════════════════════════════════
    `;
    setReportOutput(report.trim());
  };

  const downloadReportFile = () => {
    if (!reportOutput) return;
    const blob = new Blob([reportOutput], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `DHIIG_KAAL_Report_${new Date().toISOString().slice(0, 10)}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  if (loading) {
    return (
      <div className="p-8 flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-14 w-14 border-4 border-red-600 border-t-transparent mx-auto mb-4"></div>
          <p className="text-slate-600 font-semibold">Generating report models...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8 bg-slate-50 min-h-screen">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl sm:text-3xl font-black text-slate-800 flex items-center gap-3">
          <span className="p-2 rounded-xl bg-red-600 text-white shadow-md shadow-red-600/30">
            <FileText className="w-6 h-6" />
          </span>
          Reports & Analytics Engine
        </h1>
        <p className="text-sm text-slate-600 mt-1">
          Generate, preview, print, and export structured operational reports
        </p>
      </div>

      {/* Report Generator Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-8">
        {(userRole === "admin" || userRole === "health_institution") && (
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200 hover:shadow-md transition-all flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 rounded-2xl bg-red-100 text-red-600 flex items-center justify-center mb-4">
                <Droplet className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-1">National Donor & Blood Distribution</h3>
              <p className="text-xs text-slate-500 leading-relaxed mb-4">
                Complete overview of registered donors, blood type distributions, and facility participation across Somalia.
              </p>
            </div>
            <button
              onClick={generateNationalSummaryReport}
              className="w-full py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-xl font-bold text-xs flex items-center justify-center gap-2 shadow-md transition-all"
            >
              <FileText className="w-4 h-4" />
              <span>Generate Summary Report</span>
            </button>
          </div>
        )}

        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200 hover:shadow-md transition-all flex flex-col justify-between">
          <div>
            <div className="w-12 h-12 rounded-2xl bg-sky-100 text-sky-600 flex items-center justify-center mb-4">
              <Building2 className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 mb-1">Hospital Clinical Requests & Response</h3>
            <p className="text-xs text-slate-500 leading-relaxed mb-4">
              Detailed tracking of dispatched blood requests, 2-hour arrival fulfillment rates, and completed donations.
            </p>
          </div>
          <button
            onClick={generateHospitalReport}
            className="w-full py-2.5 bg-sky-600 hover:bg-sky-700 text-white rounded-xl font-bold text-xs flex items-center justify-center gap-2 shadow-md transition-all"
          >
            <FileText className="w-4 h-4" />
            <span>Generate Activity Report</span>
          </button>
        </div>
      </div>

      {/* Generated Report Output Box */}
      {reportOutput && (
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 mb-4 border-b border-slate-100">
            <div>
              <h3 className="text-lg font-bold text-slate-900">{reportTitle}</h3>
              <p className="text-xs text-slate-500">Ready for print and export</p>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => window.print()}
                className="py-2 px-3.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-bold text-xs flex items-center gap-1.5 transition-colors"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Print</span>
              </button>
              <button
                onClick={downloadReportFile}
                className="py-2 px-4 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold text-xs flex items-center gap-1.5 shadow-md transition-all"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Download .TXT</span>
              </button>
            </div>
          </div>

          <pre className="bg-slate-900 text-slate-100 p-6 rounded-2xl text-xs sm:text-sm font-mono overflow-x-auto whitespace-pre leading-relaxed border border-slate-800">
            {reportOutput}
          </pre>
        </div>
      )}
    </div>
  );
}

export default Reports;
