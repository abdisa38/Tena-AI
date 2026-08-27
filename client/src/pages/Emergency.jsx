import React, { useState, useEffect } from 'react';
import { 
  PhoneCall, 
  MapPin, 
  Clock, 
  ShieldAlert, 
  AlertTriangle, 
  HeartPulse, 
  CheckCircle2,
  Ambulance,
  Building2,
  Navigation
} from 'lucide-react';
import api from '../services/api';

export default function Emergency() {
  const [facilities, setFacilities] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchFacilities();
  }, []);

  const fetchFacilities = async () => {
    try {
      const res = await api.get('/doctors/facilities');
      if (res.data.success) {
        setFacilities(res.data.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const emergencyHotlines = [
    { title: 'Addis Ababa Emergency Ambulance', number: '907', desc: 'City-wide medical ambulance and paramedic response unit' },
    { title: 'Ethiopian Red Cross Ambulance', number: '992', desc: 'Emergency trauma dispatch and patient transport' },
    { title: 'Emergency Police Dispatch', number: '991', desc: 'Immediate civil emergency and road accident response' },
    { title: 'Fire & Rescue Agency', number: '939', desc: 'Rescue operations and accident containment' },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">
      
      {/* Top Banner */}
      <div className="p-6 sm:p-8 rounded-3xl bg-red-950/40 border border-red-500/40 space-y-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-red-500/20 border border-red-500/40 flex items-center justify-center text-red-400">
            <PhoneCall className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-black text-red-100">Emergency Healthcare Dispatch</h1>
            <p className="text-xs text-red-200/80">In a life-threatening situation, call the numbers below immediately.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-2">
          {emergencyHotlines.map((hotline) => (
            <a
              key={hotline.number}
              href={`tel:${hotline.number}`}
              className="p-4 rounded-2xl bg-tena-surface/90 border border-red-500/30 hover:border-red-400 transition-all space-y-2 group block"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-tena-text">{hotline.title}</span>
                <PhoneCall className="w-4 h-4 text-red-400 group-hover:scale-110 transition-transform" />
              </div>
              <div className="text-2xl font-black text-red-400 font-mono">
                {hotline.number}
              </div>
              <p className="text-[11px] text-tena-muted leading-tight">{hotline.desc}</p>
            </a>
          ))}
        </div>
      </div>

      {/* Hospital & Trauma Centers Directory */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-tena-emerald">24/7 Facility Network</span>
            <h2 className="text-2xl font-extrabold text-tena-text mt-1">Hospitals & Trauma Centers</h2>
          </div>
          <span className="text-xs text-tena-muted">Addis Ababa & Regional Centers</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {facilities.map((fac) => (
            <div
              key={fac.id}
              className="p-6 rounded-2xl bg-tena-surface border border-tena-border space-y-4 flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="px-2.5 py-1 rounded bg-tena-bg text-[11px] font-semibold text-tena-cyan border border-tena-border">
                    {fac.type}
                  </span>
                  {fac.is24Hours && (
                    <span className="text-[11px] font-bold text-tena-emerald flex items-center gap-1">
                      <Clock className="w-3 h-3" /> 24 Hours
                    </span>
                  )}
                </div>

                <h3 className="text-base font-bold text-tena-text">{fac.name}</h3>
                
                <p className="text-xs text-tena-muted flex items-start gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-tena-subtle flex-shrink-0 mt-0.5" />
                  <span>{fac.address}, {fac.subCity}</span>
                </p>

                <div className="pt-2 text-xs space-y-1">
                  <div className="flex justify-between text-tena-muted">
                    <span>Direct Phone:</span>
                    <a href={`tel:${fac.phoneNumber}`} className="text-tena-emerald font-semibold hover:underline">
                      {fac.phoneNumber}
                    </a>
                  </div>
                  <div className="flex justify-between text-tena-muted">
                    <span>Ambulance Equipped:</span>
                    <span className="text-tena-text font-medium">{fac.hasAmbulance ? 'Yes' : 'No'}</span>
                  </div>
                </div>
              </div>

              <a
                href={`tel:${fac.phoneNumber}`}
                className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-tena-bg hover:bg-tena-emerald hover:text-black border border-tena-border text-xs font-semibold transition-all"
              >
                <PhoneCall className="w-3.5 h-3.5" /> Call Facility
              </a>
            </div>
          ))}
        </div>
      </div>

      {/* Emergency First-Aid Protocols */}
      <div className="space-y-6">
        <div className="space-y-1">
          <span className="text-xs font-bold uppercase tracking-wider text-tena-cyan">Emergency Guidance</span>
          <h2 className="text-2xl font-extrabold text-tena-text">First Aid While Waiting for Paramedics</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          <div className="p-6 rounded-2xl bg-tena-surface border border-tena-border space-y-3">
            <h4 className="text-sm font-bold text-tena-text flex items-center gap-2">
              <HeartPulse className="w-4 h-4 text-red-400" />
              Suspected Heart Attack / Chest Pain
            </h4>
            <ul className="text-xs text-tena-muted space-y-2 list-disc pl-4 leading-relaxed">
              <li>Seat the patient comfortably in a resting position with back supported.</li>
              <li>Loosen all tight clothing around the chest and neck.</li>
              <li>Keep patient calm and still. Do not give food or hot drinks.</li>
              <li>Dial 907 immediately for paramedic ambulance transport.</li>
            </ul>
          </div>

          <div className="p-6 rounded-2xl bg-tena-surface border border-tena-border space-y-3">
            <h4 className="text-sm font-bold text-tena-text flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 text-amber-400" />
              Severe Bleeding or Trauma
            </h4>
            <ul className="text-xs text-tena-muted space-y-2 list-disc pl-4 leading-relaxed">
              <li>Apply firm, continuous direct pressure to the wound with a clean cloth.</li>
              <li>If possible, elevate the injured area above the heart level.</li>
              <li>Do not remove deeply embedded objects; apply pressure around them.</li>
              <li>Keep the person warm with a blanket to prevent shock.</li>
            </ul>
          </div>

          <div className="p-6 rounded-2xl bg-tena-surface border border-tena-border space-y-3">
            <h4 className="text-sm font-bold text-tena-text flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-tena-cyan" />
              Breathing Difficulty / Asthma
            </h4>
            <ul className="text-xs text-tena-muted space-y-2 list-disc pl-4 leading-relaxed">
              <li>Help the person sit upright leaning slightly forward.</li>
              <li>Assist them in using their prescribed inhaler (e.g. Salbutamol).</li>
              <li>Ensure plenty of fresh air circulation and avoid crowds.</li>
              <li>If lips turn bluish or speech is impossible, call 907 immediately.</li>
            </ul>
          </div>

        </div>
      </div>

    </div>
  );
}
