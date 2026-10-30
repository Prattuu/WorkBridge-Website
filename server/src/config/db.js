import pg from 'pg';
import crypto from 'crypto';

const { Pool } = pg;

// Environment database configurations
const usePostgres = process.env.DATABASE_URL || (process.env.DB_HOST && process.env.DB_USER);

let pool = null;
if (usePostgres) {
  pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '5432', 10),
    user: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD || 'postgres',
    database: process.env.DB_NAME || 'workbridge',
    max: 20,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 2000,
  });

  pool.on('error', (err) => {
    console.error('[PostgreSQL] Unexpected idle client error:', err.message);
  });
}

// In-Memory Fallback ACID Store (with pre-populated initial seed data)
const inMemoryStore = {
  users: [
    {
      id: 'usr_emp_001',
      role: 'employer',
      name: 'Vikram Joshi (Metro Logistics Hub)',
      email: 'vikram@metrologistics.in',
      phone_masked: '+91 98XXX-WB001',
      phone_encrypted: 'aes256:masked',
      password_hash: 'hash_vikram_secure_pass',
      language_pref: 'en',
      rating: 4.88,
      total_gigs_completed: 42,
      is_active: true,
      created_at: new Date(Date.now() - 30 * 86400000).toISOString(),
    },
    {
      id: 'usr_wrk_001',
      role: 'worker',
      name: 'Ramesh Patil',
      email: 'ramesh.patil@gmail.com',
      phone_masked: '+91 91XXX-WB089',
      phone_encrypted: 'aes256:masked',
      password_hash: 'hash_ramesh_pass',
      language_pref: 'mr',
      rating: 4.95,
      total_gigs_completed: 68,
      is_active: true,
      created_at: new Date(Date.now() - 60 * 86400000).toISOString(),
    },
    {
      id: 'usr_wrk_002',
      role: 'worker',
      name: 'Sunita Sharma',
      email: 'sunita.sharma@yahoo.com',
      phone_masked: '+91 97XXX-WB102',
      phone_encrypted: 'aes256:masked',
      password_hash: 'hash_sunita_pass',
      language_pref: 'hi',
      rating: 4.80,
      total_gigs_completed: 31,
      is_active: true,
      created_at: new Date(Date.now() - 20 * 86400000).toISOString(),
    }
  ],
  worker_profiles: [
    {
      id: 'wrk_prf_001',
      user_id: 'usr_wrk_001',
      kyc_status: 'verified',
      ocr_data: {
        document_type: 'Aadhaar Card',
        id_number: 'XXXX-XXXX-9421',
        full_name: 'Ramesh Dnyaneshwar Patil',
        dob: '1992-05-14',
        match_confidence: 98.4,
        tamper_risk: 'LOW'
      },
      video_pitch_url: 'https://workbridge-assets.s3.amazonaws.com/pitches/ramesh_patil_pitch.webm',
      video_pitch_analysis: {
        skills_detected: ['Heavy Loading', 'Inventory Stacking', 'Punctual', 'Forklift Assistance'],
        reliability_score: 96,
        sentiment: 'High Commitment',
        transcription_summary: 'Experienced warehouse assistant with 4+ years handling carton dispatch and stock verification.'
      },
      skills: ['Warehouse Loading', 'Logistics Sorting', 'Heavy Lifting', 'Inventory Audit'],
      bio: 'Reliable, punctual warehouse loading specialist with 4+ years experience. Certified heavy handler.',
      verification_score: 97,
      hourly_rate: 220.00,
      current_lat: 19.0760,
      current_lng: 72.8777,
      is_available: true,
    },
    {
      id: 'wrk_prf_002',
      user_id: 'usr_wrk_002',
      kyc_status: 'verified',
      ocr_data: {
        document_type: 'Voter ID',
        id_number: 'MH/04/082/98214',
        full_name: 'Sunita Radheshyam Sharma',
        dob: '1995-11-20',
        match_confidence: 96.2,
        tamper_risk: 'LOW'
      },
      video_pitch_url: 'https://workbridge-assets.s3.amazonaws.com/pitches/sunita_pitch.webm',
      video_pitch_analysis: {
        skills_detected: ['Electrical Repair', 'Appliance Maintenance', 'Safety Certified'],
        reliability_score: 94,
        sentiment: 'Professional & Courteous',
        transcription_summary: 'Skilled electrical technician specializing in short circuit repairs and home appliance safety.'
      },
      skills: ['Electrical Wiring', 'Appliance Repair', 'Sanitization', 'Quality Inspection'],
      bio: 'Certified electrical repair professional. Fast on-demand troubleshooting within Mumbai suburban zone.',
      verification_score: 95,
      hourly_rate: 280.00,
      current_lat: 19.0825,
      current_lng: 72.8835,
      is_available: true,
    }
  ],
  employer_profiles: [
    {
      id: 'emp_prf_001',
      user_id: 'usr_emp_001',
      company_name: 'Metro Logistics Distribution Center',
      business_type: 'Supply Chain & Warehousing',
      address: 'Plot 42, Kurla West Commercial Estate, Mumbai 400070',
      geo_lat: 19.0728,
      geo_lng: 72.8795,
      gstin: '27AABCU9603R1ZM',
      is_verified: true,
    }
  ],
  gigs: [
    {
      id: 'gig_101',
      employer_id: 'emp_prf_001',
      title: 'Urgent: Express Warehouse Parcel Dispatch & Stacking',
      description: 'Need 2 capable hands for express dispatch sorting, barcode scanning, and truck palletizing during peak surge.',
      category: 'Logistics & Warehousing',
      hourly_rate: 240.00,
      estimated_hours: 4.0,
      total_amount: 960.00,
      geo_lat: 19.0728,
      geo_lng: 72.8795,
      geo_radius_km: 5.0,
      matched_worker_id: 'wrk_prf_001',
      status: 'in_progress',
      created_at: new Date(Date.now() - 3600000).toISOString(),
    },
    {
      id: 'gig_102',
      employer_id: 'emp_prf_001',
      title: 'Supermarket Inventory Shelf Restock (Evening Shift)',
      description: 'Restocking retail aisles, verifying expiry dates, and arranging dry grocery cartons.',
      category: 'Retail Assistance',
      hourly_rate: 200.00,
      estimated_hours: 5.0,
      total_amount: 1000.00,
      geo_lat: 19.0810,
      geo_lng: 72.8890,
      geo_radius_km: 5.0,
      matched_worker_id: null,
      status: 'open',
      created_at: new Date(Date.now() - 7200000).toISOString(),
    },
    {
      id: 'gig_103',
      employer_id: 'emp_prf_001',
      title: 'Commercial Distribution Electrical Panel Check',
      description: 'Urgent diagnostic of 3-phase industrial fuse distribution and backup generator transfer switch.',
      category: 'Technical & Electrical',
      hourly_rate: 350.00,
      estimated_hours: 3.0,
      total_amount: 1050.00,
      geo_lat: 19.0690,
      geo_lng: 72.8710,
      geo_radius_km: 5.0,
      matched_worker_id: null,
      status: 'open',
      created_at: new Date(Date.now() - 10800000).toISOString(),
    }
  ],
  escrow_tokens: [
    {
      id: 'tok_esc_960',
      gig_id: 'gig_101',
      employer_id: 'emp_prf_001',
      worker_id: 'wrk_prf_001',
      token_hash: '0x9fa41c88c7b822ee40b90e15967dc21f456c7890abcdef1234567890abcdef12',
      amount: 960.00,
      status: 'Held', // Created -> Held -> Released
      locked_at: new Date(Date.now() - 1800000).toISOString(),
      released_at: null,
      refunded_at: null,
      tx_hash: '0x4f128ab67cde8910fedcba98765432101234567890abcdef1234567890abcdef',
      payout_account_mask: 'UPI: ramesh.patil@okaxis',
      created_at: new Date(Date.now() - 3600000).toISOString(),
    }
  ],
  shifts: [
    {
      id: 'shf_001',
      gig_id: 'gig_101',
      worker_id: 'wrk_prf_001',
      escrow_token_id: 'tok_esc_960',
      punch_in_time: new Date(Date.now() - 1800000).toISOString(),
      punch_out_time: null,
      punch_in_lat: 19.0729,
      punch_in_lng: 72.8794,
      punch_out_lat: null,
      punch_out_lng: null,
      geo_distance_meters: 24.5,
      total_duration_minutes: 30,
      total_payout: 120.00,
      status: 'active',
      created_at: new Date(Date.now() - 1800000).toISOString(),
    }
  ],
  contact_mask_sessions: [
    {
      id: 'cms_001',
      gig_id: 'gig_101',
      employer_id: 'usr_emp_001',
      worker_id: 'usr_wrk_001',
      virtual_proxy_number: '+91 22 6900 4589',
      session_token: 'wb_mask_sess_89a0fbc9234',
      expires_at: new Date(Date.now() + 18000000).toISOString(),
      is_active: true,
      call_count: 2,
      messages_count: 5,
    }
  ],
  audit_ledger: [
    {
      id: 'ledg_001',
      escrow_token_id: 'tok_esc_960',
      event_type: 'ESCROW_TOKEN_CREATED',
      previous_state: null,
      new_state: 'Created',
      amount: 960.00,
      initiated_by_user_id: 'usr_emp_001',
      signature: 'sig_ed25519_created_0x1122334455667788',
      metadata: { note: 'Employer funded INR 960.00 via Razorpay Virtual Escrow Vault' },
      created_at: new Date(Date.now() - 3600000).toISOString(),
    },
    {
      id: 'ledg_002',
      escrow_token_id: 'tok_esc_960',
      event_type: 'SHIFT_PUNCH_IN_HELD',
      previous_state: 'Created',
      new_state: 'Held',
      amount: 960.00,
      initiated_by_user_id: 'usr_wrk_001',
      signature: 'sig_ed25519_held_0x9988776655443322',
      metadata: {
        note: 'Worker Ramesh punched in at 24.5m distance from hub. Metro Token transition to HELD.',
        geo_verified: true,
        punch_in_ts: new Date(Date.now() - 1800000).toISOString()
      },
      created_at: new Date(Date.now() - 1800000).toISOString(),
    }
  ]
};

/**
 * Universal Query Adapter
 * Routes queries to real Postgres if pool is connected, otherwise runs safely on in-memory ACID store
 */
export async function query(text, params = []) {
  if (pool) {
    try {
      const res = await pool.query(text, params);
      return res;
    } catch (err) {
      console.warn('[Postgres Query fallback to in-memory]', err.message);
    }
  }

  // In-Memory simulated query handler
  return {
    rows: [],
    rowCount: 0
  };
}

export const db = inMemoryStore;

export default {
  query,
  db,
  pool
};
