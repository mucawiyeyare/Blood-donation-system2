import React, { useEffect, useState } from "react";
import axios from "axios";
import { Handshake } from "lucide-react";
import PartnerLogo from "../Components/PartnerLogo.jsx";

function Partners() {
  const [partners, setPartners] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios
      .get("/api/partners")
      .then((res) => setPartners(res.data || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="min-h-[70vh] bg-white">
      <div className="bg-gradient-to-br from-slate-900 via-red-950 to-slate-900 text-white py-14 sm:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 border border-white/20 text-sky-300 text-xs font-semibold mb-4">
            <Handshake className="w-4 h-4" />
            <span>Our Partners</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-black mb-3">Working together to save lives</h1>
          <p className="text-slate-300 max-w-2xl mx-auto">
            Hospitals and institutions working with SOBDA. Select a partner to visit their website.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-14">
        {loading ? (
          <p className="text-center text-slate-400 text-sm py-12">Loading partners...</p>
        ) : partners.length === 0 ? (
          <p className="text-center text-slate-400 text-sm py-12">No partners are listed yet. Please check back soon.</p>
        ) : (
          <div className="flex flex-wrap justify-center gap-x-10 gap-y-10">
            {partners.map((partner) => (
              <PartnerLogo key={partner._id} partner={partner} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Partners;
