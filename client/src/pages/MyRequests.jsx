import React, {useState, useEffect } from 'react';
import { Container, ListGroup, Card, Badge } from 'react-bootstrap';
import api from '../api';

const MyRequests = () => {
    const [MyRequests, setMyRequests] = useState([]);

    useEffect(() => {
        api.get('/api/adoption-requests/my/', {
            headers: {
                'Authorization': `Bearer ${sessionStorage.getItem('access')}`,
            }
        }).then ((response) => {
            setMyRequests(response.data);
        })
            .catch((error) => {
                console.error('Error fetching adoption request', error);
            })
    }, []);

    const getStatusVariant = (status) => {
        switch (status) {
            case 'approved':
                return 'success';
            case 'rejected':
                return 'danger';
            case 'pending':
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
                    {MyRequests.map((request) => (
                        <ListGroup.Item key={request.adoption_id} className="d-flex justify-content-between align-items-center">
                            <div>
                                <div><strong>Adoption ID:</strong> {request.adoption_id}</div>
                                <div><strong>Shelter Name:</strong> {request.shelter_name}</div>
                                <div><strong>Animal ID:</strong> {request.animal_id}</div>
                                <div><strong>Animal Name:</strong> {request.animal_name}</div>
                                <div><strong>Date of request: </strong> {request.adoption_date}</div>
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
