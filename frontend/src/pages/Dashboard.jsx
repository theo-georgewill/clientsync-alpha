// src/pages/Dashboard.jsx
import React from 'react';
import { Card, Button } from 'react-bootstrap';

const Dashboard = () => {
  return (
    <div className="container-full">
      <h2 className="mb-4">Dashboard</h2>

      {/* Stats Row */}
      <div className="row mb-4">
        <div className="col-md-4">
          <Card className="shadow-sm">
            <Card.Body>
              <Card.Title>Connected Accounts</Card.Title>
              <Card.Text>2 HubSpot accounts connected</Card.Text>
              <Button variant="primary" size="sm">Manage</Button>
            </Card.Body>
          </Card>
        </div>

        <div className="col-md-4">
          <Card className="shadow-sm">
            <Card.Body>
              <Card.Title>Workflows</Card.Title>
              <Card.Text>5 active workflows</Card.Text>
              <Button variant="success" size="sm">View</Button>
            </Card.Body>
          </Card>
        </div>

        <div className="col-md-4">
          <Card className="shadow-sm">
            <Card.Body>
              <Card.Title>Sync Logs</Card.Title>
              <Card.Text>128 API syncs in the last 24 hours</Card.Text>
              <Button variant="info" size="sm">See Logs</Button>
            </Card.Body>
          </Card>
        </div>
      </div>

      {/* Activity or Placeholder */}
      <Card className="shadow-sm">
        <Card.Body>
          <Card.Title>Recent Activity</Card.Title>
          <Card.Text>No recent activity. Start by connecting a HubSpot account.</Card.Text>
        </Card.Body>
      </Card>
    </div>
  );
};

export default Dashboard;
