import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import DoctorCard from "./DoctorCard.jsx";

const HOME_LIMIT = 4;

function DoctorsSection() {
  const [doctors, setDoctors] = useState([]);

  useEffect(() => {
    axios
      .get("/api/doctors")
      .then((res) => setDoctors(res.data || []))
      .catch(() => {});
  }, []);

  if (doctors.length === 0) return null;

  return (
    <section id="doctors" className="py-20 bg-white border-b border-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between gap-4 mb-10">
          <div>
            <h2 className="text-3xl sm:text-4xl font-black text-slate-900">Talk to a doctor</h2>
            <p className="text-slate-600 mt-2">Get eligibility guidance before you donate.</p>
          </div>
          <Link to="/doctors" className="text-red-700 hover:text-red-800 font-bold whitespace-nowrap">
            View all
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {doctors.slice(0, HOME_LIMIT).map((doctor) => (
            <DoctorCard key={doctor._id} doctor={doctor} />
          ))}
        </div>
      </div>
    </section>
  );
}

export default DoctorsSection;
