import React, { useEffect, useState } from "react";
import axios from "axios";
import { Clock, User, Droplet, AlertCircle, CheckCircle, XCircle, Calendar, MessageSquare } from "lucide-react";

function HospitalRequests() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filterStatus, setFilterStatus] = useState("");

  useEffect(() => {
    fetchRequests();
  }, [filterStatus]);

  const fetchRequests = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setError("No authentication token found");
        setLoading(false);
        return;
      }

      const url = filterStatus
        ? `http://localhost:3000/api/requests/hospital?status=${filterStatus}`
        : "http://localhost:3000/api/requests/hospital";

      const res = await axios.get(url, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setRequests(res.data);
      setError(null);
    } catch (err) {
      console.error("Error fetching requests:", err);
      setError(err.response?.data?.message || "Failed to load requests");
    } finally {
      setLoading(false);
    }
  };

  const markAsCompleted = async (requestId) => {
    if (!window.confirm("Are you sure you want to mark this donation as completed?")) {
      return;
    }

    try {
      const token = localStorage.getItem("token");
      await axios.put(
        `http://localhost:3000/api/requests/${requestId}/complete`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );

      alert("Donation marked as completed successfully!");
      fetchRequests();
    } catch (err) {
      alert(err.response?.data?.message || "Failed to mark as completed");
    }
  };

  const cancelRequest = async (requestId) => {
    if (!window.confirm("Are you sure you want to cancel this request?")) {
      return;
    }

    try {
      const token = localStorage.getItem("token");
      await axios.delete(`http://localhost:3000/api/requests/${requestId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      alert("Request cancelled successfully!");
      fetchRequests();
    } catch (err) {
      alert(err.response?.data?.message || "Failed to cancel request");
    }
  };

  const getStatusBadge = (status) => {
    const badges = {
      Pending: { color: "bg-yellow-100 text-yellow-800", icon: Clock },
      Accepted: { color: "bg-green-100 text-green-800", icon: CheckCircle },
      Declined: { color: "bg-red-100 text-red-800", icon: XCircle },
      Completed: { color: "bg-blue-100 text-blue-800", icon: CheckCircle },
      Cancelled: { color: "bg-gray-100 text-gray-800", icon: XCircle },
    };

    const badge = badges[status] || badges.Pending;
    const Icon = badge.icon;

    return (
      <span className={`px-3 py-1 rounded-full text-sm font-semibold flex items-center gap-1 ${badge.color}`}>
        <Icon className="w-4 h-4" />
        {status}
      </span>
    );
  };

  const getUrgencyBadge = (urgency) => {
    const colors = {
      Emergency: "bg-red-600 text-white",
      Urgent: "bg-orange-500 text-white",
      Routine: "bg-blue-500 text-white",
    };

    return (
      <span className={`px-3 py-1 rounded-full text-xs font-bold ${colors[urgency] || colors.Routine}`}>
        {urgency}
      </span>
    );
  };

  if (loading) {
    return (
      <div className="p-6 w-full">
        <p className="text-gray-600">Loading requests...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 w-full">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          <strong>Error:</strong> {error}
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 w-full bg-gradient-to-br from-gray-50 to-gray-100 min-h-screen">
      {/* Header */}
      <div className="mb-6">
        <h2 className="text-3xl font-bold text-gray-800 mb-2">My Donor Requests</h2>
        <p className="text-gray-600">Manage and track your donor requests</p>
      </div>

      {/* Filter Section */}
      <div className="bg-white rounded-xl shadow-lg p-4 mb-6">
        <div className="flex items-center gap-4">
          <label className="text-sm font-semibold text-gray-700">Filter by Status:</label>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
          >
            <option value="">All Requests</option>
            <option value="Pending">Pending</option>
            <option value="Accepted">Accepted</option>
            <option value="Declined">Declined</option>
            <option value="Completed">Completed</option>
            <option value="Cancelled">Cancelled</option>
          </select>
          <span className="text-sm text-gray-600">
            Showing {requests.length} request{requests.length !== 1 ? "s" : ""}
          </span>
        </div>
      </div>

      {/* Requests List */}
      {requests.length === 0 ? (
        <div className="bg-white rounded-xl shadow-lg p-8 text-center">
          <AlertCircle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600 text-lg">No requests found</p>
          <p className="text-gray-500 text-sm mt-2">
            {filterStatus ? "Try changing the filter" : "Start by requesting donors from the Donors page"}
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {requests.map((request) => (
            <div key={request._id} className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow">
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                    <User className="w-6 h-6 text-red-600" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-800">{request.donorId?.name}</h3>
                    <p className="text-sm text-gray-600">{request.donorId?.email}</p>
                  </div>
                </div>
                <div className="flex flex-col items-end gap-2">
                  {getStatusBadge(request.status)}
                  {getUrgencyBadge(request.urgency)}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <div className="flex items-center gap-2">
                  <Droplet className="w-5 h-5 text-red-600" />
                  <div>
                    <p className="text-xs text-gray-500">Blood Type</p>
                    <p className="font-semibold text-gray-800">{request.bloodType}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-blue-600" />
                  <div>
                    <p className="text-xs text-gray-500">Request Date</p>
                    <p className="font-semibold text-gray-800">
                      {new Date(request.requestDate).toLocaleDateString()}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Clock className="w-5 h-5 text-green-600" />
                  <div>
                    <p className="text-xs text-gray-500">Donor Phone</p>
                    <p className="font-semibold text-gray-800">{request.donorId?.phone}</p>
                  </div>
                </div>
              </div>

              {request.message && (
                <div className="bg-gray-50 rounded-lg p-3 mb-4">
                  <div className="flex items-start gap-2">
                    <MessageSquare className="w-4 h-4 text-gray-600 mt-1" />
                    <div>
                      <p className="text-xs text-gray-500 mb-1">Your Message</p>
                      <p className="text-sm text-gray-700">{request.message}</p>
                    </div>
                  </div>
                </div>
              )}

              {request.status === "Accepted" && request.availabilityTime && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-3 mb-4">
                  <p className="text-sm font-semibold text-green-800 mb-1">
                    ✓ Donor Available At: {request.availabilityTime}
                  </p>
                  <p className="text-xs text-green-700">
                    Contact the donor at {request.donorId?.phone} to coordinate the donation
                  </p>
                </div>
              )}

              {request.status === "Declined" && request.declineReason && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-4">
                  <p className="text-sm font-semibold text-red-800 mb-1">Decline Reason:</p>
                  <p className="text-sm text-red-700">{request.declineReason}</p>
                </div>
              )}

              {request.status === "Completed" && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-4">
                  <p className="text-sm font-semibold text-blue-800">
                    ✓ Donation completed on {new Date(request.completionDate).toLocaleDateString()}
                  </p>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex gap-3 mt-4">
                {request.status === "Accepted" && (
                  <button
                    onClick={() => markAsCompleted(request._id)}
                    className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-semibold transition-colors flex items-center gap-2"
                  >
                    <CheckCircle className="w-4 h-4" />
                    Mark as Completed
                  </button>
                )}

                {request.status === "Pending" && (
                  <button
                    onClick={() => cancelRequest(request._id)}
                    className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-semibold transition-colors flex items-center gap-2"
                  >
                    <XCircle className="w-4 h-4" />
                    Cancel Request
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default HospitalRequests;
