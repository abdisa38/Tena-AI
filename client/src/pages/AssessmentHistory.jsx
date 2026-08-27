import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { FileText, Search, Filter, AlertCircle, Clock, TrendingUp } from 'lucide-react';
import Card from '@components/ui/Card';
import Button from '@components/ui/Button';
import Badge from '@components/ui/Badge';
import Input from '@components/ui/Input';
import Loading from '@components/ui/Loading';
import useAssessmentStore from '@stores/useAssessmentStore';

const AssessmentHistory = () => {
  const { assessments, loading, pagination, fetchAssessments } = useAssessmentStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [page, setPage] = useState(1);

  useEffect(() => {
    loadAssessments();
  }, [page, statusFilter]);

  const loadAssessments = () => {
    const params = { page, limit: 10 };
    if (statusFilter !== 'all') {
      params.status = statusFilter;
    }
    fetchAssessments(params);
  };

  const filteredAssessments = assessments.filter((assessment) => {
    const matchesSearch = 
      assessment.assessmentId?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      assessment.symptoms?.some(s => s.symptom.toLowerCase().includes(searchQuery.toLowerCase()));
    
    return matchesSearch;
  });

  const getStatusBadge = (status) => {
    const variants = {
      pending: 'warning',
      analyzed: 'info',
      reviewed: 'success',
      archived: 'error'
    };
    return <Badge variant={variants[status] || 'info'}>{status}</Badge>;
  };

  const getUrgencyColor = (urgency) => {
    const colors = {
      routine: 'text-success',
      urgent: 'text-warning',
      emergency: 'text-error'
    };
    return colors[urgency] || 'text-gray-600';
  };

  if (loading && assessments.length === 0) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loading size="lg" />
      </div>
    );
  }

  return (
    <div className="max-w-6xl">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-tena-black mb-2">Assessment History</h1>
        <p className="text-gray-600">View and manage your health assessments</p>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-tena-yellow rounded-lg flex items-center justify-center">
              <FileText className="w-5 h-5 text-tena-black" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Total</p>
              <p className="text-2xl font-bold text-tena-black">{pagination.total || 0}</p>
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-info bg-opacity-10 rounded-lg flex items-center justify-center">
              <Clock className="w-5 h-5 text-info" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Pending</p>
              <p className="text-2xl font-bold text-tena-black">
                {assessments.filter(a => a.status === 'pending').length}
              </p>
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-success bg-opacity-10 rounded-lg flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-success" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Reviewed</p>
              <p className="text-2xl font-bold text-tena-black">
                {assessments.filter(a => a.status === 'reviewed').length}
              </p>
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-error bg-opacity-10 rounded-lg flex items-center justify-center">
              <AlertCircle className="w-5 h-5 text-error" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Emergency</p>
              <p className="text-2xl font-bold text-tena-black">
                {assessments.filter(a => a.isEmergency).length}
              </p>
            </div>
          </div>
        </Card>
      </div>

      {/* Filters */}
      <Card className="mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <Input
              placeholder="Search by ID or symptoms..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              icon={Search}
            />
          </div>
          <div className="flex gap-2">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="input"
            >
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="analyzed">Analyzed</option>
              <option value="reviewed">Reviewed</option>
              <option value="archived">Archived</option>
            </select>
            <Button variant="outline" icon={Filter}>
              Filter
            </Button>
          </div>
        </div>
      </Card>

      {/* Assessment List */}
      {filteredAssessments.length === 0 ? (
        <Card>
          <div className="text-center py-12">
            <FileText className="w-16 h-16 mx-auto text-gray-300 mb-4" />
            <h3 className="text-xl font-semibold text-gray-600 mb-2">
              No assessments found
            </h3>
            <p className="text-gray-500 mb-6">
              {searchQuery ? 'Try different search terms' : 'Create your first assessment to get started'}
            </p>
            <Link to="/dashboard/assessment/new">
              <Button variant="primary">Create Assessment</Button>
            </Link>
          </div>
        </Card>
      ) : (
        <div className="space-y-4">
          {filteredAssessments.map((assessment) => (
            <Link
              key={assessment._id}
              to={`/dashboard/assessments/${assessment._id}`}
            >
              <Card hover className="transition-all duration-200">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="font-semibold text-tena-black">
                        {assessment.assessmentId}
                      </h3>
                      {getStatusBadge(assessment.status)}
                      {assessment.isEmergency && (
                        <Badge variant="error">Emergency</Badge>
                      )}
                    </div>

                    <div className="flex items-center gap-4 text-sm text-gray-600 mb-3">
                      <span className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        {new Date(assessment.createdAt).toLocaleDateString()}
                      </span>
                      <span>
                        {assessment.symptoms?.length || 0} symptoms
                      </span>
                      <span className={`font-medium ${getUrgencyColor(assessment.aiAnalysis?.urgencyLevel)}`}>
                        {assessment.aiAnalysis?.urgencyLevel || 'routine'}
                      </span>
                    </div>

                    {assessment.symptoms && assessment.symptoms.length > 0 && (
                      <div className="flex flex-wrap gap-2">
                        {assessment.symptoms.slice(0, 3).map((symptom, index) => (
                          <span
                            key={index}
                            className="px-2 py-1 bg-cloud-gray rounded text-xs text-gray-700"
                          >
                            {symptom.symptom}
                          </span>
                        ))}
                        {assessment.symptoms.length > 3 && (
                          <span className="px-2 py-1 bg-cloud-gray rounded text-xs text-gray-700">
                            +{assessment.symptoms.length - 3} more
                          </span>
                        )}
                      </div>
                    )}
                  </div>

                  <div className="text-right ml-4">
                    <div className="text-3xl font-bold text-tena-black mb-1">
                      {assessment.aiAnalysis?.confidence || 0}%
                    </div>
                    <p className="text-xs text-gray-500">Confidence</p>
                  </div>
                </div>
              </Card>
            </Link>
          ))}
        </div>
      )}

      {/* Pagination */}
      {pagination.pages > 1 && (
        <div className="flex justify-center gap-2 mt-6">
          <Button
            variant="outline"
            onClick={() => setPage(page - 1)}
            disabled={page === 1}
          >
            Previous
          </Button>
          <span className="px-4 py-2 text-gray-600">
            Page {page} of {pagination.pages}
          </span>
          <Button
            variant="outline"
            onClick={() => setPage(page + 1)}
            disabled={page === pagination.pages}
          >
            Next
          </Button>
        </div>
      )}
    </div>
  );
};

export default AssessmentHistory;
