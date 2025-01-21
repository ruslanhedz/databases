import React, { useState, useEffect } from 'react';
import api from '../api.js'
import { Container, Card, Button, Row, Col, Dropdown, DropdownToggle, DropdownMenu, DropdownItem } from 'react-bootstrap';

const AnimalAdoption = () => {
    const [animals, setAnimals] = useState([]);

    useEffect(() => {
        api.get('/api/animals/available/', {
            headers: {
                'Authorization': `Bearer ${sessionStorage.getItem('access')}`,
            }
        }) // Adjust the URL to your API endpoint
            .then((response) => {
                setAnimals(response.data);
                console.log(response.data);
            })
            .catch((error) => {
                console.error('Error fetching animals:', error);
            });
    }, []);

    const handleAdopt = (animalId) => {
        api.post('/api/adoption-request/',
            { animal_id: animalId },
            {
                headers: {
                    'Authorization': `Bearer ${sessionStorage.getItem('access')}`,
                }
            }
        )
            .then((response) => {
                alert('Adoption request sent successfully!');
                console.log(response.data);
            })
            .catch((error) => {
                console.error('Error sending adoption request:', error);
                alert('Failed to send adoption request.');
            });
    };

    return (
        <Container className="my-5">
            <h2 className="text-center mb-4">Zwierzęta do Adopcji</h2>
            <Row>
                {animals.map((animal) => (
                    <Col key={animal.id} md={6} lg={4} className="mb-4">
                        <Card>
                            <Card.Img
                                variant="top"
                                src={`/images/${animal.id}.jpg`}
                                alt={animal.name}
                                style={{ height: '200px', objectFit: 'cover' }}
                            />
                            <Card.Body>
                                <Card.Title>{animal.name}</Card.Title>
                                <Card.Text>{animal.description}</Card.Text>
                                <div className="d-flex justify-content-between mt-3">
                                    <Button
                                        variant="success"
                                        className="me-2"
                                        onClick={() => handleAdopt(animal.id)}
                                    >
                                        Zaadoptuj
                                    </Button>
                                    <Dropdown>
                                        <Dropdown.Toggle variant="info">
                                            Information
                                        </Dropdown.Toggle>
                                        <Dropdown.Menu>
                                            <Dropdown.Item>
                                                <strong>Species:</strong> {animal.species || 'Not Specified'}
                                            </Dropdown.Item>
                                            <Dropdown.Item>
                                                <strong>Breed:</strong> {animal.breed || 'Not Specified'}
                                            </Dropdown.Item>
                                            <Dropdown.Item>
                                                <strong>Age:</strong> {animal.age || 'Not Specified'}
                                            </Dropdown.Item>
                                            <Dropdown.Item>
                                                <strong>Sex:</strong> {animal.sex || 'Not Specified'}
                                            </Dropdown.Item>
                                            <Dropdown.Item>
                                                <strong>Status:</strong> {animal.status || 'Not Specified'}
                                            </Dropdown.Item>
                                            <Dropdown.Item>
                                                <strong>Description</strong> {animal.description || 'Not Specified'}
                                            </Dropdown.Item>
                                            <Dropdown.Item>
                                                <strong>Shelter:</strong> {animal.shelter_username || 'Not Specified'}
                                            </Dropdown.Item>
                                        </Dropdown.Menu>
                                    </Dropdown>
                                </div>
                            </Card.Body>
                        </Card>
                    </Col>
                ))}
            </Row>
        </Container>
    );
};

export default AnimalAdoption;
