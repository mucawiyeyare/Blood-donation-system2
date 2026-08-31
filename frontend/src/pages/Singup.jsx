import React, { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { Droplet, User, Mail, Lock, Phone, MapPin, ShieldCheck, HeartHandshake, Calendar, AlertCircle, CheckCircle2 } from "lucide-react";
import DhiigKaalLogo from "../Components/DhiigKaalLogo.jsx";
import { SOMALIA_REGIONS } from "../utils/somaliaLocations.js";
import { validateFullName } from "../utils/nameValidator.js";
import GlobalPhoneInput from "../Components/GlobalPhoneInput.jsx";

function Signup() {
  const [formData, setFormData] = useState({
    nationalId: "",
    gender: "",
    name: "",
    email: "",
    password: "",
    carrierCode: "+252 61",
    carrierName: "Hormuud",
    phone: "",
    region: "",
    district: "",
    bloodType: "",
    age: "",
  });

  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [nameError, setNameError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    if (name === "phone") {
      const parsed = parseSomaliPhone(value, formData.carrierCode);
      setFormData(prev => ({
        ...prev,
        phone: parsed.subscriberNumber,
        carrierCode: parsed.carrierCode,
        carrierName: parsed.carrierName,
      }));
      return;
    }

    if (name === "carrierSelect") {
      const selected = SOMALI_CARRIERS.find(c => c.code === value) || SOMALI_CARRIERS[0];
      setFormData(prev => ({
        ...prev,
        carrierCode: selected.code,
        carrierName: selected.name,
      }));
      return;
    }

    setFormData(prev => ({ ...prev, [name]: value }));
    if (name === "name") {
      const nameCheck = validateFullName(value);
      setNameError(value ? nameCheck.error : "");
    }
  };

  const handleRegionChange = (e) => {
    const region = e.target.value;
    setFormData({
      ...formData,
      region,
      district: "",
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const nameCheck = validateFullName(formData.name);
    if (!nameCheck.isValid) {
      setNameError(nameCheck.error);
      setErrorMessage(nameCheck.error);
      return;
    }
    if (!formData.region) {
      setErrorMessage("Please select your region.");
      return;
    }
    if (!formData.district) {
      setErrorMessage("Please select your district.");
      return;
    }
    setErrorMessage("");
    setNameError("");
    setSuccessMessage("");
    setLoading(true);

    try {
      const formattedPhone = `${formData.carrierCode} ${formData.phone}`.trim();
      const payload = {
        ...formData,
        phone: formattedPhone,
        location: `${formData.district}, ${formData.region}`,
      };
      const res = await axios.post("/api/users/register", payload);
      setSuccessMessage(res.data.message || "Donor registration successful! Redirecting to login...");
      setFormData({
        nationalId: "",
        gender: "",
        name: "",
        email: "",
        password: "",
        carrierCode: "+252 61",
        carrierName: "Hormuud",
        phone: "",
        region: "",
        district: "",
        bloodType: "",
        age: "",
      });
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
    <div className="min-h-[calc(100vh-80px)] bg-slate-50 py-12 px-4 sm:px-6 lg:px-8 flex items-center justify-center">
      <div className="w-full max-w-3xl">
        {/* Top Centered Branding Logo */}
        <div className="text-center mb-8 flex flex-col items-center">
          <Link to="/" className="inline-block transform hover:scale-105 transition-transform duration-200 mb-3 bg-white p-3.5 rounded-2xl shadow-sm border border-slate-200/80">
            <DhiigKaalLogo size="lg" />
          </Link>
          <p className="text-sm font-medium text-slate-600 max-w-md mx-auto text-center">
            Register as a voluntary blood donor and connect directly with hospitals in need
          </p>
        </div>

        {/* Card */}
        <div className="bg-white rounded-3xl shadow-xl border border-slate-200/80 p-6 sm:p-10 relative overflow-hidden">
          {/* Top accent bar */}
          <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-red-600 via-rose-500 to-red-600"></div>

          <div className="flex items-center justify-between mb-8 pb-4 border-b border-slate-100">
            <div>
              <h2 className="text-2xl sm:text-3xl font-black text-slate-900">Donor Registration</h2>
              <p className="text-xs sm:text-sm text-slate-500 mt-1">
                Register as a voluntary donor to connect directly with hospitals in need
              </p>
            </div>
            <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-bold uppercase tracking-wide">
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
                  className={`w-full px-4 py-2.5 bg-slate-50 border rounded-xl focus:bg-white focus:ring-2 text-sm transition-all ${
                    nameError
                      ? "border-red-500 focus:ring-red-500 focus:border-red-500 bg-red-50/20"
                      : "border-slate-200 focus:ring-red-500 focus:border-red-500"
                  }`}
                  required
                />
              </div>
              {nameError && (
                <p className="text-[11px] font-semibold text-red-600 mt-1 flex items-center gap-1">
                  <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
                  {nameError}
                </p>
              )}
            </div>

            {/* Telephone (WhatsApp Capable with Global Country Selector) */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                WhatsApp Phone Number *
              </label>
              <GlobalPhoneInput
                value={formData.phone}
                countryCode="SO"
                onChange={({ dialCode, phone }) => {
                  setFormData((prev) => ({
                    ...prev,
                    phone,
                    carrierCode: dialCode,
                  }));
                }}
                placeholder="615000000 or 0771007272"
                required
              />
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

            {/* Region */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Region *
              </label>
              <select
                name="region"
                value={formData.region}
                onChange={handleRegionChange}
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-red-500 focus:border-red-500 text-sm transition-all"
                required
              >
                <option value="">Select region</option>
                {Object.keys(SOMALIA_REGIONS).map((reg) => (
                  <option key={reg} value={reg}>
                    {reg}
                  </option>
                ))}
              </select>
            </div>

            {/* District */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                District *
              </label>
              <select
                name="district"
                value={formData.district}
                onChange={handleChange}
                disabled={!formData.region}
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-red-500 focus:border-red-500 text-sm transition-all disabled:bg-slate-100/80 disabled:text-slate-400 disabled:cursor-not-allowed"
                required
              >
                <option value="">
                  {formData.region ? "Select district" : "Choose region first"}
                </option>
                {formData.region &&
                  SOMALIA_REGIONS[formData.region]?.map((dist) => (
                    <option key={dist} value={dist}>
                      {dist}
                    </option>
                  ))}
              </select>
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
