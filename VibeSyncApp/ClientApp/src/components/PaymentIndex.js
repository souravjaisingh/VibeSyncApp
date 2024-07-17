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
    const [isSpecialAnnouncement, setIsSpecialAnnouncement] = useState(true);
    const [isMicAnnouncement, setIsMicAnnouncement] = useState(true);
    const [micAnnouncementMessage, setMicAnnouncementMessage] = useState(''); // New state for mic announcement message
    const [localError, setLocalError] = useState('');
    const gstRate = 0.18;
    const gstAmount = Math.round(amount * gstRate);
    const totalAmountWithGst = amount + gstAmount;


    console.log(rowData);

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

    //useEffect(() => {
    //    console.log("RowData: ", rowData);
    //    if (rowData && rowData.IsSpecialAnnouncement !== undefined) {
    //        console.log("Setting IsSpecialAnnouncement: ", rowData.IsSpecialAnnouncement);
    //        setIsSpecialAnnouncement(rowData.IsSpecialAnnouncement);
    //    }
    //}, [rowData]);

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
        if (rowData.eventStatus !== 'Live') {
            requestNotificationPermission();
        }
    }, []);

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
    function newNotification() {
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
        setAmount(isSpecialAnnouncement ? rowData.minimumBid + 100 : rowData.minimumBid);

        if (rowData && rowData.IsSpecialAnnouncement !== undefined) {
            setIsSpecialAnnouncement(rowData.IsSpecialAnnouncement);
        }
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
        setLocalError('');

        // Check if mic announcement message is empty
        if (isSpecialAnnouncement && !micAnnouncementMessage) {
            setLocalError('Please Give a message for announcement!');
            console.log("Inside this function")
            return; // Stop execution if message is not provided
        }



        // Load the Razorpay script
        // Once the script is loaded, proceed with payment initiation
        const parsedAmount = parseFloat(isPromoApplied ? Math.max(amount / 2, amount - 250) : amount);
        if (isNaN(parsedAmount)) {
            setError(true);
            setErrorMessage('Invalid amount');
            return;
        }


        //const obj = {
        //    amount: parsedAmount * 100,
        //    userId: localStorage.getItem('userId'),
        //    TotalAmount: isPromoApplied ? Math.max(amount / 2, amount - 250) : amount,
        //    EventId: rowData.eventId,
        //    DjId: rowData.djId,
        //    SongId: rowData.songId,
        //    SongName: rowData.name,
        //    ArtistId: rowData.artists[0].id,
        //    ArtistName: rowData.artists[0].name,
        //    AlbumName: rowData.album.name,
        //    AlbumImage: rowData.album.images[0].url
        //};

        const isAnnouncement = rowData.isSpecialAnnouncement || rowData.isMicAnnouncement;
        let artistId = '';
        let artistName = '';
        let albumName = '';
        let albumImage = '';

        if (rowData.artists && rowData.artists[0]) {
            artistId = rowData.artists[0].id;
            artistName = rowData.artists[0].name;
        }

        if (rowData.album) {
            albumName = rowData.album.name;
            if (rowData.album.images && rowData.album.images[0]) {
                albumImage = rowData.album.images[0].url;
            }
        }

        const obj = {
            amount:totalAmountWithGst * 100,
            userId: localStorage.getItem('userId'),
            TotalAmount: isPromoApplied ? Math.max(amount / 2, amount - 250) : amount,
            EventId: rowData.eventId,
            DjId: rowData.djId,
            SongId: rowData.songId,
            SongName: rowData.name,
            ArtistId: artistId,
            ArtistName: artistName,
            AlbumName: albumName,
            AlbumImage: albumImage,
            MicAnnouncement: micAnnouncementMessage
        };



        try {
            const res = await GetPaymentInitiationDetails(obj);
            setPaymentInitiationData(res);

            const options = {
                key: RazorPayAppId,
                amount: parsedAmount * 100,
                currency: 'INR',
                name: 'VibeSync',
                description: rowData.isMicAnnouncement ? 'Mic announcement request' : 'Song request',
                image: VBLogo,
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
            // Handle error locally, preventing it from reaching the global handler
            setLocalError(error.message);
            console.error(error);
        }

    };

    //async function upsertPaymentDetails(orderId, payId) {
    //    try {
    //const obj = {
    //    UserId: localStorage.getItem('userId'),
    //    OrderId: orderId,
    //    TotalAmount: isPromoApplied ? Math.max(amount / 2, amount - 250) : amount,
    //    PaymentId: payId,
    //    EventId: rowData.eventId,
    //    DjId: rowData.djId,
    //    SongId: rowData.songId,
    //    SongName: rowData.name,
    //    ArtistId: rowData.artists[0].id,
    //    ArtistName: rowData.artists[0].name,
    //    AlbumName: rowData.album.name,
    //    AlbumImage: rowData.album.images[0].url
    //};

    async function upsertPaymentDetails(orderId, payId) {
        try {
            const obj = {
                UserId: localStorage.getItem('userId'),
                OrderId: orderId,
                TotalAmount: isPromoApplied ? Math.max(amount / 2, amount - 250) : amount,
                PaymentId: payId,
                EventId: rowData.eventId,
                DjId: rowData.djId,
                ...(rowData.isMicAnnouncement ? {
                    MicAnnouncement: micAnnouncementMessage
                } : {
                    SongId: rowData.songId,
                    SongName: rowData.name,
                    ArtistId: rowData.artists[0].id,
                    ArtistName: rowData.artists[0].name,
                    AlbumName: rowData.album.name,
                    AlbumImage: rowData.album.images[0].url
                })
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
        { amount: rowData.minimumBid + 50, text: '5-40 Min' }
    ];

    return (
        <div className='song-details'>
            {/* Display the medium-sized image */}

            <div className='bg-music-background'>
                {/* Conditionally render HTML or Album Image */}

                {isSpecialAnnouncement ? (
                    <div className='special-announcement-header'>
                        <div className='mic-announcement-button' onClick={() => setIsMicAnnouncement(true)}>
                            <img src="images/mic2.png" />
                            <p>Mic Announcement (₹100)</p>
                            {isMicAnnouncement ? (<>
                                <img className='check-box' src="images/tick_checkbox.png" />
                            </>) : (<>
                                <img className='check-box' src="images/untick_checkbox.png" />
                            </>)}
                        </div>
                        {isMicAnnouncement ? (
                            <>
                                <div className='mic-announcement-buttons'>
                                    <button onClick={() => document.getElementById('message-mic-text').value = "Happy Birthday"}>Happy Birthday</button>
                                    <button onClick={() => document.getElementById('message-mic-text').value = "Happy Anniversary"}>Happy Anniversary</button>
                                    <button onClick={() => document.getElementById('message-mic-text').value = "Congratulations"}>Congratulations</button>
                                </div>

                                <textarea id="message-mic-text" placeholder="Type your message.." maxlength="40" className='mic-announcement-message' value={micAnnouncementMessage} onChange={(e) => {
                                    setMicAnnouncementMessage(e.target.value);
                                    if (localError) setLocalError(''); // Clear error message on typing
                                }} // Update the mic announcement message
                                />
                                   {localError && <p style={{ color: 'red', fontWeight: 'bold' ,textAlign : 'center' }}>{localError}</p>}
                            </>
                        ) : (<></>)}
                        <div className='mic-announcement-button' onClick={() => setIsMicAnnouncement(false)}>
                            <img src="images/screen.png" /><p>Screen Announcement (₹100)</p>
                            {isMicAnnouncement ? (<>
                                <img className='check-box' src="images/untick_checkbox.png" />
                            </>) : (<>
                                <img className='check-box' src="images/tick_checkbox.png" />
                            </>)}
                        </div>

                        {isMicAnnouncement ? (
                            <>

                            </>
                        ) : (<>

                            <div className='mic-announcement-buttons'>
                                <button onClick={() => document.getElementById('message-screen-text').value = "Happy Birthday"}>Happy Birthday</button>
                                <button onClick={() => document.getElementById('message-screen-text').value = "Happy Anniversary"}>Happy Anniversary</button>
                                <button onClick={() => document.getElementById('message-screen-text').value = "Congratulations"}>Congratulations</button>
                            </div>
                            <div className='screen-announcement-upload-section'>
                                <textarea id="message-screen-text" placeholder="Type your message.." maxlength="40" className='screen-announcement-message' />
                                <div class="upload-container" onClick={() => document.getElementById('file-upload').click()}>
                                    <div class="upload-icon">&#128190;</div>
                                    <div class="upload-text">Upload File</div>
                                    <input type="file" id="file-upload" />
                                </div>
                            </div>
                        </>)}

                    </div>
                ) : (
                    <>
                        <div className='song-details-container'>
                            <img
                                src={rowData.album.images[0].url}
                                alt="Album Image"
                            />
                            <div className='song-details-text'>
                                <p className='song-name'>{rowData.name}</p>
                                <p className='artist-name'>
                                    {rowData.artists.map((artist) => artist.name).join(', ')}
                                </p>
                            </div>
                        </div>
                            <div className='subheading-payment'>
                                <img src="images/disclaimerIcon.png" className= 'disclaimer-icon' />
                               Played within 30 mins or refund </div>
                    </>
                )}
                {/* <RazorpayPayment data={amount} /> */}
                <form onSubmit={handleSubmit} className='center-form'>

                    <div className='amount-selection-division'>

                        <p className='minimum-bid-container'>
                            <div>Groove Amount</div>
                            <div className='minimum-bid-value'>₹{rowData.minimumBid}</div>
                        </p>

                        <div className='bid-buttons'>
                            {bidAmounts.map((bid, index) => (
                                <div key={index} className='bid-button-container'>
                                    <button
                                        type="button"
                                        onClick={() => setAmount(bid.amount + rowData.minimumBid)}
                                        className='btn-bid'
                                    >
                                        ₹{bid.amount}
                                    </button>
                                </div>
                            ))}
                        </div>

                        <div className='tip-amount-section'>
                            <div className='choose-tip-label'>
                                Choose the Tip
                            </div>
                            <div className='tip-amount-input-btns'>
                                <div onClick={() => { setAmount(amount - 10) }} className='decrease-tip-button'>-</div>
                                <input
                                    className='amount-inputfield'
                                    type="number"
                                    placeholder='Enter amount in rupees'
                                    value={amount - rowData.minimumBid}
                                    onChange={
                                        (e) => {
                                            const value = e.target.value;
                                            // Regular expression to check if the value is an integer
                                            const integerRegex = /^\d*$/;

                                            if (integerRegex.test(value)) {
                                                // If value is an integer, update the amount state
                                                setAmount(value === '' ? rowData.minimumBid : Number(value) + rowData.minimumBid);
                                            }
                                        }
                                    }
                                    required
                                />
                                <div onClick={() => { setAmount(amount + 10) }} className='increase-tip-button'>+</div>
                            </div>
                        </div>
                        <br></br>
                        <div className='gst-info'>
                            <div>GST (18%)</div>
                            <div>₹{gstAmount}</div>
                        </div>
                        <br></br>
                        <div className='promocode'>
                            <span>Promocode</span>
                            <input
                                type="text"
                                className="value"
                                placeholder="Login to apply"
                            />
                            <button className="apply-btn">Apply</button>
                        </div>
                        

                    </div>
                    <div className='tip-info'>
                        <img src="images/disclaimerIcon.png" />
                        <p>{isSpecialAnnouncement ? ("More you tip, the sooner your announcement will be made") : ("More you tip, higher chances of song being played")}</p>
                    </div>

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
                            <div className='payment-btn-text'>
                                <img className='payment-icon' src="images/payment.png" />
                                <div>Pay | ₹{totalAmountWithGst}</div>
                            </div>
                        </button>
                        {isPromoApplied && isPromoAvailable && (
                            <span>Yayy! You will only pay {Math.max(amount / 2, amount - 250)}</span>
                        )}
                        {rowData.eventStatus !== 'Live' && (
                            <p style={{ textAlign: 'center' }}><i>DJ is not accepting requests right now.</i></p>
                        )}
                    </div>
                </form>

                <div className='login-proposal'>
                    <img className='login-img' src="images/log_in.png" />
                    <p>Login & Get 50% off instantly!</p>
                </div>

                <div className='refund-info-footer'>
                    <p>~ Should the DJ decline your request, a refund will be issued to your original payment method.</p>
                    <p>~ If DJ accepts the request and doesn't play your song within 30 mins, you'll be issued a full refund.</p>
                </div>
                {/* Render the success message if showSuccessMessage is true */}
                {showSuccessMessage && (
                    <div className="success-message">
                        Payment Successful!
                    </div>
                )}
            </div>
        </div>
    );
}
export default PaymentIndex;

