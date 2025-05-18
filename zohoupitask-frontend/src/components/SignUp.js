import React, { useState } from 'react';
import axios from 'axios';
import './SignUpForm.css';
import { Container, Form, Button, Alert, InputGroup } from 'react-bootstrap';
import { EyeFill, EyeSlashFill } from 'react-bootstrap-icons';
import logo from '../components/Images/zoholog.svg';
import { useNavigate } from 'react-router-dom';



const Signup = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: ''
  });

  const navigate = useNavigate();


  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const validate = () => {
    const newErrors = {};
    if (!formData.username.trim()) newErrors.username = 'Username is required';
    if (!formData.email.trim()) newErrors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Invalid email format';
    if (!formData.password.trim()) newErrors.password = 'Password is required';
    else if (formData.password.length < 6) newErrors.password = 'Password must be at least 6 characters';
    return newErrors;
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setErrors({
      ...errors,
      [e.target.name]: ''
    });
    setMessage('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    try {
      const res = await axios.post('http://localhost:8080/api/auth/signup', formData);
      setMessage(res.data);
      setFormData({ username: '', email: '', password: '' });

       // Redirect to Sign In page after 1 seconds
    setTimeout(() => {
      navigate('/');
    }, 1000);

    } catch (err) {
      if (err.response && err.response.status === 409) {
        setMessage('⚠️ Email already registered');
      } else {
        setMessage('❌ Signup failed. Please try again.');
      }
    }
  };

  return (
    <div className="signup-page">
      <Container className="signup-box shadow">
        <div className="text-center mb-4">
          <img src={logo} alt="Logo" className="mb-4" height="80" />
          <h3 className="mt-3">Create your account</h3>
        </div>
        {message && (
          <Alert variant={message.startsWith('⚠️') || message.startsWith('❌') ? 'danger' : 'success'}>
            {message}
          </Alert>
        )}
        <Form onSubmit={handleSubmit} noValidate>
          <Form.Group className="mb-3">
            <Form.Control
              type="text"
              name="username"
              placeholder="Username"
              value={formData.username}
              onChange={handleChange}
              className="custom-input"
              isInvalid={!!errors.username}
            />
            <Form.Control.Feedback type="invalid">{errors.username}</Form.Control.Feedback>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Control
              type="email"
              name="email"
              placeholder="Email Address"
              value={formData.email}
              onChange={handleChange}
              className="custom-input"
              isInvalid={!!errors.email}
            />
            <Form.Control.Feedback type="invalid">{errors.email}</Form.Control.Feedback>
          </Form.Group>

          <Form.Group className="mb-4">
            <InputGroup>
              <Form.Control
                type={showPassword ? 'text' : 'password'}
                name="password"
                placeholder="Password"
                value={formData.password}
                onChange={handleChange}
                className="custom-input"
                isInvalid={!!errors.password}
              />
              <Button
                variant="outline-secondary"
                onClick={() => setShowPassword(!showPassword)}
                className="password-toggle"
              >
                {showPassword ? <EyeSlashFill /> : <EyeFill />}
              </Button>
              <Form.Control.Feedback type="invalid">{errors.password}</Form.Control.Feedback>
            </InputGroup>
          </Form.Group>

          <Button type="submit" className="w-100 signup-button">
            Sign up
          </Button>
        </Form>
      </Container>
    </div>
  );
};

export default Signup;
