import React, { useState } from "react";

export default function DhiigKaalLogo({ size = "md", showText = true, className = "", light = false }) {
  const [imgError, setImgError] = useState(false);

  // Size mappings
  const sizeMap = {
    sm: { img: "h-8 w-auto max-w-[36px]", text: "text-lg", subtext: "text-[10px]" },
    md: { img: "h-11 w-auto max-w-[48px]", text: "text-2xl", subtext: "text-xs" },
    lg: { img: "h-16 w-auto max-w-[70px]", text: "text-3xl", subtext: "text-sm" },
    xl: { img: "h-24 w-auto max-w-[100px]", text: "text-4xl", subtext: "text-base" },
  };

  const currentSize = sizeMap[size] || sizeMap.md;

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      {!imgError ? (
        <img
          src="/logo.jpg"
          alt="DHIIG KAAL Logo"
          className={`${currentSize.img} object-contain rounded-lg shadow-sm`}
          onError={() => setImgError(true)}
        />
      ) : (
        <div className="relative flex items-center justify-center p-2 rounded-xl bg-gradient-to-tr from-red-600 to-red-500 shadow-md">
          <svg className="w-8 h-8 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z" fill="#EF4444" stroke="#DC2626" />
            <path d="M12 8v6M9 11h6" stroke="#38BDF8" strokeWidth="2.5" strokeLinecap="round" />
          </svg>
        </div>
      )}

      {showText && (
        <div className="flex flex-col leading-tight text-left">
          <div className={`font-black tracking-wider flex items-center gap-1.5 ${currentSize.text}`}>
            <span className="text-red-600">DHIIG</span>
            <span className="text-sky-500 relative inline-block">
              KAAL
              <span className="absolute left-0 right-0 top-1/2 -translate-y-1/2 h-[2.5px] bg-red-600 rounded-full"></span>
            </span>
          </div>
          <span className={`font-semibold tracking-wide uppercase ${light ? "text-gray-300" : "text-gray-500"} ${currentSize.subtext}`}>
            Blood Donation System
          </span>
        </div>
      )}
    </div>
  );
}
