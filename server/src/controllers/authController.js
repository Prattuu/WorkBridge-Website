import { db } from '../config/db.js';
import crypto from 'crypto';

export const registerUser = async (req, res) => {
  try {
    const { name, email, role, language_pref, hourly_rate, skills, company_name } = req.body;
    
    if (!name || !email || !role) {
      return res.status(400).json({ success: false, message: 'Name, email, and role are required.' });
    }

    const existingUser = db.users.find(u => u.email.toLowerCase() === email.toLowerCase());
    if (existingUser) {
      return res.status(400).json({ success: false, message: 'User with this email already exists.' });
    }

    const userId = `usr_${role === 'employer' ? 'emp' : 'wrk'}_${Date.now().toString().slice(-5)}`;
    const randomSuffix = Math.floor(100 + Math.random() * 900);
    const maskedPhone = `+91 98XXX-WB${randomSuffix}`;

    const newUser = {
      id: userId,
      role,
      name,
      email,
      phone_masked: maskedPhone,
      phone_encrypted: `aes256:${Buffer.from(email).toString('base64')}`,
      password_hash: 'scrypt_hashed_token',
      language_pref: language_pref || 'en',
      rating: 5.0,
      total_gigs_completed: 0,
      is_active: true,
      created_at: new Date().toISOString()
    };

    db.users.push(newUser);

    let profile = null;
    if (role === 'worker') {
      profile = {
        id: `wrk_prf_${Date.now().toString().slice(-5)}`,
        user_id: userId,
        kyc_status: 'pending',
        ocr_data: {},
        video_pitch_url: null,
        video_pitch_analysis: {},
        skills: skills || ['General Labour', 'Assembly'],
        bio: 'Ready to work within 5km radius.',
        verification_score: 50,
        hourly_rate: Number(hourly_rate) || 180,
        current_lat: 19.0760,
        current_lng: 72.8777,
        is_available: true
      };
      db.worker_profiles.push(profile);
    } else {
      profile = {
        id: `emp_prf_${Date.now().toString().slice(-5)}`,
        user_id: userId,
        company_name: company_name || `${name}'s Operations`,
        business_type: 'Local Enterprise',
        address: '5th Floor, Trade Center, BKC, Mumbai',
        geo_lat: 19.0728,
        geo_lng: 72.8795,
        gstin: '27AAECW1234F1Z8',
        is_verified: true
      };
      db.employer_profiles.push(profile);
    }

    const token = crypto.randomBytes(32).toString('hex');

    return res.status(201).json({
      success: true,
      message: 'User registered successfully with privacy shield.',
      token,
      user: newUser,
      profile
    });
  } catch (error) {
    console.error('Registration Error:', error);
    return res.status(500).json({ success: false, message: 'Server error during registration.' });
  }
};

export const loginUser = async (req, res) => {
  try {
    const { email, role } = req.body;
    let user = null;

    if (email) {
      user = db.users.find(u => u.email.toLowerCase() === email.toLowerCase());
    } else if (role) {
      user = db.users.find(u => u.role === role);
    } else {
      user = db.users[0];
    }

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found.' });
    }

    const profile = user.role === 'worker'
      ? db.worker_profiles.find(p => p.user_id === user.id)
      : db.employer_profiles.find(p => p.user_id === user.id);

    const token = crypto.randomBytes(32).toString('hex');

    return res.json({
      success: true,
      token,
      user,
      profile
    });
  } catch (error) {
    console.error('Login Error:', error);
    return res.status(500).json({ success: false, message: 'Server error during login.' });
  }
};

export const getCurrentUser = async (req, res) => {
  try {
    const userId = req.headers['x-user-id'] || 'usr_emp_001';
    const user = db.users.find(u => u.id === userId) || db.users[0];
    const profile = user.role === 'worker'
      ? db.worker_profiles.find(p => p.user_id === user.id)
      : db.employer_profiles.find(p => p.user_id === user.id);

    return res.json({
      success: true,
      user,
      profile
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const updateLanguage = async (req, res) => {
  try {
    const { language } = req.body;
    const userId = req.headers['x-user-id'] || 'usr_emp_001';

    const user = db.users.find(u => u.id === userId);
    if (user && ['en', 'hi', 'mr'].includes(language)) {
      user.language_pref = language;
    }

    return res.json({
      success: true,
      message: `Language updated to ${language}`,
      language
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};
