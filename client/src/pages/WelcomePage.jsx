import React from 'react';
import {Container} from "react-bootstrap";

function WelcomePage(){
    return (
        <Container className="d-flex justify-content-center align-items-center" style={{ minHeight: '100vh' }}>
            <div>
            <h1>Witam w naszym serwisie do adocji zwierząt</h1>
            </div>
        </Container>
    )
}

export default WelcomePage;