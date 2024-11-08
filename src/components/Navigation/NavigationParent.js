import React from "react";
import { Link, useLocation } from "react-router-dom";
import { Navbar, Nav, Button, Container } from "react-bootstrap";
import authService from "../../services/authService";

export default function NavigationParent() {
  const location = useLocation();
  const user = authService.getCurrentUser();

  const handleLogout = async () => {
    try {
      await authService.logout();  // Perform logout operation
      window.location.reload();  // Reload the page to reset user state
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  return (
    <Navbar bg="light" expand="lg">
      <Container fluid className="px-5">
        <Navbar.Brand as={Link} to="/">
          Weightlifting Tracker
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
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
            <Nav.Link
              as={Link}
              to="/splits"
              active={location.pathname === "/splits"}
            >
              Add Split
            </Nav.Link>
          </Nav>
          <Nav>
            {user ? (
              <Button variant="outline-primary" onClick={handleLogout}>
                Logout
              </Button>
            ) : (
              <Nav.Link
                as={Link}
                to="/login"
                active={location.pathname === "/login"}
              >
                Login
              </Nav.Link>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}
