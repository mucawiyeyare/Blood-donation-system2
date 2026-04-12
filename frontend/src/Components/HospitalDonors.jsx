import React, { useEffect, useState } from "react";
import axios from "axios";
import { User, Droplet, MapPin, Phone, Clock, CheckCircle, XCircle, AlertCircle, Search, Filter } from "lucide-react";

function HospitalDonors() {
  const [donors, setDonors] = useState([]);
  const [filteredDonors, setFilteredDonors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filterBloodType, setFilterBloodType] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchDonors();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [donors, filterBloodType, searchTerm]);

  const fetchDonors = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setError("No authentication token found");
        setLoading(false);
        return;
      }

      const res = await axios.get("http://localhost:3000/api/users/donors?status=Available", {
        headers: { Authorization: `Bearer ${token}` },
      });

      setDonors(res.data);
      setError(null);
    } catch (err) {
      console.error("Error fetching donors:", err);
      setError(err.response?.data?.message || "Failed to load donors");
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = [...donors];

    // Filter by blood type
    if (filterBloodType) {
      filtered = filtered.filter((donor) => donor.bloodType === filterBloodType);
    }

    // Search by name, email, or location
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(
        (donor) =>
          donor.name.toLowerCase().includes(term) ||
          donor.email.toLowerCase().includes(term) ||
          donor.location.toLowerCase().includes(term)
      );
    }

    setFilteredDonors(filtered);
  };

  const requestDonor = async (donorId, bloodType) => {
    try {
      const token = localStorage.getItem("token");
      const urgency = prompt("Enter urgency level (Routine/Urgent/Emergency):", "Routine");
      const message = prompt("Enter a message for the donor (optional):", "");

      if (!urgency) return;

      await axios.post(
        "http://localhost:3000/api/requests/create",
        {
          donorId,
          bloodType,
          urgency,
          message,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      alert("Donor request sent successfully!");
      fetchDonors(); // Refresh to update status
    } catch (err) {
      alert(err.response?.data?.message || "Failed to send request");
    }
  };

  const getStatusBadge = (status) => {
    const badges = {
      Available: { color: "bg-green-100 text-green-800 border-green-300", icon: CheckCircle },
      Requested: { color: "bg-yellow-100 text-yellow-800 border-yellow-300", icon: Clock },
      "Donated Recently": { 
        color: "bg-red-100 text-red-800 border-red-300", 
        icon: XCircle,
        label: "Donated Recently: He will become available after 6 months"
      },
      Unavailable: { color: "bg-gray-100 text-gray-800 border-gray-300", icon: AlertCircle },
    };

    const badge = badges[status] || badges.Available;
    const Icon = badge.icon;

    return (
      <span className={`px-3 py-1 rounded-full text-xs font-bold border flex items-center gap-1 ${badge.color}`}>
        <Icon className="w-3 h-3" />
        {badge.label || status}
      </span>
    );
  };

  if (loading) {
    return (
      <div className="p-6 w-full flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-red-600 mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg">Loading donors...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 w-full">
        <div className="bg-red-100 border border-red-400 text-red-700 px-6 py-4 rounded-lg">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-5 h-5" />
            <strong>Error:</strong> {error}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 w-full bg-gradient-to-br from-gray-50 to-gray-100 min-h-screen">
      {/* Header */}
      <div className="mb-6">
        <h2 className="text-4xl font-bold text-gray-800 mb-2 flex items-center gap-3">
          <Droplet className="w-10 h-10 text-red-600" />
          Available Donors
        </h2>
        <p className="text-gray-600">Browse and request blood donors</p>
      </div>

      {/* Filters Section */}
      <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
        <div className="flex items-center gap-2 mb-4">
          <Filter className="w-5 h-5 text-gray-600" />
          <h3 className="text-lg font-semibold text-gray-800">Filters</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search by name, email, or location..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
            />
          </div>

          {/* Blood Type Filter */}
          <select
            value={filterBloodType}
            onChange={(e) => setFilterBloodType(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
          >
            <option value="">All Blood Types</option>
            <option value="A+">A+</option>
            <option value="A-">A-</option>
            <option value="B+">B+</option>
            <option value="B-">B-</option>
            <option value="AB+">AB+</option>
            <option value="AB-">AB-</option>
            <option value="O+">O+</option>
            <option value="O-">O-</option>
          </select>
        </div>

        <div className="mt-4 flex items-center justify-between">
          <p className="text-sm text-gray-600">
            Showing <span className="font-semibold text-gray-800">{filteredDonors.length}</span> of{" "}
            <span className="font-semibold text-gray-800">{donors.length}</span> available donors
          </p>
          {(filterBloodType || searchTerm) && (
            <button
              onClick={() => {
                setFilterBloodType("");
                setSearchTerm("");
              }}
              className="text-sm text-red-600 hover:text-red-700 font-semibold"
            >
              Clear Filters
            </button>
          )}
        </div>
      </div>

      {/* Donors Grid */}
      {filteredDonors.length === 0 ? (
        <div className="bg-white rounded-xl shadow-lg p-12 text-center">
          <AlertCircle className="w-20 h-20 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600 text-xl mb-2">No donors found</p>
          <p className="text-gray-500">Try adjusting your filters or search criteria</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredDonors.map((donor) => (
            <div
              key={donor._id}
              className="bg-white rounded-xl shadow-lg p-6 hover:shadow-2xl transition-all duration-300 border border-gray-100"
            >
              {/* Donor Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-14 h-14 bg-gradient-to-br from-red-500 to-red-600 rounded-full flex items-center justify-center shadow-lg">
                    <User className="w-7 h-7 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-gray-800">{donor.name}</h3>
                    <p className="text-sm text-gray-500">{donor.email}</p>
                  </div>
                </div>
              </div>

              {/* Blood Type Badge */}
              <div className="mb-4">
                <div className="inline-flex items-center gap-2 bg-red-600 text-white px-4 py-2 rounded-lg font-bold text-lg shadow-md">
                  <Droplet className="w-5 h-5" />
                  {donor.bloodType}
                </div>
              </div>

              {/* Donor Info */}
              <div className="space-y-3 mb-4">
                <div className="flex items-center gap-2 text-gray-700">
                  <Phone className="w-4 h-4 text-gray-500" />
                  <span className="text-sm">{donor.phone}</span>
                </div>
                <div className="flex items-center gap-2 text-gray-700">
                  <MapPin className="w-4 h-4 text-gray-500" />
                  <span className="text-sm">{donor.location}</span>
                </div>
              </div>

              {/* Status Badge */}
              <div className="mb-4">{getStatusBadge(donor.status)}</div>

              {/* Cooldown Info */}
              {donor.status === "Donated Recently" && donor.cooldownEndsAt && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-4">
                  <p className="text-xs text-red-800 font-semibold flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    Available after: {new Date(donor.cooldownEndsAt).toLocaleDateString()}
                  </p>
                </div>
              )}

              {/* Action Button */}
              <button
                onClick={() => requestDonor(donor._id, donor.bloodType)}
                disabled={donor.status !== "Available"}
                className={`w-full py-3 rounded-lg font-semibold transition-all duration-200 flex items-center justify-center gap-2 ${
                  donor.status === "Available"
                    ? "bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white shadow-lg hover:shadow-xl"
                    : "bg-gray-200 text-gray-500 cursor-not-allowed"
                }`}
              >
                <Droplet className="w-4 h-4" />
                {donor.status === "Available" ? "Request Donor" : "Not Available"}
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default HospitalDonors;
