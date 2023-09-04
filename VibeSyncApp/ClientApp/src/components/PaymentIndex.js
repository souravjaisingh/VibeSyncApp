    import React, { useState } from 'react';
    import { useLocation, useNavigate } from 'react-router-dom';
    import './PaymentIndex.css';
import { Button } from './Button';

    function PaymentIndex() {
    // State to manage the image URL and description
    const navigate = useNavigate();
    const location = useLocation();
    const searchParams = new URLSearchParams(location.search);
    const rowDataString = searchParams.get('data');
    const rowData = JSON.parse(decodeURIComponent(rowDataString));
    console.log(rowData);
    // Function to handle form submission
    const handleSubmit = (e) => {
    e.preventDefault();
    // You can perform actions like uploading the image and description to a server here
    alert("Payment Success!");
        navigate('/userhome')
    };

    return (
    <div className='song-details'>
        {/* Display the medium-sized image */}
        <img
        src={rowData.album.images[0].url}
        alt="Album Image"
        style={{ width: '300px', height: 'auto' }}
        />
        <p  className='song-name'>{rowData.name}</p>
        <p className='text-muted artist-name'>{rowData.artists[0].name}</p>

        <form onSubmit={handleSubmit}>
            <p className='label'>Tip the DJ here:</p>
            <input
                type="number"
                placeholder='Enter amount'
                required
            />
            <br></br>
            {/* Submit button */}
            <button className=' btnPayment btn--primaryPayment btn--mediumPayment' type="submit">Pay</button>
            </form>
    </div>
    );
    }

    export default PaymentIndex;
