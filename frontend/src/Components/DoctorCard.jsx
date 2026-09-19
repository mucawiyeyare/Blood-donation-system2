import React, { useState } from "react";
import { MessageCircle, ArrowRight } from "lucide-react";
import AskDoctorModal from "./AskDoctorModal.jsx";
import DoctorProfileModal from "./DoctorProfileModal.jsx";
import { doctorDisplayName, initialsOf } from "../utils/doctorName.js";
import { accentFor, SOCIAL_LINKS, safeUrl } from "../utils/doctorStyle.js";

// Doctor card: portrait + specialty badge + name, then highlights, social links and an action button.
// `preview` (used in the admin dashboard) shows the same card without opening pop-ups;
// `adminActions` are the edit / hide / delete buttons the dashboard overlays on the card.
function DoctorCard({ doctor, preview = false, adminActions = null, dimmed = false }) {
  const [asking, setAsking] = useState(false);
  const [viewing, setViewing] = useState(false);

  const displayName = doctorDisplayName(doctor.name);
  const accent = accentFor(doctor._id);
  const { BadgeIcon } = accent;
  const highlights = (doctor.highlights || []).filter(Boolean).slice(0, 3);
  const socials = SOCIAL_LINKS.map((s) => ({ ...s, url: safeUrl(doctor.socials?.[s.key]) })).filter((s) => s.url);

  const openProfile = () => !preview && setViewing(true);

  return (
    <article
      className={`relative flex h-full flex-col rounded-3xl border border-line/60 bg-white p-5 shadow-[0_12px_40px_-18px_rgba(15,60,140,0.3)] transition-shadow duration-300 hover:shadow-[0_18px_50px_-18px_rgba(15,60,140,0.4)] sm:p-6 ${
        dimmed ? "opacity-50" : ""
      }`}
    >
      {adminActions && (
        <div className="absolute right-3 top-3 z-10 flex gap-0.5 rounded-xl border border-line bg-white/95 p-1 shadow-sm">
          {adminActions}
        </div>
      )}

      <div className="flex gap-4 sm:gap-5">
        <button
          type="button"
          onClick={openProfile}
          aria-label={`View ${displayName}'s profile`}
          className={`relative flex-shrink-0 ${preview ? "cursor-default" : ""}`}
        >
          <span className={`absolute -inset-1.5 rounded-[2rem] bg-gradient-to-br ${accent.blob}`} />
          {doctor.photo ? (
            <img
              src={doctor.photo}
              alt={displayName}
              className="relative h-32 w-28 rounded-[1.6rem] bg-soft object-cover sm:h-44 sm:w-36"
            />
          ) : (
            <span className="relative flex h-32 w-28 items-center justify-center rounded-[1.6rem] bg-soft text-4xl font-extrabold text-navy sm:h-44 sm:w-36">
              {initialsOf(doctor.name)}
            </span>
          )}
        </button>

        <div className="min-w-0 flex-1 pt-1">
          <span className={`inline-flex max-w-full items-center gap-2 rounded-full px-3 py-1.5 text-xs font-semibold sm:text-sm ${accent.badge}`}>
            <BadgeIcon className="h-4 w-4 flex-shrink-0" />
            <span className="truncate">{doctor.specialty}</span>
          </span>
          <h3 className="mt-3 break-words text-xl font-extrabold leading-tight text-navy sm:text-2xl">{displayName}</h3>
          {doctor.title && <p className="mt-1 text-sm text-slate-500 sm:text-base">{doctor.title}</p>}
          {doctor.bio && (
            <p className="mt-2 hidden line-clamp-4 text-sm leading-relaxed text-slate-500 sm:block">{doctor.bio}</p>
          )}
        </div>
      </div>

      {doctor.bio && <p className="mt-4 line-clamp-4 text-sm leading-relaxed text-slate-500 sm:hidden">{doctor.bio}</p>}

      {highlights.length > 0 && (
        <ul className="mt-4 space-y-2.5 border-t border-line pt-4">
          {highlights.map((text, i) => {
            const Icon = accent.icons[i % accent.icons.length];
            return (
              <li key={i} className="flex items-center gap-3 text-sm text-slate-600">
                <Icon className={`h-5 w-5 flex-shrink-0 ${accent.icon}`} />
                <span className="min-w-0 break-words">{text}</span>
              </li>
            );
          })}
        </ul>
      )}

      <div className="mt-auto flex items-center justify-between gap-3 pt-5">
        <div className="flex items-center gap-2">
          {socials.map(({ key, label, Icon, url }) => (
            <a
              key={key}
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`${displayName} on ${label}`}
              className={`flex h-9 w-9 items-center justify-center rounded-full transition-colors ${accent.social}`}
            >
              <Icon className="h-4 w-4" />
            </a>
          ))}
        </div>

        {doctor.canChat ? (
          <button
            type="button"
            onClick={() => !preview && setAsking(true)}
            className="inline-flex items-center gap-2 rounded-full bg-navy px-5 py-2.5 text-sm font-semibold text-white shadow-md shadow-navy/25 transition-colors hover:bg-navy-deep"
          >
            <MessageCircle className="h-4 w-4" />
            Start Chat
          </button>
        ) : (
          <button
            type="button"
            onClick={openProfile}
            className="inline-flex items-center gap-2 rounded-full bg-navy px-5 py-2.5 text-sm font-semibold text-white shadow-md shadow-navy/25 transition-colors hover:bg-navy-deep"
          >
            View Profile <ArrowRight className="h-4 w-4" />
          </button>
        )}
      </div>

      {viewing && (
        <DoctorProfileModal
          doctor={doctor}
          onClose={() => setViewing(false)}
          onAsk={() => {
            setViewing(false);
            setAsking(true);
          }}
        />
      )}
      {asking && <AskDoctorModal doctor={doctor} onClose={() => setAsking(false)} />}
    </article>
  );
}

export default DoctorCard;
