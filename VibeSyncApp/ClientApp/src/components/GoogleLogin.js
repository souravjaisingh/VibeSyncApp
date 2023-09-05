import React, { useState, useEffect } from 'react';
import './UserLogin.css';
import { googleLogout, useGoogleLogin } from '@react-oauth/google';
import axios from 'axios';
import { googleLoginHelper } from '../Helpers/UserHelper';


export default function GoogleLogin(){
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
                    const response  = await googleLoginHelper(res.data.given_name, res.data.family_name, res.data.email);
                    if(response){
                        localStorage.setItem('userId', response);
                        window.location.href='/userhome';
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
            { profile.length!=0 && profile != null ? (
                <div>
                    {/* <Link to='/services'></Link> */}
                    <img src={profile.picture} alt="user image" />
                    <h3>User Logged in</h3>
                    <p>Name: {profile.name}</p>
                    <p>Email Address: {profile.email}</p>
                    <br />
                    <br />
                    <button onClick={logOut}>Log out</button>
                </div>
            ) : (
                <button className='btn btn--outline btn--medium' onClick={() => login()}>Sign in with Google 🚀 </button>
            )}
        </div>
    </>
    )
}