import React from "react";
import { Container } from "react-bootstrap";
import AuthParent from "./AuthParent";
export default function AuthContainer() {
    // Wrapper for the authentication (login) page
    return (
        <Container>
            <AuthParent />
        </Container>
    );
}
