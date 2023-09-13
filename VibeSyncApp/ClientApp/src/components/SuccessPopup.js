import React, { useState } from 'react';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';

function SuccessPopup({ open, onClose, paymentStatus }) {
return (
    <Dialog open={open} onClose={onClose}>
        <DialogTitle>Payment Successful</DialogTitle>
        <DialogContent>
            <DialogContentText>
                Success
            {/* Payment ID: {paymentStatus.paymentId}
            <br />
            Order ID: {paymentStatus.orderId}
            <br />
            Signature: {paymentStatus.signature}
            Add more information as needed */}
            </DialogContentText>
        </DialogContent>
        <DialogActions>
            <Button onClick={onClose} color="primary" autoFocus>
            Close
            </Button>
        </DialogActions>
    </Dialog>
);
}

export default SuccessPopup;
