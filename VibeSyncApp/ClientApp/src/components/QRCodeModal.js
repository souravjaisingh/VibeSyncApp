import React from 'react';
import QRCodeDirect from './QrCodeDirect';
import Modal from 'react-modal';
import './QRCodeModal.css';

const customStyles = {
    content: {
        top: '50%',
        left: '50%',
        right: 'auto',
        bottom: 'auto',
        marginRight: '-50%',
        transform: 'translate(-50%, -50%)',
    },
};

Modal.setAppElement('#root'); // Set the root element as the app element

export default function QRCodeModal({ isOpen, onRequestClose, eventId }) {
    console.log(eventId);
    return (
        <Modal
            isOpen={isOpen}
            onRequestClose={onRequestClose}
            style={customStyles}
            contentLabel="QR Code Modal"
        >
            <button className="close-button" onClick={onRequestClose}>
                <span>&times;</span>
            </button>
            <QRCodeDirect eventId={eventId}/>
        </Modal>
    );
}
