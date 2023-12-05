import React from 'react';
import { Alert } from 'react-bootstrap';

const Notification = ({ message, showNotification, onClose }) => {
    const handleClose = () => {
        if (onClose) {
            onClose();
        }
    };

    if (showNotification) {
        return (
            <Alert variant="success" onClose={handleClose} dismissible>
                <Alert.Heading>{message}</Alert.Heading>
            </Alert>
        );
    }
    return null;
};

export default Notification;