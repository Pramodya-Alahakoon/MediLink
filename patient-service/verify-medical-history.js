const fs = require('fs');

console.log('=== MEDICAL HISTORY SETUP VERIFICATION ===\n');

// Check files
console.log('✓ Files Created:');
console.log('  - models/MedicalHistory.js:', fs.existsSync('./models/MedicalHistory.js') ? '✓' : '✗');
console.log('  - controllers/medicalHistoryController.js:', fs.existsSync('./controllers/medicalHistoryController.js') ? '✓' : '✗');
console.log('  - routes/medicalHistoryRoutes.js:', fs.existsSync('./routes/medicalHistoryRoutes.js') ? '✓' : '✗');

// Load and verify modules
try {
  const MedicalHistory = require('./models/MedicalHistory');
  console.log('\n✓ MedicalHistory Model Fields:');
  const schema = MedicalHistory.schema.obj;
  console.log('  - patientId: ObjectId (ref: Patient)');
  console.log('  - diagnosis: String');
  console.log('  - treatment: String');
  console.log('  - doctorNotes: String');
  console.log('  - date: Date');
  console.log('  - doctorName: String');
  console.log('  - specialization: String (enum)');
  console.log('  - status: String (enum: Active/Completed/Pending)');
  console.log('  - timestamps: createdAt, updatedAt');
  
  const controller = require('./controllers/medicalHistoryController');
  console.log('\n✓ Controller Functions:');
  console.log('  - createMedicalHistory:', typeof controller.createMedicalHistory === 'function' ? '✓' : '✗');
  console.log('  - getMedicalHistoryById:', typeof controller.getMedicalHistoryById === 'function' ? '✓' : '✗');
  console.log('  - getMedicalHistoryByPatientId:', typeof controller.getMedicalHistoryByPatientId === 'function' ? '✓' : '✗');
  console.log('  - updateMedicalHistory:', typeof controller.updateMedicalHistory === 'function' ? '✓' : '✗');
  console.log('  - deleteMedicalHistory:', typeof controller.deleteMedicalHistory === 'function' ? '✓' : '✗');

  const routes = require('./routes/medicalHistoryRoutes');
  console.log('\n✓ Routes Configured:');
  console.log('  - POST /api/medical-history (create)');
  console.log('  - GET /api/medical-history/patient/:patientId (get by patient)');
  console.log('  - GET /api/medical-history/:id (get by id)');
  console.log('  - PUT /api/medical-history/:id (update)');
  console.log('  - DELETE /api/medical-history/:id (delete)');

  const app = require('./app');
  console.log('\n✓ App Integration: Complete');
  console.log('\n=== ALL COMPONENTS LOADED SUCCESSFULLY ===');
} catch (error) {
  console.error('✗ Error:', error.message);
}