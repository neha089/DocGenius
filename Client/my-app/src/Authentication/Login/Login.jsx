import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Form, Button, Alert } from 'react-bootstrap';
import './Login.css';

const Login = () => {
  const [credentials, setCredentials] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState(null);
  const [formErrors, setFormErrors] = useState({});
  const [rememberMe, setRememberMe] = useState(false);

  useEffect(() => {
    console.log("Loading Google script...");
    if (!window.google) {
      const script = document.createElement('script');
      script.src = 'https://accounts.google.com/gsi/client';
      script.async = true;
      script.defer = true;
      document.head.appendChild(script);
      
      script.onload = () => {
        console.log("Google script loaded successfully");
        initializeGoogleButton();
      };
      
      script.onerror = (error) => {
        console.error("Error loading Google script:", error);
        setError("Failed to load Google authentication");
      };
    } else {
      console.log("Google API already available");
      initializeGoogleButton();
    }
  }, []);

  const initializeGoogleButton = () => {
    console.log("Initializing Google button with client ID:", 1234);
    if (window.google?.accounts?.id) {
      try {
        window.google.accounts.id.initialize({
          client_id: 1234, // Replace with actual client ID
          auto_select: false,
          cancel_on_tap_outside: true
        });

        const buttonContainer = document.getElementById('googleButton');
        if (buttonContainer) {
          window.google.accounts.id.renderButton(
            buttonContainer,
            { 
              theme: 'filled_blue', 
              size: 'large',
              shape: 'pill',
              width: buttonContainer.offsetWidth || 320, // Increased width
              text: 'signin_with'
            }
          );
          console.log("Google button rendered successfully");
        } else {
          console.error("Google button container not found");
        }
      } catch (error) {
        console.error("Error initializing Google button:", error);
        setError("Failed to initialize Google authentication");
      }
    } else {
      console.error("Google accounts API not available");
    }
  };

  

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCredentials({
      ...credentials,
      [name]: value
    });
    
    // Clear error when user types
    if (formErrors[name]) {
      setFormErrors({
        ...formErrors,
        [name]: null
      });
    }
  };

  return (
    <div className="login-page">
      <Container>
        <Row className="justify-content-center">
          <Col xs={12} sm={10} md={8} lg={6}> {/* Increased lg size from 5 to 6 */}
            <Card className="login-card">
              <Card.Header className="text-center bg-transparent border-0 pt-4">
                <h2 className="login-title">Welcome Back</h2>
                {error && (
                  <Alert variant="danger" className="mt-3">
                    {error}
                  </Alert>
                )}
                
                <div id="googleButton" className="d-flex justify-content-center mt-4"></div>
                
                <div className="divider">
                  <span>Or sign in with email</span>
                </div>
              </Card.Header>

              <Card.Body className="px-4 py-4">
                <Form >
                  <div className="login-form-container">
                    <Form.Group className="mb-3">
                      <Form.Label>Email address</Form.Label>
                      <div className="input-group">
                        <span className="input-group-text">
                          {/* Icon can be added here */}
                        </span>
                        <Form.Control
                          type="email"
                          name="email"
                          placeholder="Enter your email"
                          value={credentials.email}
                          onChange={handleInputChange}
                          required
                          isInvalid={!!formErrors.email}
                        />
                        <Form.Control.Feedback type="invalid">
                          {formErrors.email}
                        </Form.Control.Feedback>
                      </div>
                    </Form.Group>

                    <Form.Group className="mb-2">
                      <Form.Label>Password</Form.Label>
                      <div className="input-group">
                        <span className="input-group-text">
                          {/* Icon can be added here */}
                        </span>
                        <Form.Control
                          type="password"
                          name="password"
                          placeholder="Enter your password"
                          value={credentials.password}
                          onChange={handleInputChange}
                          required
                          isInvalid={!!formErrors.password}
                        />
                        <Form.Control.Feedback type="invalid">
                          {formErrors.password}
                        </Form.Control.Feedback>
                      </div>
                    </Form.Group>
                    
                    <div className="forgot-password">
                      <a href="#">Forgot password?</a>
                    </div>
                    
                    <Form.Group className="mb-3">
                      <Form.Check
                        type="checkbox"
                        label="Remember me"
                        checked={rememberMe}
                        onChange={() => setRememberMe(!rememberMe)}
                        id="remember-me"
                      />
                    </Form.Group>

                    <Button 
                      variant="primary" 
                      type="submit" 
                      className="w-100 login-button"
                    >
                    </Button>
                    
                    <div className="signup-link">
                      Don't have an account? <a href="/register">Sign up</a>
                    </div>
                  </div>
                </Form>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default Login;