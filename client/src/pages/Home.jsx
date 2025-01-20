import React, { useState } from 'react';
import { Container, Card, Button, Row, Col, Dropdown, DropdownToggle, DropdownMenu, DropdownItem } from 'react-bootstrap';

const animals = [
    {
        id: 1,
        name: 'Max',
        description: 'Max is a friendly dog looking for a new home.',
        image: 'https://via.placeholder.com/150',
    },
    {
        id: 2,
        name: 'Bella',
        description: 'Bella is a calm and affectionate cat.',
        image: 'https://via.placeholder.com/150',
    },
    {
        id: 3,
        name: 'Charlie',
        description: 'Charlie is an energetic and playful rabbit.',
        image: 'https://via.placeholder.com/150',
    },
];

const AnimalAdoption = () => {
    const [formData, setFormData] = useState({
        image: '',
        name: '',
        species: '',
        breed: '',
        age: '',
        sex: '',
        description: ''
    });

    return (
        <Container className="my-5">
            <h2 className="text-center mb-4">Zwierzęta do Adopcji</h2>
            <Row>
                {animals.map((animal) => (
                    <Col key={animal.id} md={6} lg={4} className="mb-4">
                        <Card>
                            <Card.Img
                                variant="top"
                                src={animal.image}
                                alt={animal.name}
                                style={{ height: '200px', objectFit: 'cover' }}
                            />
                            <Card.Body>
                                <Card.Title>{animal.name}</Card.Title>
                                <Card.Text>{animal.description}</Card.Text>
                                <div className="d-flex justify-content-between mt-3">
                                    <Button variant="success" className="me-2">
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
