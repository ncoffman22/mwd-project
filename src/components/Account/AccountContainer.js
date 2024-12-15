import React from 'react';
import { Card, Container } from 'react-bootstrap';
import AccountPicture from './AccountPicture';
import AccountEdit from './AccountEdit';
import AccountDisplay from './AccountDisplay';

export default function AccountContainer() {
    return (
        <Container className="mt-5">
            <Card className="shadow">
                <Card.Header className="bg-primary text-white d-flex justify-content-between align-items-center">
                    <h4 className="mb-0">Account Management</h4>
                    <AccountEdit />
                </Card.Header>
                <Card.Body className="d-flex flex-column align-items-center">
                    <div className="mb-4">
                        <AccountPicture />
                    </div>
                    <div className="mb-4">
                        <AccountDisplay />
                    </div>
                </Card.Body>
            </Card>
        </Container>
    );
}
