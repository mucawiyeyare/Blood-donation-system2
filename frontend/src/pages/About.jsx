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
  BarChart3,
  Clock,
  Award,
  CheckCircle,
  Building2,
  Globe,
  Activity
} from "lucide-react";

function About() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-red-600 to-red-700 text-white py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <div className="flex justify-center mb-6">
            <div className="bg-white/20 backdrop-blur-sm p-6 rounded-full">
              <Droplet className="w-16 h-16 text-white" />
            </div>
          </div>
          <h1 className="text-5xl md:text-6xl font-bold mb-6">About BDMS</h1>
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 mb-4 max-w-2xl mx-auto">
            <p className="text-lg font-semibold text-white flex items-center justify-center gap-2">
              <Building2 className="w-6 h-6" />
              Federal Government of Somalia - Ministry of Health
            </p>
          </div>
          <p className="text-xl md:text-2xl text-red-100 max-w-3xl mx-auto">
            Blood Donation Management System - A National Initiative Revolutionizing Healthcare in Somalia
          </p>
        </div>
      </section>

      {/* System Overview */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-800 mb-4">System Overview</h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            BDMS is Somalia's first comprehensive national blood donation management platform, developed by the 
            Federal Government to streamline blood donation processes, connect donors with hospitals across all regions, 
            and save lives through efficient, technology-driven blood management.
          </p>
          <div className="mt-8 bg-blue-50 border-l-4 border-blue-600 p-6 rounded-lg max-w-4xl mx-auto">
            <p className="text-lg text-gray-700">
              <strong className="text-blue-900">Government Initiative:</strong> This system is officially endorsed and managed 
              by the Ministry of Health & Human Services of the Federal Republic of Somalia, ensuring nationwide coverage, 
              data security, and compliance with national healthcare standards.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          <div className="bg-white rounded-xl shadow-lg p-8">
            <div className="flex items-center gap-4 mb-4">
              <div className="bg-red-100 p-4 rounded-lg">
                <Target className="w-8 h-8 text-red-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-800">Our Mission</h3>
            </div>
            <p className="text-gray-600 leading-relaxed">
              To create a seamless nationwide bridge between Somali blood donors and healthcare facilities in need, 
              ensuring that no Somali life is lost due to blood shortage. We strive to make blood donation accessible, 
              efficient, safe, and rewarding for all citizens across Somalia's 18 regions.
            </p>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-8">
            <div className="flex items-center gap-4 mb-4">
              <div className="bg-blue-100 p-4 rounded-lg">
                <Eye className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-800">Our Vision</h3>
            </div>
            <p className="text-gray-600 leading-relaxed">
              To become the leading blood donation management platform in Somalia and the Horn of Africa region, 
              creating a nation where blood is always available when needed in every city and village, and every 
              Somali citizen is empowered and encouraged to save lives through voluntary blood donation.
            </p>
          </div>
        </div>
      </section>

      {/* System Features */}
      <section className="bg-gray-100 py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-800 mb-4">National System Features</h2>
            <p className="text-xl text-gray-600">
              Comprehensive features serving Somalia's donors, hospitals, clinics, and government administrators
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <SystemFeature
              icon={Users}
              title="User Management"
              description="Government-verified registration system for Somali donors, hospitals, clinics, and administrators nationwide"
              features={[
                "Role-based access control",
                "Secure authentication",
                "Profile customization"
              ]}
            />
            <SystemFeature
              icon={MapPin}
              title="Location Services"
              description="GPS-based donor tracking across all Somali regions from Mogadishu to Hargeisa, Kismayo to Bosaso"
              features={[
                "GPS-based donor tracking",
                "Distance calculation",
                "Location-based search"
              ]}
            />
            <SystemFeature
              icon={Droplet}
              title="Donor Database"
              description="National database of verified Somali donors with blood type, location, and real-time availability status"
              features={[
                "Blood type filtering",
                "Availability status",
                "Donation history"
              ]}
            />
            <SystemFeature
              icon={BarChart3}
              title="Analytics & Reports"
              description="Government dashboard with national statistics, regional reports, and data-driven healthcare insights"
              features={[
                "Real-time statistics",
                "Custom reports",
                "Trend analysis"
              ]}
            />
            <SystemFeature
              icon={Shield}
              title="Security & Privacy"
              description="Government-grade security protecting sensitive health data of Somali citizens with full compliance"
              features={[
                "Data encryption",
                "GDPR compliance",
                "Secure API endpoints"
              ]}
            />
            <SystemFeature
              icon={Clock}
              title="24/7 Availability"
              description="24/7 nationwide access for emergency blood requirements across all Somali regions and time zones"
              features={[
                "Cloud-based hosting",
                "High uptime guarantee",
                "Mobile responsive"
              ]}
            />
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-red-50 to-white">
        <div className="max-w-4xl mx-auto text-center">
          <div className="bg-blue-100 rounded-lg p-4 mb-6 inline-block">
            <p className="text-blue-900 font-semibold flex items-center gap-2">
              <Building2 className="w-5 h-5" />
              Official Federal Government Initiative
            </p>
          </div>
          <h2 className="text-4xl font-bold text-gray-800 mb-6">
            Join Somalia's National Life-Saving Network
          </h2>
          <p className="text-xl text-gray-600 mb-8">
            Be part of a government-backed system that's making a real difference in Somali lives across all 18 regions
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/signup"
              className="bg-red-600 text-white px-10 py-4 rounded-lg font-bold text-lg hover:bg-red-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
            >
              Register Now
            </Link>
            <Link
              to="/signin"
              className="bg-gray-800 text-white px-10 py-4 rounded-lg font-bold text-lg hover:bg-gray-900 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
            >
              Sign In
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

// System Feature Component
function SystemFeature({ icon: Icon, title, description, features }) {
  return (
    <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-all duration-300">
      <div className="bg-red-100 w-16 h-16 rounded-lg flex items-center justify-center mb-4">
        <Icon className="w-8 h-8 text-red-600" />
      </div>
      <h3 className="text-xl font-bold text-gray-800 mb-3">{title}</h3>
      <p className="text-gray-600 mb-4">{description}</p>
      <ul className="space-y-2">
        {features.map((feature, index) => (
          <li key={index} className="flex items-start gap-2 text-sm text-gray-700">
            <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
            <span>{feature}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default About;
