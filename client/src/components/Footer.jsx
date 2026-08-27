import React from 'react';
import { Link } from 'react-router-dom';
import { Activity, ShieldCheck, HeartPulse, PhoneCall, ArrowUpRight } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="border-t border-tena-border bg-tena-surface/50 text-tena-muted mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          
          {/* Brand Col */}
          <div className="space-y-4 md:col-span-1">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-tena-surface border border-tena-emerald/40 flex items-center justify-center text-tena-emerald">
                <Activity className="w-4 h-4" />
              </div>
              <span className="font-bold text-lg text-tena-text">
                Tena <span className="text-tena-emerald">AI</span>
              </span>
            </div>
            <p className="text-xs text-tena-muted leading-relaxed">
              Intelligent health triage, prescription analysis, and teleconsultation platform built to enhance healthcare access across Ethiopia.
            </p>
            <div className="flex items-center gap-2 text-xs text-tena-emerald font-medium">
              <ShieldCheck className="w-4 h-4" />
              <span>Compliant with standard clinical safety guidelines</span>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-tena-text">Platform</h4>
            <ul className="space-y-2 text-xs">
              <li><Link to="/triage" className="hover:text-tena-emerald transition-colors">AI Symptom Checker</Link></li>
              <li><Link to="/doctors" className="hover:text-tena-emerald transition-colors">Find Verified Doctors</Link></li>
              <li><Link to="/lab-scanner" className="hover:text-tena-emerald transition-colors">Prescription OCR Scanner</Link></li>
              <li><Link to="/emergency" className="hover:text-tena-emerald transition-colors">Emergency Centers & Ambulance</Link></li>
            </ul>
          </div>

          {/* Clinical Disclaimer */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-tena-text">Medical Notice</h4>
            <p className="text-xs text-tena-subtle leading-relaxed">
              Tena AI provides preliminary health triage and educational assessments. It does not replace certified in-person physician diagnoses. In life-threatening emergencies, dial 907 immediately.
            </p>
          </div>

          {/* Emergency Dispatch */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-tena-text">Emergency Numbers</h4>
            <div className="bg-tena-bg p-3.5 rounded-xl border border-tena-border space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span>Addis Ababa Ambulance:</span>
                <span className="font-bold text-tena-emerald">907</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span>Red Cross Emergency:</span>
                <span className="font-bold text-tena-emerald">992</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span>Police Dispatch:</span>
                <span className="font-bold text-tena-text">991</span>
              </div>
            </div>
          </div>

        </div>

        <div className="pt-8 border-t border-tena-border/60 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-tena-subtle">
          <p>&copy; {new Date().getFullYear()} Tena AI Healthcare Systems. All rights reserved.</p>
          <div className="flex gap-6">
            <span className="hover:text-tena-muted cursor-pointer">Privacy Protocol</span>
            <span className="hover:text-tena-muted cursor-pointer">Clinical Governance</span>
            <span className="hover:text-tena-muted cursor-pointer">Security Standards</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
