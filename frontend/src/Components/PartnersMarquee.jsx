import React, { useEffect, useState } from "react";
import axios from "axios";
import { Handshake } from "lucide-react";

function PartnersMarquee() {
  const [partners, setPartners] = useState([]);

  useEffect(() => {
    axios
      .get("/api/partners")
      .then((res) => setPartners(res.data || []))
      .catch(() => {});
  }, []);

  if (partners.length === 0) return null;

  // Duplicate the list so the CSS animation can loop seamlessly from -50%.
  const track = [...partners, ...partners];

  return (
    <section className="py-16 bg-white border-b border-slate-100 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center mb-10">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-red-100 text-red-700 text-xs font-bold uppercase tracking-wider mb-3">
          <Handshake className="w-4 h-4 text-red-600" />
          <span>Our Partners</span>
        </div>
        <h2 className="text-3xl sm:text-4xl font-black text-slate-800 mb-3">
          Trusted by National & International Partners
        </h2>
        <p className="text-slate-600 text-sm max-w-xl mx-auto">
          Organizations and institutions supporting DHIIG KAAL's mission across Somalia.
        </p>
      </div>

      <div className="partners-marquee-mask relative">
        <div className="partners-marquee-track flex items-center gap-10 w-max">
          {track.map((partner, index) => (
            <a
              key={`${partner._id}-${index}`}
              href={partner.websiteUrl}
              target="_blank"
              rel="noreferrer"
              title={partner.name}
              className="flex-shrink-0 w-20 h-20 rounded-full bg-white border border-slate-200 shadow-sm flex items-center justify-center overflow-hidden hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
            >
              <img
                src={partner.logo}
                alt={partner.name}
                className="w-full h-full object-cover"
              />
            </a>
          ))}
        </div>
      </div>

      <style>{`
        .partners-marquee-mask {
          -webkit-mask-image: linear-gradient(to right, transparent, black 8%, black 92%, transparent);
          mask-image: linear-gradient(to right, transparent, black 8%, black 92%, transparent);
        }
        .partners-marquee-track {
          animation: partners-scroll 30s linear infinite;
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
