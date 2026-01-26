import React, { useEffect, useState } from "react";
import { Container, Card, Button, Form, Row, Col, Alert, Spinner } from "react-bootstrap";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

const Profile = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isEditing, setIsEditing] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    fname: "",
    lname: "",
    dob: "",
    gender: "",
    mobile: "",
    city: "",
    district: "",
  });

  useEffect(() => {
    if (!token) {
      navigate("/login");
      return;
    }
    fetchProfile();
    // eslint-disable-next-line
  }, [token]);

  const fetchProfile = async () => {
    try {
      const res = await axios.get(`${BACKEND_URL}/auth/profile`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUser(res.data.user);
      setFormData({
        fname: res.data.user.fname || "",
        lname: res.data.user.lname || "",
        dob: res.data.user.dob ? res.data.user.dob.split("T")[0] : "",
        gender: res.data.user.gender || "",
        mobile: res.data.user.mobile || "",
        city: res.data.user.city || "",
        district: res.data.user.district || "",
      });
      setLoading(false);
    } catch (err) {
      console.error(err);
      setError("Failed to fetch profile");
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    try {
      const res = await axios.put(`${BACKEND_URL}/auth/profile`, formData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUser(res.data.user);
      setSuccess(res.data.message);
      setIsEditing(false);
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "Failed to update profile");
    }
  };

  if (loading) {
    return (
      <Container className="d-flex justify-content-center align-items-center vh-100">
        <Spinner animation="border" variant="primary" />
      </Container>
    );
  }

  return (
    <Container className="py-5">
      <Row className="justify-content-center">
        <Col md={8} lg={6}>
          <Card className="shadow-lg">
            <Card.Header className="bg-primary text-white text-center">
              <h3>My Profile</h3>
            </Card.Header>
            <Card.Body className="p-4">
              {error && <Alert variant="danger" dismissible onClose={() => setError("")}>{error}</Alert>}
              {success && <Alert variant="success" dismissible onClose={() => setSuccess("")}>{success}</Alert>}

              {!isEditing ? (
                // VIEW MODE
                <div>
                  <div className="text-center mb-4">
                    <div 
                      className="rounded-circle bg-secondary d-flex align-items-center justify-content-center mx-auto mb-3"
                      style={{ width: "80px", height: "80px", color: "white", fontSize: "2rem" }}
                    >
                      {user?.fname?.charAt(0).toUpperCase()}
                    </div>
                    <h4>{user?.fname} {user?.lname}</h4>
                    <p className="text-muted">@{user?.userName}</p>
                  </div>

                  <Row className="mb-3">
                    <Col xs={4} className="fw-bold">Email:</Col>
                    <Col xs={8}>{user?.email}</Col>
                  </Row>
                  <Row className="mb-3">
                    <Col xs={4} className="fw-bold">Mobile:</Col>
                    <Col xs={8}>{user?.mobile || "N/A"}</Col>
                  </Row>
                  <Row className="mb-3">
                    <Col xs={4} className="fw-bold">Gender:</Col>
                    <Col xs={8}>{user?.gender || "N/A"}</Col>
                  </Row>
                  <Row className="mb-3">
                    <Col xs={4} className="fw-bold">DOB:</Col>
                    <Col xs={8}>{user?.dob ? new Date(user.dob).toLocaleDateString() : "N/A"}</Col>
                  </Row>
                  <Row className="mb-3">
                    <Col xs={4} className="fw-bold">City:</Col>
                    <Col xs={8}>{user?.city || "N/A"}</Col>
                  </Row>
                  <Row className="mb-3">
                    <Col xs={4} className="fw-bold">District:</Col>
                    <Col xs={8}>{user?.district || "N/A"}</Col>
                  </Row>

                  <div className="d-grid mt-4">
                    <Button variant="outline-primary" onClick={() => setIsEditing(true)}>
                      Edit Profile
                    </Button>
                  </div>
                  <div className="text-center mt-3">
                    <Button variant="link" onClick={() => navigate("/notes")}>
                      Back to Notes
                    </Button>
                  </div>
                </div>
              ) : (
                // EDIT MODE
                <Form onSubmit={handleUpdate}>
                  <Row className="mb-3">
                    <Col>
                      <Form.Group>
                        <Form.Label>First Name</Form.Label>
                        <Form.Control 
                          name="fname" 
                          value={formData.fname} 
                          onChange={handleChange} 
                        />
                      </Form.Group>
                    </Col>
                    <Col>
                      <Form.Group>
                        <Form.Label>Last Name</Form.Label>
                        <Form.Control 
                          name="lname" 
                          value={formData.lname} 
                          onChange={handleChange} 
                        />
                      </Form.Group>
                    </Col>
                  </Row>

                  <Form.Group className="mb-3">
                    <Form.Label>Mobile</Form.Label>
                    <Form.Control 
                      name="mobile" 
                      value={formData.mobile} 
                      onChange={handleChange} 
                    />
                  </Form.Group>

                  <Row className="mb-3">
                    <Col>
                      <Form.Group>
                        <Form.Label>Date of Birth</Form.Label>
                        <Form.Control 
                          type="date" 
                          name="dob" 
                          value={formData.dob} 
                          onChange={handleChange} 
                        />
                      </Form.Group>
                    </Col>
                    <Col>
                      <Form.Group>
                        <Form.Label>Gender</Form.Label>
                        <Form.Select name="gender" value={formData.gender} onChange={handleChange}>
                          <option value="">Select</option>
                          <option value="male">Male</option>
                          <option value="female">Female</option>
                          <option value="other">Other</option>
                        </Form.Select>
                      </Form.Group>
                    </Col>
                  </Row>

                  <Row className="mb-3">
                    <Col>
                      <Form.Group>
                        <Form.Label>City</Form.Label>
                        <Form.Control 
                          name="city" 
                          value={formData.city} 
                          onChange={handleChange} 
                        />
                      </Form.Group>
                    </Col>
                    <Col>
                      <Form.Group>
                        <Form.Label>District</Form.Label>
                        <Form.Control 
                          name="district" 
                          value={formData.district} 
                          onChange={handleChange} 
                        />
                      </Form.Group>
                    </Col>
                  </Row>

                  <div className="d-grid gap-2">
                    <Button variant="primary" type="submit">
                      Save Changes
                    </Button>
                    <Button variant="secondary" onClick={() => setIsEditing(false)}>
                      Cancel
                    </Button>
                  </div>
                </Form>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Profile;
