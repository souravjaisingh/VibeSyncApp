import React, { useEffect } from 'react';

const SampleTransactionComponent = () => {
    const merchant_id = "2193"; // Put your merchant id here
    const access_code = "F94007DF1640D69A"; // Put access code here
    const enc_key = "FABE114254BDBC7823534894FFFCCC1"; // Put encryption key here

    useEffect(() => {
        // Construct the ccaRequest from the URL parameters
        const queryParams = new URLSearchParams(window.location.search);
        let ccaRequest = '';

        queryParams.forEach((value, key) => {
        ccaRequest += `${key}=${value}&`;
        });

        // Convert the encryption key to a binary buffer
        const keyBuffer = new TextEncoder().encode(enc_key);

        // Ensure the key is 256 bits (32 bytes) by padding if necessary
        const keyBytes = new Uint8Array(32);
        keyBuffer.forEach((byte, index) => {
        keyBytes[index] = byte;
        });

        // Convert the ccaRequest to an ArrayBuffer
        const requestData = new TextEncoder().encode(ccaRequest);

        // Generate a cryptographic key from the encryption key
        window.crypto.subtle.importKey(
        'raw',
        keyBytes,
        { name: 'AES-CBC' },
        false,
        ['encrypt', 'decrypt']
        ).then((key) => {
        // Encrypt the ccaRequest using AES encryption
        window.crypto.subtle.encrypt(
            { name: 'AES-CBC', iv: new ArrayBuffer(16) }, // Use an appropriate IV
            key,
            requestData
        ).then((encryptedData) => {
            // Convert the encrypted data to a hexadecimal string
            const encryptedHex = Array.from(new Uint8Array(encryptedData))
            .map((byte) => byte.toString(16).padStart(2, '0'))
            .join('');

            // Make an HTTP POST request using fetch
            fetch('https://test.ccavenue.com/transaction/transaction.do?command=initiatePayloadTransaction', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: `encRequest=${encryptedHex}&access_code=${access_code}`,
            })
            .then((response) => response.text())
            .then((vResponse) => {
                // Handle the response here (e.g., display it in the console)
                console.log(vResponse);
            })
            .catch((error) => {
                // Handle any errors that occurred during the fetch request
                console.error(error);
            });
        });
        });
    }, []);

    return (
        <div>
        {/* You can add any content you want to display to the user while the redirection happens */}
        <h1>Redirecting to CCAvenue...</h1>
        </div>
    );
};

export default SampleTransactionComponent;
