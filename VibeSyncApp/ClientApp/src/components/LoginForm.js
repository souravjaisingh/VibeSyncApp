import React from 'react';
import '../'
import { useState, useEffect } from "react";
import './LoginForm.css';
import PhoneInput from 'react-phone-input-2'
import 'react-phone-input-2/lib/style.css'
import { LoginUser } from './services/UserService';
import { useNavigate } from 'react-router-dom';
import { loginUserHelper } from '../Helpers/UserHelper';

const errorCssClass = 'input_error';
const emailRegex = /^(("[\w-\s]+")|([\w-]+(?:\.[\w-]+)*)|("[\w-\s]+")([\w-]+(?:\.[\w-]+)*))(@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$)|(@\[?((25[0-5]\.|2[0-4][0-9]\.|1[0-9]{2}\.|[0-9]{1,2}\.))((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\.){2}(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\]?$)/;
const phoneRegex = /^[6-9]\d{9}$/;
export default function LoginForm(){
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password,setPassword] = useState('');
    const [error, setError] = useState(null);
    // useEffect( () => {
    //     console.log(firstNameError);
    // }, [firstNameError, emailError, firstName]);
    //just a comment to trigger azure build

    const handleInputChange = (e) => {
        const {id , value} = e.target;
        if(id === "email"){
            setEmail(value);
            // validateEmail(value);
        }
        if(id === "password"){
            setPassword(value);
            // setpasswordError(false);
            // validatePassword(value);
        }
    }

    const handleSubmit  = async () => {
        setError(false);
        console.log(email,password);
        if(email == null || email == '' || email == undefined){
            setError(true);
        }
        if(password == null || password == '' || password == undefined){
            setError(true);
        }
        const response = await loginUserHelper(email, password);
        if(response && response.isUser == true){
            localStorage.setItem('userId', response.id);
            localStorage.setItem('isUser', true);
            navigate('/userhome')
        }
        else if(response && response.isUser == false){
            localStorage.setItem('userId', response.id);
            localStorage.setItem('isUser', false);
            navigate('/djhome')
        }
        else{
            setError(true);
        }
    }

    return(
        <div className="form col-10">
            <div className="form-body">
            {error ? <span className='password-warning'>Incorrect Email Id/Password.</span>:''}
                <div className="email">
                    <label className="form__label" for="email">Email* </label>
                    <input required type="email" id="email" className='form__input' value={email} onChange = {(e) => handleInputChange(e)} placeholder="Email"/>
                </div>
                
                <div className="password">
                    <label className="form__label" for="password">Password* </label>
                    <input required className='form__input' type="password"  id="password" value={password} onChange = {(e) => handleInputChange(e)} placeholder="Password"/>
                </div>
                
            </div>
            <div class="footer">
                <button onClick={()=>handleSubmit()} type="submit" class="btn btn--primary btn--medium">Login</button>
            </div>
        </div> 
    )       
}
