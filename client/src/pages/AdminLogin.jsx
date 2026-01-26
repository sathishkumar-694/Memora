import React, { useState } from "react";
import { Button, Form, Card, Alert } from "react-bootstrap";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

const AdminLogin = () => {
  const [form, setForm] = useState({ userName: "", password: "" });
  const [msg, setMsg] = useState("");
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      if (!form.userName || !form.password) {
        alert("All fields are required");
        return;
      }
      const res = await axios.post(`${BACKEND_URL}/admin/login`, form);
      
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("role", "admin");
      
      navigate("/admin");
    } catch (error) {
      setMsg(error?.response?.data?.message || "Invalid Admin Credentials");
    }
  };

  return (
    <div className="d-flex justify-content-center align-items-center vh-100 bg-dark">
      <Card style={{ width: "22rem" }} className="p-3 shadow-lg">
        <Card.Body>
          <h4 className="text-center mb-4">Admin Login</h4>
          {msg && <Alert variant="danger" className="p-2 text-center"><small>{msg}</small></Alert>}
          <Form>
            <Form.Group className="mb-3">
              <Form.Control
                type="text"
                placeholder="Username"
                value={form.userName}
                onChange={(e) => setForm({ ...form, userName: e.target.value })}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Control
                type="password"
                placeholder="Password"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
              />
            </Form.Group>
            <Button variant="danger" className="w-100" onClick={handleLogin}>
              Login
            </Button>
          </Form>
        </Card.Body>
      </Card>
    </div>
  );
};

export default AdminLogin;
