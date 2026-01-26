import React, { useEffect, useState } from "react";
import axios from "axios";
import { Table, Button, Modal, Container, Alert } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

const AdminDashboard = () => {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");

  useEffect(() => {
    if (!token || role !== "admin") {
      navigate("/");
      return;
    }
    fetchUsers();
    // eslint-disable-next-line
  }, [token, role]);

  const fetchUsers = async () => {
    try {
      const res = await axios.get(`${BACKEND_URL}/admin/users`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUsers(res.data.users);
    } catch (err) {
      setError("Failed to fetch users");
      console.error(err);
    }
  };

  const handleShowDetails = async (id) => {
    try {
      const res = await axios.get(`${BACKEND_URL}/admin/users/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setSelectedUser(res.data.user);
      setShowModal(true);
    } catch (err) {
      console.error(err);
      alert("Failed to fetch user details");
    }
  };

  const handleDeleteUser = async (id) => {
    if (window.confirm("Are you sure you want to delete this user? This action cannot be undone.")) {
      try {
        await axios.delete(`${BACKEND_URL}/admin/users/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUsers(users.filter((user) => user._id !== id));
      } catch (err) {
        console.error(err);
        alert("Failed to delete user");
      }
    }
  };

  const handleLogout = () => {
      localStorage.clear();
      navigate("/");
  }

  return (
    <Container className="py-5">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Admin Dashboard</h2>
        <Button variant="danger" onClick={handleLogout}>Logout</Button>
      </div>
      
      {error && <Alert variant="danger">{error}</Alert>}

      <Table striped bordered hover responsive>
        <thead>
          <tr>
            <th>#</th>
            <th>Username</th>
            <th>Email</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user, index) => (
            <tr key={user._id}>
              <td>{index + 1}</td>
              <td>{user.userName}</td>
              <td>{user.email}</td>
              <td>
                <Button
                  size="sm"
                  className="btn btn-primary"
                  onClick={() => handleShowDetails(user._id)}
                >
                  View Details
                </Button>
                <Button
                  variant="danger"
                  size="sm"
                  className="ms-2"
                  onClick={() => handleDeleteUser(user._id)}
                >
                  Delete
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      {/* User Details Modal */}
      <Modal show={showModal} onHide={() => setShowModal(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>User Details</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedUser && (
            <div>
              <p><strong>First Name:</strong> {selectedUser.fname}</p>
              <p><strong>Last Name:</strong> {selectedUser.lname}</p>
              <p><strong>Username:</strong> {selectedUser.userName}</p>
              <p><strong>Email:</strong> {selectedUser.email}</p>
              <p><strong>DOB:</strong> {new Date(selectedUser.dob).toLocaleDateString()}</p>
              <p><strong>Gender:</strong> {selectedUser.gender}</p>
              <p><strong>Mobile:</strong> {selectedUser.mobile}</p>
              <p><strong>City:</strong> {selectedUser.city}</p>
              <p><strong>District:</strong> {selectedUser.district}</p>
              <p><strong>Google ID:</strong> {selectedUser.googleId || "N/A"}</p>
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default AdminDashboard;
