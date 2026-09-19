import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X, User, Droplet } from "lucide-react";
import SobdaLogo from "./SobdaLogo.jsx";

const NAV_LINKS = [
  { to: "/", label: "Home" },
  { to: "/about", label: "About" },
  { to: "/doctors", label: "Doctors" },
  { to: "/partners", label: "Partners" },
  { to: "/contact", label: "Contact" },
];

function PublicNavbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();
  const loggedIn = Boolean(localStorage.getItem("token"));

  const isActive = (path) => location.pathname === path;

  const desktopLink = (path) =>
    `relative px-1 py-2 text-sm font-semibold transition-colors ${
      isActive(path) ? "text-brand" : "text-navy hover:text-brand"
    }`;

  const mobileLink = (path) =>
    `block rounded-lg px-4 py-3 text-sm font-semibold transition-colors ${
      isActive(path) ? "bg-soft text-brand" : "text-navy hover:bg-soft hover:text-brand"
    }`;

  return (
    <nav className="font-brand sticky top-0 z-50 border-b border-line bg-white/95 backdrop-blur-md">
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-[72px] items-center justify-between gap-6">
          {/* Brand */}
          <Link to="/" className="flex items-center gap-4" onClick={() => setIsMenuOpen(false)}>
            <SobdaLogo size="md" />
          </Link>

          {/* Desktop navigation */}
          <div className="hidden lg:flex items-center gap-8">
            {NAV_LINKS.map((link) => (
              <Link key={link.to} to={link.to} className={desktopLink(link.to)}>
                {link.label}
                {isActive(link.to) && (
                  <span className="absolute inset-x-0 -bottom-[13px] h-0.5 rounded bg-brand" />
                )}
              </Link>
            ))}
          </div>

          {/* Desktop actions */}
          <div className="hidden lg:flex items-center gap-3">
            {loggedIn ? (
              <Link
                to="/dashboard"
                className="rounded-xl bg-navy px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-navy-deep"
              >
                Dashboard
              </Link>
            ) : (
              <>
                <Link
                  to="/signin"
                  className="inline-flex items-center gap-2 rounded-xl border border-navy/40 bg-white px-5 py-2.5 text-sm font-semibold text-navy transition-colors hover:border-navy hover:bg-soft"
                >
                  <User className="h-4 w-4" />
                  Login
                </Link>
                <Link
                  to="/signup"
                  className="inline-flex items-center gap-2 rounded-xl bg-brand px-5 py-2.5 text-sm font-semibold text-white shadow-md shadow-brand/25 transition-colors hover:bg-brand-dark"
                >
                  <Droplet className="h-4 w-4" />
                  Become Donor
                </Link>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="lg:hidden rounded-lg p-2 text-navy transition-colors hover:bg-soft"
            aria-label="Toggle menu"
            aria-expanded={isMenuOpen}
          >
            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Mobile navigation */}
        {isMenuOpen && (
          <div className="lg:hidden border-t border-line py-4">
            <div className="flex flex-col gap-1">
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  className={mobileLink(link.to)}
                  onClick={() => setIsMenuOpen(false)}
                >
                  {link.label}
                </Link>
              ))}
              <div className="mt-3 grid gap-2 sm:grid-cols-2">
                {loggedIn ? (
                  <Link
                    to="/dashboard"
                    className="rounded-xl bg-navy px-4 py-3 text-center text-sm font-semibold text-white"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Go to Dashboard
                  </Link>
                ) : (
                  <>
                    <Link
                      to="/signin"
                      className="rounded-xl border border-navy/40 px-4 py-3 text-center text-sm font-semibold text-navy"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Login
                    </Link>
                    <Link
                      to="/signup"
                      className="rounded-xl bg-brand px-4 py-3 text-center text-sm font-semibold text-white"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Become Donor
                    </Link>
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}

export default PublicNavbar;
