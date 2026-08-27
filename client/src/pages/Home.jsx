import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Activity, 
  Stethoscope, 
  FileText, 
  PhoneCall, 
  ShieldCheck, 
  Clock, 
  ArrowRight, 
  CheckCircle2, 
  Sparkles,
  Users,
  Award,
  Zap
} from 'lucide-react';

export default function Home() {
  const [selectedDemoSymptom, setSelectedDemoSymptom] = useState('Persistent dry cough & mild fever');

  const demoSymptoms = [
    'Persistent dry cough & mild fever',
    'Severe throbbing headache with light sensitivity',
    'Sharp lower right abdominal pain',
  ];

  return (
    <div className="space-y-24 pb-16">
      {/* Top Notification / Emergency Alert Banner */}
      <div className="bg-tena-surface/80 border-b border-tena-border py-2 px-4 text-center">
        <div className="max-w-7xl mx-auto flex items-center justify-center gap-3 text-xs text-tena-muted">
          <span className="flex h-2 w-2 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-tena-emerald opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-tena-emerald"></span>
          </span>
          <span>Tena AI 24/7 Health Engine is active across Addis Ababa and regional centers.</span>
          <Link to="/emergency" className="text-tena-emerald hover:underline font-semibold flex items-center gap-1">
            Emergency Dispatch <ArrowRight className="w-3 h-3" />
          </Link>
        </div>
      </div>

      {/* Hero Section */}
      <section className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 sm:pt-16">
        {/* Background glow effects */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[550px] h-[300px] bg-tena-emerald/10 blur-[130px] rounded-full pointer-events-none" />
        <div className="absolute top-1/3 right-10 w-[350px] h-[250px] bg-tena-cyan/10 blur-[100px] rounded-full pointer-events-none" />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Hero Left Content */}
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-tena-surface border border-tena-emerald/40 text-xs font-semibold text-tena-emerald">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Next-Gen Health Intelligence for Ethiopia</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-tena-text tracking-tight leading-[1.15]">
              Smart Healthcare. <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-tena-emerald via-tena-cyan to-teal-400">
                Instant. Accessible. Reliable.
              </span>
            </h1>

            <p className="text-base sm:text-lg text-tena-muted max-w-xl leading-relaxed">
              Evaluate symptoms in plain language, consult verified physicians, and understand your medical prescriptions without long clinic queues.
            </p>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 pt-2">
              <Link
                to="/triage"
                className="flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-xl bg-tena-emerald hover:bg-tena-emerald-hover text-black font-bold text-base transition-all shadow-glow-emerald"
              >
                <Activity className="w-5 h-5" />
                Start AI Symptom Triage
              </Link>
              <Link
                to="/doctors"
                className="flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-tena-surface hover:bg-tena-surface/80 border border-tena-border text-tena-text font-semibold text-base transition-all"
              >
                <Stethoscope className="w-5 h-5 text-tena-cyan" />
                Book Doctor Consult
              </Link>
            </div>

            {/* Trust Badges */}
            <div className="pt-6 border-t border-tena-border/70 grid grid-cols-3 gap-4 text-xs text-tena-muted">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-tena-emerald flex-shrink-0" />
                <span>Zero Wait Triage</span>
              </div>
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-tena-emerald flex-shrink-0" />
                <span>Verified Physicians</span>
              </div>
              <div className="flex items-center gap-2">
                <Award className="w-4 h-4 text-tena-emerald flex-shrink-0" />
                <span>Safe Guidance</span>
              </div>
            </div>
          </div>

          {/* Hero Right Interactive Card (Interactive Triage Preview) */}
          <div className="lg:col-span-5">
            <div className="p-6 rounded-2xl bg-tena-surface border border-tena-border shadow-card relative overflow-hidden space-y-5">
              
              <div className="flex items-center justify-between border-b border-tena-border pb-4">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-tena-emerald animate-pulse" />
                  <span className="text-xs font-semibold uppercase tracking-wider text-tena-muted">Live Triage Demo</span>
                </div>
                <span className="px-2.5 py-1 rounded bg-tena-bg text-[11px] font-mono text-tena-cyan border border-tena-border">
                  Gemini Pro Engine
                </span>
              </div>

              {/* Sample Selector */}
              <div className="space-y-2">
                <label className="text-xs text-tena-muted font-medium">Select Sample Scenario:</label>
                <div className="space-y-1.5">
                  {demoSymptoms.map((symp) => (
                    <button
                      key={symp}
                      onClick={() => setSelectedDemoSymptom(symp)}
                      className={`w-full text-left text-xs px-3 py-2 rounded-lg border transition-all ${
                        selectedDemoSymptom === symp
                          ? 'bg-tena-bg border-tena-emerald text-tena-text font-medium'
                          : 'bg-tena-surface border-tena-border text-tena-muted hover:border-tena-border-light'
                      }`}
                    >
                      {symp}
                    </button>
                  ))}
                </div>
              </div>

              {/* Instant Output Simulation Card */}
              <div className="p-4 rounded-xl bg-tena-bg border border-tena-border space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-tena-text">Severity Assessment</span>
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-500/15 text-amber-400 border border-amber-500/30">
                    Moderate Risk
                  </span>
                </div>
                <p className="text-xs text-tena-muted leading-relaxed">
                  Symptoms match standard upper respiratory infection with mild viral inflammation. No acute red flags observed.
                </p>
                <div className="text-xs text-tena-subtle flex items-center justify-between pt-2 border-t border-tena-border/50">
                  <span>Recommended Specialist:</span>
                  <span className="font-semibold text-tena-emerald">General Practitioner</span>
                </div>
              </div>

              <Link
                to="/triage"
                className="w-full flex items-center justify-center gap-2 py-2.5 rounded-lg bg-tena-emerald/10 hover:bg-tena-emerald/20 text-tena-emerald border border-tena-emerald/30 text-xs font-semibold transition-all"
              >
                Run Personalized Check <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>

        </div>
      </section>

      {/* Core Capabilities Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <span className="text-xs font-bold uppercase tracking-wider text-tena-emerald">Comprehensive Services</span>
          <h2 className="text-3xl font-extrabold text-tena-text">Everything You Need for Total Health</h2>
          <p className="text-sm text-tena-muted">Designed for clarity, fast response, and complete privacy.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          
          {/* Card 1: AI Triage */}
          <div className="p-6 rounded-2xl bg-tena-surface border border-tena-border glass-panel-hover space-y-4">
            <div className="w-12 h-12 rounded-xl bg-tena-bg border border-tena-emerald/30 flex items-center justify-center text-tena-emerald">
              <Activity className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-tena-text">AI Symptom Triage</h3>
            <p className="text-xs text-tena-muted leading-relaxed">
              Step-by-step clinical questions that analyze symptom patterns, severity ratings, and potential red flags in seconds.
            </p>
            <Link to="/triage" className="inline-flex items-center gap-1.5 text-xs font-semibold text-tena-emerald hover:underline">
              Start Assessment <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {/* Card 2: Doctor Consultations */}
          <div className="p-6 rounded-2xl bg-tena-surface border border-tena-border glass-panel-hover space-y-4">
            <div className="w-12 h-12 rounded-xl bg-tena-bg border border-tena-cyan/30 flex items-center justify-center text-tena-cyan">
              <Stethoscope className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-tena-text">Telehealth Consults</h3>
            <p className="text-xs text-tena-muted leading-relaxed">
              Book scheduled video and chat appointments with certified Ethiopian doctors across primary care and sub-specialties.
            </p>
            <Link to="/doctors" className="inline-flex items-center gap-1.5 text-xs font-semibold text-tena-cyan hover:underline">
              Find a Doctor <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {/* Card 3: Prescription Scanner */}
          <div className="p-6 rounded-2xl bg-tena-surface border border-tena-border glass-panel-hover space-y-4">
            <div className="w-12 h-12 rounded-xl bg-tena-bg border border-tena-emerald/30 flex items-center justify-center text-tena-emerald">
              <FileText className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-tena-text">Prescription OCR</h3>
            <p className="text-xs text-tena-muted leading-relaxed">
              Upload prescription photos or lab sheets to extract dosage timings (Morning/Noon/Night) and drug safety reminders.
            </p>
            <Link to="/lab-scanner" className="inline-flex items-center gap-1.5 text-xs font-semibold text-tena-emerald hover:underline">
              Scan Document <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {/* Card 4: Emergency Center */}
          <div className="p-6 rounded-2xl bg-tena-surface border border-tena-border glass-panel-hover space-y-4">
            <div className="w-12 h-12 rounded-xl bg-tena-bg border border-red-500/30 flex items-center justify-center text-red-400">
              <PhoneCall className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-tena-text">Emergency Routing</h3>
            <p className="text-xs text-tena-muted leading-relaxed">
              Instant access to direct ambulance hotline numbers (907 / 992), 24-hour trauma hospitals, and nearest pharmacies.
            </p>
            <Link to="/emergency" className="inline-flex items-center gap-1.5 text-xs font-semibold text-red-400 hover:underline">
              Emergency Center <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

        </div>
      </section>

      {/* Verified Doctors Spotlight */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-tena-cyan">Clinical Network</span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-tena-text mt-1">Verified Medical Professionals</h2>
          </div>
          <Link
            to="/doctors"
            className="inline-flex items-center gap-2 text-xs font-semibold text-tena-emerald hover:underline"
          >
            View All Physicians <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          <div className="p-6 rounded-2xl bg-tena-surface border border-tena-border space-y-4">
            <div className="flex items-center justify-between">
              <span className="px-2.5 py-1 rounded bg-tena-bg text-xs font-medium text-tena-emerald border border-tena-border">
                General Medicine
              </span>
              <span className="text-xs font-bold text-tena-text">450 ETB</span>
            </div>
            <div>
              <h4 className="text-base font-bold text-tena-text">Dr. Selamawit Tadesse</h4>
              <p className="text-xs text-tena-muted">St. Paul Hospital Millennium Medical College</p>
            </div>
            <p className="text-xs text-tena-subtle leading-relaxed">
              7+ years clinical experience in outpatient care, preventative diagnostics, and common infections.
            </p>
            <Link
              to="/doctors"
              className="w-full flex items-center justify-center py-2.5 rounded-lg bg-tena-bg hover:bg-tena-emerald hover:text-black border border-tena-border text-xs font-semibold transition-all"
            >
              Book Consultation
            </Link>
          </div>

          <div className="p-6 rounded-2xl bg-tena-surface border border-tena-border space-y-4">
            <div className="flex items-center justify-between">
              <span className="px-2.5 py-1 rounded bg-tena-bg text-xs font-medium text-tena-cyan border border-tena-border">
                Cardiology
              </span>
              <span className="text-xs font-bold text-tena-text">800 ETB</span>
            </div>
            <div>
              <h4 className="text-base font-bold text-tena-text">Dr. Henok Bekele</h4>
              <p className="text-xs text-tena-muted">Tikur Anbessa Specialized Hospital</p>
            </div>
            <p className="text-xs text-tena-subtle leading-relaxed">
              12+ years experience in cardiovascular care, hypertension treatment, and cardiac monitoring.
            </p>
            <Link
              to="/doctors"
              className="w-full flex items-center justify-center py-2.5 rounded-lg bg-tena-bg hover:bg-tena-emerald hover:text-black border border-tena-border text-xs font-semibold transition-all"
            >
              Book Consultation
            </Link>
          </div>

          <div className="p-6 rounded-2xl bg-tena-surface border border-tena-border space-y-4">
            <div className="flex items-center justify-between">
              <span className="px-2.5 py-1 rounded bg-tena-bg text-xs font-medium text-tena-emerald border border-tena-border">
                Pediatrics
              </span>
              <span className="text-xs font-bold text-tena-text">500 ETB</span>
            </div>
            <div>
              <h4 className="text-base font-bold text-tena-text">Dr. Bethlehem Alemu</h4>
              <p className="text-xs text-tena-muted">Bethzatha Children Hospital</p>
            </div>
            <p className="text-xs text-tena-subtle leading-relaxed">
              6+ years in pediatric healthcare, childhood vaccination schedules, and infant wellness.
            </p>
            <Link
              to="/doctors"
              className="w-full flex items-center justify-center py-2.5 rounded-lg bg-tena-bg hover:bg-tena-emerald hover:text-black border border-tena-border text-xs font-semibold transition-all"
            >
              Book Consultation
            </Link>
          </div>

        </div>
      </section>

      {/* Bottom CTA Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="p-8 sm:p-12 rounded-3xl bg-gradient-to-r from-tena-surface via-tena-card to-tena-surface border border-tena-border relative overflow-hidden text-center space-y-6">
          <div className="max-w-2xl mx-auto space-y-3">
            <h2 className="text-2xl sm:text-4xl font-extrabold text-tena-text">Take Control of Your Health Today</h2>
            <p className="text-xs sm:text-sm text-tena-muted leading-relaxed">
              Get an accurate, instant triage assessment in less than 2 minutes. Free, secure, and available 24/7.
            </p>
          </div>
          <div className="flex justify-center">
            <Link
              to="/triage"
              className="flex items-center gap-2.5 px-8 py-4 rounded-xl bg-tena-emerald hover:bg-tena-emerald-hover text-black font-bold text-sm transition-all shadow-glow-emerald"
            >
              <Activity className="w-4 h-4" />
              Check Symptoms Now
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
