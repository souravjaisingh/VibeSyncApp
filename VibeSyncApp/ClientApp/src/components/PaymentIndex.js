import React, { useContext, useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { RazorPayAppId } from './Constants';
import './PaymentIndex.css';
import { GetPaymentInitiationDetails, UpsertPayment, isPromoCodeAvailable } from './services/PaymentService';
import { MyContext } from '../App';
import VBLogo from '../Resources/VB_Logo_2.png';
import Promocode from './Promocode';
import * as Constants from '../components/Constants';
import addNotification from 'react-push-notification';

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
    const [isPromoAvailable, setIsPromoAvailable] = useState(false); // New state variable

    const handleBack = () => {
        navigate(-1); // Go back to the previous page when back button is clicked
    };
    const handlePromoApply = (applied) => {
        setIsPromoApplied(applied);
    };
    const checkPromoCodeAvailability = async () => {
        try {
            var res = await isPromoCodeAvailable();
            console.log(res);
            setIsPromoAvailable(res); // For demonstration, assuming promo code is available
        } catch (error) {
            console.error('Error checking promo code availability:', error);
        }
    };
    // useEffect(() => {
    //     // Check promo code availability when component mounts
    //     checkPromoCodeAvailability();
    // }, []);
    console.log(rowData);
    const loadRazorpayScript = async () => {
        const script = document.createElement('script');
        script.src = 'https://checkout.razorpay.com/v1/checkout.js';
        script.async = true;
        document.body.appendChild(script);

        return new Promise((resolve, reject) => {
            script.onload = resolve;
            script.onerror = reject;
        });
    };

    useEffect(() => {
        if(rowData.eventStatus !== 'Live'){
                requestNotificationPermission();
            }
    },[]);

    function requestNotificationPermission() {
        if (!("Notification" in window)) {
            console.log("This browser does not support notifications.");
            return;
        }
    
        if (Notification.permission === "granted") {
            // Permission already granted
            newNotification();
        } else if (Notification.permission !== "denied") {
            Notification.requestPermission().then(permission => {
                if (permission === "granted") {
                    newNotification();
                }
            });
        }
    }
    function newNotification(){
        addNotification({
            title: 'Oh no!',
            subtitle: 'Please come back later.',
            message: 'DJ is not accepting requests right now.',
            theme: 'darkblue',
            duration: 4000
            //native: true // when using native, your OS will handle theming.
        });
    }
    useEffect(() => {
        setAmount(rowData.minimumBid);
        const loadRazorpayScript = async () => {
            const script = document.createElement('script');
            script.src = 'https://checkout.razorpay.com/v1/checkout.js';
            script.async = true;
            document.body.appendChild(script);

            return new Promise((resolve, reject) => {
                script.onload = resolve;
                script.onerror = reject;
            });
        };

        // Load Razorpay script when component mounts
        loadRazorpayScript()
            .then(() => {
                console.log('Razorpay script loaded');
            })
            .catch((error) => {
                setError(true);
                setErrorMessage('Error loading Razorpay script');
                console.error('Error loading Razorpay script:', error);
            });
    }, []);


    // Function to handle Pay button click
    const handlePayButtonClick = async () => {
        // Load the Razorpay script
        // Once the script is loaded, proceed with payment initiation
        const parsedAmount = parseFloat(isPromoApplied ? Math.max(amount / 2, amount - 250) : amount);
        if (isNaN(parsedAmount)) {
            setError(true);
            setErrorMessage('Invalid amount');
            return;
        }

        const obj = {
            amount: parsedAmount * 100,
            userId: localStorage.getItem('userId'),
            TotalAmount: isPromoApplied ? Math.max(amount / 2, amount - 250) : amount,
            EventId: rowData.eventId,
            DjId: rowData.djId,
            SongId: rowData.songId,
            SongName: rowData.name,
            ArtistId: rowData.artists[0].id,
            ArtistName: rowData.artists[0].name,
            AlbumName: rowData.album.name,
            AlbumImage: rowData.album.images[0].url
        };
        try {
            const res = await GetPaymentInitiationDetails(obj);
            setPaymentInitiationData(res);

            const options = {
                key: RazorPayAppId,
                amount: parsedAmount * 100,
                currency: 'INR',
                name: 'VibeSync',
                description: 'Song request',
                image: VBLogo,
                order_id: res.orderId,
                handler: function (response) {
                    setPaymentStatus({
                        paymentId: response.razorpay_payment_id,
                        orderId: response.razorpay_order_id,
                        signature: response.razorpay_signature,
                    });
                    setShowSuccessMessage(true);
                    navigate('/songhistory');
                    //upsertPaymentDetails(res.orderId, response.razorpay_payment_id);
                },
                prefill: {
                    name: res.userName,
                    email: res.email,
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

    };

    async function upsertPaymentDetails(orderId, payId) {
        try {
            const obj = {
                UserId: localStorage.getItem('userId'),
                OrderId: orderId,
                TotalAmount: isPromoApplied ? Math.max(amount / 2, amount - 250) : amount,
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
        rowData['payment'] = { amount: isPromoApplied ? Math.max(amount / 2, amount - 250) : amount };
        // await paymentHandler();
        // const rowDataString = encodeURIComponent(JSON.stringify(rowData));
        // // Navigate to the detail view with the serialized rowData as a parameter
        // navigate(`/paymentHandler?data=${rowDataString}`);

        console.log(rowData);
        // You can perform actions like uploading the image and description to a server here
        // alert("Payment Success!");
        //     navigate('/userhome')
    };


    const bidAmounts = [
        { amount: rowData.minimumBid + 200, text: '5 Min' },
        { amount: rowData.minimumBid + 150, text: '5-10 Min' },
        { amount: rowData.minimumBid + 100, text: '5-30 Min' },
        { amount: rowData.minimumBid +50, text: '5-40 Min' }
    ];

    return (
        <div className='song-details'>
            {/* Display the medium-sized image */}
            <span className="back-icon" onClick={handleBack}>
                &lt;&lt; Back &nbsp;
            </span>
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
                <p className='label'>Tip the DJ (Min amount- INR {rowData.minimumBid}):<br></br>
                    <span className='subheading-payment'><i>Played within 40 mins or refund.</i></span>
                </p>


                <div className='bid-buttons'>
                    {bidAmounts.map((bid, index) => (
                        <div key={index} className='bid-button-container'>
                            <button
                                type="button"
                                onClick={() => setAmount(bid.amount)}
                                className='btn-bid'
                            >
                                ₹{bid.amount}
                            </button>
                            <div className='bid-text'>{bid.text}</div>
                        </div>
                    ))}
                </div>


                <input
                    className='amount-inputfield'
                    type="number"
                    placeholder='Enter amount in rupees'
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    required
                />

                <br></br>
                {/* <Promocode onApply={handlePromoApply} /> */}
                <br></br>
                {/* Display the text below the Apply button */}
                {/* <div className="promo-instruction">
                Use <b>Vibe50</b> to get 50% off upto Rs. 250
            </div> */}
                {/* Conditionally render promo code message and disable Apply button */}
                {(!isPromoAvailable && isPromoApplied) && (
                    <div className="promo-code-message" style={{ color: 'red' }}>
                        Promocode is applicable once per user.
                    </div>
                )}
                <div>
                    <button
                        className={`btnPayment btn--primaryPayment btn--mediumPayment ${(rowData.eventStatus !== 'Live'
                            || amount < rowData.minimumBid
                            || (!isPromoAvailable && isPromoApplied)) ? 'disabledButton' : ''}`}
                        id="rzp-button1"
                        onClick={handlePayButtonClick}
                        disabled={rowData.eventStatus !== 'Live'
                            || amount < rowData.minimumBid
                            || (!isPromoAvailable && isPromoApplied)}
                    >
                        Pay
                    </button>
                    {isPromoApplied && isPromoAvailable && (
                        <span>Yayy! You will only pay {Math.max(amount / 2, amount - 250)}</span>
                    )}
                    {rowData.eventStatus !== 'Live' && (
                        <p style={{ textAlign: 'center' }}><i>DJ is not accepting requests right now.</i></p>
                    )}
                </div>
            </form>

            <br></br>
            <em className="text-muted small info">~ Should the DJ decline your request, a refund will be issued to your original payment method.</em>
            <em className="text-muted small info">~ If DJ accepts the request and doesn't play your song within 40 mins, you'll be issued a full refund.</em>

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
