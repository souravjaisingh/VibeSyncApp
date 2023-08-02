import React from 'react';
import '../'
import { useState, useEffect } from "react";
import './LoginForm.css';
import PhoneInput from 'react-phone-input-2'
import 'react-phone-input-2/lib/style.css'

const errorCssClass = 'input_error';
const emailRegex = /^(("[\w-\s]+")|([\w-]+(?:\.[\w-]+)*)|("[\w-\s]+")([\w-]+(?:\.[\w-]+)*))(@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$)|(@\[?((25[0-5]\.|2[0-4][0-9]\.|1[0-9]{2}\.|[0-9]{1,2}\.))((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\.){2}(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\]?$)/;
const phoneRegex = /^[6-9]\d{9}$/;
export default function LoginForm(){
    const [firstName, setFirstName] = useState(null);
    const [lastName, setLastName] = useState(null);
    const [email, setEmail] = useState(null);
    const [gender, setGender] = useState(null);
    const [password,setPassword] = useState(null);
    const [phoneNumber,setphoneNumber] = useState(null);
    const [confirmPassword,setConfirmPassword] = useState(null);
    const [firstNameError, setfirstNameError] = useState(null);
    const [emailError, setemailError] = useState(false);
    const [phoneError, setPhoneError] = useState(false);
    const [passwordError, setpasswordError] = useState(false);
    const [confirmPasswordError, setconfirmPasswordError] = useState(false);

    // useEffect( () => {
    //     console.log(firstNameError);
    // }, [firstNameError, emailError, firstName]);

    const handleInputChange = (e) => {
        const {id , value} = e.target;
        if(id === "firstName"){
            setFirstName(value);
            setfirstNameError(null);
        }
        if(id === "lastName"){
            setLastName(value);
        }
        if(id === "email"){
            setEmail(value);
            validateEmail(value);
        }
        if(id === "gender"){
            setGender(value);
        }
        if(id === "phone"){
            phoneNumberfun(value);
        }
        if(id === "password"){
            setPassword(value);
            setpasswordError(false);
            validatePassword(value);
        }
        if(id === "confirmPassword"){
            setConfirmPassword(value);
            setconfirmPasswordError(false);
            validateConfirmPassword(value);
        }

    }
    function validatePassword(pass){
        if(pass.length<8){
            setpasswordError(true);
        }
    }
    function validateConfirmPassword(cpass){
        if(cpass != password){
            setconfirmPasswordError(true);
        }
    }
    function validateEmail(emailId){
        emailRegex.test(String(emailId).toLowerCase()) ? setemailError(false) : setemailError(true);
    }
    function phoneNumberfun(number){
        setphoneNumber(number);
        validatePhoneNumber(number);
    }
    function validatePhoneNumber(number){
        phoneRegex.test(number) ? setPhoneError(false) : setPhoneError(true);
    }

    const handleSubmit  = () => {
        console.log(firstName,lastName,email,password,confirmPassword);
        if(firstName == null || firstName == '' || firstName == undefined){
            setfirstNameError(true);
        }
        if(email == null || email == '' || email == undefined){
            setemailError(true);
        }
        else{
            validateEmail(email);
        }
        if(password == null || password == '' || password == undefined){
            setpasswordError(true);
        }
        validatePassword(password);
        validateConfirmPassword(confirmPassword);
    }

    return(
        <div className="form col-10">
            <div className="form-body">
                <div className="email">
                    <label className="form__label" for="email">Email* </label>
                    <input required type="email" id="email" className={`form__input ${emailError ? errorCssClass : ""}`} value={email} onChange = {(e) => handleInputChange(e)} placeholder="Email"/>
                </div>
                
                <div className="password">
                    <label className="form__label" for="password">Password* </label>
                    <input required className={`form__input ${passwordError ? errorCssClass : ""}`} type="password"  id="password" value={password} onChange = {(e) => handleInputChange(e)} placeholder="Password"/>
                    {passwordError ? <span className='password-warning'>Must be minimum 8 chracters.</span>:''}
                </div>
                
            </div>
            <div class="footer">
                <button onClick={()=>handleSubmit()} type="submit" class="btn btn--primary btn--medium">Login</button>
            </div>
        </div> 
    )       
}