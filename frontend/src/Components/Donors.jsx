import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Search,
  Filter,
  MapPin,
  Droplet,
  X,
  Send,
  AlertCircle,
  Edit,
  Save,
  User as UserIcon,
  Phone,
  Mail,
  Shield,
  Plus,
  Trash2,
  CheckCircle,
  Clock,
  Building2,
  XCircle,
  MessageCircle,
  CheckSquare,
} from "lucide-react";

function Donors() {
  const [donors, setDonors] = useState([]);
  const [filteredDonors, setFilteredDonors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Filters
  const [searchName, setSearchName] = useState("");
  const [selectedLocation, setSelectedLocation] = useState("");
  const [selectedBloodType, setSelectedBloodType] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("");
  const [selectedGender, setSelectedGender] = useState("");
  const [userRole, setUserRole] = useState("");

  // Modals
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingDonor, setEditingDonor] = useState(null);

  const [addForm, setAddForm] = useState({
    nationalId: "",
    name: "",
    gender: "Male",
    phone: "",
    location: "",
    bloodType: "O+",
    email: "",
    password: "",
    age: "",
  });

  const [editForm, setEditForm] = useState({
    nationalId: "",
    name: "",
    gender: "Male",
    phone: "",
    location: "",
    bloodType: "",
    age: "",
    isAvailable: true,
  });

  const [submitting, setSubmitting] = useState(false);

  const bloodTypes = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];

  useEffect(() => {
    const role = localStorage.getItem("role");
    setUserRole(role);
    fetchDonors();
  }, []);

  useEffect(() => {
    let list = [...donors];

    if (searchName) {
      const term = searchName.toLowerCase();
      list = list.filter(
        (d) =>
          d.name.toLowerCase().includes(term) ||
          d.email.toLowerCase().includes(term) ||
          d.phone.includes(term) ||
          (d.nationalId && d.nationalId.toLowerCase().includes(term))
      );
    }
    if (selectedLocation) {
      list = list.filter((d) => d.location.toLowerCase().includes(selectedLocation.toLowerCase()));
    }
    if (selectedBloodType) {
      list = list.filter((d) => d.bloodType === selectedBloodType);
    }
    if (selectedStatus) {
      list = list.filter((d) => d.status.toLowerCase() === selectedStatus.toLowerCase());
    }
    if (selectedGender) {
      list = list.filter((d) => d.gender === selectedGender);
    }

    setFilteredDonors(list);
  }, [donors, searchName, selectedLocation, selectedBloodType, selectedStatus, selectedGender]);

  const fetchDonors = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setError("No authentication token found");
        setLoading(false);
        return;
      }

      const res = await axios.get("/api/users/donors", {
        headers: { Authorization: `Bearer ${token}` },
      });

      setDonors(res.data);
      setFilteredDonors(res.data);
      setError(null);
    } catch (err) {
      console.error("Error fetching donors:", err);
      setError(err.response?.data?.message || "Failed to load donors");
    } finally {
      setLoading(false);
    }
  };

  const handleAddSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const token = localStorage.getItem("token");
      await axios.post(
        "/api/admin/register-user",
        {
          ...addForm,
          role: "donor",
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      alert("Donor created successfully!");
      setShowAddModal(false);
      setAddForm({
        nationalId: "",
        name: "",
        gender: "Male",
        phone: "",
        location: "",
        bloodType: "O+",
        email: "",
        password: "",
        age: "",
      });
      fetchDonors();
    } catch (err) {
      alert(err.response?.data?.message || "Failed to add donor");
    } finally {
      setSubmitting(false);
    }
  };

  const handleEditClick = (donor) => {
    setEditingDonor(donor);
    setEditForm({
      nationalId: donor.nationalId || "",
      name: donor.name,
      gender: donor.gender || "Male",
      phone: donor.phone,
      location: donor.location,
      bloodType: donor.bloodType,
      age: donor.age || "",
      isAvailable: donor.isAvailable !== false,
    });
    setShowEditModal(true);
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    if (!editingDonor) return;

    setSubmitting(true);
    try {
      const token = localStorage.getItem("token");
      await axios.put(
        `/api/admin/update-user/${editingDonor._id}`,
        editForm,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      alert("Donor updated successfully!");
      setShowEditModal(false);
      fetchDonors();
    } catch (err) {
      alert(err.response?.data?.message || "Failed to update donor");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Delete donor "${name}"? This action cannot be undone.`)) return;

    try {
      const token = localStorage.getItem("token");
      await axios.delete(`/api/admin/delete-user/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert("Donor deleted successfully");
      fetchDonors();
    } catch (err) {
      alert(err.response?.data?.message || "Failed to delete donor");
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case "Available":
        return (
          <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-300 flex items-center gap-1">
            <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
            Available
          </span>
        );
      case "Pending":
        return (
          <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-800 border border-amber-300 flex items-center gap-1">
            <Clock className="w-3.5 h-3.5 text-amber-600" />
            Pending (2h)
          </span>
        );
      case "Arrived":
        return (
          <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-sky-100 text-sky-800 border border-sky-300 flex items-center gap-1">
            <Building2 className="w-3.5 h-3.5 text-sky-600" />
            Arrived
          </span>
        );
      case "Donated":
        return (
          <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-red-100 text-red-800 border border-red-300 flex items-center gap-1">
            <Droplet className="w-3.5 h-3.5 text-red-600" />
            In Cooldown
          </span>
        );
      default:
        return (
          <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-slate-100 text-slate-700 border border-slate-300">
            {status}
          </span>
        );
    }
  };

  if (loading) {
    return (
      <div className="p-8 flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-14 w-14 border-4 border-red-600 border-t-transparent mx-auto mb-4"></div>
          <p className="text-slate-600 font-semibold">Loading donors database...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8 bg-slate-50 min-h-screen">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-800 flex items-center gap-3">
            <span className="p-2 rounded-xl bg-red-600 text-white shadow-md shadow-red-600/30">
              <Droplet className="w-6 h-6" />
            </span>
            Donor Directory & Management
          </h1>
          <p className="text-sm text-slate-600 mt-1">
            Manage registered voluntary blood donors, verify national IDs, and monitor statuses
          </p>
        </div>

        {userRole === "admin" && (
          <button
            onClick={() => setShowAddModal(true)}
            className="self-start sm:self-auto flex items-center gap-2 px-4 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-bold shadow-md shadow-red-600/30 transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Add New Donor</span>
          </button>
        )}
      </div>

      {/* Filters */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-5 mb-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5">
          {/* Search Term */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search donor name, ID, phone..."
              value={searchName}
              onChange={(e) => setSearchName(e.target.value)}
              className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm focus:bg-white focus:ring-2 focus:ring-red-500"
            />
          </div>

          {/* Blood Type */}
          <select
            value={selectedBloodType}
            onChange={(e) => setSelectedBloodType(e.target.value)}
            className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm focus:bg-white focus:ring-2 focus:ring-red-500 font-semibold"
          >
            <option value="">All Blood Types</option>
            {bloodTypes.map((bt) => (
              <option key={bt} value={bt}>
                {bt}
              </option>
            ))}
          </select>

          {/* Location */}
          <input
            type="text"
            placeholder="Filter location (e.g. Mogadishu)..."
            value={selectedLocation}
            onChange={(e) => setSelectedLocation(e.target.value)}
            className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm focus:bg-white focus:ring-2 focus:ring-red-500"
          />

          {/* Status */}
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm focus:bg-white focus:ring-2 focus:ring-red-500"
          >
            <option value="">All Statuses</option>
            <option value="Available">Available</option>
            <option value="Pending">Pending (2h)</option>
            <option value="Arrived">Arrived</option>
            <option value="Donated">In Cooldown</option>
            <option value="Unavailable">Unavailable</option>
          </select>

          {/* Gender */}
          <select
            value={selectedGender}
            onChange={(e) => setSelectedGender(e.target.value)}
            className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm focus:bg-white focus:ring-2 focus:ring-red-500"
          >
            <option value="">All Genders</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
          </select>
        </div>

        <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
          <span>
            Showing <strong className="text-slate-900">{filteredDonors.length}</strong> of{" "}
            <strong>{donors.length}</strong> donors
          </span>
          {(searchName || selectedLocation || selectedBloodType || selectedStatus || selectedGender) && (
            <button
              onClick={() => {
                setSearchName("");
                setSelectedLocation("");
                setSelectedBloodType("");
                setSelectedStatus("");
                setSelectedGender("");
              }}
              className="text-red-600 hover:text-red-700 font-bold hover:underline"
            >
              Reset Filters
            </button>
          )}
        </div>
      </div>

      {/* Donors Grid */}
      {filteredDonors.length === 0 ? (
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-12 text-center">
          <AlertCircle className="w-16 h-16 text-slate-300 mx-auto mb-3" />
          <h3 className="text-lg font-bold text-slate-700">No Donors Found</h3>
          <p className="text-sm text-slate-500 max-w-sm mx-auto mt-1">Try adjusting your filters.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredDonors.map((donor) => (
            <div
              key={donor._id}
              className="bg-white rounded-2xl p-5 shadow-sm hover:shadow-md transition-all border border-slate-200 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-red-600 to-red-700 text-white flex items-center justify-center font-black text-base shadow-md flex-shrink-0">
                      {donor.bloodType}
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-800 text-base leading-snug">{donor.name}</h3>
                      <p className="text-xs text-slate-500 flex items-center gap-1.5 mt-0.5">
                        <span>ID: {donor.nationalId || "N/A"}</span>
                        {donor.gender && <span>• {donor.gender}</span>}
                        {donor.age && <span>• {donor.age} yrs</span>}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="space-y-2 mb-4 text-xs text-slate-600 bg-slate-50 p-3 rounded-xl border border-slate-100">
                  <div className="flex items-center gap-2">
                    <MapPin className="w-3.5 h-3.5 text-red-500 flex-shrink-0" />
                    <span className="font-medium truncate">{donor.location}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="w-3.5 h-3.5 text-sky-500 flex-shrink-0" />
                    <span className="font-medium">{donor.phone}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Mail className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
                    <span className="font-medium truncate">{donor.email}</span>
                  </div>
                </div>

                <div className="mb-4 flex items-center justify-between">
                  {getStatusBadge(donor.status)}
                  {donor.status === "Donated" && donor.cooldownEndsAt && (
                    <span className="text-[10px] text-red-600 font-semibold">
                      Eligible: {new Date(donor.cooldownEndsAt).toLocaleDateString()}
                    </span>
                  )}
                </div>
              </div>

              {/* Actions for Admin */}
              {userRole === "admin" && (
                <div className="flex gap-2 pt-3 border-t border-slate-100">
                  <button
                    onClick={() => handleEditClick(donor)}
                    className="flex-1 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 transition-colors"
                  >
                    <Edit className="w-3.5 h-3.5 text-slate-600" />
                    <span>Edit</span>
                  </button>
                  <button
                    onClick={() => handleDelete(donor._id, donor.name)}
                    className="py-2 px-3 bg-red-50 hover:bg-red-100 text-red-700 border border-red-200 rounded-xl font-bold text-xs flex items-center justify-center gap-1 transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5 text-red-600" />
                    <span>Delete</span>
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Add Donor Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full p-6 border border-slate-100 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-start mb-4 pb-3 border-b border-slate-100">
              <div>
                <h3 className="text-xl font-black text-slate-800">Add New Donor</h3>
                <p className="text-xs text-slate-500 mt-0.5">Admin registration for blood donor</p>
              </div>
              <button onClick={() => setShowAddModal(false)} className="text-slate-400 hover:text-slate-600">
                <XCircle className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={handleAddSubmit} className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Government ID *</label>
                <input
                  value={addForm.nationalId}
                  onChange={(e) => setAddForm({ ...addForm, nationalId: e.target.value })}
                  placeholder="e.g. SOM-998811"
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs sm:text-sm focus:ring-2 focus:ring-red-500"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Gender *</label>
                <select
                  value={addForm.gender}
                  onChange={(e) => setAddForm({ ...addForm, gender: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs sm:text-sm focus:ring-2 focus:ring-red-500"
                  required
                >
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Full Name *</label>
                <input
                  value={addForm.name}
                  onChange={(e) => setAddForm({ ...addForm, name: e.target.value })}
                  placeholder="Donor full name"
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs sm:text-sm focus:ring-2 focus:ring-red-500"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">WhatsApp Phone *</label>
                <input
                  value={addForm.phone}
                  onChange={(e) => setAddForm({ ...addForm, phone: e.target.value })}
                  placeholder="+252 61 0000000"
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs sm:text-sm focus:ring-2 focus:ring-red-500"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Blood Type *</label>
                <select
                  value={addForm.bloodType}
                  onChange={(e) => setAddForm({ ...addForm, bloodType: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs sm:text-sm font-bold text-red-600 focus:ring-2 focus:ring-red-500"
                  required
                >
                  {bloodTypes.map((bt) => (
                    <option key={bt} value={bt}>
                      {bt}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Location *</label>
                <input
                  value={addForm.location}
                  onChange={(e) => setAddForm({ ...addForm, location: e.target.value })}
                  placeholder="e.g. Mogadishu (Hodan)"
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs sm:text-sm focus:ring-2 focus:ring-red-500"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Age</label>
                <input
                  type="number"
                  value={addForm.age}
                  onChange={(e) => setAddForm({ ...addForm, age: e.target.value })}
                  placeholder="e.g. 24"
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs sm:text-sm focus:ring-2 focus:ring-red-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Email Address *</label>
                <input
                  type="email"
                  value={addForm.email}
                  onChange={(e) => setAddForm({ ...addForm, email: e.target.value })}
                  placeholder="donor@example.com"
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs sm:text-sm focus:ring-2 focus:ring-red-500"
                  required
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Password *</label>
                <input
                  type="password"
                  value={addForm.password}
                  onChange={(e) => setAddForm({ ...addForm, password: e.target.value })}
                  placeholder="Create password"
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs sm:text-sm focus:ring-2 focus:ring-red-500"
                  required
                />
              </div>

              <div className="sm:col-span-2 flex gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="flex-1 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="flex-1 py-2.5 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl text-xs shadow-md"
                >
                  {submitting ? "Creating..." : "Create Donor"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Donor Modal */}
      {showEditModal && editingDonor && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full p-6 border border-slate-100 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-start mb-4 pb-3 border-b border-slate-100">
              <div>
                <h3 className="text-xl font-black text-slate-800">Edit Donor Profile</h3>
                <p className="text-xs text-slate-500 mt-0.5">{editingDonor.name}</p>
              </div>
              <button onClick={() => setShowEditModal(false)} className="text-slate-400 hover:text-slate-600">
                <XCircle className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={handleEditSubmit} className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Government ID</label>
                <input
                  value={editForm.nationalId}
                  onChange={(e) => setEditForm({ ...editForm, nationalId: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs sm:text-sm font-mono focus:ring-2 focus:ring-red-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Gender</label>
                <select
                  value={editForm.gender}
                  onChange={(e) => setEditForm({ ...editForm, gender: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs sm:text-sm focus:ring-2 focus:ring-red-500"
                >
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Full Name *</label>
                <input
                  value={editForm.name}
                  onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs sm:text-sm focus:ring-2 focus:ring-red-500"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">WhatsApp Phone *</label>
                <input
                  value={editForm.phone}
                  onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs sm:text-sm focus:ring-2 focus:ring-red-500"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Location *</label>
                <input
                  value={editForm.location}
                  onChange={(e) => setEditForm({ ...editForm, location: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs sm:text-sm focus:ring-2 focus:ring-red-500"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Blood Type</label>
                <select
                  value={editForm.bloodType}
                  onChange={(e) => setEditForm({ ...editForm, bloodType: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs sm:text-sm font-bold text-red-600 focus:ring-2 focus:ring-red-500"
                >
                  {bloodTypes.map((bt) => (
                    <option key={bt} value={bt}>
                      {bt}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Age</label>
                <input
                  type="number"
                  value={editForm.age}
                  onChange={(e) => setEditForm({ ...editForm, age: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs sm:text-sm focus:ring-2 focus:ring-red-500"
                />
              </div>

              <div className="flex items-center gap-2 pt-6">
                <input
                  type="checkbox"
                  id="avail"
                  checked={editForm.isAvailable}
                  onChange={(e) => setEditForm({ ...editForm, isAvailable: e.target.checked })}
                  className="w-4 h-4 text-red-600 rounded"
                />
                <label htmlFor="avail" className="text-xs font-bold text-slate-700 cursor-pointer">
                  Donor is Available
                </label>
              </div>

              <div className="sm:col-span-2 flex gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setShowEditModal(false)}
                  className="flex-1 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="flex-1 py-2.5 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl text-xs shadow-md"
                >
                  {submitting ? "Saving..." : "Save Changes"}
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
