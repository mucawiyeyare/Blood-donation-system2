import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import {
  Stethoscope,
  Plus,
  Trash2,
  Pencil,
  Image as ImageIcon,
  X,
  EyeOff,
  Eye,
} from "lucide-react";
import ImageCropModal from "./ImageCropModal.jsx";

const emptyForm = { name: "", specialty: "", bio: "", photo: "", whatsapp: "" };

function DoctorsManagement() {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [showModal, setShowModal] = useState(false);
  const [editingDoctor, setEditingDoctor] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [submitting, setSubmitting] = useState(false);
  const [cropImageSrc, setCropImageSrc] = useState(null);
  const fileInputRef = useRef(null);

  const token = localStorage.getItem("token");
  const authHeaders = { headers: { Authorization: `Bearer ${token}` } };

  const fetchDoctors = async () => {
    setLoading(true);
    try {
      const res = await axios.get("/api/admin/doctors", authHeaders);
      setDoctors(res.data);
      setError(null);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load doctors");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDoctors();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const openAddModal = () => {
    setEditingDoctor(null);
    setForm(emptyForm);
    setShowModal(true);
  };

  const openEditModal = (doctor) => {
    setEditingDoctor(doctor);
    setForm({
      name: doctor.name,
      specialty: doctor.specialty,
      bio: doctor.bio || "",
      photo: doctor.photo || "",
      whatsapp: doctor.whatsapp || "",
    });
    setShowModal(true);
  };

  const handlePhotoSelect = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 10 * 1024 * 1024) {
      alert("Photo is too large (max 10MB). Please choose a smaller image.");
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      setCropImageSrc(reader.result);
      if (fileInputRef.current) fileInputRef.current.value = "";
    };
    reader.readAsDataURL(file);
  };

  const handleCropComplete = (croppedBase64) => {
    setForm((f) => ({ ...f, photo: croppedBase64 }));
    setCropImageSrc(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name.trim() || !form.specialty.trim()) {
      alert("Please provide the doctor's name and specialty.");
      return;
    }

    setSubmitting(true);
    try {
      if (editingDoctor) {
        await axios.put(`/api/admin/doctors/${editingDoctor._id}`, form, authHeaders);
      } else {
        await axios.post("/api/admin/doctors", form, authHeaders);
      }
      setShowModal(false);
      fetchDoctors();
    } catch (err) {
      alert(err.response?.data?.message || "Failed to save doctor");
    } finally {
      setSubmitting(false);
    }
  };

  const handleToggleActive = async (doctor) => {
    try {
      await axios.put(`/api/admin/doctors/${doctor._id}`, { isActive: !doctor.isActive }, authHeaders);
      fetchDoctors();
    } catch (err) {
      alert(err.response?.data?.message || "Failed to update doctor");
    }
  };

  const handleDelete = async (doctor) => {
    if (!window.confirm(`Remove "${doctor.name}" from doctors? This can't be undone.`)) return;
    try {
      await axios.delete(`/api/admin/doctors/${doctor._id}`, authHeaders);
      fetchDoctors();
    } catch (err) {
      alert(err.response?.data?.message || "Failed to delete doctor");
    }
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-6xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-black text-slate-800 flex items-center gap-2.5">
            <Stethoscope className="w-7 h-7 text-red-600" />
            Doctors
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Manage the doctors shown on the homepage and the Doctors page. Donors can start a
            WhatsApp chat with a doctor when you add their number.
          </p>
        </div>
        <button
          onClick={openAddModal}
          className="flex items-center justify-center gap-2 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white px-5 py-3 rounded-xl font-bold text-sm shadow-md transition-all"
        >
          <Plus className="w-4 h-4" />
          Add Doctor
        </button>
      </div>

      {loading ? (
        <div className="p-12 text-center text-slate-400 text-sm">Loading doctors...</div>
      ) : error ? (
        <div className="p-6 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm">{error}</div>
      ) : doctors.length === 0 ? (
        <div className="p-12 text-center bg-slate-50 border border-dashed border-slate-200 rounded-2xl">
          <ImageIcon className="w-10 h-10 text-slate-300 mx-auto mb-3" />
          <p className="text-sm text-slate-500">No doctors added yet. Click "Add Doctor" to add the first one.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {doctors.map((doctor) => (
            <div
              key={doctor._id}
              className={`bg-white rounded-2xl border border-slate-200 p-4 flex items-start gap-4 shadow-sm ${
                doctor.isActive ? "" : "opacity-50"
              }`}
            >
              {doctor.photo ? (
                <img
                  src={doctor.photo}
                  alt={doctor.name}
                  className="w-14 h-14 rounded-full object-cover border border-slate-200 flex-shrink-0"
                />
              ) : (
                <div className="w-14 h-14 rounded-full bg-red-100 text-red-700 flex items-center justify-center font-black flex-shrink-0">
                  {doctor.name.split(" ").filter(Boolean).slice(0, 2).map((w) => w[0].toUpperCase()).join("")}
                </div>
              )}
              <div className="min-w-0 flex-1">
                <p className="font-bold text-sm text-slate-800 truncate">{doctor.name}</p>
                <p className="text-xs text-red-600 font-semibold truncate">{doctor.specialty}</p>
                {doctor.bio && <p className="text-[11px] text-slate-500 mt-1 line-clamp-2">{doctor.bio}</p>}
                {!doctor.isActive && (
                  <span className="inline-block mt-1 text-[10px] font-bold uppercase text-slate-400">Hidden</span>
                )}
              </div>
              <div className="flex flex-col gap-1.5 flex-shrink-0">
                <button
                  onClick={() => openEditModal(doctor)}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-sky-600 hover:bg-sky-50"
                  aria-label="Edit"
                >
                  <Pencil className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleToggleActive(doctor)}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-amber-600 hover:bg-amber-50"
                  aria-label={doctor.isActive ? "Hide from website" : "Show on website"}
                  title={doctor.isActive ? "Hide from website" : "Show on website"}
                >
                  {doctor.isActive ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                </button>
                <button
                  onClick={() => handleDelete(doctor)}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50"
                  aria-label="Delete"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add / Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 border border-slate-100 max-h-[92vh] overflow-y-auto">
            <div className="flex justify-between items-start mb-4 pb-3 border-b border-slate-100">
              <h3 className="text-xl font-black text-slate-800">
                {editingDoctor ? "Edit Doctor" : "Add Doctor"}
              </h3>
              <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="flex flex-col items-center gap-2">
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handlePhotoSelect}
                  accept="image/*"
                  className="hidden"
                />
                <div
                  onClick={() => fileInputRef.current?.click()}
                  className="w-20 h-20 rounded-full border-2 border-dashed border-slate-300 flex items-center justify-center cursor-pointer hover:border-red-400 overflow-hidden bg-slate-50"
                >
                  {form.photo ? (
                    <img src={form.photo} alt="Doctor preview" className="w-full h-full object-cover" />
                  ) : (
                    <ImageIcon className="w-7 h-7 text-slate-300" />
                  )}
                </div>
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="text-xs font-bold text-red-600 hover:underline"
                >
                  {form.photo ? "Change Photo" : "Upload Photo (optional)"}
                </button>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Doctor Name *</label>
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="e.g. Ubax Xasan"
                  className="w-full px-3 py-2.5 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-red-500"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Specialty *</label>
                <input
                  type="text"
                  value={form.specialty}
                  onChange={(e) => setForm({ ...form, specialty: e.target.value })}
                  placeholder="e.g. Hematology"
                  className="w-full px-3 py-2.5 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-red-500"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Bio</label>
                <textarea
                  value={form.bio}
                  onChange={(e) => setForm({ ...form, bio: e.target.value })}
                  rows="3"
                  placeholder="Short description of the doctor's background and experience"
                  className="w-full px-3 py-2.5 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-red-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  WhatsApp Number
                </label>
                <input
                  type="tel"
                  value={form.whatsapp}
                  onChange={(e) => setForm({ ...form, whatsapp: e.target.value })}
                  placeholder="+252616408886"
                  className="w-full px-3 py-2.5 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-red-500"
                />
                <p className="text-[11px] text-slate-500 mt-1">
                  Include the country code. Enables the "Start chat" button; leave empty to hide it.
                </p>
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="flex-1 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="flex-1 py-2.5 bg-red-600 hover:bg-red-700 disabled:opacity-60 text-white font-bold rounded-xl text-xs"
                >
                  {submitting ? "Saving..." : editingDoctor ? "Save Changes" : "Add Doctor"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {cropImageSrc && (
        <ImageCropModal
          imageSrc={cropImageSrc}
          onCancel={() => setCropImageSrc(null)}
          onCropComplete={handleCropComplete}
        />
      )}
    </div>
  );
}

export default DoctorsManagement;
