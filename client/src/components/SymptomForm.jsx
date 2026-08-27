import { useState } from 'react';
import { Plus, X } from 'lucide-react';
import Card from '@components/ui/Card';
import Button from '@components/ui/Button';
import Input from '@components/ui/Input';

const SymptomForm = ({ symptoms, onSymptomsChange }) => {
  const [newSymptom, setNewSymptom] = useState({
    symptom: '',
    severity: 'moderate',
    duration: '',
    notes: ''
  });

  const addSymptom = () => {
    if (newSymptom.symptom.trim()) {
      onSymptomsChange([...symptoms, newSymptom]);
      setNewSymptom({
        symptom: '',
        severity: 'moderate',
        duration: '',
        notes: ''
      });
    }
  };

  const removeSymptom = (index) => {
    onSymptomsChange(symptoms.filter((_, i) => i !== index));
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && newSymptom.symptom.trim()) {
      e.preventDefault();
      addSymptom();
    }
  };

  return (
    <Card>
      <Card.Header>
        <Card.Title>Manual Symptom Entry</Card.Title>
        <Card.Description>
          Add symptoms manually if you prefer not to record voice
        </Card.Description>
      </Card.Header>
      
      <Card.Content>
        {/* Current Symptoms */}
        {symptoms.length > 0 && (
          <div className="mb-6 space-y-3">
            {symptoms.map((symptom, index) => (
              <div
                key={index}
                className="flex items-start justify-between p-4 bg-cloud-gray rounded-lg"
              >
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="font-semibold text-tena-black capitalize">
                      {symptom.symptom}
                    </h4>
                    <span className={`text-xs px-2 py-1 rounded ${
                      symptom.severity === 'severe' ? 'bg-error text-white' :
                      symptom.severity === 'moderate' ? 'bg-warning text-white' :
                      'bg-info text-white'
                    }`}>
                      {symptom.severity}
                    </span>
                  </div>
                  {symptom.duration && (
                    <p className="text-sm text-gray-600">Duration: {symptom.duration}</p>
                  )}
                  {symptom.notes && (
                    <p className="text-sm text-gray-700 mt-1">{symptom.notes}</p>
                  )}
                </div>
                <button
                  onClick={() => removeSymptom(index)}
                  className="p-1 hover:bg-error hover:text-white rounded transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Add New Symptom */}
        <div className="space-y-4">
          <Input
            label="Symptom"
            placeholder="e.g., Headache, Fever, Cough"
            value={newSymptom.symptom}
            onChange={(e) => setNewSymptom({ ...newSymptom, symptom: e.target.value })}
            onKeyPress={handleKeyPress}
            required
          />

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-tena-black mb-2">
                Severity
              </label>
              <select
                value={newSymptom.severity}
                onChange={(e) => setNewSymptom({ ...newSymptom, severity: e.target.value })}
                className="input"
              >
                <option value="mild">Mild</option>
                <option value="moderate">Moderate</option>
                <option value="severe">Severe</option>
              </select>
            </div>

            <Input
              label="Duration"
              placeholder="e.g., 2 days, 1 week"
              value={newSymptom.duration}
              onChange={(e) => setNewSymptom({ ...newSymptom, duration: e.target.value })}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-tena-black mb-2">
              Additional Notes (Optional)
            </label>
            <textarea
              value={newSymptom.notes}
              onChange={(e) => setNewSymptom({ ...newSymptom, notes: e.target.value })}
              placeholder="Any additional details about this symptom..."
              className="input min-h-[80px]"
            />
          </div>

          <Button
            variant="secondary"
            icon={Plus}
            onClick={addSymptom}
            disabled={!newSymptom.symptom.trim()}
            className="w-full"
          >
            Add Symptom
          </Button>
        </div>

        {symptoms.length === 0 && (
          <div className="mt-4 p-4 bg-yellow-50 rounded-lg">
            <p className="text-sm text-gray-700">
              Add at least one symptom to continue with your assessment.
            </p>
          </div>
        )}
      </Card.Content>
    </Card>
  );
};

export default SymptomForm;
