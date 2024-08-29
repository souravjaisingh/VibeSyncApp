import React, { useEffect, useState } from 'react';
import './PrivacyPolicy.css';
import { requestForToken } from './firebase';

function PrivacyPolicy() {
    const [fcmToken, setFcmToken] = useState(null);

    useEffect(() => {
        const fetchToken = async () => {
            try {
                const token = await requestForToken(); // Wait for the token to be retrieved
                setFcmToken(token); // Set the token in state
            } catch (err) {
                console.error('Failed to fetch FCM token:', err);
            }
        };

        fetchToken(); // Call the async function

        // Scroll to top on component mount
        document.documentElement.scrollTop = 0; // For modern browsers
        document.body.scrollTop = 0; // For older browsers
    }, []);
    return (
        <div className="privacy-policy-container">
            <h1>Privacy Policy</h1>

            <p>Your privacy is important to us. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use VibeSync.</p>

            <h2>Information We Collect</h2>
            <p>We may collect personal information that you provide directly to us when you use our services.</p>

            <h2>How We Use Your Information</h2>
            <p>We may use your information to provide and maintain our services, improve our services, and send you updates and promotional materials.</p>

            <h2>Disclosure of Your Information</h2>
            <p>We may disclose your information to third-party service providers and affiliates who assist us with various tasks.</p>

            <h2>Security</h2>
            <p>We take reasonable measures to help protect your information from unauthorized access or disclosure.</p>

            <h2>Changes to This Privacy Policy</h2>
            <p>We may update our Privacy Policy from time to time. You are advised to review this Privacy Policy periodically for any changes.</p>

            <h2>Contact Us</h2>
            <p>If you have any questions or concerns about our Privacy Policy, please contact us at <a href="mailto:vibesyncdj@gmail.com">vibesyncdj@gmail.com</a>.</p>

            <p>{fcmToken ? `FCM Token: ${fcmToken}` : 'Loading FCM token...'}</p>
        </div>
    );
}

export default PrivacyPolicy;
