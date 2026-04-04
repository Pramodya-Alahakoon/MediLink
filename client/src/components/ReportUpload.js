import React, { useState, useEffect } from 'react';
import { reportAPI } from '../services/api';
import './ReportUpload.css';

const ReportUpload = ({ patientId }) => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
  });

  useEffect(() => {
    fetchReports();
  }, [patientId]);

  const fetchReports = async () => {
    try {
      setLoading(true);
      const response = await reportAPI.getPatientReports(patientId);
      setReports(response.data || []);
      setError(null);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch reports');
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file size (max 10MB)
      if (file.size > 10 * 1024 * 1024) {
        setError('File size exceeds 10MB limit');
        return;
      }
      setSelectedFile(file);
      setError(null);
    }
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedFile) {
      setError('Please select a file');
      return;
    }

    try {
      setUploading(true);
      await reportAPI.uploadReport(patientId, selectedFile);
      setSelectedFile(null);
      setFormData({
        title: '',
        description: '',
      });
      fetchReports();
      alert('Report uploaded successfully!');
      setError(null);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to upload report');
    } finally {
      setUploading(false);
    }
  };

  const handleDownload = (filename) => {
    const link = document.createElement('a');
    link.href = `http://localhost:3000/uploads/${filename}`;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this report?')) {
      try {
        await reportAPI.deleteReport(id);
        fetchReports();
        alert('Report deleted successfully!');
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to delete report');
      }
    }
  };

  if (loading) return <div className="loading">Loading reports...</div>;

  return (
    <div className="report-upload">
      <h2>📄 Reports</h2>
      {error && <div className="error">{error}</div>}

      <form onSubmit={handleSubmit} className="upload-form">
        <div className="form-group">
          <label>Report Title:</label>
          <input
            type="text"
            name="title"
            placeholder="e.g., Lab Report, X-Ray"
            value={formData.title}
            onChange={handleFormChange}
          />
        </div>

        <div className="form-group">
          <label>Description:</label>
          <textarea
            name="description"
            placeholder="Optional description"
            value={formData.description}
            onChange={handleFormChange}
          />
        </div>

        <div className="form-group">
          <label>Select File:</label>
          <div className="file-input-wrapper">
            <input
              type="file"
              id="file-input"
              onChange={handleFileChange}
              accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
              disabled={uploading}
            />
            <label htmlFor="file-input" className="file-label">
              {selectedFile ? selectedFile.name : 'Choose File'}
            </label>
          </div>
          <small>Supported formats: PDF, DOC, DOCX, JPG, PNG (Max 10MB)</small>
        </div>

        <button
          type="submit"
          className="btn btn-primary"
          disabled={!selectedFile || uploading}
        >
          {uploading ? 'Uploading...' : '⬆️ Upload Report'}
        </button>
      </form>

      <div className="reports-list">
        <h3>Uploaded Reports</h3>
        {reports.length === 0 ? (
          <p className="empty-message">No reports uploaded yet</p>
        ) : (
          reports.map((report) => (
            <div key={report._id} className="report-card">
              <div className="card-header">
                <h4>{report.title || report.filename}</h4>
                <span className="date">
                  {new Date(report.uploadDate).toLocaleDateString()}
                </span>
              </div>
              {report.description && (
                <p className="description">{report.description}</p>
              )}
              <div className="card-actions">
                <button
                  className="btn btn-secondary btn-small"
                  onClick={() => handleDownload(report.filename)}
                >
                  ⬇️ Download
                </button>
                <button
                  className="btn btn-danger btn-small"
                  onClick={() => handleDelete(report._id)}
                >
                  Delete
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ReportUpload;
