import { useEffect, useState } from 'react';
import { Card, Container, ListGroup, Badge } from 'react-bootstrap';
import api from "@/services/api"; // Axios wrapper

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
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchActivities();
  }, []);

  const fetchActivities = async () => {
    try {
        const { data } = await api.get('/api/activities');
        setActivities(data.data || []);
      } catch (error) {
        console.error('Error fetching activities:', error);
      } finally {
        setLoading(false);
      }
  }

  const capitalize = (s) => (typeof s === 'string' && s.length) ? s.charAt(0).toUpperCase() + s.slice(1) : s;

  return (
    <Container fluid>
      <h3 className="fw-bold mb-4">Activity Timeline</h3>

      <Card>
        <ListGroup variant="flush">
          {loading ? (
            <ListGroup.Item>Loading activities...</ListGroup.Item>
          ) : activities.length === 0 ? (
            <ListGroup.Item>No activities yet.</ListGroup.Item>
          ) : (
            activities.map((activity) => (
              <ListGroup.Item key={activity.id}>
                <div className="d-flex justify-content-between align-items-start">
                  <div>
                    <h6 className="mb-1">
                      <Badge bg="success" className="me-2">
                        {capitalize(activity.object_type)}
                      </Badge>
                      {activity.description}
                    </h6>
                    <small className="text-muted">
                      {new Date(activity.occurred_at).toLocaleString('en-US', {
                        dateStyle: 'medium',
                        timeStyle: 'short'
                      })}
                    </small>
                  </div>
                </div>
              </ListGroup.Item>
            ))
          )}
        </ListGroup>
      </Card>
    </Container>
  );
}
