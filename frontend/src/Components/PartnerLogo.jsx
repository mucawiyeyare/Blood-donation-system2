import React from "react";

// Partner card: logo above the name, links out to the partner's website.
function PartnerLogo({ partner }) {
  return (
    <a
      href={partner.websiteUrl}
      target="_blank"
      rel="noreferrer"
      title={partner.name}
      className="group flex w-40 flex-shrink-0 flex-col items-center rounded-2xl border border-line bg-white p-4 text-center shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-md sm:w-44"
    >
      <div className="flex h-16 w-16 items-center justify-center overflow-hidden rounded-full bg-soft sm:h-[72px] sm:w-[72px]">
        <img src={partner.logo} alt={partner.name} className="h-full w-full object-cover" />
      </div>
      <span className="mt-3 line-clamp-2 text-xs font-semibold leading-snug text-navy sm:text-sm">
        {partner.name}
      </span>
    </a>
  );
}

export default PartnerLogo;
