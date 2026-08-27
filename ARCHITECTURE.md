# TenaAI System Architecture

## 🏗️ High-Level Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                     CLIENT (React + Vite)                    │
│  ┌────────────┐  ┌────────────┐  ┌─────────────────────┐   │
│  │   Pages    │  │ Components │  │   State Management  │   │
│  │  Landing   │  │   Button   │  │   Zustand Stores    │   │
│  │  Dashboard │  │   Cards    │  │   Auth Context      │   │
│  │  Assessment│  │   Forms    │  │   User Context      │   │
│  └────────────┘  └────────────┘  └─────────────────────┘   │
│                           ↓                                  │
│                    ┌──────────────┐                          │
│                    │  API Service │                          │
│                    │   (Axios)    │                          │
│                    └──────────────┘                          │
└─────────────────────────┬───────────────────────────────────┘
                          │ HTTPS/JSON
                          ↓
┌─────────────────────────────────────────────────────────────┐
│                  SERVER (Node.js + Express)                  │
│  ┌──────────────────────────────────────────────────────┐   │
│  │               Middleware Layer                        │   │
│  │  • CORS  • Helmet  • Rate Limit  • JWT Auth         │   │
│  └──────────────────────────────────────────────────────┘   │
│                           ↓                                  │
│  ┌──────────────────────────────────────────────────────┐   │
│  │                   API Routes                          │   │
│  │  /auth  /patients  /assessments  /voice  /payments  │   │
│  └──────────────────────────────────────────────────────┘   │
│                           ↓                                  │
│  ┌──────────────────────────────────────────────────────┐   │
│  │                   Controllers                         │   │
│  │  Handle business logic and request validation        │   │
│  └──────────────────────────────────────────────────────┘   │
│                           ↓                                  │
│  ┌──────────────────────────────────────────────────────┐   │
│  │                    Services                           │   │
│  │  • AI Service (Gemini)  • Voice Service             │   │
│  │  • Payment Service      • Email Service             │   │
│  └──────────────────────────────────────────────────────┘   │
└─────────────────────────┬───────────────────────────────────┘
                          ↓
┌─────────────────────────────────────────────────────────────┐
│                   DATABASE & EXTERNAL SERVICES               │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐   │
│  │ MongoDB  │  │  Clerk   │  │  Stripe  │  │ Appwrite │   │
│  │  Atlas   │  │  Auth    │  │ Payments │  │  Storage │   │
│  └──────────┘  └──────────┘  └──────────┘  └──────────┘   │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐   │
│  │  Gemini  │  │TestMail  │  │ Icons8   │  │ToDiagram │   │
│  │   Pro    │  │  SMTP    │  │ IconScout│  │          │   │
│  └──────────┘  └──────────┘  └──────────┘  └──────────┘   │
└─────────────────────────────────────────────────────────────┘
```

## 📊 Data Flow Architecture

### 1. User Authentication Flow (Clerk)

```
User → Clerk UI → Clerk API → Webhook → Server → MongoDB → JWT Token → Client
```

**Steps**:
1. User signs up/in via Clerk UI
2. Clerk handles authentication
3. Clerk webhook notifies our server
4. Server creates/updates user in MongoDB
5. Server generates JWT token
6. Client stores token for API requests

---

### 2. Voice Assessment Flow

```
User Voice Input → MediaRecorder → Audio File → Appwrite Storage
                                      ↓
                              Voice Service (Transcription)
                                      ↓
                              AI Service (Gemini Pro Analysis)
                                      ↓
                              Assessment Document → MongoDB
                                      ↓
                              Clinical Summary → Client Display
```

**Steps**:
1. User records symptoms in preferred language
2. Browser MediaRecorder captures audio
3. Audio uploaded to Appwrite Cloud Storage
4. Voice service transcribes audio to text
5. AI service analyzes symptoms with Gemini Pro
6. Assessment saved to MongoDB with confidence score
7. Clinical summary displayed to user

---

### 3. Payment Flow (Stripe)

```
User → Select Plan → Stripe Checkout → Payment → Webhook → Server → Update User → Confirmation Email
```

**Steps**:
1. User selects subscription plan
2. Server creates Stripe checkout session
3. User redirected to Stripe payment page
4. User completes payment
5. Stripe webhook notifies server
6. Server updates user subscription status
7. Confirmation email sent via TestMail
8. User redirected to dashboard

---

## 🗄️ Database Schema Design

### Collections

#### 1. Users Collection
```javascript
{
  _id: ObjectId,
  clerkId: String (indexed),
  email: String (unique, indexed),
  firstName: String,
  lastName: String,
  phoneNumber: String,
  role: Enum['patient', 'doctor', 'admin'],
  language: Enum['english', 'amharic', 'afaan_oromoo'],
  subscription: {
    plan: Enum['free', 'basic', 'premium'],
    status: String,
    stripeCustomerId: String,
    stripeSubscriptionId: String
  },
  createdAt: Date,
  updatedAt: Date
}
```

#### 2. Assessments Collection
```javascript
{
  _id: ObjectId,
  patient: ObjectId (ref: User, indexed),
  assessmentId: String (unique),
  voiceRecording: {
    url: String,
    duration: Number,
    language: String,
    transcript: String
  },
  symptoms: [{
    symptom: String,
    severity: Enum['mild', 'moderate', 'severe'],
    duration: String
  }],
  aiAnalysis: {
    confidence: Number (0-100),
    possibleConditions: Array,
    clinicalSummary: String,
    urgencyLevel: Enum['routine', 'urgent', 'emergency']
  },
  status: Enum['pending', 'analyzed', 'reviewed'],
  isEmergency: Boolean,
  createdAt: Date,
  updatedAt: Date
}
```

#### 3. Payments Collection
```javascript
{
  _id: ObjectId,
  user: ObjectId (ref: User, indexed),
  stripePaymentId: String (unique),
  amount: Number,
  plan: String,
  status: Enum['pending', 'succeeded', 'failed'],
  createdAt: Date
}
```

---

## 🔐 Security Architecture

### Authentication Flow

```
Client Request → JWT Token → Auth Middleware → Verify Token → Check User → Check Subscription → Allow/Deny
```

**Security Layers**:
1. **Helmet.js**: HTTP header security
2. **Rate Limiting**: Prevent brute force attacks
3. **CORS**: Whitelist client domains only
4. **JWT**: Stateless authentication tokens
5. **Input Validation**: Sanitize all user inputs
6. **Environment Variables**: Sensitive data protection
7. **Clerk**: Professional auth provider

---

## 🚀 API Architecture

### RESTful Endpoints

#### Authentication (`/api/auth`)
- `POST /register` - Register user
- `GET /me` - Get current user
- `PUT /profile` - Update profile
- `DELETE /account` - Delete account

#### Assessments (`/api/assessments`)
- `POST /` - Create assessment
- `GET /` - List assessments
- `GET /:id` - Get assessment detail
- `PUT /:id` - Update assessment
- `DELETE /:id` - Delete assessment

#### Voice (`/api/voice`)
- `POST /upload` - Upload audio file
- `POST /transcribe` - Transcribe audio
- `POST /analyze` - AI analysis

#### Payments (`/api/payments`)
- `POST /create-checkout-session` - Start payment
- `POST /webhook` - Stripe webhooks
- `GET /history` - Payment history
- `POST /cancel-subscription` - Cancel plan

---

## 🧩 Component Architecture (Frontend)

### Component Hierarchy

```
App
├── Layout
│   ├── Header (Navigation, User Menu)
│   ├── Sidebar (Dashboard Navigation)
│   └── Footer
├── Pages
│   ├── LandingPage
│   │   ├── Hero
│   │   ├── Features
│   │   ├── Pricing
│   │   └── CTA
│   ├── Dashboard
│   │   ├── StatsCards
│   │   ├── RecentAssessments
│   │   └── HealthChart
│   ├── NewAssessment
│   │   ├── VoiceRecorder
│   │   ├── LanguageSelector
│   │   ├── SymptomForm
│   │   └── AnalysisDisplay
│   └── Profile
│       ├── PersonalInfo
│       ├── Subscription
│       └── Settings
└── Shared Components
    ├── Button
    ├── Input
    ├── Card
    ├── Modal
    └── Toast
```

---

## 🔄 State Management

### Zustand Stores

#### 1. Auth Store
```javascript
{
  user: null,
  token: null,
  isAuthenticated: false,
  login: (token) => {},
  logout: () => {},
  updateUser: (data) => {}
}
```

#### 2. Assessment Store
```javascript
{
  assessments: [],
  currentAssessment: null,
  loading: false,
  fetchAssessments: () => {},
  createAssessment: (data) => {},
  updateAssessment: (id, data) => {}
}
```

#### 3. UI Store
```javascript
{
  theme: 'light',
  language: 'english',
  sidebarOpen: true,
  setTheme: (theme) => {},
  setLanguage: (lang) => {},
  toggleSidebar: () => {}
}
```

---

## 📡 External Services Integration

### 1. Clerk Authentication
- **Purpose**: User authentication and management
- **Integration**: React SDK + Webhooks
- **Data Flow**: User signs in → Clerk verifies → Webhook to server → JWT issued

### 2. Google Gemini Pro
- **Purpose**: AI-powered symptom analysis
- **Integration**: REST API
- **Data Flow**: Symptoms → Gemini API → Analysis → Parsed response

### 3. Stripe Payments
- **Purpose**: Subscription management
- **Integration**: Stripe SDK + Webhooks
- **Data Flow**: Checkout → Payment → Webhook → Update subscription

### 4. Appwrite Cloud
- **Purpose**: File storage (voice recordings)
- **Integration**: Appwrite SDK
- **Data Flow**: File upload → Appwrite bucket → URL returned

### 5. TestMail
- **Purpose**: Email notifications
- **Integration**: SMTP API
- **Data Flow**: Event trigger → Email template → TestMail API → Send

---

## 🚦 Error Handling Strategy

### Error Flow

```
Error Occurs → Catch Block → Log Error → Format Error Response → Send to Client → Display Toast
```

**Error Types**:
1. **Validation Errors** (400): Invalid input
2. **Authentication Errors** (401): Invalid/missing token
3. **Authorization Errors** (403): Insufficient permissions
4. **Not Found Errors** (404): Resource doesn't exist
5. **Server Errors** (500): Internal issues

---

## 📈 Performance Optimization

### Backend
- **Database Indexing**: Indexed queries on User and Assessment
- **Compression**: Gzip compression for responses
- **Rate Limiting**: Prevent abuse
- **Caching**: Future Redis implementation

### Frontend
- **Code Splitting**: Lazy load routes
- **Image Optimization**: WebP format
- **Bundle Size**: Tree shaking unused code
- **Memoization**: React.memo for expensive components

---

## 🔍 Monitoring & Logging

### Backend Logging
```javascript
// Morgan for HTTP logging
// Custom logger for errors
// Winston for production logging
```

### Frontend Monitoring
```javascript
// Console errors in development
// Sentry for production (future)
// Analytics (Google Analytics)
```

---

## 🌐 Deployment Architecture

### Production Setup

```
Users → Cloudflare (CDN) → Vercel (Frontend) → Railway (Backend) → MongoDB Atlas
                                                      ↓
                                              External Services
                                              (Clerk, Stripe, etc.)
```

**Infrastructure**:
- **Frontend**: Vercel (auto-deploy from Git)
- **Backend**: Railway (Docker container)
- **Database**: MongoDB Atlas (cloud)
- **Storage**: Appwrite Cloud
- **CDN**: Cloudflare
- **SSL**: Automatic (Vercel + Railway)

---

## 📊 Scalability Considerations

### Current Architecture
- Handles 1,000+ concurrent users
- ~100 assessments per minute
- 10GB voice storage

### Future Scaling
1. **Horizontal Scaling**: Multiple server instances
2. **Load Balancer**: Distribute traffic
3. **CDN**: Cache static assets globally
4. **Redis**: Cache frequent queries
5. **Microservices**: Separate AI service

---

This architecture document will be updated as the project evolves.
