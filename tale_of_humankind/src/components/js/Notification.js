import React, { useState, useEffect } from 'react';
import { Alert } from 'react-bootstrap';

const Notification = () => {
    const [show, setShow] = useState(false);
    const [message, setMessage] = useState('');

    useEffect(() => {
        const urlParams = new URLSearchParams(window.location.search);
        const registered = urlParams.get('registered');
        const activated = urlParams.get('activated');
        if (registered) {
            setMessage('Sign up was successful, please check your email to activate your account!');
            setShow(true);
        } else if (activated === 'true') {
            setMessage('Account activated successfully :)');
            setShow(true);
        } else if (activated === 'false') {
            setMessage('Activation link is invalid :(');
            setShow(true);
        }
    }, []);

    if (show) {
        return (
            <Alert variant="success" onClose={() => setShow(false)} dismissible>
                <Alert.Heading>{message}</Alert.Heading>
            </Alert>
        );
    }
    return null;
};

export default Notification;
