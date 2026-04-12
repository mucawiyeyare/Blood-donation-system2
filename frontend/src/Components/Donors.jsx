import React, { useEffect, useState } from "react";
import axios from "axios";
import { Search, Filter, MapPin, Droplet, X, Send, AlertCircle, Edit, Save, User as UserIcon, Phone, Mail, Shield } from "lucide-react";

function Donors() {
  const [donors, setDonors] = useState([]);
  const [filteredDonors, setFilteredDonors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Search and filter states
  const [searchName, setSearchName] = useState("");
  const [selectedLocation, setSelectedLocation] = useState("");
  const [selectedBloodType, setSelectedBloodType] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  
  // Request modal states
  const [showRequestModal, setShowRequestModal] = useState(false);
  const [selectedDonor, setSelectedDonor] = useState(null);
  const [requestForm, setRequestForm] = useState({
    urgency: "Routine",
    message: "",
  });
  const [userRole, setUserRole] = useState("");

  // Edit Modal State (Admin Only)
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingDonor, setEditingDonor] = useState(null);
  const [editForm, setEditForm] = useState({
    name: "",
    email: "",
    phone: "",
    location: "",
    bloodType: "",
    isAvailable: true,
  });
  
  // Get unique locations from donors
  const [locations, setLocations] = useState([]);
  const bloodTypes = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];

  useEffect(() => {
    fetchDonors();
  }, []);

  const fetchDonors = async () => {
    try {
      const token = localStorage.getItem("token");
      
      if (!token) {
        setError("No authentication token found");
        setLoading(false);
        return;
      }

      // Decode token to get user role
      const payload = JSON.parse(atob(token.split('.')[1]));
      setUserRole(payload.role);

      const res = await axios.get("http://localhost:3000/api/admin/users", { // Fetching all users but filtering for donors/view
         headers: { Authorization: `Bearer ${token}` },
         params: { role: 'donor' } // Ideally the backend endpoint allows filtering or we just fetch donors endpoint
      });
      // Note: The previous endpoint was /api/users/donors which returns calculated status. 
      // We should probably stick to that for the main list, but for editing we might need to hit the generic update endpoint.
      // Let's stick to the original endpoint for fetching to keep the Status logic working.
      const resDonors = await axios.get("http://localhost:3000/api/users/donors", {
        headers: { Authorization: `Bearer ${token}` },
      });

      setDonors(resDonors.data);
      setFilteredDonors(resDonors.data);
      
      // Extract unique locations
      const uniqueLocations = [...new Set(resDonors.data.map(d => d.location))];
      setLocations(uniqueLocations);
      
      setError(null);
    } catch (err) {
      console.error("Error fetching donors:", err);
      setError(err.response?.data?.message || "Failed to load donors");
    } finally {
      setLoading(false);
    }
  };

  // Filter donors whenever search criteria changes
  useEffect(() => {
    let filtered = donors;

    // Filter by name
    if (searchName) {
      filtered = filtered.filter(donor =>
        donor.name.toLowerCase().includes(searchName.toLowerCase()) ||
        donor.email.toLowerCase().includes(searchName.toLowerCase())
      );
    }

    // Filter by location
    if (selectedLocation) {
      filtered = filtered.filter(donor => donor.location === selectedLocation);
    }

    // Filter by blood type
    if (selectedBloodType) {
      filtered = filtered.filter(donor => donor.bloodType === selectedBloodType);
    }

    setFilteredDonors(filtered);
  }, [searchName, selectedLocation, selectedBloodType, donors]);

  const clearFilters = () => {
    setSearchName("");
    setSelectedLocation("");
    setSelectedBloodType("");
  };

  const openRequestModal = (donor) => {
    setSelectedDonor(donor);
    setShowRequestModal(true);
    setRequestForm({ urgency: "Routine", message: "" });
  };

  const closeRequestModal = () => {
    setShowRequestModal(false);
    setSelectedDonor(null);
    setRequestForm({ urgency: "Routine", message: "" });
  };

  const handleRequestSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const token = localStorage.getItem("token");
      await axios.post(
        "http://localhost:3000/api/requests/create",
        {
          donorId: selectedDonor._id,
          bloodType: selectedDonor.bloodType,
          urgency: requestForm.urgency,
          message: requestForm.message,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      alert("Request sent successfully!");
      closeRequestModal();
      fetchDonors(); // Refresh list
    } catch (err) {
      alert(err.response?.data?.message || "Failed to send request");
    }
  };

  // Admin Edit Functions
  const handleEditClick = (donor) => {
    setEditingDonor(donor);
    setEditForm({
      name: donor.name,
      email: donor.email,
      phone: donor.phone || "",
      location: donor.location || "",
      bloodType: donor.bloodType || "",
      isAvailable: donor.isAvailable !== undefined ? donor.isAvailable : true,
    });
    setShowEditModal(true);
  };

  const handleUpdateDonor = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      await axios.put(
        `http://localhost:3000/api/admin/update-user/${editingDonor._id}`,
        editForm,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert("Donor updated successfully");
      setShowEditModal(false);
      setEditingDonor(null);
      fetchDonors(); // Refresh the list
    } catch (err) {
      alert(err.response?.data?.message || "Failed to update donor");
    }
  };


  const getStatusBadge = (status) => {
    const badges = {
      Available: { color: "bg-green-100 text-green-800", text: "Available" },
      Requested: { color: "bg-yellow-100 text-yellow-800", text: "Requested" },
      "Donated Recently": { color: "bg-red-100 text-red-800", text: "Donated Recently: He will become available after 6 months" },
      Unavailable: { color: "bg-gray-100 text-gray-800", text: "Unavailable" },
    };

    const badge = badges[status] || badges.Available;

    return (
      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${badge.color}`}>
        {badge.text}
      </span>
    );
  };

  if (loading) {
    return (
      <div className="p-6 w-full">
        <p className="text-gray-600">Loading donors...</p>
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
        <h2 className="text-3xl font-bold text-gray-800 mb-2">All Donors</h2>
        <p className="text-gray-600">Total Donors: {donors.length} | Showing: {filteredDonors.length}</p>
      </div>

      {/* Search and Filter Section */}
      <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
        {/* Search Bar */}
        <div className="flex items-center gap-4 mb-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search by name or email..."
              value={searchName}
              onChange={(e) => setSearchName(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
            />
          </div>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`flex items-center gap-2 px-6 py-3 rounded-lg font-semibold transition-colors ${
              showFilters ? 'bg-red-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            <Filter className="w-5 h-5" />
            Filters
          </button>
          {(searchName || selectedLocation || selectedBloodType) && (
            <button
              onClick={clearFilters}
              className="flex items-center gap-2 px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg font-semibold transition-colors"
            >
              <X className="w-5 h-5" />
              Clear
            </button>
          )}
        </div>

        {/* Filter Options (Collapsible) */}
        {showFilters && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-gray-200">
            {/* Location Filter */}
            <div>
              <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                <MapPin className="w-4 h-4 text-blue-600" />
                Filter by Location
              </label>
              <select
                value={selectedLocation}
                onChange={(e) => setSelectedLocation(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">All Locations</option>
                {locations.map((location) => (
                  <option key={location} value={location}>
                    {location}
                  </option>
                ))}
              </select>
            </div>

            {/* Blood Type Filter */}
            <div>
              <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                <Droplet className="w-4 h-4 text-red-600" />
                Filter by Blood Type
              </label>
              <select
                value={selectedBloodType}
                onChange={(e) => setSelectedBloodType(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
              >
                <option value="">All Blood Types</option>
                {bloodTypes.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
            </div>
          </div>
        )}

        {/* Active Filters Display */}
        {(selectedLocation || selectedBloodType) && (
          <div className="flex items-center gap-2 mt-4 pt-4 border-t border-gray-200">
            <span className="text-sm font-semibold text-gray-600">Active Filters:</span>
            {selectedLocation && (
              <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium flex items-center gap-1">
                <MapPin className="w-3 h-3" />
                {selectedLocation}
                <button onClick={() => setSelectedLocation("")} className="ml-1 hover:text-blue-900">
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}
            {selectedBloodType && (
              <span className="px-3 py-1 bg-red-100 text-red-700 rounded-full text-sm font-medium flex items-center gap-1">
                <Droplet className="w-3 h-3" />
                {selectedBloodType}
                <button onClick={() => setSelectedBloodType("")} className="ml-1 hover:text-red-900">
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}
          </div>
        )}
      </div>

      {/* Donors List */}
      {filteredDonors.length === 0 ? (
        <div className="bg-white rounded-xl shadow-lg p-8 text-center">
          <p className="text-gray-600 text-lg">No donors found matching your search criteria.</p>
          <button
            onClick={clearFilters}
            className="mt-4 px-6 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-semibold transition-colors"
          >
            Clear Filters
          </button>
        </div>
      ) : (
        <>
          {/* Desktop Table View */}
          <div className="hidden md:block bg-white rounded-xl shadow-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead className="bg-gradient-to-r from-red-600 to-red-700 text-white">
                  <tr>
                    <th className="px-6 py-4 text-left font-semibold">#</th>
                    <th className="px-6 py-4 text-left font-semibold">Name</th>
                    <th className="px-6 py-4 text-left font-semibold">Email</th>
                    <th className="px-6 py-4 text-left font-semibold">Blood Type</th>
                    <th className="px-6 py-4 text-left font-semibold">Phone</th>
                    <th className="px-6 py-4 text-left font-semibold">Location</th>
                    <th className="px-6 py-4 text-left font-semibold">Status</th>
                    {(userRole === "hospital" || userRole === "admin") && (
                      <th className="px-6 py-4 text-left font-semibold">Action</th>
                    )}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filteredDonors.map((donor, index) => (
                    <tr key={donor._id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 text-gray-600 font-medium">{index + 1}</td>
                      <td className="px-6 py-4 font-semibold text-gray-800">{donor.name}</td>
                      <td className="px-6 py-4 text-gray-600">{donor.email}</td>
                      <td className="px-6 py-4">
                        <span className="px-4 py-2 bg-red-100 text-red-800 rounded-full font-bold text-sm">
                          {donor.bloodType}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-gray-600">{donor.phone}</td>
                      <td className="px-6 py-4">
                        <span className="flex items-center gap-1 text-gray-700">
                          <MapPin className="w-4 h-4 text-blue-600" />
                          {donor.location}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        {getStatusBadge(donor.status)}
                      </td>
                      {(userRole === "hospital" || userRole === "admin") && (
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                              {/* Hospital Request Button */}
                              {userRole === "hospital" && (
                                  donor.status === "Available" ? (
                                  <button
                                      onClick={() => openRequestModal(donor)}
                                      className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-semibold transition-colors flex items-center gap-2"
                                  >
                                      <Send className="w-4 h-4" />
                                      Request
                                  </button>
                                  ) : (
                                  <button
                                      disabled
                                      className="px-4 py-2 bg-gray-300 text-gray-500 rounded-lg font-semibold cursor-not-allowed flex items-center gap-2"
                                      title={`Donor is ${donor.status}`}
                                  >
                                      <AlertCircle className="w-4 h-4" />
                                      {donor.status === "Requested" ? "Requested" : "Unavailable"}
                                  </button>
                                  )
                              )}
                              {/* Admin Edit Button */}
                              {userRole === "admin" && (
                                  <button
                                      onClick={() => handleEditClick(donor)}
                                      className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition-colors flex items-center gap-2"
                                  >
                                      <Edit className="w-4 h-4" />
                                      Edit
                                  </button>
                              )}
                          </div>
                        </td>
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Mobile Card View */}
          <div className="grid grid-cols-1 gap-4 md:hidden">
            {filteredDonors.map((donor) => (
              <div key={donor._id} className="bg-white rounded-xl shadow-lg p-5 border border-gray-100 flex flex-col gap-4">
                <div className="flex justify-between items-start">
                  <div>
                      <h3 className="text-lg font-bold text-gray-800">{donor.name}</h3>
                      <p className="text-sm text-gray-500">{donor.email}</p>
                  </div>
                  <span className="px-3 py-1 bg-red-100 text-red-800 rounded-full font-bold text-sm">
                      {donor.bloodType}
                  </span>
                </div>
                
                <div className="grid grid-cols-2 gap-y-2 text-sm">
                  <div className="flex items-center gap-2 text-gray-600">
                      <Phone className="w-4 h-4 text-gray-400" />
                      {donor.phone || "N/A"}
                  </div>
                  <div className="flex items-center gap-2 text-gray-600">
                      <MapPin className="w-4 h-4 text-blue-600" />
                      {donor.location || "N/A"}
                  </div>
                </div>

                <div className="flex justify-between items-center pt-3 border-t border-gray-100">
                  <div>{getStatusBadge(donor.status)}</div>
                  
                  {(userRole === "hospital" || userRole === "admin") && (
                      <div className="flex items-center gap-2">
                          {/* Hospital Request Button */}
                          {userRole === "hospital" && (
                              donor.status === "Available" ? (
                              <button
                                  onClick={() => openRequestModal(donor)}
                                  className="p-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
                                  title="Request Donor"
                              >
                                  <Send className="w-4 h-4" />
                              </button>
                              ) : (
                              <button
                                  disabled
                                  className="p-2 bg-gray-300 text-gray-500 rounded-lg cursor-not-allowed"
                                  title={`Donor is ${donor.status}`}
                              >
                                  <AlertCircle className="w-4 h-4" />
                              </button>
                              )
                          )}
                          {/* Admin Edit Button */}
                          {userRole === "admin" && (
                              <button
                                  onClick={() => handleEditClick(donor)}
                                  className="px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold text-sm transition-colors flex items-center gap-2"
                              >
                                  <Edit className="w-4 h-4" />
                                  Edit
                              </button>
                          )}
                      </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {/* Request Modal */}
      {showRequestModal && selectedDonor && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-2xl font-bold text-gray-800">Request Donor</h3>
                <p className="text-sm text-gray-600 mt-1">Send request to {selectedDonor.name}</p>
              </div>
              <button
                onClick={closeRequestModal}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                  <Droplet className="w-6 h-6 text-red-600" />
                </div>
                <div>
                  <p className="font-semibold text-gray-800">{selectedDonor.name}</p>
                  <p className="text-sm text-gray-600">Blood Type: <span className="font-bold text-red-600">{selectedDonor.bloodType}</span></p>
                  <p className="text-sm text-gray-600">Phone: {selectedDonor.phone}</p>
                </div>
              </div>
            </div>

            <form onSubmit={handleRequestSubmit}>
              <div className="mb-4">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Urgency Level
                </label>
                <select
                  value={requestForm.urgency}
                  onChange={(e) => setRequestForm({ ...requestForm, urgency: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                  required
                >
                  <option value="Routine">Routine</option>
                  <option value="Urgent">Urgent</option>
                  <option value="Emergency">Emergency</option>
                </select>
              </div>

              <div className="mb-6">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Message (Optional)
                </label>
                <textarea
                  value={requestForm.message}
                  onChange={(e) => setRequestForm({ ...requestForm, message: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                  rows="3"
                  placeholder="Add any additional information..."
                />
              </div>

              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={closeRequestModal}
                  className="flex-1 px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-lg font-semibold transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-semibold transition-colors flex items-center justify-center gap-2"
                >
                  <Send className="w-4 h-4" />
                  Send Request
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Donor Modal (Admin Only) */}
      {showEditModal && editingDonor && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center p-6 border-b border-gray-200">
               <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                  <Edit className="w-5 h-5 text-blue-600" />
                  Edit Donor Details
               </h3>
               <button onClick={() => setShowEditModal(false)} className="text-gray-400 hover:text-gray-600 transition-colors">
                  <X className="w-6 h-6" />
               </button>
            </div>
            
            <form onSubmit={handleUpdateDonor} className="p-6">
               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Name */}
                  <div className="col-span-2 md:col-span-1">
                     <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                     <div className="relative">
                        <UserIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                        <input
                           type="text"
                           required
                           value={editForm.name}
                           onChange={(e) => setEditForm({...editForm, name: e.target.value})}
                           className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                     </div>
                  </div>

                  {/* Email */}
                  <div className="col-span-2 md:col-span-1">
                     <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
                     <div className="relative">
                        <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                        <input
                           type="email"
                           required
                           value={editForm.email}
                           onChange={(e) => setEditForm({...editForm, email: e.target.value})}
                           className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                     </div>
                  </div>

                  {/* Phone */}
                  <div className="col-span-2 md:col-span-1">
                     <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
                     <div className="relative">
                        <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                        <input
                           type="text"
                           required
                           value={editForm.phone}
                           onChange={(e) => setEditForm({...editForm, phone: e.target.value})}
                           className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                     </div>
                  </div>

                  {/* Location */}
                  <div className="col-span-2 md:col-span-1">
                     <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
                     <div className="relative">
                        <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                        <input
                           type="text"
                           required
                           value={editForm.location}
                           onChange={(e) => setEditForm({...editForm, location: e.target.value})}
                           className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                     </div>
                  </div>

                  {/* Blood Type */}
                  <div className="col-span-2 md:col-span-1">
                     <label className="block text-sm font-medium text-gray-700 mb-2">Blood Type</label>
                     <div className="relative">
                        <Droplet className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                        <select
                           value={editForm.bloodType}
                           onChange={(e) => setEditForm({...editForm, bloodType: e.target.value})}
                           className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none bg-white font-medium"
                        >
                           <option value="">Select Blood Type</option>
                           {bloodTypes.map((type) => (
                              <option key={type} value={type}>{type}</option>
                           ))}
                        </select>
                     </div>
                  </div>
                  
                   {/* Availability */}
                   <div className="col-span-2">
                        <label className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
                            <input
                                type="checkbox"
                                checked={editForm.isAvailable}
                                onChange={(e) => setEditForm({...editForm, isAvailable: e.target.checked})}
                                className="w-5 h-5 text-blue-600 rounded focus:ring-blue-500 border-gray-300"
                            />
                            <div className="flex flex-col">
                                <span className="text-sm font-medium text-gray-900">Available to Donate</span>
                                <span className="text-xs text-gray-500">Uncheck if donor is temporarily unavailable</span>
                            </div>
                        </label>
                    </div>

               </div>

               <div className="flex items-center justify-end gap-3 mt-8 pt-6 border-t border-gray-100">
                  <button
                     type="button"
                     onClick={() => setShowEditModal(false)}
                     className="px-6 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg font-semibold transition-colors"
                  >
                     Cancel
                  </button>
                  <button
                     type="submit"
                     className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition-colors flex items-center gap-2"
                  >
                     <Save className="w-4 h-4" />
                     Save Changes
                  </button>
               </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}

export default Donors;
