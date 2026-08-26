import React from "react";
import { Link } from "react-router-dom";
import {
  Heart,
  Droplet,
  Phone,
  Mail,
  MapPin,
  Clock,
  ShieldCheck,
  Building2,
  ArrowRight,
  Sparkles,
} from "lucide-react";
import DhiigKaalLogo from "./DhiigKaalLogo.jsx";

function Footer() {
  const bloodTypes = [
    { type: "O-", label: "Universal Donor" },
    { type: "O+", label: "High Demand" },
    { type: "A+", label: "Common" },
    { type: "A-", label: "Rare" },
    { type: "B+", label: "Common" },
    { type: "B-", label: "Rare" },
    { type: "AB+", label: "Universal Recipient" },
    { type: "AB-", label: "Rarest" },
  ];

  return (
    <footer className="bg-white text-slate-700 border-t border-slate-200">
      {/* Top CTA Banner */}
      <div className="bg-gradient-to-r from-red-600 via-rose-600 to-red-700 text-white py-8 px-4 sm:px-6 lg:px-8 border-b border-red-700">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6 text-center md:text-left">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center flex-shrink-0">
              <Droplet className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="text-xl sm:text-2xl font-black">Ready to Save a Life Today?</h3>
              <p className="text-red-100 text-xs sm:text-sm mt-0.5">
                Join thousands of voluntary blood donors across Somalia connected directly with hospitals.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Link
              to="/signup"
              className="bg-white text-red-700 hover:bg-red-50 px-6 py-3 rounded-xl font-bold text-xs sm:text-sm shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-0.5 flex items-center gap-2"
            >
              <span>Register as Donor</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              to="/signin"
              className="bg-red-950/40 hover:bg-red-950/60 text-white border border-white/30 px-5 py-3 rounded-xl font-bold text-xs sm:text-sm transition-all"
            >
              Hospital Portal
            </Link>
          </div>
        </div>
      </div>

      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10">
          {/* Column 1: Brand & Mission (4 Cols) */}
          <div className="lg:col-span-4 space-y-4">
            <div className="inline-block">
              <DhiigKaalLogo size="md" />
            </div>
            <p className="text-slate-600 text-xs sm:text-sm leading-relaxed max-w-sm">
              <strong className="text-slate-900">DHIIG KAAL</strong> is Somalia's official national blood donation management platform, empowering hospitals to find compatible, eligible blood donors in real time during medical emergencies.
            </p>
            <div className="flex flex-wrap gap-2 pt-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-50 border border-slate-200 text-[11px] font-semibold text-emerald-700 shadow-sm">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                Verified Network
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-50 border border-slate-200 text-[11px] font-semibold text-sky-700 shadow-sm">
                <Clock className="w-3.5 h-3.5 text-sky-600" />
                2-Hour Emergency Protocol
              </span>
            </div>
          </div>

          {/* Column 2: Navigation Links (2 Cols) */}
          <div className="lg:col-span-2 space-y-3">
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">Quick Links</h4>
            <ul className="space-y-2.5 text-xs">
              <li>
                <Link to="/" className="text-slate-600 hover:text-red-600 font-medium transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-slate-600 hover:text-red-600 font-medium transition-colors">
                  About DhiigKaal
                </Link>
              </li>
              <li>
                <a href="/#eligibility" className="text-slate-600 hover:text-red-600 font-medium transition-colors">
                  Eligibility Guide
                </a>
              </li>
              <li>
                <a href="/#faq" className="text-slate-600 hover:text-red-600 font-medium transition-colors">
                  Common Questions
                </a>
              </li>
              <li>
                <Link to="/contact" className="text-slate-600 hover:text-red-600 font-medium transition-colors">
                  Contact Support
                </Link>
              </li>
              <li>
                <Link to="/signin" className="text-slate-600 hover:text-red-600 font-medium transition-colors">
                  Sign In
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Blood Groups (3 Cols) */}
          <div className="lg:col-span-3 space-y-3">
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">Blood Types Needed</h4>
            <div className="grid grid-cols-2 gap-2">
              {bloodTypes.map((bt) => (
                <div
                  key={bt.type}
                  className="bg-slate-50 border border-slate-200/90 rounded-xl p-2 flex items-center justify-between shadow-sm"
                >
                  <span className="text-xs font-black text-red-600">{bt.type}</span>
                  <span className="text-[10px] text-slate-500 font-medium">{bt.label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Column 4: Emergency Contacts & Location (3 Cols) */}
          <div className="lg:col-span-3 space-y-3">
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">Emergency Contacts</h4>
            <ul className="space-y-3 text-xs text-slate-600">
              <li className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-red-600 flex-shrink-0 mt-0.5" />
                <span className="font-medium">Mogadishu, Banaadir & Regional Hospitals, Somalia</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                <a href="tel:+252616408886" className="hover:text-red-600 font-bold text-slate-800 transition-colors">
                  +252 61 640 8886 (24/7 Line)
                </a>
              </li>
              <li className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-sky-600 flex-shrink-0" />
                <a href="mailto:info@dhiigkaal.so" className="hover:text-red-600 font-medium transition-colors">
                  info@dhiigkaal.so
                </a>
              </li>
              <li className="flex items-center gap-2.5">
                <Building2 className="w-4 h-4 text-purple-600 flex-shrink-0" />
                <span className="font-medium">Partnered with Major Hospitals</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-slate-200 bg-slate-50 py-6 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500 text-center sm:text-left">
          <p>© {new Date().getFullYear()} DHIIG KAAL. National Blood Donation Network. All rights reserved.</p>
          <p className="flex items-center justify-center gap-1 text-slate-600 font-medium">
            <span>Built with</span>
            <Heart className="w-3.5 h-3.5 text-red-600 fill-red-600 inline" />
            <span>to save lives across Somalia</span>
          </p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
