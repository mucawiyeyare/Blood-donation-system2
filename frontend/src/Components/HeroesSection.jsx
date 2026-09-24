import React from "react";
import { Trophy } from "lucide-react";
import DoctorCard from "./DoctorCard.jsx";

// Rank styling for the top 3 slots: medal, label and a small accent colour, echoing gold/silver/bronze.
const RANKS = [
  { medal: "🥇", label: "1st Place" },
  { medal: "🥈", label: "2nd Place" },
  { medal: "🥉", label: "3rd Place" },
];

const QUOTES = [
  "You're a true hero! Keep saving lives! 🏆",
  "You're a true hero! ⭐",
  "Fantastic effort! 💪",
];

// "Our Blood Heroes": the public top-3 donors leaderboard. It's the exact same DoctorCard used on
// the Doctors page — only the data fed into it is different (rank badge instead of specialty,
// blood type instead of a title, a "people saved" highlight instead of doctor highlights).
export default function HeroesSection({ leaderboard }) {
  return (
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

              if (!donor) {
                return (
                  <article
                    key={index}
                    className="relative flex h-full flex-col rounded-3xl border border-line/60 bg-white p-5 shadow-[0_12px_40px_-18px_rgba(15,60,140,0.3)] sm:p-6"
                  >
                    <span className="flex aspect-[4/3] w-full items-center justify-center rounded-2xl border-2 border-dashed border-slate-300 text-3xl text-slate-300">
                      ?
                    </span>
                    <div className="mt-4 min-w-0">
                      <span className="inline-flex max-w-full items-center gap-2 rounded-full bg-soft px-3 py-1.5 text-xs font-semibold text-navy sm:text-sm">
                        <span>{rank.medal}</span>
                        <span className="truncate">{rank.label}</span>
                      </span>
                      <h3 className="mt-3 text-xl font-extrabold leading-tight text-navy sm:text-2xl">No donor yet</h3>
                      <p className="mt-1 text-sm text-slate-500 sm:text-base">Could this be you?</p>
                    </div>
                    <p className="mt-auto pt-5 text-xs font-semibold italic text-slate-400">Donate blood to claim this spot 🩸</p>
                  </article>
                );
              }

              const displayName = donor.donorName || donor.firstName;
              const asDoctor = {
                _id: `${displayName}-${index}`,
                name: displayName,
                specialty: `${rank.medal} ${rank.label}`,
                title: `Blood Type: ${donor.bloodType}`,
                bio: QUOTES[index] || QUOTES[0],
                highlights: [`${donor.donationCount} ${donor.donationCount === 1 ? "Person" : "People"} Saved`],
                photo: donor.profileImage || "",
                socials: {},
                canChat: false,
              };
              return <DoctorCard key={index} doctor={asDoctor} titled={false} />;
            })}
          </div>
        )}

        <p className="text-slate-400 text-xs mt-8">Rankings update in real time.</p>
      </div>
    </section>
  );
}
