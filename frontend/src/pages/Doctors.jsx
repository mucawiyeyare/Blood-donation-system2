import React, { useEffect, useState } from "react";
import axios from "axios";
import { Stethoscope } from "lucide-react";
import DoctorCard from "../Components/DoctorCard.jsx";

function Doctors() {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios
      .get("/api/doctors")
      .then((res) => setDoctors(res.data || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="min-h-[70vh] bg-white">
      <div className="bg-gradient-to-br from-slate-900 via-red-950 to-slate-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 border border-white/20 text-sky-300 text-xs font-semibold mb-4">
            <Stethoscope className="w-4 h-4" />
            <span>Our Doctors</span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-black mb-3">Talk to a doctor</h1>
          <p className="text-slate-300 max-w-2xl mx-auto">
            Get eligibility guidance before you donate from our volunteer medical professionals.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        {loading ? (
          <p className="text-center text-slate-400 text-sm py-12">Loading doctors...</p>
        ) : doctors.length === 0 ? (
          <p className="text-center text-slate-400 text-sm py-12">No doctors are listed yet. Please check back soon.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {doctors.map((doctor) => (
              <DoctorCard key={doctor._id} doctor={doctor} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Doctors;
