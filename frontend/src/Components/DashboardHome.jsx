import React, { useState, useEffect } from "react";
import { Users, Droplet, FileText, Activity, TrendingUp, AlertCircle } from "lucide-react";
import axios from "axios";

function DashboardHome() {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalDonors: 0,
    totalReports: 0,
    activeUsers: 0,
    recentDonations: 0,
    pendingRequests: 0
  });
  const [loading, setLoading] = useState(true);
  const [userRole, setUserRole] = useState("");

  useEffect(() => {
    const role = localStorage.getItem("role");
    setUserRole(role);
    fetchDashboardStats();
  }, []);

  const fetchDashboardStats = async () => {
    try {
      const token = localStorage.getItem("token");
      const role = localStorage.getItem("role");
      
      let allUsers = [];
      
      // Only admins can fetch all users
      if (role === "admin") {
        const usersResponse = await axios.get("http://localhost:3000/api/admin/users", {
          headers: { Authorization: `Bearer ${token}` }
        });
        allUsers = usersResponse.data;
      }
      
      // Both admin and hospital can fetch donors
      const donorsResponse = await axios.get("http://localhost:3000/api/users/donors", {
        headers: { Authorization: `Bearer ${token}` }
      });

      const donors = donorsResponse.data;
      
      // Calculate real statistics
      const totalUsers = allUsers.length;
      const totalDonors = donors.length;
      const hospitals = role === "admin" ? allUsers.filter(u => u.role === "hospital").length : 0;
      const admins = role === "admin" ? allUsers.filter(u => u.role === "admin").length : 0;
      
      // Recent donations (users created in last 30 days)
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      const recentDonors = donors.filter(d => new Date(d.createdAt) >= thirtyDaysAgo).length;
      
      // Pending requests (for now, we'll use a placeholder - you can add a status field later)
      const pendingRequests = 0; // Update this when you add request tracking

      setStats({
        totalUsers: totalUsers,
        totalDonors: totalDonors,
        totalReports: role === "admin" ? totalUsers : totalDonors, // Total records accessible
        activeUsers: role === "admin" ? totalDonors + hospitals : totalDonors, // Active donors and hospitals
        recentDonations: recentDonors,
        pendingRequests: pendingRequests
      });
      
      setLoading(false);
    } catch (error) {
      console.error("Error fetching dashboard stats:", error);
      setLoading(false);
    }
  };

  const StatCard = ({ icon: Icon, title, value, subtitle, bgColor, iconColor, trend }) => (
    <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow duration-300 border border-gray-100">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-3">
            <div className={`${bgColor} p-3 rounded-lg`}>
              <Icon className={`${iconColor} w-6 h-6`} />
            </div>
            <h3 className="text-gray-600 font-medium text-sm">{title}</h3>
          </div>
          <div className="ml-0">
            <p className="text-3xl font-bold text-gray-800 mb-1">{loading ? "..." : value}</p>
            {subtitle && (
              <p className="text-sm text-gray-500 flex items-center gap-1">
                {trend && <TrendingUp className="w-4 h-4 text-green-500" />}
                {subtitle}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-800 mb-2">Dashboard Overview</h1>
        <p className="text-gray-600">
          {userRole === "hospital" 
            ? "Welcome to your Hospital Dashboard - Manage donor requests and view available donors" 
            : userRole === "admin"
            ? "Welcome to Blood Donation Management System"
            : "Welcome to your Donor Dashboard"}
        </p>
      </div>

      {/* Statistics Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {userRole === "admin" && (
          <StatCard
            icon={Users}
            title="Total Users"
            value={stats.totalUsers}
            subtitle="All registered users"
            bgColor="bg-blue-100"
            iconColor="text-blue-600"
            trend={true}
          />
        )}
        
        <StatCard
          icon={Droplet}
          title={userRole === "hospital" ? "Available Donors" : "Total Donors"}
          value={stats.totalDonors}
          subtitle={userRole === "hospital" ? "Donors you can request" : "Active blood donors"}
          bgColor="bg-red-100"
          iconColor="text-red-600"
          trend={true}
        />
        
        <StatCard
          icon={FileText}
          title={userRole === "hospital" ? "Donor Records" : "Total Reports"}
          value={stats.totalReports}
          subtitle={userRole === "hospital" ? "Available donor records" : "Generated reports"}
          bgColor="bg-green-100"
          iconColor="text-green-600"
        />
        
        <StatCard
          icon={Activity}
          title={userRole === "hospital" ? "Active Donors" : "Active Users"}
          value={stats.activeUsers}
          subtitle="Currently active"
          bgColor="bg-purple-100"
          iconColor="text-purple-600"
        />
        
        <StatCard
          icon={TrendingUp}
          title="Recent Registrations"
          value={stats.recentDonations}
          subtitle="Last 30 days"
          bgColor="bg-orange-100"
          iconColor="text-orange-600"
          trend={true}
        />
        
        <StatCard
          icon={AlertCircle}
          title="Pending Requests"
          value={stats.pendingRequests}
          subtitle="Awaiting approval"
          bgColor="bg-yellow-100"
          iconColor="text-yellow-600"
        />
      </div>

      {/* Quick Actions Section */}
      <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200 flex items-center justify-center gap-2">
            <Users className="w-5 h-5" />
            View All Users
          </button>
          <button className="bg-red-500 hover:bg-red-600 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200 flex items-center justify-center gap-2">
            <Droplet className="w-5 h-5" />
            Manage Donors
          </button>
          <button className="bg-green-500 hover:bg-green-600 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200 flex items-center justify-center gap-2">
            <FileText className="w-5 h-5" />
            Generate Report
          </button>
        </div>
      </div>

      {/* Recent Activity Section */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Recent Activity</h2>
        <div className="space-y-3">
          <div className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg">
            <div className="bg-blue-100 p-2 rounded-full">
              <Users className="w-5 h-5 text-blue-600" />
            </div>
            <div className="flex-1">
              <p className="font-medium text-gray-800">New user registered</p>
              <p className="text-sm text-gray-500">2 hours ago</p>
            </div>
          </div>
          <div className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg">
            <div className="bg-red-100 p-2 rounded-full">
              <Droplet className="w-5 h-5 text-red-600" />
            </div>
            <div className="flex-1">
              <p className="font-medium text-gray-800">Blood donation completed</p>
              <p className="text-sm text-gray-500">5 hours ago</p>
            </div>
          </div>
          <div className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg">
            <div className="bg-green-100 p-2 rounded-full">
              <FileText className="w-5 h-5 text-green-600" />
            </div>
            <div className="flex-1">
              <p className="font-medium text-gray-800">Monthly report generated</p>
              <p className="text-sm text-gray-500">1 day ago</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DashboardHome;
