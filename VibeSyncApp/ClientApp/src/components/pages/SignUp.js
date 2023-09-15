import React, { useEffect } from 'react';
import '../../App.css';
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useLocation, useParams } from 'react-router-dom';
import RegisterUser from '../RegisterUserForm';
import Footer from '../Footer';
import LoginUser from '../LoginForm';

export default function SignUp() {
  const { isUser } = useParams();
  console.log(isUser);
  useEffect(()=>{
    window.scrollTo(0, 0);
  })
  return(
    <div className='sign-up'>
      <RegisterUser isUser={isUser}/>
    </div>
  )
}
