import React from "react";
import { Link } from "react-router-dom";
import { Droplet, Heart, Users, Shield, TrendingUp, MapPin, Clock, Award, Building2, Globe, Activity, CheckCircle } from "lucide-react";

function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-gray-50">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-r from-red-600 to-red-700 text-white">
        <div className="absolute inset-0 bg-black opacity-10"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-32">
          <div className="text-center">
            <div className="flex justify-center mb-6">
              <div className="bg-white/20 backdrop-blur-sm p-6 rounded-full">
                <Droplet className="w-16 h-16 text-white" />
              </div>
            </div>
            <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">
              Blood Donation Management System
            </h1>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 mb-6 max-w-2xl mx-auto">
              <p className="text-lg font-semibold text-white flex items-center justify-center gap-2">
                <Building2 className="w-6 h-6" />
                Federal Government of Somalia - Ministry of Health
              </p>
            </div>
            <p className="text-xl md:text-2xl mb-4 text-red-100 max-w-3xl mx-auto">
              A National Initiative to Save Lives Through Blood Donation
            </p>
            <p className="text-lg mb-8 text-red-100 max-w-3xl mx-auto">
              Connecting donors across Somalia with hospitals and healthcare facilities in need. Together, we build a healthier nation.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/signin"
                className="bg-white text-red-600 px-8 py-4 rounded-lg font-bold text-lg hover:bg-gray-100 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
              >
                Sign In
              </Link>
              <Link
                to="/signup"
                className="bg-red-800 text-white px-8 py-4 rounded-lg font-bold text-lg hover:bg-red-900 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105 border-2 border-white/30"
              >
                Become a Donor
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Government Initiative Banner */}
      <section className="bg-blue-900 text-white py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <Building2 className="w-12 h-12 text-blue-300" />
              <div>
                <h3 className="text-2xl font-bold">Government Initiative</h3>
                <p className="text-blue-200">Federal Republic of Somalia</p>
              </div>
            </div>
            <div className="text-center md:text-right">
              <p className="text-lg font-semibold">Ministry of Health & Human Services</p>
              <p className="text-blue-200">Serving all regions of Somalia</p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-800 mb-4">Why Choose Our System?</h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            A comprehensive national platform designed to make blood donation easier, safer, and more efficient across all regions of Somalia
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <FeatureCard
            icon={Users}
            title="Nationwide Coverage"
            description="Serving all regions: Mogadishu, Hargeisa, Kismayo, Baidoa, and beyond"
            color="bg-blue-100"
            iconColor="text-blue-600"
          />
          <FeatureCard
            icon={MapPin}
            title="Location-Based Matching"
            description="Find nearest donors across Somalia based on location and blood type"
            color="bg-green-100"
            iconColor="text-green-600"
          />
          <FeatureCard
            icon={Shield}
            title="Government Certified"
            description="Official system approved by Somalia Ministry of Health with secure data protection"
            color="bg-purple-100"
            iconColor="text-purple-600"
          />
          <FeatureCard
            icon={Clock}
            title="24/7 Emergency Response"
            description="Round-the-clock access for emergency blood requirements nationwide"
            color="bg-orange-100"
            iconColor="text-orange-600"
          />
        </div>

        {/* Additional Features */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-8">
          <FeatureCard
            icon={Activity}
            title="Real-Time Updates"
            description="Live blood availability status across all registered hospitals"
            color="bg-red-100"
            iconColor="text-red-600"
          />
          <FeatureCard
            icon={Globe}
            title="Multi-Language Support"
            description="Available in Somali, Arabic, and English for accessibility"
            color="bg-yellow-100"
            iconColor="text-yellow-600"
          />
          <FeatureCard
            icon={Heart}
            title="Community Impact"
            description="Track your contribution to saving lives in your community"
            color="bg-pink-100"
            iconColor="text-pink-600"
          />
        </div>
      </section>

      {/* Statistics Section */}
      <section className="bg-gradient-to-r from-red-600 to-red-700 text-white py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4">Our National Impact</h2>
            <p className="text-xl text-red-100">Making a difference across Somalia</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center">
            <StatCard number="10,000+" label="Registered Donors Nationwide" />
            <StatCard number="150+" label="Partner Hospitals & Clinics" />
            <StatCard number="25,000+" label="Lives Saved" />
            <StatCard number="18" label="Regions Covered" />
          </div>
        </div>
      </section>

      {/* Coverage Areas Section */}
      <section className="bg-gray-50 py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-800 mb-4">Coverage Areas</h2>
            <p className="text-xl text-gray-600">Serving major cities and regions across Somalia</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {[
              "Mogadishu", "Hargeisa", "Kismayo", "Baidoa", "Garowe", "Bosaso",
              "Galkayo", "Beledweyne", "Merca", "Berbera", "Burao", "Jowhar"
            ].map((city, index) => (
              <div key={index} className="bg-white rounded-lg shadow-md p-4 text-center hover:shadow-lg transition-shadow">
                <MapPin className="w-6 h-6 text-red-600 mx-auto mb-2" />
                <p className="font-semibold text-gray-800">{city}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-800 mb-4">How It Works</h2>
          <p className="text-xl text-gray-600">Simple steps to start saving lives in Somalia</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <StepCard
            number="1"
            title="Register with Government ID"
            description="Create your verified account as a donor or healthcare facility using your national ID"
            icon={Users}
          />
          <StepCard
            number="2"
            title="Complete Your Profile"
            description="Add blood type, location, contact details, and availability status"
            icon={Heart}
          />
          <StepCard
            number="3"
            title="Save Somali Lives"
            description="Get matched with hospitals in need and contribute to building a healthier Somalia"
            icon={Award}
          />
        </div>
      </section>

      {/* Benefits Section */}
      <section className="bg-white py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-800 mb-4">Benefits of the System</h2>
            <p className="text-xl text-gray-600">For Donors, Hospitals, and the Nation</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <BenefitCard
              title="For Donors"
              benefits={[
                "Official government recognition",
                "Digital donation certificates",
                "Priority medical assistance",
                "Community hero status",
                "Health screening benefits"
              ]}
            />
            <BenefitCard
              title="For Hospitals"
              benefits={[
                "Quick access to donor database",
                "Emergency blood matching",
                "Reduced response time",
                "Centralized record keeping",
                "Government support"
              ]}
            />
            <BenefitCard
              title="For Somalia"
              benefits={[
                "Improved healthcare system",
                "Reduced mortality rates",
                "National health database",
                "Emergency preparedness",
                "Community solidarity"
              ]}
            />
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-blue-900 to-blue-800 py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3 inline-block mb-6">
            <p className="text-white font-semibold flex items-center gap-2">
              <Building2 className="w-5 h-5" />
              Official Government Initiative
            </p>
          </div>
          <h2 className="text-4xl font-bold text-white mb-6">
            Join Somalia's National Blood Donation Network
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            Be part of a nationwide movement to save lives. Join thousands of Somali donors making a difference every day.
          </p>
          <Link
            to="/signup"
            className="inline-block bg-red-600 text-white px-10 py-4 rounded-lg font-bold text-lg hover:bg-red-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
          >
            Get Started Today
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Droplet className="w-8 h-8 text-red-500" />
                <h3 className="text-xl font-bold">BDMS</h3>
              </div>
              <p className="text-gray-400">
                Blood Donation Management System - Connecting donors with those in need.
              </p>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
              <ul className="space-y-2">
                <li>
                  <Link to="/" className="text-gray-400 hover:text-white transition-colors">
                    Home
                  </Link>
                </li>
                <li>
                  <Link to="/about" className="text-gray-400 hover:text-white transition-colors">
                    About
                  </Link>
                </li>
                <li>
                  <Link to="/signin" className="text-gray-400 hover:text-white transition-colors">
                    Sign In
                  </Link>
                </li>
                <li>
                  <Link to="/signup" className="text-gray-400 hover:text-white transition-colors">
                    Sign Up
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">Contact</h4>
              <p className="text-sm text-gray-400">
                Email: info@bdms.gov.so<br />
                Phone: 252616408886<br />
                Address: Ministry of Health, Mogadishu, Somalia<br />
                Emergency Hotline: 888 (Toll-Free)
              </p>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 Blood Donation Management System - Federal Government of Somalia</p>
            <p className="text-sm mt-2">Ministry of Health & Human Services | All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

// Feature Card Component
function FeatureCard({ icon: Icon, title, description, color, iconColor }) {
  return (
    <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
      <div className={`${color} w-16 h-16 rounded-lg flex items-center justify-center mb-4`}>
        <Icon className={`${iconColor} w-8 h-8`} />
      </div>
      <h3 className="text-xl font-bold text-gray-800 mb-2">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </div>
  );
}

// Stat Card Component
function StatCard({ number, label }) {
  return (
    <div className="text-center">
      <div className="text-5xl font-bold mb-2">{number}</div>
      <div className="text-xl text-red-100">{label}</div>
    </div>
  );
}

// Step Card Component
function StepCard({ number, title, description, icon: Icon }) {
  return (
    <div className="bg-white rounded-xl shadow-lg p-8 text-center hover:shadow-xl transition-all duration-300">
      <div className="bg-red-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
        <span className="text-2xl font-bold text-red-600">{number}</span>
      </div>
      <div className="bg-gray-100 w-12 h-12 rounded-lg flex items-center justify-center mx-auto mb-4">
        <Icon className="w-6 h-6 text-gray-700" />
      </div>
      <h3 className="text-xl font-bold text-gray-800 mb-2">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </div>
  );
}

// Benefit Card Component
function BenefitCard({ title, benefits }) {
  return (
    <div className="bg-gradient-to-br from-white to-gray-50 rounded-xl shadow-lg p-8 hover:shadow-xl transition-all duration-300 border border-gray-200">
      <h3 className="text-2xl font-bold text-gray-800 mb-6 text-center">{title}</h3>
      <ul className="space-y-3">
        {benefits.map((benefit, index) => (
          <li key={index} className="flex items-start gap-3">
            <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
            <span className="text-gray-700">{benefit}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Home;
