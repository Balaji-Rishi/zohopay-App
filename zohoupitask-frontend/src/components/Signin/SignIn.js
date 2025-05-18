import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import { Container, Row, Col, Form, InputGroup, Button, Alert, Spinner } from 'react-bootstrap';
import './SignIn.css';
import logo from '../Images/zoholog.svg';
import signin from '../Images/signinimg.svg';
import { EyeFill, EyeSlashFill } from 'react-bootstrap-icons';
import { jwtDecode } from 'jwt-decode';


const Signin = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  // On component mount, pre-fill form if "Remember Me" was used before
  useEffect(() => {
    // Pre-fill from localStorage if rememberMe was checked before
    const savedEmail = localStorage.getItem('rememberEmail');
    const savedPassword = localStorage.getItem('rememberPassword');
    if (savedEmail && savedPassword) {
      setFormData({ email: savedEmail, password: savedPassword });
      setRememberMe(true);
    }
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Basic validation before submitting the form
  const validateForm = () => {
    if (!formData.email.trim() || !formData.password.trim()) {
      setMessage('Email and password are required.');
      return false;
    }
    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setMessage('Please enter a valid email address.');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setMessage('');
    setLoading(true);

    try {
      const res = await axios.post('http://localhost:8080/api/auth/signin', formData);
      const bearerToken = res.data;
      const jwtToken = bearerToken.replace('Bearer ', '');

      // Store token
      localStorage.setItem('token', jwtToken);

      // Decode JWT for user info
      const userInfo = jwtDecode(jwtToken);
      console.log('User Info:', userInfo);

      // Save credentials if rememberMe is checked
      if (rememberMe) {
        localStorage.setItem('rememberEmail', formData.email);
        localStorage.setItem('rememberPassword', formData.password);
      } else {
        localStorage.removeItem('rememberEmail');
        localStorage.removeItem('rememberPassword');
      }

      navigate('/welcome');
    } catch (err) {
      setLoading(false);
      if (err.response && err.response.status === 401) {
        setMessage('Invalid email or password');
      } else {
        setMessage('Login failed. Please try again.');
        console.error(err);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-wrapper">
      <Container className="signin-container mt-5 p-0 shadow">
        <Row className="g-0">
          <Col md={6} className="signin-form-section p-5">
            <img src={logo} alt="Logo" className="logo mb-4" />
            <h2>Sign in</h2>
            <p>to access Zohopay</p>

            {message && <Alert variant="danger">{message}</Alert>}

            <Form onSubmit={handleSubmit}>
              {/* Email input */}
              <Form.Group controlId="formEmail" className="mb-4">
                <Form.Control
                  type="email"
                  placeholder="Email address"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </Form.Group>

               {/* Password input with show/hide toggle */}
              <Form.Group controlId="formPassword" className="mb-4">
                <InputGroup>
                  <Form.Control
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                  />

                  <Button
                    variant="outline-secondary"
                    onClick={() => setShowPassword(!showPassword)}
                    className="password-toggle"
                  >
                    {showPassword ? <EyeSlashFill /> : <EyeFill />}
                  </Button>
                </InputGroup>
              </Form.Group>

              <Form.Group controlId="formRememberMe" className="mb-3">
                <Form.Check
                  type="checkbox"
                  label="Remember Me"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                />
              </Form.Group>

              <Button variant="primary" type="submit" className="w-100 mb-3" disabled={loading}>
                {loading ? (
                  <>
                    <Spinner animation="border" size="sm" className="me-2" /> Signing In...
                  </>
                ) : (
                  'Submit'
                )}
              </Button>
            </Form>

            <p className="signup-link">
              Don't have a Zoho account? <Link to="/SignUp">Sign up now</Link>
            </p>
          </Col>

          <Col md={6} className="signin-info-section p-5 d-flex flex-column justify-content-center">
            <div className="info-illustration">
              <img src={signin} alt="signin illustration" />
            </div>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default Signin;
