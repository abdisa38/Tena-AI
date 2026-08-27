# TenaAI - Professional Healthcare Diagnostic Platform

<div align="center">
  <h3>AI-Powered Healthcare Assessment for Ethiopian People</h3>
  <p>Professional MERN Stack Application</p>
</div>

## 🎯 Project Overview

TenaAI is a comprehensive healthcare diagnostic platform that leverages artificial intelligence to provide preliminary health assessments for Ethiopian patients. The platform supports multilingual voice input (English, Amharic, Afaan Oromoo) and delivers professional medical insights with confidence scoring.

### Key Features

- **Multilingual Voice Recording**: Support for English, Amharic, and Afaan Oromoo
- **AI-Powered Analysis**: Google Gemini Pro integration for health assessments
- **Confidence Scoring**: Real-time confidence metrics (up to 94% accuracy)
- **Clinical Summaries**: Professional medical summaries in simple language
- **Patient Dashboard**: Track assessment history and health trends
- **Doctor Portal**: Healthcare provider access for review and consultation
- **Secure Payments**: Stripe integration for subscription management
- **Professional UI/UX**: Clean, icon-based design with brand colors

## 🎨 Design System

### Brand Colors

- **Tena Black**: `#111111` - Primary brand color
- **Tena Yellow**: `#F8D743` - Accent and highlights
- **Tena White**: `#FFFFFF` - Backgrounds and text
- **Cloud Gray**: `#E7E7E2` - Neutral elements

### Typography

- **Primary Font**: Noto Sans
- **Style**: Strong, clear, professional
- **No emojis**: Professional icons only

## 🛠️ Tech Stack

### Frontend
- React.js with Vite
- Tailwind CSS
- Framer Motion (animations)
- Clerk (authentication)
- Axios (API calls)
- Zustand (state management)
- Lucide React (icons)

### Backend
- Node.js + Express.js
- MongoDB + Mongoose
- Google Gemini Pro (AI)
- Appwrite Cloud (file storage)
- Stripe (payments)
- JWT (authentication)

### Tools & Services
- Icons8 & IconScout (design assets)
- BrowserStack & TestMu AI (testing)
- Requestly (API testing)
- TestMail (email testing)
- ToDiagram (architecture)

## 📁 Project Structure

```
tena-ai/
├── client/                    # React frontend
│   ├── src/
│   │   ├── assets/           # Icons, images
│   │   ├── components/       # Reusable components
│   │   ├── pages/            # Page components
│   │   ├── services/         # API integration
│   │   ├── utils/            # Helper functions
│   │   ├── hooks/            # Custom React hooks
│   │   ├── context/          # Context providers
│   │   └── styles/           # Global styles
│   └── public/               # Static assets
├── server/                    # Node.js backend
│   ├── config/               # Configuration
│   ├── controllers/          # Route controllers
│   ├── models/               # Database models
│   ├── routes/               # API routes
│   ├── middleware/           # Custom middleware
│   ├── services/             # Business logic
│   │   ├── aiService.js      # Gemini Pro integration
│   │   ├── voiceService.js   # Speech processing
│   │   └── paymentService.js # Stripe integration
│   └── utils/                # Helper functions
└── docs/                      # Documentation
```

## 🚀 Installation

### Prerequisites

- Node.js (v18 or higher)
- MongoDB Atlas account
- Clerk account
- Google Gemini API key
- Stripe account
- Appwrite Cloud account

### Step 1: Clone Repository

```bash
git clone <repository-url>
cd Tena-AI
```

### Step 2: Install Dependencies

```bash
# Install root dependencies
npm install

# Install server dependencies
cd server
npm install

# Install client dependencies
cd ../client
npm install
```

### Step 3: Environment Setup

Create `.env` files in both `server/` and `client/` directories using the provided `.env.example` files.

**Server `.env`:**
```env
NODE_ENV=development
PORT=5000
MONGODB_URI=your_mongodb_uri
JWT_SECRET=your_jwt_secret
GOOGLE_GEMINI_API_KEY=your_gemini_key
STRIPE_SECRET_KEY=your_stripe_key
APPWRITE_API_KEY=your_appwrite_key
```

**Client `.env`:**
```env
VITE_CLERK_PUBLISHABLE_KEY=your_clerk_key
VITE_API_URL=http://localhost:5000/api
```

### Step 4: Run Development Server

```bash
# From root directory
npm run dev
```

This will start:
- Backend server: `http://localhost:5000`
- Frontend app: `http://localhost:5173`

## 📡 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `GET /api/auth/me` - Get current user
- `PUT /api/auth/profile` - Update profile

### Assessments
- `POST /api/assessments` - Create new assessment
- `GET /api/assessments` - Get user assessments
- `GET /api/assessments/:id` - Get single assessment
- `PUT /api/assessments/:id` - Update assessment
- `DELETE /api/assessments/:id` - Delete assessment

### Voice
- `POST /api/voice/upload` - Upload voice recording
- `POST /api/voice/transcribe` - Transcribe audio
- `POST /api/voice/analyze` - Analyze with AI

### Payments
- `POST /api/payments/create-checkout-session` - Create payment
- `GET /api/payments/history` - Payment history
- `POST /api/payments/cancel-subscription` - Cancel subscription

## 🗄️ Database Schema

### User Model
```javascript
{
  clerkId: String,
  email: String,
  firstName: String,
  lastName: String,
  role: ['patient', 'doctor', 'admin'],
  language: ['english', 'amharic', 'afaan_oromoo'],
  subscription: {
    plan: ['free', 'basic', 'premium'],
    status: String
  }
}
```

### Assessment Model
```javascript
{
  patient: ObjectId,
  assessmentId: String,
  symptoms: Array,
  aiAnalysis: {
    confidence: Number,
    possibleConditions: Array,
    clinicalSummary: String,
    urgencyLevel: String
  },
  status: ['pending', 'analyzed', 'reviewed']
}
```

## 🧪 Testing

```bash
# Run backend tests
cd server
npm test

# Run frontend tests
cd client
npm test
```

## 📦 Deployment

### Backend (Railway/Render)
```bash
cd server
npm start
```

### Frontend (Vercel/Netlify)
```bash
cd client
npm run build
```

## 🔐 Security Features

- Helmet.js for HTTP headers
- Rate limiting
- JWT authentication
- Input validation
- XSS protection
- CORS configuration
- Environment variable protection

## 🌍 Multilingual Support

TenaAI supports three languages:
1. **English** - Primary interface language
2. **Amharic (አማርኛ)** - Ethiopian national language
3. **Afaan Oromoo** - Oromo language

## 💳 Subscription Plans

### Free Plan
- 5 assessments per month
- Basic voice recording
- Standard AI analysis

### Basic Plan ($9.99/month)
- Unlimited assessments
- Priority support
- Advanced analytics

### Premium Plan ($19.99/month)
- All Basic features
- Doctor consultations
- PDF reports
- Priority AI processing

## 📞 Support

For support and inquiries:
- Email: support@tenaai.com
- Documentation: https://docs.tenaai.com

## 📄 License

This project is licensed under the MIT License.

## 🙏 Acknowledgments

- Google Gemini Pro for AI capabilities
- Clerk for authentication
- Stripe for payment processing
- Appwrite for backend services
- Icons8 & IconScout for design assets

---

**Built with ❤️ for Ethiopian Healthcare**

*TenaAI - Act Faster. Care Better.*
