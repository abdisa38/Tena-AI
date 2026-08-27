import React, { useState, useEffect } from 'react';
import { 
  Stethoscope, 
  Search, 
  ShieldCheck, 
  Clock, 
  Calendar, 
  Star, 
  MapPin, 
  CheckCircle2, 
  X, 
  CreditCard, 
  Video,
  ArrowRight,
  Sparkles
} from 'lucide-react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';

export default function Doctors() {
  const { user } = useAuth();
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSpecialty, setSelectedSpecialty] = useState('All');

  // Booking Modal State
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [selectedSlot, setSelectedSlot] = useState('');
  const [symptomsNote, setSymptomsNote] = useState('');
  const [bookingLoading, setBookingLoading] = useState(false);
  const [bookingSuccess, setBookingSuccess] = useState(null);
  const [bookingError, setBookingError] = useState('');

  const specialties = [
    'All',
    'General Medicine',
    'Cardiology',
    'Pediatrics',
    'Dermatology',
    'Internal Medicine'
  ];

  useEffect(() => {
    fetchDoctors();
  }, [selectedSpecialty]);

  const fetchDoctors = async () => {
    setLoading(true);
    try {
      const url = selectedSpecialty === 'All' ? '/doctors' : `/doctors?specialty=${encodeURIComponent(selectedSpecialty)}`;
      const res = await api.get(url);
      if (res.data.success) {
        setDoctors(res.data.data);
      }
    } catch (err) {
      console.error('Error fetching doctors', err);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenBooking = (doc) => {
    setSelectedDoctor(doc);
    setSelectedSlot(doc.timeSlots?.[0] || '10:00 AM');
    setBookingSuccess(null);
    setBookingError('');
  };

  const handleConfirmBooking = async () => {
    if (!selectedSlot) {
      setBookingError('Please choose an available appointment time slot.');
      return;
    }
    setBookingLoading(true);
    setBookingError('');

    try {
      const res = await api.post('/appointments', {
        doctorId: selectedDoctor._id,
        appointmentDate: selectedDate,
        timeSlot: selectedSlot,
        type: 'video',
        symptomsDescription: symptomsNote,
        fee: selectedDoctor.consultationFee,
        currency: selectedDoctor.currency || 'ETB',
        patientId: user?._id || '65d8a1f10999999999999999'
      });

      if (res.data.success) {
        setBookingSuccess(res.data.data);
      }
    } catch (err) {
      setBookingError(err.response?.data?.message || 'Could not complete booking.');
    } finally {
      setBookingLoading(false);
    }
  };

  const filteredDoctors = doctors.filter((doc) => {
    const matchesSearch = doc.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          doc.specialty.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          doc.clinicAffiliation.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      
      {/* Header & Search */}
      <div className="space-y-6">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <span className="text-xs font-bold uppercase tracking-wider text-tena-cyan">Telehealth Network</span>
          <h1 className="text-3xl font-extrabold text-tena-text">Verified Physicians & Specialists</h1>
          <p className="text-xs sm:text-sm text-tena-muted">
            Connect directly with licensed doctors for video consultations and digital prescriptions.
          </p>
        </div>

        {/* Search Bar & Filter Pills */}
        <div className="max-w-3xl mx-auto space-y-4">
          <div className="relative">
            <Search className="w-5 h-5 text-tena-muted absolute left-4 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by doctor name, specialty, or hospital affiliation..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3.5 rounded-xl bg-tena-surface border border-tena-border text-tena-text text-sm focus:outline-none focus:border-tena-emerald transition-colors"
            />
          </div>

          <div className="flex items-center gap-2 overflow-x-auto pb-2">
            {specialties.map((spec) => (
              <button
                key={spec}
                onClick={() => setSelectedSpecialty(spec)}
                className={`text-xs px-3.5 py-1.5 rounded-lg whitespace-nowrap transition-all ${
                  selectedSpecialty === spec
                    ? 'bg-tena-emerald text-black font-bold shadow-glow-emerald'
                    : 'bg-tena-surface border border-tena-border text-tena-muted hover:text-white'
                }`}
              >
                {spec}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Doctor Cards Grid */}
      {loading ? (
        <div className="py-20 text-center text-tena-muted text-sm flex items-center justify-center gap-2">
          <Stethoscope className="w-5 h-5 animate-pulse text-tena-emerald" />
          <span>Loading verified physician directory...</span>
        </div>
      ) : filteredDoctors.length === 0 ? (
        <div className="p-12 text-center bg-tena-surface rounded-2xl border border-tena-border space-y-3">
          <p className="text-sm text-tena-muted">No doctors found matching your search query.</p>
          <button
            onClick={() => { setSearchTerm(''); setSelectedSpecialty('All'); }}
            className="text-xs text-tena-emerald font-semibold hover:underline"
          >
            Clear Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredDoctors.map((doctor) => (
            <div
              key={doctor._id}
              className="p-6 rounded-2xl bg-tena-surface border border-tena-border glass-panel-hover flex flex-col justify-between space-y-5"
            >
              <div className="space-y-4">
                
                {/* Top Badge & Fee */}
                <div className="flex items-center justify-between">
                  <span className="px-2.5 py-1 rounded bg-tena-bg text-xs font-semibold text-tena-emerald border border-tena-border">
                    {doctor.specialty}
                  </span>
                  <div className="text-right">
                    <span className="text-sm font-extrabold text-tena-text">{doctor.consultationFee} {doctor.currency || 'ETB'}</span>
                    <span className="text-[10px] text-tena-subtle block">per consultation</span>
                  </div>
                </div>

                {/* Doctor Identity */}
                <div className="space-y-1">
                  <div className="flex items-center gap-1.5">
                    <h3 className="text-base font-bold text-tena-text">{doctor.fullName}</h3>
                    {doctor.isVerified && (
                      <ShieldCheck className="w-4 h-4 text-tena-emerald flex-shrink-0" title="Verified License" />
                    )}
                  </div>
                  <p className="text-xs text-tena-cyan font-medium flex items-center gap-1">
                    <MapPin className="w-3 h-3" />
                    {doctor.clinicAffiliation}
                  </p>
                  <p className="text-xs text-tena-muted pt-1 leading-relaxed line-clamp-2">
                    {doctor.bio}
                  </p>
                </div>

                {/* Meta details */}
                <div className="grid grid-cols-2 gap-2 pt-2 border-t border-tena-border/60 text-[11px] text-tena-muted">
                  <div className="flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-tena-emerald" />
                    <span>{doctor.experienceYears}+ Years Exp.</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                    <span>{doctor.rating} ({doctor.reviewsCount || 20} reviews)</span>
                  </div>
                </div>

              </div>

              {/* Booking CTA Button */}
              <button
                onClick={() => handleOpenBooking(doctor)}
                className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-tena-emerald hover:bg-tena-emerald-hover text-black font-bold text-xs transition-all shadow-glow-emerald"
              >
                <Video className="w-4 h-4" />
                Book Video Consultation
              </button>

            </div>
          ))}
        </div>
      )}

      {/* Booking Modal */}
      {selectedDoctor && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in">
          <div className="max-w-lg w-full rounded-2xl bg-tena-surface border border-tena-border p-6 sm:p-8 space-y-6 shadow-2xl relative">
            
            <button
              onClick={() => setSelectedDoctor(null)}
              className="absolute top-5 right-5 text-tena-muted hover:text-white p-1 rounded-lg bg-tena-bg border border-tena-border"
            >
              <X className="w-4 h-4" />
            </button>

            {bookingSuccess ? (
              <div className="text-center py-6 space-y-4">
                <div className="w-14 h-14 rounded-full bg-tena-emerald/20 border border-tena-emerald text-tena-emerald flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <div className="space-y-1">
                  <h3 className="text-lg font-bold text-tena-text">Consultation Confirmed</h3>
                  <p className="text-xs text-tena-muted">
                    Your appointment with {selectedDoctor.fullName} has been scheduled.
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-tena-bg border border-tena-border text-left space-y-2 text-xs">
                  <div className="flex justify-between">
                    <span className="text-tena-muted">Date & Time:</span>
                    <span className="font-bold text-tena-text">{bookingSuccess.appointmentDate?.toString().substring(0, 10)} at {bookingSuccess.timeSlot}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-tena-muted">Consultation Room:</span>
                    <a href={bookingSuccess.meetingLink} target="_blank" rel="noreferrer" className="text-tena-emerald hover:underline font-mono">
                      Join Call Room
                    </a>
                  </div>
                </div>

                <button
                  onClick={() => setSelectedDoctor(null)}
                  className="w-full py-3 rounded-xl bg-tena-emerald text-black font-bold text-xs"
                >
                  Done
                </button>
              </div>
            ) : (
              <div className="space-y-5">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded bg-tena-bg text-[11px] text-tena-emerald border border-tena-border font-semibold">
                      {selectedDoctor.specialty}
                    </span>
                    <span className="text-xs text-tena-muted">Consultation Booking</span>
                  </div>
                  <h3 className="text-lg font-bold text-tena-text">{selectedDoctor.fullName}</h3>
                </div>

                {bookingError && (
                  <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 text-xs">
                    {bookingError}
                  </div>
                )}

                {/* Date Picker */}
                <div className="space-y-2">
                  <label className="text-xs text-tena-muted font-medium flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-tena-emerald" /> Select Consultation Date
                  </label>
                  <input
                    type="date"
                    value={selectedDate}
                    min={new Date().toISOString().split('T')[0]}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-lg bg-tena-bg border border-tena-border text-tena-text text-sm focus:outline-none focus:border-tena-emerald"
                  />
                </div>

                {/* Time Slots */}
                <div className="space-y-2">
                  <label className="text-xs text-tena-muted font-medium flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-tena-cyan" /> Select Time Slot
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {(selectedDoctor.timeSlots || ['09:00 AM', '11:00 AM', '02:00 PM', '04:30 PM']).map((slot) => (
                      <button
                        key={slot}
                        type="button"
                        onClick={() => setSelectedSlot(slot)}
                        className={`py-2 text-xs rounded-lg border transition-all ${
                          selectedSlot === slot
                            ? 'bg-tena-emerald text-black font-bold border-tena-emerald'
                            : 'bg-tena-bg border-tena-border text-tena-muted hover:border-tena-border-light'
                        }`}
                      >
                        {slot}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Brief Symptoms Description */}
                <div className="space-y-2">
                  <label className="text-xs text-tena-muted font-medium">Chief Complaint / Reason for Visit (Optional)</label>
                  <textarea
                    rows="2"
                    placeholder="Briefly state your symptoms or questions for the doctor..."
                    value={symptomsNote}
                    onChange={(e) => setSymptomsNote(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-lg bg-tena-bg border border-tena-border text-tena-text text-xs focus:outline-none focus:border-tena-emerald"
                  />
                </div>

                {/* Payment Breakdown */}
                <div className="p-3.5 rounded-xl bg-tena-bg border border-tena-border flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <CreditCard className="w-4 h-4 text-tena-emerald" />
                    <span className="text-tena-muted">Consultation Fee:</span>
                  </div>
                  <span className="font-bold text-tena-text">{selectedDoctor.consultationFee} {selectedDoctor.currency || 'ETB'}</span>
                </div>

                <button
                  type="button"
                  disabled={bookingLoading}
                  onClick={handleConfirmBooking}
                  className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-tena-emerald hover:bg-tena-emerald-hover text-black font-bold text-xs transition-all shadow-glow-emerald disabled:opacity-50"
                >
                  {bookingLoading ? (
                    <span>Processing Booking...</span>
                  ) : (
                    <>
                      <CheckCircle2 className="w-4 h-4" /> Confirm & Schedule Consult
                    </>
                  )}
                </button>

              </div>
            )}

          </div>
        </div>
      )}

    </div>
  );
}
