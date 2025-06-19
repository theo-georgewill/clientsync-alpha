import { useState } from 'react';
import { Table, Button, Form, InputGroup } from 'react-bootstrap';

const dummyContacts = [
  { id: 1, name: 'Jane Doe', email: 'jane@example.com', status: 'Lead', lastActivity: '2 days ago' },
  { id: 2, name: 'John Smith', email: 'john@company.com', status: 'Customer', lastActivity: 'Yesterday' },
  { id: 3, name: 'Sarah Lee', email: 'sarah@brand.com', status: 'Prospect', lastActivity: '1 week ago' }
];

export default function Contacts() {
  const [contacts, setContacts] = useState(dummyContacts);
  const [search, setSearch] = useState('');

  const filtered = contacts.filter(contact =>
    contact.name.toLowerCase().includes(search.toLowerCase()) ||
    contact.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h3>Contacts</h3>
        <Button variant="primary">+ Add Contact</Button>
      </div>

      <InputGroup className="mb-3">
        <Form.Control
          placeholder="Search contacts..."
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
      </InputGroup>

      <Table hover responsive>
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Status</th>
            <th>Last Activity</th>
          </tr>
        </thead>
        <tbody>
          {filtered.map(contact => (
            <tr key={contact.id}>
              <td>{contact.name}</td>
              <td>{contact.email}</td>
              <td>{contact.status}</td>
              <td>{contact.lastActivity}</td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
}
