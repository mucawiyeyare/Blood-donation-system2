import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X } from "lucide-react";
import DhiigKaalLogo from "./DhiigKaalLogo.jsx";
import LanguageSwitcher from "./LanguageSwitcher.jsx";
import { useTranslation } from "../context/LanguageContext.jsx";

function PublicNavbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();
  const { t } = useTranslation();

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const isActive = (path) => {
    return location.pathname === path;
  };

  const navLinkClass = (path) => {
    const baseClass = "px-4 py-2 rounded-lg font-medium transition-all duration-200 text-sm tracking-wide";
    return isActive(path)
      ? `${baseClass} bg-red-600 text-white shadow-md font-semibold`
      : `${baseClass} text-gray-700 hover:bg-red-50 hover:text-red-600`;
  };

  const mobileNavLinkClass = (path) => {
    const baseClass = "block px-4 py-3 rounded-lg font-medium transition-all duration-200 text-sm";
    return isActive(path)
      ? `${baseClass} bg-red-600 text-white font-semibold`
      : `${baseClass} text-gray-700 hover:bg-red-50 hover:text-red-600`;
  };

  return (
    <nav className="bg-white/95 backdrop-blur-md shadow-sm sticky top-0 z-50 border-b border-gray-100">
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* DHIIG KAAL Brand Logo */}
          <Link to="/" className="flex items-center group transition-transform hover:scale-105">
            <DhiigKaalLogo size="md" />
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-2">
            <Link to="/" className={navLinkClass("/")}>
              {t("nav.home", "Home")}
            </Link>
            <Link to="/about" className={navLinkClass("/about")}>
              {t("nav.about", "About")}
            </Link>
            <Link to="/contact" className={navLinkClass("/contact")}>
              {t("nav.contact", "Contact")}
            </Link>

            {/* Language Switcher */}
            <LanguageSwitcher />

            {localStorage.getItem("token") ? (
              <Link
                to="/dashboard"
                className="bg-gradient-to-r from-slate-900 to-slate-800 text-white px-5 py-2.5 rounded-lg font-semibold hover:from-black hover:to-slate-900 transition-all duration-200 shadow-md hover:shadow-lg ml-2 text-sm"
              >
                {t("nav.dashboard", "Dashboard")}
              </Link>
            ) : (
              <>
                <Link to="/signin" className={navLinkClass("/signin")}>
                  {t("nav.signIn", "Sign In")}
                </Link>
                <Link
                  to="/signup"
                  className="bg-gradient-to-r from-red-600 to-red-700 text-white px-5 py-2.5 rounded-lg font-semibold hover:from-red-700 hover:to-red-800 transition-all duration-200 shadow-md hover:shadow-lg ml-2 text-sm"
                >
                  {t("nav.registerDonor", "Become a Donor")}
                </Link>
              </>
            )}
          </div>

          {/* Mobile Right Bar (Language + Menu Button) */}
          <div className="flex items-center gap-2 md:hidden">
            <LanguageSwitcher variant="dropdown" />
            <button
              onClick={toggleMenu}
              className="p-2 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors"
              aria-label="Toggle menu"
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6 text-red-600" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation (No Icons) */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-100 bg-white">
            <div className="flex flex-col space-y-2">
              <Link
                to="/"
                className={mobileNavLinkClass("/")}
                onClick={() => setIsMenuOpen(false)}
              >
                Home
              </Link>
              <Link
                to="/about"
                className={mobileNavLinkClass("/about")}
                onClick={() => setIsMenuOpen(false)}
              >
                About
              </Link>
              <Link
                to="/#eligibility"
                className="block px-4 py-3 rounded-lg font-medium transition-all duration-200 text-sm text-gray-700 hover:bg-red-50 hover:text-red-600"
                onClick={() => setIsMenuOpen(false)}
              >
                Eligibility
              </Link>
              <Link
                to="/#faq"
                className="block px-4 py-3 rounded-lg font-medium transition-all duration-200 text-sm text-gray-700 hover:bg-red-50 hover:text-red-600"
                onClick={() => setIsMenuOpen(false)}
              >
                FAQ
              </Link>
              <Link
                to="/contact"
                className={mobileNavLinkClass("/contact")}
                onClick={() => setIsMenuOpen(false)}
              >
                Contact
              </Link>
              {localStorage.getItem("token") ? (
                <Link
                  to="/dashboard"
                  className="block text-center bg-slate-900 text-white px-4 py-3 rounded-lg font-semibold hover:bg-black transition-all duration-200 text-sm mt-2"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Go to Dashboard
                </Link>
              ) : (
                <>
                  <Link
                    to="/signin"
                    className={mobileNavLinkClass("/signin")}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Sign In
                  </Link>
                  <Link
                    to="/signup"
                    className="block text-center bg-red-600 text-white px-4 py-3 rounded-lg font-semibold hover:bg-red-700 transition-all duration-200 text-sm mt-2"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Become a Donor
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}

export default PublicNavbar;
