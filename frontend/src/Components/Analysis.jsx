import React, { useState, useEffect } from "react";
import { BarChart3, TrendingUp, PieChart, Activity } from "lucide-react";
import axios from "axios";

function Analysis() {
  const [bloodTypeStats, setBloodTypeStats] = useState({});
  const [monthlyStats, setMonthlyStats] = useState({
    totalDonationsThisMonth: 0,
    newDonorsThisMonth: 0,
    percentageChange: 0
  });
  const [activityStats, setActivityStats] = useState({
    totalDonors: 0,
    totalHospitals: 0,
    totalUsers: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAnalysisData();
  }, []);

  const fetchAnalysisData = async () => {
    try {
      const token = localStorage.getItem("token");
      
      // Fetch all users and donors
      const usersResponse = await axios.get("http://localhost:3000/api/admin/users", {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      const donorsResponse = await axios.get("http://localhost:3000/api/users/donors", {
        headers: { Authorization: `Bearer ${token}` }
      });

      const allUsers = usersResponse.data;
      const donors = donorsResponse.data;

      // Calculate blood type distribution
      const bloodTypes = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];
      const bloodTypeCount = {};
      const totalDonors = donors.length;

      bloodTypes.forEach(type => {
        const count = donors.filter(d => d.bloodType === type).length;
        bloodTypeCount[type] = {
          count: count,
          percentage: totalDonors > 0 ? ((count / totalDonors) * 100).toFixed(1) : 0
        };
      });

      setBloodTypeStats(bloodTypeCount);

      // Calculate monthly statistics
      const now = new Date();
      const currentMonth = now.getMonth();
      const currentYear = now.getFullYear();
      
      const thisMonthDonors = donors.filter(d => {
        const createdDate = new Date(d.createdAt);
        return createdDate.getMonth() === currentMonth && createdDate.getFullYear() === currentYear;
      });

      const lastMonth = new Date(currentYear, currentMonth - 1, 1);
      const lastMonthDonors = donors.filter(d => {
        const createdDate = new Date(d.createdAt);
        return createdDate.getMonth() === lastMonth.getMonth() && createdDate.getFullYear() === lastMonth.getFullYear();
      });

      const percentageChange = lastMonthDonors.length > 0 
        ? (((thisMonthDonors.length - lastMonthDonors.length) / lastMonthDonors.length) * 100).toFixed(1)
        : 100;

      setMonthlyStats({
        totalDonationsThisMonth: thisMonthDonors.length,
        newDonorsThisMonth: thisMonthDonors.length,
        percentageChange: percentageChange
      });

      // Activity overview
      setActivityStats({
        totalDonors: donors.length,
        totalHospitals: allUsers.filter(u => u.role === "hospital").length,
        totalUsers: allUsers.length
      });

      setLoading(false);
    } catch (error) {
      console.error("Error fetching analysis data:", error);
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-800 mb-2">Analysis & Statistics</h1>
        <p className="text-gray-600">Detailed analytics and insights based on real data</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Blood Type Distribution */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center gap-3 mb-4">
            <PieChart className="w-6 h-6 text-blue-600" />
            <h2 className="text-xl font-bold text-gray-800">Blood Type Distribution</h2>
          </div>
          {loading ? (
            <p className="text-gray-500">Loading...</p>
          ) : (
            <div className="space-y-3">
              {Object.entries(bloodTypeStats).map(([type, data]) => (
                <div key={type} className="flex justify-between items-center">
                  <span className="text-gray-600 font-medium w-12">{type}</span>
                  <div className="flex items-center gap-2 flex-1">
                    <div className="w-full bg-gray-200 rounded-full h-3">
                      <div 
                        className="bg-red-500 h-3 rounded-full transition-all duration-500" 
                        style={{ width: `${data.percentage}%` }}
                      ></div>
                    </div>
                    <span className="text-sm font-semibold text-gray-700 w-16 text-right">
                      {data.count} ({data.percentage}%)
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Monthly Trends */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center gap-3 mb-4">
            <TrendingUp className="w-6 h-6 text-green-600" />
            <h2 className="text-xl font-bold text-gray-800">Monthly Trends</h2>
          </div>
          {loading ? (
            <p className="text-gray-500">Loading...</p>
          ) : (
            <div className="space-y-4">
              <div className="bg-green-50 p-4 rounded-lg">
                <p className="text-sm text-gray-600">Total Donations This Month</p>
                <p className="text-3xl font-bold text-green-600">{monthlyStats.totalDonationsThisMonth}</p>
                <p className={`text-xs flex items-center gap-1 mt-1 ${monthlyStats.percentageChange >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  <TrendingUp className="w-3 h-3" />
                  {monthlyStats.percentageChange >= 0 ? '+' : ''}{monthlyStats.percentageChange}% from last month
                </p>
              </div>
              <div className="bg-blue-50 p-4 rounded-lg">
                <p className="text-sm text-gray-600">New Donors Registered</p>
                <p className="text-3xl font-bold text-blue-600">{monthlyStats.newDonorsThisMonth}</p>
                <p className="text-xs text-blue-600 flex items-center gap-1 mt-1">
                  <TrendingUp className="w-3 h-3" />
                  This month
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Activity Overview */}
        <div className="bg-white rounded-xl shadow-lg p-6 md:col-span-2">
          <div className="flex items-center gap-3 mb-4">
            <Activity className="w-6 h-6 text-purple-600" />
            <h2 className="text-xl font-bold text-gray-800">Activity Overview</h2>
          </div>
          {loading ? (
            <p className="text-gray-500">Loading...</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-purple-50 p-4 rounded-lg text-center">
                <p className="text-sm text-gray-600 mb-2">Total Donors</p>
                <p className="text-2xl font-bold text-purple-600">{activityStats.totalDonors}</p>
              </div>
              <div className="bg-orange-50 p-4 rounded-lg text-center">
                <p className="text-sm text-gray-600 mb-2">Total Hospitals</p>
                <p className="text-2xl font-bold text-orange-600">{activityStats.totalHospitals}</p>
              </div>
              <div className="bg-pink-50 p-4 rounded-lg text-center">
                <p className="text-sm text-gray-600 mb-2">Total Users</p>
                <p className="text-2xl font-bold text-pink-600">{activityStats.totalUsers}</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Analysis;
