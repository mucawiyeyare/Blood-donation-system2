import React, { useState, useRef, useEffect } from "react";
import { Globe, ChevronDown, Check } from "lucide-react";
import { useTranslation } from "../context/LanguageContext.jsx";

const languages = [
  { code: "so", label: "Af-Soomaali", flag: "🇸🇴", short: "SO" },
  { code: "en", label: "English", flag: "🇬🇧", short: "EN" },
  { code: "ar", label: "العربية", flag: "🇸🇦", short: "AR" },
];

function LanguageSwitcher({ variant = "dropdown", className = "" }) {
  const { language, setLanguage, t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  const currentLang = languages.find((l) => l.code === language) || languages[0];

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Pill group variant (compact toggle for sidebars or footers)
  if (variant === "pills") {
    return (
      <div className={`inline-flex items-center p-1 bg-slate-100 rounded-xl border border-slate-200 ${className}`}>
        {languages.map((lang) => (
          <button
            key={lang.code}
            type="button"
            onClick={() => setLanguage(lang.code)}
            className={`px-2.5 py-1 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all ${
              language === lang.code
                ? "bg-white text-slate-900 shadow-sm"
                : "text-slate-500 hover:text-slate-800"
            }`}
          >
            <span>{lang.flag}</span>
            <span>{lang.short}</span>
          </button>
        ))}
      </div>
    );
  }

  // Default Dropdown
  return (
    <div className={`relative inline-block text-left ${className}`} ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="inline-flex items-center gap-2 px-3 py-2 bg-white hover:bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-700 shadow-sm transition-all focus:outline-none focus:ring-2 focus:ring-red-500/20"
        aria-expanded={isOpen}
        aria-haspopup="true"
      >
        <span className="text-sm">{currentLang.flag}</span>
        <span className="hidden sm:inline">{currentLang.label}</span>
        <span className="sm:hidden">{currentLang.short}</span>
        <ChevronDown className={`w-3.5 h-3.5 text-slate-400 transition-transform ${isOpen ? "rotate-180" : ""}`} />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-1.5 w-44 bg-white rounded-2xl shadow-xl border border-slate-200/90 py-1.5 z-50 animate-scale-in">
          <div className="px-3 py-1.5 text-[10px] font-black text-slate-400 uppercase tracking-wider border-b border-slate-100 mb-1">
            {t("lang.select", "Select Language")}
          </div>
          {languages.map((lang) => (
            <button
              key={lang.code}
              type="button"
              onClick={() => {
                setLanguage(lang.code);
                setIsOpen(false);
              }}
              className={`w-full px-3.5 py-2 text-left text-xs font-bold flex items-center justify-between transition-colors ${
                language === lang.code
                  ? "bg-red-50 text-red-700 font-black"
                  : "text-slate-700 hover:bg-slate-50"
              }`}
            >
              <div className="flex items-center gap-2.5">
                <span className="text-base">{lang.flag}</span>
                <span>{lang.label}</span>
              </div>
              {language === lang.code && <Check className="w-3.5 h-3.5 text-red-600 flex-shrink-0" />}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export default LanguageSwitcher;
