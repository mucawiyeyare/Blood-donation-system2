import React, { useState } from "react";
import { Trophy, Droplet, Heart, Sparkles } from "lucide-react";

// Rank styling for the top 3 slots: medal, label and a small accent colour, echoing gold/silver/bronze.
const RANKS = [
  { medal: "🥇", label: "1st Place", badge: "bg-amber-50 text-amber-700 border border-amber-200", icon: "text-amber-500" },
  { medal: "🥈", label: "2nd Place", badge: "bg-slate-100 text-slate-600 border border-slate-200", icon: "text-slate-400" },
  { medal: "🥉", label: "3rd Place", badge: "bg-orange-50 text-orange-700 border border-orange-200", icon: "text-orange-500" },
];

const QUOTES = [
  "You're a true hero! Keep saving lives! 🏆",
  "You're a true hero! ⭐",
  "Fantastic effort! 💪",
];

// "Our Blood Heroes": the public top-3 donors leaderboard, built with the same card structure as
// the doctor cards (photo, badge, name/subtitle, a highlights list, then a footer line).
export default function HeroesSection({ leaderboard }) {
  const [lightboxImage, setLightboxImage] = useState(null); // { src, name }

  return (
    <>
      {/* ─── Lightbox overlay ─── */}
      {lightboxImage && (
        <div
          className="fixed inset-0 z-[999] bg-black/80 flex items-center justify-center p-4 backdrop-blur-sm"
          onClick={() => setLightboxImage(null)}
        >
          <div className="relative max-w-sm w-full" onClick={(e) => e.stopPropagation()}>
            <button
              onClick={() => setLightboxImage(null)}
              className="absolute -top-4 -right-4 w-9 h-9 bg-white rounded-full flex items-center justify-center text-slate-700 hover:bg-red-50 hover:text-red-600 shadow-lg text-xl font-bold z-10"
            >
              ×
            </button>
            <div className="rounded-2xl overflow-hidden shadow-2xl border-4 border-white">
              <img src={lightboxImage.src} alt={lightboxImage.name} className="w-full h-auto object-cover" />
            </div>
            <p className="text-white text-center mt-3 font-bold text-lg tracking-wide drop-shadow">{lightboxImage.name}</p>
          </div>
        </div>
      )}

      {/* Top 3 Donors Leaderboard */}
      <section className="py-20 bg-white border-t border-line">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-soft border border-line text-navy text-xs font-bold mb-4 shadow-sm">
            <Trophy className="w-4 h-4 text-amber-500" />
            <span>Hall of Heroes — Top Donors</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-black text-slate-900 mb-3">Our Blood Heroes 🏆</h2>
          <p className="text-slate-600 text-sm max-w-xl mx-auto mb-12">
            These amazing donors have saved the most lives on SOBDA. Keep going!
          </p>

          {leaderboard.length === 0 ? (
            <p className="text-slate-400 text-sm py-4">Be the first hero — donate blood today! 🩸</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6 text-left">
              {Array.from({ length: Math.max(leaderboard.length, 3) }).map((_, index) => {
                if (index >= 3) return null;
                const donor = leaderboard[index] || null;
                const rank = RANKS[index];
                const displayName = donor ? `${donor.firstName}${donor.lastInitial ? ` ${donor.lastInitial}.` : ""}` : "";

                const highlights = donor
                  ? [
                      { Icon: Droplet, text: `Blood Type: ${donor.bloodType}` },
                      { Icon: Heart, text: `${donor.donationCount} ${donor.donationCount === 1 ? "Donation" : "Donations"} Completed` },
                      { Icon: Sparkles, text: `${donor.donationCount} ${donor.donationCount === 1 ? "Person" : "People"} Saved` },
                    ]
                  : [];

                return (
                  <article
                    key={index}
                    className="relative flex h-full flex-col rounded-3xl border border-line/60 bg-white p-5 shadow-[0_12px_40px_-18px_rgba(15,60,140,0.3)] transition-shadow duration-300 hover:shadow-[0_18px_50px_-18px_rgba(15,60,140,0.4)] sm:p-6"
                  >
                    <button
                      type="button"
                      onClick={() => donor?.profileImage && setLightboxImage({ src: donor.profileImage, name: displayName })}
                      aria-label={donor ? `View ${displayName}'s photo` : "Empty leaderboard slot"}
                      className={`block w-full overflow-hidden rounded-2xl bg-soft ${donor?.profileImage ? "" : "cursor-default"}`}
                    >
                      {donor ? (
                        donor.profileImage ? (
                          <img src={donor.profileImage} alt={displayName} className="aspect-[4/3] w-full object-cover" />
                        ) : (
                          <span className="flex aspect-[4/3] w-full items-center justify-center bg-gradient-to-tr from-red-600 to-rose-500 text-4xl font-extrabold text-white">
                            {donor.firstName ? donor.firstName.charAt(0).toUpperCase() : "D"}
                          </span>
                        )
                      ) : (
                        <span className="flex aspect-[4/3] w-full items-center justify-center border-2 border-dashed border-slate-300 text-3xl text-slate-300">
                          ?
                        </span>
                      )}
                    </button>

                    <div className="mt-4 min-w-0">
                      <span className={`inline-flex max-w-full items-center gap-2 rounded-full px-3 py-1.5 text-xs font-semibold sm:text-sm ${rank.badge}`}>
                        <span>{rank.medal}</span>
                        <span className="truncate">{rank.label}</span>
                      </span>
                      <h3 className="mt-3 break-words text-xl font-extrabold leading-tight text-navy sm:text-2xl">
                        {donor ? displayName : "No donor yet"}
                      </h3>
                      <p className="mt-1 text-sm text-slate-500 sm:text-base">
                        {donor ? donor.location : "Could this be you?"}
                      </p>
                    </div>

                    {highlights.length > 0 && (
                      <ul className="mt-4 space-y-2.5 border-t border-line pt-4">
                        {highlights.map(({ Icon, text }, i) => (
                          <li key={i} className="flex items-center gap-3 text-sm text-slate-600">
                            <Icon className={`h-5 w-5 flex-shrink-0 ${rank.icon}`} />
                            <span className="min-w-0 break-words">{text}</span>
                          </li>
                        ))}
                      </ul>
                    )}

                    <p className={`mt-auto pt-5 text-xs font-semibold italic ${donor ? "text-red-600" : "text-slate-400"}`}>
                      {donor ? `"${QUOTES[index] || QUOTES[0]}"` : "Donate blood to claim this spot 🩸"}
                    </p>
                  </article>
                );
              })}
            </div>
          )}

          <p className="text-slate-400 text-xs mt-8">
            🔒 Only first name shown for privacy. Rankings update in real time.
          </p>
        </div>
      </section>
    </>
  );
}
