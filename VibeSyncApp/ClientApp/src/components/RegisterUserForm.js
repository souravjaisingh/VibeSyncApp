import React, { useContext } from 'react';
import '../'
import { useState, useEffect } from "react";
import './RegisterUserForm.css';
import PhoneInput from 'react-phone-input-2'
import 'react-phone-input-2/lib/style.css'
import registerUserHelper from '../Helpers/UserHelper';
import { useNavigate } from 'react-router-dom'
import ErrorPage from './ErrorPage';
import { MyContext } from '../App';
import { useLoadingContext } from './LoadingProvider';
// import { useErrorHandler } from 'react-error-boundary';

const errorCssClass = 'input_error';
const emailRegex = /^(("[\w-\s]+")|([\w-]+(?:\.[\w-]+)*)|("[\w-\s]+")([\w-]+(?:\.[\w-]+)*))(@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$)|(@\[?((25[0-5]\.|2[0-4][0-9]\.|1[0-9]{2}\.|[0-9]{1,2}\.))((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\.){2}(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\]?$)/;
const phoneRegex = /^[6-9]\d{9}$/;
export default function RegisterUser(isUser) {
    const { error, setError } = useContext(MyContext);
    const { errorMessage, setErrorMessage } = useContext(MyContext);
    const [firstName, setFirstName] = useState(null);
    const [lastName, setLastName] = useState(null);
    const [email, setEmail] = useState(null);
    const [gender, setGender] = useState("male");
    const [password, setPassword] = useState(null);
    const [phoneNumber, setphoneNumber] = useState(null);
    const [confirmPassword, setConfirmPassword] = useState(null);
    const [firstNameError, setfirstNameError] = useState(null);
    const [emailError, setemailError] = useState(false);
    const [phoneError, setPhoneError] = useState(false);
    const [passwordError, setpasswordError] = useState(false);
    const [confirmPasswordError, setconfirmPasswordError] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [isItAUser, setIsItAUser] = useState(isUser.isUser);
    const { setLoading } = useLoadingContext();
    const navigate = useNavigate()
    // const isUserRegistration = isUser.isUser;
    // useEffect( () => {
    //     console.log(firstNameError);
    // }, [firstNameError, emailError, firstName]);
    useEffect(() => {
        window.scrollTo(0, 0)
    }, [])
    const handleInputChange = (e) => {
        const { id, value } = e.target;
        if (id === "firstName") {
            setFirstName(value);
            setfirstNameError(null);
        }
        if (id === "lastName") {
            setLastName(value);
        }
        if (id === "email") {
            setEmail(value);
            validateEmail(value);
        }
        if (id === "gender") {
            setGender(value);
        }
        if (id === "phone") {
            phoneNumberfun(value);
        }
        if (id === "password") {
            setPassword(value);
            setpasswordError(false);
            validatePassword(value);
        }
        if (id === "confirmPassword") {
            setConfirmPassword(value);
            setconfirmPasswordError(false);
            validateConfirmPassword(value);
        }

    }
    function validatePassword(pass) {
        if (pass.length < 8) {
            setpasswordError(true);
        }
    }
    function validateConfirmPassword(cpass) {
        if (cpass != password) {
            setconfirmPasswordError(true);
        }
    }
    function validateEmail(emailId) {
        emailRegex.test(String(emailId).toLowerCase()) ? setemailError(false) : setemailError(true);
    }
    function phoneNumberfun(number) {
        setphoneNumber(number);
        validatePhoneNumber(number);
    }
    function validatePhoneNumber(number) {
        phoneRegex.test(number) ? setPhoneError(false) : setPhoneError(true);
    }

    const handleSubmit = async () => {
        console.log(firstName, lastName, email, password, confirmPassword);
        if (firstName == null || firstName == '' || firstName == undefined) {
            setfirstNameError(true);
        }
        if (email == null || email == '' || email == undefined) {
            setemailError(true);
        }
        else {
            validateEmail(email);
        }
        if (password == null || password == '' || password == undefined) {
            setpasswordError(true);
        }
        validatePhoneNumber(phoneNumber);
        validatePassword(password);
        validateConfirmPassword(confirmPassword);
        if (!(firstNameError || emailError || passwordError || phoneError || confirmPasswordError)) {
            try {
                setLoading(true);
                var response = await registerUserHelper(firstName, lastName, email, password, phoneNumber, gender.toLowerCase(), isItAUser == 'true' ? 'user' : 'dj');
                setLoading(false);
                if (!response.error) {
                    console.log("Load new page after following response:")
                    console.log(response);
                    if (response && response.isUser == true && localStorage.getItem('redirectUrl')) {
                        localStorage.setItem('userId', response.id);
                        localStorage.setItem('isUser', true);
                        console.log(localStorage.getItem('redirectUrl'));
                        setTimeout(() => {
                            const redirectUrl = localStorage.getItem('redirectUrl');
                            console.log(redirectUrl);
                            navigate(redirectUrl);
                        }, 0);
                    }
                    if (response && response.isUser == true) {
                        localStorage.setItem('userId', response.id);
                        localStorage.setItem('isUser', true);
                        navigate('/userhome')
                    }
                    else if (response && response.isUser == false) {
                        localStorage.setItem('userId', response.id);
                        localStorage.setItem('isUser', false);
                        navigate('/djhome')
                    }
                }

                // navigate('/loginForm');
            } catch (error) {
                // Handle or log the error
                // navigate('/errorPage');
                setError(true);
                setLoading(false);
                setErrorMessage(error.message);
                console.error('Error in RegisterUser:', error);
                // You can show an error message to the user if needed.
            }
        }
    }

    return (
        <>
            <div>
                <img className="dj-img" src="/images/signup4.png" alt="Sign Up" />
                <p className="text-overlay">SIGN UP</p>
            </div>
            <div className="form col-10" style={{ borderRadius :  "4px" }}>
            <div className="form-body">
                <div className="username">
                    <label className="form__label" for="firstName">First Name* </label>
                    <input required className={`form__input ${firstNameError ? errorCssClass : ""}`} type="text" value={firstName} onChange={(e) => handleInputChange(e)} id="firstName" placeholder="First Name" />
                </div>
                <div className="lastname">
                    <label className="form__label" for="lastName">Last Name </label>
                    <input type="text" name="" id="lastName" value={lastName} className="form__input" onChange={(e) => handleInputChange(e)} placeholder="LastName" />
                </div>
                <div className="email">
                    <label className="form__label" for="email">Email* </label>
                    <input required type="email" id="email" className={`form__input ${emailError ? errorCssClass : ""}`} value={email} onChange={(e) => handleInputChange(e)} placeholder="Email" />
                </div>
                <div className="gender">
                    <label className="form__label" for="gender">Gender* </label>
                    <select className='form__input' id='gender' value={gender} onChange={(e) => handleInputChange(e)}>
                        <option name="male"> Male</option>
                        <option name="female">Female</option>
                        <option name="other">Other</option>
                    </select>
                </div>
                <div className='phone'>
                    <label className="form__label" for="phone">Phone No. </label>
                    <input className={`form__input ${phoneError ? errorCssClass : ""}`} type='text' id='phone' value={phoneNumber} onChange={(e) => handleInputChange(e)} placeholder='Phone No.'></input>
                    {/* <PhoneInput
                        containerClass={errorCssClass}
                        inputStyle={{outerWidth:200}}
                        country={'in'}
                        value={phoneNumber}
                        id='phone'
                        onChange={(e) => phoneNumberfun(e)}
                    /> */}
                </div>
                    <div className='password-container'>
                        <div className="password">
                            <label className="form__label" htmlFor="password">Password* </label>
                            <div className = "password-box1">
                            <div className="password-input-box">
                                <input required className={`form__input ${passwordError ? errorCssClass : ""}`} type={showPassword ? "text" : "password"} id="password" value={password} onChange={(e) => handleInputChange(e)} placeholder="Password" />
                                <img src={showPassword ? "images/hidden-eye-password.png" : "images/eye-password.png"} className='eye-password-click1' onClick={() => setShowPassword(!showPassword)} alt="toggle visibility" />
                                </div>
                                {passwordError ? <p className='password-warning'>Must be minimum 8 characters.</p> : ''}
                            </div>
                        </div>
                    </div>
                <div className='password-container'>
                        <div className="confirm-password">
                            <label className="form__label" htmlFor="confirmPassword">Confirm Password* </label>
                            <div>
                                <div className="password-input-box">
                                    <input required className={`form__input ${confirmPasswordError ? errorCssClass : ""}`} type={showConfirmPassword ? "text" : "password"} id="confirmPassword" value={confirmPassword} onChange={(e) => handleInputChange(e)} placeholder="Confirm Pass" style={{ padding: "5px 10px", width: "99%", height: "91%" }} />
                                    <img src={showConfirmPassword ? "images/hidden-eye-password.png" : "images/eye-password.png"} className='eye-password-click1' onClick={() => setShowConfirmPassword(!showConfirmPassword)} alt="toggle visibility"
                                        style={{
                                            top: passwordError ? "375px" : confirmPasswordError ? "330px" : "330px"
                                        }} />
                                </div>
                                {confirmPasswordError ? <p className='password-warning' style={{ marginLeft: "29px", width : "146px" }}>Password and Confirm password must be the same.</p> : ''}
                            </div>
                    </div>
                </div>
                    <div className="dj-checkbox">
                        <label className="dj-label form__label" htmlFor="djCheckbox">Are you a DJ?</label>
                        <input
                            className='form__input'
                            type="checkbox"
                            id="djCheckbox"
                            checked={isItAUser == 'false' ? true : false}
                            onChange={() => setIsItAUser(isItAUser == 'false' ? 'true' : 'false')}
                        />
                    </div>
            </div>
            <div class="footer">
                <button onClick={() => handleSubmit()} type="submit" class="btn btn--primary btn--medium">Register</button>
            </div>
            </div>
        </>
    )
}