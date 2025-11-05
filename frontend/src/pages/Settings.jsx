// src/pages/Settings.jsx
import { useEffect, useState } from 'react';
import { Container, Card, Form, Button, Row, Col, Spinner } from 'react-bootstrap';
import api from '@/services/api'; // Axios wrapper

export default function Settings() {
  const [profile, setProfile] = useState({
    fullName: '',
    email: '',
  });

  const [passwords, setPasswords] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const [loadingProfile, setLoadingProfile] = useState(true);
  const [savingProfile, setSavingProfile] = useState(false);
  const [updatingPassword, setUpdatingPassword] = useState(false);
  const [syncing, setSyncing] = useState(false);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const { data } = await api.get('/api/user');
      setProfile({
        fullName: data.name || '',
        email: data.email || '',
      });
    } catch (err) {
      console.error('Failed to fetch profile:', err);
    } finally {
      setLoadingProfile(false);
    }
  };

  const handleProfileChange = (e) => {
    const { name, value } = e.target;
    setProfile((prev) => ({ ...prev, [name]: value }));
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswords((prev) => ({ ...prev, [name]: value }));
  };

  const updateProfile = async () => {
    setSavingProfile(true);
    try {
      await api.patch('/api/user', profile);
      alert('Profile updated successfully!');
    } catch (err) {
      console.error('Failed to update profile:', err);
      alert('Failed to update profile.');
    } finally {
      setSavingProfile(false);
    }
  };

  const updatePassword = async () => {
    if (passwords.newPassword !== passwords.confirmPassword) {
      alert('New password and confirm password do not match.');
      return;
    }

    setUpdatingPassword(true);
    try {
      await api.patch('/api/user/password', {
        currentPassword: passwords.currentPassword,
        newPassword: passwords.newPassword,
      });
      alert('Password updated successfully!');
      setPasswords({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (err) {
      console.error('Failed to update password:', err);
      alert('Failed to update password.');
    } finally {
      setUpdatingPassword(false);
    }
  };

  const handleSync = async () => {
    setSyncing(true);
    try {
      await api.post('/api/sync');
      alert('Sync completed successfully!');
    } catch (err) {
      console.error('Sync failed:', err);
      alert('Sync failed.');
    } finally {
      setSyncing(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (!confirm('Are you sure you want to delete your account?')) return;
    try {
      await api.delete('/api/user');
      alert('Account deleted.');
      window.location.href = '/login';
    } catch (err) {
      console.error('Delete failed:', err);
      alert('Failed to delete account.');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    window.location.href = '/login';
  };

  if (loadingProfile) return <Container>Loading settings...</Container>;

  return (
    <Container fluid>
      <h3 className="fw-bold mb-4">Settings</h3>

      {/* Profile Section */}
      <Card className="mb-4">
        <Card.Header>Profile</Card.Header>
        <Card.Body>
          <Form>
            <Row className="mb-3">
              <Col md={6}>
                <Form.Group>
                  <Form.Label>Full Name</Form.Label>
                  <Form.Control
                    type="text"
                    name="fullName"
                    value={profile.fullName}
                    onChange={handleProfileChange}
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group>
                  <Form.Label>Email Address</Form.Label>
                  <Form.Control
                    type="email"
                    name="email"
                    value={profile.email}
                    onChange={handleProfileChange}
                  />
                </Form.Group>
              </Col>
            </Row>
            <Button variant="primary" onClick={updateProfile} disabled={savingProfile}>
              {savingProfile ? <Spinner animation="border" size="sm" className="me-2" /> : <i className="bi bi-person-check me-2"></i>}
              Update Profile
            </Button>
          </Form>
        </Card.Body>
      </Card>

      {/* Update Password Section */}
      <Card className="mb-4">
        <Card.Header>Update Password</Card.Header>
        <Card.Body>
          <Form>
            <Row className="mb-3">
              <Col md={4}>
                <Form.Group>
                  <Form.Label>Current Password</Form.Label>
                  <Form.Control
                    type="password"
                    name="currentPassword"
                    value={passwords.currentPassword}
                    onChange={handlePasswordChange}
                  />
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group>
                  <Form.Label>New Password</Form.Label>
                  <Form.Control
                    type="password"
                    name="newPassword"
                    value={passwords.newPassword}
                    onChange={handlePasswordChange}
                  />
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group>
                  <Form.Label>Confirm New Password</Form.Label>
                  <Form.Control
                    type="password"
                    name="confirmPassword"
                    value={passwords.confirmPassword}
                    onChange={handlePasswordChange}
                  />
                </Form.Group>
              </Col>
            </Row>
            <Button variant="primary" onClick={updatePassword} disabled={updatingPassword}>
              {updatingPassword ? <Spinner animation="border" size="sm" className="me-2" /> : <i className="bi bi-lock-fill me-2"></i>}
              Update Password
            </Button>
          </Form>
        </Card.Body>
      </Card>

      {/* Account Actions */}
      <Card>
        <Card.Header>Account</Card.Header>
        <Card.Body className="d-flex flex-wrap gap-2">
          <Button variant="outline-primary" onClick={handleSync} disabled={syncing}>
            {syncing ? <Spinner animation="border" size="sm" className="me-2" /> : <i className="bi bi-arrow-repeat me-2"></i>}
            Sync Now
          </Button>
          <Button variant="outline-danger" onClick={handleDeleteAccount}>
            <i className="bi bi-trash me-2"></i> Delete Account
          </Button>
          <Button variant="outline-secondary" onClick={handleLogout}>
            <i className="bi bi-box-arrow-right me-2"></i> Log Out
          </Button>
        </Card.Body>
      </Card>
    </Container>
  );
}
