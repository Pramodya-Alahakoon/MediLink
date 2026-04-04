import React, { useState, useEffect } from 'react';
import { prescriptionAPI } from '../services/api';
import './Prescriptions.css';

const Prescriptions = ({ patientId }) => {
  const [prescriptions, setPrescriptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    medication: '',
    dosage: '',
    frequency: '',
    duration: '',
    instructions: '',
    startDate: new Date().toISOString().split('T')[0],
    endDate: '',
  });

  useEffect(() => {
    fetchPrescriptions();
  }, [patientId]);

  const fetchPrescriptions = async () => {
    try {
      setLoading(true);
      const response = await prescriptionAPI.getPrescriptions(patientId);
      setPrescriptions(response.data || []);
      setError(null);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch prescriptions');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await prescriptionAPI.addPrescription({
        patientId,
        ...formData,
      });
      setFormData({
        medication: '',
        dosage: '',
        frequency: '',
        duration: '',
        instructions: '',
        startDate: new Date().toISOString().split('T')[0],
        endDate: '',
      });
      setShowForm(false);
      fetchPrescriptions();
      alert('Prescription added successfully!');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to add prescription');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this prescription?')) {
      try {
        await prescriptionAPI.deletePrescription(id);
        fetchPrescriptions();
        alert('Prescription deleted successfully!');
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to delete prescription');
      }
    }
  };

  if (loading) return <div className="loading">Loading prescriptions...</div>;

  return (
    <div className="prescriptions">
      <h2>💊 Prescriptions</h2>
      {error && <div className="error">{error}</div>}

      <button
        className="btn btn-primary"
        onClick={() => setShowForm(!showForm)}
      >
        {showForm ? 'Cancel' : '+ Add Prescription'}
      </button>

      {showForm && (
        <form onSubmit={handleSubmit} className="prescription-form">
          <div className="form-group">
            <label>Medication Name:</label>
            <input
              type="text"
              name="medication"
              placeholder="e.g., Aspirin, Metformin"
              value={formData.medication}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label>Dosage:</label>
            <input
              type="text"
              name="dosage"
              placeholder="e.g., 500mg"
              value={formData.dosage}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label>Frequency:</label>
            <input
              type="text"
              name="frequency"
              placeholder="e.g., 3 times daily"
              value={formData.frequency}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label>Duration:</label>
            <input
              type="text"
              name="duration"
              placeholder="e.g., 7 days"
              value={formData.duration}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label>Instructions:</label>
            <textarea
              name="instructions"
              placeholder="Special instructions"
              value={formData.instructions}
              onChange={handleChange}
            />
          </div>
          <div className="form-group">
            <label>Start Date:</label>
            <input
              type="date"
              name="startDate"
              value={formData.startDate}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label>End Date:</label>
            <input
              type="date"
              name="endDate"
              value={formData.endDate}
              onChange={handleChange}
            />
          </div>
          <button type="submit" className="btn btn-primary">
            Save Prescription
          </button>
        </form>
      )}

      <div className="prescriptions-list">
        {prescriptions.length === 0 ? (
          <p className="empty-message">No prescriptions found</p>
        ) : (
          prescriptions.map((prescription) => (
            <div key={prescription._id} className="prescription-card">
              <div className="card-header">
                <h3>{prescription.medication}</h3>
                <span className="dosage">{prescription.dosage}</span>
              </div>
              <div className="card-content">
                <p>
                  <strong>Frequency:</strong> {prescription.frequency}
                </p>
                <p>
                  <strong>Duration:</strong> {prescription.duration}
                </p>
                <p>
                  <strong>Start Date:</strong>{' '}
                  {new Date(prescription.startDate).toLocaleDateString()}
                </p>
                {prescription.endDate && (
                  <p>
                    <strong>End Date:</strong>{' '}
                    {new Date(prescription.endDate).toLocaleDateString()}
                  </p>
                )}
                {prescription.instructions && (
                  <p>
                    <strong>Instructions:</strong> {prescription.instructions}
                  </p>
                )}
              </div>
              <button
                className="btn btn-danger btn-small"
                onClick={() => handleDelete(prescription._id)}
              >
                Delete
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Prescriptions;
