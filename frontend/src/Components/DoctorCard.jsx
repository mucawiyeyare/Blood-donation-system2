import React from "react";
import { MessageCircle } from "lucide-react";

const initialsOf = (name = "") =>
  name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0].toUpperCase())
    .join("");

// Doctor "poster" card: portrait on top, then name, specialty and a short focus line.
function DoctorCard({ doctor }) {
  // Show "Dr." once, whether or not it was typed into the name.
  const displayName = /^dr\.?\s/i.test(doctor.name) ? doctor.name : `Dr. ${doctor.name}`;
  const chatUrl = doctor.whatsapp
    ? `https://wa.me/${doctor.whatsapp}?text=${encodeURIComponent(
        `Hello ${displayName}, I would like some guidance about blood donation eligibility.`
      )}`
    : null;

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
      {chatUrl && (
        <a
          href={chatUrl}
          target="_blank"
          rel="noreferrer"
          className="mt-auto inline-flex items-center gap-1.5 pt-3 text-sm font-semibold text-brand hover:text-brand-dark"
        >
          <MessageCircle className="h-4 w-4" />
          Start chat
        </a>
      )}
    </div>
  );
}

export default DoctorCard;
