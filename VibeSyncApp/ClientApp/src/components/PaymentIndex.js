import React, { useContext, useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { RazorPayAppId } from './Constants';
import './PaymentIndex.css';
import { GetPaymentInitiationDetails, UpsertPayment } from './services/PaymentService';
import { MyContext } from '../App';
import VBLogo from '../Resources/VB_Logo_2.png';
import Promocode from './Promocode';

function PaymentIndex() {
    const { error, setError } = useContext(MyContext);
    const { errorMessage, setErrorMessage } = useContext(MyContext);
    // State to manage the image URL and description
    const navigate = useNavigate();
    const location = useLocation();
    const [amount, setAmount] = useState('');
    const [paymentStatus, setPaymentStatus] = useState(null);
    const [showSuccessMessage, setShowSuccessMessage] = useState(false);
    const [fetchingData, setFetchingData] = useState();
    const [paymentInitiationData, setPaymentInitiationData] = useState('');
    const [showPromoInput, setShowPromoInput] = useState(false);
    const [promoCode, setPromoCode] = useState('');
    const [isPromoValid, setIsPromoValid] = useState(false);
    const searchParams = new URLSearchParams(location.search);
    const rowDataString = searchParams.get('data');
    const rowData = JSON.parse(decodeURIComponent(rowDataString));
    const [isPromoApplied, setIsPromoApplied] = useState(false);

    const handlePromoApply = (applied) => {
        setIsPromoApplied(applied);
    };
    console.log(rowData);

    // Function to load and run the Razorpay script
    const loadRazorpayScript = async () => {
        const script = document.createElement('script');
        script.src = 'https://checkout.razorpay.com/v1/checkout.js';
        script.async = true;
        document.body.appendChild(script);

        script.onload = async () => {
            const parsedAmount = parseFloat(isPromoApplied ? (amount - 50) : amount);
            if (!isNaN(parsedAmount)) {
                // If it's a valid decimal, proceed with the request
                const obj = {
                    amount: parsedAmount * 100,
                    userId: localStorage.getItem('userId'),
                };
                try {
                    const res = await GetPaymentInitiationDetails(obj);
                    setPaymentInitiationData(res);

                    const options = {
                        key: RazorPayAppId, // Replace with your Razorpay Key ID
                        amount: parsedAmount * 100, // Amount is in currency subunits (e.g., 50000 for 500 INR)
                        currency: 'INR',
                        name: 'VibeSync', // Your business name
                        description: 'Test Transaction',
                        image: VBLogo,
                        order_id: paymentInitiationData.orderId, // Sample Order ID, replace with your order ID
                        handler: function (response) {
                            setPaymentStatus({
                                paymentId: response.razorpay_payment_id,
                                orderId: response.razorpay_order_id,
                                signature: response.razorpay_signature,
                            });
                            setShowSuccessMessage(true);
                            upsertPaymentDetails(res.orderId, response.razorpay_payment_id);
                        },
                        prefill: {
                            name: paymentInitiationData.userName, // Customer's name
                            email: paymentInitiationData.email,
                            // contact: '9518070741', // Customer's phone number
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

                    rzp.open();
                } catch (error) {
                    setError(true);
                    setErrorMessage(error.message);
                    console.error(error);
                }
            }
        };
    };

    async function upsertPaymentDetails(orderId, payId) {
        try {
            const obj = {
                UserId: localStorage.getItem('userId'),
                OrderId: orderId,
                TotalAmount: isPromoApplied ? amount - 50 : amount,
                PaymentId: payId,
                EventId: rowData.eventId,
                DjId: rowData.djId,
                SongId: rowData.songId,
                SongName: rowData.name,
                ArtistId: rowData.artists[0].id,
                ArtistName: rowData.artists[0].name,
                AlbumName: rowData.album.name,
                AlbumImage: rowData.album.images[0].url
            };

            var res = await UpsertPayment(obj);
            navigate('/songhistory');
        } catch (error) {
            // Handle the error and set error and error message
            setError(true); // Assuming setError is a state variable to manage errors
            setErrorMessage(error.message); // Assuming setErrorMessage is a state variable to set error messages
        }
    }

    // Function to handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();
        rowData['payment'] = { amount: isPromoApplied ? amount - 50 : amount };
        // await paymentHandler();
        // const rowDataString = encodeURIComponent(JSON.stringify(rowData));
        // // Navigate to the detail view with the serialized rowData as a parameter
        // navigate(`/paymentHandler?data=${rowDataString}`);

        console.log(rowData);
        // You can perform actions like uploading the image and description to a server here
        // alert("Payment Success!");
        //     navigate('/userhome')
    };
    return (
        <div className='song-details'>
            {/* Display the medium-sized image */}
            <img
                src={rowData.album.images[0].url}
                alt="Album Image"
                style={{ width: '300px', height: 'auto' }}
            />
            <p className='event-name'>{rowData.eventName}</p>
            <p className='song-name'>{rowData.name}</p>
            <p className='text-muted artist-name'>
                {rowData.artists.map((artist) => artist.name).join(', ')}
            </p>
            {/* <RazorpayPayment data={amount} /> */}
            <form onSubmit={handleSubmit} className='center-form'>
                <p className='label'>Tip the DJ (min amount: {rowData.minimumBid}):<br></br>
                <span className='subheading-payment'><i>Minimum amount is decided by the DJ.</i></span>
                </p>

                <input
                    className='amount-inputfield'
                    type="number"
                    placeholder='Enter amount in rupees'
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    required
                />
                <br></br>
                <Promocode onApply={handlePromoApply} />
                <br></br>

                <div>
                    <button
                        className={`btnPayment btn--primaryPayment btn--mediumPayment ${(rowData.eventStatus !== 'Live' || amount < rowData.minimumBid ) ? 'disabledButton' : ''}`}
                        id="rzp-button1"
                        onClick={loadRazorpayScript}
                        disabled={rowData.eventStatus !== 'Live' || amount < rowData.minimumBid }
                    >
                        Pay
                    </button>
                    {isPromoApplied && (
                        <span>Yayy! You will only pay {amount - 50}</span>
                    )}
                    {rowData.eventStatus !== 'Live' && (
                        <p style={{ textAlign: 'center' }}><i>DJ is not accepting requests right now.</i></p>
                    )}
                </div>
            </form>
            {/* Render the success message if showSuccessMessage is true */}
            {showSuccessMessage && (
                <div className="success-message">
                    Payment Successful!
                </div>
            )}
        </div>
    );
}
export default PaymentIndex;
