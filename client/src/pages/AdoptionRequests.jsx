import React from 'react';
import { Container, ListGroup, Card, Badge, Button } from 'react-bootstrap';

const AdoptionRequests = () => {
    const adoptionRequests = [
        {
            adoption_id: 1,
            adopter_name: 'John Doe',
            animal_id: 1,
            animal_name: 'Bella',
            status: 'Pending',
        },
        {
            adoption_id: 2,
            adopter_name: 'Jane Smith',
            animal_id: 2,
            animal_name: 'Max',
            status: 'Approved',
        },
        {
            adoption_id: 3,
            adopter_name: 'Emily Johnson',
            animal_id: 3,
            animal_name: 'Charlie',
            status: 'Rejected',
        },
    ];

    const getStatusVariant = (status) => {
        switch (status) {
            case 'Approved':
                return 'success';
            case 'Rejected':
                return 'danger';
            case 'Pending':
                return 'warning';
            default:
                return 'secondary';
        }
    };

    return (
        <Container className="my-5">
            <Card className="shadow p-4">
                <h2 className="text-center mb-4 text-primary">Adoption Requests</h2>
                <ListGroup variant="flush">
                    {adoptionRequests.map((request) => (
                        <ListGroup.Item key={request.adoption_id} className="d-flex flex-column flex-md-row justify-content-between align-items-center mb-3">
                            <div className="flex-grow-1 mb-3 mb-md-0">
                                <div><strong>Adoption ID:</strong> {request.adoption_id}</div>
                                <div><strong>Adopter Name:</strong> {request.adopter_name}</div>
                                <div><strong>Animal ID:</strong> {request.animal_id}</div>
                                <div><strong>Animal Name:</strong> {request.animal_name}</div>
                            </div>
                            <div className="d-flex align-items-center gap-2">
                                <Badge bg={getStatusVariant(request.status)} className="me-2">{request.status}</Badge>
                                <Button variant="success" size="sm">Approve</Button>
                                <Button variant="danger" size="sm">Reject</Button>
                            </div>
                        </ListGroup.Item>
                    ))}
                </ListGroup>
            </Card>
        </Container>
    );
};

export default AdoptionRequests;