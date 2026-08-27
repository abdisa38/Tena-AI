import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Activity, Stethoscope, FileText, PhoneCall, LayoutDashboard, User, LogOut, Menu, X, ShieldCheck } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const { user, logout } = useAuth();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navLinks = [
    { name: 'AI Symptom Triage', path: '/triage', icon: Activity },
    { name: 'Find Doctors', path: '/doctors', icon: Stethoscope },
    { name: 'Prescription Scanner', path: '/lab-scanner', icon: FileText },
    { name: 'Emergency', path: '/emergency', icon: PhoneCall },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <header className="sticky top-0 z-50 w-full border-b border-tena-border bg-tena-bg/90 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        
        {/* Brand Logo */}
        <Link to="/" className="flex items-center gap-2.5 group">
          <div className="w-10 h-10 rounded-xl bg-tena-surface border border-tena-emerald/30 flex items-center justify-center text-tena-emerald group-hover:border-tena-emerald transition-all shadow-glow-emerald">
            <Activity className="w-5 h-5" />
          </div>
          <div className="flex flex-col">
            <span className="font-bold text-lg text-tena-text tracking-tight flex items-center gap-1.5">
              Tena <span className="text-tena-emerald">AI</span>
            </span>
            <span className="text-[10px] uppercase font-semibold tracking-wider text-tena-muted -mt-1">
              Health Intelligence
            </span>
          </div>
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-1">
          {navLinks.map((link) => {
            const Icon = link.icon;
            const active = isActive(link.path);
            return (
              <Link
                key={link.path}
                to={link.path}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-sm font-medium transition-all ${
                  active
                    ? 'text-tena-emerald bg-tena-surface border border-tena-border'
                    : 'text-tena-muted hover:text-tena-text hover:bg-tena-surface/50'
                }`}
              >
                <Icon className={`w-4 h-4 ${active ? 'text-tena-emerald' : 'text-tena-muted'}`} />
                {link.name}
              </Link>
            );
          })}
        </nav>

        {/* User Actions */}
        <div className="hidden md:flex items-center gap-3">
          {user ? (
            <div className="flex items-center gap-3">
              <Link
                to="/dashboard"
                className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-sm font-medium transition-all ${
                  isActive('/dashboard')
                    ? 'text-tena-cyan bg-tena-surface border border-tena-cyan/40'
                    : 'text-tena-muted hover:text-tena-text bg-tena-surface/50 border border-tena-border'
                }`}
              >
                <LayoutDashboard className="w-4 h-4 text-tena-cyan" />
                Dashboard
              </Link>
              <button
                onClick={logout}
                title="Sign Out"
                className="p-2 rounded-lg text-tena-muted hover:text-tena-danger hover:bg-tena-surface/80 border border-tena-border transition-colors"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <Link
                to="/auth?mode=login"
                className="text-sm font-medium text-tena-muted hover:text-tena-text px-3 py-2 transition-colors"
              >
                Sign In
              </Link>
              <Link
                to="/triage"
                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-tena-emerald hover:bg-tena-emerald-hover text-black font-semibold text-sm transition-all shadow-glow-emerald"
              >
                <Activity className="w-4 h-4" />
                Check Symptoms
              </Link>
            </div>
          )}
        </div>

        {/* Mobile Menu Button */}
        <div className="flex md:hidden items-center gap-2">
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="p-2 rounded-lg bg-tena-surface border border-tena-border text-tena-muted hover:text-white"
          >
            {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {isMobileMenuOpen && (
        <div className="md:hidden border-t border-tena-border bg-tena-surface px-4 py-4 space-y-2">
          {navLinks.map((link) => {
            const Icon = link.icon;
            const active = isActive(link.path);
            return (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setIsMobileMenuOpen(false)}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium ${
                  active ? 'text-tena-emerald bg-tena-bg border border-tena-border' : 'text-tena-muted'
                }`}
              >
                <Icon className="w-4 h-4" />
                {link.name}
              </Link>
            );
          })}
          <div className="pt-3 border-t border-tena-border/60">
            {user ? (
              <div className="space-y-2">
                <Link
                  to="/dashboard"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-tena-cyan bg-tena-bg border border-tena-border"
                >
                  <LayoutDashboard className="w-4 h-4" />
                  Dashboard
                </Link>
                <button
                  onClick={() => {
                    logout();
                    setIsMobileMenuOpen(false);
                  }}
                  className="flex items-center gap-3 w-full px-3 py-2.5 rounded-lg text-sm text-tena-danger bg-tena-bg border border-tena-border"
                >
                  <LogOut className="w-4 h-4" />
                  Sign Out
                </button>
              </div>
            ) : (
              <div className="flex flex-col gap-2">
                <Link
                  to="/auth?mode=login"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="w-full text-center py-2 text-sm text-tena-text bg-tena-bg rounded-lg border border-tena-border"
                >
                  Sign In
                </Link>
                <Link
                  to="/triage"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="w-full text-center py-2 text-sm font-semibold bg-tena-emerald text-black rounded-lg"
                >
                  Check Symptoms
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
