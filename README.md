# WorkBridge — Hyperlocal On-Demand Gig Workforce Platform

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
[![Node.js](https://img.shields.io/badge/Node.js-v20%2B-green.svg)](https://nodejs.org/)
[![React](https://img.shields.io/badge/React-v18.3-61DAFB.svg)](https://react.dev/)
[![Python](https://img.shields.io/badge/Python-v3.11-3776AB.svg)](https://www.python.org/)
[![Database](https://img.shields.io/badge/PostgreSQL-3NF_ACID-336791.svg)](https://www.postgresql.org/)
[![Cache](https://img.shields.io/badge/Redis-Dynamic_Timer-DC382D.svg)](https://redis.io/)
[![Cloud](https://img.shields.io/badge/AWS-EC2_%7C_S3_%7C_RDS_%7C_ALB-FF9900.svg)](https://aws.amazon.com/)

**WorkBridge** is a production-grade, multi-tier web platform engineered for an on-demand hyperlocal gig workforce operating within a strict **5 km geo-fence**. It connects local businesses and homeowners (Employers) with hourly informal and semi-skilled workers (Gig Partners) through trust-first financial primitives and automated AI validation.

---

## 🌟 Core Architectural Differentiators

### 1. Single-Token Dynamic Escrow (Metro-Token Protocol)
A deterministic financial state machine guaranteeing immediate compensation without payroll delays:
```text
[Created] ────(Worker Punches In within 5km)────> [Held] ────(Worker Punches Out)────> [Released]
Funds locked by employer                  Funds securely held during shift         Instant UPI disbursement
```
- **Created:** Employer commits budget into virtual vault upon posting a gig.
- **Held:** Shift begins via dynamic QR scan & geo-distance verification; funds are strictly locked.
- **Released:** Shift concludes; dynamic timer computes worked duration and auto-disburses funds directly to worker UPI with a tamper-evident cryptographic signature.

### 2. Automated AI Verification Engine
- **Mock OCR Document Analysis:** High-accuracy Aadhaar (UIDAI) and Voter ID document parser simulating bounding-box coordinate extraction, regex identity verification, and anti-tamper security checks.
- **30-Second Video Pitch NLP Analyzer:** Speech-to-text NLP parser (Whisper/BERT simulation) extracting candidate technical skills (loading, inventory, electrical, plumbing), punctuality commitment, and generating an automated reliability score (0–100).

### 3. Accessibility-First Design System
- **Brand Identity:** Royal Navy Blue (`#1E3A8A`), Slate, and Pure White with high contrast ratios for readability in bright sunlight.
- **Trilingual Localization:** Comprehensive English, Hindi (हिंदी), and Marathi (मराठी) localization.
- **Native Browser Voice Guidance:** Language-aware acoustic voice guidance powered by native `window.speechSynthesis`.

### 4. Privacy Shield Contact Masking
- Prevents direct phone number exchange.
- Communication routes through a dedicated virtual proxy bridge (`+91 22 6900 XXXX`) with temporary session tokens and in-app encrypted relay messaging.

---

## 📁 Repository & Directory Layout

```text
workbridge/
├── .gitignore
├── README.md
├── package.json
├── docker-compose.yml
├── server/
│   ├── package.json
│   ├── Dockerfile
│   ├── src/
│   │   ├── server.js
│   │   ├── config/
│   │   │   ├── db.js
│   │   │   └── redis.js
│   │   ├── controllers/
│   │   │   ├── authController.js
│   │   │   ├── gigController.js
│   │   │   └── escrowController.js
│   │   ├── routes/
│   │   │   ├── authRoutes.js
│   │   │   ├── gigRoutes.js
│   │   │   └── escrowRoutes.js
│   │   └── models/
│   │       └── schema.sql
│   └── ai_service/
│       ├── app.py
│       ├── requirements.txt
│       ├── Dockerfile
│       └── utils/
│           ├── ocr_engine.py
│           └── pitch_analyzer.py
└── client/
    ├── package.json
    ├── tailwind.config.js
    ├── postcss.config.js
    ├── vite.config.js
    ├── Dockerfile
    ├── index.html
    ├── public/
    │   └── index.html
    └── src/
        ├── App.jsx
        ├── index.jsx
        ├── index.css
        ├── context/
        │   ├── AuthContext.jsx
        │   ├── LanguageContext.jsx
        │   └── EscrowContext.jsx
        ├── components/
        │   ├── common/
        │   │   ├── Navbar.jsx
        │   │   ├── VoiceAssistant.jsx
        │   │   ├── LanguageSelector.jsx
        │   │   └── ContactMaskModal.jsx
        │   ├── escrow/
        │   │   ├── EscrowStatusBadge.jsx
        │   │   ├── DynamicQRCode.jsx
        │   │   └── ShiftTimer.jsx
        │   └── debug/
        │       └── ArchitectureInspector.jsx
        └── pages/
            ├── LandingPage.jsx
            ├── RoleSelection.jsx
            ├── EmployerPortal.jsx
            └── WorkerPortal.jsx
```

---

## 🏗️ 3NF Relational Database Schema (8 Tables)

1. **`users`:** Core user entity with role-based segregation (`employer`, `worker`), masked phone number, language preference (`en`, `hi`, `mr`), and ratings.
2. **`worker_profiles`:** Worker verification state, KYC status, OCR data, 30-sec pitch URL, AI reliability score, and current coordinates.
3. **`employer_profiles`:** Business registration, company name, GSTIN, and geo-anchor coordinates.
4. **`gigs`:** Hyperlocal gig postings with 5 km geo-fence, hourly rates, estimated hours, and total escrow allocation.
5. **`escrow_tokens`:** Single-token financial state machine tracking `Created` -> `Held` -> `Released`, token hashes, and settlement transaction hashes.
6. **`shifts`:** Shift tracking with punch-in/out timestamps, GPS coordinates, distance in meters, and total payout.
7. **`contact_mask_sessions`:** Virtual bridge lines (`+91 22 6900 XXXX`), session expiry tokens, and relay call logs.
8. **`audit_ledger`:** Immutable, tamper-evident financial transition ledger with Ed25519 signature formats.

---

## ☁️ Cloud & Serverless Architecture (AWS & Firebase)

- **Edge Layer:** Amazon CloudFront CDN edge caching with AWS Application Load Balancer (ALB) routing.
- **Compute Cluster:** AWS EC2 Auto-Scaling Group running Node.js Express & Python AI microservice.
- **Serverless Events:** AWS Lambda executing dynamic single-token lifecycle transitions and webhook settlements.
- **Media Vault:** AWS S3 with pre-signed upload URLs for KYC documents and 30-sec video pitches.
- **Database:** AWS RDS Multi-AZ PostgreSQL 16 enforcing strict ACID transactions.
- **Cache & Timers:** AWS ElastiCache Redis for in-memory session caching, Haversine geo-indexing, and live shift countdowns.
- **Push Pipeline:** Firebase Cloud Messaging (FCM) sending shift triggers and escrow disbursal notifications.

---

## 🚀 Quickstart & Local Execution

### Option A: Docker Compose (All-in-One)
```bash
docker-compose up --build
```
- Client runs on `http://localhost:3000`
- API Server runs on `http://localhost:5000`
- AI Microservice runs on `http://localhost:8000`
- PostgreSQL on port `5432` | Redis on port `6379`

### Option B: Local Node & Python Execution

1. **Install Dependencies:**
   ```powershell
   # Install server dependencies
   cd server
   npm install

   # Install client dependencies
   cd ../client
   npm install
   ```

2. **Run Services:**
   - **Terminal 1 (Backend Server):**
     ```powershell
     cd server
     node src/server.js
     ```
   - **Terminal 2 (Python AI Service):**
     ```powershell
     cd server/ai_service
     python app.py
     ```
   - **Terminal 3 (React Client):**
     ```powershell
     cd client
     npm run dev
     ```

3. **Open in Browser:**
   Navigate to `http://localhost:3000` to interact with the platform.

---

## 🔒 Security & Privacy Notice
All phone numbers on WorkBridge are masked (`+91 98XXX-WB001`). Direct PII exchange is disabled by policy. Voice interactions and messages route through temporary virtual bridge channels expiring immediately upon escrow disbursal.
