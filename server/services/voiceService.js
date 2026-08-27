const fs = require('fs').promises;
const path = require('path');

class VoiceService {
  constructor() {
    // Voice processing configuration
    this.supportedFormats = ['audio/wav', 'audio/mp3', 'audio/mpeg', 'audio/ogg', 'audio/webm'];
    this.maxFileSize = 10 * 1024 * 1024; // 10MB
  }

  // Validate audio file
  validateAudioFile(file) {
    const errors = [];

    // Check file exists
    if (!file) {
      errors.push('No file provided');
      return { valid: false, errors };
    }

    // Check file size
    if (file.size > this.maxFileSize) {
      errors.push(`File size exceeds ${this.maxFileSize / 1024 / 1024}MB limit`);
    }

    // Check file format
    if (!this.supportedFormats.includes(file.mimetype)) {
      errors.push(`Unsupported format. Allowed: ${this.supportedFormats.join(', ')}`);
    }

    return {
      valid: errors.length === 0,
      errors
    };
  }

  // Get audio duration (placeholder - needs actual audio processing library)
  async getAudioDuration(filePath) {
    try {
      // In production, use a library like 'get-audio-duration' or 'ffprobe'
      // For now, return a placeholder
      
      const stats = await fs.stat(filePath);
      // Rough estimation: 1MB ≈ 60 seconds for compressed audio
      const estimatedDuration = Math.round((stats.size / 1024 / 1024) * 60);

      return {
        success: true,
        duration: estimatedDuration // in seconds
      };

    } catch (error) {
      console.error('Get Audio Duration Error:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  // Transcribe audio to text
  // This is a placeholder - integrate with actual speech-to-text service
  async transcribeAudio(audioPath, language = 'en') {
    try {
      // Integration options:
      // 1. Google Speech-to-Text API
      // 2. OpenAI Whisper API
      // 3. Amazon Transcribe
      // 4. Microsoft Azure Speech Services

      // Placeholder response
      const transcript = {
        text: 'I have been experiencing headache and fever for the past two days. The headache is moderate and the fever comes and goes.',
        language: language,
        confidence: 0.92,
        duration: 15, // seconds
        words: [
          { word: 'headache', startTime: 2.1, endTime: 2.8 },
          { word: 'fever', startTime: 3.5, endTime: 3.9 }
        ]
      };

      return {
        success: true,
        data: transcript
      };

    } catch (error) {
      console.error('Transcription Error:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  // Extract symptoms from transcript
  extractSymptoms(transcript) {
    const symptoms = [];
    const text = transcript.toLowerCase();

    // Symptom detection patterns
    const symptomPatterns = {
      'headache': {
        keywords: ['headache', 'head pain', 'head ache', 'migraine'],
        category: 'neurological'
      },
      'fever': {
        keywords: ['fever', 'high temperature', 'hot', 'burning up'],
        category: 'general'
      },
      'cough': {
        keywords: ['cough', 'coughing', 'hacking'],
        category: 'respiratory'
      },
      'sore throat': {
        keywords: ['sore throat', 'throat pain', 'throat hurts'],
        category: 'respiratory'
      },
      'fatigue': {
        keywords: ['tired', 'fatigue', 'exhausted', 'weak', 'no energy'],
        category: 'general'
      },
      'nausea': {
        keywords: ['nausea', 'sick', 'vomit', 'throw up', 'queasy'],
        category: 'digestive'
      },
      'dizziness': {
        keywords: ['dizzy', 'dizziness', 'lightheaded', 'spinning'],
        category: 'neurological'
      },
      'chest pain': {
        keywords: ['chest pain', 'chest hurt', 'chest tight'],
        category: 'cardiac'
      },
      'shortness of breath': {
        keywords: ['shortness of breath', 'hard to breathe', 'breathing problem', 'cant breathe'],
        category: 'respiratory'
      },
      'stomach ache': {
        keywords: ['stomach ache', 'stomach pain', 'belly pain', 'abdominal pain'],
        category: 'digestive'
      },
      'back pain': {
        keywords: ['back pain', 'back ache', 'back hurts'],
        category: 'musculoskeletal'
      },
      'runny nose': {
        keywords: ['runny nose', 'stuffy nose', 'congested', 'blocked nose'],
        category: 'respiratory'
      },
      'joint pain': {
        keywords: ['joint pain', 'aching joints', 'stiff joints'],
        category: 'musculoskeletal'
      },
      'skin rash': {
        keywords: ['rash', 'skin rash', 'itchy skin', 'red skin'],
        category: 'dermatological'
      }
    };

    // Severity detection
    const severityPatterns = {
      severe: ['severe', 'extreme', 'unbearable', 'intense', 'terrible', 'worst'],
      moderate: ['moderate', 'medium', 'noticeable', 'bothersome'],
      mild: ['mild', 'slight', 'little', 'minor', 'light']
    };

    // Duration detection
    const durationPatterns = {
      'few hours': ['few hours', 'couple hours', 'several hours'],
      '1 day': ['today', 'one day', '1 day', 'since morning'],
      '2-3 days': ['two days', 'three days', '2 days', '3 days', 'couple days'],
      '1 week': ['week', 'one week', '1 week', '7 days'],
      'over a week': ['over a week', 'more than a week', 'weeks']
    };

    // Detect symptoms
    for (const [symptom, config] of Object.entries(symptomPatterns)) {
      for (const keyword of config.keywords) {
        if (text.includes(keyword)) {
          // Detect severity
          let severity = 'moderate';
          for (const [level, words] of Object.entries(severityPatterns)) {
            if (words.some(word => text.includes(word) && text.indexOf(word) < text.indexOf(keyword) + 50)) {
              severity = level;
              break;
            }
          }

          // Detect duration
          let duration = 'recent';
          for (const [dur, patterns] of Object.entries(durationPatterns)) {
            if (patterns.some(pattern => text.includes(pattern))) {
              duration = dur;
              break;
            }
          }

          symptoms.push({
            symptom: symptom,
            severity: severity,
            duration: duration,
            category: config.category,
            detectedFrom: keyword
          });

          break; // Only add each symptom once
        }
      }
    }

    return symptoms;
  }

  // Clean up old audio files
  async cleanupOldFiles(directory, maxAgeInDays = 7) {
    try {
      const files = await fs.readdir(directory);
      const now = Date.now();
      const maxAge = maxAgeInDays * 24 * 60 * 60 * 1000;
      let deletedCount = 0;

      for (const file of files) {
        const filePath = path.join(directory, file);
        const stats = await fs.stat(filePath);
        const age = now - stats.mtimeMs;

        if (age > maxAge) {
          await fs.unlink(filePath);
          deletedCount++;
        }
      }

      return {
        success: true,
        deletedCount
      };

    } catch (error) {
      console.error('Cleanup Error:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  // Get supported languages
  getSupportedLanguages() {
    return [
      {
        code: 'english',
        name: 'English',
        nativeName: 'English',
        transcriptionCode: 'en-US'
      },
      {
        code: 'amharic',
        name: 'Amharic',
        nativeName: 'አማርኛ',
        transcriptionCode: 'am-ET'
      },
      {
        code: 'afaan_oromoo',
        name: 'Afaan Oromoo',
        nativeName: 'Afaan Oromoo',
        transcriptionCode: 'om-ET'
      }
    ];
  }

  // Convert language code
  getTranscriptionLanguageCode(languageCode) {
    const languages = this.getSupportedLanguages();
    const lang = languages.find(l => l.code === languageCode);
    return lang ? lang.transcriptionCode : 'en-US';
  }
}

module.exports = new VoiceService();
