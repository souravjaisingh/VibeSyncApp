import React from 'react';
import './TermsOfService.css';
import { Link } from 'react-router-dom';

function TermsOfService() {
    return (
        <div className="terms-of-service-container">
            <h1>Terms of Service</h1>

            <h2>1. Acceptance of Terms</h2>
            <p>By using VibeSync, you agree to comply with and be bound by these Terms of Service. If you do not agree to these terms, please do not use our services.</p>

            <h2>2. User Accounts</h2>
            <p>When you create an account on VibeSync, you are responsible for maintaining the security of your account. You agree to provide accurate and complete information during the registration process and to update it to keep it accurate and current.</p>

            <h2>3. User Conduct</h2>
            <p>You agree not to engage in any activity that:</p>
            <ul>
                <li>Violates any local, state, national, or international laws or regulations.</li>
                <li>Harasses, threatens, or abuses other users.</li>
                <li>Interferes with the proper functioning of VibeSync.</li>
                <li>Attempts to gain unauthorized access to VibeSync or its related systems and networks.</li>
            </ul>

            <h2>4. Content</h2>
            <p>VibeSync may contain user-generated content. We do not endorse or guarantee the accuracy, completeness, or quality of such content. You are solely responsible for the content you post on VibeSync.</p>

            <h2>5. Modifications</h2>
            <p>VibeSync reserves the right to modify or terminate the service at any time. We will provide notice of significant changes to these Terms of Service, but it is your responsibility to review them periodically.</p>

            <h2>6. Privacy</h2>
            <p>Your use of VibeSync is subject to our Privacy Policy, which can be found <Link to='/privacypolicy'> here </Link>.</p>

            <h2>7. Contact Us</h2>
            <p>If you have any questions or concerns about these Terms of Service, please contact us at vibesyncdj@gmail.com.</p>
        </div>
    );
}

export default TermsOfService;
