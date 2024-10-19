import React from "react";
import { Link, useLocation } from "react-router-dom";
import { Navbar, Nav, Button, Container } from "react-bootstrap";

export default function NavigationParent({ user, onLogout }) {
  const location = useLocation();

  return (
    <Navbar bg="light" expand="lg">
      <Container fluid className="px-5">
        <Navbar.Brand as={Link} to="/">
          Weightlifting Tracker
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="mr-auto">
            <Nav.Link as={Link} to="/" active={location.pathname === "/"}>
              Dashboard
            </Nav.Link>
            <Nav.Link
              as={Link}
              to="/workouts"
              active={location.pathname === "/workouts"}
            >
              Workouts
            </Nav.Link>
            <Nav.Link
              as={Link}
              to="/add-workout"
              active={location.pathname === "/add-workout"}
            >
              Add Workout
            </Nav.Link>
          </Nav>
          <Nav>
            <Nav.Link
              as={Link}
              to="/splits"
              active={location.pathname === "/add-split"}
            >
              Add Split
            </Nav.Link>
          </Nav>
        </Navbar.Collapse>
          <Nav>
            {user ? (
              <Button variant="outline-primary" onClick={onLogout}>
                Logout
              </Button>
            ) : (
              <>
                <Nav.Link
                  as={Link}
                  to="/login"
                  active={location.pathname === "/login"}
                >
                  Login
                </Nav.Link>
              </>
            )}
          </Nav>
      </Container>
    </Navbar>
  );
}
