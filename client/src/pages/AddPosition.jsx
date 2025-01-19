import React, { useState } from 'react';
import {Container, Button, Form, FormControl, FormGroup, FormLabel, FormCheck} from 'react-bootstrap';
import api from '../api';
import axios from 'axios';


function AddAnimal(){
    const [formData, setFormData] = useState({
        photo: null,
        name: '',
        species: '',
        breed: '',
        age: '',
        sex: '',
        description: ''
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
        const data = new FormData();
        for (const key in formData) {
            data.append(key, formData[key]);
        }

        try {
            const token = sessionStorage.getItem('access'); // Replace with your actual token
            console.log(token);
            const response = await axios.post('http://localhost:8000/api/add-animal/', data, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'multipart/form-data',
                },
            });
            if (response.ok) {
                alert('Animal added successfully!');
            } else {
                alert('Failed to add animal.');
            }
        } catch (error) {
            console.error('Error:', error);
            alert('An error occurred while adding the animal.');
        }
    };

    return(
        <Container>
            <Form onSubmit={handleSubmit}>
                <FormGroup controlId="photo" className="mb-5 form-control-lg">
                    <FormLabel>Image</FormLabel>
                    <FormControl type="file" name="photo" onChange={handleChange} />
                </FormGroup>
                <FormGroup controlId="name" className="mb-5 form-control-lg">
                    <FormLabel>Name</FormLabel>
                    <FormControl type="text" placeholder="Enter name"/>
                </FormGroup>
                <FormGroup controlId="species" className="mb-5 form-control-lg">
                    <FormLabel>Species</FormLabel>
                    <FormControl type="text" placeholder="Enter species"/>
                </FormGroup>
                <FormGroup controlId="breed" className="mb-5 form-control-lg">
                    <FormLabel>Breed</FormLabel>
                    <FormControl type="text" placeholder="Enter breed"/>
                </FormGroup>
                <FormGroup controlId="age" className="mb-5 form-control-lg">
                    <FormLabel>Age</FormLabel>
                    <FormControl type="number" placeholder="Enter age" min="0" max="100"/>
                </FormGroup>
                <FormGroup controlId="sex" className="mb-5 form-control-lg">
                    <FormLabel>Sex</FormLabel>
                    <FormCheck type="radio" label="Male" id="male" name="sex"/>
                    <FormCheck type="radio" label="Female" id="female" name="sex"/>
                </FormGroup>
                <FormGroup controlId="description" className="mb-5 form-control-lg">
                    <FormLabel>Description</FormLabel>
                    <FormControl as="textarea" rows={5} placeholder="Enter description"/>
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
