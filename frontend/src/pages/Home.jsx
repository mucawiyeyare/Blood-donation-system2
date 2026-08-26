import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import {
  Droplet,
  Heart,
  Users,
  Shield,
  MapPin,
  Clock,
  Building2,
  PhoneCall,
  CheckCircle2,
  ArrowRight,
  Send,
  Sparkles,
  Trophy,
  PieChart,
  TrendingUp,
  Activity,
  BarChart3,
} from "lucide-react";
import ChatBot from "../Components/ChatBot.jsx";
import FAQSection from "../Components/FAQSection.jsx";

function FeatureCard({ icon: Icon, title, description, color, iconColor }) {
  return (
    <div className="bg-white p-6 rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 border border-slate-100 flex flex-col items-start group">
      <div className={`p-3.5 rounded-xl ${color} mb-4 group-hover:scale-110 transition-transform`}>
        <Icon className={`w-6 h-6 ${iconColor}`} />
      </div>
      <h3 className="text-lg font-bold text-slate-800 mb-2">{title}</h3>
      <p className="text-slate-600 text-sm leading-relaxed">{description}</p>
    </div>
  );
}

function Home() {
  const heroImages = [
    { src: "/hero1.jpg", alt: "Blood bags with blood types" },
    { src: "/hero2.jpg", alt: "Blood storage facility" },
    { src: "/hero3.jpg", alt: "Blood bags on shelves" },
    { src: "/hero4.jpg", alt: "Blood donation bag with heart" },
    { src: "/hero5.jpg", alt: "Blood transfusion bag" },
  ];

  const [currentSlide, setCurrentSlide] = useState(0);
  const [leaderboard, setLeaderboard] = useState([]);
  const [reportLoading, setReportLoading] = useState(true);
  const [reportData, setReportData] = useState({
    bloodTypeStats: {
      "A+": { count: 0, percentage: "0.0" },
      "A-": { count: 0, percentage: "0.0" },
      "B+": { count: 0, percentage: "0.0" },
      "B-": { count: 0, percentage: "0.0" },
      "AB+": { count: 0, percentage: "0.0" },
      "AB-": { count: 0, percentage: "0.0" },
      "O+": { count: 0, percentage: "0.0" },
      "O-": { count: 0, percentage: "0.0" },
    },
    monthlyStats: {
      totalDonationsThisMonth: 0,
      newDonorsThisMonth: 0,
      percentageChange: 0,
    },
    activityStats: {
      totalDonors: 0,
      totalHospitals: 0,
      totalUsers: 0,
    },
  });

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroImages.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [heroImages.length]);

  useEffect(() => {
    axios.get("/api/requests/leaderboard")
      .then(res => setLeaderboard(res.data))
      .catch(() => {});

    axios.get("/api/users/public-report")
      .then(res => {
        if (res.data && res.data.bloodTypeStats) {
          setReportData(res.data);
        }
      })
      .catch(() => {})
      .finally(() => setReportLoading(false));
  }, []);

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Hero Section with DHIIG KAAL visual identity */}
      <section className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-red-950 to-slate-900 text-white py-20 lg:py-28">
        {/* Background decorative glowing circles */}
        <div className="absolute top-10 left-1/4 w-72 h-72 bg-red-600/20 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-10 right-1/4 w-72 h-72 bg-sky-500/20 rounded-full blur-3xl pointer-events-none"></div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Column: Heading & CTAs */}
            <div className="lg:col-span-7 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-sky-300 text-xs font-semibold mb-6">
                <Sparkles className="w-4 h-4 text-sky-400" />
                <span>National Blood Donation Network • Somalia</span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-tight mb-6">
                Save Lives with <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 via-red-400 to-sky-400">
                  DHIIG KAAL
                </span>
              </h1>

              <p className="text-base sm:text-lg text-slate-300 mb-8 max-w-2xl mx-auto lg:mx-0 leading-relaxed">
                A modern blood donation management system directly connecting hospitals with registered donors across Somalia. Real-time availability, WhatsApp emergency requests, and automated 2-hour workflow tracking.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <Link
                  to="/signup"
                  className="flex items-center justify-center gap-2 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white px-7 py-3.5 rounded-xl font-bold text-base shadow-lg shadow-red-600/40 hover:shadow-xl transition-all duration-200 transform hover:-translate-y-0.5"
                >
                  <Droplet className="w-5 h-5" />
                  <span>Register as Donor</span>
                </Link>

                <Link
                  to="/signin"
                  className="flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 backdrop-blur-sm text-white px-7 py-3.5 rounded-xl font-bold text-base border border-white/20 transition-all duration-200"
                >
                  <Building2 className="w-5 h-5 text-sky-400" />
                  <span>Hospital Portal</span>
                  <ArrowRight className="w-4 h-4 text-slate-400" />
                </Link>
              </div>

              {/* Quick stats pills */}
              <div className="mt-12 grid grid-cols-3 gap-4 pt-8 border-t border-white/10">
                <div>
                  <p className="text-2xl sm:text-3xl font-black text-red-400">8+</p>
                  <p className="text-xs text-slate-400 uppercase tracking-wider font-semibold">Blood Types</p>
                </div>
                <div>
                  <p className="text-2xl sm:text-3xl font-black text-sky-400">2 Hours</p>
                  <p className="text-xs text-slate-400 uppercase tracking-wider font-semibold">Arrival Window</p>
                </div>
                <div>
                  <p className="text-2xl sm:text-3xl font-black text-emerald-400">100%</p>
                  <p className="text-xs text-slate-400 uppercase tracking-wider font-semibold">WhatsApp Direct</p>
                </div>
              </div>
            </div>

            {/* Right Column: Animated Image Slideshow */}
            <div className="lg:col-span-5 flex justify-center">
              <div
                className="relative w-full max-w-md rounded-3xl overflow-hidden shadow-2xl border border-white/20"
                style={{ height: "420px" }}
              >
                {/* Slideshow Images */}
                {heroImages.map((img, index) => (
                  <div
                    key={index}
                    className="absolute inset-0 transition-opacity duration-1000 ease-in-out"
                    style={{ opacity: currentSlide === index ? 1 : 0 }}
                  >
                    <img
                      src={img.src}
                      alt={img.alt}
                      className="w-full h-full object-cover"
                    />
                    {/* Gradient overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-slate-900/20 to-transparent" />
                  </div>
                ))}

                {/* Top-left: LIVE badge */}
                <div className="absolute top-4 left-4 z-10 flex items-center gap-1.5 bg-red-600/90 backdrop-blur-sm px-3 py-1.5 rounded-full shadow-lg">
                  <span className="w-2 h-2 rounded-full bg-white animate-pulse" />
                  <span className="text-white text-xs font-bold tracking-wide">LIVE DONATIONS</span>
                </div>

                {/* Top-right: image counter */}
                <div className="absolute top-4 right-4 z-10 bg-black/40 backdrop-blur-sm px-2.5 py-1 rounded-full">
                  <span className="text-white text-xs font-semibold">
                    {currentSlide + 1} / {heroImages.length}
                  </span>
                </div>

                {/* Bottom: dots + label */}
                <div className="absolute bottom-0 left-0 right-0 p-5 flex flex-col items-center gap-3 z-10">
                  <p className="text-white/80 text-xs font-semibold tracking-widest uppercase">
                    Blood Donation System — Somalia
                  </p>
                  <div className="flex gap-2">
                    {heroImages.map((_, index) => (
                      <button
                        key={index}
                        onClick={() => setCurrentSlide(index)}
                        className={`transition-all duration-300 rounded-full ${
                          currentSlide === index
                            ? "w-7 h-2.5 bg-red-500"
                            : "w-2.5 h-2.5 bg-white/40 hover:bg-white/70"
                        }`}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 4-Step Status Workflow Section */}
      <section className="py-16 bg-white border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-black text-slate-800 mb-3">Donor Status Workflow</h2>
            <p className="text-slate-600 text-sm max-w-xl mx-auto">
              Automated lifecycle ensuring efficient donation coordination between hospitals and donors
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-emerald-50/70 border border-emerald-200 rounded-2xl p-6 text-center relative">
              <div className="w-12 h-12 rounded-full bg-emerald-600 text-white flex items-center justify-center font-black mx-auto mb-3 text-lg">
                1
              </div>
              <h3 className="font-bold text-slate-800 mb-1">Available</h3>
              <p className="text-xs text-slate-600">Donor is registered, healthy, and ready for requests.</p>
            </div>

            <div className="bg-amber-50/70 border border-amber-200 rounded-2xl p-6 text-center relative">
              <div className="w-12 h-12 rounded-full bg-amber-500 text-white flex items-center justify-center font-black mx-auto mb-3 text-lg">
                2
              </div>
              <h3 className="font-bold text-slate-800 mb-1">Pending</h3>
              <p className="text-xs text-slate-600">Hospital sends request with a 2-hour countdown timer.</p>
            </div>

            <div className="bg-sky-50/70 border border-sky-200 rounded-2xl p-6 text-center relative">
              <div className="w-12 h-12 rounded-full bg-sky-600 text-white flex items-center justify-center font-black mx-auto mb-3 text-lg">
                3
              </div>
              <h3 className="font-bold text-slate-800 mb-1">Arrived</h3>
              <p className="text-xs text-slate-600">Donor checks in at the hospital clinic for testing.</p>
            </div>

            <div className="bg-red-50/70 border border-red-200 rounded-2xl p-6 text-center relative">
              <div className="w-12 h-12 rounded-full bg-red-600 text-white flex items-center justify-center font-black mx-auto mb-3 text-lg">
                4
              </div>
              <h3 className="font-bold text-slate-800 mb-1">Donated</h3>
              <p className="text-xs text-slate-600">Donation recorded in history; donor enters cooldown.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Key System Features */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-black text-slate-800 mb-4">
            Designed for Speed, Safety & Impact
          </h2>
          <p className="text-slate-600 text-base max-w-2xl mx-auto">
            Everything hospitals and donors need to respond rapidly to critical blood shortages.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <FeatureCard
            icon={MapPin}
            title="Location & Blood Type Matching"
            description="Hospitals can instantly filter available donors by exact location (Mogadishu, Hargeisa, etc.), blood type, and gender."
            color="bg-red-50"
            iconColor="text-red-600"
          />

          <FeatureCard
            icon={PhoneCall}
            title="WhatsApp Request Integration"
            description="Send pre-formatted official donation requests directly to donors' WhatsApp numbers with one click."
            color="bg-emerald-50"
            iconColor="text-emerald-600"
          />

          <FeatureCard
            icon={Clock}
            title="Automated 2-Hour Expiration"
            description="Prevents donor locking by automatically resetting pending requests if arrival is not confirmed within 2 hours."
            color="bg-amber-50"
            iconColor="text-amber-600"
          />

          <FeatureCard
            icon={Users}
            title="Multi-Donor Batch Requests"
            description="Send simultaneous requests to multiple matching donors and auto-release outstanding requests once fulfilled."
            color="bg-sky-50"
            iconColor="text-sky-600"
          />

          <FeatureCard
            icon={Shield}
            title="Government ID Verification"
            description="Secure national ID and phone verification ensuring integrity, trust, and donor privacy protection."
            color="bg-purple-50"
            iconColor="text-purple-600"
          />

          <FeatureCard
            icon={CheckCircle2}
            title="Historical Donation Records"
            description="Complete donation tracking with certificates of appreciation and medical cooldown reminders."
            color="bg-teal-50"
            iconColor="text-teal-600"
          />
        </div>
      </section>

      {/* Live Public Report Section (Blood Type Distribution & Monthly Trends) */}
      <section className="py-20 bg-slate-100/70 border-t border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-red-100 text-red-700 text-xs font-bold uppercase tracking-wider mb-3">
              <BarChart3 className="w-4 h-4 text-red-600" />
              <span>Real-Time Network Analytics</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-black text-slate-900 mb-3">
              Blood Distribution & Monthly Trends
            </h2>
            <p className="text-slate-600 text-sm sm:text-base max-w-2xl mx-auto">
              Real-time statistical breakdown of registered donor blood groups and monthly life-saving activities
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {/* 1. Blood Type Distribution Card */}
            <div className="bg-white rounded-2xl shadow-lg border border-slate-100 p-6 sm:p-8 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-3 mb-6 pb-4 border-b border-slate-100">
                  <div className="p-2.5 rounded-xl bg-blue-50 text-blue-600">
                    <PieChart className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-slate-800">Blood Type Distribution</h3>
                    <p className="text-xs text-slate-500">Live proportion across all registered donors</p>
                  </div>
                </div>

                {reportLoading ? (
                  <div className="py-12 text-center text-slate-400 text-sm">Loading blood group statistics...</div>
                ) : (
                  <div className="space-y-3.5">
                    {["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"].map((type) => {
                      const data = reportData.bloodTypeStats[type] || { count: 0, percentage: "0.0" };
                      const pct = Number(data.percentage);
                      return (
                        <div key={type} className="flex items-center justify-between gap-3">
                          <span className="text-sm font-bold text-slate-700 w-10">{type}</span>
                          <div className="flex-1 bg-slate-100 rounded-full h-3 overflow-hidden shadow-inner">
                            <div
                              className="bg-gradient-to-r from-red-600 to-rose-500 h-3 rounded-full transition-all duration-700"
                              style={{ width: `${Math.max(pct, data.count > 0 ? 5 : 0)}%` }}
                            />
                          </div>
                          <span className="text-xs font-semibold text-slate-600 w-20 text-right font-mono">
                            {data.count} <span className="text-slate-400">({data.percentage}%)</span>
                          </span>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500 font-medium">
                <span>Total Donors Recorded:</span>
                <span className="font-bold text-slate-800">{reportData.activityStats.totalDonors} Registered</span>
              </div>
            </div>

            {/* 2. Monthly Trends Card */}
            <div className="bg-white rounded-2xl shadow-lg border border-slate-100 p-6 sm:p-8 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-3 mb-6 pb-4 border-b border-slate-100">
                  <div className="p-2.5 rounded-xl bg-emerald-50 text-emerald-600">
                    <TrendingUp className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-slate-800">Monthly Trends</h3>
                    <p className="text-xs text-slate-500">Activity and growth for the current month</p>
                  </div>
                </div>

                <div className="space-y-4">
                  {/* Total Donations Card (Green) */}
                  <div className="bg-emerald-50/80 border border-emerald-100 p-5 rounded-2xl">
                    <p className="text-xs font-bold text-emerald-900 uppercase tracking-wider">Total Donations This Month</p>
                    <p className="text-4xl font-black text-emerald-600 my-2">
                      {reportData.monthlyStats.totalDonationsThisMonth}
                    </p>
                    <p className={`text-xs font-semibold flex items-center gap-1.5 ${reportData.monthlyStats.percentageChange >= 0 ? 'text-emerald-700' : 'text-rose-600'}`}>
                      <TrendingUp className="w-4 h-4" />
                      <span>
                        {reportData.monthlyStats.percentageChange >= 0 ? '+' : ''}
                        {reportData.monthlyStats.percentageChange}% from last month
                      </span>
                    </p>
                  </div>

                  {/* New Donors Card (Blue) */}
                  <div className="bg-sky-50/80 border border-sky-100 p-5 rounded-2xl">
                    <p className="text-xs font-bold text-sky-900 uppercase tracking-wider">New Donors Registered</p>
                    <p className="text-4xl font-black text-sky-600 my-2">
                      {reportData.monthlyStats.newDonorsThisMonth}
                    </p>
                    <p className="text-xs font-semibold text-sky-700 flex items-center gap-1.5">
                      <TrendingUp className="w-4 h-4" />
                      <span>Active this month</span>
                    </p>
                  </div>
                </div>
              </div>

              {/* Activity Overview Footer */}
              <div className="mt-6 pt-4 border-t border-slate-100 grid grid-cols-3 gap-2 text-center">
                <div className="p-2.5 rounded-xl bg-slate-50">
                  <p className="text-lg font-black text-slate-800">{reportData.activityStats.totalDonors}</p>
                  <p className="text-[10px] font-bold text-slate-500 uppercase">Donors</p>
                </div>
                <div className="p-2.5 rounded-xl bg-slate-50">
                  <p className="text-lg font-black text-slate-800">{reportData.activityStats.totalHospitals}</p>
                  <p className="text-[10px] font-bold text-slate-500 uppercase">Hospitals</p>
                </div>
                <div className="p-2.5 rounded-xl bg-slate-50">
                  <p className="text-lg font-black text-slate-800">{reportData.activityStats.totalUsers}</p>
                  <p className="text-[10px] font-bold text-slate-500 uppercase">Total Users</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action Banner */}
      <section className="bg-gradient-to-r from-red-600 via-red-700 to-sky-600 py-16 text-white text-center">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-3xl sm:text-4xl font-black mb-4">
            Be a Hero in Your Community Today
          </h2>
          <p className="text-base sm:text-lg text-red-100 mb-8 max-w-2xl mx-auto">
            Every donation can save up to three lives. Register now to be notified when a hospital near you urgently needs your blood type.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/signup"
              className="bg-white text-red-600 px-8 py-3.5 rounded-xl font-bold text-base hover:bg-slate-100 transition-all shadow-lg"
            >
              Sign Up as a Donor
            </Link>
            <Link
              to="/signin"
              className="bg-red-950/60 hover:bg-red-950/80 text-white px-8 py-3.5 rounded-xl font-bold text-base border border-white/20 transition-all"
            >
              Sign In
            </Link>
          </div>
        </div>
      </section>

      {/* Top 3 Donors Leaderboard (White Background) */}
      <section className="py-20 bg-white border-t border-slate-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-50 border border-amber-200 text-amber-800 text-xs font-bold mb-4 shadow-sm">
            <Trophy className="w-4 h-4 text-amber-500" />
            <span>Hall of Heroes — Top Donors</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-black text-slate-900 mb-3">Our Blood Heroes 🏆</h2>
          <p className="text-slate-600 text-sm max-w-xl mx-auto mb-12">
            These amazing donors have saved the most lives on DhiigKaal. Keep going!
          </p>

          {leaderboard.length === 0 ? (
            <p className="text-slate-400 text-sm">Be the first hero — donate blood today! 🩸</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
              {leaderboard.map((donor, index) => {
                const medals = ["🥇", "🥈", "🥉"];
                const cardStyles = [
                  "bg-gradient-to-b from-amber-50/80 to-white border-2 border-amber-300/80 shadow-md shadow-amber-500/10",
                  "bg-gradient-to-b from-slate-50 to-white border-2 border-slate-300 shadow-md shadow-slate-500/10",
                  "bg-gradient-to-b from-orange-50/80 to-white border-2 border-orange-300/80 shadow-md shadow-orange-500/10",
                ];
                const messages = [
                  "Absolute Legend! Keep saving lives! 🏆",
                  "Amazing work! You're a true hero! ⭐",
                  "Fantastic effort! Keep it up! 💪",
                ];
                return (
                  <div
                    key={index}
                    className={`${cardStyles[index]} rounded-2xl p-6 text-center hover:-translate-y-1 hover:shadow-xl transition-all duration-300`}
                  >
                    {/* Hero Avatar with Medal Overlay */}
                    <div className="relative w-20 h-20 mx-auto mb-3">
                      <div className="w-20 h-20 rounded-full overflow-hidden border-2 border-white shadow-lg bg-gradient-to-tr from-red-600 to-rose-500 flex items-center justify-center text-white font-black text-2xl">
                        {donor.profileImage ? (
                          <img
                            src={donor.profileImage}
                            alt={donor.firstName}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <span>{donor.firstName ? donor.firstName.charAt(0).toUpperCase() : "D"}</span>
                        )}
                      </div>
                      <div className="absolute -top-1.5 -right-1.5 text-2xl drop-shadow-md">
                        {medals[index]}
                      </div>
                    </div>

                    <p className="text-xl font-black text-slate-900">
                      {donor.firstName}
                      {donor.lastInitial ? ` ${donor.lastInitial}.` : ""}
                    </p>
                    <div className="my-2.5">
                      <span className="inline-block px-3 py-1 rounded-full bg-red-50 text-red-700 border border-red-200 text-xs font-black">
                        Blood Type: {donor.bloodType}
                      </span>
                    </div>
                    <p className="text-slate-500 text-xs font-medium">{donor.location}</p>
                    <div className="mt-4 py-2.5 px-4 bg-slate-50 border border-slate-100 rounded-xl">
                      <p className="text-2xl font-black text-slate-900">{donor.donationCount}</p>
                      <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                        donations completed
                      </p>
                    </div>
                    <p className="text-xs text-red-600 mt-3 font-semibold italic">"{messages[index]}"</p>
                  </div>
                );
              })}
            </div>
          )}

          <p className="text-slate-400 text-xs">
            🔒 Only first name shown for privacy. Rankings update in real time.
          </p>
        </div>
      </section>

      {/* FAQ & Eligibility & Impact Section */}
      <FAQSection stats={reportData} />

      {/* ChatBot */}
      <ChatBot />
    </div>
  );
}

export default Home;
