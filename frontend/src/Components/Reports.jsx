import React, { useState, useEffect } from "react";
import { FileText, Download, Calendar, Filter, Printer } from "lucide-react";
import axios from "axios";

function Reports() {
  const [users, setUsers] = useState([]);
  const [donors, setDonors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [generatingReport, setGeneratingReport] = useState(false);
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
      
      // Only admins can fetch all users
      if (role === "admin") {
        const usersResponse = await axios.get("http://localhost:3000/api/admin/users", {
          headers: { Authorization: `Bearer ${token}` }
        });
        setUsers(usersResponse.data);
      }
      
      // Both admin and hospital can fetch donors
      const donorsResponse = await axios.get("http://localhost:3000/api/users/donors", {
        headers: { Authorization: `Bearer ${token}` }
      });

      setDonors(donorsResponse.data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching data:", error);
      setLoading(false);
    }
  };

  const generateDonorReport = (e) => {
    // Prevent any default behavior
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    
    setGeneratingReport(true);
    
    // Calculate blood type distribution
    const bloodTypes = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];
    const bloodTypeCount = {};
    
    bloodTypes.forEach(type => {
      bloodTypeCount[type] = donors.filter(d => d.bloodType === type).length;
    });

    // Generate report content
    let reportContent = `
═══════════════════════════════════════════════════════════
          BLOOD DONATION MANAGEMENT SYSTEM
                  DONOR STATISTICS REPORT
═══════════════════════════════════════════════════════════

Generated: ${new Date().toLocaleString()}

SUMMARY STATISTICS:
─────────────────────────────────────────────────────────
Total Registered Donors: ${donors.length}
Total Users in System: ${users.length}
Total Hospitals: ${users.filter(u => u.role === "hospital").length}
Total Admins: ${users.filter(u => u.role === "admin").length}

BLOOD TYPE DISTRIBUTION:
─────────────────────────────────────────────────────────
${bloodTypes.map(type => {
  const count = bloodTypeCount[type];
  const percentage = donors.length > 0 ? ((count / donors.length) * 100).toFixed(1) : 0;
  return `${type.padEnd(5)} : ${count.toString().padStart(4)} donors (${percentage}%)`;
}).join('\n')}

DONOR DETAILS:
─────────────────────────────────────────────────────────
${donors.map((donor, index) => `
${index + 1}. ${donor.name}
   Email: ${donor.email}
   Phone: ${donor.phone}
   Blood Type: ${donor.bloodType}
   Location: ${donor.location}
   Registered: ${new Date(donor.createdAt).toLocaleDateString()}
`).join('\n')}

═══════════════════════════════════════════════════════════
                    END OF REPORT
═══════════════════════════════════════════════════════════
    `;

    // Create blob and download (NO PRINTING)
    const blob = new Blob([reportContent], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Donor_Report_${new Date().toISOString().split('T')[0]}.txt`;
    a.style.display = 'none'; // Hide the link
    document.body.appendChild(a);
    a.click();
    // Clean up immediately
    setTimeout(() => {
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    }, 100);
    
    setTimeout(() => setGeneratingReport(false), 1000);
  };

  const generateUserReport = (e) => {
    // Prevent any default behavior
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    
    setGeneratingReport(true);
    
    const roleCount = {
      donor: users.filter(u => u.role === "donor").length,
      hospital: users.filter(u => u.role === "hospital").length,
      admin: users.filter(u => u.role === "admin").length
    };

    let reportContent = `
═══════════════════════════════════════════════════════════
          BLOOD DONATION MANAGEMENT SYSTEM
                  USER STATISTICS REPORT
═══════════════════════════════════════════════════════════

Generated: ${new Date().toLocaleString()}

SUMMARY STATISTICS:
─────────────────────────────────────────────────────────
Total Users: ${users.length}
Donors: ${roleCount.donor}
Hospitals: ${roleCount.hospital}
Administrators: ${roleCount.admin}

USER DETAILS BY ROLE:
─────────────────────────────────────────────────────────

DONORS (${roleCount.donor}):
${users.filter(u => u.role === "donor").map((user, index) => `
${index + 1}. ${user.name} - ${user.bloodType} - ${user.location}
   Email: ${user.email} | Phone: ${user.phone}
`).join('\n')}

HOSPITALS (${roleCount.hospital}):
${users.filter(u => u.role === "hospital").map((user, index) => `
${index + 1}. ${user.name} - ${user.location}
   Email: ${user.email} | Phone: ${user.phone}
`).join('\n')}

ADMINISTRATORS (${roleCount.admin}):
${users.filter(u => u.role === "admin").map((user, index) => `
${index + 1}. ${user.name}
   Email: ${user.email}
`).join('\n')}

═══════════════════════════════════════════════════════════
                    END OF REPORT
═══════════════════════════════════════════════════════════
    `;

    const blob = new Blob([reportContent], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `User_Report_${new Date().toISOString().split('T')[0]}.txt`;
    a.style.display = 'none';
    document.body.appendChild(a);
    a.click();
    setTimeout(() => {
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    }, 100);
    
    setTimeout(() => setGeneratingReport(false), 1000);
  };

  const generateBloodInventoryReport = (e) => {
    // Prevent any default behavior
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    
    setGeneratingReport(true);
    
    const bloodTypes = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];
    const bloodTypeCount = {};
    
    bloodTypes.forEach(type => {
      bloodTypeCount[type] = donors.filter(d => d.bloodType === type).length;
    });

    let reportContent = `
═══════════════════════════════════════════════════════════
          BLOOD DONATION MANAGEMENT SYSTEM
              BLOOD INVENTORY REPORT
═══════════════════════════════════════════════════════════

Generated: ${new Date().toLocaleString()}

BLOOD TYPE AVAILABILITY:
─────────────────────────────────────────────────────────
${bloodTypes.map(type => {
  const count = bloodTypeCount[type];
  const percentage = donors.length > 0 ? ((count / donors.length) * 100).toFixed(1) : 0;
  const status = count > 10 ? "✓ Good" : count > 5 ? "⚠ Low" : "✗ Critical";
  return `${type.padEnd(5)} : ${count.toString().padStart(4)} donors (${percentage}%) - ${status}`;
}).join('\n')}

LOCATION-WISE DONOR DISTRIBUTION:
─────────────────────────────────────────────────────────
${Array.from(new Set(donors.map(d => d.location))).map(location => {
  const locationDonors = donors.filter(d => d.location === location);
  return `${location}: ${locationDonors.length} donors`;
}).join('\n')}

RECOMMENDATIONS:
─────────────────────────────────────────────────────────
${bloodTypes.map(type => {
  const count = bloodTypeCount[type];
  if (count < 5) return `⚠ URGENT: Need more ${type} donors`;
  if (count < 10) return `⚠ LOW: Recruit more ${type} donors`;
  return null;
}).filter(Boolean).join('\n') || '✓ All blood types have adequate donors'}

═══════════════════════════════════════════════════════════
                    END OF REPORT
═══════════════════════════════════════════════════════════
    `;

    const blob = new Blob([reportContent], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Blood_Inventory_Report_${new Date().toISOString().split('T')[0]}.txt`;
    a.style.display = 'none';
    document.body.appendChild(a);
    a.click();
    setTimeout(() => {
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    }, 100);
    
    setTimeout(() => setGeneratingReport(false), 1000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-800 mb-2">Reports</h1>
        <p className="text-gray-600">
          {userRole === "hospital" 
            ? "Generate and download donor reports for your hospital" 
            : "Generate and download real-time system reports"}
        </p>
      </div>

      {/* System Statistics */}
      <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Current System Statistics</h2>
        {loading ? (
          <p className="text-gray-500">Loading data...</p>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {userRole === "admin" && (
              <div className="bg-blue-50 p-4 rounded-lg text-center">
                <p className="text-sm text-gray-600 mb-1">Total Users</p>
                <p className="text-3xl font-bold text-blue-600">{users.length}</p>
              </div>
            )}
            <div className="bg-red-50 p-4 rounded-lg text-center">
              <p className="text-sm text-gray-600 mb-1">Total Donors</p>
              <p className="text-3xl font-bold text-red-600">{donors.length}</p>
            </div>
            {userRole === "admin" && (
              <div className="bg-green-50 p-4 rounded-lg text-center">
                <p className="text-sm text-gray-600 mb-1">Hospitals</p>
                <p className="text-3xl font-bold text-green-600">{users.filter(u => u.role === "hospital").length}</p>
              </div>
            )}
            <div className="bg-purple-50 p-4 rounded-lg text-center">
              <p className="text-sm text-gray-600 mb-1">Blood Types</p>
              <p className="text-3xl font-bold text-purple-600">8</p>
            </div>
            <div className="bg-orange-50 p-4 rounded-lg text-center">
              <p className="text-sm text-gray-600 mb-1">Available Donors</p>
              <p className="text-3xl font-bold text-orange-600">{donors.length}</p>
            </div>
          </div>
        )}
      </div>

      {/* Generate New Report Section */}
      <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Generate Real-Time Reports</h2>
        <p className="text-gray-600 mb-4">
          {userRole === "hospital" 
            ? "Generate donor reports to track available donors for your hospital" 
            : "Click any button below to generate and download a report with current system data"}
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {userRole === "admin" && (
            <button 
              type="button"
              onClick={generateUserReport}
              disabled={generatingReport || loading}
              className="bg-blue-500 hover:bg-blue-600 disabled:bg-gray-400 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200 flex items-center justify-center gap-2"
            >
              <Download className="w-5 h-5" />
              {generatingReport ? "Downloading..." : "Download User Report"}
            </button>
          )}
          <button 
            type="button"
            onClick={generateDonorReport}
            disabled={generatingReport || loading}
            className="bg-red-500 hover:bg-red-600 disabled:bg-gray-400 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200 flex items-center justify-center gap-2"
          >
            <Download className="w-5 h-5" />
            {generatingReport ? "Downloading..." : "Download Donor Report"}
          </button>
          <button 
            type="button"
            onClick={generateBloodInventoryReport}
            disabled={generatingReport || loading}
            className="bg-green-500 hover:bg-green-600 disabled:bg-gray-400 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200 flex items-center justify-center gap-2"
          >
            <Download className="w-5 h-5" />
            {generatingReport ? "Downloading..." : "Download Inventory Report"}
          </button>
        </div>
      </div>

      {/* Report Information */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Report Information</h2>
        <div className="space-y-4">
          {userRole === "admin" && (
            <div className="flex items-start gap-3 p-4 bg-blue-50 rounded-lg">
              <FileText className="w-6 h-6 text-blue-600 mt-1" />
              <div>
                <h3 className="font-semibold text-gray-800 mb-1">User Statistics Report</h3>
                <p className="text-sm text-gray-600">
                  Comprehensive report of all users in the system, categorized by role (Donors, Hospitals, Admins) 
                  with detailed contact information and registration dates.
                </p>
              </div>
            </div>
          )}
          
          <div className="flex items-start gap-3 p-4 bg-red-50 rounded-lg">
            <FileText className="w-6 h-6 text-red-600 mt-1" />
            <div>
              <h3 className="font-semibold text-gray-800 mb-1">Donor Report</h3>
              <p className="text-sm text-gray-600">
                {userRole === "hospital" 
                  ? "Complete list of available donors with blood type distribution, contact details, and location information for your hospital's donor requests."
                  : "Detailed donor statistics including blood type distribution, individual donor information, contact details, and registration timeline."}
              </p>
            </div>
          </div>
          
          <div className="flex items-start gap-3 p-4 bg-green-50 rounded-lg">
            <FileText className="w-6 h-6 text-green-600 mt-1" />
            <div>
              <h3 className="font-semibold text-gray-800 mb-1">Blood Inventory Report</h3>
              <p className="text-sm text-gray-600">
                {userRole === "hospital"
                  ? "Blood type availability report showing donor counts by blood type, location-wise distribution, and critical shortage alerts for your hospital."
                  : "Blood type availability analysis with status indicators (Good/Low/Critical), location-wise distribution, and recommendations for donor recruitment."}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Reports;
