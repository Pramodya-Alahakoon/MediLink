# MediLink Patient Dashboard

A modern React dashboard for patients to manage their health information, including profile, medical history, prescriptions, and medical reports.

## Features

- **👤 Patient Profile**: View and edit your personal health information
- **📋 Medical History**: Track and manage your medical conditions, diagnoses, and treatments
- **💊 Prescriptions**: Keep track of current medications and prescription details
- **📄 Reports**: Upload and download medical reports and documents

## Tech Stack

- **Frontend**: React 18
- **HTTP Client**: Axios
- **Styling**: CSS3 with responsive design
- **Icons**: Emoji icons (no additional dependencies)

## Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- MediLink backend service running on `http://localhost:3000`

## Installation

1. Navigate to the client directory:
   ```bash
   cd client
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Update the patient ID in `src/App.js`:
   ```javascript
   const [patientId] = useState('YOUR_ACTUAL_PATIENT_ID');
   ```

## Running the Application

1. Start the development server:
   ```bash
   npm start
   ```

2. The application will open in your browser at `http://localhost:3000`

3. Make sure the backend service is running on `http://localhost:3000` (the API calls use `http://localhost:3000/api` as the base URL)

## Project Structure

```
client/
├── public/
│   └── index.html          # HTML entry point
├── src/
│   ├── components/         # React components
│   │   ├── MedicalHistory.js
│   │   ├── MedicalHistory.css
│   │   ├── PatientProfile.js
│   │   ├── PatientProfile.css
│   │   ├── Prescriptions.js
│   │   ├── Prescriptions.css
│   │   ├── ReportUpload.js
│   │   └── ReportUpload.css
│   ├── services/           # API service layer
│   │   └── api.js
│   ├── App.js             # Main app component
│   ├── App.css            # App styling
│   ├── index.js           # React entry point
│   └── index.css          # Global styles
└── package.json           # Project dependencies
```

## API Endpoints Used

### Patient APIs
- `GET /api/patients/:id` - Get patient profile
- `PUT /api/patients/:id` - Update patient profile

### Medical History APIs
- `GET /api/medical-history/history/:patientId` - Get medical history
- `POST /api/medical-history/history` - Add medical history
- `DELETE /api/medical-history/history/:id` - Delete medical history record

### Prescription APIs
- `GET /api/prescriptions/patient/:patientId` - Get prescriptions
- `GET /api/prescriptions/patient/:patientId/active` - Get active prescriptions
- `POST /api/prescriptions` - Add prescription
- `DELETE /api/prescriptions/:id` - Delete prescription

### Report APIs
- `GET /api/reports/patient/:patientId` - Get patient reports
- `POST /api/reports/upload/:patientId` - Upload report
- `DELETE /api/reports/:id` - Delete report

## Usage

### Viewing Patient Profile
1. Click the **Profile** button in the sidebar
2. View your personal information
3. Click **Edit Profile** to make changes

### Managing Medical History
1. Click the **Medical History** button in the sidebar
2. Click **+ Add Medical Record** to add a new record
3. Fill in the condition, diagnosis, and treatment details
4. Click **Save Record** to add it
5. View existing records in the list below

### Managing Prescriptions
1. Click the **Prescriptions** button in the sidebar
2. Click **+ Add Prescription** to add a new prescription
3. Fill in medication details (name, dosage, frequency, duration)
4. Click **Save Prescription**
5. View and manage prescriptions in the list below

### Managing Reports
1. Click the **Reports** button in the sidebar
2. Optionally add a title and description
3. Click "Choose File" to select a file (PDF, DOC, DOCX, JPG, PNG - max 10MB)
4. Click **Upload Report**
5. Download or delete uploaded reports using the action buttons

## Configuration

### API Base URL
The default API base URL is set to `http://localhost:3000/api` in `src/services/api.js`. If your backend is running on a different URL, update the `API_BASE_URL` constant:

```javascript
const API_BASE_URL = 'http://your-backend-url/api';
```

### Customization
- Modify styles in component CSS files (`.css` files in `src/components/`)
- Customize the dashboard layout in `src/App.js`
- Add authentication logic before using it in production

## Error Handling

The application includes error handling for:
- Network errors
- API failures
- File upload errors
- Form validation

Error messages are displayed to the user in the UI.

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Future Enhancements

- Add authentication (login/logout)
- Add patient search functionality
- Implement notifications
- Add appointment scheduling
- Add charts for health metrics
- Dark mode support
- Multi-language support

## License

This project is part of the MediLink healthcare management system.

## Support

For issues or questions, please contact the development team.
