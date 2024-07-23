import React, { useState } from 'react';
import './UserLogin.css';
import { Link, useNavigate } from 'react-router-dom';
import GoogleLogin from './GoogleLogin';
import Switch from './LoginToggleButton';

function Cards() {
  const [isUser, setIsUser] = useState(false);
  const navigate = useNavigate();

  const handleAnonymousLogin = () => {
    // Implement your anonymous login logic here
    console.log("Performing anonymous login...");
    localStorage.setItem('userId', 0); //0 id means it's Anonymous.
    localStorage.setItem('isUser', true);
    navigate('/userhome')

  };

  return (
    <div className={`cards `}>
      <div className='cards__container'>
        <div className='lander-header'>
          <div>
            <img className='lander-logo-desktop' src="images/VSlogo.png" style={{ width: '30vw', marginTop: '20px', color: '#39125C' }} />
            <img className='lander-logo-mobile' src="images/lander_vibesync.png" style={{ width: '90vw', marginTop: '20px', color: '#39125C', marginBottom: '10px' }} />
          </div>
        </div>
        <div className='lander-main-content'>
          <div className='main-selection-content'>
            <div className='middle-content-lander-page'>
              <p className='tagline-header'>INDIA'S FIRST EVER SONG REQUEST APP!</p>
              <button onClick={handleAnonymousLogin} className='req-anonymously-button'>
                Request Anonymously
              </button>
              <p>OR</p>
              <p className='choose-login-label'>CHOOSE LOGIN TYPE</p>
              <div className='user-dj-toggle'>
                {isUser ? (<><span onClick={() => setIsUser(!isUser)} className='dj-user-toggle-img checked-dj-user dj-button-img'><span>DJ</span></span>
                  <span onClick={() => setIsUser(!isUser)} className='dj-user-toggle-img user-button-img'><span>User</span></span></>) :
                  (<><span onClick={() => setIsUser(!isUser)} className='dj-user-toggle-img dj-button-img' ><span>DJ</span></span>
                    <span onClick={() => setIsUser(!isUser)} className='dj-user-toggle-img checked-dj-user user-button-img'><span>User</span></span></>)}
              </div>
              <div className='mobile-number-container'>
                <div>
                  <img className='user-image-icon-lander' src = "images/user_image_lander.png"/>
                  <input className='mobile-number-input' placeholder='Mobile Number' />
                </div>
                <button className='get-otp-button-lander'>Get OTP</button>
              </div>
              <div>
                <p>Or login with</p>
              </div>
              <div className='google-email-login-container'>
                <GoogleLogin isUser={!isUser} />
                <Link to='/loginForm' className='btn-mobile'>
                  <img src="images/emailIcon.png" className='email-icon' />
                </Link>
              </div>

              <div className='create-forgot-creds-container'>
                <div>NEW HERE?</div>

                <Link
                  className='signup-link'
                  to={`/sign-up/${isUser ? 'false' : 'true'}`}
                >
                  SIGN UP
                </Link>
              </div>
            </div>
            <div className='footer-lander'>
              <div className='footer-1000-users-text'>1000+ USERS</div>
              <div className='lander-footer-1'>
                <img src="images/lander_footer_1.png" />
                <div className='lander-footer-1-text'>
                  <div>
                    <div>AND GROWING!</div>
                  </div>
                  <img src="images/smiley.png" />
                </div>
              </div>

              <div className='lander-footer-2'>
                <div className='lander-footer-2-text'>
                  <div>
                    <img src="images/sparkle.png" />
                  </div>
                </div>
                <img src="images/lander_footer_2.png" />
              </div>
              <div className='footer-match-vibes-text'>#Match your vibes with the DJ</div>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}

export default Cards;
