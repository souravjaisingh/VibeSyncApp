import React from 'react';
import '../../App.css';
import { useState } from "react";
import { useForm } from "react-hook-form";
import RegisterUser from '../RegisterUserForm';
import Footer from '../Footer';
import LoginForm from '../LoginForm';

export default function Login() {
  return(
    <div className='loginForm'>
      <LoginForm />
      <Footer />
    </div>
  )
}
