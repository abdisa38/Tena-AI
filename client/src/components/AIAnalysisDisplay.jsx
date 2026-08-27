import { AlertCircle, CheckCircle, Activity, TrendingUp, FileText, AlertTriangle } from 'lucide-react';
import Card from '@components/ui/Card';
import Badge from '@components/ui/Badge';

const AIAnalysisDisplay = ({ analysis, loading }) => {
  if (loading) {
    return (
      <Card>
        <Card.Content className="text-center py-12">
          <div className="flex flex-col items-center gap-4">
            <Activity className="w-12 h-12 text-tena-yellow animate-pulse" />
            <h3 className="text-xl font-semibold text-tena-black">
              AI Analyzing Your Symptoms...
            </h3>
            <p className="text-gray-600">This usually takes 10-15 seconds</p>
          </div>
        </Card.Content>
      </Card>
    );
  }

  if (!analysis) return null;

  const getUrgencyColor = (level) => {
    switch (level) {
      case 'emergency': return 'bg-error text-white';
      case 'urgent': return 'bg-warning text-white';
      default: return 'bg-info text-white';
    }
  };

  const getConfidenceColor = (confidence) => {
    if (confidence >= 80) return 'text-success';
    if (confidence >= 60) return 'text-warning';
    return 'text-error';
  };

  return (
    <div className="space-y-6">
      {/* Confidence Score */}
      <Card>
        <Card.Content className="text-center py-8">
          <div className="inline-flex items-center justify-center w-32 h-32 rounded-full bg-cloud-gray mb-4">
            <div className="text-center">
              <div className={`text-5xl font-bold ${getConfidenceColor(analysis.confidence)}`}>
                {analysis.confidence}%
              </div>
              <div className="text-sm text-gray-600 mt-1">Confidence</div>
            </div>
          </div>
          <div className="flex items-center justify-center gap-2 mt-4">
            <Badge variant={analysis.urgencyLevel === 'emergency' ? 'error' : 
                           analysis.urgencyLevel === 'urgent' ? 'warning' : 'info'}>
              {analysis.urgencyLevel.toUpperCase()}
            </Badge>
          </div>
        </Card.Content>
      </Card>

      {/* Emergency Warning */}
      {analysis.urgencyLevel === 'emergency' && (
        <Card className="border-2 border-error">
          <Card.Content className="bg-red-50">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-6 h-6 text-error flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-semibold text-error mb-2">Emergency Situation Detected</h3>
                <p className="text-sm text-gray-700 mb-3">
                  Your symptoms require immediate medical attention. Please seek emergency care now.
                </p>
                <div className="flex gap-2">
                  <a
                    href="tel:911"
                    className="btn btn-error btn-sm"
                  >
                    Call Emergency
                  </a>
                </div>
              </div>
            </div>
          </Card.Content>
        </Card>
      )}

      {/* Warning Flags */}
      {analysis.warningFlags && analysis.warningFlags.length > 0 && (
        <Card>
          <Card.Header>
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-warning" />
              <Card.Title>Important Warnings</Card.Title>
            </div>
          </Card.Header>
          <Card.Content>
            <ul className="space-y-2">
              {analysis.warningFlags.map((flag, index) => (
                <li key={index} className="flex items-start gap-2 text-sm text-gray-700">
                  <AlertTriangle className="w-4 h-4 text-warning flex-shrink-0 mt-0.5" />
                  <span>{flag}</span>
                </li>
              ))}
            </ul>
          </Card.Content>
        </Card>
      )}

      {/* Clinical Summary */}
      <Card>
        <Card.Header>
          <div className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-tena-yellow" />
            <Card.Title>Clinical Summary</Card.Title>
          </div>
        </Card.Header>
        <Card.Content>
          <p className="text-gray-700 leading-relaxed">{analysis.clinicalSummary}</p>
        </Card.Content>
      </Card>

      {/* Possible Conditions */}
      {analysis.possibleConditions && analysis.possibleConditions.length > 0 && (
        <Card>
          <Card.Header>
            <div className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-tena-yellow" />
              <Card.Title>Possible Conditions</Card.Title>
            </div>
            <Card.Description>Based on your symptoms, these conditions are possible</Card.Description>
          </Card.Header>
          <Card.Content>
            <div className="space-y-4">
              {analysis.possibleConditions.map((condition, index) => (
                <div key={index} className="p-4 bg-cloud-gray rounded-lg">
                  <div className="flex items-start justify-between mb-2">
                    <h4 className="font-semibold text-tena-black">{condition.condition}</h4>
                    <span className="text-sm font-medium text-tena-yellow">
                      {condition.probability}%
                    </span>
                  </div>
                  <p className="text-sm text-gray-700">{condition.description}</p>
                </div>
              ))}
            </div>
          </Card.Content>
        </Card>
      )}

      {/* Recommendations */}
      {analysis.recommendations && analysis.recommendations.length > 0 && (
        <Card>
          <Card.Header>
            <div className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-success" />
              <Card.Title>Recommendations</Card.Title>
            </div>
          </Card.Header>
          <Card.Content>
            <ul className="space-y-3">
              {analysis.recommendations.map((rec, index) => (
                <li key={index} className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-tena-yellow flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-xs font-bold text-tena-black">{index + 1}</span>
                  </div>
                  <span className="text-gray-700">{rec}</span>
                </li>
              ))}
            </ul>
          </Card.Content>
        </Card>
      )}

      {/* Next Steps */}
      {analysis.nextSteps && analysis.nextSteps.length > 0 && (
        <Card>
          <Card.Header>
            <Card.Title>Next Steps</Card.Title>
          </Card.Header>
          <Card.Content>
            <ul className="space-y-2">
              {analysis.nextSteps.map((step, index) => (
                <li key={index} className="flex items-start gap-2 text-sm text-gray-700">
                  <CheckCircle className="w-4 h-4 text-success flex-shrink-0 mt-0.5" />
                  <span>{step}</span>
                </li>
              ))}
            </ul>
          </Card.Content>
        </Card>
      )}

      {/* Medical Disclaimer */}
      <Card className="border border-gray-300">
        <Card.Content className="bg-yellow-50">
          <p className="text-xs text-gray-600">
            <strong>Medical Disclaimer:</strong> This AI assessment is for informational purposes only 
            and does not replace professional medical advice. Always consult with a qualified healthcare 
            provider for proper diagnosis and treatment.
          </p>
        </Card.Content>
      </Card>
    </div>
  );
};

export default AIAnalysisDisplay;
