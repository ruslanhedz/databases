import React, { useState, useEffect } from 'react';
import {Container, Card, Button, Row, Col, Dropdown} from 'react-bootstrap';
import { useNavigate, useLocation } from 'react-router-dom';
import api from "../api.js";

const AnimalAdoption = () => {
    const navigate = useNavigate();
    const handleAddAnimal = () => {
        navigate('/add-animal');
    }

    const [animals, setAnimals] = useState([]);

    useEffect(() => {
        api.get('/api/animals/my/', {
            headers: {
                'Authorization': `Bearer ${sessionStorage.getItem('access')}`,
            }
        }) // Adjust the URL to your API endpoint
            .then((response) => {
                setAnimals(response.data);
                //console.log(response.data);
            })
            .catch((error) => {
                console.error('Error fetching animals:', error);
            });
    }, []);

    return (
        <Container className="my-5">
            <h2 className="text-center mb-4">Twoje zwierzęta</h2>
            <div style={{ margin: '1rem' }}>
                <Button variant="outline-primary" onClick={handleAddAnimal}>Dodaj zwierzę</Button>
            </div>
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

