import React from 'react';
import '../../App.css';
import { useState } from "react";
import { useForm } from "react-hook-form";
import RegisterUser from '../RegisterUserForm';
import Footer from '../Footer';

export default function SignUp() {
  return(
    <div className='sign-up'>
      <RegisterUser />
      <Footer />
    </div>
  )
}
