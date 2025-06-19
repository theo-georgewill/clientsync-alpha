import { Container, Card, Form, Button, Row, Col } from 'react-bootstrap';

export default function Settings() {
  return (
    <Container fluid>
      <h3 className="fw-bold mb-4">Settings</h3>

      {/* User Profile Section */}
      <Card className="mb-4">
        <Card.Header>Profile</Card.Header>
        <Card.Body>
          <Form>
            <Row className="mb-3">
              <Col md={6}>
                <Form.Group>
                  <Form.Label>Full Name</Form.Label>
                  <Form.Control type="text" value="Ted Georgewill" />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group>
                  <Form.Label>Email Address</Form.Label>
                  <Form.Control type="email" value="ted@example.com" />
                </Form.Group>
              </Col>
            </Row>
            <Button variant="primary">Update Profile</Button>
          </Form>
        </Card.Body>
      </Card>

      {/* Preferences Section */}
      <Card className="mb-4">
        <Card.Header>Preferences</Card.Header>
        <Card.Body>
          <Form>
            <Row className="mb-3">
              <Col md={6}>
                <Form.Group>
                  <Form.Label>Timezone</Form.Label>
                  <Form.Select>
                    <option>UTC +01:00 (West Africa Time)</option>
                    <option>UTC +00:00 (GMT)</option>
                    <option>UTC -05:00 (Eastern Time)</option>
                  </Form.Select>
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group>
                  <Form.Label>Notifications</Form.Label>
                  <Form.Check type="switch" label="Enable Email Notifications" defaultChecked />
                </Form.Group>
              </Col>
            </Row>
            <Button variant="primary">Save Preferences</Button>
          </Form>
        </Card.Body>
      </Card>

      {/* API / Account Actions */}
      <Card>
        <Card.Header>Account</Card.Header>
        <Card.Body>
          <Button variant="outline-danger" className="me-3">
            Delete Account
          </Button>
          <Button variant="outline-secondary">Log Out</Button>
        </Card.Body>
      </Card>
    </Container>
  );
}
