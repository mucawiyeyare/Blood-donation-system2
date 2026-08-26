import React, { useState } from "react";
import axios from "axios";
import { 
  Phone, Mail, MapPin, Clock, Building2, Send, 
  AlertCircle, CheckCircle, Users, Heart, Activity, 
  Headphones, FileText, HelpCircle, Shield
} from "lucide-react";

function Contact() {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    subject: "",
    message: ""
  });
  const [formStatus, setFormStatus] = useState(null); // 'success', 'error', or null

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("/api/contact", formData);
      setFormStatus('success');
      setFormData({
        fullName: "",
        email: "",
        phone: "",
        subject: "",
        message: ""
      });
      setTimeout(() => setFormStatus(null), 5000);
    } catch (error) {
      console.error("Error sending message:", error);
      setFormStatus('error');
      setTimeout(() => setFormStatus(null), 5000);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-red-600 to-red-700 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="flex justify-center mb-4">
              <div className="bg-white/20 backdrop-blur-sm p-4 rounded-full">
                <Phone className="w-12 h-12 text-white" />
              </div>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Contact Us</h1>
            <p className="text-xl text-red-100 max-w-2xl mx-auto">
              Blood Donation Management System - Ministry of Health, Federal Government of Somalia
            </p>
            <p className="text-lg text-red-100 mt-2">
              We're here to help you save lives. Reach out to us anytime.
            </p>
          </div>
        </div>
      </section>

      {/* Emergency Hotline Banner */}
      <section className="bg-blue-900 text-white py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-center gap-4 text-center md:text-left">
            <div className="flex items-center gap-3">
              <div className="bg-red-600 p-3 rounded-full animate-pulse">
                <Phone className="w-6 h-6" />
              </div>
              <div>
                <p className="text-sm text-blue-200">24/7 Emergency Hotline</p>
                <p className="text-2xl font-bold">888 (Toll-Free)</p>
              </div>
            </div>
            <div className="hidden md:block w-px h-12 bg-blue-700"></div>
            <div className="flex items-center gap-3">
              <AlertCircle className="w-6 h-6 text-yellow-400" />
              <p className="text-lg">For urgent blood requirements, call immediately</p>
            </div>
          </div>
        </div>
      </section>

      {/* Main Contact Information */}
      <section className="py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <ContactInfoCard
            icon={Building2}
            title="Main Office"
            lines={[
              "Ministry of Health",
              "Mogadishu, Somalia",
              "Blood Donation Division"
            ]}
            bgColor="bg-blue-50"
            iconColor="text-blue-600"
          />
          <ContactInfoCard
            icon={Phone}
            title="Phone Numbers"
            lines={[
              "General: +252 61 XXX XXXX",
              "Emergency: 888 (Toll-Free)",
              "Mon-Fri: 8:00 AM - 5:00 PM"
            ]}
            bgColor="bg-red-50"
            iconColor="text-red-600"
          />
          <ContactInfoCard
            icon={Mail}
            title="Email Addresses"
            lines={[
              "info@bdms.gov.so",
              "support@bdms.gov.so",
              "Response within 24 hours"
            ]}
            bgColor="bg-green-50"
            iconColor="text-green-600"
          />
          <ContactInfoCard
            icon={Clock}
            title="Working Hours"
            lines={[
              "Monday - Friday",
              "8:00 AM - 5:00 PM",
              "Emergency: 24/7"
            ]}
            bgColor="bg-purple-50"
            iconColor="text-purple-600"
          />
        </div>
      </section>

      {/* Department Directory */}
      <section className="py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold text-gray-800 mb-3">Department Directory</h2>
          <p className="text-lg text-gray-600">Contact specific departments for specialized assistance</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <DepartmentCard
            icon={Heart}
            title="Blood Bank Operations"
            description="Blood inventory, storage, and distribution"
            email="bloodbank@bdms.gov.so"
            phone="+252 61 XXX 1001"
          />
          <DepartmentCard
            icon={Users}
            title="Donor Services"
            description="Donor registration, scheduling, and support"
            email="donors@bdms.gov.so"
            phone="+252 61 XXX 1002"
          />
          <DepartmentCard
            icon={Activity}
            title="Hospital Relations"
            description="Hospital partnerships and blood requests"
            email="hospitals@bdms.gov.so"
            phone="+252 61 XXX 1003"
          />
          <DepartmentCard
            icon={Headphones}
            title="Technical Support"
            description="System access, account issues, and IT help"
            email="support@bdms.gov.so"
            phone="+252 61 XXX 1004"
          />
        </div>
      </section>

      {/* Contact Form Section */}
      <section className="py-12 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
        <div className="bg-white rounded-xl shadow-lg p-8 md:p-10">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-800 mb-3">Send Us a Message</h2>
            <p className="text-gray-600">Fill out the form below and we'll get back to you within 24 hours</p>
          </div>

          {formStatus === 'success' && (
            <div className="mb-6 bg-green-50 border border-green-200 rounded-lg p-4 flex items-center gap-3">
              <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
              <p className="text-green-800">Thank you! Your message has been sent successfully. We'll contact you soon.</p>
            </div>
          )}

          {formStatus === 'error' && (
            <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4 flex items-center gap-3">
              <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
              <p className="text-red-800">Something went wrong. Please try again later.</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="fullName" className="block text-sm font-semibold text-gray-700 mb-2">
                  Full Name <span className="text-red-600">*</span>
                </label>
                <input
                  type="text"
                  id="fullName"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors"
                  placeholder="Enter your full name"
                />
              </div>
              <div>
                <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2">
                  Email Address <span className="text-red-600">*</span>
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors"
                  placeholder="your.email@example.com"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="phone" className="block text-sm font-semibold text-gray-700 mb-2">
                  Phone Number
                </label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors"
                  placeholder="+252 XX XXX XXXX"
                />
              </div>
              <div>
                <label htmlFor="subject" className="block text-sm font-semibold text-gray-700 mb-2">
                  Subject <span className="text-red-600">*</span>
                </label>
                <select
                  id="subject"
                  name="subject"
                  value={formData.subject}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors"
                >
                  <option value="">Select a subject</option>
                  <option value="donor">Donor Registration</option>
                  <option value="hospital">Hospital Partnership</option>
                  <option value="emergency">Emergency Blood Request</option>
                  <option value="technical">Technical Support</option>
                  <option value="feedback">Feedback</option>
                  <option value="other">Other</option>
                </select>
              </div>
            </div>

            <div>
              <label htmlFor="message" className="block text-sm font-semibold text-gray-700 mb-2">
                Message <span className="text-red-600">*</span>
              </label>
              <textarea
                id="message"
                name="message"
                value={formData.message}
                onChange={handleInputChange}
                required
                rows="6"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors resize-none"
                placeholder="Please provide details about your inquiry..."
              ></textarea>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 flex items-start gap-3">
              <Shield className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-blue-800">
                <strong>Privacy Notice:</strong> Your information is protected and will only be used to respond to your inquiry. 
                We comply with government data protection standards.
              </p>
            </div>

            <button
              type="submit"
              className="w-full bg-red-600 text-white px-8 py-4 rounded-lg font-bold text-lg hover:bg-red-700 transition-all duration-200 shadow-md hover:shadow-lg flex items-center justify-center gap-2"
            >
              <Send className="w-5 h-5" />
              Send Message
            </button>
          </form>
        </div>
      </section>

      {/* Quick Links Section */}
      <section className="py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold text-gray-800 mb-3">Quick Links</h2>
          <p className="text-lg text-gray-600">Find answers and resources</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <QuickLinkCard
            icon={HelpCircle}
            title="FAQs"
            description="Common questions answered"
            link="#"
          />
          <QuickLinkCard
            icon={AlertCircle}
            title="Emergency Procedures"
            description="Urgent blood request guide"
            link="#"
          />
          <QuickLinkCard
            icon={FileText}
            title="Feedback Form"
            description="Share your experience"
            link="#"
          />
          <QuickLinkCard
            icon={Phone}
            title="Report an Issue"
            description="Technical problems or concerns"
            link="#"
          />
        </div>
      </section>

      {/* Location Section */}
      <section className="py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-2">
            <div className="p-8 md:p-10">
              <h2 className="text-3xl font-bold text-gray-800 mb-4">Visit Our Office</h2>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <MapPin className="w-6 h-6 text-red-600 flex-shrink-0 mt-1" />
                  <div>
                    <p className="font-semibold text-gray-800">Ministry of Health</p>
                    <p className="text-gray-600">Blood Donation Management Division</p>
                    <p className="text-gray-600">Mogadishu, Somalia</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Clock className="w-6 h-6 text-red-600 flex-shrink-0 mt-1" />
                  <div>
                    <p className="font-semibold text-gray-800">Office Hours</p>
                    <p className="text-gray-600">Monday - Friday: 8:00 AM - 5:00 PM</p>
                    <p className="text-gray-600">Saturday: 9:00 AM - 1:00 PM</p>
                    <p className="text-gray-600">Sunday: Closed (Emergency line available)</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Phone className="w-6 h-6 text-red-600 flex-shrink-0 mt-1" />
                  <div>
                    <p className="font-semibold text-gray-800">Contact Numbers</p>
                    <p className="text-gray-600">Main: +252 61 XXX XXXX</p>
                    <p className="text-gray-600">Emergency: 888 (24/7 Toll-Free)</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="bg-gradient-to-br from-red-100 to-blue-100 p-8 md:p-10 flex items-center justify-center">
              <div className="text-center">
                <MapPin className="w-24 h-24 text-red-600 mx-auto mb-4" />
                <p className="text-lg font-semibold text-gray-800 mb-2">Location Map</p>
                <p className="text-gray-600">Ministry of Health Building</p>
                <p className="text-gray-600">Mogadishu, Somalia</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

// Contact Info Card Component
function ContactInfoCard({ icon: Icon, title, lines, bgColor, iconColor }) {
  return (
    <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
      <div className={`${bgColor} w-14 h-14 rounded-lg flex items-center justify-center mb-4`}>
        <Icon className={`${iconColor} w-7 h-7`} />
      </div>
      <h3 className="text-lg font-bold text-gray-800 mb-3">{title}</h3>
      <div className="space-y-1">
        {lines.map((line, index) => (
          <p key={index} className="text-gray-600 text-sm">{line}</p>
        ))}
      </div>
    </div>
  );
}

// Department Card Component
function DepartmentCard({ icon: Icon, title, description, email, phone }) {
  return (
    <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-all duration-300 border border-gray-200">
      <div className="flex items-start gap-4">
        <div className="bg-red-100 p-3 rounded-lg flex-shrink-0">
          <Icon className="w-6 h-6 text-red-600" />
        </div>
        <div className="flex-1">
          <h3 className="text-xl font-bold text-gray-800 mb-2">{title}</h3>
          <p className="text-gray-600 mb-4">{description}</p>
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm">
              <Mail className="w-4 h-4 text-gray-500" />
              <a href={`mailto:${email}`} className="text-red-600 hover:text-red-700 hover:underline">
                {email}
              </a>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Phone className="w-4 h-4 text-gray-500" />
              <a href={`tel:${phone}`} className="text-gray-700 hover:text-red-600">
                {phone}
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Quick Link Card Component
function QuickLinkCard({ icon: Icon, title, description, link }) {
  return (
    <a
      href={link}
      className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-all duration-300 hover:border-red-600 border-2 border-transparent group"
    >
      <div className="bg-gray-100 w-12 h-12 rounded-lg flex items-center justify-center mb-4 group-hover:bg-red-100 transition-colors">
        <Icon className="w-6 h-6 text-gray-700 group-hover:text-red-600 transition-colors" />
      </div>
      <h3 className="text-lg font-bold text-gray-800 mb-2 group-hover:text-red-600 transition-colors">{title}</h3>
      <p className="text-gray-600 text-sm">{description}</p>
    </a>
  );
}

export default Contact;
