import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import PartnerLogo from "./PartnerLogo.jsx";

// Up to this many logos sit in a centered row; beyond it the strip auto-scrolls.
const STATIC_LIMIT = 5;

function PartnersMarquee() {
  const [partners, setPartners] = useState([]);

  useEffect(() => {
    axios
      .get("/api/partners")
      .then((res) => setPartners(res.data || []))
      .catch(() => {});
  }, []);

  if (partners.length === 0) return null;

  const scrolling = partners.length > STATIC_LIMIT;
  // Duplicate the list so the CSS animation can loop seamlessly from -50%.
  const track = [...partners, ...partners];

  return (
    <section id="partners" className="py-16 sm:py-20 bg-slate-50 border-b border-slate-100 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between gap-4 mb-10">
          <div>
            <h2 className="text-3xl sm:text-4xl font-black text-slate-900">Our Partners</h2>
            <p className="text-slate-600 mt-2">Hospitals and institutions working with SOBDA.</p>
          </div>
          <Link to="/partners" className="text-red-700 hover:text-red-800 font-bold whitespace-nowrap">
            View all
          </Link>
        </div>

        {!scrolling && (
          <div className="flex flex-wrap justify-center gap-x-10 gap-y-8">
            {partners.map((partner) => (
              <PartnerLogo key={partner._id} partner={partner} />
            ))}
          </div>
        )}
      </div>

      {scrolling && (
        <div className="partners-marquee-mask relative">
          <div className="partners-marquee-track flex items-start gap-10 w-max">
            {track.map((partner, index) => (
              <PartnerLogo key={`${partner._id}-${index}`} partner={partner} />
            ))}
          </div>
        </div>
      )}

      <style>{`
        .partners-marquee-mask {
          -webkit-mask-image: linear-gradient(to right, transparent, black 8%, black 92%, transparent);
          mask-image: linear-gradient(to right, transparent, black 8%, black 92%, transparent);
        }
        .partners-marquee-track {
          animation: partners-scroll 35s linear infinite;
        }
        .partners-marquee-track:hover {
          animation-play-state: paused;
        }
        @keyframes partners-scroll {
          from { transform: translateX(0); }
          to { transform: translateX(-50%); }
        }
      `}</style>
    </section>
  );
}

export default PartnersMarquee;
