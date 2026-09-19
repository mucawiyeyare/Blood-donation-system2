import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { Handshake, ArrowRight } from "lucide-react";
import PartnerLogo from "./PartnerLogo.jsx";

// Up to this many cards sit in a centered row; beyond it the strip auto-scrolls.
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
    <section id="partners" className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="overflow-hidden rounded-3xl border border-line bg-white p-5 shadow-sm sm:p-7">
        <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div className="flex items-start gap-3">
            <div className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-xl bg-soft text-navy">
              <Handshake className="h-6 w-6" />
            </div>
            <div>
              <h2 className="text-xl font-extrabold text-navy">Our Partners</h2>
              <p className="mt-1 max-w-2xl text-sm text-slate-600">
                We work closely with trusted organizations and institutions to make our mission possible.
              </p>
            </div>
          </div>
          <Link
            to="/partners"
            className="inline-flex items-center gap-1.5 whitespace-nowrap text-sm font-semibold text-navy hover:text-brand"
          >
            View all <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        {!scrolling && (
          <div className="flex flex-wrap justify-center gap-4">
            {partners.map((partner) => (
              <PartnerLogo key={partner._id} partner={partner} />
            ))}
          </div>
        )}

        {scrolling && (
          <div className="partners-marquee-mask relative -mx-5 sm:-mx-7">
            <div className="partners-marquee-track flex w-max items-stretch gap-4 px-5">
              {track.map((partner, index) => (
                <PartnerLogo key={`${partner._id}-${index}`} partner={partner} />
              ))}
            </div>
          </div>
        )}
      </div>

      <style>{`
        .partners-marquee-mask {
          -webkit-mask-image: linear-gradient(to right, transparent, black 6%, black 94%, transparent);
          mask-image: linear-gradient(to right, transparent, black 6%, black 94%, transparent);
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
