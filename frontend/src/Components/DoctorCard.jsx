import React from "react";
import { MessageCircle } from "lucide-react";

const initialsOf = (name = "") =>
  name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0].toUpperCase())
    .join("");

function DoctorCard({ doctor }) {
  const chatUrl = doctor.whatsapp
    ? `https://wa.me/${doctor.whatsapp}?text=${encodeURIComponent(
        `Hello Dr. ${doctor.name}, I would like some guidance about blood donation eligibility.`
      )}`
    : null;

  return (
    <div className="bg-slate-50/60 border border-slate-200 rounded-2xl p-7 flex flex-col items-center text-center hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300">
      {doctor.photo ? (
        <img
          src={doctor.photo}
          alt={doctor.name}
          className="w-28 h-28 rounded-full object-cover border-2 border-white shadow-md mb-5"
        />
      ) : (
        <div className="w-28 h-28 rounded-full bg-red-100 text-red-700 flex items-center justify-center text-3xl font-black mb-5">
          {initialsOf(doctor.name)}
        </div>
      )}

      <h3 className="text-lg font-black text-slate-900">{doctor.name}</h3>
      <p className="text-sm font-semibold text-red-600 mt-0.5">{doctor.specialty}</p>
      {doctor.bio && (
        <p className="text-sm text-slate-500 mt-3 leading-relaxed line-clamp-4">{doctor.bio}</p>
      )}

      {chatUrl && (
        <a
          href={chatUrl}
          target="_blank"
          rel="noreferrer"
          className="mt-5 inline-flex items-center gap-2 text-red-700 hover:text-red-800 font-bold text-sm"
        >
          <MessageCircle className="w-4 h-4" />
          Start chat
        </a>
      )}
    </div>
  );
}

export default DoctorCard;
