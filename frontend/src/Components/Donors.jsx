import React, { useEffect, useState } from "react";
import axios from "axios";
import { Search, Filter, MapPin, Droplet, X } from "lucide-react";

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
  
  // Get unique locations and blood types
  const [locations, setLocations] = useState([]);
  const bloodTypes = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];

  useEffect(() => {
    const fetchDonors = async () => {
      try {
        const token = localStorage.getItem("token");
        
        if (!token) {
          setError("No authentication token found");
          setLoading(false);
          return;
        }

        const res = await axios.get("http://localhost:3000/api/users/donors", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setDonors(res.data);
        setFilteredDonors(res.data);
        
        // Extract unique locations
        const uniqueLocations = [...new Set(res.data.map(d => d.location))];
        setLocations(uniqueLocations);
        
        setError(null);
      } catch (err) {
        console.error("Error fetching donors:", err);
        setError(err.response?.data?.message || "Failed to load donors");
      } finally {
        setLoading(false);
      }
    };
    fetchDonors();
  }, []);

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
        <h2 className="text-3xl font-bold text-gray-800 mb-2">Donors Management</h2>
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

      {/* Donors Table */}
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
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
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

export default Donors;
