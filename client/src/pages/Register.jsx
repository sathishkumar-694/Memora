import React, { useState } from "react";
import { Container, Row, Col, Form, Button } from "react-bootstrap";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

const Register = () => {
  const navigate = useNavigate()
  const [form, setForm] = useState({
    fname: "",
    lname: "",
    userName: "",
    email: "",
    password: "",
    dob: "",
    gender: "",
    mobile: "",
    city: "",
    district: "",
    agree: false,
  });

  const [msg, setMsg] = useState("");
  const [isError, setIsError] = useState(false);

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(
        `${BACKEND_URL}/auth/register`,
        form
      );
      setMsg(res.data.message);
      setIsError(false);
      navigate("/login");
    } catch (error) {
      setMsg(
        error?.response?.data?.message || "Signup failed"
      );
      setIsError(true);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm({
      ...form,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  return (
    <Container className="d-flex justify-content-center mt-5">
      <Col md={6} lg={5}>
        <h3 className="mb-3 text-center">Register</h3>

        <Form onSubmit={handleRegister}>
          <Row className="mb-2">
            <Col>
              <Form.Control name="fname" placeholder="First name" onChange={handleChange} />
            </Col>
            <Col>
              <Form.Control name="lname" placeholder="Last name" onChange={handleChange} />
            </Col>
          </Row>

          <Form.Control className="mb-2" name="userName" placeholder="Username" onChange={handleChange} />
          <Form.Control className="mb-2" type="email" name="email" placeholder="Email" onChange={handleChange} />
          <Form.Control className="mb-2" type="password" name="password" placeholder="Password" onChange={handleChange} />

          <Row className="mb-2 align-items-center">
            <Col>
              <Form.Control type="date" name="dob" onChange={handleChange} />
            </Col>
            <Col className="d-flex align-items-center">
              <span className="me-2 fw-semibold">Gender:</span>
              <Form.Check inline label="Male" type="radio" name="gender" value="male" onChange={handleChange} />
              <Form.Check inline label="Female" type="radio" name="gender" value="female" onChange={handleChange} />
            </Col>
          </Row>

          <Form.Control className="mb-2" name="mobile" placeholder="Mobile" onChange={handleChange} />

          <Row className="mb-2">
            <Col>
              <Form.Control name="city" placeholder="City" onChange={handleChange} />
            </Col>
            <Col>
              <Form.Control name="district" placeholder="District" onChange={handleChange} />
            </Col>
          </Row>

          <Form.Check
            className="mb-3"
            name="agree"
            label="I agree to terms"
            onChange={handleChange}
          />

          <Button
            type="submit"
            className="w-100"
            variant="primary"
            disabled={!form.agree}
          >
            Register
          </Button>
          <div className="text-center">
                <small>
                  Already have an account?{" "}
                  <Link to="/">Login</Link>
                </small>
              </div>

          {msg && (
            <p className={`mt-3 text-center ${isError ? "text-danger" : "text-success"}`}>
              {msg}
            </p>
          )}
        </Form>
      </Col>
    </Container>
  );
};

export default Register;
