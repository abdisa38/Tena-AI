import { getGeminiModel } from '../config/gemini.js';
import { TriageRecord } from '../models/TriageRecord.js';

// Rule-based fallback evaluator when API key is missing or offline
const runFallbackTriage = ({ symptoms, severityRating, patientAge, duration }) => {
  const lowerSymptoms = symptoms.map(s => s.toLowerCase()).join(' ');

  const emergencyKeywords = ['chest pain', 'cannot breathe', 'shortness of breath', 'unconscious', 'stroke', 'paralysis', 'heavy bleeding', 'severe head trauma', 'coughing blood'];
  const isEmergency = emergencyKeywords.some(kw => lowerSymptoms.includes(kw)) || severityRating >= 9;

  if (isEmergency) {
    return {
      severityLevel: 'Emergency',
      clinicalSummary: 'Your reported symptoms indicate an urgent medical situation that requires immediate in-person emergency care.',
      possibleConditions: ['Acute Cardiorespiratory Event', 'Severe Trauma / Hemorrhage', 'Acute Medical Emergency'],
      recommendedActions: [
        'Call the emergency medical hotline (907 / 911 / 939) immediately.',
        'Do not attempt to drive yourself. Have someone assist you or wait for an ambulance.',
        'Stay calm, sit in an upright comfortable position, and loosen any tight clothing.'
      ],
      suggestedSpecialties: ['Emergency Medicine', 'Cardiology', 'Pulmonology'],
      redFlags: ['Sudden onset severe chest tightness', 'Difficulty speaking or breathing', 'Loss of consciousness']
    };
  }

  if (severityRating >= 6 || lowerSymptoms.includes('high fever') || lowerSymptoms.includes('persistent vomiting') || lowerSymptoms.includes('severe abdominal pain')) {
    return {
      severityLevel: 'Urgent',
      clinicalSummary: 'Your symptoms are moderate to high severity and should be evaluated by a healthcare professional within 12 to 24 hours.',
      possibleConditions: ['Acute Infection', 'Gastrointestinal Distress', 'Inflammatory Response'],
      recommendedActions: [
        'Schedule a consultation with a certified doctor today.',
        'Keep well hydrated with clean drinking water or oral rehydration solutions.',
        'Monitor your body temperature and resting pulse rate.'
      ],
      suggestedSpecialties: ['General Medicine', 'Internal Medicine'],
      redFlags: ['Fever exceeding 39°C (102.2°F)', 'Inability to keep liquids down for 12 hours']
    };
  }

  if (severityRating >= 4 || lowerSymptoms.includes('cough') || lowerSymptoms.includes('headache') || lowerSymptoms.includes('sore throat')) {
    return {
      severityLevel: 'Moderate',
      clinicalSummary: 'Your symptoms appear mild to moderate. A routine medical consultation will help clarify the cause and get proper treatment.',
      possibleConditions: ['Upper Respiratory Infection', 'Viral Syndrome', 'Tension Headache / Fatigue'],
      recommendedActions: [
        'Book a routine teleconsultation or visit your local clinic.',
        'Get at least 8 hours of restful sleep and drink warm fluids.',
        'Avoid strenuous physical exertion until your symptoms improve.'
      ],
      suggestedSpecialties: ['General Medicine'],
      redFlags: ['Symptoms lasting longer than 7 days without improvement']
    };
  }

  return {
    severityLevel: 'Low',
    clinicalSummary: 'Your symptoms appear mild and manageable with basic self-care and rest.',
    possibleConditions: ['Mild Fatigue / Dehydration', 'Minor Strain', 'Early Mild Cold'],
    recommendedActions: [
      'Get sufficient rest and stay well hydrated.',
      'Eat balanced meals rich in fruits and vegetables.',
      'If symptoms worsen or persist past 3 days, consult a physician.'
    ],
    suggestedSpecialties: ['General Medicine'],
    redFlags: ['Sudden spike in fever', 'Difficulty breathing']
  };
};

export const assessSymptoms = async (req, res) => {
  try {
    const {
      patientAge = 25,
      patientGender = 'unspecified',
      symptoms = [],
      symptomDuration = '1-3 days',
      severityRating = 5,
      existingConditions = [],
      userId = null
    } = req.body;

    if (!symptoms || (Array.isArray(symptoms) && symptoms.length === 0)) {
      return res.status(400).json({ success: false, message: 'Please provide at least one symptom for evaluation.' });
    }

    const symptomsList = Array.isArray(symptoms) ? symptoms : [symptoms];
    const model = getGeminiModel('gemini-1.5-flash');

    let triageResult = null;

    if (model) {
      const prompt = `
You are Tena AI, an expert, compassionate clinical triage assistant built for accessible healthcare in Ethiopia and East Africa.
Your task is to evaluate a patient's symptoms and produce a clean, structured, non-alarmist JSON triage assessment.
CRITICAL RULES:
1. Write in plain, easy-to-understand English. Keep sentences clear and concise.
2. DO NOT use any emojis anywhere in the text.
3. Categorize severity strictly into one of: "Low", "Moderate", "Urgent", "Emergency".
4. Recommend actionable, practical next steps (e.g. hydration, booking doctor, emergency call).
5. Always output ONLY valid JSON matching this exact structure:
{
  "severityLevel": "Low" | "Moderate" | "Urgent" | "Emergency",
  "clinicalSummary": "2-3 sentences plain English clinical summary explaining what might be happening.",
  "possibleConditions": ["Condition 1", "Condition 2", "Condition 3"],
  "recommendedActions": ["Action 1", "Action 2", "Action 3"],
  "suggestedSpecialties": ["Specialty 1", "Specialty 2"],
  "redFlags": ["Red flag symptom to watch for 1", "Red flag 2"]
}

Patient Information:
- Age: ${patientAge}
- Gender: ${patientGender}
- Symptoms: ${symptomsList.join(', ')}
- Duration: ${symptomDuration}
- Self-reported Severity (1 to 10): ${severityRating}
- Existing Health Conditions: ${existingConditions.length > 0 ? existingConditions.join(', ') : 'None'}
`;

      try {
        const result = await model.generateContent(prompt);
        const responseText = result.response.text();
        const jsonMatch = responseText.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          triageResult = JSON.parse(jsonMatch[0]);
        }
      } catch (aiError) {
        console.error('[Gemini AI Triage Error]', aiError.message);
        triageResult = runFallbackTriage({ symptoms: symptomsList, severityRating, patientAge, duration: symptomDuration });
      }
    }

    if (!triageResult) {
      triageResult = runFallbackTriage({ symptoms: symptomsList, severityRating, patientAge, duration: symptomDuration });
    }

    // Persist triage record in DB if connected
    let savedRecord = null;
    try {
      savedRecord = await TriageRecord.create({
        userId,
        patientAge,
        patientGender,
        symptoms: symptomsList,
        symptomDuration,
        severityRating,
        existingConditions,
        severityLevel: triageResult.severityLevel,
        clinicalSummary: triageResult.clinicalSummary,
        possibleConditions: triageResult.possibleConditions || [],
        recommendedActions: triageResult.recommendedActions || [],
        suggestedSpecialties: triageResult.suggestedSpecialties || ['General Medicine'],
        redFlags: triageResult.redFlags || [],
      });
    } catch (dbErr) {
      console.warn('[DB Triage Save Warning]', dbErr.message);
    }

    return res.status(200).json({
      success: true,
      data: {
        recordId: savedRecord ? savedRecord._id : 'temp-' + Date.now(),
        ...triageResult,
        patientInfo: {
          age: patientAge,
          gender: patientGender,
          symptoms: symptomsList,
          duration: symptomDuration,
          severity: severityRating
        }
      }
    });

  } catch (error) {
    console.error('[Triage Controller Error]', error);
    return res.status(500).json({ success: false, message: 'Internal server error evaluating symptoms' });
  }
};

export const getTriageHistory = async (req, res) => {
  try {
    const { userId } = req.params;
    const history = await TriageRecord.find({ userId }).sort({ createdAt: -1 }).limit(10);
    return res.status(200).json({ success: true, data: history });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Could not fetch history' });
  }
};
