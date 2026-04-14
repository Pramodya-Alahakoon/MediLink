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
import PlanAppointment from './pages/PlanAppointment/PlanAppoinment';
import DoctorLayout from './layouts/DoctorLayout';
import Dashboard from './pages/Doctor/Dashboard';
import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/UI/ProtectedRoute';

function App() {
  return (
    <AuthProvider>
      <ThemeProvider>
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
                
                {/* Patient / General Protected Routes */}
                <Route element={<ProtectedRoute allowedRoles={['patient', 'doctor', 'admin']} />}>
                  <Route path="/appointments" element={<PlanAppointment />} />
                </Route>
              </Route>
              
              {/* Doctor Dashboard Routes - Securely protected */}
              <Route element={<ProtectedRoute allowedRoles={['doctor', 'admin']} />}>
                <Route element={<DoctorLayout />}>
                  <Route path="/doctor/dashboard" element={<Dashboard />} />
                </Route>
              </Route>
            </Routes>
          </div>
        </Router>
      </ThemeProvider>
    </AuthProvider>
  );
}

export default App;


