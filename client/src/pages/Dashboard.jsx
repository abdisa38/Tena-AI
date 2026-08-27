import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Calendar, 
  Video, 
  FileText, 
  Activity, 
  Clock, 
  User, 
  CheckCircle2, 
  Stethoscope, 
  ArrowRight,
  ShieldCheck
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';

export default function Dashboard() {
  const { user } = useAuth();
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAppointments();
  }, []);

  const fetchAppointments = async () => {
    try {
      const res = await api.get('/appointments');
      if (res.data.success) {
        setAppointments(res.data.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const samplePrescriptions = [
    {
      id: 'rx-101',
      doctor: 'Dr. Selamawit Tadesse',
      diagnosis: 'Acute Upper Respiratory Infection',
      date: 'Aug 22, 2026',
      items: [
        { name: 'Amoxicillin 500mg', frequency: '3 times daily', morning: true, afternoon: true, night: true, days: '7 days' },
        { name: 'Paracetamol 500mg', frequency: 'As needed for fever', morning: true, afternoon: false, night: true, days: '3 days' }
      ]
    }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      
      {/* Welcome Banner */}
      <div className="p-6 sm:p-8 rounded-3xl bg-tena-surface border border-tena-border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-tena-cyan">Patient Health Portal</span>
            <span className="px-2 py-0.5 rounded bg-tena-bg text-[10px] text-tena-emerald border border-tena-border font-mono">
              Active Session
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-tena-text">
            Welcome back, {user?.fullName || 'Patient'}
          </h1>
          <p className="text-xs text-tena-muted">
            Manage your medical consultations, active prescription schedules, and AI triage summaries.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            to="/triage"
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-tena-emerald hover:bg-tena-emerald-hover text-black font-bold text-xs transition-all shadow-glow-emerald"
          >
            <Activity className="w-4 h-4" />
            Check New Symptoms
          </Link>
          <Link
            to="/doctors"
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-tena-bg border border-tena-border text-tena-text hover:text-white font-semibold text-xs transition-all"
          >
            <Stethoscope className="w-4 h-4 text-tena-cyan" />
            Book Doctor
          </Link>
        </div>
      </div>

      {/* Grid: Upcoming Consults & Active Prescriptions */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Column: Scheduled Appointments */}
        <div className="lg:col-span-7 space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-tena-emerald" />
              <h2 className="text-lg font-bold text-tena-text">Upcoming Consultations</h2>
            </div>
            <span className="text-xs text-tena-muted">Video & In-Clinic</span>
          </div>

          {loading ? (
            <div className="p-8 text-center bg-tena-surface rounded-2xl border border-tena-border text-xs text-tena-muted">
              Loading scheduled appointments...
            </div>
          ) : appointments.length === 0 ? (
            <div className="p-8 text-center bg-tena-surface rounded-2xl border border-tena-border space-y-3">
              <p className="text-xs text-tena-muted">You have no upcoming consultations scheduled.</p>
              <Link to="/doctors" className="inline-block text-xs font-semibold text-tena-emerald hover:underline">
                Find a Doctor and Book
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {appointments.map((apt) => (
                <div
                  key={apt._id}
                  className="p-6 rounded-2xl bg-tena-surface border border-tena-border glass-panel space-y-4"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-lg bg-tena-bg border border-tena-emerald/40 flex items-center justify-center text-tena-emerald">
                        <Stethoscope className="w-4 h-4" />
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-tena-text">
                          {apt.doctorId?.fullName || apt.doctorName || 'Dr. Selamawit Tadesse'}
                        </h4>
                        <span className="text-[11px] text-tena-cyan">
                          {apt.doctorId?.specialty || apt.specialty || 'General Medicine'}
                        </span>
                      </div>
                    </div>

                    <span className="px-2.5 py-1 rounded bg-tena-bg text-xs font-semibold text-tena-emerald border border-tena-border">
                      {apt.status || 'Confirmed'}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-2 p-3 rounded-xl bg-tena-bg border border-tena-border text-xs text-tena-muted">
                    <div className="flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5 text-tena-emerald" />
                      <span>{apt.appointmentDate?.toString().substring(0, 10) || 'Scheduled Date'}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-tena-cyan" />
                      <span>{apt.timeSlot || '10:00 AM'}</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-1">
                    <span className="text-xs text-tena-muted">Consultation Fee: <strong className="text-tena-text">{apt.fee || 500} {apt.currency || 'ETB'} (Paid)</strong></span>
                    <a
                      href={apt.meetingLink || 'https://meet.tena.ai'}
                      target="_blank"
                      rel="noreferrer"
                      className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-tena-emerald text-black font-bold text-xs hover:bg-tena-emerald-hover transition-colors"
                    >
                      <Video className="w-3.5 h-3.5" /> Join Telehealth Call
                    </a>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right Column: Active Prescriptions Wallet */}
        <div className="lg:col-span-5 space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <FileText className="w-4 h-4 text-tena-cyan" />
              <h2 className="text-lg font-bold text-tena-text">Active Prescriptions</h2>
            </div>
            <Link to="/lab-scanner" className="text-xs text-tena-emerald font-semibold hover:underline">
              Scan New
            </Link>
          </div>

          <div className="space-y-4">
            {samplePrescriptions.map((rx) => (
              <div
                key={rx.id}
                className="p-6 rounded-2xl bg-tena-surface border border-tena-border space-y-4"
              >
                <div className="flex items-center justify-between border-b border-tena-border pb-3">
                  <div>
                    <h4 className="text-xs font-bold text-tena-text">{rx.diagnosis}</h4>
                    <span className="text-[10px] text-tena-muted">Prescribed by {rx.doctor} • {rx.date}</span>
                  </div>
                  <span className="px-2 py-0.5 rounded bg-tena-bg text-[10px] text-tena-emerald border border-tena-border font-semibold">
                    Active
                  </span>
                </div>

                <div className="space-y-3">
                  {rx.items.map((item, idx) => (
                    <div key={idx} className="p-3 rounded-xl bg-tena-bg border border-tena-border space-y-2 text-xs">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-tena-text">{item.name}</span>
                        <span className="text-tena-muted text-[11px]">{item.days}</span>
                      </div>
                      
                      <div className="flex items-center justify-between pt-1 text-[11px]">
                        <span className="text-tena-muted">{item.frequency}</span>
                        <div className="flex gap-1 font-mono">
                          <span className={`px-1.5 py-0.5 rounded ${item.morning ? 'bg-tena-emerald/20 text-tena-emerald border border-tena-emerald/40' : 'text-tena-subtle'}`}>M</span>
                          <span className={`px-1.5 py-0.5 rounded ${item.afternoon ? 'bg-tena-emerald/20 text-tena-emerald border border-tena-emerald/40' : 'text-tena-subtle'}`}>A</span>
                          <span className={`px-1.5 py-0.5 rounded ${item.night ? 'bg-tena-emerald/20 text-tena-emerald border border-tena-emerald/40' : 'text-tena-subtle'}`}>N</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
}
