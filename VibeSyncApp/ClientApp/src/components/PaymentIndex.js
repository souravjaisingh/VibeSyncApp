import React, { useContext, useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { RazorPayAppId } from "./Constants";
import "./PaymentIndex.css";
import {
  GetPaymentInitiationDetails,
  UpsertPayment,
  isPromoCodeAvailable,
} from "./services/PaymentService";
import { MyContext } from "../App";
import VBLogo from "../Resources/VB_Logo_2.png";
import Promocode from "./Promocode";
import * as Constants from "../components/Constants";
import addNotification from "react-push-notification";

import GoogleLogin from "./GoogleLogin";
import { useLoadingContext } from "./LoadingProvider";
import { loginUserHelper } from "../Helpers/UserHelper";

import StickyBar from "./StickyBar";
import { messages } from "./Constants";
import {  loginWithOTPHelper } from '../Helpers/UserHelper';
import loadOTPScript from './Msg91OTP';


function PaymentIndex() {
  const { error, setError } = useContext(MyContext);
  const { errorMessage, setErrorMessage } = useContext(MyContext);
  // State to manage the image URL and description
  const navigate = useNavigate();
  const location = useLocation();
  const [amount, setAmount] = useState("");
  const [paymentStatus, setPaymentStatus] = useState(null);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [fetchingData, setFetchingData] = useState();
  const [paymentInitiationData, setPaymentInitiationData] = useState("");
  const [showPromoInput, setShowPromoInput] = useState(false);
  const [promoCode, setPromoCode] = useState("");
  const [isPromoValid, setIsPromoValid] = useState(false);
  const [loginDiscount,setLoginDiscount] = useState(false);
  let searchParams;
  let rowDataString;
  try{
    searchParams = new URLSearchParams(location.state.rowData);
  }
  catch{
    window.location = '/userhome';
  }
  rowDataString = searchParams.get("data");
  const [rowData,setRowData] = useState(JSON.parse(decodeURIComponent(rowDataString)));
  const [isPromoApplied, setIsPromoApplied] = useState(false);
  const [isPromoAvailable, setIsPromoAvailable] = useState(false); // New state variable
  const [isSpecialAnnouncement, setIsSpecialAnnouncement] = useState(true);
  const [isMicAnnouncement, setIsMicAnnouncement] = useState(true);
  const [micAnnouncementMessage, setMicAnnouncementMessage] = useState(""); // New state for mic announcement message
  const [localError, setLocalError] = useState("");
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showGoogleLogin, setShowGoogleLogin] = useState(false);
  const [loginMethod, setLoginMethod] = useState("mobile"); // State to track the login method
  const [email, setEmail] = useState("");
  const [emailFocused, setEmailFocused] = useState(false);
  const [password, setPassword] = useState("");
  const [passwordFocused, setPasswordFocused] = useState(false);
  const [loginError, setLoginError] = useState(null);
  const { setLoading } = useLoadingContext();
  const [successMessage, setSuccessMessage] = useState("");
  const [showInfoBox, setShowInfoBox] = useState(false); // State variable to track visibility of info box
  const [userId, setUserId] = useState(localStorage.getItem('userId'));


  const [gstAmount, setGstAmount] = useState(0);
    const [totalAmountWithGst, setTotalAmountWithGst] = useState(0);
    const [originalBid, setoriginalBid] = useState(rowData.IsSpecialAnnouncement ? rowData.minimumBidForSpecialRequest : rowData.minimumBid);

    const phoneRegex = /^[6-9]\d{9}$/;
    const [mobileNo, setMobileNo] = useState(null);
    const [otp, setOtp] = useState(new Array(4).fill(""));
    const [otpReturnMessage, setOtpReturnMessage] = useState('');
    let timer;
    let countdown = 30;

    useEffect(() => {
        loadOTPScript();
    }, [])

    const handleGetOtp = () => {
        if (!phoneRegex.test(document.getElementById('mobile-no').value) || document.getElementById('mobile-no').value.length != 10) {
            document.getElementById('mobile-no').style.border = 'solid';
            document.getElementById('mobile-no').style.borderColor = 'red';
            document.getElementById('mobile-no').style.borderWidth = '3px';
        }
        else {
            window.sendOtp(
                '91' + document.getElementById('mobile-no').value, // mandatory
                (data) => {
                    console.log(data);
                    setOtpReturnMessage(data.message);
                    timer = setInterval(updateTimer, 1000);
                    setTimeout(() => { document.getElementById('resendOtp').style.opacity = 0.6; }, 1000)
                    // setTimeout(() => { document.getElementById('resendOtp').disabled = true; }, 1000)
                    setMobileNo(document.getElementById('mobile-no').value)
                },
                (error) => {
                    console.log(error)
                    document.getElementById('mobile-no').style.border = 'solid';
                    document.getElementById('mobile-no').style.borderColor = 'red';
                    document.getElementById('mobile-no').style.borderWidth = '3px';
                }
            );
        }
    };

    const handleOtpChange = (element, index) => {
        if (isNaN(element.value)) return false;

        setOtp([...otp.map((d, idx) => (idx === index ? element.value : d))]);

        //Focus next input
        if (element.nextSibling) {
            element.nextSibling.focus();
        }
    };

    const handleVerifyOtp = () => {
        console.log(otp.join(""));

        window.verifyOtp(
            otp.join(""), // OTP value
            (data) => {
                console.log('OTP verified: ', data)
                handleOtpVerificationSuccessful();
            }, // optional
            (error) => {
                console.log(error)
                handleOtpVerificationRejected();
            }, // optional
            otpReturnMessage // optional
        );
    }

    function startResendTimer() {
        document.getElementById('resendOtp').style.opacity = 0.6;
        document.getElementById('resendOtp').disabled = true;
        window.retryOtp(
            '11', // channel value mandatory
            (data) => console.log('resend data: ', data), // optional
            (error) => console.log(error), // optional
            otpReturnMessage // optional
        );
        timer = setInterval(updateTimer, 1000);
    }

    function updateTimer() {
        try {
            const timerElement = document.getElementById('timer');

            if (countdown > 0) {
                timerElement.textContent = `(${countdown})`;
                countdown--;
            } else {
                document.getElementById('resendOtp').style.opacity = 1;
                document.getElementById('resendOtp').disabled = false;
                timerElement.textContent = '';

                countdown = 45;

                clearInterval(timer);
            }
        }
        catch {

        }
    }

    const handleOtpVerificationSuccessful = async () => {
        console.log(mobileNo);
        setLoading(true);
        var response = await loginWithOTPHelper(mobileNo);
        setLoading(false);
        if (!response.error) {
            console.log("OTP verification successful. User stays on the current page.")
            console.log(response);

            // Update local storage
            localStorage.setItem('userId', response.id);
            localStorage.setItem('isUser', response.isUser);
            setUserId(localStorage.getItem('userId'));

            // Close the popup
            setShowLoginModal(false);

            // Show success message
            setSuccessMessage('OTP verification successful!');
            
            setTimeout(() => {
                setSuccessMessage('');
            }, 3000); // Message will be cleared after 3 seconds
        }
        else {
            //setShowErrorMessage(true);
        }
    }

    const handleOtpVerificationRejected = async () => {
        const otpButtons = document.getElementsByClassName('otp-field');
        for (let i = 0; i < otpButtons.length; i++) {
            otpButtons[i].style.borderColor = 'red';
        }
    }

  const handleImageClick = () => {
    setShowGoogleLogin((prevState) => !prevState); // Toggle Google login visibility
  };

  const handleShow = () => setShowLoginModal(true);

  const handleClose = () => {
    setShowLoginModal(false);
    setLoginMethod("mobile"); // Reset to mobile login when closing the modal
    setShowGoogleLogin(false);
    setEmail("");
    setPassword("");
    setLoginError(null);
  };

  const handleEmailIconClick = () => {
    setLoginMethod((prevMethod) =>
      prevMethod === "email" ? "mobile" : "email"
    ); // Toggle between email and mobile login
    setShowGoogleLogin(false);
  };

  const handleInputChange = (e) => {
      const { id, value } = e.target;
    if (id === "email") {
      setEmail(value);
    }
    if (id === "password") {
      setPassword(value);
    }
  };

  const handleForgotPasswordClick = () => {
    setShowInfoBox(!showInfoBox);
  };

  const handleLogin = async () => {
    setLoginError(false);
    try {
      if (!email || !password) {
        setLoginError(true);
        return;
      }

      setLoading(true);
      const response = await loginUserHelper(email, password);
      setLoading(false);

      if (response && response.isUser === true) {
        localStorage.setItem("userId", response.id);
        localStorage.setItem("isUser", true);
        setUserId(localStorage.getItem('userId'));
        setSuccessMessage("Login successful");

        const currentUrl = window.location.pathname;
        const redirectUrl = localStorage.getItem("redirectUrl");

        if (currentUrl === "/paymentIndex") {
          console.log("Staying on the payments page");
          
          setTimeout(() => {
            setShowLoginModal(false);
            setSuccessMessage("");
          }, 1000); // Close modal after 2 seconds
        } else if (redirectUrl) {
          setTimeout(() => {
            setShowLoginModal(false);
            setSuccessMessage("");
            navigate(redirectUrl);
          }, 1000); // Close modal after 2 seconds
        } else {
          setTimeout(() => {
            setShowLoginModal(false);
            setSuccessMessage("");
            navigate("/userhome");
          }, 1000); // Close modal after 2 seconds
        }
      } else if (response && response.isUser === false) {
        localStorage.setItem("userId", response.id);
        localStorage.setItem("isUser", false);
        setSuccessMessage("Login successful");
        setTimeout(() => {
          setShowLoginModal(false);
          setSuccessMessage("");
          navigate("/djhome");
        }, 1000); // Close modal after 2 seconds
      } else {
        setLoginError(true);
      }
    } catch (error) {
      setLoginError(true);
      setErrorMessage("Incorrect email or password.");
      setLoading(false);
    }
  };

  const [isStickyBarVisible, setIsStickyBarVisible] = useState(true);

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
      console.error("Error checking promo code availability:", error);
    }
  };

  const loadRazorpayScript = async () => {
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    document.body.appendChild(script);

    return new Promise((resolve, reject) => {
      script.onload = resolve;
      script.onerror = reject;
    });
    };

    const handleTipChange = (newAmount) => {
        if (newAmount >= 0) {
            setAmount(newAmount);
        }
    };

    const handleDecreaseTip = () => {
        const currentTip = amount - (isSpecialAnnouncement ? rowData.minimumBidForSpecialRequest : rowData.minimumBid);
        const newTipAmount = Math.max(0, currentTip - 10); // Ensure the tip amount does not go below zero
        setAmount(newTipAmount + (isSpecialAnnouncement ? rowData.minimumBidForSpecialRequest : rowData.minimumBid));
    };

    const handleIncreaseTip = () => {
        setAmount(amount + 10);
    };

    useEffect(() => {
        setAmount(isSpecialAnnouncement ? Math.round(rowData.minimumBidForSpecialRequest ) : rowData.minimumBid);
    }, [isSpecialAnnouncement, rowData.minimumBid, rowData.minimumBidForSpecialRequest]);


    useEffect(() => {
        const minimumBid = isSpecialAnnouncement ? rowData.minimumBidForSpecialRequest : rowData.minimumBid;
        const gst = Math.round(minimumBid * 0.18); // Calculate GST as 18% of the minimum bid and round to nearest integer
        setGstAmount(gst);
        setTotalAmountWithGst(Math.round(amount + gst)); // Update total amount including GST and round to nearest integer
    }, [isSpecialAnnouncement, rowData.minimumBid, rowData.minimumBidForSpecialRequest, amount]);


    const handleLoginSuccess = () => {
      console.log("handle login success called");
      setUserId(localStorage.getItem('userId'));
  };

  useEffect(() => {
    if (rowData.eventStatus !== "Live") {
      requestNotificationPermission();
    }
    if(localStorage.getItem('userId')!=null && localStorage.getItem('userId')!=0){
      setLoginDiscount(true);
      let rowData_to_change = rowData;
        /* rowData_to_change.minimumBid = Math.floor(rowData.minimumBid / 2);*/

        // Check if it's a special announcement
        if (rowData.IsSpecialAnnouncement) {
            rowData_to_change.minimumBidForSpecialRequest = Math.floor(rowData.minimumBidForSpecialRequest / 2);
        } else {
            rowData_to_change.minimumBid = Math.floor(rowData.minimumBid / 2);
        }
      setRowData(rowData_to_change)
    }
  }, [userId]);

  function requestNotificationPermission() {
    if (!("Notification" in window)) {
      console.log("This browser does not support notifications.");
      return;
    }

    if (Notification.permission === "granted") {
      // Permission already granted
      newNotification();
    } else if (Notification.permission !== "denied") {
      Notification.requestPermission().then((permission) => {
        if (permission === "granted") {
          newNotification();
        }
      });
    }
  }
  function newNotification() {
    addNotification({
      title: "Oh no!",
      subtitle: "Please come back later.",
      message: "DJ is not accepting requests right now.",
      theme: "darkblue",
      duration: 4000,
      //native: true // when using native, your OS will handle theming.
    });
  }
  useEffect(() => {
    //setAmount(
    //  isSpecialAnnouncement
    //    ? Math.round(rowData.minimumBid * 1.1)
    //    : rowData.minimumBid
    //);

    if (rowData && rowData.IsSpecialAnnouncement !== undefined) {
      setIsSpecialAnnouncement(rowData.IsSpecialAnnouncement);
    }
    const loadRazorpayScript = async () => {
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
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
        console.log("Razorpay script loaded");
      })
      .catch((error) => {
        setError(true);
        setErrorMessage("Error loading Razorpay script");
        console.error("Error loading Razorpay script:", error);
      });
  }, []);

  // Function to handle Pay button click
  const handlePayButtonClick = async () => {
    setLoading(true);
    setLocalError("");

    // Check if mic announcement message is empty
    if (isSpecialAnnouncement && !micAnnouncementMessage) {
        setLocalError("Please give a message for announcement!");
        setLoading(false);
      console.log("Inside this function");
      return; // Stop execution if message is not provided
    }

    // Load the Razorpay script
    // Once the script is loaded, proceed with payment initiation
    const parsedAmount = parseFloat(
      isPromoApplied ? Math.max(amount / 2, amount - 250) : amount
    );
    if (isNaN(parsedAmount)) {
      setError(true);
      setErrorMessage("Invalid amount");
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

    const isAnnouncement =
      rowData.isSpecialAnnouncement || rowData.isMicAnnouncement;
    let artistId = "";
    let artistName = "";
    let albumName = "";
    let albumImage = "";

    if (rowData.artists && rowData.artists.primary && rowData.artists.primary[0]) {
      artistId = rowData.artists.primary[0].id;
      artistName = rowData.artists.primary[0].name;
    }

    if (rowData.album) {
      albumName = rowData.album.name;
    }
    if (rowData.image && rowData.image[0]) {
      albumImage = rowData.image[0].url;
    }

    const obj = {
      amount: totalAmountWithGst * 100,
      userId: localStorage.getItem("userId"),
      TotalAmount: isPromoApplied ? Math.max(amount / 2, amount - 250) : amount,
      EventId: rowData.eventId,
      DjId: rowData.djId,
      SongId: rowData.songId,
      SongName: rowData.name,
      ArtistId: artistId,
      ArtistName: artistName,
      AlbumName: albumName,
      AlbumImage: albumImage,
      MicAnnouncement: micAnnouncementMessage,
    };

    try {
      const res = await GetPaymentInitiationDetails(obj);
      setPaymentInitiationData(res);

      const options = {
        key: RazorPayAppId,
        amount: parsedAmount * 100,
        currency: "INR",
        name: "VibeSync",
        description: rowData.isMicAnnouncement
          ? "Mic announcement request"
          : "Song request",
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
          navigate("/songhistory");
          //upsertPaymentDetails(res.orderId, response.razorpay_payment_id);
        },
        prefill: {
          name: res.userName,
          email: res.email,
        },
        notes: {
          address: "Razorpay Corporate Office",
        },
        theme: {
          color: "#3399cc",
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.on("payment.failed", function (response) {
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
    setLoading(false);
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
        UserId: localStorage.getItem("userId"),
        OrderId: orderId,
        TotalAmount: isPromoApplied
          ? Math.max(amount / 2, amount - 250)
          : amount,
        PaymentId: payId,
        EventId: rowData.eventId,
        DjId: rowData.djId,
        ...(rowData.isMicAnnouncement
          ? {
              MicAnnouncement: micAnnouncementMessage,
            }
          : {
              SongId: rowData.songId,
              SongName: rowData.name,
              ArtistId: rowData.artists[0].id,
              ArtistName: rowData.artists[0].name,
              AlbumName: rowData.album.name,
              AlbumImage: rowData.album.images[0].url,
            }),
      };

      var res = await UpsertPayment(obj);
      navigate("/songhistory");
    } catch (error) {
      // Handle the error and set error and error message
      setError(true); // Assuming setError is a state variable to manage errors
      setErrorMessage(error.message); // Assuming setErrorMessage is a state variable to set error messages
    }
  }

  // Function to handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    rowData["payment"] = {
      amount: isPromoApplied ? Math.max(amount / 2, amount - 250) : amount,
    };
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
    { amount: 19, text: "5-40 Min" },
    { amount: 49, text: "5-30 Min" },
    { amount: 79, text: "5-10 Min" },
    { amount: 99, text: "5 Min" },
  ];

  return (
    <div className="song-details">
      {/* Display the medium-sized image */}

      <div className="bg-music-background">
        {/* Conditionally render HTML or Album Image */}
        {/* <button className="back-button-payment-index" onClick={()=>navigate(-1)}>{'<<'}Back</button> */}


        {isSpecialAnnouncement ? (
          <div className="special-announcement-header">
            {rowData.acceptingRequests && (
              <div
                className="mic-announcement-button"
                onClick={() => setIsMicAnnouncement(true)}
              >
                <img src="images/mic2.png" />
                <p>Mic Announcement</p>
                <img className="check-box" src="images/tick_checkbox.png" />
              </div>
            )}
            {rowData.acceptingRequests && isMicAnnouncement && (
              <>
                <div className="mic-announcement-buttons">
                  <button
                    onClick={() =>
                      (document.getElementById("message-mic-text").value =
                        "Happy Birthday")
                    }
                  >
                    Happy Birthday
                  </button>
                  <button
                    onClick={() =>
                      (document.getElementById("message-mic-text").value =
                        "Happy Anniversary")
                    }
                  >
                    Happy Anniversary
                  </button>
                  <button
                    onClick={() =>
                      (document.getElementById("message-mic-text").value =
                        "Congratulations")
                    }
                  >
                    Congratulations
                  </button>
                </div>

                <textarea
                  id="message-mic-text"
                  placeholder="Type your message.."
                  maxlength="100"
                  className="mic-announcement-message"
                  value={micAnnouncementMessage}
                  onChange={(e) => {
                    setMicAnnouncementMessage(e.target.value);
                    if (localError) setLocalError(""); // Clear error message on typing
                  }} // Update the mic announcement message
                />
                <div className="subheading-payment">
                  <img
                    src="images/disclaimerIcon.png"
                    className="disclaimer-icon"
                  />
                  Played within 30 mins or refund{" "}
                </div>
                {localError && (
                  <p
                    style={{
                      color: "red",
                      fontWeight: "bold",
                      textAlign: "center",
                    }}
                  >
                    {localError}
                  </p>
                )}
              </>
            )}
            {rowData.displayRequests && (
              <div
                className="mic-announcement-button"
                onClick={() => setIsMicAnnouncement(true)}
              >
                <img src="images/screen.png" />
                <p>Screen Announcement</p>
                <img className="check-box" src="images/tick_checkbox.png" />
              </div>
            )}
            {rowData.displayRequests && isMicAnnouncement && (
              <>
                <div className="mic-announcement-buttons">
                  <button
                    onClick={() =>
                      (document.getElementById("message-screen-text").value =
                        "Happy Birthday")
                    }
                  >
                    Happy Birthday
                  </button>
                  <button
                    onClick={() =>
                      (document.getElementById("message-screen-text").value =
                        "Happy Anniversary")
                    }
                  >
                    Happy Anniversary
                  </button>
                  <button
                    onClick={() =>
                      (document.getElementById("message-screen-text").value =
                        "Congratulations")
                    }
                  >
                    Congratulations
                  </button>
                </div>
                <div className="screen-announcement-upload-section">
                  <textarea
                    id="message-screen-text"
                    placeholder="Type your message.."
                    maxLength="40"
                    className="screen-announcement-message"
                  />
                  <div
                    className="upload-container"
                    onClick={() =>
                      document.getElementById("file-upload").click()
                    }
                  >
                    <div className="upload-icon">&#128190;</div>
                    <div className="upload-text">Upload File</div>
                    <input type="file" id="file-upload" />
                  </div>
                </div>
              </>
            )}
          </div>
        ) : (
          <>
            <div className="song-details-container">
              <img
                src={rowData.image[rowData.image.length - 1].url}
                alt="Album Image"
              />
              <div className="song-details-text">
                <p className="song-name-payment">{rowData.name}</p>
                <p className="artist-name">
                  {rowData.artists.primary
                    .map((artist) => artist.name)
                    .join(", ")}
                </p>
              </div>
            </div>
            <div className="subheading-payment">
              <img
                src="images/disclaimerIcon.png"
                className="disclaimer-icon"
              />
              Played within 30 mins or refund{" "}
            </div>
          </>
        )}
        {/* <RazorpayPayment data={amount} /> */}
        <form onSubmit={handleSubmit} className="center-form">
          <div className="amount-selection-division">
            <p className="minimum-bid-container">
              <div>Request Amount</div>
                          <div className="minimum-bid-value"> ₹{ originalBid}</div>
            </p>
            {loginDiscount&&(<div className="gst-info">
              <div>Discount</div>
               <div>- ₹{isSpecialAnnouncement
                        ? Math.max(1, rowData.minimumBidForSpecialRequest)
                        : Math.max(1, rowData.minimumBid)
               }</div>
            </div>)}
            <div className="gst-info">
              <div>GST (18%)</div>
              <div>₹{gstAmount}</div>
            </div>


            <div className="tip-amount-section">
              <div className="choose-tip-label">Tip the Dj</div>
              <div className="tip-amount-input-btns">
                <div
                  onClick={handleDecreaseTip}
                  className="decrease-tip-button"
                >
                  -
                </div>
                <input
                  className="amount-inputfield"
                  type="number"
                  placeholder="Enter amount in rupees"
                  value={Math.max(0, amount - (rowData.IsSpecialAnnouncement ? rowData.minimumBidForSpecialRequest : rowData.minimumBid))}
                  onChange={(e) => {
                    const value = e.target.value;
                    // Regular expression to check if the value is an integer
                    const integerRegex = /^\d*$/;

                    if (integerRegex.test(value)) {
                      // If value is an integer, update the amount state
                        const newTipAmount = value === "" ? 0 : Number(value);
                        const newTotalAmount = newTipAmount + (rowData.IsSpecialAnnouncement ? rowData.minimumBidForSpecialRequest : rowData.minimumBid);

                        if (newTipAmount >= 0) {
                            setAmount(newTotalAmount);
                        }
                    }
                  }}
                  required
                />
                <div
                  onClick={handleIncreaseTip}
                  className="increase-tip-button"
                >
                  +
                </div>
              </div>
            </div>
            <div className="bid-buttons">
              {bidAmounts.map((bid, index) => (
                <div key={index} className="bid-button-container">
                  <button
                    type="button"
                          onClick={() => handleTipChange(bid.amount + (rowData.IsSpecialAnnouncement ? rowData.minimumBidForSpecialRequest : rowData.minimumBid))}
                    className="btn-bid"
                  >
                    ₹{bid.amount}
                  </button>
                </div>
              ))}
            </div>
            <br></br>
            {/*<div className="promocode">*/}
            {/*  <span>Promocode</span>*/}
            {/*  <div className="apply-button-login-promo">*/}
            {/*  <input*/}
            {/*    type="text"*/}
            {/*    className="value"*/}
            {/*    placeholder="Login to apply"*/}
            {/*    disabled*/}
            {/*  />*/}
            {/*  <button className="apply-btn">Apply</button>*/}
            {/*  </div>*/}
            {/*</div>*/}
          </div>
          <div className="tip-info">
            <div className="tip-info-content">
              <img src="images/disclaimerIcon.png" />
              <p>
                {isSpecialAnnouncement
                  ? "More you tip, the sooner your announcement will be made"
                  : "More you tip, higher chances of song being played"}
              </p>
            </div>
          </div>
                  {rowData.eventStatus !== "Live" && (
                    <div style={{ textAlign: "center",marginTop:'5px' }}>
                      <div className="tip-info-live">
                        <div className="tip-info-content">
                          
                        <svg width="20" height="20" fill="none" stroke="black" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" viewBox="0 0 24 24">
                          <path d="M12 2L2 22h20L12 2z" fill="none" stroke="black" stroke-width="2" />
                          <path d="M12 10v4M12 18h.08" stroke="black" stroke-width="2" />
                        </svg>
                          
                          &nbsp;DJ will start taking requests after {new Date(rowData.eventStartDateTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true })}!
                          </div>
                        </div>  
                    </div>
                  )}
          {/* <Promocode onApply={handlePromoApply} /> */}
          
          {/* Display the text below the Apply button */}
          {/* <div className="promo-instruction">
                Use <b>Vibe50</b> to get 50% off upto Rs. 250
            </div> */}
          {/* Conditionally render promo code message and disable Apply button */}
          {!isPromoAvailable && isPromoApplied && (
            <div className="promo-code-message" style={{ color: "red" }}>
              Promocode is applicable once per user.
            </div>
          )}
          <div>
            <button
            className={`btnPayment btn--primaryPayment btn--mediumPayment ${
              rowData.eventStatus !== "Live" ||
              amount < (rowData.IsSpecialAnnouncement ? rowData.minimumBidForSpecialRequest : rowData.minimumBid) ||
              (!isPromoAvailable && isPromoApplied)
              ? "disabledButton"
              : ""
              }`}  
              id="rzp-button1"
              onClick={handlePayButtonClick}
                disabled={
                rowData.eventStatus !== "Live" ||
                amount < (rowData.IsSpecialAnnouncement ? rowData.minimumBidForSpecialRequest : rowData.minimumBid) ||
                (!isPromoAvailable && isPromoApplied)
  }
            >
              <div className="payment-btn-text">
                <img className="payment-icon" src="images/payment.png" />
                <div>Pay | ₹{totalAmountWithGst}</div>
              </div>
            </button>
            <p style={{fontSize:'0.7rem',marginTop:'15px'}}>By clicking Pay you are agreeing to our <a href="termsofservice">Terms of service.</a></p>
            {isPromoApplied && isPromoAvailable && (
              <span>
                Yayy! You will only pay {Math.max(amount / 2, amount - 250)}
              </span>
            )}
          </div>
        </form>

        <div>
          {/* Other content */}
          <StickyBar
            type="bid"
            data={messages}
            minAmount={rowData.minimumBid}
            onClose={() => {
              setIsStickyBarVisible(false);
            }}
            isVisible={isStickyBarVisible}
          />
        </div>
       

                {showLoginModal && (
                    <div className="modal-overlay" onClick={handleClose}>
                        <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                            <div className="modal-header">
                                <span className="payment-page-modal-title">Login</span>
                            </div>
                            <div className="modal-body">
                                {successMessage ? (
                                    <div className="success-message">{successMessage}</div>
                                ) : (
                                    <>
                                        {loginMethod === 'mobile' ? (
                                              <>
                                                  {mobileNo === null ? (<div className='mobile-number-container'>
                                                      <div>
                                                          <img className='user-image-icon-lander' src="images/user_image_lander.png" />
                                                          <input id="mobile-no" type="tel" pattern="[0-9]*" inputMode="numeric" className='mobile-number-input' placeholder='Mobile Number'  autocomplete="tel" />
                                                      </div>
                                                      <button onClick={handleGetOtp} className='get-otp-button-payments' style={{ width: "37%",borderRadius: "5px", marginTop: "12px", height: "39px", boxShadow: "none", padding: "8px", fontWeight: "700" }}>Send OTP</button>
                                                  </div>) : (<div className='otp-verify-section'>
                                                      <div className='sent-otp-text'>OTP sent at: <div className='mobile-no-text'>+91-{mobileNo}</div></div>
                                                      {otp.map((data, index) => {
                                                          return (
                                                              <input
                                                                  className="otp-field"
                                                                  type="tel"
                                                                  pattern="[0-9]*"
                                                                  inputMode="numeric" 
                                                                  name="otp"
                                                                  maxLength="1"
                                                                  key={index}
                                                                  value={data}
                                                                  onChange={e => handleOtpChange(e.target, index)}
                                                                  onFocus={e => e.target.select()}
                                                              />
                                                          );
                                                      })}
                                                      <div className='verify-resend-btn-group'>
                                                          <button onClick={handleVerifyOtp} className='get-otp-button-lander'>Verify OTP</button>
                                                          <button id='resendOtp' onClick={startResendTimer} className='resend-otp-button'>Resend OTP <span id="timer"></span></button>
                                                      </div>
                                                  </div>)

                                                  }

                                                 

                                              </>
                                        ) : (
                                            <>
                                                <div className="payment-page-email">
                                                            {loginError ? <span className='password-warning'>Incorrect Email Id/Password.</span> : ''}
                                                            {errorMessage === "Invalid Password" ? <p style={{ color: 'red', fontWeight: 'bold', textAlign: 'center' }}>{errorMessage}</p> : null}
                                                            <div className="payment-page-input-container">
                                                        
                                                                   {/* <img src="images/emailIcon.png" alt="Email" className="payment-page-input-icon" />*/}
                                                        
                                                                <input required type="email" id="email" className='payment-page-input-field' value={email} onChange={(e) => handleInputChange(e)} onFocus={() => setEmailFocused(true)} onBlur={() => setEmailFocused(false)} placeholder="Email" />
                                                    </div>
                                                            <div className="payment-page-input-container">
                                                       
                                                                    {/*<img src="images/password_lock.png" width="20px" height = "20px" alt="Password" className="payment-page-input-icon " />*/}
                                                        
                                                                <input required type="password"  id="password" className='payment-page-input-field' style={{ width: "200px", marginLeft: "0px" } } value={password} onChange={(e) => handleInputChange(e)} onFocus={() => setPasswordFocused(true)} onBlur={() => setPasswordFocused(false)} placeholder="Password" />
                                                    </div>
                                                          <button onClick={handleLogin} type="submit" className="pop-up-btn" style={{ width: "37%", height: "39px", boxShadow: "none", padding: "8px", fontWeight: "700" ,paddingBottom:"11px"}}>Login</button>
                                                            
                                                                <div className='forgot-password-container'>
                                                                    <div onClick={handleForgotPasswordClick}>Forgot Password?</div>
                                                                    {showInfoBox ? (<div id='forgot-password-tip'>Please send an email to vibesyncdj@gmail.com with your Email/Phone Number.
                                                                        We're here at your disposal.</div>) : (<></>)}
                                                                </div>
                                                            
                                                        </div>
                                            </>
                                        )}
                                        <div className="text-center " style={{ color: "#39125C", fontWeight: "600", marginTop: "5px", marginBottom: "3px" }}>Or Login with</div>
                                        <div className="auth-buttons">
                                            <div>
                                                <img src="images/g.png" className="g-icon" onClick={handleImageClick} />
                                            </div>
                                            {showGoogleLogin && (
                                                <GoogleLogin
                                                      isUser={{ isUser: true }}
                                                      triggerLogin={(login) => login()}
                                                      showButton={false}
                                                      onLoginSuccess={handleLoginSuccess} // Pass the success handler
                                                      setShowLoginModal={setShowLoginModal}
                                                />
                                            )}
                                            <div className='btn-mobile' onClick={handleEmailIconClick}>
                                                  <img src={loginMethod === 'email' ? "images/user_image.png" : "images/e-icon.png"} className="email-icon" style={{padding: "5px"}} alt="Toggle login method" />
                                            </div>
                                            </div>
                                            { /*<div className="footer-links">
                                                   <a style={{ color: "#39125C" }} onClick={handleClose}>Create Account</a>
                                                   <a style={{ color: "#39125C" } } onClick={handleClose}>Forgot Password?</a>
                                              </div> */}
                  </>
                )}
              </div>
            </div>
          </div>
        )}

        <div className="refund-info-footer">
          <p>
            ~ If the DJ decline your request, a refund will be issued to your
            original payment method.
          </p>
          <p>
            ~ If DJ accepts the request and doesn't play your song within 30
            mins, you'll be issued a full refund.
          </p>
        </div>
        {/* Render the success message if showSuccessMessage is true */}
        {showSuccessMessage && (
          <div className="success-message">Payment Successful!</div>
        )}
      </div>
    </div>
  );
}
export default PaymentIndex;
