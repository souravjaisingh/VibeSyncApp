import React, { useEffect, useState } from 'react';
import { GetPaymentInitiationDetails } from './services/PaymentService';

function RazorpayPayment(props) {
    const { amount } = props;
    console.log(amount);
    const [paymentStatus, setPaymentStatus] = useState(null);

    useEffect(async () => {
    var obj = {
        amount : amount,
        userId : localStorage.getItem('userId')
    }
    var res = await GetPaymentInitiationDetails(obj);
    console.log(res);
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    document.body.appendChild(script);

    script.onload = () => {
        const options = {
        key: 'rzp_test_De36fMcorSCmnJ', // Replace with your Razorpay Key ID
        amount: amount, // Amount is in currency subunits (e.g., 50000 for 500 INR)
        currency: 'INR',
        name: 'VibeSync', // Your business name
        description: 'Test Transaction',
        image: 'https://example.com/your_logo',
        order_id: 'order_MbLgwcLyHQDWHh', // Sample Order ID, replace with your order ID
        handler: function (response) {
            setPaymentStatus({
            paymentId: response.razorpay_payment_id,
            orderId: response.razorpay_order_id,
            signature: response.razorpay_signature,
            });
        },
        prefill: {
            name: 'Gaurav Kumar', // Customer's name
            email: 'gaurav.kumar@example.com',
            contact: '9518070741', // Customer's phone number
        },
        notes: {
            address: 'Razorpay Corporate Office',
        },
        theme: {
            color: '#3399cc',
        },
        };

        const rzp = new window.Razorpay(options);

        rzp.on('payment.failed', function (response) {
        setPaymentStatus({
            error: {
            code: response.error.code,
            description: response.error.description,
            source: response.error.source,
            step: response.error.step,
            reason: response.error.reason,
            orderId: response.error.metadata.order_id,
            paymentId: response.error.metadata.payment_id,
            },
        });
        });

        document.getElementById('rzp-button1').addEventListener('click', function (e) {
        rzp.open();
        e.preventDefault();
        });
    };

    return () => {
        // Clean up the script tag when the component unmounts
        document.body.removeChild(script);
    };
    }, [amount, setPaymentStatus]);

    return (
    <div>
        <button id="rzp-button1">Pay</button>
        {paymentStatus && (
        <div>
            <h3>Payment Status:</h3>
            {paymentStatus.error ? (
            <div>
                <p>Error:</p>
                <p>Code: {paymentStatus.error.code}</p>
                <p>Description: {paymentStatus.error.description}</p>
                {/* Add more error information as needed */}
            </div>
            ) : (
            <div>
                <p>Payment Successful!</p>
                <p>Payment ID: {paymentStatus.paymentId}</p>
                <p>Order ID: {paymentStatus.orderId}</p>
                <p>Signature: {paymentStatus.signature}</p>
            </div>
            )}
        </div>
        )}
    </div>
    );
}

export default RazorpayPayment;
