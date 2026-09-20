import React from "react";
import { SOMALIA_REGIONS } from "../utils/somaliaLocations.js";

const cls = "w-full px-3 py-2 border border-slate-200 rounded-xl text-xs sm:text-sm focus:ring-2 focus:ring-red-500 bg-white";

// Two linked dropdowns (region, then district). The value is stored as "District, Region".
export default function RegionDistrictSelect({ value, onChange, required = false }) {
  const [district = "", region = ""] = (value || "").split(",").map((p) => p.trim());
  const knownRegion = SOMALIA_REGIONS[region] ? region : "";
  const knownDistrict = knownRegion && SOMALIA_REGIONS[knownRegion].includes(district) ? district : "";

  const emit = (d, r) => onChange(r ? `${d}, ${r}` : "");

  return (
    <div className="grid grid-cols-2 gap-2">
      <select value={knownRegion} onChange={(e) => emit("", e.target.value)} className={cls} required={required}>
        <option value="">Select region</option>
        {Object.keys(SOMALIA_REGIONS).map((r) => (
          <option key={r} value={r}>{r}</option>
        ))}
      </select>
      <select
        value={knownDistrict}
        onChange={(e) => emit(e.target.value, knownRegion)}
        disabled={!knownRegion}
        className={`${cls} disabled:opacity-60`}
        required={required}
      >
        <option value="">{knownRegion ? "Select district" : "Choose region first"}</option>
        {(SOMALIA_REGIONS[knownRegion] || []).map((d) => (
          <option key={d} value={d}>{d}</option>
        ))}
      </select>
    </div>
  );
}
