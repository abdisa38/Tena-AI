import Card from '@components/ui/Card';

const NewAssessment = () => {
  return (
    <div>
      <h1 className="text-3xl font-bold text-tena-black mb-6">New Assessment</h1>
      <Card>
        <Card.Header>
          <Card.Title>Voice Recording</Card.Title>
          <Card.Description>Record your symptoms in your preferred language</Card.Description>
        </Card.Header>
        <Card.Content>
          <p className="text-gray-600">Voice recording component will be built in Phase 6</p>
        </Card.Content>
      </Card>
    </div>
  );
};

export default NewAssessment;
