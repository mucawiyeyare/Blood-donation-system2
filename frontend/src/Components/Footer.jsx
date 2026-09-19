import React from "react";
import { Link } from "react-router-dom";
import { Heart, Phone, Mail, Star } from "lucide-react";
import SobdaLogo from "./SobdaLogo.jsx";

const FOOTER_LINKS = [
  { to: "/", label: "Home" },
  { to: "/about", label: "About" },
  { to: "/doctors", label: "Doctors" },
  { to: "/partners", label: "Partners" },
  { to: "/contact", label: "Contact" },
  { to: "/signin", label: "Login" },
  { to: "/signup", label: "Become Donor" },
];

function Footer() {
  return (
    <footer className="font-brand bg-navy text-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid gap-8 lg:grid-cols-[auto_1fr_auto] lg:items-center">
          <div className="flex items-center gap-5">
            <SobdaLogo size="md" light />
            <span className="hidden sm:block h-10 w-px bg-white/20" />
            <span className="hidden sm:block text-sm text-white/70">sobda.org</span>
          </div>

          <nav className="flex flex-wrap items-center gap-x-1 gap-y-2 lg:justify-center text-sm">
            {FOOTER_LINKS.map((link, i) => (
              <React.Fragment key={link.to}>
                {i > 0 && <span className="px-2 text-white/25">|</span>}
                <Link to={link.to} className="text-white/85 transition-colors hover:text-white">
                  {link.label}
                </Link>
              </React.Fragment>
            ))}
          </nav>

          <div className="space-y-2 text-sm text-white/85">
            <a href="tel:+252616408886" className="flex items-center gap-2.5 hover:text-white">
              <Phone className="h-4 w-4 text-white/60" />
              +252 61 640 8886
            </a>
            <a href="mailto:info@sobda.org" className="flex items-center gap-2.5 hover:text-white">
              <Mail className="h-4 w-4 text-white/60" />
              info@sobda.org
            </a>
          </div>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-3 px-4 sm:px-6 lg:px-8 py-5 text-xs text-white/70 sm:flex-row">
          <p>&copy; {new Date().getFullYear()} SOBDA. All rights reserved.</p>
          <p className="hidden md:block">Together We Save Lives.</p>
          <p className="flex items-center gap-2">
            <span className="flex h-5 w-7 items-center justify-center rounded-sm bg-[#4189dd]">
              <Star className="h-3 w-3 fill-white text-white" />
            </span>
            Made in Somalia
            <Heart className="h-4 w-4 fill-white text-white" />
          </p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
