import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Triage from './pages/Triage';
import Doctors from './pages/Doctors';
import LabScanner from './pages/LabScanner';
import Emergency from './pages/Emergency';
import Dashboard from './pages/Dashboard';
import Auth from './pages/Auth';
import { AuthProvider } from './context/AuthContext';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="flex flex-col min-h-screen bg-tena-bg text-tena-text selection:bg-tena-emerald selection:text-black">
          <Navbar />
          <main className="flex-grow">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/triage" element={<Triage />} />
              <Route path="/doctors" element={<Doctors />} />
              <Route path="/lab-scanner" element={<LabScanner />} />
              <Route path="/emergency" element={<Emergency />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/auth" element={<Auth />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
