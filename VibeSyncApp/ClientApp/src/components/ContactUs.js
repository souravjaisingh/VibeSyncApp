import React, { useEffect } from 'react';
import './ContactUs.css';

function ContactUs() {
    useEffect(() => {
        document.documentElement.scrollTop = 0; // For modern browsers
        document.body.scrollTop = 0; // For older browsers
    }, [])
    return (
        <div className="contact-us-container">
            <h1>Contact Us</h1>

            <p>If you have any questions, suggestions, or need assistance, please don't hesitate to contact us. You can reach us via email, phone, or by mail at the following details:</p>

            <p>Email: <a href="mailto:vibesyncdj@gmail.com">vibesyncdj@gmail.com</a></p>
            <p>Phone: <a href="tel:+1234567890">+91 9896403333 (Girik Jain)</a></p>
            <p>Address: #1429/6, Ganesh Bhawan,, Near Old Post Office, Ambala, Haryana, India 134003</p>

            <p>We value your feedback and look forward to hearing from you!</p>
        </div>
    );
}

export default ContactUs;
