import React, { useEffect, useState } from "react";
import axios from "axios";
import { Clock, Building2, Droplet, AlertCircle, CheckCircle, XCircle, Calendar, MessageSquare, Info } from "lucide-react";

function DonorRequests() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filterStatus, setFilterStatus] = useState("");
  const [showResponseModal, setShowResponseModal] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [responseForm, setResponseForm] = useState({
    response: "",
    availabilityTime: "",
    declineReason: "",
  });
  const [donorStatus, setDonorStatus] = useState(null);

  useEffect(() => {
    fetchRequests();
    checkDonorStatus();
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
        ? `http://localhost:3000/api/requests/donor?status=${filterStatus}`
        : "http://localhost:3000/api/requests/donor";

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

  const checkDonorStatus = async () => {
    try {
      const token = localStorage.getItem("token");
      const payload = JSON.parse(atob(token.split('.')[1]));
      const donorId = payload.id;

      const res = await axios.get(`http://localhost:3000/api/requests/status/${donorId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setDonorStatus(res.data);
    } catch (err) {
      console.error("Error checking donor status:", err);
    }
  };

  const openResponseModal = (request, response) => {
    setSelectedRequest(request);
    setResponseForm({
      response,
      availabilityTime: "",
      declineReason: "",
    });
    setShowResponseModal(true);
  };

  const closeResponseModal = () => {
    setShowResponseModal(false);
    setSelectedRequest(null);
    setResponseForm({
      response: "",
      availabilityTime: "",
      declineReason: "",
    });
  };

  const handleResponseSubmit = async (e) => {
    e.preventDefault();

    if (responseForm.response === "accept" && !responseForm.availabilityTime) {
      alert("Please provide your availability time");
      return;
    }

    try {
      const token = localStorage.getItem("token");
      await axios.put(
        `http://localhost:3000/api/requests/${selectedRequest._id}/respond`,
        {
          response: responseForm.response,
          availabilityTime: responseForm.availabilityTime,
          declineReason: responseForm.declineReason,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      alert(`Request ${responseForm.response}ed successfully!`);
      closeResponseModal();
      fetchRequests();
      checkDonorStatus();
    } catch (err) {
      alert(err.response?.data?.message || "Failed to respond to request");
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
        <h2 className="text-3xl font-bold text-gray-800 mb-2">My Requests</h2>
        <p className="text-gray-600">View and respond to hospital donation requests</p>
      </div>

      {/* Donor Status Alert */}
      {donorStatus && donorStatus.status === "Donated Recently" && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-6">
          <div className="flex items-start gap-3">
            <Info className="w-6 h-6 text-red-600 mt-1" />
            <div>
              <p className="font-semibold text-red-800 mb-1">6-Month Cooldown Period</p>
              <p className="text-sm text-red-700">
                You donated recently and are in the cooldown period. You can donate again after{" "}
                {donorStatus.cooldownEndsAt && new Date(donorStatus.cooldownEndsAt).toLocaleDateString()}.
              </p>
            </div>
          </div>
        </div>
      )}

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
            {filterStatus ? "Try changing the filter" : "You haven't received any donation requests yet"}
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {requests.map((request) => (
            <div key={request._id} className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow">
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                    <Building2 className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-800">{request.hospitalId?.name}</h3>
                    <p className="text-sm text-gray-600">{request.hospitalId?.email}</p>
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
                    <p className="text-xs text-gray-500">Blood Type Needed</p>
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
                    <p className="text-xs text-gray-500">Hospital Phone</p>
                    <p className="font-semibold text-gray-800">{request.hospitalId?.phone}</p>
                  </div>
                </div>
              </div>

              {request.message && (
                <div className="bg-blue-50 rounded-lg p-3 mb-4">
                  <div className="flex items-start gap-2">
                    <MessageSquare className="w-4 h-4 text-blue-600 mt-1" />
                    <div>
                      <p className="text-xs text-gray-500 mb-1">Hospital Message</p>
                      <p className="text-sm text-gray-700">{request.message}</p>
                    </div>
                  </div>
                </div>
              )}

              {request.status === "Accepted" && request.availabilityTime && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-3 mb-4">
                  <p className="text-sm font-semibold text-green-800 mb-1">
                    ✓ You accepted this request
                  </p>
                  <p className="text-sm text-green-700">
                    Your availability: {request.availabilityTime}
                  </p>
                  <p className="text-xs text-green-600 mt-1">
                    The hospital will contact you at your registered phone number
                  </p>
                </div>
              )}

              {request.status === "Declined" && request.declineReason && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-4">
                  <p className="text-sm font-semibold text-red-800 mb-1">You declined this request</p>
                  <p className="text-sm text-red-700">Reason: {request.declineReason}</p>
                </div>
              )}

              {request.status === "Completed" && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-4">
                  <p className="text-sm font-semibold text-blue-800">
                    ✓ Donation completed on {new Date(request.completionDate).toLocaleDateString()}
                  </p>
                  <p className="text-xs text-blue-700 mt-1">
                    Thank you for your donation! You can donate again after 6 months.
                  </p>
                </div>
              )}

              {/* Action Buttons */}
              {request.status === "Pending" && (
                <div className="flex gap-3 mt-4">
                  <button
                    onClick={() => openResponseModal(request, "accept")}
                    className="flex-1 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-semibold transition-colors flex items-center justify-center gap-2"
                  >
                    <CheckCircle className="w-4 h-4" />
                    Accept
                  </button>
                  <button
                    onClick={() => openResponseModal(request, "decline")}
                    className="flex-1 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-semibold transition-colors flex items-center justify-center gap-2"
                  >
                    <XCircle className="w-4 h-4" />
                    Decline
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Response Modal */}
      {showResponseModal && selectedRequest && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-2xl font-bold text-gray-800">
                  {responseForm.response === "accept" ? "Accept Request" : "Decline Request"}
                </h3>
                <p className="text-sm text-gray-600 mt-1">From {selectedRequest.hospitalId?.name}</p>
              </div>
              <button
                onClick={closeResponseModal}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <XCircle className="w-6 h-6" />
              </button>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                  <Droplet className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <p className="font-semibold text-gray-800">{selectedRequest.hospitalId?.name}</p>
                  <p className="text-sm text-gray-600">
                    Blood Type: <span className="font-bold text-red-600">{selectedRequest.bloodType}</span>
                  </p>
                  <p className="text-sm text-gray-600">Urgency: {selectedRequest.urgency}</p>
                </div>
              </div>
            </div>

            <form onSubmit={handleResponseSubmit}>
              {responseForm.response === "accept" ? (
                <div className="mb-6">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    When are you available? *
                  </label>
                  <input
                    type="text"
                    value={responseForm.availabilityTime}
                    onChange={(e) => setResponseForm({ ...responseForm, availabilityTime: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                    placeholder="e.g., Tomorrow at 10 AM, This weekend, etc."
                    required
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    The hospital will contact you to coordinate the donation
                  </p>
                </div>
              ) : (
                <div className="mb-6">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Reason for declining (Optional)
                  </label>
                  <textarea
                    value={responseForm.declineReason}
                    onChange={(e) => setResponseForm({ ...responseForm, declineReason: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                    rows="3"
                    placeholder="Let the hospital know why you can't donate..."
                  />
                </div>
              )}

              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={closeResponseModal}
                  className="flex-1 px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-lg font-semibold transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className={`flex-1 px-4 py-2 text-white rounded-lg font-semibold transition-colors flex items-center justify-center gap-2 ${
                    responseForm.response === "accept"
                      ? "bg-green-600 hover:bg-green-700"
                      : "bg-red-600 hover:bg-red-700"
                  }`}
                >
                  {responseForm.response === "accept" ? (
                    <>
                      <CheckCircle className="w-4 h-4" />
                      Accept Request
                    </>
                  ) : (
                    <>
                      <XCircle className="w-4 h-4" />
                      Decline Request
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default DonorRequests;
