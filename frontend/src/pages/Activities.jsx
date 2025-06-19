import { Card, Container, ListGroup, Badge } from 'react-bootstrap';

const dummyActivities = [
  {
    id: 1,
    type: 'Contact Created',
    content: 'Jane Doe was added to the CRM.',
    timestamp: '2025-06-19 10:30 AM',
    color: 'success'
  },
  {
    id: 2,
    type: 'Deal Moved',
    content: 'CRM Integration deal moved from Proposal to Negotiation.',
    timestamp: '2025-06-18 3:15 PM',
    color: 'primary'
  },
  {
    id: 3,
    type: 'Note Added',
    content: 'Follow-up call scheduled with John Smith.',
    timestamp: '2025-06-18 11:00 AM',
    color: 'info'
  },
  {
    id: 4,
    type: 'Integration Synced',
    content: 'HubSpot sync completed successfully.',
    timestamp: '2025-06-17 9:00 AM',
    color: 'secondary'
  }
];

export default function Activities() {
  return (
    <Container fluid>
      <h3 className="fw-bold mb-4">Activity Timeline</h3>

      <Card>
        <ListGroup variant="flush">
          {dummyActivities.map(activity => (
            <ListGroup.Item key={activity.id}>
              <div className="d-flex justify-content-between align-items-start">
                <div>
                  <h6 className="mb-1">
                    <Badge bg={activity.color} className="me-2">
                      {activity.type}
                    </Badge>
                    {activity.content}
                  </h6>
                  <small className="text-muted">{activity.timestamp}</small>
                </div>
              </div>
            </ListGroup.Item>
          ))}
        </ListGroup>
      </Card>
    </Container>
  );
}
