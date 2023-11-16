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
                var response = await registerUserHelper(firstName, lastName, email, password, phoneNumber, gender, isItAUser == 'true' ? 'user' : 'dj');
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
        <div className="form col-10">
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
                    <label className="form__label" for="phone">Phone Number* </label>
                    <input className={`form__input ${phoneError ? errorCssClass : ""}`} type='text' id='phone' value={phoneNumber} onChange={(e) => handleInputChange(e)} placeholder='Phone Number'></input>
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
                        <label className="form__label" for="password">Password* </label>
                        <input required className={`form__input ${passwordError ? errorCssClass : ""}`} type={showPassword ? "text" : "password"} id="password" value={password} onChange={(e) => handleInputChange(e)} placeholder="Password" />
                        {passwordError ? <span className='password-warning'>Must be minimum 8 chracters.</span> : ''}
                    </div>
                    <div className="show-password">
                        <label htmlFor="check">Show Password &nbsp;</label>
                        <input
                            id="check"
                            type="checkbox"
                            value={showPassword}
                            onChange={() => setShowPassword((prev) => !prev)}
                        />
                    </div>
                </div>
                <div className='password-container'>
                    <div className="confirm-password">
                        <label className="form__label" for="confirmPassword">Confirm Password* </label>
                        <input required className="form__input" type={showConfirmPassword ? "text" : "password"} id="confirmPassword" value={confirmPassword} onChange={(e) => handleInputChange(e)} placeholder="Confirm Password" />
                        {confirmPasswordError ? <span className='password-warning'>Passwords didn't match.</span> : ''}
                    </div>
                    <div className="show-password">
                        <label htmlFor="check">Show Password &nbsp;</label>
                        <input
                            id="check"
                            type="checkbox"
                            value={showConfirmPassword}
                            onChange={() => setShowConfirmPassword((prev) => !prev)}
                        />
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
            </div>
            <div class="footer">
                <button onClick={() => handleSubmit()} type="submit" class="btn btn--primary btn--medium">Register</button>
            </div>
        </div>
    )
}