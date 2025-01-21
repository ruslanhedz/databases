import React, { useEffect, useState } from 'react';
import { Container, ListGroup, Card, Badge, Button } from 'react-bootstrap';
import api from '../api';

const AdoptionRequests = () => {
    const [adoptionRequests, setAdoptionRequests] = useState([]);

    useEffect(() => {
        api.get('/api/adoption-requests/', {
            headers: {
                'Authorization': `Bearer ${sessionStorage.getItem('access')}`,
            }
        }).then ((response) => {
            setAdoptionRequests(response.data);
        })
            .catch((error) => {
                console.error('Error fetching adoption request', error);
            })
    }, []);

    const handleApprove = (adoptionId) => {
        api.post('/api/adoption-requests/approve/',
            {adoption_id: adoptionId},
            {
                headers: {
                    'Authorization': `Bearer ${sessionStorage.getItem('access')}`,
                }
            }
        ). then ((response) => {
            alert('Adoption approved successfully!');
            window.location.reload();
        })
            .catch((error) => {
                console.error('Error approving adoption request', error);
                alert('Failed to approve adoption request.');
            })
    };

    const handleReject = (adoptionId) => {
        api.post('/api/adoption-requests/reject/',
            {adoption_id: adoptionId},
            {
                headers: {
                    'Authorization': `Bearer ${sessionStorage.getItem('access')}`,
                }
            }
        ). then ((response) => {
            alert('Adoption request rejected!');
            window.location.reload();
        })
            .catch((error) => {
                console.error('Error approving adoption request', error);
                alert('Failed to approve adoption request.');
            })
    }

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
                <h2 className="text-center mb-4 text-primary">Adoption Requests</h2>
                <ListGroup variant="flush">
                    {adoptionRequests.map((request) => (
                        <ListGroup.Item key={request.adoption_id} className="d-flex flex-column flex-md-row justify-content-between align-items-center mb-3">
                            <div className="flex-grow-1 mb-3 mb-md-0">
                                <div><strong>Adoption ID:</strong> {request.adoption_id}</div>
                                <div><strong>Adopter Name:</strong> {request.adopter_name}</div>
                                <div><strong>Animal ID:</strong> {request.animal_id}</div>
                                <div><strong>Animal Name:</strong> {request.animal_name}</div>
                                <div><strong>Date of request: </strong> {request.adoption_date}</div>
                            </div>
                            <div className="d-flex align-items-center gap-2">
                                <Badge bg={getStatusVariant(request.status)} className="me-2">{request.status}</Badge>
                                <Button variant="success"
                                        size="sm"
                                        onClick={() => handleApprove(request.adoption_id)}
                                >Approve</Button>
                                <Button
                                    variant="danger"
                                    size="sm"
                                    onClick={() => handleReject(request.adoption_id)}
                                >Reject</Button>
                            </div>
                        </ListGroup.Item>
                    ))}
                </ListGroup>
            </Card>
        </Container>
    );
};

export default AdoptionRequests;