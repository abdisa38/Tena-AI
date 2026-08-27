const { GoogleGenerativeAI } = require('@google/generative-ai');

// Initialize Google Gemini AI
const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GEMINI_API_KEY);

class AIService {
  constructor() {
    this.model = genAI.getGenerativeModel({ model: 'gemini-pro' });
  }

  // Analyze symptoms and generate health assessment
  async analyzeSymptoms(symptomsData) {
    try {
      const { symptoms, vitalSigns, language, patientContext } = symptomsData;

      // Build prompt for AI
      const prompt = this.buildAssessmentPrompt(symptoms, vitalSigns, patientContext, language);

      // Generate content with Gemini
      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();

      // Parse AI response
      const analysis = this.parseAIResponse(text);

      return {
        success: true,
        data: analysis
      };

    } catch (error) {
      console.error('AI Analysis Error:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  // Build comprehensive prompt for assessment
  buildAssessmentPrompt(symptoms, vitalSigns, patientContext, language) {
    const symptomsList = symptoms.map(s => 
      `- ${s.symptom} (Severity: ${s.severity}, Duration: ${s.duration})`
    ).join('\n');

    const vitals = vitalSigns ? `
Vital Signs:
- Temperature: ${vitalSigns.temperature || 'N/A'}°C
- Blood Pressure: ${vitalSigns.bloodPressure?.systolic || 'N/A'}/${vitalSigns.bloodPressure?.diastolic || 'N/A'} mmHg
- Heart Rate: ${vitalSigns.heartRate || 'N/A'} bpm
- Respiratory Rate: ${vitalSigns.respiratoryRate || 'N/A'} breaths/min
    ` : '';

    const context = patientContext ? `
Patient Context:
- Age: ${patientContext.age || 'Not provided'}
- Gender: ${patientContext.gender || 'Not provided'}
- Medical History: ${patientContext.medicalHistory || 'None reported'}
    ` : '';

    return `You are TenaAI, an advanced medical AI assistant designed for Ethiopian healthcare.

IMPORTANT DISCLAIMERS:
- This is an AI-assisted preliminary assessment, NOT a medical diagnosis
- This assessment does NOT replace professional medical consultation
- For emergencies, patients must seek immediate medical attention

Patient Symptoms:
${symptomsList}

${vitals}
${context}

Please provide a comprehensive health assessment in the following JSON format:

{
  "confidence": <number between 0-100>,
  "possibleConditions": [
    {
      "condition": "condition name",
      "probability": <percentage>,
      "description": "brief explanation"
    }
  ],
  "recommendations": ["recommendation 1", "recommendation 2"],
  "urgencyLevel": "routine|urgent|emergency",
  "clinicalSummary": "A clear, professional summary in simple English suitable for Ethiopian patients",
  "warningFlags": ["any serious concerns"],
  "nextSteps": ["suggested actions"]
}

Language preference: ${language}
Focus on: Clear communication, cultural sensitivity, and actionable guidance.`;
  }

  // Parse AI response into structured format
  parseAIResponse(text) {
    try {
      // Try to extract JSON from response
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const parsed = JSON.parse(jsonMatch[0]);
        return {
          confidence: parsed.confidence || 75,
          possibleConditions: parsed.possibleConditions || [],
          recommendations: parsed.recommendations || [],
          urgencyLevel: parsed.urgencyLevel || 'routine',
          clinicalSummary: parsed.clinicalSummary || text,
          warningFlags: parsed.warningFlags || [],
          nextSteps: parsed.nextSteps || []
        };
      }

      // Fallback: use raw text
      return {
        confidence: 70,
        possibleConditions: [],
        recommendations: [],
        urgencyLevel: 'routine',
        clinicalSummary: text,
        warningFlags: [],
        nextSteps: ['Consult with a healthcare professional for proper diagnosis']
      };

    } catch (error) {
      console.error('Error parsing AI response:', error);
      return {
        confidence: 60,
        possibleConditions: [],
        recommendations: [],
        urgencyLevel: 'routine',
        clinicalSummary: 'Unable to generate detailed analysis. Please consult a healthcare provider.',
        warningFlags: [],
        nextSteps: ['Seek medical consultation']
      };
    }
  }

  // Translate content to different languages
  async translateContent(content, targetLanguage) {
    try {
      if (targetLanguage === 'english') {
        return content; // Already in English
      }

      const languageMap = {
        'amharic': 'Amharic (አማርኛ)',
        'afaan_oromoo': 'Afaan Oromoo'
      };

      const prompt = `Translate the following medical content to ${languageMap[targetLanguage]}. 
      Keep medical terms clear and use simple language suitable for patients:

      ${content}

      Provide only the translation, no explanations.`;

      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      return response.text();

    } catch (error) {
      console.error('Translation Error:', error);
      return content; // Return original if translation fails
    }
  }

  // Check for emergency indicators
  identifyEmergencySignals(symptoms, vitalSigns) {
    const emergencyKeywords = [
      'chest pain', 'difficulty breathing', 'severe bleeding', 
      'unconscious', 'seizure', 'severe headache', 'stroke',
      'heart attack', 'severe allergic reaction', 'poisoning'
    ];

    // Check symptoms for emergency keywords
    const hasEmergencySymptom = symptoms.some(s => 
      emergencyKeywords.some(keyword => 
        s.symptom.toLowerCase().includes(keyword)
      )
    );

    // Check vital signs for critical values
    let hasCriticalVitals = false;
    if (vitalSigns) {
      hasCriticalVitals = 
        (vitalSigns.temperature && (vitalSigns.temperature > 40 || vitalSigns.temperature < 35)) ||
        (vitalSigns.heartRate && (vitalSigns.heartRate > 130 || vitalSigns.heartRate < 50)) ||
        (vitalSigns.bloodPressure?.systolic && vitalSigns.bloodPressure.systolic > 180);
    }

    return hasEmergencySymptom || hasCriticalVitals;
  }
}

module.exports = new AIService();
