// src/pages/Dashboard.jsx
import React, { useEffect } from 'react';
import { Card, Button } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { fetchContacts } from '@/store/slices/contactSlice';
import { fetchDeals } from '@/store/slices/dealSlice'; // make sure this exists
import Activities from '@/pages/Activities';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { contacts, loading: contactsLoading } = useSelector((state) => state.contacts);
  const { deals, loading: dealsLoading } = useSelector((state) => state.deals);

  useEffect(() => {
    dispatch(fetchContacts());
    dispatch(fetchDeals());
  }, [dispatch]);

  const contactCount = contacts?.length || 0;
  const dealCount = deals?.length || 0;

  return (
    <div className="container-fluid py-4">
      {/* Stats Row */}
      <div className="row g-4 mb-4">
        <div className="col-md-4">
          <Card className="shadow-sm border-0">
            <Card.Body>
              <Card.Title className="fw-semibold">Connected Accounts</Card.Title>
              <Card.Text>1 HubSpot account connected</Card.Text>
              <Button variant="primary" size="sm" onClick={() => navigate('/integrations')}>
                Manage
              </Button>
            </Card.Body>
          </Card>
        </div>

        <div className="col-md-4">
          <Card className="shadow-sm border-0">
            <Card.Body>
              <Card.Title className="fw-semibold">Deals</Card.Title>
              <Card.Text>
                {dealsLoading ? 'Loading...' : `${dealCount} active deals`}
              </Card.Text>
              <Button variant="success" size="sm" onClick={() => navigate('/deals')}>
                View Deals
              </Button>
            </Card.Body>
          </Card>
        </div>

        <div className="col-md-4">
          <Card className="shadow-sm border-0">
            <Card.Body>
              <Card.Title className="fw-semibold">Contacts</Card.Title>
              <Card.Text>
                {contactsLoading ? 'Loading...' : `${contactCount} synced contacts`}
              </Card.Text>
              <Button variant="info" size="sm" onClick={() => navigate('/contacts')}>
                View Contacts
              </Button>
            </Card.Body>
          </Card>
        </div>
      </div>

      {/* Recent Activity Section */}
      <Card className="shadow-sm border-0">
        <Card.Body>
          <Card.Title className="fw-semibold text-secondary mb-3">Recent Activity</Card.Title>
          <Activities limit={5} /> {/* We’ll handle limit in the component */}
        </Card.Body>
      </Card>
    </div>
  );
};

export default Dashboard;
