# Tena AI (ጤና AI) — Production Health Intelligence & Telehealth Platform

> Next-generation healthcare accessibility platform built for Ethiopia and East Africa, combining clinical-grade AI symptom triage, verified doctor consultations, and prescription OCR.

---

## Key Highlights & UI/UX Standards

- **Zero Emojis**: 100% clean, professional SVG medical icons (Lucide React & IconScout).
- **Concise English**: Plain, non-jargon clinical explanations tailored for accessibility.
- **Design System**: Obsidian Dark Canvas (`#080C14`), Slate Cards (`#0F172A`), Emerald Vitality (`#10B981`), and Electric Cyan (`#06B6D4`).
- **Clinical Safety**: Integrated red-flag detection, urgency level categorization (Low, Moderate, Urgent, Emergency), and emergency dispatch routing (907 / 992).

---

## GitHub Student Developer Pack & Google Pro Integrations

| Tool / Offer | Role in Tena AI |
| :--- | :--- |
| **Google Gemini Pro & Vision** | Symptom triage evaluation, clinical summary generator, prescription OCR scanner |
| **ToDiagram** | Importable architecture & schema blueprint (`docs/TODIAGRAM_SCHEMA.json`) |
| **Requestly** | API mocking, network latency simulation (`docs/REQUESTLY_RULES.json`) |
| **TestMu AI (LambdaTest) & BrowserStack** | Cross-device & responsive testing across mobile viewports |
| **Stripe & TestMail** | Consultation checkout intent & automated booking notifications |
| **Appwrite Cloud & Clerk** | Secure user management & medical document storage |

---

## Project Structure

```
Tena-AI/
├── client/                      # React 18 + Vite + Tailwind CSS + Lucide Icons
│   ├── src/
│   │   ├── components/          # Navbar, Footer, UI Primitives
│   │   ├── pages/               # Home, Triage, Doctors, LabScanner, Emergency, Dashboard, Auth
│   │   ├── context/             # AuthContext
│   │   ├── services/            # Axios API client
│   │   ├── App.jsx              # Main Router
│   │   └── index.css            # Tailwind & Glassmorphism styles
│   ├── tailwind.config.js       # Custom obsidian & emerald theme
│   └── vite.config.js           # Proxy configuration to server:5000
│
├── server/                      # Node.js + Express REST API
│   ├── src/
│   │   ├── config/              # MongoDB & Gemini AI initialization
│   │   ├── models/              # User, Doctor, TriageRecord, Appointment, Prescription, HealthFacility
│   │   ├── controllers/         # Triage (Gemini Pro), OCR, Auth, Doctors, Appointments, Payments
│   │   ├── routes/              # Modular Express routes
│   │   └── index.js             # API entrypoint
│   └── .env.example             # Environment variable template
│
└── docs/
    ├── TODIAGRAM_SCHEMA.json    # Entity relationship map for ToDiagram
    └── REQUESTLY_RULES.json     # Mocking rules for Requestly
```

---

## Quick Start Guide

### 1. Backend Server Setup
```bash
cd server
npm install
npm run dev
```
*Runs on `http://localhost:5000`*

### 2. Frontend Client Setup
```bash
cd client
npm install
npm run dev
```
*Runs on `http://localhost:5173`*

---

## Environment Variables (`server/.env`)

```env
PORT=5000
NODE_ENV=development
CLIENT_URL=http://localhost:5173

# MongoDB Atlas
MONGODB_URI=mongodb://127.0.0.1:27017/tena_ai

# Google Gemini Pro (from Google AI Studio / Google Cloud)
GEMINI_API_KEY=your_gemini_api_key_here

# JWT Secret
JWT_SECRET=tena_ai_super_secret_jwt_key_2026

# Stripe Gateway
STRIPE_SECRET_KEY=sk_test_your_key
```
