import React, { useState, useEffect } from "react";
import axios from "axios";
import Note from "../components/Note";
import { Container, Row, Col, Form, Button, Spinner, Alert, Modal } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

const Notes = () => {
  const [notes, setNotes] = useState([]);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [editId, setEditId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const userName = localStorage.getItem("userName") || "User";

  useEffect(() => {
    if (!token) {
      navigate("/login");
      return;
    }
    fetchNotes();
    // eslint-disable-next-line
  }, [token]);

  const fetchNotes = async () => {
    try {
      const res = await axios.get(`${BACKEND_URL}/notes`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setNotes(res.data.notes);
      setLoading(false);
    } catch (err) {
      console.error(err);
      setError("Failed to fetch notes");
      setLoading(false);
    }
  };

  const handleAddOrUpdate = async (e) => {
    e.preventDefault();
    if (!title && !content) return alert("Please add some content");

    try {
      const config = { headers: { Authorization: `Bearer ${token}` } };
      
      if (editId) {
        // UPDATE
        const res = await axios.put(
          `${BACKEND_URL}/notes/${editId}`,
          { title, content },
          config
        );
        setNotes(
          notes.map((note) => (note._id === editId ? res.data.note : note))
        );
      } else {
        // CREATE
        const res = await axios.post(
          `${BACKEND_URL}/notes`,
          { title: title || "Untitled", content, status: "active" },
          config
        );
        setNotes([...notes, res.data.note]);
      }

      handleCloseModal();
    } catch (err) {
      console.error(err);
      setError("Failed to save note");
    }
  };

  const handleDelete = async (id) => {
    if(!window.confirm("Are you sure you want to delete this note?")) return;
    try {
      await axios.delete(`${BACKEND_URL}/notes/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setNotes(notes.filter((note) => note._id !== id));
    } catch (err) {
      console.error(err);
      setError("Failed to delete note");
    }
  };

  const handleEdit = (note) => {
    setEditId(note._id);
    setTitle(note.title);
    setContent(note.content);
    setShowModal(true);
  };

  const toggleStatus = async (id, currentStatus) => {
    try {
      const newStatus = currentStatus === "active" ? "completed" : "active";
      const res = await axios.put(
        `${BACKEND_URL}/notes/${id}`,
        { status: newStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setNotes(
        notes.map((note) => (note._id === id ? res.data.note : note))
      );
    } catch (err) {
      console.error(err);
      setError("Failed to update status");
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditId(null);
    setTitle("");
    setContent("");
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  if (loading) {
    return (
      <Container className="d-flex justify-content-center align-items-center vh-100">
        <Spinner animation="border" variant="primary" />
      </Container>
    );
  }

  return (
    <Container className="py-4">
      {/* Header */}
      <div 
        className="d-flex justify-content-between align-items-center mb-0 p-3 bg-white border-bottom"
        style={{ position: 'sticky', top: 0, zIndex: 1000 }}
      >
        <h4 className="mb-0 text-dark">Welcome, {userName}</h4>
        <Button variant="danger" size="sm" onClick={handleLogout}>Logout</Button>
      </div>

      {/* Add Button Area */}
      <div className="d-flex justify-content-end mt-3 mb-4 pe-3">
           <Button 
            variant="primary" 
            onClick={() => setShowModal(true)}
           >
             Add Notes
           </Button>
      </div>

      {error && <Alert variant="danger" onClose={() => setError(null)} dismissible>{error}</Alert>}

      {/* Notes Grid */}
      <Row xs={1} md={2} lg={3} className="g-4">
        {notes.length > 0 ? (
          notes.map((note) => (
            <Col key={note._id}>
              <Note
                note={note}
                onDelete={handleDelete}
                onEdit={handleEdit}
                onToggle={toggleStatus}
              />
            </Col>
          ))
        ) : (
          <Col className="w-100 text-center text-muted mt-5">
            <div style={{ fontSize: "3rem", opacity: 0.2 }}>📝</div>
            <p className="mt-2">No notes yet.</p>
          </Col>
        )}
      </Row>

      {/* Add/Edit Modal */}
      <Modal show={showModal} onHide={handleCloseModal} centered>
        <Modal.Header closeButton>
          <Modal.Title>{editId ? "Edit Note" : "Add Note"}</Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleAddOrUpdate}>
          <Modal.Body>
            <Form.Group className="mb-3">
              <Form.Label>Title</Form.Label>
              <Form.Control
                type="text"
                placeholder="Title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Content</Form.Label>
              <Form.Control
                as="textarea"
                rows={5}
                placeholder="Write something..."
                value={content}
                onChange={(e) => setContent(e.target.value)}
                required
              />
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleCloseModal}>
              Cancel
            </Button>
            <Button variant="primary" type="submit">
              {editId ? "Update" : "Save"}
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>

    </Container>
  );
};

export default Notes;
