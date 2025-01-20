import React, { useState } from 'react';
import { Container, Button, Form, FormControl, FormGroup, FormLabel, FormCheck } from 'react-bootstrap';
import axios from 'axios';

function AddAnimal() {
    const [formData, setFormData] = useState({
        photo: null,
        name: '',
        species: '',
        breed: '',
        age: '',
        sex: '',
        description: '',
        shelterId: ''
    });

    const handleChange = (e) => {
        const { name, value, type, files } = e.target;
        setFormData({
            ...formData,
            [name]: type === 'file' ? files[0] : value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const token = sessionStorage.getItem('access'); // Replace with your actual token
            console.log(token);

            // Step 1: Prepare animal data
            const animalData = new FormData(); // Using FormData to handle both file and text fields

            // Append fields to FormData
            animalData.append('name', formData.name);
            animalData.append('species', formData.species);
            animalData.append('breed', formData.breed);
            animalData.append('age', formData.age);
            animalData.append('sex', formData.sex);
            animalData.append('description', formData.description);
            animalData.append('shelterId', formData.shelterId);
            console.log(animalData)
            // Include photo if available
            if (formData.photo) {
                animalData.append('photo', formData.photo);
            }

            // Step 2: Add animal information (with photo if available)
            const animalResponse = await axios.post('http://localhost:8000/api/add-animal/', animalData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'multipart/form-data', // Important for FormData
                },
            });

            if (animalResponse.status === 201) {
                alert('Animal added successfully!');
            } else {
                alert('Failed to add animal.');
            }
        } catch (error) {
            console.error('Error:', error);
            alert('An error occurred while adding the animal.');
        }
    };

    return (
        <Container>
            <Form onSubmit={handleSubmit}>
                <FormGroup controlId="photo" className="mb-5 form-control-lg">
                    <FormLabel>Image</FormLabel>
                    <FormControl
                        type="file"
                        name="photo"
                        onChange={handleChange}
                    />
                </FormGroup>
                <FormGroup controlId="name" className="mb-5 form-control-lg">
                    <FormLabel>Name</FormLabel>
                    <Form.Control
                        type="text"
                        placeholder="Enter name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                    />
                </FormGroup>
                <FormGroup controlId="species" className="mb-5 form-control-lg">
                    <FormLabel>Species</FormLabel>
                    <Form.Control
                        type="text"
                        placeholder="Enter species"
                        name="species"
                        value={formData.species}
                        onChange={handleChange}
                    />
                </FormGroup>
                <FormGroup controlId="breed" className="mb-5 form-control-lg">
                    <FormLabel>Breed</FormLabel>
                    <Form.Control
                        type="text"
                        placeholder="Enter breed"
                        name="breed"
                        value={formData.breed}
                        onChange={handleChange}
                    />
                </FormGroup>
                <FormGroup controlId="age" className="mb-5 form-control-lg">
                    <FormLabel>Age</FormLabel>
                    <FormControl
                        type="number"
                        placeholder="Enter age"
                        name="age"
                        value={formData.age}
                        min="0"
                        max="100"
                        onChange={handleChange}
                    />
                </FormGroup>
                <FormGroup controlId="sex" className="mb-5 form-control-lg">
                    <FormLabel>Sex</FormLabel>
                    <FormCheck
                        type="radio"
                        label="Male"
                        id="male"
                        name="sex"
                        value="M"  // Use 'M' for Male
                        checked={formData.sex === 'M'}
                        onChange={handleChange}
                    />
                    <FormCheck
                        type="radio"
                        label="Female"
                        id="female"
                        name="sex"
                        value="F"  // Use 'F' for Female
                        checked={formData.sex === 'F'}
                        onChange={handleChange}
                    />
                </FormGroup>
                <FormGroup controlId="description" className="mb-5 form-control-lg">
                    <FormLabel>Description</FormLabel>
                    <FormControl
                        as="textarea"
                        rows={5}
                        placeholder="Enter description"
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                    />
                </FormGroup>
                <div className="text-end mb-5 btn-lg">
                    <Button variant="primary" type="submit">
                        Add an animal
                    </Button>
                </div>
            </Form>
        </Container>
    );
}

export default AddAnimal;