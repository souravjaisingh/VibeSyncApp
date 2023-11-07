import React, { useContext } from 'react';
import '../'
import { useState, useEffect } from "react";
import './LoginForm.css';
import PhoneInput from 'react-phone-input-2'
import 'react-phone-input-2/lib/style.css'
import { LoginUser } from './services/UserService';
import { useNavigate } from 'react-router-dom';
import { loginUserHelper } from '../Helpers/UserHelper';
import { MyContext } from '../App';

const errorCssClass = 'input_error';
const emailRegex = /^(("[\w-\s]+")|([\w-]+(?:\.[\w-]+)*)|("[\w-\s]+")([\w-]+(?:\.[\w-]+)*))(@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$)|(@\[?((25[0-5]\.|2[0-4][0-9]\.|1[0-9]{2}\.|[0-9]{1,2}\.))((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\.){2}(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\]?$)/;
const phoneRegex = /^[6-9]\d{9}$/;
export default function LoginForm() {
    const { error, setError } = useContext(MyContext);
    const { errorMessage, setErrorMessage } = useContext(MyContext);
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loginError, setLoginError] = useState(null);
    const [showPassword, setShowPassword] = useState(false);

    // useEffect( () => {
    //     console.log(firstNameError);
    // }, [firstNameError, emailError, firstName]);
    //just a comment to trigger azure build

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
            const response = await loginUserHelper(email, password);
            if(response && response.isUser == true && localStorage.getItem('redirectUrl')){
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
            }
        }
        catch (error) {
            setError(true);
            setErrorMessage(error.message);
        }
    }

    return (
        <div className="form col-10">
            <div className="form-body">
                {loginError ? <span className='password-warning'>Incorrect Email Id/Password.</span> : ''}
                <div className="email">
                    <label className="form__label" for="email">Email* </label>
                    <input required type="email" id="email" className='form__input' value={email} onChange={(e) => handleInputChange(e)} placeholder="Email" />
                </div>

                <div className="password-container">
                    <div className="password">
                        <label className="form__label" htmlFor="password">
                            Password*
                        </label>
                        <input
                            required
                            className="form__input"
                            type={showPassword ? "text" : "password"}
                            id="password"
                            value={password}
                            onChange={(e) => handleInputChange(e)}
                            placeholder="Password"
                        />
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


            </div>
            <div class="footer">
                <button onClick={() => handleSubmit()} type="submit" class="btn btn--primary btn--medium">Login</button>
            </div>
        </div>
    )
}
