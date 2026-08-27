import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AlertTriangle, Sparkles, ChevronRight } from 'lucide-react';
import { toast } from 'react-hot-toast';
import Card from '@components/ui/Card';
import Button from '@components/ui/Button';
import Loading from '@components/ui/Loading';
import LanguageSelector from '@components/LanguageSelector';
import VoiceRecorder from '@components/VoiceRecorder';
import SymptomForm from '@components/SymptomForm';
import useAssessmentStore from '@stores/useAssessmentStore';
import { voiceAPI } from '@services/api';

const NewAssessment = () => {
  const navigate = useNavigate();
  const { createAssessment, loading } = useAssessmentStore();
  
  const [step, setStep] = useState(1);
  const [language, setLanguage] = useState('english');
  const [recordingMethod, setRecordingMethod] = useState(null); // 'voice' or 'manual'
  const [audioFile, setAudioFile] = useState(null);
  const [symptoms, setSymptoms] = useState([]);
  const [vitalSigns, setVitalSigns] = useState({
    temperature: '',
    bloodPressure: { systolic: '', diastolic: '' },
    heartRate: '',
    respiratoryRate: ''
  });
  const [analyzing, setAnalyzing] = useState(false);

  const handleRecordingComplete = (file) => {
    setAudioFile(file);
    toast.success('Recording saved successfully');
  };

  const handleAnalyzeVoice = async () => {
    if (!audioFile) {
      toast.error('No recording found');
      return;
    }

    setAnalyzing(true);
    try {
      // Upload voice file
      const formData = new FormData();
      formData.append('voice', audioFile);
      formData.append('language', language);

      const uploadResponse = await voiceAPI.upload(formData);
      
      // Simulate transcription (in production, this would be real API call)
      const transcript = 'I have been experiencing headache and fever for the past two days';
      
      // Analyze voice to extract symptoms
      const analyzeResponse = await voiceAPI.analyze({
        transcript: transcript,
        language: language
      });

      if (analyzeResponse.data.symptoms) {
        setSymptoms(analyzeResponse.data.symptoms);
        setStep(3);
        toast.success('Voice analyzed successfully');
      }
    } catch (error) {
      console.error('Voice analysis error:', error);
      toast.error('Failed to analyze voice. You can add symptoms manually.');
      setRecordingMethod('manual');
      setStep(3);
    } finally {
      setAnalyzing(false);
    }
  };

  const handleSubmitAssessment = async () => {
    if (symptoms.length === 0) {
      toast.error('Please add at least one symptom');
      return;
    }

    setAnalyzing(true);
    try {
      const assessmentData = {
        symptoms,
        language,
        vitalSigns: Object.keys(vitalSigns).some(key => 
          vitalSigns[key] && (typeof vitalSigns[key] === 'object' 
            ? Object.values(vitalSigns[key]).some(v => v) 
            : true)
        ) ? vitalSigns : null
      };

      const result = await createAssessment(assessmentData);
      
      toast.success('Assessment created successfully! AI analysis complete.');
      navigate(`/dashboard/assessments/${result._id}`);
    } catch (error) {
      toast.error(error.message || 'Failed to create assessment');
    } finally {
      setAnalyzing(false);
    }
  };

  return (
    <div className="max-w-4xl">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-tena-black mb-2">New Assessment</h1>
        <p className="text-gray-600">Create a new health assessment</p>
      </div>

      {/* Progress Steps */}
      <div className="flex items-center justify-center mb-8">
        <div className="flex items-center gap-4">
          <div className={`flex items-center gap-2 ${step >= 1 ? 'text-tena-black' : 'text-gray-400'}`}>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${step >= 1 ? 'bg-tena-yellow' : 'bg-gray-300'}`}>
              1
            </div>
            <span className="text-sm font-medium">Language</span>
          </div>
          <ChevronRight className="w-5 h-5 text-gray-400" />
          <div className={`flex items-center gap-2 ${step >= 2 ? 'text-tena-black' : 'text-gray-400'}`}>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${step >= 2 ? 'bg-tena-yellow' : 'bg-gray-300'}`}>
              2
            </div>
            <span className="text-sm font-medium">Record</span>
          </div>
          <ChevronRight className="w-5 h-5 text-gray-400" />
          <div className={`flex items-center gap-2 ${step >= 3 ? 'text-tena-black' : 'text-gray-400'}`}>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${step >= 3 ? 'bg-tena-yellow' : 'bg-gray-300'}`}>
              3
            </div>
            <span className="text-sm font-medium">Review</span>
          </div>
        </div>
      </div>

      {/* Step 1: Language Selection */}
      {step === 1 && (
        <div className="space-y-6">
          <LanguageSelector selected={language} onSelect={setLanguage} />
          <div className="flex justify-end">
            <Button variant="primary" onClick={() => setStep(2)}>
              Continue
            </Button>
          </div>
        </div>
      )}

      {/* Step 2: Recording Method */}
      {step === 2 && !recordingMethod && (
        <Card>
          <Card.Header>
            <Card.Title>Choose Input Method</Card.Title>
            <Card.Description>How would you like to record your symptoms?</Card.Description>
          </Card.Header>
          <Card.Content>
            <div className="grid md:grid-cols-2 gap-4">
              <button
                onClick={() => setRecordingMethod('voice')}
                className="p-6 border-2 border-cloud-gray rounded-lg hover:border-tena-yellow transition-colors text-left"
              >
                <Sparkles className="w-10 h-10 text-tena-yellow mb-3" />
                <h3 className="font-semibold text-lg text-tena-black mb-2">
                  Voice Recording
                </h3>
                <p className="text-sm text-gray-600">
                  Record your symptoms using your voice. AI will analyze your recording.
                </p>
              </button>

              <button
                onClick={() => {
                  setRecordingMethod('manual');
                  setStep(3);
                }}
                className="p-6 border-2 border-cloud-gray rounded-lg hover:border-tena-yellow transition-colors text-left"
              >
                <AlertTriangle className="w-10 h-10 text-tena-yellow mb-3" />
                <h3 className="font-semibold text-lg text-tena-black mb-2">
                  Manual Entry
                </h3>
                <p className="text-sm text-gray-600">
                  Type your symptoms manually if you prefer not to record.
                </p>
              </button>
            </div>
          </Card.Content>
        </Card>
      )}

      {/* Step 2: Voice Recording */}
      {step === 2 && recordingMethod === 'voice' && (
        <div className="space-y-6">
          <VoiceRecorder 
            onRecordingComplete={handleRecordingComplete}
            language={language}
          />
          
          {audioFile && (
            <div className="flex justify-end gap-3">
              <Button variant="outline" onClick={() => setAudioFile(null)}>
                Record Again
              </Button>
              <Button 
                variant="primary" 
                onClick={handleAnalyzeVoice}
                loading={analyzing}
              >
                Analyze Recording
              </Button>
            </div>
          )}
        </div>
      )}

      {/* Analyzing State */}
      {analyzing && (
        <Card>
          <Card.Content className="text-center py-12">
            <Loading size="lg" className="mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-tena-black mb-2">
              {recordingMethod === 'voice' ? 'Analyzing Your Recording...' : 'Creating Assessment with AI...'}
            </h3>
            <p className="text-gray-600">
              {recordingMethod === 'voice' 
                ? 'AI is extracting symptoms from your voice recording' 
                : 'AI is analyzing your symptoms and generating recommendations'}
            </p>
            <div className="mt-4">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-cloud-gray rounded-full">
                <Activity className="w-4 h-4 text-tena-yellow animate-pulse" />
                <span className="text-sm text-gray-600">This takes 10-15 seconds</span>
              </div>
            </div>
          </Card.Content>
        </Card>
      )}

      {/* Step 3: Review & Add Symptoms */}
      {step === 3 && !analyzing && (
        <div className="space-y-6">
          <SymptomForm symptoms={symptoms} onSymptomsChange={setSymptoms} />

          {/* Vital Signs (Optional) */}
          <Card>
            <Card.Header>
              <Card.Title>Vital Signs (Optional)</Card.Title>
              <Card.Description>Add your vital signs if available</Card.Description>
            </Card.Header>
            <Card.Content>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-tena-black mb-2">
                    Temperature (°C)
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    placeholder="37.0"
                    value={vitalSigns.temperature}
                    onChange={(e) => setVitalSigns({ ...vitalSigns, temperature: e.target.value })}
                    className="input"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-tena-black mb-2">
                    Heart Rate (bpm)
                  </label>
                  <input
                    type="number"
                    placeholder="72"
                    value={vitalSigns.heartRate}
                    onChange={(e) => setVitalSigns({ ...vitalSigns, heartRate: e.target.value })}
                    className="input"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-tena-black mb-2">
                    Blood Pressure (mmHg)
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="number"
                      placeholder="120"
                      value={vitalSigns.bloodPressure.systolic}
                      onChange={(e) => setVitalSigns({ 
                        ...vitalSigns, 
                        bloodPressure: { ...vitalSigns.bloodPressure, systolic: e.target.value }
                      })}
                      className="input"
                    />
                    <span className="flex items-center">/</span>
                    <input
                      type="number"
                      placeholder="80"
                      value={vitalSigns.bloodPressure.diastolic}
                      onChange={(e) => setVitalSigns({ 
                        ...vitalSigns, 
                        bloodPressure: { ...vitalSigns.bloodPressure, diastolic: e.target.value }
                      })}
                      className="input"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-tena-black mb-2">
                    Respiratory Rate (/min)
                  </label>
                  <input
                    type="number"
                    placeholder="16"
                    value={vitalSigns.respiratoryRate}
                    onChange={(e) => setVitalSigns({ ...vitalSigns, respiratoryRate: e.target.value })}
                    className="input"
                  />
                </div>
              </div>
            </Card.Content>
          </Card>

          {/* Actions */}
          <div className="flex justify-between">
            <Button variant="outline" onClick={() => setStep(step - 1)}>
              Back
            </Button>
            <Button 
              variant="primary" 
              onClick={handleSubmitAssessment}
              loading={loading}
              disabled={symptoms.length === 0}
            >
              Create Assessment
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default NewAssessment;
