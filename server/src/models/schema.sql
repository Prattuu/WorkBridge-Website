-- ==============================================================================
-- WorkBridge Relational Database Schema (PostgreSQL 3NF Normalized)
-- Hyperlocal On-Demand Gig Workforce Platform with Single-Token Dynamic Escrow
-- Strict ACID Compliance, Foreign Key Cascades, and B-Tree Indexes
-- ==============================================================================

-- Enable UUID extension if available
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Table 1: USERS (Core identity & authentication with role-based segregation)
CREATE TABLE IF NOT EXISTS users (
    id VARCHAR(36) PRIMARY KEY,
    role VARCHAR(20) NOT NULL CHECK (role IN ('employer', 'worker', 'admin')),
    name VARCHAR(100) NOT NULL,
    email VARCHAR(120) UNIQUE NOT NULL,
    phone_masked VARCHAR(20) NOT NULL,
    phone_encrypted TEXT,
    password_hash VARCHAR(255) NOT NULL,
    language_pref VARCHAR(10) DEFAULT 'en' CHECK (language_pref IN ('en', 'hi', 'mr')),
    rating NUMERIC(3, 2) DEFAULT 5.00 CHECK (rating >= 0 AND rating <= 5.00),
    total_gigs_completed INT DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);

-- Table 2: WORKER_PROFILES (Worker verification, AI score, skills, KYC status)
CREATE TABLE IF NOT EXISTS worker_profiles (
    id VARCHAR(36) PRIMARY KEY,
    user_id VARCHAR(36) NOT NULL UNIQUE REFERENCES users(id) ON DELETE CASCADE,
    kyc_status VARCHAR(20) DEFAULT 'pending' CHECK (kyc_status IN ('pending', 'verified', 'rejected')),
    ocr_data JSONB DEFAULT '{}'::jsonb,
    video_pitch_url TEXT,
    video_pitch_analysis JSONB DEFAULT '{}'::jsonb,
    skills TEXT[] DEFAULT '{}',
    bio TEXT,
    verification_score INT DEFAULT 0 CHECK (verification_score >= 0 AND verification_score <= 100),
    hourly_rate NUMERIC(10, 2) DEFAULT 150.00,
    current_lat NUMERIC(10, 7),
    current_lng NUMERIC(10, 7),
    is_available BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_worker_kyc_status ON worker_profiles(kyc_status);
CREATE INDEX IF NOT EXISTS idx_worker_coords ON worker_profiles(current_lat, current_lng);

-- Table 3: EMPLOYER_PROFILES (Employer company data, geo-anchor location)
CREATE TABLE IF NOT EXISTS employer_profiles (
    id VARCHAR(36) PRIMARY KEY,
    user_id VARCHAR(36) NOT NULL UNIQUE REFERENCES users(id) ON DELETE CASCADE,
    company_name VARCHAR(150) NOT NULL,
    business_type VARCHAR(80) NOT NULL,
    address TEXT NOT NULL,
    geo_lat NUMERIC(10, 7) NOT NULL,
    geo_lng NUMERIC(10, 7) NOT NULL,
    gstin VARCHAR(20),
    is_verified BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_employer_geo ON employer_profiles(geo_lat, geo_lng);

-- Table 4: GIGS (Hyperlocal gig postings within 5km radius)
CREATE TABLE IF NOT EXISTS gigs (
    id VARCHAR(36) PRIMARY KEY,
    employer_id VARCHAR(36) NOT NULL REFERENCES employer_profiles(id) ON DELETE CASCADE,
    title VARCHAR(150) NOT NULL,
    description TEXT NOT NULL,
    category VARCHAR(50) NOT NULL,
    hourly_rate NUMERIC(10, 2) NOT NULL CHECK (hourly_rate > 0),
    estimated_hours NUMERIC(4, 1) NOT NULL CHECK (estimated_hours > 0),
    total_amount NUMERIC(10, 2) NOT NULL CHECK (total_amount > 0),
    geo_lat NUMERIC(10, 7) NOT NULL,
    geo_lng NUMERIC(10, 7) NOT NULL,
    geo_radius_km NUMERIC(4, 2) DEFAULT 5.00,
    matched_worker_id VARCHAR(36) REFERENCES worker_profiles(id) ON DELETE SET NULL,
    status VARCHAR(20) DEFAULT 'open' CHECK (status IN ('open', 'matched', 'in_progress', 'completed', 'cancelled')),
    start_time TIMESTAMP WITH TIME ZONE,
    end_time TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_gigs_status ON gigs(status);
CREATE INDEX IF NOT EXISTS idx_gigs_geo ON gigs(geo_lat, geo_lng);
CREATE INDEX IF NOT EXISTS idx_gigs_category ON gigs(category);

-- Table 5: ESCROW_TOKENS (Single-token dynamic financial escrow state machine)
-- State lifecycle: Created -> Held -> Released (or Refunded)
CREATE TABLE IF NOT EXISTS escrow_tokens (
    id VARCHAR(36) PRIMARY KEY,
    gig_id VARCHAR(36) NOT NULL UNIQUE REFERENCES gigs(id) ON DELETE CASCADE,
    employer_id VARCHAR(36) NOT NULL REFERENCES employer_profiles(id),
    worker_id VARCHAR(36) REFERENCES worker_profiles(id),
    token_hash VARCHAR(64) UNIQUE NOT NULL,
    amount NUMERIC(10, 2) NOT NULL CHECK (amount > 0),
    status VARCHAR(20) DEFAULT 'Created' CHECK (status IN ('Created', 'Held', 'Released', 'Refunded')),
    locked_at TIMESTAMP WITH TIME ZONE,
    released_at TIMESTAMP WITH TIME ZONE,
    refunded_at TIMESTAMP WITH TIME ZONE,
    tx_hash VARCHAR(66),
    payout_account_mask VARCHAR(30),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_escrow_status ON escrow_tokens(status);
CREATE INDEX IF NOT EXISTS idx_escrow_token_hash ON escrow_tokens(token_hash);

-- Table 6: SHIFTS (Real-time punch-in/punch-out geo-verified tracking)
CREATE TABLE IF NOT EXISTS shifts (
    id VARCHAR(36) PRIMARY KEY,
    gig_id VARCHAR(36) NOT NULL REFERENCES gigs(id) ON DELETE CASCADE,
    worker_id VARCHAR(36) NOT NULL REFERENCES worker_profiles(id),
    escrow_token_id VARCHAR(36) NOT NULL REFERENCES escrow_tokens(id),
    punch_in_time TIMESTAMP WITH TIME ZONE,
    punch_out_time TIMESTAMP WITH TIME ZONE,
    punch_in_lat NUMERIC(10, 7),
    punch_in_lng NUMERIC(10, 7),
    punch_out_lat NUMERIC(10, 7),
    punch_out_lng NUMERIC(10, 7),
    geo_distance_meters NUMERIC(8, 2),
    total_duration_minutes INT DEFAULT 0,
    total_payout NUMERIC(10, 2) DEFAULT 0.00,
    status VARCHAR(20) DEFAULT 'scheduled' CHECK (status IN ('scheduled', 'active', 'completed', 'disputed')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_shifts_worker_status ON shifts(worker_id, status);

-- Table 7: CONTACT_MASK_SESSIONS (Privacy shield virtual proxy bridging)
CREATE TABLE IF NOT EXISTS contact_mask_sessions (
    id VARCHAR(36) PRIMARY KEY,
    gig_id VARCHAR(36) NOT NULL REFERENCES gigs(id) ON DELETE CASCADE,
    employer_id VARCHAR(36) NOT NULL REFERENCES users(id),
    worker_id VARCHAR(36) NOT NULL REFERENCES users(id),
    virtual_proxy_number VARCHAR(30) NOT NULL,
    session_token VARCHAR(64) UNIQUE NOT NULL,
    expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    call_count INT DEFAULT 0,
    messages_count INT DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_mask_session_token ON contact_mask_sessions(session_token);

-- Table 8: AUDIT_LEDGER (Immutable, tamper-evident financial transition ledger)
CREATE TABLE IF NOT EXISTS audit_ledger (
    id VARCHAR(36) PRIMARY KEY,
    escrow_token_id VARCHAR(36) NOT NULL REFERENCES escrow_tokens(id) ON DELETE CASCADE,
    event_type VARCHAR(50) NOT NULL,
    previous_state VARCHAR(20),
    new_state VARCHAR(20) NOT NULL,
    amount NUMERIC(10, 2) NOT NULL,
    initiated_by_user_id VARCHAR(36) NOT NULL REFERENCES users(id),
    signature VARCHAR(128) NOT NULL,
    metadata JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_ledger_token ON audit_ledger(escrow_token_id);
CREATE INDEX IF NOT EXISTS idx_ledger_created ON audit_ledger(created_at);
