import React, { useState } from 'react';
import PatientProfile from './components/PatientProfile';
import MedicalHistory from './components/MedicalHistory';
import Prescriptions from './components/Prescriptions';
import ReportUpload from './components/ReportUpload';
import './App.css';

function App() {
  // In a real app, this would come from authentication/routing
  const [patientId] = useState('YOUR_PATIENT_ID_HERE');
  const [activeSection, setActiveSection] = useState('profile');

  return (
    <div className="app">
      <header className="header">
        <div className="header-content">
          <h1>🏥 MediLink - Patient Dashboard</h1>
          <p>Manage your health information in one place</p>
        </div>
      </header>

      <div className="container">
        <nav className="sidebar">
          <div className="nav-section">
            <button
              className={`nav-button ${activeSection === 'profile' ? 'active' : ''}`}
              onClick={() => setActiveSection('profile')}
            >
              👤 Profile
            </button>
            <button
              className={`nav-button ${activeSection === 'history' ? 'active' : ''}`}
              onClick={() => setActiveSection('history')}
            >
              📋 Medical History
            </button>
            <button
              className={`nav-button ${activeSection === 'prescriptions' ? 'active' : ''}`}
              onClick={() => setActiveSection('prescriptions')}
            >
              💊 Prescriptions
            </button>
            <button
              className={`nav-button ${activeSection === 'reports' ? 'active' : ''}`}
              onClick={() => setActiveSection('reports')}
            >
              📄 Reports
            </button>
          </div>
        </nav>

        <main className="main-content">
          {patientId === 'YOUR_PATIENT_ID_HERE' ? (
            <div className="setup-message">
              <h2>⚠️ Setup Required</h2>
              <p>
                Please update the <code>patientId</code> in App.js with your actual patient ID.
              </p>
              <p>
                Example: <code>setPatientId('507f1f77bcf86cd799439011')</code>
              </p>
            </div>
          ) : (
            <>
              {activeSection === 'profile' && (
                <PatientProfile patientId={patientId} />
              )}
              {activeSection === 'history' && (
                <MedicalHistory patientId={patientId} />
              )}
              {activeSection === 'prescriptions' && (
                <Prescriptions patientId={patientId} />
              )}
              {activeSection === 'reports' && (
                <ReportUpload patientId={patientId} />
              )}
            </>
          )}
        </main>
      </div>

      <footer className="footer">
        <p>&copy; 2026 MediLink. All rights reserved.</p>
      </footer>
    </div>
  );
}

export default App;
