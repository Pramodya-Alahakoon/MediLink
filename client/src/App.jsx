import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import Layout from './components/UI/Layout';
import Homepage from './pages/Homepage';
import SignIn from './pages/SignIn';
import SignUp from './pages/SignUp';
import About from './pages/About';
import Contact from './pages/Contact';
import Privacy from './pages/Privacy';
import Terms from './pages/Terms';
import PatientLayout from './patient/components/PatientLayout';
import PatientSymptomCheckerPage from './pages/patient/PatientSymptomCheckerPage';
import PatientAIInsightsPage from './pages/patient/PatientAIInsightsPage';
import PatientReportsPage from './pages/patient/PatientReportsPage';
import PatientFindDoctorsPage from './pages/patient/PatientFindDoctorsPage';

function App() {
  return (
    <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <div className="app">
        <Routes>
          <Route element={<Layout />}>
            <Route path="/" element={<Homepage />} />
            <Route path="/signin" element={<SignIn />} />
            <Route path="/signup" element={<SignUp />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/privacy" element={<Privacy />} />
            <Route path="/terms" element={<Terms />} />
          </Route>
          <Route path="/patient" element={<PatientLayout />}>
            <Route index element={<PatientSymptomCheckerPage />} />
            <Route path="symptom-checker" element={<PatientSymptomCheckerPage />} />
            <Route path="ai-insights" element={<PatientAIInsightsPage />} />
            <Route path="reports" element={<PatientReportsPage />} />
            <Route path="find-doctors" element={<PatientFindDoctorsPage />} />
          </Route>
        </Routes>
      </div>
    </Router>
  );
}

export default App;

