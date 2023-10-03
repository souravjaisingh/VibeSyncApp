import React from 'react';
import { Link } from 'react-router-dom';

const PaymentPage = () => {
    const redirectToCCAvenue = () => {
        // Construct the CCAvenue payment URL with your credentials and payment details
        const merchantId = '2872610';
        const accessCode = 'AVHH14KI48BM55HHMB';
        const orderId = new Date();
        const YOUR_REDIRECT_URL = 'https://vibesyncappservice.azurewebsites.net/';
        const YOUR_CANCEL_URL = 'https://vibesyncappservice.azurewebsites.net/';
        const amount = '100.00'; // Replace with the actual amount

        const redirectUrl = `https://test.ccavenue.com/transaction/transaction.do?command=initiateTransaction&merchant_id=${merchantId}&order_id=${orderId}&amount=${amount}&redirect_url=${YOUR_REDIRECT_URL}&cancel_url=${YOUR_CANCEL_URL}&currency=INR&language=EN`;

        // Redirect the user to the CCAvenue checkout page
        window.location.href = redirectUrl;
    };

    return (
        <div>
        <h1>Payment Page</h1>
        <button onClick={redirectToCCAvenue}>Proceed to Payment</button>
        </div>
    );
};

export default PaymentPage;
