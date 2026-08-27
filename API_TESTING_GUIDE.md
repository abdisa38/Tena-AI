# 🧪 API Testing Guide

Complete guide to test all TenaAI backend API endpoints using Postman or Insomnia.

---

## 🚀 Setup for Testing

### 1. Start the Server

```bash
cd server
npm install
npm run dev
```

**Expected Output**:
```
✅ MongoDB Connected Successfully
🚀 TenaAI Server running on port 5000
📍 Environment: development
```

### 2. Base URL

All requests: `http://localhost:5000`

---

## 📋 Test Endpoints

### 1. Health Check (No Auth Required)

**Test server is running**

```
GET http://localhost:5000/health
```

**Expected Response**:
```json
{
  "status": "success",
  "message": "TenaAI Server is running",
  "timestamp": "2024-01-15T10:30:00.000Z"
}
```

---

## 🔐 Authentication Endpoints

### 1. Register User

```
POST http://localhost:5000/api/auth/register
Content-Type: application/json

{
  "clerkId": "user_test123",
  "email": "john@example.com",
  "firstName": "John",
  "lastName": "Doe",
  "phoneNumber": "+251911234567"
}
```

**Response**:
```json
{
  "status": "success",
  "message": "User registered successfully",
  "data": {
    "user": {
      "id": "...",
      "email": "john@example.com",
      "firstName": "John",
      "lastName": "Doe",
      "role": "patient",
      "language": "english"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

**Save the token!** You'll need it for protected routes.

---

### 2. Get Current User

```
GET http://localhost:5000/api/auth/me
Authorization: Bearer YOUR_TOKEN_HERE
```

**Response**:
```json
{
  "status": "success",
  "data": {
    "user": {
      "id": "...",
      "email": "john@example.com",
      "firstName": "John",
      "lastName": "Doe",
      "fullName": "John Doe",
      "role": "patient",
      "language": "english",
      "subscription": {
        "plan": "free",
        "status": "inactive"
      }
    }
  }
}
```

---

### 3. Update Profile

```
PUT http://localhost:5000/api/auth/profile
Authorization: Bearer YOUR_TOKEN_HERE
Content-Type: application/json

{
  "firstName": "John Updated",
  "language": "amharic",
  "phoneNumber": "+251912345678",
  "dateOfBirth": "1990-01-15",
  "gender": "male"
}
```

---

## 🏥 Assessment Endpoints

### 1. Create Assessment

```
POST http://localhost:5000/api/assessments
Authorization: Bearer YOUR_TOKEN_HERE
Content-Type: application/json

{
  "symptoms": [
    {
      "symptom": "headache",
      "severity": "moderate",
      "duration": "2 days",
      "notes": "Pain in temples"
    },
    {
      "symptom": "fever",
      "severity": "mild",
      "duration": "1 day",
      "notes": "Low-grade fever"
    }
  ],
  "vitalSigns": {
    "temperature": 38.2,
    "bloodPressure": {
      "systolic": 120,
      "diastolic": 80
    },
    "heartRate": 75
  },
  "language": "english"
}
```

**Response**:
```json
{
  "status": "success",
  "message": "Assessment created successfully",
  "data": {
    "assessment": {
      "id": "...",
      "assessmentId": "TENA-LMN123-ABC45",
      "symptoms": [...],
      "aiAnalysis": {
        "confidence": 87,
        "clinicalSummary": "Based on symptoms...",
        "possibleConditions": [
          {
            "condition": "Viral infection",
            "probability": 75,
            "description": "Common cold or flu"
          }
        ],
        "recommendations": [
          "Rest and stay hydrated",
          "Monitor temperature"
        ],
        "urgencyLevel": "routine"
      },
      "status": "analyzed",
      "isEmergency": false,
      "createdAt": "2024-01-15T10:30:00.000Z"
    }
  }
}
```

---

### 2. Get My Assessments

```
GET http://localhost:5000/api/assessments?page=1&limit=10
Authorization: Bearer YOUR_TOKEN_HERE
```

**With Filters**:
```
GET http://localhost:5000/api/assessments?status=analyzed&isEmergency=false
Authorization: Bearer YOUR_TOKEN_HERE
```

---

### 3. Get Single Assessment

```
GET http://localhost:5000/api/assessments/{assessment_id}
Authorization: Bearer YOUR_TOKEN_HERE
```

---

### 4. Get Assessment Statistics

```
GET http://localhost:5000/api/assessments/stats/overview
Authorization: Bearer YOUR_TOKEN_HERE
```

**Response**:
```json
{
  "status": "success",
  "data": {
    "stats": {
      "totalAssessments": 12,
      "thisMonthAssessments": 5,
      "emergencyCount": 1,
      "avgConfidence": 85,
      "recentAssessments": [...]
    }
  }
}
```

---

### 5. Update Assessment (Doctor)

```
PUT http://localhost:5000/api/assessments/{assessment_id}
Authorization: Bearer DOCTOR_TOKEN_HERE
Content-Type: application/json

{
  "doctorNotes": "Patient should rest for 3 days. Prescribe paracetamol for fever.",
  "requiresFollowUp": true,
  "followUpDate": "2024-01-20"
}
```

---

### 6. Delete Assessment

```
DELETE http://localhost:5000/api/assessments/{assessment_id}
Authorization: Bearer YOUR_TOKEN_HERE
```

---

## 🎤 Voice Endpoints

### 1. Upload Voice Recording

```
POST http://localhost:5000/api/voice/upload
Authorization: Bearer YOUR_TOKEN_HERE
Content-Type: multipart/form-data

Form Data:
- voice: [audio file]
- language: english
```

**Response**:
```json
{
  "status": "success",
  "message": "Voice recording uploaded successfully",
  "data": {
    "file": {
      "filename": "voice-1234567890-abc.mp3",
      "url": "/uploads/voice/voice-1234567890-abc.mp3",
      "size": 245678,
      "language": "english"
    }
  }
}
```

---

### 2. Transcribe Voice

```
POST http://localhost:5000/api/voice/transcribe
Authorization: Bearer YOUR_TOKEN_HERE
Content-Type: application/json

{
  "audioUrl": "/uploads/voice/voice-1234567890-abc.mp3",
  "language": "english"
}
```

---

### 3. Analyze Voice

```
POST http://localhost:5000/api/voice/analyze
Authorization: Bearer YOUR_TOKEN_HERE
Content-Type: application/json

{
  "transcript": "I have a headache and fever for two days",
  "language": "english"
}
```

**Response**:
```json
{
  "status": "success",
  "message": "Voice analyzed successfully",
  "data": {
    "symptoms": [
      {
        "symptom": "headache",
        "severity": "moderate",
        "duration": "recent",
        "notes": "Detected from voice: headache"
      },
      {
        "symptom": "fever",
        "severity": "moderate",
        "duration": "recent",
        "notes": "Detected from voice: fever"
      }
    ],
    "language": "english"
  }
}
```

---

## 💳 Payment Endpoints

### 1. Create Checkout Session

```
POST http://localhost:5000/api/payments/create-checkout-session
Authorization: Bearer YOUR_TOKEN_HERE
Content-Type: application/json

{
  "plan": "basic"
}
```

**Response**:
```json
{
  "status": "success",
  "data": {
    "sessionId": "cs_test_abc123...",
    "url": "https://checkout.stripe.com/c/pay/cs_test_abc123..."
  }
}
```

**Note**: Open the URL in a browser to complete payment.

---

### 2. Get Payment History

```
GET http://localhost:5000/api/payments/history
Authorization: Bearer YOUR_TOKEN_HERE
```

---

### 3. Cancel Subscription

```
POST http://localhost:5000/api/payments/cancel-subscription
Authorization: Bearer YOUR_TOKEN_HERE
```

---

## 👥 Patient Endpoints (Doctor Only)

### 1. Get All Patients

```
GET http://localhost:5000/api/patients?page=1&limit=20
Authorization: Bearer DOCTOR_TOKEN_HERE
```

**With Search**:
```
GET http://localhost:5000/api/patients?search=john
Authorization: Bearer DOCTOR_TOKEN_HERE
```

---

### 2. Get Patient Details

```
GET http://localhost:5000/api/patients/{patient_id}
Authorization: Bearer DOCTOR_TOKEN_HERE
```

---

### 3. Get Patient Assessments

```
GET http://localhost:5000/api/patients/{patient_id}/assessments
Authorization: Bearer DOCTOR_TOKEN_HERE
```

**With Filters**:
```
GET http://localhost:5000/api/patients/{patient_id}/assessments?status=analyzed&isEmergency=true
Authorization: Bearer DOCTOR_TOKEN_HERE
```

---

## 🧪 Testing Scenarios

### Scenario 1: Complete Patient Flow

1. **Register** user
2. **Login** (get token from register response)
3. **Create assessment** with symptoms
4. **View assessment** details
5. **Get statistics** overview

---

### Scenario 2: Subscription Upgrade

1. **Register** user (free plan by default)
2. Try to **create 6th assessment** (should fail with limit message)
3. **Create checkout session** for basic plan
4. Complete payment (use Stripe test card: `4242 4242 4242 4242`)
5. Webhook updates subscription
6. **Create assessment** (should succeed)

---

### Scenario 3: Doctor Reviews Patient

1. **Register** doctor user (manually set role to 'doctor' in database)
2. Doctor **gets all patients**
3. Doctor **views patient details**
4. Doctor **reviews assessment**
5. Doctor **adds notes** to assessment

---

## 🎨 Postman Collection

### Save These as Collection

Create a Postman collection with:
- **Environment Variable**: `BASE_URL` = `http://localhost:5000`
- **Environment Variable**: `TOKEN` = (save after login)

Then use:
- `{{BASE_URL}}/api/auth/register`
- `Authorization: Bearer {{TOKEN}}`

---

## 🐛 Common Testing Errors

### 1. "Not authorized to access this route"
**Solution**: Add `Authorization: Bearer YOUR_TOKEN` header

### 2. "Validation failed"
**Solution**: Check request body matches required fields

### 3. "User not found"
**Solution**: Register user first

### 4. "MongoDB connection error"
**Solution**: Check `.env` MongoDB URI and internet connection

### 5. "Free plan limit reached"
**Solution**: Either upgrade plan or test with new user

---

## 🔍 Testing Tips

1. **Start with health check** - Ensure server is running
2. **Register first** - Get a valid token
3. **Save tokens** - Use environment variables
4. **Test in order** - Follow logical flow
5. **Check responses** - Verify data structure
6. **Test edge cases** - Invalid data, missing fields
7. **Test permissions** - Try accessing others' data

---

## ✅ Testing Checklist

- [ ] Health endpoint works
- [ ] User registration successful
- [ ] Get user profile works
- [ ] Create assessment with AI analysis
- [ ] Get assessments list with pagination
- [ ] Update assessment with doctor notes
- [ ] Voice upload works
- [ ] Payment checkout session created
- [ ] Doctor can view patients
- [ ] Statistics endpoint works

---

**Happy Testing! 🧪**

If you find any issues, check:
1. Server is running
2. MongoDB is connected
3. Environment variables are set
4. Token is valid and included in headers
