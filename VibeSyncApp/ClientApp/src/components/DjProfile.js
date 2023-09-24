import React, { useState, useEffect } from 'react';
import './DjProfile.css';
import { UpdateDjDetails, GetDjProfile } from '../services/DjService';
import * as Constants from '../Constants';

const DjProfile = () => {
  const [djName, setDjName] = useState('');
  const [artistName, setArtistName] = useState(''); // Added artistName state
  const [djGenre, setDjGenre] = useState('');
  const [djDescription, setDjDescription] = useState('');
  const [djPhoto, setDjPhoto] = useState('');
  const [bankName, setBankName] = useState('');
  const [bankAccountNumber, setBankAccountNumber] = useState('');
  const [branchName, setBranchName] = useState('');
  const [ifscCode, setIfscCode] = useState('');
  const [socialLinks, setSocialLinks] = useState('');
  const [events, setEvents] = useState(null); // State to store DJ profile data

  const handleSubmit = async () => {
    // Validation: Check if any input field is empty
    if (!djName) {
      console.error('All fields are mandatory');
      return; // Don't proceed with the API call
    }

    // Create a DJ profile object with the form data
    const djProfile = {
      DjName: djName,
      ArtistName: artistName, // Include artistName in the object
      DjGenre: djGenre,
      DjDescription: djDescription,
      DjPhoto: djPhoto,
      BankName: bankName,
      BankAccountNumber: bankAccountNumber,
      BranchName: branchName,
      IFSCCode: ifscCode,
      SocialLinks: socialLinks,
    };

    // Call the UpdateDjDetails function to save the DJ profile
    try {
      const response = await UpdateDjDetails(djProfile);
      if (response.status === Constants.statusCodes.OK) {
        // Handle success and possibly navigate to another page
        console.log('DJ profile saved successfully:', response.data);
      } else {
        // Handle errors, e.g., display an error message
        console.error('Error saving DJ profile:', response.data.message);
      }
    } catch (error) {
      // Handle network or other errors
      console.error('Error saving DJ profile:', error);
    }
  };

  // Fetch DJ profile data when the component mounts
  useEffect(() => {
    async function getDjProfile() {
      try {
        const res = await GetDjProfile(localStorage.getItem('userId'));
        if (res.status === Constants.statusCodes.OK) {
          // Set the DJ profile data in state
          setEvents(res.data);
          // Populate the form fields with fetched data
          setDjName(res.data.DjName);
          setArtistName(res.data.ArtistName);
          setDjGenre(res.data.DjGenre);
          setDjDescription(res.data.DjDescription);
          setDjPhoto(res.data.DjPhoto);
          setBankName(res.data.BankName);
          setBankAccountNumber(res.data.BankAccountNumber);
          setBranchName(res.data.BranchName);
          setIfscCode(res.data.IFSCCode);
          setSocialLinks(res.data.SocialLinks);
        } else {
          // Handle errors, e.g., display an error message
          console.error('Error fetching DJ profile:', res.data.message);
        }
      } catch (error) {
        // Handle network or other errors
        console.error('Error fetching DJ profile:', error);
      }
    }

    getDjProfile();
  }, []);

  return (
    <div className="dj-profile">
      <form className="profile-form">
        <p>All fields are mandatory</p>
        <div className="input-group">
          <label htmlFor="djNameInput">Name</label>
          <input
            type="text"
            id="djNameInput"
            placeholder="Name"
            value={djName}
            onChange={(e) => setDjName(e.target.value)}
          />
        </div>
        <div className="input-group">
          <label htmlFor="artistNameInput">Artist Name</label> {/* Added Artist Name */}
          <input
            type="text"
            id="artistNameInput"
            placeholder="Artist Name"
            value={artistName}
            onChange={(e) => setArtistName(e.target.value)}
          />
        </div>
        <div className="input-group">
          <label htmlFor="djGenreInput">Genre</label>
          <input
            type="text"
            id="djGenreInput"
            placeholder="Genre"
            value={djGenre}
            onChange={(e) => setDjGenre(e.target.value)}
          />
        </div>
        <div className="input-group">
          <label htmlFor="djDescriptionInput">Description</label>
          <textarea
            id="djDescriptionInput"
            placeholder="Description"
            value={djDescription}
            onChange={(e) => setDjDescription(e.target.value)}
          />
        </div>
        <div className="input-group">
          <label htmlFor="djPhotoInput">Photo</label>
          <input
            type="text"
            id="djPhotoInput"
            placeholder="Photo URL"
            value={djPhoto}
            onChange={(e) => setDjPhoto(e.target.value)}
          />
        </div>
        <div className="input-group">
          <label htmlFor="bankNameInput">Bank Name</label>
          <input
            type="text"
            id="bankNameInput"
            placeholder="Bank Name"
            value={bankName}
            onChange={(e) => setBankName(e.target.value)}
          />
        </div>
        <div className="input-group">
          <label htmlFor="bankAccountNumberInput">Account Number</label>
          <input
            type="text"
            id="bankAccountNumberInput"
            placeholder="Account Number"
            value={bankAccountNumber}
            onChange={(e) => setBankAccountNumber(e.target.value)}
          />
        </div>
        <div className="input-group">
          <label htmlFor="branchNameInput">Branch Name</label>
          <input
            type="text"
            id="branchNameInput"
            placeholder="Branch Name"
            value={branchName}
            onChange={(e) => setBranchName(e.target.value)}
          />
        </div>
        <div className="input-group">
          <label htmlFor="ifscCodeInput">IFSC Code</label>
          <input
            type="text"
            id="ifscCodeInput"
            placeholder="IFSC Code"
            value={ifscCode}
            onChange={(e) => setIfscCode(e.target.value)}
          />
        </div>
        <div className="input-group">
          <label htmlFor="socialLinksInput">Social Links</label>
          <input
            type="text"
            id="socialLinksInput"
            placeholder="Social Links"
            value={socialLinks}
            onChange={(e) => setSocialLinks(e.target.value)}
          />
        </div>
        <button
          onClick={handleSubmit}
          type="button"
          className="btn btn--primary btn--medium btn-save"
        >
          Save Profile
        </button>
      </form>
    </div>
  );
};

export default DjProfile;
