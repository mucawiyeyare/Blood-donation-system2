import React from "react";
import { Link } from "react-router-dom";
import { Droplet, ArrowRight } from "lucide-react";

// Full-width call-to-action banner. "red" is the About-style banner, "navy" the Home-style one.
function CtaBanner({ variant = "red", title, text, label, to }) {
  const tone =
    variant === "navy"
      ? "bg-gradient-to-r from-navy-deep via-navy to-[#164a8a]"
      : "bg-gradient-to-r from-brand-dark via-brand to-[#e0212f]";
  const button =
    variant === "navy"
      ? "bg-brand text-white hover:bg-brand-dark"
      : "bg-white text-brand hover:bg-soft";

  return (
    <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className={`relative overflow-hidden rounded-3xl ${tone} px-6 py-7 text-white shadow-lg sm:px-10 sm:py-8`}>
        <Droplet className="pointer-events-none absolute -bottom-10 -right-6 h-48 w-48 text-white/5" />
        <div className="relative flex flex-col items-start gap-5 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-4">
            <div className="flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-full bg-white text-brand">
              <Droplet className="h-7 w-7 fill-brand" />
            </div>
            <div>
              <h2 className="text-xl font-extrabold sm:text-2xl">{title}</h2>
              <p className="mt-1 max-w-xl text-sm text-white/85 sm:text-base">{text}</p>
            </div>
          </div>
          <Link
            to={to}
            className={`inline-flex flex-shrink-0 items-center gap-2 rounded-xl px-6 py-3 text-sm font-semibold shadow-md transition-colors ${button}`}
          >
            {label} <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}

export default CtaBanner;
