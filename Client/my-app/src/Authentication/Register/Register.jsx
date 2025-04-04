import React, { useState, useEffect } from 'react';
import { Card, Container, Row, Col, Form, Button, Alert } from 'react-bootstrap';
import './Register.css';

const Register = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    phoneNumber: '',
    role: 'CUSTOMER',
    address: {
      street: '',
      city: '',
      state: '',
      zipCode: '',
      coordinates: [0, 0],
    }
  });

  const [formErrors, setFormErrors] = useState({});
  const [formSubmitted, setFormSubmitted] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormData({
        ...formData,
        [parent]: {
          ...formData[parent],
          [child]: value
        }
      });
    } else {
      setFormData({
        ...formData,
        [name]: value
      });
    }
    
    // Clear errors when user types
    if (formErrors[name]) {
      setFormErrors({
        ...formErrors,
        [name]: null
      });
    }
  };

  const validateForm = () => {
    const errors = {};
    
    // Username validation
    if (!formData.username.trim()) {
      errors.username = 'Username is required';
    }
    
    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email.trim()) {
      errors.email = 'Email is required';
    } else if (!emailRegex.test(formData.email)) {
      errors.email = 'Please enter a valid email';
    }
    
    // Password validation
    if (!formData.password) {
      errors.password = 'Password is required';
    } else if (formData.password.length < 8) {
      errors.password = 'Password must be at least 8 characters';
    }
    
    // Confirm password
    if (formData.password !== formData.confirmPassword) {
      errors.confirmPassword = 'Passwords do not match';
    }
    
    return errors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const errors = validateForm();
    
    if (Object.keys(errors).length === 0) {
      // Form is valid, proceed with submission
      console.log('Form data submitted:', formData);
      setFormSubmitted(true);
    } else {
      setFormErrors(errors);
    }
  };

  const initializeGoogleButton = () => {
    if (window.google?.accounts?.id) {
      console.log("Initializing Google button");
      try {
        window.google.accounts.id.initialize({
          client_id: 1234, // Replace with your actual client ID
          auto_select: false,
          cancel_on_tap_outside: true
        });
  
        const buttonElement = document.getElementById('googleRegisterButton');
        if (buttonElement) {
          window.google.accounts.id.renderButton(
            buttonElement,
            { 
              theme: 'filled_blue', 
              size: 'large',
              shape: 'pill',
              width: buttonElement.offsetWidth || 280,
              text: 'signup_with'
            }
          );
        } else {
          console.error("Google button element not found");
        }
      } catch (error) {
        console.error("Error initializing Google button:", error);
      }
    } else {
      console.error("Google API not available");
    }
  };
  
  useEffect(() => {
    if (!window.google) {
      const script = document.createElement('script');
      script.src = 'https://accounts.google.com/gsi/client';
      script.async = true;
      script.defer = true;
      document.head.appendChild(script);
      
      script.onload = () => {
        initializeGoogleButton();
      };
    } else {
      initializeGoogleButton();
    }
  }, []);

  return (
    <div className="register-page">
      <Container className="py-5">
        <Row className="justify-content-center">
          <Col xs={12} md={10} lg={8}>
            <Card className="register-card">
              <Card.Header className="text-center bg-transparent border-0 pt-4">
                <h2 className="register-title">Create an Account</h2>
                
                <div id="googleRegisterButton" className="d-flex justify-content-center mt-4"></div>
                
                <div className="divider">
                  <span>Or register with email</span>
                </div>
              </Card.Header>

              <Card.Body className="px-4 py-4">
                {formSubmitted && (
                  <Alert variant="success" className="mb-4">
                    Your account has been created successfully! You can now login.
                  </Alert>
                )}
                
                <Form onSubmit={handleSubmit}>
                  {/* Personal Information Section */}
                  <div className="section-container">
                    <h3 className="section-title">Personal Information</h3>
                    <Row>
                      <Col md={6}>
                        <Form.Group className="mb-3">
                          <Form.Label>Username</Form.Label>
                          <div className="input-group">
                            <span className="input-group-text">
                            </span>
                            <Form.Control
                              type="text"
                              name="username"
                              required
                              value={formData.username}
                              onChange={handleChange}
                              placeholder="Enter username"
                              isInvalid={!!formErrors.username}
                            />
                            {formErrors.username && (
                              <Form.Control.Feedback type="invalid">
                                {formErrors.username}
                              </Form.Control.Feedback>
                            )}
                          </div>
                        </Form.Group>
                      </Col>
                      <Col md={6}>
                        <Form.Group className="mb-3">
                          <Form.Label>Email</Form.Label>
                          <div className="input-group">
                            <span className="input-group-text">
                            </span>
                            <Form.Control
                              type="email"
                              name="email"
                              required
                              value={formData.email}
                              onChange={handleChange}
                              placeholder="Enter email"
                              isInvalid={!!formErrors.email}
                            />
                            {formErrors.email && (
                              <Form.Control.Feedback type="invalid">
                                {formErrors.email}
                              </Form.Control.Feedback>
                            )}
                          </div>
                        </Form.Group>
                      </Col>
                      <Col md={6}>
                        <Form.Group className="mb-3">
                          <Form.Label>Password</Form.Label>
                          <div className="input-group">
                            <span className="input-group-text">
                            </span>
                            <Form.Control
                              type="password"
                              name="password"
                              required
                              value={formData.password}
                              onChange={handleChange}
                              placeholder="Enter password"
                              isInvalid={!!formErrors.password}
                            />
                            {formErrors.password && (
                              <Form.Control.Feedback type="invalid">
                                {formErrors.password}
                              </Form.Control.Feedback>
                            )}
                          </div>
                        </Form.Group>
                      </Col>
                      <Col md={6}>
                        <Form.Group className="mb-3">
                          <Form.Label>Confirm Password</Form.Label>
                          <div className="input-group">
                            <span className="input-group-text">
                            </span>
                            <Form.Control
                              type="password"
                              name="confirmPassword"
                              required
                              value={formData.confirmPassword}
                              onChange={handleChange}
                              placeholder="Confirm password"
                              isInvalid={!!formErrors.confirmPassword}
                            />
                            {formErrors.confirmPassword && (
                              <Form.Control.Feedback type="invalid">
                                {formErrors.confirmPassword}
                              </Form.Control.Feedback>
                            )}
                          </div>
                        </Form.Group>
                      </Col>
                      <Col md={6}>
                        <Form.Group className="mb-3">
                          <Form.Label>Phone Number</Form.Label>
                          <div className="input-group">
                            <span className="input-group-text">
                            </span>
                            <Form.Control
                              type="tel"
                              name="phoneNumber"
                              value={formData.phoneNumber}
                              onChange={handleChange}
                              placeholder="Enter phone number"
                            />
                          </div>
                        </Form.Group>
                      </Col>
                    </Row>
                  </div>

                  {/* Address Section */}
                  <div className="section-container">
                    <h3 className="section-title">Address Details</h3>
                    <Row>
                      <Col md={12}>
                        <Form.Group className="mb-3">
                          <Form.Label>Street Address</Form.Label>
                          <div className="input-group">
                            <span className="input-group-text">
                            </span>
                            <Form.Control
                              type="text"
                              name="address.street"
                              value={formData.address.street}
                              onChange={handleChange}
                              placeholder="Enter street address"
                            />
                          </div>
                        </Form.Group>
                      </Col>
                      <Col md={4}>
                        <Form.Group className="mb-3">
                          <Form.Label>City</Form.Label>
                          <div className="input-group">
                            <span className="input-group-text">
                            </span>
                            <Form.Control
                              type="text"
                              name="address.city"
                              value={formData.address.city}
                              onChange={handleChange}
                              placeholder="Enter city"
                            />
                          </div>
                        </Form.Group>
                      </Col>
                      <Col md={4}>
                        <Form.Group className="mb-3">
                          <Form.Label>State</Form.Label>
                          <div className="input-group">
                            <span className="input-group-text">
                            </span>
                            <Form.Control
                              type="text"
                              name="address.state"
                              value={formData.address.state}
                              onChange={handleChange}
                              placeholder="Enter state"
                            />
                          </div>
                        </Form.Group>
                      </Col>
                      <Col md={4}>
                        <Form.Group className="mb-3">
                          <Form.Label>ZIP Code</Form.Label>
                          <div className="input-group">
                            <span className="input-group-text">
                            </span>
                            <Form.Control
                              type="text"
                              name="address.zipCode"
                              value={formData.address.zipCode}
                              onChange={handleChange}
                              placeholder="Enter ZIP code"
                            />
                          </div>
                        </Form.Group>
                      </Col>
                    </Row>
                  </div>

                  <Button 
                    variant="primary" 
                    type="submit" 
                    className="w-100 mt-4 register-button"
                  >
                    Create Account
                  </Button>
                </Form>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default Register;