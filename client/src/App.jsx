import { BrowserRouter as Router, Routes, Route, Link, Navigate } from 'react-router-dom';
import React, { useState, useEffect } from 'react';
import { Navbar, Nav } from 'react-bootstrap';
import './App.css';
import Login from './pages/Login';
import Signup from './pages/Signup';
import NotFound from "./pages/NotFound.jsx";
import Home from "./pages/Home.jsx";
import WelcomePage from "./pages/WelcomePage.jsx";
import Activate from "./pages/Activate.jsx";
import MyAnimals from "./pages/MyAnimals.jsx";
import AdoptionRequests from "./pages/AdoptionRequests.jsx";
import MyRequests from "./pages/MyRequests.jsx";
import AddPosition from "./pages/AddPosition.jsx";

function Logout({ setIsLoggedIn }) {
    useEffect(() => {
        localStorage.clear(); // Clear local storage
        sessionStorage.clear(); // Clear session storage if used
        setIsLoggedIn(false); // Set logged-in state to false
    }, [setIsLoggedIn]); // Ensure dependency is correct

    return <Navigate to="/login" />;
}

function App() {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [userRole, setUserRole] = useState(null);

    useEffect(() => {
        // Re-check if user is logged in after state changes (for a more immediate update)
        const token = sessionStorage.getItem('access');
        const role = sessionStorage.getItem('role');
        setIsLoggedIn(!!token);
        setUserRole(role);
    }, [isLoggedIn]);

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
                                {userRole === 'shelter' && (
                                    <>
                                        <Nav.Link as={Link} to="/my-animals" className="text-dark">My Animals</Nav.Link>
                                        <Nav.Link as={Link} to="/adoption-requests" className="text-dark">Adoption Requests</Nav.Link>
                                    </>
                                )}
                                {userRole === 'adopter' && (
                                    <Nav.Link as={Link} to="/my-requests" className="text-dark">My Requests</Nav.Link>
                                )}
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
                <Route path="/login" element={<Login setIsLoggedIn={setIsLoggedIn} setUserRole={setUserRole} />} />
                <Route path="/signup" element={<Signup />} />
                <Route path="/activate/:uid/:token" element={<Activate />} />
                <Route path="/logout" element={<Logout setIsLoggedIn={setIsLoggedIn} />} />
                <Route path="/my-animals" element={userRole === 'shelter' ? <MyAnimals /> : <Navigate to="/home" />} />
                <Route path="/adoption-requests" element={userRole === 'shelter' ? <AdoptionRequests /> : <Navigate to="/home" />} />
                <Route path="/my-requests" element={userRole === 'adopter' ? <MyRequests /> : <Navigate to="/home" />} />
                <Route path="/add-animal" element={<AddPosition />} />
                <Route path="/*" element={<NotFound />} />
            </Routes>
        </Router>
    );
}

export default App;