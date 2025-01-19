import React from 'react';
import { Container, ListGroup, Card, Badge } from 'react-bootstrap';

const MyRequests = () => {
    const myRequests = [
        {
            adoption_id: 1,
            shelter_name: 'Happy Tails Shelter',
            animal_id: 1,
            animal_name: 'Bella',
            status: 'Pending',
        },
        {
            adoption_id: 2,
            shelter_name: 'Pawfect Haven',
            animal_id: 2,
            animal_name: 'Max',
            status: 'Approved',
        },
        {
            adoption_id: 3,
            shelter_name: 'Safe Paws Shelter',
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
                <h2 className="text-center mb-4 text-primary">My Requests</h2>
                <ListGroup variant="flush">
                    {myRequests.map((request) => (
                        <ListGroup.Item key={request.adoption_id} className="d-flex justify-content-between align-items-center">
                            <div>
                                <div><strong>Adoption ID:</strong> {request.adoption_id}</div>
                                <div><strong>Shelter Name:</strong> {request.shelter_name}</div>
                                <div><strong>Animal ID:</strong> {request.animal_id}</div>
                                <div><strong>Animal Name:</strong> {request.animal_name}</div>
                            </div>
                            <Badge bg={getStatusVariant(request.status)}>{request.status}</Badge>
                        </ListGroup.Item>
                    ))}
                </ListGroup>
            </Card>
        </Container>
    );
};

export default MyRequests;
