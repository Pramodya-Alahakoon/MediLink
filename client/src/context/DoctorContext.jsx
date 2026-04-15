import React, { createContext, useContext, useState, useEffect } from 'react';
import customFetch from '../utils/customFetch';
import { useAuth } from './AuthContext';

const DoctorContext = createContext();

export const DoctorProvider = ({ children }) => {
  const { user } = useAuth();
  const [doctorProfile, setDoctorProfile] = useState(null);
  const [isLoadingProfile, setIsLoadingProfile] = useState(false);
  const [profileError, setProfileError] = useState(null);

  useEffect(() => {
    if (user && (user.role === 'doctor' || user.role === 'admin')) {
      fetchDoctorProfile();
    } else {
      setDoctorProfile(null);
    }
  }, [user]);

  const fetchDoctorProfile = async () => {
    if (!user?.userId) return;

    setIsLoadingProfile(true);
    setProfileError(null);

    try {
      const { data } = await customFetch.get(`/api/doctors/user/${user.userId}`);
      if (data.success && data.data) {
        setDoctorProfile(data.data);
      } else {
        setProfileError('No doctor profile found. Please complete your profile setup.');
        setDoctorProfile(null);
      }
    } catch (error) {
      console.error('Error fetching doctor profile:', error);
      setProfileError('Failed to load doctor profile.');
      setDoctorProfile(null);
    } finally {
      setIsLoadingProfile(false);
    }
  };

  const refreshDoctorProfile = () => {
    fetchDoctorProfile();
  };

  return (
    <DoctorContext.Provider
      value={{
        doctorProfile,
        doctorId: doctorProfile?.doctorId || null,
        isLoadingProfile,
        profileError,
        refreshDoctorProfile,
      }}
    >
      {children}
    </DoctorContext.Provider>
  );
};

export const useDoctorContext = () => {
  const context = useContext(DoctorContext);
  if (!context) {
    throw new Error('useDoctorContext must be used within a DoctorProvider');
  }
  return context;
};
