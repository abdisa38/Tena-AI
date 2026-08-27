import React, { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Activity, Lock, Mail, User, Phone, MapPin, AlertCircle, ArrowRight, ShieldCheck } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function Auth() {
  const [searchParams] = useSearchParams();
  const initialMode = searchParams.get('mode') === 'register' ? 'register' : 'login';
  const [mode, setMode] = useState(initialMode);
  const { login, register, loading } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    role: 'patient',
    phoneNumber: '',
    city: 'Addis Ababa',
    bloodGroup: 'Unknown',
  });
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (mode === 'login') {
      const res = await login(formData.email, formData.password);
      if (res.success) {
        navigate('/dashboard');
      } else {
        setError(res.message);
      }
    } else {
      const res = await register(formData);
      if (res.success) {
        navigate('/dashboard');
      } else {
        setError(res.message);
      }
    }
  };

  const fillDemo = (role) => {
    if (role === 'doctor') {
      setFormData({
        fullName: 'Dr. Selamawit Tadesse',
        email: 'doctor@tena.ai',
        password: 'password123',
        role: 'doctor',
        phoneNumber: '+251 91 123 4567',
        city: 'Addis Ababa',
        bloodGroup: 'O+',
      });
    } else {
      setFormData({
        fullName: 'Abebe Bikila',
        email: 'patient@tena.ai',
        password: 'password123',
        role: 'patient',
        phoneNumber: '+251 92 987 6543',
        city: 'Addis Ababa',
        bloodGroup: 'A+',
      });
    }
  };

  return (
    <div className="max-w-md mx-auto px-4 py-12 space-y-6">
      
      {/* Brand Icon */}
      <div className="text-center space-y-2">
        <div className="w-12 h-12 rounded-2xl bg-tena-surface border border-tena-emerald/40 flex items-center justify-center text-tena-emerald mx-auto shadow-glow-emerald">
          <Activity className="w-6 h-6" />
        </div>
        <h1 className="text-2xl font-bold text-tena-text">
          {mode === 'login' ? 'Welcome to Tena AI' : 'Create Your Account'}
        </h1>
        <p className="text-xs text-tena-muted">
          {mode === 'login' ? 'Access your health records and consultations' : 'Start your intelligent healthcare journey today'}
        </p>
      </div>

      <div className="p-6 sm:p-8 rounded-2xl bg-tena-surface border border-tena-border space-y-6 shadow-card">
        
        {/* Toggle Mode */}
        <div className="grid grid-cols-2 p-1 rounded-xl bg-tena-bg border border-tena-border">
          <button
            type="button"
            onClick={() => { setMode('login'); setError(''); }}
            className={`py-2 text-xs font-semibold rounded-lg transition-all ${
              mode === 'login' ? 'bg-tena-surface text-tena-emerald border border-tena-border shadow' : 'text-tena-muted'
            }`}
          >
            Sign In
          </button>
          <button
            type="button"
            onClick={() => { setMode('register'); setError(''); }}
            className={`py-2 text-xs font-semibold rounded-lg transition-all ${
              mode === 'register' ? 'bg-tena-surface text-tena-emerald border border-tena-border shadow' : 'text-tena-muted'
            }`}
          >
            Register
          </button>
        </div>

        {error && (
          <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          
          {mode === 'register' && (
            <>
              <div className="space-y-1.5">
                <label className="text-xs text-tena-muted font-medium">Account Role</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, role: 'patient' })}
                    className={`py-2 text-xs rounded-lg border font-semibold ${
                      formData.role === 'patient'
                        ? 'bg-tena-emerald/15 border-tena-emerald text-tena-emerald'
                        : 'bg-tena-bg border-tena-border text-tena-muted'
                    }`}
                  >
                    Patient
                  </button>
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, role: 'doctor' })}
                    className={`py-2 text-xs rounded-lg border font-semibold ${
                      formData.role === 'doctor'
                        ? 'bg-tena-cyan/15 border-tena-cyan text-tena-cyan'
                        : 'bg-tena-bg border-tena-border text-tena-muted'
                    }`}
                  >
                    Doctor / Specialist
                  </button>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs text-tena-muted font-medium">Full Name</label>
                <div className="relative">
                  <User className="w-4 h-4 text-tena-muted absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    name="fullName"
                    required
                    placeholder="e.g. Abebe Bikila"
                    value={formData.fullName}
                    onChange={handleChange}
                    className="w-full pl-10 pr-3.5 py-2.5 rounded-lg bg-tena-bg border border-tena-border text-tena-text text-xs focus:outline-none focus:border-tena-emerald"
                  />
                </div>
              </div>
            </>
          )}

          <div className="space-y-1.5">
            <label className="text-xs text-tena-muted font-medium">Email Address</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-tena-muted absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                name="email"
                required
                placeholder="name@example.com"
                value={formData.email}
                onChange={handleChange}
                className="w-full pl-10 pr-3.5 py-2.5 rounded-lg bg-tena-bg border border-tena-border text-tena-text text-xs focus:outline-none focus:border-tena-emerald"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs text-tena-muted font-medium">Password</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-tena-muted absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                name="password"
                required
                placeholder="••••••••"
                value={formData.password}
                onChange={handleChange}
                className="w-full pl-10 pr-3.5 py-2.5 rounded-lg bg-tena-bg border border-tena-border text-tena-text text-xs focus:outline-none focus:border-tena-emerald"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-tena-emerald hover:bg-tena-emerald-hover text-black font-bold text-xs transition-all shadow-glow-emerald disabled:opacity-50 mt-2"
          >
            {loading ? (
              <span>Processing...</span>
            ) : (
              <>
                <span>{mode === 'login' ? 'Sign In' : 'Create Account'}</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        {/* Demo Fast Login Helpers */}
        <div className="pt-4 border-t border-tena-border space-y-2">
          <span className="text-[11px] font-semibold text-tena-muted block text-center">Quick Demo Login:</span>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => fillDemo('patient')}
              className="py-1.5 px-2 rounded-lg bg-tena-bg border border-tena-border text-[11px] text-tena-muted hover:text-white"
            >
              Demo Patient
            </button>
            <button
              type="button"
              onClick={() => fillDemo('doctor')}
              className="py-1.5 px-2 rounded-lg bg-tena-bg border border-tena-border text-[11px] text-tena-muted hover:text-white"
            >
              Demo Doctor
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
