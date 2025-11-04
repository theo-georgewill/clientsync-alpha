import { useState, useEffect, useMemo, useRef, useCallback } from "react";
import { Table, Button, Form, Modal, Spinner } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { fetchContacts, createContact, clearStatus } from "@/store/slices/contactSlice";

export default function Contacts() {
  const dispatch = useDispatch();
  const { contacts, loading, error, success, page, hasMore } = useSelector(
    (state) => state.contacts
  );

  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({
    firstname: "",
    lastname: "",
    email: "",
    phone: "",
  });

  // ✅ Fetch first page on mount
  useEffect(() => {
    dispatch(fetchContacts(1));
  }, [dispatch]);

  // ✅ Reset success/error after creation
  useEffect(() => {
    if (success || error) {
      const timeout = setTimeout(() => dispatch(clearStatus()), 3000);
      return () => clearTimeout(timeout);
    }
  }, [success, error, dispatch]);

  // ✅ Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(createContact(form))
      .unwrap()
      .then(() => {
        setShowModal(false);
        setForm({ firstname: "", lastname: "", email: "", phone: "" });
      })
      .catch(() => {});
  };

  // ✅ Infinite scroll observer
  const observer = useRef();
  const lastContactRef = useCallback(
    (node) => {
      if (loading) return;
      if (observer.current) observer.current.disconnect();

      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore) {
          dispatch(fetchContacts(page + 1));
        }
      });

      if (node) observer.current.observe(node);
    },
    [loading, hasMore, page, dispatch]
  );

  // ✅ Filter contacts by search term
  const filteredContacts = useMemo(() => {
    if (!contacts) return [];
    return contacts.filter(
      (c) =>
        c.firstname?.toLowerCase().includes(search.toLowerCase()) ||
        c.lastname?.toLowerCase().includes(search.toLowerCase()) ||
        c.email?.toLowerCase().includes(search.toLowerCase())
    );
  }, [contacts, search]);

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h3>Contacts</h3>
        <Button onClick={() => setShowModal(true)} variant="primary">
          + Add Contact
        </Button>
      </div>

      <Form.Control
        type="text"
        placeholder="Search contacts..."
        className="mb-3"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      <Table hover responsive>
        <thead>
          <tr>
            <th>First name</th>
            <th>Last name</th>
            <th>Email</th>
            <th>Phone</th>
          </tr>
        </thead>
        <tbody>
          {filteredContacts.length > 0 ? (
            filteredContacts.map((contact, index) => {
              const isLast = index === filteredContacts.length - 1;
              return (
                <tr
                  key={contact.id || contact.contact_id}
                  ref={isLast ? lastContactRef : null}
                >
                  <td>{contact.firstname}</td>
                  <td>{contact.lastname}</td>
                  <td>{contact.email}</td>
                  <td>{contact.phone}</td>
                </tr>
              );
            })
          ) : (
            <tr>
              <td colSpan="4" className="text-center text-muted">
                No contacts found
              </td>
            </tr>
          )}
        </tbody>
      </Table>

      {/* ✅ Loading indicator for pagination */}
      {loading && (
        <div className="text-center py-3">
          <Spinner animation="border" size="sm" /> Loading more...
        </div>
      )}

      {/* ✅ Create Contact Modal */}
      <Modal show={showModal} onHide={() => setShowModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Create New Contact</Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleSubmit}>
          <Modal.Body>
            <Form.Group className="mb-3">
              <Form.Label>First Name</Form.Label>
              <Form.Control
                type="text"
                value={form.firstname}
                onChange={(e) =>
                  setForm({ ...form, firstname: e.target.value })
                }
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Last Name</Form.Label>
              <Form.Control
                type="text"
                value={form.lastname}
                onChange={(e) =>
                  setForm({ ...form, lastname: e.target.value })
                }
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                required
              />
            </Form.Group>
            <Form.Group>
              <Form.Label>Phone</Form.Label>
              <Form.Control
                type="text"
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
              />
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowModal(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" disabled={loading}>
              {loading ? "Creating..." : "Create Contact"}
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </div>
  );
}
