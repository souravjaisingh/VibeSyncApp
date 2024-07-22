import React, { useState, useEffect, useContext } from 'react';
import './UserLogin.css';
import './GoogleLogin.css';
import { googleLogout, useGoogleLogin } from '@react-oauth/google';
import axios from 'axios';
import { googleLoginHelper } from '../Helpers/UserHelper';
import { useNavigate } from 'react-router-dom';
import { MyContext } from '../App';
import { useLoadingContext } from './LoadingProvider';


export default function GoogleLogin(isUser){
    const { error, setError } = useContext(MyContext);
    const { errorMessage, setErrorMessage } = useContext(MyContext);
    const navigate = useNavigate();
    const { setLoading } = useLoadingContext();
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
                    setLoading(true);
                    const response  = await googleLoginHelper(res.data.given_name, res.data.family_name, res.data.email, isUserRegistration ? 'user' : 'dj');
                    setLoading(false);
                    if (!response.error) {
                        console.log("Load new page after following response:")
                        console.log(response);
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
                    }
                    else{
                        setShowErrorMessage(true);
                    }
                    //await registerUser(res.data);
                })
                .catch((error) => {
                    setLoading(false);
                    setError(true);
                    setErrorMessage(error.message);
                });
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
            {/* <p style={{fontFamily:'sans-serif'}}>Sign up to request a song</p> */}
            <div className='google-icon-container' onClick={() => login()}><span className="google-icon"></span></div>
        </div>
        {showErrorMessage && (
        <div className="err-message">
            You cannot impersonate different role!
        </div>
    )}
    </>
    )
}