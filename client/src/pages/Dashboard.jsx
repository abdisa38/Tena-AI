import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Activity, FileText, TrendingUp, AlertCircle } from 'lucide-react';
import Card from '@components/ui/Card';
import Button from '@components/ui/Button';
import Badge from '@components/ui/Badge';
import Loading from '@components/ui/Loading';
import useAssessmentStore from '@stores/useAssessmentStore';
import { format } from 'date-fns';

const Dashboard = () => {
  const { stats, loading, fetchStats } = useAssessmentStore();

  useEffect(() => {
    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loading size="lg" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-tena-black mb-2">Dashboard</h1>
        <p className="text-gray-600">Overview of your health assessments</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Assessments</p>
              <p className="text-3xl font-bold text-tena-black mt-1">
                {stats?.totalAssessments || 0}
              </p>
            </div>
            <div className="w-12 h-12 bg-tena-yellow rounded-lg flex items-center justify-center">
              <FileText className="w-6 h-6 text-tena-black" />
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">This Month</p>
              <p className="text-3xl font-bold text-tena-black mt-1">
                {stats?.thisMonthAssessments || 0}
              </p>
            </div>
            <div className="w-12 h-12 bg-info bg-opacity-10 rounded-lg flex items-center justify-center">
              <Activity className="w-6 h-6 text-info" />
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Avg Confidence</p>
              <p className="text-3xl font-bold text-tena-black mt-1">
                {stats?.avgConfidence || 0}%
              </p>
            </div>
            <div className="w-12 h-12 bg-success bg-opacity-10 rounded-lg flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-success" />
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Emergency</p>
              <p className="text-3xl font-bold text-tena-black mt-1">
                {stats?.emergencyCount || 0}
              </p>
            </div>
            <div className="w-12 h-12 bg-error bg-opacity-10 rounded-lg flex items-center justify-center">
              <AlertCircle className="w-6 h-6 text-error" />
            </div>
          </div>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <Card.Header>
          <Card.Title>Quick Actions</Card.Title>
          <Card.Description>Start a new assessment or view your history</Card.Description>
        </Card.Header>
        <Card.Content>
          <div className="flex flex-col sm:flex-row gap-4">
            <Link to="/dashboard/assessment/new" className="flex-1">
              <Button variant="primary" className="w-full">
                New Assessment
              </Button>
            </Link>
            <Link to="/dashboard/assessments" className="flex-1">
              <Button variant="outline" className="w-full">
                View History
              </Button>
            </Link>
          </div>
        </Card.Content>
      </Card>

      {/* Recent Assessments */}
      <Card>
        <Card.Header>
          <Card.Title>Recent Assessments</Card.Title>
          <Card.Description>Your latest health evaluations</Card.Description>
        </Card.Header>
        <Card.Content>
          {stats?.recentAssessments && stats.recentAssessments.length > 0 ? (
            <div className="space-y-4">
              {stats.recentAssessments.map((assessment) => (
                <Link
                  key={assessment._id}
                  to={`/dashboard/assessments/${assessment._id}`}
                  className="block p-4 border border-cloud-gray rounded-lg hover:border-tena-yellow transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-tena-black">
                        {assessment.assessmentId}
                      </p>
                      <p className="text-sm text-gray-600 mt-1">
                        {assessment.symptoms?.length || 0} symptoms recorded
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-tena-black">
                        {assessment.aiAnalysis?.confidence || 0}%
                      </p>
                      <Badge 
                        variant={assessment.isEmergency ? 'error' : 'success'}
                        className="mt-1"
                      >
                        {assessment.status}
                      </Badge>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              <FileText className="w-12 h-12 mx-auto mb-2 opacity-50" />
              <p>No assessments yet</p>
              <Link to="/dashboard/assessment/new">
                <Button variant="ghost" size="sm" className="mt-2">
                  Create Your First Assessment
                </Button>
              </Link>
            </div>
          )}
        </Card.Content>
      </Card>
    </div>
  );
};

export default Dashboard;
