import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  // Pre-seed with default user (can switch between employer and worker instantly)
  const [role, setRole] = useState(() => localStorage.getItem('wb_role') || 'employer');
  const [user, setUser] = useState({
    id: 'usr_emp_001',
    role: 'employer',
    name: 'Vikram Joshi',
    email: 'vikram@metrologistics.in',
    phone_masked: '+91 98XXX-WB001',
    rating: 4.88,
    total_gigs_completed: 42
  });

  const [profile, setProfile] = useState({
    id: 'emp_prf_001',
    company_name: 'Metro Logistics Distribution Center',
    business_type: 'Supply Chain & Warehousing',
    address: 'Plot 42, Kurla West Commercial Estate, Mumbai 400070',
    geo_lat: 19.0728,
    geo_lng: 72.8795,
  });

  // Current GPS coordinates (defaults to Kurla Hub, updates if browser geolocation allowed)
  const [userCoords, setUserCoords] = useState({ lat: 19.0760, lng: 72.8777 });

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setUserCoords({
            lat: parseFloat(pos.coords.latitude.toFixed(4)),
            lng: parseFloat(pos.coords.longitude.toFixed(4))
          });
        },
        () => {
          // Graceful fallback to default Mumbai hyperlocal hub
        }
      );
    }
  }, []);

  const switchRole = (newRole) => {
    setRole(newRole);
    localStorage.setItem('wb_role', newRole);

    if (newRole === 'worker') {
      setUser({
        id: 'usr_wrk_001',
        role: 'worker',
        name: 'Ramesh Patil',
        email: 'ramesh.patil@gmail.com',
        phone_masked: '+91 91XXX-WB089',
        rating: 4.95,
        total_gigs_completed: 68
      });
      setProfile({
        id: 'wrk_prf_001',
        kyc_status: 'verified',
        skills: ['Warehouse Loading', 'Logistics Sorting', 'Heavy Lifting', 'Inventory Audit'],
        bio: 'Reliable, punctual warehouse loading specialist with 4+ years experience.',
        verification_score: 97,
        hourly_rate: 240,
        current_lat: 19.0760,
        current_lng: 72.8777,
        is_available: true
      });
    } else {
      setUser({
        id: 'usr_emp_001',
        role: 'employer',
        name: 'Vikram Joshi',
        email: 'vikram@metrologistics.in',
        phone_masked: '+91 98XXX-WB001',
        rating: 4.88,
        total_gigs_completed: 42
      });
      setProfile({
        id: 'emp_prf_001',
        company_name: 'Metro Logistics Distribution Center',
        business_type: 'Supply Chain & Warehousing',
        address: 'Plot 42, Kurla West Commercial Estate, Mumbai 400070',
        geo_lat: 19.0728,
        geo_lng: 72.8795,
      });
    }
  };

  const updateProfileKyc = (kycResult, pitchResult) => {
    setProfile(prev => ({
      ...prev,
      kyc_status: 'verified',
      verification_score: pitchResult?.nlp_metrics?.reliability_score || 96,
      ocr_data: kycResult,
      video_pitch_analysis: pitchResult
    }));
  };

  return (
    <AuthContext.Provider value={{
      role,
      user,
      profile,
      userCoords,
      switchRole,
      updateProfileKyc
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
