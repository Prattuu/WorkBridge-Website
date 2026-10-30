import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { LanguageProvider } from './context/LanguageContext';
import { AuthProvider } from './context/AuthContext';
import { EscrowProvider } from './context/EscrowContext';
import Navbar from './components/common/Navbar';
import LandingPage from './pages/LandingPage';
import RoleSelection from './pages/RoleSelection';
import EmployerPortal from './pages/EmployerPortal';
import WorkerPortal from './pages/WorkerPortal';

export function App() {
  return (
    <LanguageProvider>
      <AuthProvider>
        <EscrowProvider>
          <Router>
            <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 font-sans selection:bg-blue-600 selection:text-white">
              <Navbar />
              <main className="flex-1">
                <Routes>
                  <Route path="/" element={<LandingPage />} />
                  <Route path="/role-selection" element={<RoleSelection />} />
                  <Route path="/employer" element={<EmployerPortal />} />
                  <Route path="/worker" element={<WorkerPortal />} />
                  <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
              </main>
            </div>
          </Router>
        </EscrowProvider>
      </AuthProvider>
    </LanguageProvider>
  );
}

export default App;
