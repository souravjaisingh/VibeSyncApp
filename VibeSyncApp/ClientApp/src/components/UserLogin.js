import React, { useState,useContext,useEffect } from 'react';
import './UserLogin.css';
import { Link, useNavigate } from 'react-router-dom';
import GoogleLogin from './GoogleLogin';
import Switch from './LoginToggleButton';
import { MyContext } from '../App';
import { useLoadingContext } from './LoadingProvider';
import { loginUserHelper } from '../Helpers/UserHelper';

const errorCssClass = 'input_error';
const emailRegex = /^(("[\w-\s]+")|([\w-]+(?:\.[\w-]+)*)|("[\w-\s]+")([\w-]+(?:\.[\w-]+)*))(@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$)|(@\[?((25[0-5]\.|2[0-4][0-9]\.|1[0-9]{2}\.|[0-9]{1,2}\.))((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\.){2}(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\]?$)/;
const phoneRegex = /^[6-9]\d{9}$/;

function Cards(props) {
  const [isUser, setIsUser] = useState(false);
  const [isMobileLogin, setIsMobileLogin] = useState(true);
  const navigate = useNavigate();
  const { error, setError } = useContext(MyContext);
  const { errorMessage, setErrorMessage } = useContext(MyContext);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const { setLoading } = useLoadingContext();
  const [showInfoBox, setShowInfoBox] = useState(false); // State variable to track visibility of info box
  const [invalidPasswordError,setInvalidPasswordError] = useState(false);
  const [mobileNo,setMobileNo] = useState(null);
  const [otp, setOtp] = useState(new Array(4).fill(""));
  let timer;
  let countdown = 30;

  const handleAnonymousLogin = () => {
    // Implement your anonymous login logic here
    console.log("Performing anonymous login...");
    localStorage.setItem('userId', 0); //0 id means it's Anonymous.
    localStorage.setItem('isUser', true);
    navigate('/userhome')

  };

  

  function startResendTimer() {
    document.getElementById('resendOtp').style.opacity = 0.6;
    document.getElementById('resendOtp').disabled = true;

    timer = setInterval(updateTimer, 1000);
}

function updateTimer() {
    const timerElement = document.getElementById('timer');
    
    if (countdown > 0) {
        timerElement.textContent = `(${countdown})`;
        countdown--;
    } else {
        document.getElementById('resendOtp').style.opacity = 1;
        document.getElementById('resendOtp').disabled = false;
        timerElement.textContent = '';
        
        countdown = 30;
        
        clearInterval(timer);
    }
}

  const handleGetOtp = () => {
    if(document.getElementById('mobile-no').value.length != 10 || document.getElementById('mobile-no').value.includes('.')){
      document.getElementById('mobile-no').style.border = 'solid';
      document.getElementById('mobile-no').style.borderColor = 'red'; 
      document.getElementById('mobile-no').style.borderWidth = '3px'; 
    }
    else{
      timer = setInterval(updateTimer, 1000);
      setTimeout(()=>{document.getElementById('resendOtp').style.opacity = 0.6;},1000)
      setTimeout(()=>{document.getElementById('resendOtp').disabled = true;},1000)
      setMobileNo(document.getElementById('mobile-no').value)
    }
  }

  const handleVerifyOtp = () => {
    console.log(otp);
  }

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    if (id === "email") {
        setEmail(value);
        // validateEmail(value);
    }
    if (id === "password") {
        setPassword(value);
        // setpasswordError(false);
        // validatePassword(value);
    }
}

const handleOtpChange = (element, index) => {
  if (isNaN(element.value)) return false;

  setOtp([...otp.map((d, idx) => (idx === index ? element.value : d))]);

  //Focus next input
  if (element.nextSibling) {
      element.nextSibling.focus();
  }
};

const handleSubmit = async () => {
    setLoginError(false);
    try {
        console.log(email, password);
        if (email == null || email == '' || email == undefined) {
            setLoginError(true);
        }
        if (password == null || password == '' || password == undefined) {
            setLoginError(true);
        }
        setLoading(true);
        const response = await loginUserHelper(email, password);
        setLoading(false);
        if(!response.id){
          setInvalidPasswordError(true);
        }
        else
        {if (response && response.isUser == true && localStorage.getItem('redirectUrl')) {
            localStorage.setItem('userId', response.id);
            localStorage.setItem('isUser', true);
            console.log(localStorage.getItem('redirectUrl'));
            setTimeout(() => {
                const redirectUrl = localStorage.getItem('redirectUrl');
                console.log(redirectUrl);
                navigate(redirectUrl);
            }, 0);
        }
        else if (response && response.isUser == true) {
            localStorage.setItem('userId', response.id);
            localStorage.setItem('isUser', true);
            navigate('/userhome')
        }
        else if (response && response.isUser == false) {
            localStorage.setItem('userId', response.id);
            localStorage.setItem('isUser', false);
            navigate('/djhome')
        }
        else {
            setLoginError(true);
        }}
    }
    catch (error) {
        setError(true);
        setErrorMessage(error.message);
        setLoading(false);
    }
}

    const handleForgotPasswordClick = () => {
        setShowInfoBox(!showInfoBox);

    }


  return (
    <div className={`cards `}>
      <div className='cards__container'>

        <div className='lander-header'>
          <div>

            <img className='lander-logo-desktop' src="images/VSlogo.png" style={{ height: '20vh', marginTop: '20px', color: '#39125C' }} />

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
              {isMobileLogin?(<>
                {mobileNo===null?(<div className='mobile-number-container'>
                  <div>
                    <img className='user-image-icon-lander' src = "images/user_image_lander.png"/>
                    <input id = "mobile-no" type='number' className='mobile-number-input' placeholder='Mobile Number' />
                  </div>
                  <button onClick={handleGetOtp} className='get-otp-button-lander'>Send OTP</button>
                </div>):(<div className='otp-verify-section'>
                    <div className='sent-otp-text'>OTP sent at: <div className='mobile-no-text'>+91-{mobileNo}</div></div>
                    {otp.map((data, index) => {
                        return (
                            <input
                                className="otp-field"
                                type="text"
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
              ):(
                  <div className='mobile-number-container'>
                  <div>
                    {invalidPasswordError?(<div style={{color:'red'}}>
                      Username or Password is incorrect!
                    </div>):(<></>)}
                    <input className='email-input' id = 'email' placeholder='E-mail' value={email} onChange={(e) => handleInputChange(e)}/>
                    <div className='password-input-field'>
                      <input className='password-input' id='password' type={showPassword ? "text" : "password"} placeholder='Password' value={password}
                                onChange={(e) => handleInputChange(e)}/>
                      {showPassword?(<><img src = "images/hidden-eye-password.png" className='eye-password-click' onClick={() => setShowPassword((prev) => !prev)}/></>):
                      (<><img src = "images/eye-password.png" className='eye-password-click' onClick={() => setShowPassword((prev) => !prev)}/></>)}
                  </div></div>
                  <button className='get-otp-button-lander' onClick={() => handleSubmit()}>Login</button>

                  {isMobileLogin?(<></>):(
                    <div className='forgot-password-container'>
                      <div onClick={handleForgotPasswordClick}>Forgot Password?</div>
                      {showInfoBox?(<div id='forgot-password-tip'>Please send an email to vibesyncdj@gmail.com with your Email/Phone Number.
                      We're here at your disposal.</div>):(<></>)}
                    </div>
                  )}
                </div>

              )}

              
              <div>
                <p>Or login with</p>
              </div>
              <div className='google-email-login-container'>
                <GoogleLogin isUser={!isUser} showButton={true}/>
                <div onClick={()=>setIsMobileLogin(!isMobileLogin)} className='btn-mobile'>
                  {isMobileLogin?(<img src='images/emailIcon.png' className='email-icon' />):
                  (<img src='images/phone-call.png' className='phone-call-icon'/>)}
                  
                </div>
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
