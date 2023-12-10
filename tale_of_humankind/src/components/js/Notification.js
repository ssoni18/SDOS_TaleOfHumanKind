import React, { useState, useEffect } from 'react';
import { Alert } from 'react-bootstrap';

const Notification = ({ message, showNotification, onClose }) => {
    const [visible, setVisible] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => {
            setVisible(false);
            if (onClose) {
                onClose();
            }
        }, 5000);
        return () => clearTimeout(timer);
    }, [showNotification]);

    if (visible && showNotification) {
        return (
            <Alert variant="success" onClose={onClose} dismissible>
                <Alert.Heading>{message}</Alert.Heading>
            </Alert>
        );
    }
    return null;
};

export default Notification;