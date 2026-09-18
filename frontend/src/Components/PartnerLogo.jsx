import React from "react";

function PartnerLogo({ partner }) {
  return (
    <a
      href={partner.websiteUrl}
      target="_blank"
      rel="noreferrer"
      title={partner.name}
      className="group flex flex-col items-center text-center w-32 sm:w-40 flex-shrink-0"
    >
      <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full bg-white border border-slate-200 shadow-sm overflow-hidden flex items-center justify-center group-hover:shadow-lg group-hover:-translate-y-1 transition-all duration-300">
        <img src={partner.logo} alt={partner.name} className="w-full h-full object-cover" />
      </div>
      <span className="mt-3 text-sm font-semibold text-slate-700 leading-snug line-clamp-2">
        {partner.name}
      </span>
    </a>
  );
}

export default PartnerLogo;
