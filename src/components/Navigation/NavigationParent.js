import React from "react";
import { Link, useLocation } from "react-router-dom";
import { Navbar, Nav, Button, Container } from "react-bootstrap";
import authService from "../../services/authService";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser } from '@fortawesome/free-solid-svg-icons';

export default function NavigationParent() {
    const location = useLocation();
    const user = authService.getCurrentUser();

    const handleLogout = async () => {
        try {
            await authService.logout();    // Perform logout operation
            window.location.reload();    // Reload the page to reset user state
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
                            to="/add-workout"
                            active={location.pathname === "/add-workout"}
                        >
                            Add Workout
                        </Nav.Link>
                        <Nav.Link
                            as={Link}
                            to="/calendar"
                            active={location.pathname === "/calendar"}
                        > 
                            Calendar
                        </Nav.Link>                        
                        <Nav.Link
                            as={Link}
                            to="/splits"
                            active={location.pathname === "/splits"}
                        >
                            Add Split
                        </Nav.Link>
                        <Nav.Link
                            as={Link}
                            to="/wiki"
                            active={location.pathname === "/wiki"}
                        >
                            Wiki
                        </Nav.Link>
                        <Nav.Link
                            as={Link}
                            to="/add-goal"
                            active={location.pathname === "/add-goal"}
                        >
                            Add Goal    
                        </Nav.Link>
                    </Nav>
                    <Nav>
                    <Nav.Link
                            as={Link}
                            to="/account"
                            active={location.pathname === "/account"}
                        >
                            <FontAwesomeIcon icon={faUser} style={{color: 'gray'}} />
                        </Nav.Link>
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
