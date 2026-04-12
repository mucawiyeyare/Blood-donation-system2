import React, { useState, useEffect } from "react";
import axios from "axios";
import { Mail, Phone, Calendar, Trash2, Search, Filter, MessageSquare, User, Clock } from "lucide-react";

function DashboardMessages() {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    fetchMessages();
  }, []);

  const fetchMessages = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const config = {
        headers: {
          Authorization: `Bearer ${token}`
        }
      };
      // Use full URL for now since execution environment might differ
      const response = await axios.get("http://localhost:3000/api/contact", config);
      setMessages(response.data);
      setLoading(false);
    } catch (err) {
      console.error("Error fetching messages:", err);
      setError("Failed to load messages");
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this message?")) {
      try {
        const token = localStorage.getItem("token");
        const config = {
          headers: {
            Authorization: `Bearer ${token}`
          }
        };
        await axios.delete(`http://localhost:3000/api/contact/${id}`, config);
        setMessages(messages.filter((msg) => msg._id !== id));
      } catch (err) {
        console.error("Error deleting message:", err);
        alert("Failed to delete message");
      }
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "New": return "bg-blue-100 text-blue-800";
      case "Read": return "bg-gray-100 text-gray-800";
      case "Replied": return "bg-green-100 text-green-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const filteredMessages = messages.filter(msg => {
    const matchesSearch = 
      msg.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      msg.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      msg.subject.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (filter === "all") return matchesSearch;
    return matchesSearch && msg.status === filter;
  });

  if (loading) return (
    <div className="flex justify-center items-center h-64">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"></div>
    </div>
  );

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
            <MessageSquare className="w-8 h-8 text-red-600" />
            Messages & Inquiries
          </h1>
          <p className="text-gray-600 mt-1">Manage contact form submissions</p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search messages..."
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 w-full sm:w-64"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <select
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 bg-white"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
          >
            <option value="all">All Status</option>
            <option value="New">New</option>
            <option value="Read">Read</option>
            <option value="Replied">Replied</option>
          </select>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
          {error}
        </div>
      )}

      {filteredMessages.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-xl shadow-sm border border-gray-100">
          <MessageSquare className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-xl font-medium text-gray-600">No messages found</h3>
          <p className="text-gray-400">Try adjusting your search or filter</p>
        </div>
      ) : (
        <div className="grid gap-6">
          {filteredMessages.map((msg) => (
            <div key={msg._id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
              <div className="flex flex-col lg:flex-row justify-between gap-6">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(msg.status)}`}>
                      {msg.status}
                    </span>
                    <span className="text-sm text-gray-500 flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      {new Date(msg.createdAt).toLocaleDateString()}
                    </span>
                    <span className="text-sm text-gray-500 flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      {new Date(msg.createdAt).toLocaleTimeString()}
                    </span>
                  </div>
                  
                  <h3 className="text-lg font-bold text-gray-900 mb-2">{msg.subject}</h3>
                  
                  <div className="flex flex-wrap gap-4 text-sm text-gray-600 mb-4">
                    <div className="flex items-center gap-2">
                      <User className="w-4 h-4" />
                      {msg.fullName}
                    </div>
                    <div className="flex items-center gap-2">
                      <Mail className="w-4 h-4" />
                      <a href={`mailto:${msg.email}`} className="hover:text-red-600 hover:underline">
                        {msg.email}
                      </a>
                    </div>
                    {msg.phone && (
                      <div className="flex items-center gap-2">
                        <Phone className="w-4 h-4" />
                        <a href={`tel:${msg.phone}`} className="hover:text-red-600 hover:underline">
                          {msg.phone}
                        </a>
                      </div>
                    )}
                  </div>

                  <div className="bg-gray-50 rounded-lg p-4 text-gray-700">
                    <p className="whitespace-pre-wrap">{msg.message}</p>
                  </div>
                </div>

                <div className="flex lg:flex-col gap-2 justify-end lg:justify-start lg:border-l lg:pl-6 lg:border-gray-100">
                  <button
                    onClick={() => handleDelete(msg._id)}
                    className="flex items-center gap-2 px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors border border-red-200 hover:border-red-300"
                    title="Delete Message"
                  >
                    <Trash2 className="w-5 h-5" />
                    <span className="lg:hidden">Delete</span>
                  </button>
                  <a
                    href={`mailto:${msg.email}?subject=Re: ${msg.subject}`}
                    className="flex items-center gap-2 px-4 py-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors border border-blue-200 hover:border-blue-300 text-center justify-center"
                    title="Reply via Email"
                  >
                    <Mail className="w-5 h-5" />
                    <span className="lg:hidden">Reply</span>
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default DashboardMessages;
