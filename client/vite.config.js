import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

const useDocker = process.env.VITE_USE_DOCKER === 'true';

const getProxyTarget = (serviceName, port) => {
  return useDocker ? `http://${serviceName}:${port}` : `http://localhost:${port}`;
};

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    proxy: {
      '/api/auth': {
        target: getProxyTarget('auth-service', 5000),
        changeOrigin: true
      },
      '/api/appointments': {
        target: getProxyTarget('appointment-service', 3002),
        changeOrigin: true
      },
      // Doctor Service Routes
      '/api/doctors': {
        target: getProxyTarget('doctor-service', 3003),
        changeOrigin: true
      },
      '/api/availability': {
        target: getProxyTarget('doctor-service', 3003),
        changeOrigin: true
      },
      // Patient Service Routes
      '/api/patients': {
        target: getProxyTarget('patient-service', 3000),
        changeOrigin: true
      },
      '/api/upload': {
        target: getProxyTarget('patient-service', 3000),
        changeOrigin: true
      },
      '/api/reports': {
        target: getProxyTarget('patient-service', 3000),
        changeOrigin: true
      },
      '/api/video-consultation': {
        target: getProxyTarget('patient-service', 3000),
        changeOrigin: true
      },
      // Payment Service Routes
      '/api/payments': {
        target: getProxyTarget('payment-service', 3005),
        changeOrigin: true
      },
      '/api/webhooks': {
        target: getProxyTarget('payment-service', 3005),
        changeOrigin: true
      },
      // Collision rule: For currently undefined behavior, route prescriptions to Doctor by default. 
      '/api/prescriptions': {
        target: getProxyTarget('doctor-service', 3003), // Defaulting to Doctor Service until collision is fixed
        changeOrigin: true
      }
    }
  }
})
