import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { 
  ArrowLeft, 
  Calendar, 
  Activity, 
  Brain,
  AlertTriangle,
  FileText,
  User,
  Trash2,
  Download
} from 'lucide-react';
import { toast } from 'react-hot-toast';
import Card from '@components/ui/Card';
import Button from '@components/ui/Button';
import Badge from '@components/ui/Badge';
import Loading from '@components/ui/Loading';
import Modal from '@components/ui/Modal';
import useAssessmentStore from '@stores/useAssessmentStore';

const AssessmentDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { currentAssessment, loading, fetchAssessment, deleteAssessment } = useAssessmentStore();
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);

  useEffect(() => {
    if (id) {
      fetchAssessment(id);
    }
  }, [id]);

  const handleDelete = async () => {
    try {
      await deleteAssessment(id);
      toast.success('Assessment deleted successfully');
      navigate('/dashboard/assessments');
    } catch (error) {
      toast.error(error.message || 'Failed to delete assessment');
    }
  };

  if (loading || !currentAssessment) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loading size="lg" />
      </div>
    );
  }

  const assessment = currentAssessment;

  return (
    <div className="max-w-4xl">
      {/* Header */}
      <div className="mb-6">
        <Link to="/dashboard/assessments">
          <Button variant="ghost" icon={ArrowLeft} size="sm" className="mb-4">
            Back to History
          </Button>
        </Link>
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-3xl font-bold text-tena-black mb-2">
              {assessment.assessmentId}
            </h1>
            <div className="flex items-center gap-3">
              <Badge variant={assessment.isEmergency ? 'error' : 'info'}>
                {assessment.status}
              </Badge>
              {assessment.isEmergency && (
                <Badge variant="error">
                  <AlertTriangle className="w-3 h-3 mr-1" />
                  Emergency
                </Badge>
              )}
              <span className="text-gray-600 flex items-center gap-1">
                <Calendar className="w-4 h-4" />
                {new Date(assessment.createdAt).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </span>
            </div>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" icon={Download} size="sm">
              Download PDF
            </Button>
            <Button 
              variant="ghost" 
              icon={Trash2} 
              size="sm"
              onClick={() => setDeleteModalOpen(true)}
            >
              Delete
            </Button>
          </div>
        </div>
      </div>

      {/* AI Analysis - Confidence Score */}
      <Card className="mb-6 bg-gradient-to-r from-tena-yellow to-yellow-300">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-tena-black mb-1">AI Confidence Score</p>
            <div className="flex items-center gap-4">
              <h2 className="text-5xl font-bold text-tena-black">
                {assessment.aiAnalysis?.confidence || 0}%
              </h2>
              <div>
                <Badge 
                  variant={
                    assessment.aiAnalysis?.urgencyLevel === 'emergency' ? 'error' :
                    assessment.aiAnalysis?.urgencyLevel === 'urgent' ? 'warning' : 'success'
                  }
                  className="capitalize"
                >
                  {assessment.aiAnalysis?.urgencyLevel || 'routine'}
                </Badge>
              </div>
            </div>
          </div>
          <Brain className="w-16 h-16 text-tena-black opacity-20" />
        </div>
      </Card>

      {/* Symptoms */}
      <Card className="mb-6">
        <Card.Header>
          <div className="flex items-center gap-2">
            <Activity className="w-5 h-5" />
            <Card.Title>Recorded Symptoms</Card.Title>
          </div>
        </Card.Header>
        <Card.Content>
          {assessment.symptoms && assessment.symptoms.length > 0 ? (
            <div className="space-y-4">
              {assessment.symptoms.map((symptom, index) => (
                <div key={index} className="p-4 bg-cloud-gray rounded-lg">
                  <div className="flex items-start justify-between mb-2">
                    <h4 className="font-semibold text-tena-black capitalize">
                      {symptom.symptom}
                    </h4>
                    <Badge 
                      variant={
                        symptom.severity === 'severe' ? 'error' :
                        symptom.severity === 'moderate' ? 'warning' : 'info'
                      }
                      className="capitalize"
                    >
                      {symptom.severity}
                    </Badge>
                  </div>
                  {symptom.duration && (
                    <p className="text-sm text-gray-600 mb-1">
                      Duration: {symptom.duration}
                    </p>
                  )}
                  {symptom.notes && (
                    <p className="text-sm text-gray-700 mt-2">{symptom.notes}</p>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-center py-4">No symptoms recorded</p>
          )}
        </Card.Content>
      </Card>

      {/* Clinical Summary */}
      <Card className="mb-6">
        <Card.Header>
          <div className="flex items-center gap-2">
            <FileText className="w-5 h-5" />
            <Card.Title>Clinical Summary</Card.Title>
          </div>
        </Card.Header>
        <Card.Content>
          <p className="text-gray-700 leading-relaxed whitespace-pre-line">
            {assessment.aiAnalysis?.clinicalSummary || 'No summary available'}
          </p>
        </Card.Content>
      </Card>

      {/* Possible Conditions */}
      {assessment.aiAnalysis?.possibleConditions && assessment.aiAnalysis.possibleConditions.length > 0 && (
        <Card className="mb-6">
          <Card.Header>
            <Card.Title>Possible Conditions</Card.Title>
            <Card.Description>Based on AI analysis of symptoms</Card.Description>
          </Card.Header>
          <Card.Content>
            <div className="space-y-3">
              {assessment.aiAnalysis.possibleConditions.map((condition, index) => (
                <div key={index} className="p-4 border border-cloud-gray rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-semibold text-tena-black">
                      {condition.condition}
                    </h4>
                    <span className="text-sm font-medium text-tena-yellow">
                      {condition.probability}% match
                    </span>
                  </div>
                  <p className="text-sm text-gray-600">{condition.description}</p>
                </div>
              ))}
            </div>
          </Card.Content>
        </Card>
      )}

      {/* Recommendations */}
      {assessment.aiAnalysis?.recommendations && assessment.aiAnalysis.recommendations.length > 0 && (
        <Card className="mb-6">
          <Card.Header>
            <Card.Title>Recommendations</Card.Title>
          </Card.Header>
          <Card.Content>
            <ul className="space-y-2">
              {assessment.aiAnalysis.recommendations.map((rec, index) => (
                <li key={index} className="flex items-start gap-2">
                  <span className="w-6 h-6 bg-tena-yellow rounded-full flex items-center justify-center text-tena-black text-sm font-medium flex-shrink-0">
                    {index + 1}
                  </span>
                  <span className="text-gray-700">{rec}</span>
                </li>
              ))}
            </ul>
          </Card.Content>
        </Card>
      )}

      {/* Vital Signs */}
      {assessment.vitalSigns && (
        <Card className="mb-6">
          <Card.Header>
            <Card.Title>Vital Signs</Card.Title>
          </Card.Header>
          <Card.Content>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {assessment.vitalSigns.temperature && (
                <div>
                  <p className="text-sm text-gray-600">Temperature</p>
                  <p className="text-xl font-semibold text-tena-black">
                    {assessment.vitalSigns.temperature}°C
                  </p>
                </div>
              )}
              {assessment.vitalSigns.bloodPressure && (
                <div>
                  <p className="text-sm text-gray-600">Blood Pressure</p>
                  <p className="text-xl font-semibold text-tena-black">
                    {assessment.vitalSigns.bloodPressure.systolic}/
                    {assessment.vitalSigns.bloodPressure.diastolic}
                  </p>
                </div>
              )}
              {assessment.vitalSigns.heartRate && (
                <div>
                  <p className="text-sm text-gray-600">Heart Rate</p>
                  <p className="text-xl font-semibold text-tena-black">
                    {assessment.vitalSigns.heartRate} bpm
                  </p>
                </div>
              )}
              {assessment.vitalSigns.respiratoryRate && (
                <div>
                  <p className="text-sm text-gray-600">Respiratory Rate</p>
                  <p className="text-xl font-semibold text-tena-black">
                    {assessment.vitalSigns.respiratoryRate} /min
                  </p>
                </div>
              )}
            </div>
          </Card.Content>
        </Card>
      )}

      {/* Doctor Notes */}
      {assessment.doctorNotes && (
        <Card className="mb-6">
          <Card.Header>
            <div className="flex items-center gap-2">
              <User className="w-5 h-5" />
              <Card.Title>Doctor Notes</Card.Title>
            </div>
          </Card.Header>
          <Card.Content>
            <p className="text-gray-700 whitespace-pre-line">{assessment.doctorNotes}</p>
            {assessment.reviewedAt && (
              <p className="text-sm text-gray-500 mt-4">
                Reviewed on {new Date(assessment.reviewedAt).toLocaleDateString()}
              </p>
            )}
          </Card.Content>
        </Card>
      )}

      {/* Disclaimer */}
      <Card className="border-warning bg-yellow-50">
        <Card.Content>
          <div className="flex gap-3">
            <AlertTriangle className="w-5 h-5 text-warning flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-medium text-warning mb-1">Medical Disclaimer</p>
              <p className="text-sm text-gray-700">
                This assessment is AI-generated and should not replace professional medical advice. 
                Consult a healthcare provider for proper diagnosis and treatment.
              </p>
            </div>
          </div>
        </Card.Content>
      </Card>

      {/* Delete Confirmation Modal */}
      <Modal isOpen={deleteModalOpen} onClose={() => setDeleteModalOpen(false)}>
        <Modal.Header onClose={() => setDeleteModalOpen(false)}>
          <Modal.Title>Delete Assessment</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p className="text-gray-600">
            Are you sure you want to delete this assessment? This action cannot be undone.
          </p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="ghost" onClick={() => setDeleteModalOpen(false)}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleDelete}>
            Delete Assessment
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default AssessmentDetail;
