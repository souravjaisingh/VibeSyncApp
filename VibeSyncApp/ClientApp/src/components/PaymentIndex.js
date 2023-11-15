import React, { useContext, useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { RazorPayAppId } from './Constants';
import './PaymentIndex.css';
import { GetPaymentInitiationDetails, UpsertPayment } from './services/PaymentService';
import PaymentPage from './CCAvenue';
import SampleTransactionComponent from './CCAvenue2';
import { MyContext } from '../App';

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
    const searchParams = new URLSearchParams(location.search);
    const rowDataString = searchParams.get('data');
    const rowData = JSON.parse(decodeURIComponent(rowDataString));
    console.log(rowData);
    // useEffect(() => {
    //         let isMounted = true; // Add a variable to track component unmount

    //         async function fetchData() {
    //         // Ensure that the amount is a valid decimal number
    //         const parsedAmount = parseFloat(amount);
    //         if (!isNaN(parsedAmount)) {
    //             // If it's a valid decimal, proceed with the request
    //             const obj = {
    //             amount: parsedAmount,
    //             userId: localStorage.getItem('userId'),
    //             };
    //             try {
    //             // Indicate that data fetching is in progress
    //             if (isMounted) {
    //                 setFetchingData(true);
    //             }

    //             const res = await GetPaymentInitiationDetails(obj);

    //             // Check if the component is still mounted before updating state
    //             if (isMounted) {
    //                 setPaymentInitiationData(res);
    //                 console.log(res);
    //                 setFetchingData(false); // Data fetching is complete
    //             }
    //             } catch (error) {
    //             console.error("Error:", error);
    //             if (isMounted) {
    //                 setFetchingData(false); // Data fetching failed
    //             }
    //             }
    //         } else {
    //             console.error("Invalid amount:", amount);
    //         }
    //         }

    //         fetchData(); // Call the async function immediately

    //         // Clean-up: set isMounted to false when the component unmounts
    //         return () => {
    //         isMounted = false;
    //         };
    // }, [amount]);



    // Function to load and run the Razorpay script
    const loadRazorpayScript = async () => {
        const script = document.createElement('script');
        script.src = 'https://checkout.razorpay.com/v1/checkout.js';
        script.async = true;
        document.body.appendChild(script);

        script.onload = async () => {
            const parsedAmount = parseFloat(amount);
            if (!isNaN(parsedAmount)) {
                // If it's a valid decimal, proceed with the request
                const obj = {
                    amount: parsedAmount,
                    userId: localStorage.getItem('userId'),
                };
                try {
                    const res = await GetPaymentInitiationDetails(obj);
                    setPaymentInitiationData(res);

                    const options = {
                        key: RazorPayAppId, // Replace with your Razorpay Key ID
                        amount: amount, // Amount is in currency subunits (e.g., 50000 for 500 INR)
                        currency: 'INR',
                        name: 'VibeSync', // Your business name
                        description: 'Test Transaction',
                        image: 'https://example.com/your_logo',
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
                TotalAmount: amount,
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
            navigate('/userhome');
        } catch (error) {
            // Handle the error and set error and error message
            setError(true); // Assuming setError is a state variable to manage errors
            setErrorMessage(error.message); // Assuming setErrorMessage is a state variable to set error messages
        }
    }

    // Function to handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();
        rowData['payment'] = { amount: amount };
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
            <p className='song-name'>{rowData.name}</p>
            <p className='text-muted artist-name'>
                {rowData.artists.map((artist) => artist.name).join(', ')}
            </p>
            {/* <RazorpayPayment data={amount} /> */}
            <form onSubmit={handleSubmit}>
                <p className='label'>Tip the DJ here:</p>
                <input
                    type="number"
                    placeholder='Enter amount'
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    required
                />
                <br></br>
                {/* Submit button */}
                <button className=' btnPayment btn--primaryPayment btn--mediumPayment' id="rzp-button1" onClick={loadRazorpayScript}>Pay</button>
                <a href="phonepe://pay?pa=9728868875@okhdfcbank&pn=JohnDoe&cu=INR" class="upi-pay1">Pay Now !</a>

            </form>
            {/* <PaymentPage/> */}
            <Link to={'/ccavenue2'}>CCavenue2</Link>
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
