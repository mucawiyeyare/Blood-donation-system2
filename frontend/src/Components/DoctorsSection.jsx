import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { Stethoscope, ArrowRight } from "lucide-react";
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
    <section id="doctors" className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="rounded-3xl border border-line bg-soft/70 p-5 sm:p-7">
        <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div className="flex items-start gap-3">
            <div className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-xl bg-white text-navy shadow-sm">
              <Stethoscope className="h-6 w-6" />
            </div>
            <div>
              <h2 className="text-xl font-extrabold text-navy">Our Doctors</h2>
              <p className="mt-1 max-w-2xl text-sm text-slate-600">
                Experienced doctors and medical professionals are here to support the blood donation
                process and ensure safe and healthy communities.
              </p>
            </div>
          </div>
          <Link
            to="/doctors"
            className="inline-flex items-center gap-1.5 whitespace-nowrap text-sm font-semibold text-navy hover:text-brand"
          >
            Meet Our Medical Team <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {doctors.slice(0, HOME_LIMIT).map((doctor) => (
            <DoctorCard key={doctor._id} doctor={doctor} />
          ))}
        </div>
      </div>
    </section>
  );
}

export default DoctorsSection;
