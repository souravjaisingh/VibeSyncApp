import React, { useState, useEffect } from 'react';
import './UserLogin.css';
import './GoogleLogin.css';
import { googleLogout, useGoogleLogin } from '@react-oauth/google';
import axios from 'axios';
import { googleLoginHelper } from '../Helpers/UserHelper';


export default function GoogleLogin(isUser){
    const isUserRegistration = isUser.isUser;
    console.log(isUserRegistration);

    const [showErrorMessage, setShowErrorMessage] = useState(false);
    const [ user, setUser ] = useState([]);
    const [ profile, setProfile ] = useState([]);
    var baseUri = 'http'
    const login = useGoogleLogin({
        onSuccess: (codeResponse) => setUser(codeResponse),
        onError: (error) => console.log('Login Failed:', error)
    });
    useEffect(
    () => {
        if (!(user.access_token==null || user.access_token==undefined)) {
            axios
            .get(`https://www.googleapis.com/oauth2/v1/userinfo?access_token=${user.access_token}`, {
                    headers: {
                        Authorization: `Bearer ${user.access_token}`,
                        Accept: 'application/json'
                    }
                })
                .then(async (res) => {
                    setProfile(res.data);
                    console.log(res.data);
                    const response  = await googleLoginHelper(res.data.given_name, res.data.family_name, res.data.email, isUserRegistration ? 'user' : 'dj');
                    if(!response.error){
                        localStorage.setItem('userId', response);
                        localStorage.setItem('isUser', isUserRegistration);
                        if(isUserRegistration){
                            window.location.href='/userhome';
                        }
                        else{
                            window.location.href='/djhome';
                        }
                        
                    }
                    else{
                        setShowErrorMessage(true);
                    }
                    //await registerUser(res.data);
                })
                .catch((err) => console.log(err));
        }
    },
    [ user ]
);

  // log out function to log the user out of google and set the profile array to null
    const logOut = () => {
    googleLogout();
    setProfile(null);
    };
    return(
    <>
        <div>
            <br />
            <br />
            <button className='btn btn--outline btn--medium' onClick={() => login()}>Sign in with Google   <span className="google-icon"></span></button>
        </div>
        {showErrorMessage && (
        <div className="err-message">
            You cannot impersonate different role!
        </div>
    )}
    </>
    )
}