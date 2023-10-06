import React, { useEffect } from 'react';

const PaymentRequest = () => {
    const encryptedData = 'a8c77f7c70e53efd8a65c78cdcc6b918005ebf1d60813ce08de730793b8d81e8760475f9a881915fa0b12c3eae5e2535f38a4fb060fd0d16296bbdab93a5e146d956e9f2411c03d02850aabe60e766bcc7b73686738585cfa0f88c80f050301d54e241949df390bd213eeba756eb966c7152a9d61f02556ae90903dcd501a3a33f57b7e8240cc5e7150ace434ee1e778766c19213b6305e7bccb8be410a1d86bcae945c5d6836fd1c370902b5fbbf4a5a389f24323d8604d97d8d5ebf85d07219f1f5a9cc32e96546cf93743c7e174ee482eb3b8fc8b94aecb7827ec29b137fef26cd2104a399898f295369ca26950119f2745320f3a9eed43c375010126255a'; // Replace with your actual encrypted data
    const accessCode = 'AVHH14KI48BM55HHMB'; // Replace with your actual access code
    //----------------------------------------------------------------------------------
    //INSTEAD OF HARDCODING THIS, TAKE IT FROM APIs GENERATED IN PAYMENTS CONTROLLER
    //----------------------------------------------------------------------------------
    useEffect(() => {
        // This will automatically submit the form after a delay (e.g., 500 milliseconds)
        const redirectForm = document.getElementById('nonseamless');
        setTimeout(() => {
        redirectForm.submit();
        }, 500);
    }, []);

    return (
        <div>
        <p>Loading...</p>
        <form
            id="nonseamless"
            method="post"
            name="redirect"
            action="https://test.ccavenue.com/transaction/transaction.do?command=initiateTransaction"
        >
            <input type="hidden" id="encRequest" name="encRequest" value={encryptedData} />
            <input type="hidden" name="access_code" id="access_code" value={accessCode} />
        </form>
        </div>
    );
};

export default PaymentRequest;
