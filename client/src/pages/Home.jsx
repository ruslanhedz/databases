import React, { useState, useEffect } from 'react';
import { Container, Card, Button, Row, Col } from 'react-bootstrap';
import { useNavigate, useLocation } from 'react-router-dom';

const animals = [
    {
        id: 1,
        name: 'Max',
        description: '//',
        image: '//',
    },
    {
        id: 2,
        name: '//',
        description: '//.',
        image: '//',
    },
    {
        id: 3,
        name: '//',
        description: '//',
        image: '//',
    },
    {
        id: 4,
        name: 'Charlie',
        description: '//',
        image: '//',
    },
    {
        id: 5,
        name: 'Charlie',
        description: '//',
        image: '//',
    },
    {
        id: 6,
        name: 'Charlie',
        description: '//',
        image: '//',
    },
    {
        id: 7,
        name: 'Charlie',
        description: '//',
        image: '//',
    },
    {
        id: 8,
        name: 'Charlie',
        description: '//',
        image: '//',
    },
    {
        id: 9,
        name: 'Charlie',
        description: '//',
        image: '//',
    },
    {
        id: 10,
        name: 'Charlie',
        description: '//',
        image: '//',
    },
];

const AnimalAdoption = () => {
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
                                <Button variant="primary">Dowiedz się więcej</Button>
                                <Button variant="success" className="ms-2">
                                    Zaadoptuj
                                </Button>
                            </Card.Body>
                        </Card>
                    </Col>
                ))}
            </Row>
        </Container>
    );
};

export default AnimalAdoption;

