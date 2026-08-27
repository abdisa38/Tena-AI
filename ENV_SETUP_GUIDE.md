# 🔐 Environment Setup Guide

This guide will help you get all the necessary API keys and configure your environment variables.

---

## ✅ Already Configured

You already have these API keys in your `.env` files:

1. ✅ **MongoDB URI** - Database
2. ✅ **Stripe Secret Key** - Payments
3. ✅ **Appwrite API Key** - File storage
4. ✅ **Clerk Publishable Key** - Authentication
5. ✅ **TestMail API Key** - Email testing
6. ✅ **IconScout API Key** - Design assets

---

## ⚠️ Still Need to Get

### 1. Google Gemini Pro API Key (IMPORTANT - Required for AI)

**How to get it**:

1. Go to [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Sign in with your Google account
3. Click "Create API Key"
4. Copy the key
5. Add to `server/.env`:
   ```
   GOOGLE_GEMINI_API_KEY=your_key_here
   ```

**Free Tier**: 60 requests per minute (plenty for development!)

---

### 2. Stripe Publishable Key (Frontend)

You have the **secret key**, but you also need the **publishable key** for the frontend.

**How to get it**:

1. Go to [Stripe Dashboard](https://dashboard.stripe.com/test/apikeys)
2. Find "Publishable key" (starts with `pk_test_`)
3. Copy it
4. Add to `client/.env`:
   ```
   VITE_STRIPE_PUBLISHABLE_KEY=pk_test_your_key_here
   ```

---

### 3. Appwrite Project ID

You have the API key, but you also need your **Project ID**.

**How to get it**:

1. Go to [Appwrite Console](https://cloud.appwrite.io/console)
2. Select your project
3. Go to Settings
4. Copy "Project ID"
5. Add to `server/.env`:
   ```
   APPWRITE_PROJECT_ID=your_project_id_here
   ```

**If you don't have a project yet**:
1. Create new project in Appwrite
2. Name it "TenaAI"
3. Create a storage bucket called "voice-recordings"
4. Copy the Project ID

---

## 📝 Complete `.env` Checklist

### Server `.env` (Backend)

```bash
# Server Configuration
NODE_ENV=development
PORT=5000

# MongoDB
✅ MONGODB_URI=mongodb+srv://abdisaawel313_db_user:8y9yN1nI6lUFhbV9@cluster0.4rpvq0i.mongodb.net/tenaai?retryWrites=true&w=majority&appName=Cluster0

# JWT
✅ JWT_SECRET=tenaai_super_secure_jwt_secret_key_2024_change_in_production
✅ JWT_EXPIRE=7d

# Appwrite
✅ APPWRITE_ENDPOINT=https://cloud.appwrite.io/v1
⚠️ APPWRITE_PROJECT_ID=your_project_id_here  # NEED THIS
✅ APPWRITE_API_KEY=standard_9517dc04a0b2ca8d15f52c3ff1448b459d5aa0212210f3d0b4cb6923b71d8721504443cf26eb80ee2ae70590f04edfea0b9e2201237aee077de4b1d15838a0615d1f18b96b859f17d48ee51a568b0e997b9b46f03dbc8bba11d671203fb6b4f725282986048f8e26a83aecac2b8422391160e0fa7337c5a8a01b7dd571f1ffe2

# Clerk
✅ CLERK_PUBLISHABLE_KEY=pk_test_aW50ZWdyYWwtY2xhbS0yODI1LmNsZXJrLmFjY291bnRzLmRldiQ

# Stripe
✅ STRIPE_SECRET_KEY=sk_test_51TvjhJECTcz7ac8eiR52z4ujXjQZJsFKPqz5XvMG4cLGLryahqkjnufNvdVXUUOn6qO5umuzSR4A7yPin7nhpXda005A3abHvy
⚠️ STRIPE_WEBHOOK_SECRET=your_webhook_secret_here  # Will get this later

# Google Gemini Pro (IMPORTANT!)
⚠️ GOOGLE_GEMINI_API_KEY=your_gemini_api_key_here  # NEED THIS NOW

# TestMail
✅ TESTMAIL_API_KEY=testmail_api_key
⚠️ TESTMAIL_NAMESPACE=your_namespace  # Will configure later

# IconScout
✅ ICONSCOUT_API_KEY=aIF2MGYXYERE4mIgZs0twAuK42uMdEOS

# Email (Optional for now)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@gmail.com
SMTP_PASS=your_app_password

# Frontend URL
✅ CLIENT_URL=http://localhost:5173
```

---

### Client `.env` (Frontend)

```bash
# Clerk Authentication
✅ VITE_CLERK_PUBLISHABLE_KEY=pk_test_aW50ZWdyYWwtY2xhbS0yODI1LmNsZXJrLmFjY291bnRzLmRldiQ

# API Base URL
✅ VITE_API_URL=http://localhost:5000/api

# Stripe Public Key
⚠️ VITE_STRIPE_PUBLISHABLE_KEY=pk_test_your_key_here  # NEED THIS

# App Configuration
✅ VITE_APP_NAME=TenaAI
✅ VITE_APP_VERSION=1.0.0
```

---

## 🚨 Priority Setup

To continue development, you **MUST** get these NOW:

### Priority 1: Google Gemini API Key
**Why**: Required for AI symptom analysis (core feature)
**Get it**: https://makersuite.google.com/app/apikey
**Takes**: 2 minutes

### Priority 2: Appwrite Project ID
**Why**: Required for voice file uploads
**Get it**: https://cloud.appwrite.io/console
**Takes**: 5 minutes (if creating new project)

### Priority 3: Stripe Publishable Key
**Why**: Required for frontend payment integration
**Get it**: https://dashboard.stripe.com/test/apikeys
**Takes**: 1 minute

---

## 🔒 Security Best Practices

### ✅ DO:
- Keep `.env` files in `.gitignore` (already done)
- Use different keys for development and production
- Rotate keys if they're exposed
- Use environment-specific configurations

### ❌ DON'T:
- Commit `.env` files to Git
- Share keys in public channels
- Use production keys in development
- Hard-code keys in source files

---

## 🧪 Testing Your Setup

### Test MongoDB Connection

```bash
cd server
npm run dev
```

**Expected output**:
```
✅ MongoDB Connected Successfully
🚀 TenaAI Server running on port 5000
```

### Test API Endpoint

Open browser: `http://localhost:5000/health`

**Expected response**:
```json
{
  "status": "success",
  "message": "TenaAI Server is running"
}
```

---

## 🛠️ Appwrite Setup (Detailed)

### Step 1: Create Project
1. Go to https://cloud.appwrite.io/console
2. Click "Create Project"
3. Name: "TenaAI"
4. Click "Create"

### Step 2: Get Project ID
1. Click on your project
2. Go to "Settings"
3. Copy "Project ID"
4. Paste in `server/.env` as `APPWRITE_PROJECT_ID`

### Step 3: Create Storage Bucket
1. Go to "Storage" in sidebar
2. Click "Create Bucket"
3. Name: "voice-recordings"
4. Max File Size: 10 MB
5. Allowed File Extensions: `mp3, wav, ogg, webm`
6. Permissions: 
   - Read: Users
   - Write: Users
7. Click "Create"

### Step 4: Enable File Security
1. Click on your bucket
2. Go to "Settings"
3. Enable "File Security"
4. Save

---

## 📧 TestMail Setup

### Get Your Namespace

1. Go to [TestMail.app](https://testmail.app/)
2. Sign up/Login
3. Create a new namespace (e.g., "tenaai-test")
4. Add to `server/.env`:
   ```
   TESTMAIL_NAMESPACE=tenaai-test
   ```

**Usage**: All emails will be sent to:
- `anything@tenaai-test.testmail.app`

You can view them in the TestMail dashboard.

---

## 🎯 Quick Setup Commands

```bash
# 1. Install dependencies
npm install
cd server && npm install
cd ../client && npm install

# 2. Configure environment variables
# Edit server/.env with the keys above

# 3. Test server
cd server
npm run dev

# 4. Test health endpoint
# Open http://localhost:5000/health in browser
```

---

## ❓ Troubleshooting

### MongoDB Connection Failed
**Error**: `MongoServerError: Authentication failed`

**Solution**:
1. Check MongoDB Atlas dashboard
2. Verify your IP is whitelisted (add 0.0.0.0/0 for development)
3. Verify username/password in connection string
4. Check if database user has read/write permissions

### Port 5000 Already in Use
**Error**: `Port 5000 is already in use`

**Solution**:
```bash
# Windows
netstat -ano | findstr :5000
taskkill /PID <PID_NUMBER> /F

# Or change port in server/.env
PORT=5001
```

### Gemini API Not Working
**Error**: `API key not valid`

**Solution**:
1. Verify key is correct in `.env`
2. Check you're using the right Google account
3. Enable the Generative Language API in Google Cloud Console
4. Wait a few minutes for key activation

---

## ✅ Verification Checklist

Before moving to Phase 2, verify:

- [ ] MongoDB connection successful
- [ ] Server starts without errors
- [ ] Health endpoint returns success
- [ ] Google Gemini API key added
- [ ] Appwrite Project ID added
- [ ] Stripe publishable key added
- [ ] All environment files have no syntax errors

---

## 🎉 Ready!

Once you have these 3 keys configured:
1. ✅ Google Gemini API Key
2. ✅ Appwrite Project ID  
3. ✅ Stripe Publishable Key

You're ready for **Phase 2: Backend Controllers**!

---

**Need help getting any of these keys? Let me know which one and I'll provide more detailed instructions!**
