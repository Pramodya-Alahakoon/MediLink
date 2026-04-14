import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { PatientAuthProvider } from './patient/context/PatientAuthContext.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <PatientAuthProvider>
      <App />
    </PatientAuthProvider>
  </StrictMode>,
)
