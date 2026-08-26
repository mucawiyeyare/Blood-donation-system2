import React from "react";
import { Link } from "react-router-dom";
import {
  Droplet,
  Target,
  Eye,
  Heart,
  Shield,
  Users,
  MapPin,
  Clock,
  CheckCircle,
  Building2,
  Phone,
  MessageCircle,
  Activity,
  Zap,
  Award,
  Sparkles,
  ArrowRight,
  ChevronRight,
} from "lucide-react";
import ChatBot from "../Components/ChatBot.jsx";

function About() {
  const bloodGroups = [
    { type: "O-", canGiveTo: "All Blood Types (Universal Donor)", canReceiveFrom: "O-" },
    { type: "O+", canGiveTo: "O+, A+, B+, AB+", canReceiveFrom: "O+, O-" },
    { type: "A-", canGiveTo: "A-, A+, AB-, AB+", canReceiveFrom: "A-, O-" },
    { type: "A+", canGiveTo: "A+, AB+", canReceiveFrom: "A+, A-, O+, O-" },
    { type: "B-", canGiveTo: "B-, B+, AB-, AB+", canReceiveFrom: "B-, O-" },
    { type: "B+", canGiveTo: "B+, AB+", canReceiveFrom: "B+, B-, O+, O-" },
    { type: "AB-", canGiveTo: "AB-, AB+", canReceiveFrom: "AB-, A-, B-, O-" },
    { type: "AB+", canGiveTo: "AB+ Only", canReceiveFrom: "All Blood Types (Universal Recipient)" },
  ];

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-red-950 to-slate-900 text-white py-20 px-4 sm:px-6 lg:px-8 border-b border-red-900/30">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#ef4444_1px,transparent_1px)] [background-size:16px_16px]"></div>
        <div className="max-w-7xl mx-auto relative z-10 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-red-600/20 border border-red-500/30 text-red-300 text-xs sm:text-sm font-semibold uppercase tracking-wider mb-6">
            <Sparkles className="w-4 h-4 text-red-400" />
            Somalia's National Blood Donation Network
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight mb-6 leading-tight">
            Saving Lives Across Somalia Through <br />
            <span className="bg-gradient-to-r from-red-400 via-rose-300 to-red-500 bg-clip-text text-transparent">
              Direct & Instant Connection
            </span>
          </h1>

          <p className="text-base sm:text-lg lg:text-xl text-slate-300 max-w-3xl mx-auto leading-relaxed mb-10">
            DHIIG KAAL is a mission-driven digital healthcare platform that directly bridges hospitals, emergency
            clinics, and verified voluntary blood donors with real-time availability and automated WhatsApp dispatching.
          </p>

          {/* Key Impact Stats */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-4xl mx-auto pt-6 border-t border-slate-800/80">
            <div className="p-4 rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10">
              <p className="text-3xl sm:text-4xl font-black text-red-400">2 Hours</p>
              <p className="text-xs text-slate-300 mt-1 uppercase tracking-wider font-semibold">Response Window</p>
            </div>
            <div className="p-4 rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10">
              <p className="text-3xl sm:text-4xl font-black text-white">8 Groups</p>
              <p className="text-xs text-slate-300 mt-1 uppercase tracking-wider font-semibold">Blood Types Covered</p>
            </div>
            <div className="p-4 rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10">
              <p className="text-3xl sm:text-4xl font-black text-emerald-400">100%</p>
              <p className="text-xs text-slate-300 mt-1 uppercase tracking-wider font-semibold">Voluntary Donors</p>
            </div>
            <div className="p-4 rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10">
              <p className="text-3xl sm:text-4xl font-black text-sky-400">24/7</p>
              <p className="text-xs text-slate-300 mt-1 uppercase tracking-wider font-semibold">Emergency Support</p>
            </div>
          </div>
        </div>
      </section>

      {/* Mission & Vision Section */}
      <section className="py-16 sm:py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Mission */}
          <div className="bg-white rounded-3xl p-8 sm:p-10 shadow-sm border border-slate-200/80 hover:shadow-md transition-shadow relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-red-50 rounded-bl-full -z-0 transition-transform group-hover:scale-110"></div>
            <div className="relative z-10">
              <div className="w-14 h-14 rounded-2xl bg-red-600 text-white flex items-center justify-center mb-6 shadow-lg shadow-red-600/30">
                <Target className="w-7 h-7" />
              </div>
              <h3 className="text-2xl sm:text-3xl font-black text-slate-900 mb-4">Our Mission</h3>
              <p className="text-slate-600 leading-relaxed text-sm sm:text-base">
                To build a resilient, technology-driven blood supply network across Somalia where no patient or mother
                in labor loses their life due to delays in finding compatible blood. We make donor registration simple,
                verification rigorous, and hospital requests instant.
              </p>
            </div>
          </div>

          {/* Vision */}
          <div className="bg-white rounded-3xl p-8 sm:p-10 shadow-sm border border-slate-200/80 hover:shadow-md transition-shadow relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-sky-50 rounded-bl-full -z-0 transition-transform group-hover:scale-110"></div>
            <div className="relative z-10">
              <div className="w-14 h-14 rounded-2xl bg-slate-900 text-white flex items-center justify-center mb-6 shadow-lg shadow-slate-900/30">
                <Eye className="w-7 h-7" />
              </div>
              <h3 className="text-2xl sm:text-3xl font-black text-slate-900 mb-4">Our Vision</h3>
              <p className="text-slate-600 leading-relaxed text-sm sm:text-base">
                To become the most reliable and interconnected healthcare emergency response system in the Horn of Africa,
                transforming voluntary blood donation into a widespread community culture powered by real-time mobile
                collaboration.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 3-Step Emergency Workflow */}
      <section className="bg-white py-16 sm:py-24 px-4 sm:px-6 lg:px-8 border-y border-slate-200">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-xs sm:text-sm font-bold uppercase tracking-widest text-red-600 mb-3">
              How DHIIG KAAL Works
            </h2>
            <p className="text-3xl sm:text-4xl font-black text-slate-900">
              The 3-Step Rapid Emergency Blood Workflow
            </p>
            <p className="text-slate-600 mt-3 text-sm sm:text-base">
              Hospitals can request single or multiple donors in seconds with immediate mobile outreach.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
            {/* Step 1 */}
            <div className="bg-slate-50 rounded-3xl p-8 border border-slate-200/80 flex flex-col justify-between hover:border-red-300 transition-colors">
              <div>
                <span className="inline-flex items-center justify-center w-10 h-10 rounded-2xl bg-red-600 text-white font-black text-sm mb-6 shadow-md shadow-red-600/30">
                  01
                </span>
                <h4 className="text-xl font-bold text-slate-900 mb-3">1. Hospital Request</h4>
                <p className="text-slate-600 text-sm leading-relaxed">
                  Medical staff search available donors by blood group and location, then click <strong>Send Request</strong>.
                  A 2-hour pending window is instantly initiated in the system.
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-slate-200/60 flex items-center gap-2 text-xs font-bold text-red-600">
                <Building2 className="w-4 h-4" />
                <span>Verified Hospital Action</span>
              </div>
            </div>

            {/* Step 2 */}
            <div className="bg-slate-50 rounded-3xl p-8 border border-slate-200/80 flex flex-col justify-between hover:border-emerald-300 transition-colors">
              <div>
                <span className="inline-flex items-center justify-center w-10 h-10 rounded-2xl bg-emerald-600 text-white font-black text-sm mb-6 shadow-md shadow-emerald-600/30">
                  02
                </span>
                <h4 className="text-xl font-bold text-slate-900 mb-3">2. Instant WhatsApp Alert</h4>
                <p className="text-slate-600 text-sm leading-relaxed">
                  A pre-formatted official WhatsApp message (<em>"Asc wll waxa laga raba in add dhiiig shubto"</em>)
                  is dispatched directly to the donor's mobile phone for immediate awareness.
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-slate-200/60 flex items-center gap-2 text-xs font-bold text-emerald-600">
                <MessageCircle className="w-4 h-4" />
                <span>Automated WhatsApp Dispatch</span>
              </div>
            </div>

            {/* Step 3 */}
            <div className="bg-slate-50 rounded-3xl p-8 border border-slate-200/80 flex flex-col justify-between hover:border-sky-300 transition-colors">
              <div>
                <span className="inline-flex items-center justify-center w-10 h-10 rounded-2xl bg-sky-600 text-white font-black text-sm mb-6 shadow-md shadow-sky-600/30">
                  03
                </span>
                <h4 className="text-xl font-bold text-slate-900 mb-3">3. Donation & Safe Cooldown</h4>
                <p className="text-slate-600 text-sm leading-relaxed">
                  The donor arrives at the hospital clinic. Once donation is completed, the system records donation history
                  and safely places the donor into a 90-day cooldown before future eligibility.
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-slate-200/60 flex items-center gap-2 text-xs font-bold text-sky-600">
                <Shield className="w-4 h-4" />
                <span>90-Day Safety Cooldown</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Blood Compatibility Guide */}
      <section className="py-16 sm:py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-xs sm:text-sm font-bold uppercase tracking-widest text-red-600 mb-3">
            Medical Compatibility
          </h2>
          <p className="text-3xl sm:text-4xl font-black text-slate-900">
            Blood Group Compatibility Guide
          </p>
          <p className="text-slate-600 mt-3 text-sm sm:text-base">
            Understand who you can donate to and receive blood from during emergency situations.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {bloodGroups.map((bg) => (
            <div
              key={bg.type}
              className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200/80 hover:shadow-md transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="w-12 h-12 rounded-2xl bg-gradient-to-br from-red-600 to-red-700 text-white flex items-center justify-center font-black text-lg shadow-md shadow-red-600/30">
                    {bg.type}
                  </span>
                  {bg.type === "O-" && (
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800 border border-amber-300">
                      Universal Donor
                    </span>
                  )}
                  {bg.type === "AB+" && (
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-sky-100 text-sky-800 border border-sky-300">
                      Universal Recipient
                    </span>
                  )}
                </div>

                <div className="space-y-3 text-xs">
                  <div>
                    <p className="font-bold text-slate-500 uppercase tracking-wider text-[10px]">Can Donate To:</p>
                    <p className="font-semibold text-slate-800 mt-0.5">{bg.canGiveTo}</p>
                  </div>
                  <div>
                    <p className="font-bold text-slate-500 uppercase tracking-wider text-[10px]">Can Receive From:</p>
                    <p className="font-semibold text-slate-800 mt-0.5">{bg.canReceiveFrom}</p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Regional Network Presence */}
      <section className="bg-slate-900 text-white py-16 sm:py-24 px-4 sm:px-6 lg:px-8 border-t border-slate-800">
        <div className="max-w-7xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 border border-white/10 text-sky-400 text-xs sm:text-sm font-semibold uppercase tracking-wider mb-4">
            <MapPin className="w-4 h-4" />
            Nationwide Reach
          </div>
          <h2 className="text-3xl sm:text-4xl font-black mb-6">
            Serving Hospitals & Donors Across Somalia
          </h2>
          <p className="text-slate-300 max-w-2xl mx-auto text-sm sm:text-base leading-relaxed mb-12">
            Connecting medical facilities from Banadir to Puntland, Somaliland, Jubaland, South West, Hirshabelle, and Galmudug.
          </p>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 max-w-5xl mx-auto">
            {["Mogadishu", "Hargeisa", "Garowe", "Kismayo", "Baidoa", "Beledweyne"].map((city) => (
              <div
                key={city}
                className="bg-white/5 border border-white/10 p-4 rounded-2xl text-center hover:bg-white/10 transition-colors"
              >
                <MapPin className="w-5 h-5 text-red-400 mx-auto mb-2" />
                <span className="font-bold text-sm text-slate-200">{city}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-red-600 via-red-700 to-slate-900 text-white text-center">
        <div className="max-w-4xl mx-auto">
          <Droplet className="w-16 h-16 text-red-200 mx-auto mb-6 animate-pulse" />
          <h2 className="text-3xl sm:text-5xl font-black mb-6 tracking-tight">
            Ready to Make a Life-Saving Difference?
          </h2>
          <p className="text-base sm:text-xl text-red-100 max-w-2xl mx-auto mb-10 leading-relaxed">
            Register today as a voluntary blood donor or onboard your healthcare institution to Somalia's central
            blood network.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/signup"
              className="bg-white text-red-700 hover:bg-red-50 px-8 py-4 rounded-2xl font-black text-sm uppercase tracking-wider shadow-xl hover:shadow-2xl transition-all transform hover:-translate-y-0.5 flex items-center justify-center gap-2"
            >
              <span>Become a Donor</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              to="/signin"
              className="bg-slate-900/60 hover:bg-slate-900/90 text-white border border-white/20 px-8 py-4 rounded-2xl font-black text-sm uppercase tracking-wider transition-all"
            >
              Sign In to Portal
            </Link>
          </div>
        </div>
      </section>

      {/* Floating AI ChatBot */}
      <ChatBot />
    </div>
  );
}

export default About;
