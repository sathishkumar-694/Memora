import React, { useState } from "react";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Card from "react-bootstrap/Card";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import { GoogleLogin } from "@react-oauth/google";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

const Login = () => {
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [msg, setMsg] = useState("");
  const navigate = useNavigate();

  const [form, setForm] = useState({
    userName: "",
    password: "",
  });

  const handleLogin = async () => {
    try {
      if (!form.userName || !form.password) {
        alert("All fields are required");
        return;
      }
      const res = await axios.post(BACKEND_URL + "/auth/login", form);
      localStorage.setItem("token", res.data.token);
      setToken(res.data.token);
      
      // Store role if present (admin)
      if (res.data.role) {
        localStorage.setItem("role", res.data.role);
      } else {
        localStorage.removeItem("role"); 
      }

      setMsg(res.data.message);

      if (res.data.user) {
        localStorage.setItem("userName", res.data.user.fname || res.data.user.userName);
      }

      if (res.data.role === "admin") {
        navigate("/admin");
      } else {
        navigate("/notes");
      }
    } catch (error) {
      setMsg(error?.response?.data?.message || "Invalid credentials");
    }
  };

  const handleGoogleLogin = async (res) => {
  try {
    // 1. Send Google credential to backend
    const response = await axios.post(
      `${BACKEND_URL}/auth/google-login`,
      {
        credential: res.credential,
      }
    );

    // 2. Store your app JWT
    localStorage.setItem("token", response.data.token);
    setToken(response.data.token);

    // 3. Navigate after success
    navigate("/notes");

    // Optional message
    setMsg(response.data.message || "Google login successful");
  } catch (error) {
    console.error(error);
    setMsg(
      error?.response?.data?.message ||
        "Google authentication failed"
    );
  }
};

  return (
      <div className="d-flex justify-content-center align-items-center vh-100 bg-light">
        <Card style={{ width: "22rem" }} className="p-3 shadow-sm">
          <Card.Body>
            <h4 className="text-center mb-4">Login</h4>

            <Form>
              <Form.Group className="mb-3">
                <Form.Control
                  size="sm"
                  type="text"
                  placeholder="Username"
                  value={form.userName}
                  onChange={(e) =>
                    setForm({ ...form, userName: e.target.value })
                  }
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Control
                  size="sm"
                  type="password"
                  placeholder="Password"
                  value={form.password}
                  onChange={(e) =>
                    setForm({ ...form, password: e.target.value })
                  }
                />
              </Form.Group>

              <Button
                variant="primary"
                size="sm"
                className="w-100 mb-3"
                onClick={handleLogin}
              >
                Login
              </Button>

              {/* Google Login */}
              <div className="d-flex justify-content-center mb-3">
                <GoogleLogin
                  size="medium"
                  onSuccess={handleGoogleLogin}
                  onError={() => console.log("Google login failed")}
                />
              </div>

              {/* Register link */}
              <div className="text-center">
                <small>
                  Don’t have an account?{" "}
                  <Link to="/register">Create one</Link>
                </small>
              </div>

              {msg && (
                <div className="text-center mt-2 text-danger">
                  <small>{msg}</small>
                </div>
              )}
            </Form>
          </Card.Body>
        </Card>
      </div>
  );
};

export default Login;
