import React from "react";
import { Link } from "react-router-dom";
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
} from "lucide-react";
import DhiigKaalLogo from "../Components/DhiigKaalLogo.jsx";

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

            {/* Right Column: Hero Visual Card with Brand Logo */}
            <div className="lg:col-span-5 flex justify-center">
              <div className="bg-white/10 backdrop-blur-md rounded-3xl p-6 sm:p-8 border border-white/20 shadow-2xl w-full max-w-md">
                <div className="bg-white rounded-2xl p-6 shadow-inner text-center mb-6">
                  <DhiigKaalLogo size="lg" className="justify-center" />
                </div>

                <div className="space-y-3">
                  <div className="bg-slate-800/80 rounded-xl p-3.5 border border-slate-700/50 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-lg bg-red-600/20 text-red-400 flex items-center justify-center font-bold text-sm">
                        O-
                      </div>
                      <div className="text-left">
                        <p className="text-xs font-semibold text-white">Emergency Blood Request</p>
                        <p className="text-[11px] text-slate-400">Mogadishu General Hospital</p>
                      </div>
                    </div>
                    <span className="px-2.5 py-1 rounded-md text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                      Pending (1h 45m)
                    </span>
                  </div>

                  <div className="bg-slate-800/80 rounded-xl p-3.5 border border-slate-700/50 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-lg bg-sky-500/20 text-sky-400 flex items-center justify-center font-bold text-sm">
                        A+
                      </div>
                      <div className="text-left">
                        <p className="text-xs font-semibold text-white">Donor Check-in</p>
                        <p className="text-[11px] text-slate-400">Hodan Clinic, Banaadir</p>
                      </div>
                    </div>
                    <span className="px-2.5 py-1 rounded-md text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                      Arrived
                    </span>
                  </div>
                </div>

                <div className="mt-6 text-center">
                  <p className="text-xs text-slate-300">
                    Trusted by hospitals, healthcare institutions, and voluntary blood donors.
                  </p>
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
              Hospital Sign In
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Home;
