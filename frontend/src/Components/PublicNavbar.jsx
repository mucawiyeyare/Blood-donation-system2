import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Droplet, Menu, X, Home, Info, LogIn, UserPlus, Phone } from "lucide-react";

function PublicNavbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const isActive = (path) => {
    return location.pathname === path;
  };

  const navLinkClass = (path) => {
    const baseClass = "flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all duration-200";
    return isActive(path)
      ? `${baseClass} bg-red-600 text-white shadow-lg`
      : `${baseClass} text-gray-700 hover:bg-red-50 hover:text-red-600`;
  };

  const mobileNavLinkClass = (path) => {
    const baseClass = "flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-all duration-200";
    return isActive(path)
      ? `${baseClass} bg-red-600 text-white`
      : `${baseClass} text-gray-700 hover:bg-red-50 hover:text-red-600`;
  };

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="w-full px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <div className="bg-red-600 p-2 rounded-lg group-hover:bg-red-700 transition-colors">
              <Droplet className="w-6 h-6 text-white" />
            </div>
            <div>
              <span className="text-xl font-bold text-gray-800">BDMS</span>
              <p className="text-xs text-gray-500 hidden sm:block">Blood Donation System</p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-2">
            <Link to="/" className={navLinkClass("/")}>
              <Home className="w-4 h-4" />
              <span>Home</span>
            </Link>
            <Link to="/about" className={navLinkClass("/about")}>
              <Info className="w-4 h-4" />
              <span>About</span>
            </Link>
            <Link to="/contact" className={navLinkClass("/contact")}>
              <Phone className="w-4 h-4" />
              <span>Contact</span>
            </Link>
            <Link to="/signin" className={navLinkClass("/signin")}>
              <LogIn className="w-4 h-4" />
              <span>Sign In</span>
            </Link>
            <Link
              to="/signup"
              className="flex items-center gap-2 bg-red-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-red-700 transition-all duration-200 shadow-md hover:shadow-lg ml-2"
            >
              <UserPlus className="w-4 h-4" />
              <span>Sign Up</span>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={toggleMenu}
            className="md:hidden p-2 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors"
            aria-label="Toggle menu"
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-200">
            <div className="flex flex-col space-y-2">
              <Link
                to="/"
                className={mobileNavLinkClass("/")}
                onClick={() => setIsMenuOpen(false)}
              >
                <Home className="w-5 h-5" />
                <span>Home</span>
              </Link>
              <Link
                to="/about"
                className={mobileNavLinkClass("/about")}
                onClick={() => setIsMenuOpen(false)}
              >
                <Info className="w-5 h-5" />
                <span>About</span>
              </Link>
              <Link
                to="/contact"
                className={mobileNavLinkClass("/contact")}
                onClick={() => setIsMenuOpen(false)}
              >
                <Phone className="w-5 h-5" />
                <span>Contact</span>
              </Link>
              <Link
                to="/signin"
                className={mobileNavLinkClass("/signin")}
                onClick={() => setIsMenuOpen(false)}
              >
                <LogIn className="w-5 h-5" />
                <span>Sign In</span>
              </Link>
              <Link
                to="/signup"
                className="flex items-center gap-3 bg-red-600 text-white px-4 py-3 rounded-lg font-medium hover:bg-red-700 transition-all duration-200"
                onClick={() => setIsMenuOpen(false)}
              >
                <UserPlus className="w-5 h-5" />
                <span>Sign Up</span>
              </Link>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}

export default PublicNavbar;
