import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { Droplet, ArrowRight, ShieldCheck, Stethoscope } from "lucide-react";
import SplitHero from "../Components/SplitHero.jsx";
import DoctorCard from "../Components/DoctorCard.jsx";
import CtaBanner from "../Components/CtaBanner.jsx";

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
    <div className="font-brand bg-white">
      <SplitHero
        eyebrow="Our Doctors"
        title={
          <>
            Talk to a <span className="text-brand">Doctor</span>
          </>
        }
        text="Get eligibility guidance before you donate. Our volunteer doctors and medical professionals support the blood donation process and help keep every donor and patient safe."
        actions={
          <Link
            to="/signup"
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-brand px-6 py-3 text-sm font-semibold text-white shadow-md shadow-brand/25 transition-colors hover:bg-brand-dark"
          >
            <Droplet className="h-4 w-4" /> Become a Donor <ArrowRight className="h-4 w-4" />
          </Link>
        }
        extra={
          <div className="inline-flex items-center gap-3 rounded-2xl border border-line bg-white/80 px-4 py-3 text-sm text-navy shadow-sm">
            <ShieldCheck className="h-5 w-5 flex-shrink-0 text-brand" />
            <span>
              <strong>Safe and healthy communities.</strong> Ask before you donate.
            </span>
          </div>
        }
        image="/hero5.jpg"
        imageAlt="A hand holding a bag of donated blood"
        tagline="Care you can trust"
      />

      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-14 lg:px-8">
        <div className="rounded-3xl border border-line bg-soft/70 p-5 sm:p-7">
          <div className="mb-6 flex items-start gap-3">
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

          {loading ? (
            <p className="py-12 text-center text-sm text-slate-400">Loading doctors...</p>
          ) : doctors.length === 0 ? (
            <p className="py-12 text-center text-sm text-slate-400">
              No doctors are listed yet. Please check back soon.
            </p>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {doctors.map((doctor) => (
                <DoctorCard key={doctor._id} doctor={doctor} />
              ))}
            </div>
          )}
        </div>
      </section>

      <CtaBanner
        variant="red"
        title="Be Part of the Change"
        text="Donate blood today and help build a healthier Somalia."
        label="Become Donor"
        to="/signup"
      />
    </div>
  );
}

export default Doctors;
