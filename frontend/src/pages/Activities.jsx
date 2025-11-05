import { useEffect, useState } from 'react';
import { Card, Container, ListGroup, Badge, Spinner } from 'react-bootstrap';
import api from "@/services/api"; // Axios wrapper

export default function Activities({ limit }) {
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
  };

  const capitalize = (s) =>
    typeof s === 'string' && s.length ? s.charAt(0).toUpperCase() + s.slice(1) : s;

  // Show only 'limit' activities if specified
  const displayedActivities = limit ? activities.slice(0, limit) : activities;

  return (
    <Container fluid className="p-0">
      {/* Only show title if full page */}
      {!limit && <h3 className="fw-bold mb-4">Activity Timeline</h3>}

      <Card className="shadow-sm border-0">
        <ListGroup variant="flush">
          {loading ? (
            <ListGroup.Item className="text-center py-4">
              <Spinner animation="border" size="sm" className="me-2" />
              Loading activities...
            </ListGroup.Item>
          ) : displayedActivities.length === 0 ? (
            <ListGroup.Item className="text-center py-4 text-muted">
              No activities yet.
            </ListGroup.Item>
          ) : (
            displayedActivities.map((activity) => (
              <ListGroup.Item key={activity.id} className="py-3">
                <div className="d-flex justify-content-between align-items-start flex-wrap">
                  <div>
                    <h6 className="mb-1 fw-semibold text-break">
                      <Badge bg="success" className="me-2">
                        {capitalize(activity.object_type)}
                      </Badge>
                      {activity.description}
                    </h6>
                    <small className="text-muted">
                      {new Date(activity.occurred_at).toLocaleString('en-US', {
                        dateStyle: 'medium',
                        timeStyle: 'short',
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
