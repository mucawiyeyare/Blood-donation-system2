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
  const [activities, setActivities] = useState([]);
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
      
      // Pending requests
      let pendingRequests = 0;
      if (role === "admin") {
        // Fetch new messages
        const messagesResponse = await axios.get("http://localhost:3000/api/contact", {
           headers: { Authorization: `Bearer ${token}` }
        });
        pendingRequests = messagesResponse.data.filter(msg => msg.status === "New").length;
      } else if (role === "hospital") {
        // Fetch pending requests sent by hospital
        const requestsResponse = await axios.get("http://localhost:3000/api/requests/hospital?status=Pending", {
           headers: { Authorization: `Bearer ${token}` }
        });
        pendingRequests = requestsResponse.data.length;
      } else if (role === "donor") {
         // Fetch pending requests received by donor
        const requestsResponse = await axios.get("http://localhost:3000/api/requests/donor?status=Pending", {
           headers: { Authorization: `Bearer ${token}` }
        });
        pendingRequests = requestsResponse.data.length;
      }

      setStats({
        totalUsers: totalUsers,
        totalDonors: totalDonors,
        totalReports: role === "admin" ? totalUsers : totalDonors, // Total records accessible
        activeUsers: role === "admin" ? totalDonors + hospitals : totalDonors, // Active donors and hospitals
        recentDonations: recentDonors,
        pendingRequests: pendingRequests
      });

      // Fetch Recent Activity
      const activityResponse = await axios.get("http://localhost:3000/api/activity?limit=5", {
        headers: { Authorization: `Bearer ${token}` }
      });
      setActivities(activityResponse.data);
      
      setLoading(false);
    } catch (error) {
      console.error("Error fetching dashboard stats:", error);
      setLoading(false);
    }
  };

  const getIcon = (type) => {
    switch (type) {
      case "user": return <Users className="w-5 h-5 text-blue-600" />;
      case "donation": return <Droplet className="w-5 h-5 text-red-600" />;
      case "report": return <FileText className="w-5 h-5 text-green-600" />;
      default: return <Activity className="w-5 h-5 text-gray-600" />;
    }
  };

  const getTypeColor = (type) => {
    switch (type) {
      case "user": return "bg-blue-100";
      case "donation": return "bg-red-100";
      case "report": return "bg-green-100";
      default: return "bg-gray-100";
    }
  };

  const StatCard = ({ icon: Icon, title, value, subtitle, bgColor, iconColor, trend }) => (
    <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow duration-300 border border-gray-100">
      <div className="flex ictems-start justify-between">
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
            : userRole === "health_institution"
            ? "Welcome to Ministry of Health Dashboard - Federal Government of Somalia"
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
        <div className="space-y-3">
          {activities.length > 0 ? (
            activities.map((activity) => (
              <div key={activity._id} className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg">
                <div className={`${getTypeColor(activity.type)} p-2 rounded-full`}>
                  {getIcon(activity.type)}
                </div>
                <div className="flex-1">
                  <p className="font-medium text-gray-800">{activity.action}</p>
                  <p className="text-sm text-gray-500">
                    {new Date(activity.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                     {' - '} 
                    {new Date(activity.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
            ))
          ) : (
            <p className="text-gray-500 text-center py-4">No recent activity</p>
          )}
        </div>
        </div>
      </div>
    </div>
  );
}

export default DashboardHome;
