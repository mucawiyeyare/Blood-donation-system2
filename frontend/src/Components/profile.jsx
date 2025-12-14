import React, { useEffect, useState } from "react";
import axios from "axios";
import { User, Mail, Phone, MapPin, Droplet, Shield, Edit, Save, X, Lock, Eye, EyeOff, Camera, Upload, Info, Heart, Users, BarChart3 } from "lucide-react";

function Profile() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({});
  const [message, setMessage] = useState({ type: "", text: "" });
  const [saving, setSaving] = useState(false);
  
  // Profile image state
  const [profileImage, setProfileImage] = useState(null);
  const [showImageUpload, setShowImageUpload] = useState(false);
  
  // Password change states
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: ""
  });
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false
  });

  useEffect(() => {
    fetchProfile();
  }, []);

  // Load user-specific profile image when profile is loaded
  useEffect(() => {
    if (profile && profile._id) {
      // Load profile image specific to this user
      const userImageKey = `profileImage_${profile._id}`;
      const savedImage = localStorage.getItem(userImageKey);
      if (savedImage) {
        setProfileImage(savedImage);
      } else {
        setProfileImage(null); // No image for this user
      }
    }
  }, [profile]);

  const fetchProfile = async () => {
    try {
      const token = localStorage.getItem("token");
      
      if (!token) {
        setError("No authentication token found. Please login again.");
        setLoading(false);
        return;
      }
      
      const res = await axios.get("http://localhost:3000/api/users/profile", {
        headers: { Authorization: `Bearer ${token}` },
      });
      
      setProfile(res.data);
      setEditForm(res.data);
      setError(null);
    } catch (err) {
      console.error("Error fetching profile:", err);
      setError(err.response?.data?.message || "Failed to load profile");
    } finally {
      setLoading(false);
    }
  };

  const handleEditClick = () => {
    setIsEditing(true);
    setEditForm(profile);
    setMessage({ type: "", text: "" });
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setEditForm(profile);
    setMessage({ type: "", text: "" });
  };

  const handleInputChange = (e) => {
    setEditForm({ ...editForm, [e.target.name]: e.target.value });
  };

  const handleSaveProfile = async () => {
    setSaving(true);
    setMessage({ type: "", text: "" });

    try {
      const token = localStorage.getItem("token");
      const res = await axios.put(
        "http://localhost:3000/api/users/profile",
        editForm,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      setProfile(res.data.user);
      setIsEditing(false);
      setMessage({ type: "success", text: "Profile updated successfully!" });
      setTimeout(() => setMessage({ type: "", text: "" }), 3000);
    } catch (err) {
      setMessage({
        type: "error",
        text: err.response?.data?.message || "Failed to update profile"
      });
    } finally {
      setSaving(false);
    }
  };

  const handlePasswordChange = (e) => {
    setPasswordForm({ ...passwordForm, [e.target.name]: e.target.value });
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    setMessage({ type: "", text: "" });

    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setMessage({ type: "error", text: "New passwords do not match!" });
      return;
    }

    if (passwordForm.newPassword.length < 6) {
      setMessage({ type: "error", text: "Password must be at least 6 characters!" });
      return;
    }

    setSaving(true);
    try {
      const token = localStorage.getItem("token");
      await axios.put(
        "http://localhost:3000/api/users/change-password",
        {
          currentPassword: passwordForm.currentPassword,
          newPassword: passwordForm.newPassword
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      setMessage({ type: "success", text: "Password changed successfully!" });
      setShowPasswordForm(false);
      setPasswordForm({ currentPassword: "", newPassword: "", confirmPassword: "" });
      setTimeout(() => setMessage({ type: "", text: "" }), 3000);
    } catch (err) {
      setMessage({
        type: "error",
        text: err.response?.data?.message || "Failed to change password"
      });
    } finally {
      setSaving(false);
    }
  };

  const togglePasswordVisibility = (field) => {
    setShowPasswords({ ...showPasswords, [field]: !showPasswords[field] });
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Check file size (max 2MB)
      if (file.size > 2 * 1024 * 1024) {
        setMessage({ type: "error", text: "Image size should be less than 2MB" });
        return;
      }

      // Check file type
      if (!file.type.startsWith('image/')) {
        setMessage({ type: "error", text: "Please upload a valid image file" });
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        const imageData = reader.result;
        setProfileImage(imageData);
        
        // Save with user-specific key
        if (profile && profile._id) {
          const userImageKey = `profileImage_${profile._id}`;
          localStorage.setItem(userImageKey, imageData);
        }
        
        setShowImageUpload(false);
        setMessage({ type: "success", text: "Profile image updated successfully!" });
        setTimeout(() => setMessage({ type: "", text: "" }), 3000);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = () => {
    setProfileImage(null);
    
    // Remove user-specific image
    if (profile && profile._id) {
      const userImageKey = `profileImage_${profile._id}`;
      localStorage.removeItem(userImageKey);
    }
    
    setShowImageUpload(false);
    setMessage({ type: "success", text: "Profile image removed successfully!" });
    setTimeout(() => setMessage({ type: "", text: "" }), 3000);
  };

  if (loading) {
    return (
      <div className="p-6 w-full">
        <p className="text-gray-600">Loading profile...</p>
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

  if (!profile) {
    return (
      <div className="p-6 w-full">
        <p className="text-gray-600">No profile data available.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">My Profile</h1>
          <p className="text-gray-600">Manage your personal information and security</p>
        </div>

        {/* Message Alert */}
        {message.text && (
          <div
            className={`mb-6 p-4 rounded-lg ${
              message.type === "success"
                ? "bg-green-50 text-green-800 border border-green-200"
                : "bg-red-50 text-red-800 border border-red-200"
            }`}
          >
            {message.text}
          </div>
        )}

        {/* System Information Card - Only for Donors */}
        {profile.role === "donor" && (
          <div className="bg-gradient-to-r from-red-600 to-red-700 rounded-xl shadow-lg p-8 mb-6 text-white">
            <div className="flex items-center gap-3 mb-6">
              <Info className="w-8 h-8" />
              <h2 className="text-2xl font-bold">System Information</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                <div className="flex items-center gap-3 mb-2">
                  <Heart className="w-6 h-6 text-red-200" />
                  <h3 className="font-semibold text-lg">Your Impact on Somalia</h3>
                </div>
                <p className="text-red-100 text-sm">
                  As a registered donor in Somalia's National Blood Donation System, you're part of a life-saving community. 
                  Your blood type <span className="font-bold">{profile.bloodType || "N/A"}</span> can help save Somali lives in emergencies 
                  across all 18 regions.
                </p>
              </div>

              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                <div className="flex items-center gap-3 mb-2">
                  <Users className="w-6 h-6 text-red-200" />
                  <h3 className="font-semibold text-lg">National Community</h3>
                </div>
                <p className="text-red-100 text-sm">
                  Join over 10,000 Somali donors making a difference nationwide. Hospitals from Mogadishu to Hargeisa 
                  can find you when there's an urgent need for blood in your region.
                </p>
              </div>

              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                <div className="flex items-center gap-3 mb-2">
                  <MapPin className="w-6 h-6 text-red-200" />
                  <h3 className="font-semibold text-lg">Location Services</h3>
                </div>
                <p className="text-red-100 text-sm">
                  Your location ({profile.location || "Not set"}) helps hospitals find the nearest donors across Somalia. 
                  Keep your location updated for faster emergency response times in your city.
                </p>
              </div>

              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                <div className="flex items-center gap-3 mb-2">
                  <BarChart3 className="w-6 h-6 text-red-200" />
                  <h3 className="font-semibold text-lg">Government System</h3>
                </div>
                <p className="text-red-100 text-sm">
                  This is an official Federal Government of Somalia initiative. Update your profile, set your location, 
                  and contribute to building a healthier Somalia through our secure dashboard.
                </p>
              </div>
            </div>

            <div className="mt-6 bg-white/10 backdrop-blur-sm rounded-lg p-4">
              <p className="text-sm text-red-100">
                <strong className="text-white">Quick Tip:</strong> Keep your profile information up to date, especially your phone number and location, so hospitals can reach you quickly in case of emergency.
              </p>
            </div>
            
            <div className="mt-4 bg-blue-900/50 backdrop-blur-sm rounded-lg p-4 border border-white/20">
              <p className="text-sm text-white text-center">
                🇸🇴 <strong>Official Government System</strong> - Federal Republic of Somalia | Ministry of Health & Human Services
              </p>
            </div>
          </div>
        )}

        {/* Profile Image Card */}
        <div className="bg-white rounded-xl shadow-lg p-8 border border-gray-200 mb-6">
          <div className="flex flex-col items-center">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Profile Picture</h2>
            
            {/* Profile Image Display */}
            <div className="relative mb-6">
              <div className="w-40 h-40 rounded-full overflow-hidden border-4 border-blue-500 shadow-xl bg-gray-100 flex items-center justify-center">
                {profileImage ? (
                  <img 
                    src={profileImage} 
                    alt="Profile" 
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <User className="w-20 h-20 text-gray-400" />
                )}
              </div>
              
              {/* Camera Icon Button */}
              <button
                onClick={() => setShowImageUpload(!showImageUpload)}
                className="absolute bottom-2 right-2 bg-blue-600 hover:bg-blue-700 text-white p-3 rounded-full shadow-lg transition-colors"
                title="Change Profile Picture"
              >
                <Camera className="w-5 h-5" />
              </button>
            </div>

            {/* Image Upload Section */}
            {showImageUpload && (
              <div className="w-full max-w-md space-y-4">
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                  <Upload className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                  <label className="cursor-pointer">
                    <span className="text-blue-600 hover:text-blue-700 font-semibold">
                      Click to upload
                    </span>
                    <span className="text-gray-600"> or drag and drop</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                    />
                  </label>
                  <p className="text-xs text-gray-500 mt-2">PNG, JPG, GIF up to 2MB</p>
                </div>

                <div className="flex gap-3">
                  {profileImage && (
                    <button
                      onClick={handleRemoveImage}
                      className="flex-1 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-semibold transition-colors"
                    >
                      Remove Image
                    </button>
                  )}
                  <button
                    onClick={() => setShowImageUpload(false)}
                    className="flex-1 bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg font-semibold transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Profile Information Card */}
        <div className="bg-white rounded-xl shadow-lg p-8 border border-gray-200 mb-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-800">Profile Information</h2>
            {!isEditing && (
              <button
                onClick={handleEditClick}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
              >
                <Edit className="w-4 h-4" />
                Edit Profile
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Name */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                <User className="w-4 h-4" />
                Full Name
              </label>
              {isEditing ? (
                <input
                  type="text"
                  name="name"
                  value={editForm.name || ""}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              ) : (
                <p className="text-gray-800 font-medium">{profile.name}</p>
              )}
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                <Mail className="w-4 h-4" />
                Email Address
              </label>
              <p className="text-gray-800 font-medium">{profile.email}</p>
              <p className="text-xs text-gray-500 mt-1">Email cannot be changed</p>
            </div>

            {/* Phone */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                <Phone className="w-4 h-4" />
                Phone Number
              </label>
              {isEditing ? (
                <input
                  type="text"
                  name="phone"
                  value={editForm.phone || ""}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              ) : (
                <p className="text-gray-800 font-medium">{profile.phone || "-"}</p>
              )}
            </div>

            {/* Location */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                <MapPin className="w-4 h-4" />
                Location
              </label>
              {isEditing ? (
                <input
                  type="text"
                  name="location"
                  value={editForm.location || ""}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              ) : (
                <p className="text-gray-800 font-medium">{profile.location || "-"}</p>
              )}
            </div>

            {/* Blood Type */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                <Droplet className="w-4 h-4" />
                Blood Type
              </label>
              {isEditing ? (
                <select
                  name="bloodType"
                  value={editForm.bloodType || ""}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">Select Blood Type</option>
                  <option value="A+">A+</option>
                  <option value="A-">A-</option>
                  <option value="B+">B+</option>
                  <option value="B-">B-</option>
                  <option value="AB+">AB+</option>
                  <option value="AB-">AB-</option>
                  <option value="O+">O+</option>
                  <option value="O-">O-</option>
                </select>
              ) : (
                <p className="text-red-600 font-bold">{profile.bloodType || "-"}</p>
              )}
            </div>

            {/* Role */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                <Shield className="w-4 h-4" />
                Role
              </label>
              <span className={`inline-block px-3 py-1 rounded-full text-sm font-semibold ${
                profile.role === 'admin' ? 'bg-purple-100 text-purple-800' :
                profile.role === 'donor' ? 'bg-green-100 text-green-800' :
                'bg-blue-100 text-blue-800'
              }`}>
                {profile.role}
              </span>
            </div>
          </div>

          {/* Action Buttons */}
          {isEditing && (
            <div className="flex gap-3 mt-6">
              <button
                onClick={handleSaveProfile}
                disabled={saving}
                className="bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white px-6 py-3 rounded-lg flex items-center gap-2 transition-colors"
              >
                <Save className="w-5 h-5" />
                {saving ? "Saving..." : "Save Changes"}
              </button>
              <button
                onClick={handleCancelEdit}
                disabled={saving}
                className="bg-gray-500 hover:bg-gray-600 text-white px-6 py-3 rounded-lg flex items-center gap-2 transition-colors"
              >
                <X className="w-5 h-5" />
                Cancel
              </button>
            </div>
          )}
        </div>

        {/* Change Password Card */}
        <div className="bg-white rounded-xl shadow-lg p-8 border border-gray-200">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-800">Security</h2>
              <p className="text-sm text-gray-600 mt-1">Update your password to keep your account secure</p>
            </div>
            {!showPasswordForm && (
              <button
                onClick={() => setShowPasswordForm(true)}
                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
              >
                <Lock className="w-4 h-4" />
                Change Password
              </button>
            )}
          </div>

          {showPasswordForm && (
            <form onSubmit={handleChangePassword} className="space-y-4">
              {/* Current Password */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Current Password</label>
                <div className="relative">
                  <input
                    type={showPasswords.current ? "text" : "password"}
                    name="currentPassword"
                    value={passwordForm.currentPassword}
                    onChange={handlePasswordChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 pr-12"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => togglePasswordVisibility('current')}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                  >
                    {showPasswords.current ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              {/* New Password */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">New Password</label>
                <div className="relative">
                  <input
                    type={showPasswords.new ? "text" : "password"}
                    name="newPassword"
                    value={passwordForm.newPassword}
                    onChange={handlePasswordChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 pr-12"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => togglePasswordVisibility('new')}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                  >
                    {showPasswords.new ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              {/* Confirm Password */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Confirm New Password</label>
                <div className="relative">
                  <input
                    type={showPasswords.confirm ? "text" : "password"}
                    name="confirmPassword"
                    value={passwordForm.confirmPassword}
                    onChange={handlePasswordChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 pr-12"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => togglePasswordVisibility('confirm')}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                  >
                    {showPasswords.confirm ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 pt-2">
                <button
                  type="submit"
                  disabled={saving}
                  className="bg-red-600 hover:bg-red-700 disabled:bg-gray-400 text-white px-6 py-3 rounded-lg flex items-center gap-2 transition-colors"
                >
                  <Lock className="w-5 h-5" />
                  {saving ? "Changing..." : "Change Password"}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowPasswordForm(false);
                    setPasswordForm({ currentPassword: "", newPassword: "", confirmPassword: "" });
                    setMessage({ type: "", text: "" });
                  }}
                  disabled={saving}
                  className="bg-gray-500 hover:bg-gray-600 text-white px-6 py-3 rounded-lg flex items-center gap-2 transition-colors"
                >
                  <X className="w-5 h-5" />
                  Cancel
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

export default Profile;
