import React, { useState } from "react";
import { MessageCircle } from "lucide-react";
import AskDoctorModal from "./AskDoctorModal.jsx";
import { doctorDisplayName, initialsOf } from "../utils/doctorName.js";

// Doctor "poster" card: portrait on top, then name, specialty and a short focus line.
// "Start chat" opens the in-app Ask Doctor box (questions never go to WhatsApp).
function DoctorCard({ doctor }) {
  const [asking, setAsking] = useState(false);
  const displayName = doctorDisplayName(doctor.name);

  return (
    <div className="flex h-full flex-col rounded-2xl border border-line bg-white p-4 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md">
      {doctor.photo ? (
        <img
          src={doctor.photo}
          alt={displayName}
          className="h-28 w-24 flex-shrink-0 rounded-xl bg-soft object-cover"
        />
      ) : (
        <div className="flex h-28 w-24 flex-shrink-0 items-center justify-center rounded-xl bg-soft text-3xl font-extrabold text-navy">
          {initialsOf(doctor.name)}
        </div>
      )}

      <h3 className="mt-4 text-[15px] font-bold leading-snug text-navy">{displayName}</h3>
      <p className="mt-0.5 text-sm text-slate-600">{doctor.specialty}</p>
      {doctor.bio && (
        <p className="mt-2 line-clamp-2 text-xs leading-relaxed text-navy/70">{doctor.bio}</p>
      )}
      {doctor.canChat && (
        <button
          type="button"
          onClick={() => setAsking(true)}
          className="mt-auto inline-flex items-center gap-1.5 pt-3 text-sm font-semibold text-brand hover:text-brand-dark"
        >
          <MessageCircle className="h-4 w-4" />
          Start chat
        </button>
      )}

      {asking && <AskDoctorModal doctor={doctor} onClose={() => setAsking(false)} />}
    </div>
  );
}

export default DoctorCard;
