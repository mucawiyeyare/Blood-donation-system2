import React, { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { Droplet, User, Mail, Lock, Phone, MapPin, ShieldCheck, HeartHandshake, Calendar, AlertCircle, CheckCircle2 } from "lucide-react";
import DhiigKaalLogo from "../Components/DhiigKaalLogo.jsx";

function Signup() {
  const [formData, setFormData] = useState({
    nationalId: "",
    gender: "",
    name: "",
    email: "",
    password: "",
    phone: "",
    location: "",
    bloodType: "",
    age: "",
  });

  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage("");
    setSuccessMessage("");
    setLoading(true);

    try {
      const res = await axios.post("/api/users/register", formData);
      setSuccessMessage(res.data.message || "Donor registration successful! Redirecting to login...");
      setFormData({ nationalId: "", gender: "", name: "", email: "", password: "", phone: "", location: "", bloodType: "", age: "" });
      setTimeout(() => {
        navigate("/signin");
      }, 1500);
    } catch (error) {
      setErrorMessage(error.response?.data?.message || "Registration failed. Please check your information.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-sky-50/40 to-slate-100 flex items-center justify-center p-4 sm:p-6 lg:p-8">
      <div className="w-full max-w-3xl">
        {/* Header & Logo */}
        <div className="text-center mb-8 flex flex-col items-center">
          <Link to="/" className="inline-block transform hover:scale-105 transition-transform duration-200 mb-2">
            <DhiigKaalLogo size="lg" />
          </Link>
          <p className="text-sm font-medium text-slate-600 mt-2">
            Register as a voluntary blood donor and connect directly with hospitals in need
          </p>
        </div>

        {/* Card */}
        <div className="bg-white rounded-2xl shadow-xl border border-slate-100 p-6 sm:p-10 relative overflow-hidden">
          {/* Top accent bar */}
          <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-red-600 via-sky-500 to-red-600"></div>

          <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-100">
            <div>
              <h2 className="text-2xl font-bold text-slate-800">Donor Registration</h2>
              <p className="text-xs text-slate-500 mt-0.5">Please provide accurate information to assist emergency hospital requests</p>
            </div>
            <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-semibold">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              Official System
            </div>
          </div>

          {errorMessage && (
            <div className="mb-6 p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm flex items-center gap-3">
              <AlertCircle className="w-5 h-5 flex-shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          {successMessage && (
            <div className="mb-6 p-4 rounded-xl bg-green-50 border border-green-200 text-green-700 text-sm flex items-center gap-3">
              <CheckCircle2 className="w-5 h-5 flex-shrink-0" />
              <span>{successMessage}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Government ID */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Government / National ID *
              </label>
              <div className="relative">
                <input
                  name="nationalId"
                  placeholder="e.g. SOM-1092839"
                  value={formData.nationalId}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-red-500 focus:border-red-500 text-sm transition-all"
                  required
                />
              </div>
            </div>

            {/* Gender */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Gender *
              </label>
              <select
                name="gender"
                value={formData.gender}
                onChange={handleChange}
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-red-500 focus:border-red-500 text-sm transition-all"
                required
              >
                <option value="">Select Gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
              </select>
            </div>

            {/* Full Name */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Full Name *
              </label>
              <div className="relative">
                <input
                  name="name"
                  placeholder="e.g. Mohamed Ali"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-red-500 focus:border-red-500 text-sm transition-all"
                  required
                />
              </div>
            </div>

            {/* Telephone (WhatsApp Capable) */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                WhatsApp Phone Number *
              </label>
              <input
                name="phone"
                placeholder="e.g. +252 61 5000000"
                value={formData.phone}
                onChange={handleChange}
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-red-500 focus:border-red-500 text-sm transition-all"
                required
              />
              <p className="text-[11px] text-slate-500 mt-1">Hospitals will send request messages via WhatsApp</p>
            </div>

            {/* Blood Type */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Blood Type *
              </label>
              <select
                name="bloodType"
                value={formData.bloodType}
                onChange={handleChange}
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-red-500 focus:border-red-500 text-sm font-semibold text-red-600 transition-all"
                required
              >
                <option value="">Select Blood Type</option>
                <option value="A+">A+ (A Positive)</option>
                <option value="A-">A- (A Negative)</option>
                <option value="B+">B+ (B Positive)</option>
                <option value="B-">B- (B Negative)</option>
                <option value="AB+">AB+ (AB Positive)</option>
                <option value="AB-">AB- (AB Negative)</option>
                <option value="O+">O+ (O Positive)</option>
                <option value="O-">O- (O Negative - Universal Donor)</option>
              </select>
            </div>

            {/* Location */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Current Location / City *
              </label>
              <input
                name="location"
                placeholder="e.g. Mogadishu (Hodan), Hargeisa, Kismayo"
                value={formData.location}
                onChange={handleChange}
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-red-500 focus:border-red-500 text-sm transition-all"
                required
              />
            </div>

            {/* Age / Date of Birth */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Age (Years)
              </label>
              <input
                type="number"
                min="18"
                max="65"
                name="age"
                placeholder="e.g. 25"
                value={formData.age}
                onChange={handleChange}
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-red-500 focus:border-red-500 text-sm transition-all"
              />
            </div>

            {/* Email Address */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Email Address *
              </label>
              <input
                name="email"
                type="email"
                placeholder="name@example.com"
                value={formData.email}
                onChange={handleChange}
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-red-500 focus:border-red-500 text-sm transition-all"
                required
              />
            </div>

            {/* Password */}
            <div className="md:col-span-2">
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Account Password *
              </label>
              <input
                name="password"
                type="password"
                placeholder="Create a secure password"
                value={formData.password}
                onChange={handleChange}
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-red-500 focus:border-red-500 text-sm transition-all"
                required
              />
            </div>

            {/* Submit Button */}
            <div className="md:col-span-2 mt-2">
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 px-6 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white font-bold rounded-xl shadow-lg shadow-red-600/30 hover:shadow-xl transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-50 text-base"
              >
                <HeartHandshake className="w-5 h-5" />
                {loading ? "Registering Donor..." : "Complete Registration"}
              </button>
            </div>
          </form>

          {/* Sign In Link */}
          <div className="mt-8 pt-5 border-t border-slate-100 text-center">
            <p className="text-sm text-slate-600">
              Already registered in DHIIG KAAL?{" "}
              <Link to="/signin" className="text-red-600 hover:text-red-700 font-bold hover:underline">
                Sign In to Your Account
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Signup;
