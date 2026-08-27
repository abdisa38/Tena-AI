# 🚀 TenaAI Quick Start Guide

## ⚡ Get Running in 5 Minutes

### 1. Install Dependencies

```bash
# Install server dependencies
cd server
npm install

# Install client dependencies
cd ../client
npm install
```

### 2. Environment Variables

All API keys are already configured! ✓

**Server**: `server/.env` ✓
**Client**: `client/.env` ✓

### 3. Start Development

**Option A: Run both together (recommended)**
```bash
# From root directory
npm run dev
```

**Option B: Run separately**
```bash
# Terminal 1 - Backend
cd server
npm run dev
# Runs on http://localhost:5000

# Terminal 2 - Frontend
cd client
npm run dev
# Runs on http://localhost:5173
```

### 4. Open Browser

Navigate to: **http://localhost:5173**

---

## 🎯 Current Features Working

### ✅ Pages You Can Visit
- `/` - Landing page
- `/dashboard` - User dashboard
- `/dashboard/profile` - Profile settings
- `/dashboard/subscription` - Subscription plans
- `/dashboard/assessments` - Assessment history
- `/dashboard/assessments/new` - Create new assessment (with voice!)
- `/dashboard/assessments/:id` - View assessment details

### ✅ What You Can Test
1. **Voice Recording**
   - Go to "New Assessment"
   - Select language
   - Click "Voice Recording"
   - Allow microphone access
   - See real-time waveform!
   - Record your symptoms
   
2. **Manual Entry**
   - Go to "New Assessment"
   - Select language
   - Click "Manual Entry"
   - Add symptoms manually
   - Set severity and duration
   
3. **Dashboard**
   - View statistics
   - See recent assessments
   - Quick actions
   
4. **Profile**
   - Update personal info
   - Change language preference
   - View account stats

---

## 🔑 Test Accounts

### Regular User
- Sign up with any email
- All features available

### Stripe Test Cards (for Phase 8)
```
Card: 4242 4242 4242 4242
Expiry: Any future date
CVC: Any 3 digits
ZIP: Any 5 digits
```

---

## 📊 Project Status

**Progress**: 50% Complete (6/12 phases)

```
✅ Backend Foundation
✅ Backend Controllers  
✅ Backend Services
✅ Frontend Foundation
✅ Main Pages
✅ Voice Recording ← JUST COMPLETED!
⏳ AI Integration ← NEXT
⬜ Payment Integration
⬜ Testing & QA
⬜ Deployment
⬜ Documentation
⬜ Portfolio
```

---

## 🎯 Next Phase

**Phase 7: AI Integration (3-4 hours)**

What we'll build:
- Connect Google Gemini Pro AI
- Display confidence scores
- Show possible conditions
- Present recommendations
- Emergency detection

---

## 📝 Key Files

### Most Important
- `server/server.js` - Backend entry
- `client/src/App.jsx` - Frontend routes
- `client/src/pages/NewAssessment.jsx` - Voice recording page
- `client/src/components/VoiceRecorder.jsx` - Voice recorder component

### Documentation
- `CURRENT_STATUS.md` - Detailed status
- `PROJECT_ROADMAP.md` - Complete roadmap
- `PHASE_6_COMPLETE.md` - Phase 6 summary

---

## 🐛 Troubleshooting

### MongoDB Connection Error
- Check `server/.env` has correct MONGODB_URI
- Ensure MongoDB Atlas IP whitelist includes your IP

### Port Already in Use
```bash
# Kill process on port 5000
npx kill-port 5000

# Kill process on port 5173
npx kill-port 5173
```

### Microphone Not Working
- Ensure browser has microphone permissions
- Check if HTTPS is required (localhost works)
- Try different browser (Chrome recommended)

### CORS Errors
- Verify CLIENT_URL in `server/.env` matches your frontend URL
- Check VITE_API_URL in `client/.env` points to backend

---

## 💡 Design Requirements

**ALWAYS FOLLOW**:
- ✅ Professional UI (senior-level)
- ✅ Icons ONLY, NO emojis
- ✅ Simple English words
- ✅ Short paragraphs
- ✅ Brand colors: Black (#111111), Yellow (#F8D743), White, Gray (#E7E7E2)

---

## 🎉 Ready to Continue?

Say **"Start Phase 7"** to build AI integration!

---

**Quick Links**:
- [Full Status](./CURRENT_STATUS.md)
- [Complete Roadmap](./PROJECT_ROADMAP.md)
- [Phase 6 Details](./PHASE_6_COMPLETE.md)
