import React, { useState, useEffect } from 'react';
import { medicalHistoryAPI } from '../services/api';
import './MedicalHistory.css';

const MedicalHistory = ({ patientId }) => {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    condition: '',
    diagnosis: '',
    treatment: '',
    dateRecorded: new Date().toISOString().split('T')[0],
  });

  useEffect(() => {
    fetchMedicalHistory();
  }, [patientId]);

  const fetchMedicalHistory = async () => {
    try {
      setLoading(true);
      const response = await medicalHistoryAPI.getMedicalHistory(patientId);
      setHistory(response.data || []);
      setError(null);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch medical history');
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
      await medicalHistoryAPI.addMedicalHistory({
        patientId,
        ...formData,
      });
      setFormData({
        condition: '',
        diagnosis: '',
        treatment: '',
        dateRecorded: new Date().toISOString().split('T')[0],
      });
      setShowForm(false);
      fetchMedicalHistory();
      alert('Medical history added successfully!');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to add medical history');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this record?')) {
      try {
        await medicalHistoryAPI.deleteMedicalHistory(id);
        fetchMedicalHistory();
        alert('Record deleted successfully!');
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to delete record');
      }
    }
  };

  if (loading) return <div className="loading">Loading medical history...</div>;

  return (
    <div className="medical-history">
      <h2>📋 Medical History</h2>
      {error && <div className="error">{error}</div>}

      <button
        className="btn btn-primary"
        onClick={() => setShowForm(!showForm)}
      >
        {showForm ? 'Cancel' : '+ Add Medical Record'}
      </button>

      {showForm && (
        <form onSubmit={handleSubmit} className="history-form">
          <div className="form-group">
            <label>Condition:</label>
            <input
              type="text"
              name="condition"
              placeholder="e.g., Diabetes, Hypertension"
              value={formData.condition}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label>Diagnosis:</label>
            <textarea
              name="diagnosis"
              placeholder="Diagnosis details"
              value={formData.diagnosis}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label>Treatment:</label>
            <textarea
              name="treatment"
              placeholder="Treatment provided"
              value={formData.treatment}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label>Date Recorded:</label>
            <input
              type="date"
              name="dateRecorded"
              value={formData.dateRecorded}
              onChange={handleChange}
              required
            />
          </div>
          <button type="submit" className="btn btn-primary">
            Save Record
          </button>
        </form>
      )}

      <div className="history-list">
        {history.length === 0 ? (
          <p className="empty-message">No medical history records</p>
        ) : (
          history.map((record) => (
            <div key={record._id} className="history-card">
              <div className="card-header">
                <h3>{record.condition}</h3>
                <span className="date">
                  {new Date(record.dateRecorded).toLocaleDateString()}
                </span>
              </div>
              <div className="card-content">
                <p>
                  <strong>Diagnosis:</strong> {record.diagnosis}
                </p>
                <p>
                  <strong>Treatment:</strong> {record.treatment}
                </p>
              </div>
              <button
                className="btn btn-danger btn-small"
                onClick={() => handleDelete(record._id)}
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

export default MedicalHistory;
