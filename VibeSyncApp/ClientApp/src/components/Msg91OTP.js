var configuration = {
    widgetId: "346862665a30323832373633",
    tokenAuth: "427449TRxqa5zhmw66ac85f4P1", //This should be hidden
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