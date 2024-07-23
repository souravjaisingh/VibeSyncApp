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
          <img src = "images/lander_vibesync.png" style={{height:'20vh',marginTop:'20px',color:'#39125C'}}/>
            <p className='tagline-header'>INDIA'S FIRST EVER SONG REQUEST APP!</p>
        </div>
        <div className='lander-main-content'>
          <div className='main-selection-content'>
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
              <input className='mobile-number-input' placeholder='Mobile Number'/>
              <button className='get-otp-button'>Get OTP</button>
            </div>
            <div>
              <p>Or login with</p>
            </div>
            <div className='google-email-login-container'>
              <GoogleLogin isUser={!isUser} showButton={true}/>
              <Link to='/loginForm' className='btn-mobile'>
                <img src="images/emailIcon.png" className='email-icon' />
              </Link>
            </div>

            <div className='create-forgot-creds-container'>
              <Link
                className='signup-link'
                to={`/sign-up/${isUser ? 'false' : 'true'}`}
              >
                Create Account
              </Link>

              <div>Forgot Password?</div>
            </div>


            <div className='lander-footer-1'>
              <img src="images/lander_footer_1.png" />
              <div className='lander-footer-1-text'>
                <div>
                  <div>1000+ USERS</div>
                  <div>AND</div>
                  <div>GROWING!</div>
                </div>
              </div>
            </div>

            <div className='lander-footer-2'>
              <div className='lander-footer-2-text'>
                <div>
                  <div>#Match your vibes</div>
                  <div>with the DJ</div>
                </div>
              </div>
              <img src="images/lander_footer_2.png" />
            </div>


          </div>
        </div>


      </div>
    </div>
  );
}

export default Cards;
