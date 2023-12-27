import React from 'react';
import './Footer.css';
import { Button } from './Button';
import { Link } from 'react-router-dom';

function Footer() {
    // Function to scroll to the top
    const scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth' // for smooth scrolling
        });
    };
  return (
    <div className='footer-container'>
      {/* <section className='footer-subscription'>
        <p className='footer-subscription-heading'>
          Join the Adventure newsletter to receive our best vacation deals
        </p>
        <p className='footer-subscription-text'>
          You can unsubscribe at any time.
        </p>
        <div className='input-areas'>
          <form>
            <input
              className='footer-input'
              name='email'
              type='email'
              placeholder='Your Email'
            />
            <Button buttonStyle='btn--outline'>Subscribe</Button>
          </form>
        </div>
      </section> */}
      <div class='footer-links'>
        <div className='footer-link-wrapper'>
          <div class='footer-link-items'>
            <h2>About Us</h2>
                      <Link to='/aboutus' onClick={scrollToTop}>How it works</Link>
                      <Link to='/termsofservice' onClick={scrollToTop}>Terms of Service</Link>
                      <Link to='/privacypolicy' onClick={scrollToTop}>Privacy Policy</Link>
                      <Link to='/paymentpolicy' onClick={scrollToTop}>Payments & Refunds</Link>
                      <Link to='/contactus' onClick={scrollToTop}>Contact Us</Link>
          </div>
        </div>
        <div className='footer-link-wrapper'>
          {/* <div class='footer-link-items'>
            <h2>Videos</h2>
            <Link to='/'>Submit Video</Link>
            <Link to='/'>Ambassadors</Link>
            <Link to='/'>Agency</Link>
            <Link to='/'>Influencer</Link>
          </div> */}
                  <div className='footer-link-items'>
                      <h2>Social Media</h2>
                      <a href="https://www.instagram.com/vibesync.in/?igshid=MW0wdXN3dzdxdW5qcQ%3D%3D" target="_blank" rel="noopener noreferrer">Instagram</a>
                  </div>
        </div>
      </div>
      <section class='social-media'>
        <div class='social-media-wrap'>
          {/* <div class='footer-logo'>
            <Link to='/' className='social-logo'>
              VibeSync
              <i class='fab fa-typo3' />
            </Link>
          </div> */}
          <div className="centered-text">
            <small class='website-rights'>VibeSync © 2023</small>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Footer;
