import { useEffect, useState } from 'react';
import { Container, Card, Button, Row, Col, Badge, Spinner } from 'react-bootstrap';
import api from '@/services/api'; 

export default function Integrations() {
  const [loading, setLoading] = useState(true);
  const [isConnected, setIsConnected] = useState(false);
  const [lastSynced, setLastSynced] = useState(null);
  const [scopes, setScopes] = useState([]);

  useEffect(() => {
    // Fetch connection status from your Laravel backend
    api.get('/api/hubspot/status')
      .then(res => {
        setIsConnected(res.data.connected);
        setLastSynced(res.data.last_synced);
        setScopes(res.data.scopes || []);
      })
      .catch(() => {
        setIsConnected(false);
      })
      .finally(() => setLoading(false));
  }, []);

  const handleConnect = async () => {
    try {
      const res = await api.get('/api/hubspot/auth-url');
      window.location.href = res.data.url;
    } catch (err) {
      alert('Failed to get HubSpot connect URL.');
    }
  };

  const handleDisconnect = async () => {
    try {
      await api.post('/api/hubspot/disconnect');
      setIsConnected(false);
      setLastSynced(null);
      setScopes([]);
    } catch (err) {
      alert('Failed to disconnect HubSpot.');
    }
  };

  if (loading) {
    return (
      <Container className="py-5 text-center">
        <Spinner animation="border" />
      </Container>
    );
  }

  return (
    <Container fluid>
      <h3 className="fw-bold mb-4">Integrations</h3>

      <Card>
        <Card.Header className="d-flex justify-content-between align-items-center">
          <div>
            <strong>HubSpot</strong> Integration
            <br />
            <small className="text-muted">Connect to sync contacts, deals, and activities.</small>
          </div>
          <div>
            <Badge bg={isConnected ? 'success' : 'danger'}>
              {isConnected ? 'Connected' : 'Not Connected'}
            </Badge>
          </div>
        </Card.Header>

        <Card.Body>
          {isConnected ? (
            <>
              <Row className="mb-3">
                <Col md={6}>
                  <p><strong>Last Synced:</strong> {lastSynced}</p>
                </Col>
                <Col md={6}>
                  <p>
                    <strong>Scopes:</strong>{' '}
                    {scopes.length > 0 ? (
                      scopes.map(scope => (
                        <Badge key={scope} bg="secondary" className="me-2">{scope}</Badge>
                      ))
                    ) : (
                      <span className="text-muted">No scopes stored</span>
                    )}
                  </p>
                </Col>
              </Row>

              <Button variant="outline-danger" onClick={handleDisconnect}>
                Disconnect HubSpot
              </Button>
            </>
          ) : (
            <Button variant="primary" onClick={handleConnect}>
              Connect to HubSpot
            </Button>
          )}
        </Card.Body>
      </Card>
    </Container>
  );
}
