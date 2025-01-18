import React, { useState } from 'react';
import api from '../api';
import { Button, Form, Container } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

const Login = ({ setIsLoggedIn, setUserRole }) => {
    const [formData, setFormData] = useState({
        username: '',
        password: '',
    });
    const [message, setMessage] = useState('');
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await api.post('/api/token/', formData);
            sessionStorage.setItem('access', response.data.access);
            sessionStorage.setItem('refresh', response.data.refresh);

            // Fetch user's profile to get the role
            const profileResponse = await api.get('/api/user/profile/', {
                headers: {
                    Authorization: `Bearer ${response.data.access}`,
                },
            });
            sessionStorage.setItem('role', profileResponse.data.role);

            setIsLoggedIn(true); // Update login state
            setUserRole(response.data.role);
            setMessage('Login successful!');
            setTimeout(() => navigate('/home'), 1000); // Redirect after 1 second
        } catch (error) {
            setMessage(error.response?.data?.detail || 'Invalid credentials.');
        }
    };

    return (
        <Container className="d-flex justify-content-center align-items-center" style={{ minHeight: '100vh' }}>
            <Form onSubmit={handleSubmit} className="w-50">
                <h2 className="mb-4">LOGIN</h2>

                {message && (
                    <div className={`alert ${message === 'Login successful!' ? 'alert-success' : 'alert-danger'}`}>
                        {message}
                    </div>
                )}

                <Form.Group controlId="formBasicUsername" className="mb-3">
                    <Form.Label>Username</Form.Label>
                    <Form.Control
                        type="text"
                        name="username"
                        placeholder="Enter your username"
                        value={formData.username}
                        onChange={handleChange}
                        required
                    />
                </Form.Group>

                <Form.Group controlId="formBasicPassword" className="mb-3">
                    <Form.Label>Password</Form.Label>
                    <Form.Control
                        type="password"
                        name="password"
                        placeholder="Enter your password"
                        value={formData.password}
                        onChange={handleChange}
                        required
                    />
                </Form.Group>

                <Button variant="primary" type="submit" className="w-100">
                    Enter
                </Button>
            </Form>
        </Container>
    );
};

export default Login;