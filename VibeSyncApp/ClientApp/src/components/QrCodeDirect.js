import React from 'react';
import QRCode from 'qrcode.react';
import './QrCodeDirect.css';

export default function QrCodeDirect({eventId}) {
    //console.log(eventId);
    if(eventId == null){
        eventId = localStorage.getItem('eventId') != null ? localStorage.getItem('eventId') : null
    }
    let url = 'https://vibesync.in/songsearch?qrcode=true&eventId='+eventId+'&userId='+localStorage.getItem('userId');
    // if(eventId == 18){
    //     url = 'https://vibesyncdj.azurewebsites.net/songsearch?qrcode=true&eventId='+eventId+'&userId='+localStorage.getItem('userId');
    // }
    console.log(url);
    const downloadQR = () => {
        const canvas = document.getElementById('event');
        const pngUrl = canvas
            .toDataURL('image/png')
            .replace('image/png', 'image/octet-stream');
        let downloadLink = document.createElement('a');
        downloadLink.href = pngUrl;
        downloadLink.download = 'Event.png';
        document.body.appendChild(downloadLink);
        downloadLink.click();
        document.body.removeChild(downloadLink);
    };

    return (
        <div className="qr-container">
            <QRCode
                id="event"
                value={url}
                size={290}
                level={'H'}
                includeMargin={true}
            />
            <a onClick={downloadQR} className="download-link">
                Download QR
            </a>
        </div>
    );
}
