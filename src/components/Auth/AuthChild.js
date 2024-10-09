import React from "react";
import { Link } from "react-router-dom";
import { Form, Button, Row, Col } from "react-bootstrap";

export default function AuthChild({
  credentials,
  onChange,
  onSubmit,
  isLogin,
  setIsLogin,
}) {
  return (
    <Row className="justify-content-md-center mt-5">
      {" "}
      {/* Form to register or login */}
      <Col xs={12} md={6}>
        <Form onSubmit={onSubmit}>
          <h2 className="mb-4">{isLogin ? "Login" : "Register"}</h2>
          <Form.Group className="mb-3" controlId="username">
            <Form.Label>Username</Form.Label>
            <Form.Control
              type="text"
              name="username"
              placeholder="Enter Username"
              value={credentials.username}
              onChange={onChange}
              required
            />
          </Form.Group>
          <Form.Group className="mb-3" controlId="password">
            <Form.Label>Password</Form.Label>
            <Form.Control
              type="password"
              name="password"
              placeholder="Enter Password"
              value={credentials.password}
              onChange={onChange}
              required
            />
          </Form.Group>
          {/*Add buttons for if you are want to be on the other page*/}
          <Button variant="primary" type="submit" className="w-100">
            {isLogin ? "Login" : "Register"}
          </Button>
          <Button variant="link" onClick={() => setIsLogin(!isLogin)}>
            {isLogin ? "Need to Register?" : "Already Have an Account?"}
          </Button>
          <p className="mt-3 text-center">
            Don't have an account? <Link to="/register">Register</Link>
          </p>
        </Form>
      </Col>
    </Row>
  );
}
