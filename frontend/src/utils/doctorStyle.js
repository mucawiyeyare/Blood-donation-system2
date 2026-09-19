import { Droplet, Heart, Stethoscope, GraduationCap, ShieldCheck, HeartPulse, Users, Star } from "lucide-react";
import { Facebook, Linkedin, Twitter } from "lucide-react";

// Three colour themes; each doctor always gets the same one (picked from their id).
export const ACCENTS = [
  {
    badge: "bg-blue-50 text-blue-700",
    icon: "text-blue-600",
    social: "bg-blue-50 text-blue-600 hover:bg-blue-100",
    blob: "from-blue-100 to-sky-50",
    BadgeIcon: Droplet,
    icons: [GraduationCap, ShieldCheck, Heart],
  },
  {
    badge: "bg-emerald-50 text-emerald-700",
    icon: "text-emerald-600",
    social: "bg-emerald-50 text-emerald-600 hover:bg-emerald-100",
    blob: "from-emerald-100 to-teal-50",
    BadgeIcon: Heart,
    icons: [HeartPulse, Stethoscope, Users],
  },
  {
    badge: "bg-violet-50 text-violet-700",
    icon: "text-violet-600",
    social: "bg-violet-50 text-violet-600 hover:bg-violet-100",
    blob: "from-violet-100 to-indigo-50",
    BadgeIcon: Stethoscope,
    icons: [Droplet, Star, Users],
  },
];

export const accentFor = (id = "") => ACCENTS[[...String(id)].reduce((sum, ch) => sum + ch.charCodeAt(0), 0) % ACCENTS.length];

export const SOCIAL_LINKS = [
  { key: "facebook", label: "Facebook", Icon: Facebook },
  { key: "linkedin", label: "LinkedIn", Icon: Linkedin },
  { key: "twitter", label: "Twitter / X", Icon: Twitter },
];

// Only real http(s) links are ever rendered as links
export const safeUrl = (value) => (typeof value === "string" && /^https?:\/\//i.test(value) ? value : "");
