import { BrowserRouter as Router, Routes, Route, Link, Navigate } from 'react-router-dom';
import React, { useState, useEffect } from 'react';
import { Navbar, Nav } from 'react-bootstrap';
import './App.css';
import Login from './pages/Login';
import Signup from './pages/Signup';
import NotFound from "./pages/NotFound.jsx";
import Home from "./pages/Home.jsx";
import WelcomePage from "./pages/WelcomePage.jsx";

function Logout({ setIsLoggedIn }) {
    localStorage.clear();
    setIsLoggedIn(false);
    return <Navigate to="/login" />;
}

function App() {
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    useEffect(() => {
        const token = localStorage.getItem('access'); // Checking for the access token
        setIsLoggedIn(!!token);
    }, []);

    return (
        <Router>
            <Navbar bg="light" expand="lg" className="p-3">
                <Navbar.Brand className="fw-bold">SoBaAdoption</Navbar.Brand>
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className="ms-auto">
                        {isLoggedIn ? (
                            <>
                                <Nav.Link as={Link} to="/home" className="text-dark">Home</Nav.Link>
                                <Nav.Link as={Link} to="/logout" className="text-dark">Log Out</Nav.Link>
                            </>
                        ) : (
                            <>
                                <Nav.Link as={Link} to="/login" className="text-dark">Log In</Nav.Link>
                                <Nav.Link as={Link} to="/signup" className="text-dark">Sign Up</Nav.Link>
                            </>
                        )}
                    </Nav>
                </Navbar.Collapse>
            </Navbar>

            <Routes>
                <Route path="/" element={<WelcomePage />} />
                <Route path="/home" element={isLoggedIn ? <Home /> : <Navigate to="/login" />} />
                <Route path="/login" element={<Login setIsLoggedIn={setIsLoggedIn} />} />
                <Route path="/signup" element={<Signup />} />
                <Route path="/logout" element={<Logout setIsLoggedIn={setIsLoggedIn} />} />
                <Route path="/*" element={<NotFound />} />
            </Routes>
        </Router>
    );
}

export default App;