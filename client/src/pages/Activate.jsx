import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import api from '../api';

const Activation = () => {
    const { uid, token } = useParams();
    const [message, setMessage] = useState('Activating your account...');

    useEffect(() => {
        const activateAccount = async () => {
            try {
                const response = await api.get(`/activate/${uid}/${token}/`);
                setMessage('Your account is activated! Good luck and love animals!');
            } catch (error) {
                setMessage('Activation failed. The link may be invalid or expired.');
            }
        };

        activateAccount();
    }, [uid, token]);

    return (
        <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '100vh' }}>
            <h2>{message}</h2>
        </div>
    );
};

export default Activation;