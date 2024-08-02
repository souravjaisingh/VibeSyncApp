var configuration = {
    widgetId: "346862734542373230313836",
    tokenAuth: "427527TjyKxfYJKB666ad326cP1", //This should be hidden
    identifier: "<enter mobile number/email here> (optional)",
    exposeMethods: true,
    captchaRenderId: '', 
    success: (data) => {
      console.log('success response', data);
    },
    failure: (error) => {
      console.log('failure reason', error);
    },
  };
  
  function loadOTPScript() {

    const script = document.createElement('script');
    script.src = 'https://control.msg91.com/app/assets/otp-provider/otp-provider.js';
    script.async = true;

    script.onload = () => {
      if (window.initSendOTP) {
        window.initSendOTP(configuration);
      } else {
        console.error('OTP script not loaded properly');
      }
    };
  

    document.body.appendChild(script);
  }
  

  export default loadOTPScript;