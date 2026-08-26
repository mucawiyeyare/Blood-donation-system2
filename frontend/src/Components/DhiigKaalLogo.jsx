import React, { useState } from "react";

export default function DhiigKaalLogo({ size = "md", showText = true, className = "", light = false }) {
  const [imgError, setImgError] = useState(false);

  const sizeMap = {
    sm: { img: "h-8 w-auto max-w-[36px]", icon: "w-9 h-9", text: "text-lg" },
    md: { img: "h-11 w-auto max-w-[48px]", icon: "w-12 h-12", text: "text-2xl" },
    lg: { img: "h-16 w-auto max-w-[70px]", icon: "w-16 h-16", text: "text-3xl" },
    xl: { img: "h-24 w-auto max-w-[100px]", icon: "w-24 h-24", text: "text-4xl" },
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
        /* Hand holding blood drop with medical cross — SVG fallback */
        <svg
          className={currentSize.icon}
          viewBox="0 0 100 110"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Blood drop */}
          <path
            d="M50 5 C50 5 28 32 28 48 C28 61 38 70 50 70 C62 70 72 61 72 48 C72 32 50 5 50 5Z"
            fill="#E53935"
          />
          {/* White halo behind cross */}
          <circle cx="50" cy="48" r="13" fill="white" opacity="0.9" />
          {/* Medical cross */}
          <rect x="44" y="38" width="12" height="20" rx="2.5" fill="#29B6F6" />
          <rect x="39" y="43" width="22" height="10" rx="2.5" fill="#29B6F6" />
          {/* Palm */}
          <path
            d="M15 72 Q18 66 26 65 L74 65 Q82 66 85 72 L80 90 Q78 96 70 96 L30 96 Q22 96 20 90 Z"
            fill="#29B6F6"
          />
          {/* Thumb */}
          <path
            d="M15 72 Q10 68 12 60 Q14 55 20 58 L26 65 Z"
            fill="#29B6F6"
          />
          {/* Finger shading lines */}
          <path d="M38 65 Q36 56 40 52 Q44 49 47 53 L50 65 Z" fill="#1DA8E0" />
          <path d="M50 65 Q49 54 53 50 Q57 47 60 51 L62 65 Z" fill="#1DA8E0" />
          <path d="M62 65 Q62 55 66 52 Q70 49 73 53 L74 65 Z" fill="#1DA8E0" />
          <path d="M74 65 Q76 57 80 55 Q84 53 86 58 L85 72 Z" fill="#29B6F6" />
        </svg>
      )}

      {showText && (
        <div className="flex flex-col leading-tight text-left">
          <div className={`font-black tracking-wider flex items-center gap-1 ${currentSize.text}`}>
            <span className="text-red-600">DHIIG</span>
            <span className="text-sky-500">KAAL</span>
          </div>
        </div>
      )}
    </div>
  );
}
