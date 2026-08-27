import React, { useState } from 'react';
import { 
  FileText, 
  UploadCloud, 
  Sparkles, 
  CheckCircle2, 
  AlertTriangle, 
  Clock, 
  Sun, 
  Moon, 
  ShieldAlert, 
  RotateCcw,
  Check
} from 'lucide-react';
import api from '../services/api';

export default function LabScanner() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState('');
  const [base64Data, setBase64Data] = useState('');
  const [textInput, setTextInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');

  const samplePrescriptionText = `Rx:
1. Amoxicillin Capsules 500mg - 1 capsule tid (3 times daily) for 7 days.
2. Paracetamol Tablets 500mg - 1-2 tablets prn for fever/headache every 8 hours.
3. Cetirizine 10mg - 1 tablet once daily at bedtime for 5 days.
Note: Drink plenty of water and complete antibiotic course.`;

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setSelectedFile(file);
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreviewUrl(reader.result);
      setBase64Data(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const handleAnalyze = async () => {
    if (!base64Data && !textInput.trim()) {
      setError('Please upload a prescription image or enter text.');
      return;
    }
    setError('');
    setLoading(true);

    try {
      const res = await api.post('/ocr/analyze', {
        imageBase64: base64Data || null,
        documentText: textInput || null,
        documentType: 'Prescription / Medical Report'
      });

      if (res.data.success) {
        setResult(res.data.data);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Error analyzing document.');
    } finally {
      setLoading(false);
    }
  };

  const handleLoadSample = () => {
    setTextInput(samplePrescriptionText);
    setPreviewUrl('');
    setBase64Data('');
    setSelectedFile(null);
  };

  const handleReset = () => {
    setResult(null);
    setSelectedFile(null);
    setPreviewUrl('');
    setBase64Data('');
    setTextInput('');
    setError('');
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-tena-surface border border-tena-emerald/30 text-xs font-semibold text-tena-emerald">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Gemini Vision OCR Analyzer</span>
        </div>
        <h1 className="text-3xl font-extrabold text-tena-text">Prescription & Lab Report Scanner</h1>
        <p className="text-xs sm:text-sm text-tena-muted">
          Extract medications, exact dosage schedules, and doctor instructions into clear, simple English.
        </p>
      </div>

      {/* Grid: Upload / Input vs Results */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Column: Upload Area */}
        <div className="lg:col-span-6 space-y-6">
          <div className="p-6 sm:p-8 rounded-2xl bg-tena-surface border border-tena-border space-y-6">
            
            <div className="flex items-center justify-between border-b border-tena-border pb-4">
              <h3 className="text-sm font-bold text-tena-text">Upload or Paste Document</h3>
              <button
                type="button"
                onClick={handleLoadSample}
                className="text-xs text-tena-cyan hover:underline font-semibold"
              >
                Load Sample Text
              </button>
            </div>

            {error && (
              <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 text-xs">
                {error}
              </div>
            )}

            {/* File Dropzone */}
            <div className="relative border-2 border-dashed border-tena-border hover:border-tena-emerald/50 rounded-2xl p-6 text-center transition-colors bg-tena-bg/50">
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />
              {previewUrl ? (
                <div className="space-y-3">
                  <img
                    src={previewUrl}
                    alt="Prescription preview"
                    className="max-h-48 mx-auto rounded-lg border border-tena-border object-contain"
                  />
                  <p className="text-xs text-tena-emerald font-medium">Image attached ready for AI analysis</p>
                </div>
              ) : (
                <div className="space-y-3">
                  <div className="w-12 h-12 rounded-xl bg-tena-surface border border-tena-border text-tena-emerald flex items-center justify-center mx-auto">
                    <UploadCloud className="w-6 h-6" />
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs font-semibold text-tena-text">Click or drag prescription photo here</p>
                    <p className="text-[11px] text-tena-muted">PNG, JPG, JPEG up to 10MB</p>
                  </div>
                </div>
              )}
            </div>

            {/* Or Text Input */}
            <div className="space-y-2">
              <label className="text-xs text-tena-muted font-medium">Or type/paste medical instructions directly:</label>
              <textarea
                rows="4"
                placeholder="Paste prescription contents or doctor notes..."
                value={textInput}
                onChange={(e) => setTextInput(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-tena-bg border border-tena-border text-tena-text text-xs focus:outline-none focus:border-tena-emerald font-mono"
              />
            </div>

            <button
              type="button"
              disabled={loading}
              onClick={handleAnalyze}
              className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-tena-emerald hover:bg-tena-emerald-hover text-black font-bold text-xs transition-all shadow-glow-emerald disabled:opacity-50"
            >
              {loading ? (
                <span>Extracting Medical Details...</span>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" /> Analyze Document with AI
                </>
              )}
            </button>

          </div>
        </div>

        {/* Right Column: Structured Extracted Card */}
        <div className="lg:col-span-6">
          {result ? (
            <div className="p-6 rounded-2xl bg-tena-surface border border-tena-border shadow-card space-y-6 animate-in fade-in">
              
              <div className="flex items-center justify-between border-b border-tena-border pb-4">
                <div className="flex items-center gap-2">
                  <FileText className="w-4 h-4 text-tena-emerald" />
                  <span className="text-xs font-bold uppercase tracking-wider text-tena-text">Extracted Prescription</span>
                </div>
                <button
                  onClick={handleReset}
                  className="text-xs text-tena-muted hover:text-white flex items-center gap-1"
                >
                  <RotateCcw className="w-3 h-3" /> Clear
                </button>
              </div>

              {/* Summary */}
              <div className="space-y-2">
                <h4 className="text-xs font-bold uppercase tracking-wider text-tena-muted">Overview</h4>
                <p className="text-xs text-tena-text leading-relaxed bg-tena-bg p-3 rounded-xl border border-tena-border">
                  {result.extractedSummary}
                </p>
              </div>

              {/* Medication Table / Schedule */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-tena-muted">Prescribed Medications</h4>
                
                {result.medicationsFound && result.medicationsFound.length > 0 ? (
                  <div className="space-y-3">
                    {result.medicationsFound.map((med, idx) => (
                      <div key={idx} className="p-3.5 rounded-xl bg-tena-bg border border-tena-border space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-xs text-tena-text">{med.name}</span>
                          <span className="px-2 py-0.5 rounded bg-tena-surface text-[11px] text-tena-emerald border border-tena-border font-semibold">
                            {med.dosage}
                          </span>
                        </div>
                        <div className="flex items-center justify-between text-xs text-tena-muted pt-1">
                          <span>Frequency: <strong className="text-tena-text">{med.frequency}</strong></span>
                          <span>Duration: <strong className="text-tena-text">{med.duration}</strong></span>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-tena-muted">No specific medication lines detected.</p>
                )}
              </div>

              {/* Special Instructions & Warnings */}
              {result.specialInstructions && (
                <div className="space-y-2">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-tena-muted">Important Instructions</h4>
                  <div className="p-3 rounded-xl bg-tena-bg border border-tena-border text-xs text-tena-muted leading-relaxed">
                    {result.specialInstructions}
                  </div>
                </div>
              )}

              {result.warnings && result.warnings.length > 0 && (
                <div className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-400 space-y-1.5">
                  <div className="flex items-center gap-2 text-xs font-bold">
                    <ShieldAlert className="w-4 h-4 flex-shrink-0" />
                    <span>Safety Precautions:</span>
                  </div>
                  <ul className="text-xs space-y-1 pl-6 list-disc opacity-90">
                    {result.warnings.map((w, idx) => (
                      <li key={idx}>{w}</li>
                    ))}
                  </ul>
                </div>
              )}

            </div>
          ) : (
            <div className="p-8 rounded-2xl bg-tena-surface/50 border border-tena-border text-center space-y-4">
              <div className="w-12 h-12 rounded-xl bg-tena-bg border border-tena-border flex items-center justify-center text-tena-muted mx-auto">
                <FileText className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <h4 className="text-sm font-bold text-tena-text">Prescription Output</h4>
                <p className="text-xs text-tena-muted max-w-xs mx-auto leading-relaxed">
                  Upload an image or paste notes to see the extracted medication schedule.
                </p>
              </div>
            </div>
          )}
        </div>

      </div>

    </div>
  );
}
