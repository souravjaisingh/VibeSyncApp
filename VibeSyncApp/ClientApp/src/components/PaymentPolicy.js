import React, { useEffect } from 'react';
import './PaymentPolicy.css';
function PaymentPolicy() {
    useEffect(() => {
        document.documentElement.scrollTop = 0; // For modern browsers
        document.body.scrollTop = 0; // For older browsers
    }, [])
    return (
        <div className="payment-policy-container">
            <h1>Payments & Refund Policy</h1>
            <p>Last Updated: 27-12-2023</p>
            <p>Thank you for using Vibesync. This Payments & Refund Policy outlines the terms and conditions related to payments, song requests, and refunds on our platform.</p>

            <h4>1. Payments</h4>
            <h6>1.1 Song Requests</h6>
            <ul>
                <li>Users will be charged a flat fee per song request. The payment will be initiated when a user submits a song request.</li>
                <li>The payment will be processed only if the DJ accepts the song request.</li>
            </ul>
            <h6>1.2 Payment Methods</h6>
            <ul>
                <li>We accept payments through online methods (UPI, Credit/Debit Cards, etc.) only. Users are responsible for ensuring that their payment information is accurate and up to date.</li>
            </ul>
            <h6>1.3 Currency</h6>
            <ul>
                <li>All transactions are processed in INR. Users may be subject to currency conversion fees based on their location and payment method.</li>
            </ul>

            <h4>2. Refunds</h4>
            <h6>2.1 Accepted Song Requests</h6>
            <ul>
                <li>Once a DJ accepts a song request, the payment is considered final, and no refunds will be issued.</li>
            </ul>
            <h6>2.2 DJ Rejection</h6>
            <ul>
                <li>If a DJ rejects a song request, the pre-authorized amount will be released, and no money will be deducted from the user's account.</li>
            </ul>
            <h6>2.3 Technical Issues</h6>
            <ul>
                <li>In the event of technical issues, such as a song not being played or other platform-related problems, users may be eligible for a refund. Users must contact our customer support within 24 hours to report the issue and request a refund.</li>
            </ul>
            <h6>2.4 Refund Processing</h6>
            <ul>
                <li>Refunds, if applicable, will be processed to the original payment method used for the transaction.</li>
                <li>The processing time for refunds may vary and is subject to the policies of the payment processor.</li>
            </ul>

            <h4>3. User Responsibilities</h4>
            <ul>
                <li>Users are responsible for providing accurate and valid payment information.</li>
                <li>Users are encouraged to review their song requests carefully before submission, as refunds for accepted song requests will not be provided.</li>
            </ul>

            <h4>4. Changes to Payments & Refund Policy</h4>
            <p>We reserve the right to update or modify this Payments & Refund Policy at any time. Users will be notified of any changes through the platform or via email.</p>

            <h4>5. Contact Information</h4>
            <p>For any questions or concerns regarding payments, refunds, or this policy, please contact our customer support at <a href="mailto:vibesyncdj@gmail.com">vibesyncdj@gmail.com</a>.</p>

            <p>By using Vibesync, you agree to abide by the terms outlined in this Payments & Refund Policy.</p>
        </div>
    );
}

export default PaymentPolicy;
