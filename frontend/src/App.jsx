import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import LandingPage from './pages/LandingPage';
import DashboardPage from './pages/DashboardPage';
import ExplorePage from './pages/ExplorePage';
import ClustersPage from './pages/ClustersPage';
import EvaluationPage from './pages/EvaluationPage';
import AboutPage from './pages/AboutPage';
import { fetchHealth } from './services/api';
import { AlertCircle, RefreshCw } from 'lucide-react';

export default function App() {
  const [activePage, setActivePage] = useState('landing');
  const [backendOnline, setBackendOnline] = useState(true);
  const [checkingBackend, setCheckingBackend] = useState(false);

  const checkServerStatus = () => {
    setCheckingBackend(true);
    fetchHealth()
      .then(() => {
        setBackendOnline(true);
        setCheckingBackend(false);
      })
      .catch(() => {
        setBackendOnline(false);
        setCheckingBackend(false);
      });
  };

  useEffect(() => {
    checkServerStatus();
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-dark-bg text-primary font-sans selection:bg-teal-500/30 selection:text-white">
      {/* Offline Alert Banner */}
      {!backendOnline && (
        <div className="bg-dark-card border-b border-dark-border text-secondary px-4 py-2 text-xs flex items-center justify-between sticky top-0 z-50 font-mono">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-3.5 h-3.5 text-teal-400 shrink-0" />
            <span>
              Backend server disconnected (expected at <code>http://127.0.0.1:8000</code>). Run <code>python -m uvicorn main:app --reload</code> in the <code>backend/</code> directory.
            </span>
          </div>
          <button
            onClick={checkServerStatus}
            disabled={checkingBackend}
            className="flex items-center gap-1 px-2 py-0.5 rounded bg-dark-bg text-primary text-[11px] border border-dark-border hover:bg-dark-border transition-colors"
          >
            <RefreshCw className={`w-3 h-3 text-teal-400 ${checkingBackend ? 'animate-spin' : ''}`} />
            <span>Retry</span>
          </button>
        </div>
      )}

      {/* Navigation */}
      <Navbar activePage={activePage} setActivePage={setActivePage} />

      {/* Main View */}
      <main className="flex-1">
        {activePage === 'landing' && (
          <LandingPage setActivePage={setActivePage} />
        )}
        {activePage === 'clusters' && (
          <ClustersPage onSelectCluster={(clusterId, dominantTopic) => {
            setActivePage('landing');
          }} />
        )}
        {activePage === 'dashboard' && (
          <DashboardPage />
        )}
        {activePage === 'about' && (
          <AboutPage />
        )}
        {activePage === 'evaluation' && (
          <EvaluationPage />
        )}
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}
