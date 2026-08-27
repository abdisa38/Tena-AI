import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Activity, 
  AlertTriangle, 
  CheckCircle2, 
  Stethoscope, 
  ArrowRight, 
  RotateCcw, 
  Info, 
  ShieldAlert, 
  Sparkles,
  PhoneCall,
  Download
} from 'lucide-react';
import api from '../services/api';

export default function Triage() {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');

  // Form State
  const [age, setAge] = useState(28);
  const [gender, setGender] = useState('female');
  const [selectedSymptoms, setSelectedSymptoms] = useState([]);
  const [customSymptom, setCustomSymptom] = useState('');
  const [duration, setDuration] = useState('1-3 days');
  const [severityRating, setSeverityRating] = useState(5);
  const [conditions, setConditions] = useState([]);

  const commonSymptoms = [
    'Fever / Chills',
    'Persistent Cough',
    'Severe Headache',
    'Chest Tightness / Pain',
    'Shortness of Breath',
    'Sore Throat',
    'Abdominal Pain',
    'Nausea / Vomiting',
    'Dizziness / Weakness',
    'Joint / Muscle Aches',
    'Skin Rash / Itching',
    'Diarrhea'
  ];

  const commonConditions = [
    'Hypertension (High Blood Pressure)',
    'Diabetes',
    'Asthma / Respiratory Disease',
    'Heart Condition',
    'Pregnancy',
    'None'
  ];

  const toggleSymptom = (symp) => {
    if (selectedSymptoms.includes(symp)) {
      setSelectedSymptoms(selectedSymptoms.filter(s => s !== symp));
    } else {
      setSelectedSymptoms([...selectedSymptoms, symp]);
    }
  };

  const addCustomSymptom = (e) => {
    e.preventDefault();
    if (customSymptom.trim() && !selectedSymptoms.includes(customSymptom.trim())) {
      setSelectedSymptoms([...selectedSymptoms, customSymptom.trim()]);
      setCustomSymptom('');
    }
  };

  const toggleCondition = (cond) => {
    if (cond === 'None') {
      setConditions(['None']);
      return;
    }
    const filtered = conditions.filter(c => c !== 'None');
    if (filtered.includes(cond)) {
      setConditions(filtered.filter(c => c !== cond));
    } else {
      setConditions([...filtered, cond]);
    }
  };

  const handleSubmit = async () => {
    if (selectedSymptoms.length === 0) {
      setError('Please select or add at least one symptom.');
      return;
    }
    setError('');
    setLoading(true);

    try {
      const res = await api.post('/ai/triage/assess', {
        patientAge: Number(age),
        patientGender: gender,
        symptoms: selectedSymptoms,
        symptomDuration: duration,
        severityRating: Number(severityRating),
        existingConditions: conditions,
      });

      if (res.data.success) {
        setResult(res.data.data);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Error processing symptom assessment. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const resetTriage = () => {
    setResult(null);
    setSelectedSymptoms([]);
    setStep(1);
    setError('');
  };

  // Badge Color Helper
  const getSeverityBadge = (level) => {
    switch (level) {
      case 'Emergency':
        return {
          bg: 'bg-red-500/15 border-red-500/40 text-red-400',
          dot: 'bg-red-500',
          title: 'Immediate Emergency Care Required',
          desc: 'Please contact emergency services or go to the nearest emergency room immediately.'
        };
      case 'Urgent':
        return {
          bg: 'bg-amber-500/15 border-amber-500/40 text-amber-400',
          dot: 'bg-amber-500',
          title: 'Urgent Care Recommended',
          desc: 'A clinical evaluation is advised within the next 12 to 24 hours.'
        };
      case 'Moderate':
        return {
          bg: 'bg-yellow-500/15 border-yellow-500/40 text-yellow-400',
          dot: 'bg-yellow-500',
          title: 'Moderate Severity',
          desc: 'Schedule a routine consultation with a doctor to discuss symptom management.'
        };
      default:
        return {
          bg: 'bg-tena-emerald/15 border-tena-emerald/40 text-tena-emerald',
          dot: 'bg-tena-emerald',
          title: 'Low Severity / Self-Care',
          desc: 'Symptoms appear mild and manageable with rest and hydration.'
        };
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-tena-surface border border-tena-emerald/30 text-xs font-semibold text-tena-emerald">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Gemini Pro Clinical Triage</span>
        </div>
        <h1 className="text-3xl font-extrabold text-tena-text">AI Symptom Evaluation</h1>
        <p className="text-xs sm:text-sm text-tena-muted">
          Answer a few quick questions to receive an instant, evidence-guided triage summary and next steps.
        </p>
      </div>

      {/* Main Flow Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Column: Interactive Steps */}
        <div className="lg:col-span-7 space-y-6">
          <div className="p-6 sm:p-8 rounded-2xl bg-tena-surface border border-tena-border space-y-6">
            
            {/* Step Indicators */}
            <div className="flex items-center justify-between border-b border-tena-border pb-4">
              <span className="text-xs font-bold uppercase tracking-wider text-tena-muted">
                Step {step} of 3
              </span>
              <div className="flex items-center gap-2">
                <div className={`h-1.5 w-8 rounded-full ${step >= 1 ? 'bg-tena-emerald' : 'bg-tena-border'}`} />
                <div className={`h-1.5 w-8 rounded-full ${step >= 2 ? 'bg-tena-emerald' : 'bg-tena-border'}`} />
                <div className={`h-1.5 w-8 rounded-full ${step >= 3 ? 'bg-tena-emerald' : 'bg-tena-border'}`} />
              </div>
            </div>

            {error && (
              <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 text-xs flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 flex-shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {/* STEP 1: Basic Info */}
            {step === 1 && (
              <div className="space-y-5">
                <h3 className="text-base font-bold text-tena-text">Patient Demographics</h3>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-xs text-tena-muted font-medium">Age</label>
                    <input
                      type="number"
                      min="1"
                      max="120"
                      value={age}
                      onChange={(e) => setAge(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-lg bg-tena-bg border border-tena-border text-tena-text text-sm focus:outline-none focus:border-tena-emerald"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs text-tena-muted font-medium">Biological Gender</label>
                    <select
                      value={gender}
                      onChange={(e) => setGender(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-lg bg-tena-bg border border-tena-border text-tena-text text-sm focus:outline-none focus:border-tena-emerald"
                    >
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                      <option value="other">Other / Unspecified</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs text-tena-muted font-medium">Pre-existing Health Conditions (if any)</label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {commonConditions.map((cond) => (
                      <button
                        key={cond}
                        type="button"
                        onClick={() => toggleCondition(cond)}
                        className={`text-left text-xs px-3 py-2 rounded-lg border transition-all ${
                          conditions.includes(cond)
                            ? 'bg-tena-emerald/10 border-tena-emerald text-tena-emerald font-medium'
                            : 'bg-tena-bg border-tena-border text-tena-muted hover:border-tena-border-light'
                        }`}
                      >
                        {cond}
                      </button>
                    ))}
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className="w-full flex items-center justify-center gap-2 py-3 rounded-lg bg-tena-emerald hover:bg-tena-emerald-hover text-black font-bold text-xs transition-all"
                >
                  Continue to Symptoms <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            )}

            {/* STEP 2: Symptoms Selection */}
            {step === 2 && (
              <div className="space-y-5">
                <h3 className="text-base font-bold text-tena-text">Select Observed Symptoms</h3>
                
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {commonSymptoms.map((symp) => (
                    <button
                      key={symp}
                      type="button"
                      onClick={() => toggleSymptom(symp)}
                      className={`text-left text-xs px-3 py-2.5 rounded-lg border transition-all ${
                        selectedSymptoms.includes(symp)
                          ? 'bg-tena-emerald/10 border-tena-emerald text-tena-emerald font-semibold'
                          : 'bg-tena-bg border-tena-border text-tena-muted hover:border-tena-border-light'
                      }`}
                    >
                      {symp}
                    </button>
                  ))}
                </div>

                {/* Custom Symptom Adder */}
                <div className="pt-2">
                  <label className="text-xs text-tena-muted font-medium">Or type a specific symptom:</label>
                  <div className="flex gap-2 mt-1.5">
                    <input
                      type="text"
                      placeholder="e.g. sharp lower back pain"
                      value={customSymptom}
                      onChange={(e) => setCustomSymptom(e.target.value)}
                      className="flex-1 px-3.5 py-2 rounded-lg bg-tena-bg border border-tena-border text-tena-text text-xs focus:outline-none focus:border-tena-emerald"
                    />
                    <button
                      type="button"
                      onClick={addCustomSymptom}
                      className="px-4 py-2 rounded-lg bg-tena-surface hover:bg-tena-border border border-tena-border text-xs text-tena-text font-semibold"
                    >
                      Add
                    </button>
                  </div>
                </div>

                {/* Selected List Pills */}
                {selectedSymptoms.length > 0 && (
                  <div className="p-3 rounded-lg bg-tena-bg border border-tena-border space-y-2">
                    <span className="text-[11px] font-semibold text-tena-muted uppercase">Selected ({selectedSymptoms.length}):</span>
                    <div className="flex flex-wrap gap-1.5">
                      {selectedSymptoms.map((s) => (
                        <span
                          key={s}
                          onClick={() => toggleSymptom(s)}
                          className="cursor-pointer text-xs px-2.5 py-1 rounded-md bg-tena-surface border border-tena-emerald/40 text-tena-emerald hover:line-through"
                        >
                          {s} ✕
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                <div className="flex gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setStep(1)}
                    className="w-1/3 py-3 rounded-lg bg-tena-bg border border-tena-border text-tena-muted hover:text-white text-xs font-semibold"
                  >
                    Back
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      if (selectedSymptoms.length === 0) {
                        setError('Please select at least one symptom.');
                        return;
                      }
                      setError('');
                      setStep(3);
                    }}
                    className="flex-1 flex items-center justify-center gap-2 py-3 rounded-lg bg-tena-emerald hover:bg-tena-emerald-hover text-black font-bold text-xs transition-all"
                  >
                    Next: Duration & Severity <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            {/* STEP 3: Duration & Severity */}
            {step === 3 && (
              <div className="space-y-5">
                <h3 className="text-base font-bold text-tena-text">Duration & Discomfort Level</h3>

                <div className="space-y-2">
                  <label className="text-xs text-tena-muted font-medium">How long have you had these symptoms?</label>
                  <select
                    value={duration}
                    onChange={(e) => setDuration(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-lg bg-tena-bg border border-tena-border text-tena-text text-sm focus:outline-none focus:border-tena-emerald"
                  >
                    <option value="Less than 24 hours">Less than 24 hours</option>
                    <option value="1-3 days">1 to 3 days</option>
                    <option value="4-7 days">4 to 7 days</option>
                    <option value="1-2 weeks">1 to 2 weeks</option>
                    <option value="More than 2 weeks">More than 2 weeks</option>
                  </select>
                </div>

                <div className="space-y-3 pt-2">
                  <div className="flex justify-between items-center text-xs">
                    <label className="text-tena-muted font-medium">Severity / Pain Scale (1 to 10):</label>
                    <span className="font-bold text-tena-emerald text-sm px-2.5 py-0.5 rounded bg-tena-bg border border-tena-border">
                      {severityRating} / 10
                    </span>
                  </div>
                  <input
                    type="range"
                    min="1"
                    max="10"
                    value={severityRating}
                    onChange={(e) => setSeverityRating(e.target.value)}
                    className="w-full h-2 bg-tena-bg rounded-lg appearance-none cursor-pointer accent-tena-emerald border border-tena-border"
                  />
                  <div className="flex justify-between text-[11px] text-tena-subtle">
                    <span>1: Mild / Noticeable</span>
                    <span>5: Moderate / Limits Tasks</span>
                    <span>10: Severe / Unbearable</span>
                  </div>
                </div>

                <div className="p-3.5 rounded-xl bg-tena-bg border border-tena-border text-xs text-tena-muted flex items-start gap-2.5">
                  <Info className="w-4 h-4 text-tena-cyan flex-shrink-0 mt-0.5" />
                  <span>
                    Your responses are processed securely and evaluated using standard clinical risk criteria.
                  </span>
                </div>

                <div className="flex gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setStep(2)}
                    className="w-1/3 py-3 rounded-lg bg-tena-bg border border-tena-border text-tena-muted hover:text-white text-xs font-semibold"
                  >
                    Back
                  </button>
                  <button
                    type="button"
                    disabled={loading}
                    onClick={handleSubmit}
                    className="flex-1 flex items-center justify-center gap-2 py-3 rounded-lg bg-tena-emerald hover:bg-tena-emerald-hover text-black font-bold text-xs transition-all shadow-glow-emerald disabled:opacity-50"
                  >
                    {loading ? (
                      <span className="flex items-center gap-2">
                        <Activity className="w-4 h-4 animate-spin" /> Evaluating Symptoms...
                      </span>
                    ) : (
                      <>
                        <Sparkles className="w-4 h-4" /> Generate Triage Assessment
                      </>
                    )}
                  </button>
                </div>
              </div>
            )}

          </div>
        </div>

        {/* Right Column: Diagnostic Result Card */}
        <div className="lg:col-span-5">
          {result ? (
            <div className="p-6 rounded-2xl bg-tena-surface border border-tena-border shadow-card space-y-5 animate-in fade-in duration-300">
              
              {/* Header & Severity Badge */}
              <div className="border-b border-tena-border pb-4 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-tena-muted">Triage Result</span>
                  <button
                    onClick={resetTriage}
                    className="flex items-center gap-1 text-[11px] text-tena-muted hover:text-tena-text"
                  >
                    <RotateCcw className="w-3 h-3" /> New Check
                  </button>
                </div>

                {(() => {
                  const badge = getSeverityBadge(result.severityLevel);
                  return (
                    <div className={`p-3.5 rounded-xl border ${badge.bg} space-y-1`}>
                      <div className="flex items-center gap-2">
                        <span className={`w-2.5 h-2.5 rounded-full ${badge.dot}`} />
                        <span className="text-sm font-bold">{badge.title}</span>
                      </div>
                      <p className="text-xs opacity-90 leading-relaxed">{badge.desc}</p>
                    </div>
                  );
                })()}
              </div>

              {/* Clinical Summary */}
              <div className="space-y-2">
                <h4 className="text-xs font-bold uppercase tracking-wider text-tena-text">Clinical Assessment</h4>
                <p className="text-xs text-tena-muted leading-relaxed bg-tena-bg p-3 rounded-xl border border-tena-border">
                  {result.clinicalSummary}
                </p>
              </div>

              {/* Possible Conditions */}
              {result.possibleConditions && result.possibleConditions.length > 0 && (
                <div className="space-y-2">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-tena-text">Possible Explanations</h4>
                  <ul className="space-y-1.5 text-xs text-tena-muted">
                    {result.possibleConditions.map((cond, idx) => (
                      <li key={idx} className="flex items-center gap-2">
                        <CheckCircle2 className="w-3.5 h-3.5 text-tena-emerald flex-shrink-0" />
                        <span>{cond}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Recommended Next Actions */}
              <div className="space-y-2">
                <h4 className="text-xs font-bold uppercase tracking-wider text-tena-text">Recommended Next Steps</h4>
                <ul className="space-y-2 text-xs text-tena-muted">
                  {result.recommendedActions.map((act, idx) => (
                    <li key={idx} className="p-2.5 rounded-lg bg-tena-bg border border-tena-border flex items-start gap-2">
                      <span className="font-bold text-tena-emerald text-xs">{idx + 1}.</span>
                      <span>{act}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Red Flags Alert if present */}
              {result.redFlags && result.redFlags.length > 0 && (
                <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 space-y-1.5">
                  <div className="flex items-center gap-2 text-xs font-bold">
                    <ShieldAlert className="w-4 h-4 flex-shrink-0" />
                    <span>Watch for Red Flag Symptoms:</span>
                  </div>
                  <ul className="text-xs space-y-1 pl-6 list-disc opacity-90">
                    {result.redFlags.map((flag, idx) => (
                      <li key={idx}>{flag}</li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Action Buttons */}
              <div className="pt-2 space-y-2">
                {result.severityLevel === 'Emergency' ? (
                  <Link
                    to="/emergency"
                    className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-red-500 hover:bg-red-600 text-white font-bold text-xs transition-all shadow-lg"
                  >
                    <PhoneCall className="w-4 h-4" /> Call Emergency Ambulance (907)
                  </Link>
                ) : (
                  <Link
                    to="/doctors"
                    className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-tena-emerald hover:bg-tena-emerald-hover text-black font-bold text-xs transition-all shadow-glow-emerald"
                  >
                    <Stethoscope className="w-4 h-4" /> Book Doctor Consultation
                  </Link>
                )}
              </div>

            </div>
          ) : (
            <div className="p-8 rounded-2xl bg-tena-surface/50 border border-tena-border text-center space-y-4">
              <div className="w-12 h-12 rounded-xl bg-tena-bg border border-tena-border flex items-center justify-center text-tena-muted mx-auto">
                <Activity className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <h4 className="text-sm font-bold text-tena-text">Triage Summary Preview</h4>
                <p className="text-xs text-tena-muted max-w-xs mx-auto leading-relaxed">
                  Complete the questionnaire on the left to generate your live clinical severity assessment.
                </p>
              </div>
            </div>
          )}
        </div>

      </div>

    </div>
  );
}
