import React, { useEffect, useState } from "react";
import axios from "axios";
import { Trash2, Edit, Shield, Search, Filter, X, Users as UsersIcon, Droplet, Mail, Phone, MapPin } from "lucide-react";

function Users() {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingUser, setEditingUser] = useState(null);
  const [newRole, setNewRole] = useState("");
  
  // Search and filter states
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedRole, setSelectedRole] = useState("");
  const [selectedBloodType, setSelectedBloodType] = useState("");
  const [selectedLocation, setSelectedLocation] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  
  // Get unique locations from users
  const [locations, setLocations] = useState([]);
  
  const bloodTypes = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];
  const roles = ["admin", "donor", "hospital"];

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem("token");
      
      if (!token) {
        setError("No authentication token found");
        setLoading(false);
        return;
      }

      const res = await axios.get("http://localhost:3000/api/admin/users", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUsers(res.data);
      setFilteredUsers(res.data);
      
      // Extract unique locations
      const uniqueLocations = [...new Set(res.data.map(u => u.location).filter(Boolean))];
      setLocations(uniqueLocations);
      
      setError(null);
    } catch (err) {
      console.error("Error fetching users:", err);
      setError(err.response?.data?.message || "Failed to load users");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteUser = async (userId, userName) => {
    if (!window.confirm(`Are you sure you want to delete ${userName}?`)) {
      return;
    }

    try {
      const token = localStorage.getItem("token");
      await axios.delete(`http://localhost:3000/api/admin/delete-user/${userId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert("User deleted successfully");
      fetchUsers(); // Refresh the list
    } catch (err) {
      alert(err.response?.data?.message || "Failed to delete user");
    }
  };

  const handleEditRole = (user) => {
    setEditingUser(user._id);
    setNewRole(user.role);
  };

  const handleUpdateRole = async (userId) => {
    try {
      const token = localStorage.getItem("token");
      await axios.put(
        `http://localhost:3000/api/admin/update-role/${userId}`,
        { role: newRole },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert("Role updated successfully");
      setEditingUser(null);
      fetchUsers(); // Refresh the list
    } catch (err) {
      alert(err.response?.data?.message || "Failed to update role");
    }
  };

  const handleCancelEdit = () => {
    setEditingUser(null);
    setNewRole("");
  };

  // Filter users whenever search criteria changes
  useEffect(() => {
    let filtered = users;

    // Filter by search term (name or email)
    if (searchTerm) {
      filtered = filtered.filter(user =>
        user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filter by role
    if (selectedRole) {
      filtered = filtered.filter(user => user.role === selectedRole);
    }

    // Filter by blood type
    if (selectedBloodType) {
      filtered = filtered.filter(user => user.bloodType === selectedBloodType);
    }

    // Filter by location
    if (selectedLocation) {
      filtered = filtered.filter(user => user.location === selectedLocation);
    }

    setFilteredUsers(filtered);
  }, [searchTerm, selectedRole, selectedBloodType, selectedLocation, users]);

  const clearFilters = () => {
    setSearchTerm("");
    setSelectedRole("");
    setSelectedBloodType("");
    setSelectedLocation("");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-red-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-red-600 mx-auto mb-4"></div>
          <p className="text-gray-700 font-semibold">Loading users...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-red-50 flex items-center justify-center p-4">
        <div className="bg-white border-l-4 border-red-600 text-red-700 p-6 rounded-lg shadow-xl max-w-md">
          <strong className="font-bold text-lg">Error:</strong>
          <p className="mt-2">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-red-50">
      {/* Header Section - No Margin */}
      <div className="bg-black text-white p-8 shadow-2xl">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <h1 className="text-4xl font-bold mb-2 flex items-center gap-3">
              <UsersIcon className="w-10 h-10" />
              Users Management
            </h1>
            <p className="text-red-100 text-lg">
              Total: <span className="font-bold">{users.length}</span> | 
              Showing: <span className="font-bold">{filteredUsers.length}</span>
            </p>
          </div>
          <div className="bg-white/20 backdrop-blur-sm rounded-xl px-6 py-4 border border-white/30">
            <p className="text-sm text-red-100">Active Filters</p>
            <p className="text-2xl font-bold">{(searchTerm || selectedRole || selectedBloodType) ? 'ON' : 'OFF'}</p>
          </div>
        </div>
      </div>

      {/* Search and Filter Section */}
      <div className="bg-white shadow-xl border-b-4 border-red-500 p-6">
        {/* Search Bar */}
        <div className="flex items-center gap-4 mb-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="🔍 Search by name or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-4 border-2 border-red-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 text-lg transition-all"
            />
          </div>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`flex items-center gap-2 px-6 py-4 rounded-xl font-bold transition-all transform hover:scale-105 shadow-lg ${
              showFilters ? 'bg-red-600 text-white' : 'bg-gray-800 text-white hover:bg-gray-700'
            }`}
          >
            <Filter className="w-5 h-5" />
            <span className="hidden sm:inline">Filters</span>
          </button>
          {(searchTerm || selectedRole || selectedBloodType || selectedLocation) && (
            <button
              onClick={clearFilters}
              className="flex items-center gap-2 px-6 py-4 bg-red-100 hover:bg-red-200 text-red-700 rounded-xl font-bold transition-all transform hover:scale-105 shadow-lg"
            >
              <X className="w-5 h-5" />
              <span className="hidden sm:inline">Clear</span>
            </button>
          )}
        </div>

        {/* Filter Options (Collapsible) */}
        {showFilters && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-6 border-t-2 border-red-200 animate-fadeIn">
            {/* Role Filter */}
            <div className="bg-gradient-to-br from-red-50 to-white p-4 rounded-xl border-2 border-red-200">
              <label className="flex items-center gap-2 font-bold text-gray-800 mb-3">
                <Shield className="w-5 h-5 text-red-600" />
                Filter by Role
              </label>
              <select
                value={selectedRole}
                onChange={(e) => setSelectedRole(e.target.value)}
                className="w-full px-4 py-3 border-2 border-red-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 font-semibold bg-white"
              >
                <option value="">All Roles</option>
                {roles.map((role) => (
                  <option key={role} value={role}>
                    {role.charAt(0).toUpperCase() + role.slice(1)}
                  </option>
                ))}
              </select>
            </div>

            {/* Blood Type Filter */}
            <div className="bg-gradient-to-br from-red-50 to-white p-4 rounded-xl border-2 border-red-200">
              <label className="flex items-center gap-2 font-bold text-gray-800 mb-3">
                <Droplet className="w-5 h-5 text-red-600" />
                Filter by Blood Type
              </label>
              <select
                value={selectedBloodType}
                onChange={(e) => setSelectedBloodType(e.target.value)}
                className="w-full px-4 py-3 border-2 border-red-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 font-semibold bg-white"
              >
                <option value="">All Blood Types</option>
                {bloodTypes.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
            </div>

            {/* Location Filter */}
            <div className="bg-gradient-to-br from-red-50 to-white p-4 rounded-xl border-2 border-red-200">
              <label className="flex items-center gap-2 font-bold text-gray-800 mb-3">
                <MapPin className="w-5 h-5 text-red-600" />
                Filter by Location
              </label>
              <select
                value={selectedLocation}
                onChange={(e) => setSelectedLocation(e.target.value)}
                className="w-full px-4 py-3 border-2 border-red-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 font-semibold bg-white"
              >
                <option value="">All Locations</option>
                {locations.map((location) => (
                  <option key={location} value={location}>
                    {location}
                  </option>
                ))}
              </select>
            </div>
          </div>
        )}

        {/* Active Filters Display */}
        {(selectedRole || selectedBloodType || selectedLocation) && (
          <div className="flex items-center gap-3 mt-6 pt-4 border-t-2 border-red-200 flex-wrap">
            <span className="font-bold text-gray-700 flex items-center gap-2">
              <Filter className="w-4 h-4" />
              Active:
            </span>
            {selectedRole && (
              <span className="px-4 py-2 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-full font-bold flex items-center gap-2 shadow-lg">
                <Shield className="w-4 h-4" />
                {selectedRole.charAt(0).toUpperCase() + selectedRole.slice(1)}
                <button onClick={() => setSelectedRole("")} className="ml-1 hover:bg-white/20 rounded-full p-1 transition-all">
                  <X className="w-4 h-4" />
                </button>
              </span>
            )}
            {selectedBloodType && (
              <span className="px-4 py-2 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-full font-bold flex items-center gap-2 shadow-lg">
                <Droplet className="w-4 h-4" />
                {selectedBloodType}
                <button onClick={() => setSelectedBloodType("")} className="ml-1 hover:bg-white/20 rounded-full p-1 transition-all">
                  <X className="w-4 h-4" />
                </button>
              </span>
            )}
            {selectedLocation && (
              <span className="px-4 py-2 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-full font-bold flex items-center gap-2 shadow-lg">
                <MapPin className="w-4 h-4" />
                {selectedLocation}
                <button onClick={() => setSelectedLocation("")} className="ml-1 hover:bg-white/20 rounded-full p-1 transition-all">
                  <X className="w-4 h-4" />
                </button>
              </span>
            )}
          </div>
        )}
      </div>

      {/* Users Table - Like Donors */}
      {filteredUsers.length === 0 ? (
        <div className="bg-white shadow-2xl p-12 text-center border-t-8 border-red-600">
          <UsersIcon className="w-24 h-24 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-700 text-2xl font-bold mb-2">No users found</p>
          <p className="text-gray-500 mb-6">Try adjusting your search criteria</p>
          <button
            onClick={clearFilters}
            className="px-8 py-4 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white rounded-xl font-bold transition-all transform hover:scale-105 shadow-xl"
          >
            Clear All Filters
          </button>
        </div>
      ) : (
        <div className="bg-white shadow-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead className="bg-gradient-to-r from-red-600 to-red-700 text-white">
                <tr>
                  <th className="px-6 py-4 text-left font-semibold">#</th>
                  <th className="px-6 py-4 text-left font-semibold">Name</th>
                  <th className="px-6 py-4 text-left font-semibold">Email</th>
                  <th className="px-6 py-4 text-left font-semibold">Role</th>
                  <th className="px-6 py-4 text-left font-semibold">Phone</th>
                  <th className="px-6 py-4 text-left font-semibold">Location</th>
                  <th className="px-6 py-4 text-left font-semibold">Blood Type</th>
                  <th className="px-6 py-4 text-center font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredUsers.map((user, index) => (
                  <tr key={user._id} className="hover:bg-red-50 transition-colors">
                    <td className="px-6 py-4 text-gray-600 font-medium">{index + 1}</td>
                    <td className="px-6 py-4 font-semibold text-gray-800">{user.name}</td>
                    <td className="px-6 py-4 text-gray-600">{user.email}</td>
                    <td className="px-6 py-4">
                      {editingUser === user._id ? (
                        <div className="flex items-center gap-2">
                          <select
                            value={newRole}
                            onChange={(e) => setNewRole(e.target.value)}
                            className="px-3 py-2 border-2 border-red-300 rounded-lg text-sm font-semibold"
                          >
                            <option value="donor">Donor</option>
                            <option value="hospital">Hospital</option>
                            <option value="admin">Admin</option>
                          </select>
                          <button
                            onClick={() => handleUpdateRole(user._id)}
                            className="bg-green-600 hover:bg-green-700 text-white px-3 py-2 rounded-lg text-sm font-bold"
                          >
                            Save
                          </button>
                          <button
                            onClick={handleCancelEdit}
                            className="bg-gray-400 hover:bg-gray-500 text-white px-3 py-2 rounded-lg text-sm font-bold"
                          >
                            Cancel
                          </button>
                        </div>
                      ) : (
                        <span className={`px-4 py-2 rounded-full text-sm font-bold ${
                          user.role === 'admin' ? 'bg-purple-100 text-purple-800' :
                          user.role === 'donor' ? 'bg-green-100 text-green-800' :
                          'bg-blue-100 text-blue-800'
                        }`}>
                          {user.role.toUpperCase()}
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-gray-600">{user.phone || "-"}</td>
                    <td className="px-6 py-4">
                      <span className="flex items-center gap-1 text-gray-700">
                        <MapPin className="w-4 h-4 text-red-600" />
                        {user.location || "-"}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="px-4 py-2 bg-red-100 text-red-800 rounded-full font-bold text-sm">
                        {user.bloodType || "-"}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          onClick={() => handleEditRole(user)}
                          className="bg-blue-600 hover:bg-blue-700 text-white p-2 rounded-lg transition-colors shadow-md hover:shadow-lg"
                          title="Edit Role"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteUser(user._id, user.name)}
                          className="bg-red-600 hover:bg-red-700 text-white p-2 rounded-lg transition-colors shadow-md hover:shadow-lg"
                          title="Delete User"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

export default Users;
