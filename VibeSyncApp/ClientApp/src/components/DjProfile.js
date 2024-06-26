import React, { useState, useEffect, useContext } from 'react';
import './DjProfile.css';
import { UpdateDjDetails, GetDjProfile } from './services/DjService';
import { MyContext } from '../App';

const DjProfile = () => {
  const { error, setError } = useContext(MyContext);
    const {errorMessage, setErrorMessage} = useContext(MyContext);
  const [id, setId] = useState('');
  const [userid, setUserId] = useState('');
  const [djName, setDjName] = useState('');
  const [artistName, setArtistName] = useState(''); 
  const [djGenre, setDjGenre] = useState('');
  const [djDescription, setDjDescription] = useState('');
  const [djPhoto, setDjPhoto] = useState('');
  const [bankName, setBankName] = useState('');
  const [bankAccountNumber, setBankAccountNumber] = useState('');
  const [branchName, setBranchName] = useState('');
  const [ifscCode, setIfscCode] = useState('');
  const [socialLinks, setSocialLinks] = useState('');
  const [successMessage, setSuccessMessage] = useState(''); 
  const [profileErrorMessage, setProfileErrorMessage] = useState(''); 

  const handleSubmit = async () => {
    setProfileErrorMessage('');
    setSuccessMessage('');
    // Validation: Check if any input field is empty
    if (!djName || !userid) { // Add required fields here  
      setProfileErrorMessage('All required fields must be filled in.'); // Set error message
      return; // Don't proceed with the API call
    }

    // Validation: Check the data type of bankAccountNumber
    if (bankAccountNumber && isNaN(parseInt(bankAccountNumber))) {
      setProfileErrorMessage('Bank Account Number must be a number.'); // Set error message
      return; // Don't proceed with the API call
    }

    // Create a DJ profile object with the form data
    const djProfile = {
      DjName: djName,
      ArtistName: artistName, 
      DjGenre: djGenre,
      DjDescription: djDescription,
      DjPhoto: djPhoto,
      BankName: bankName,
      BankAccountNumber: bankAccountNumber,
      BranchName: branchName,
      IFSCCode: ifscCode,
      SocialLinks: socialLinks,
      Id: id,
      UserId: userid,
      ModifiedBy: localStorage.getItem('userId')
    };

    // Call the UpdateDjDetails function to save the DJ profile
    try {
      const response = await UpdateDjDetails(djProfile);
      if(response.errors != null){
        console.error('Error saving DJ profile:', response.errors);
        setProfileErrorMessage('Error saving DJ profile. Please try again'); 
      }
      else{
        console.log('DJ profile saved successfully:', response.data);
        setSuccessMessage('DJ profile saved successfully');
      }
    } catch (error) {
      setError(true);
      setErrorMessage(error.message);
      // Handle network or other errors
      console.error('Error saving DJ profile:', error);
      setProfileErrorMessage('Error saving DJ profile. Please try again.'); 
    }
  };
  const handleBankAccountNumberChange = (e) => {
    const input = e.target.value;
    // Use a regular expression to allow only numeric characters
    const numericInput = input.replace(/[^0-9]/g, '');
    setBankAccountNumber(numericInput);
  };
  
  // Fetch DJ profile data when the component mounts
  useEffect(() => {
    async function getDjProfile() {
      try {
        const res = await GetDjProfile(localStorage.getItem('userId'));
        // Populate the form fields with fetched data
        setDjName(res.djName);
        setArtistName(res.artistName);
        setDjGenre(res.djGenre);
        setDjDescription(res.djDescription);
        setDjPhoto(res.djPhoto);
        setBankName(res.bankName);
        setBankAccountNumber(res.bankAccountNumber);
        setBranchName(res.branchName);
        setIfscCode(res.ifsccode);
        setSocialLinks(res.socialLinks);
        setId(res.id);
        setUserId(res.userId)
      } catch (error) {
        setError(true);
        setErrorMessage(error.message);
        // Handle network or other errors
        console.error('Error fetching DJ profile:', error);
      }
    }

    getDjProfile();
  }, []);

  return (
    <div className="dj-profile">
      <form className="profile-form">
      {successMessage && <p className="success-message">{successMessage}</p>}
      {profileErrorMessage && <p className="error-message">{profileErrorMessage}</p>} 
      <p className="dj-profile-heading">DJ Profile</p>
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
            maxLength={200}
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
          <label htmlFor="bankAccountNumberInput">Account Number</label>
          <input
            type="text"
            id="bankAccountNumberInput"
            placeholder="Account Number"
            value={bankAccountNumber}
            onChange={handleBankAccountNumberChange} // Use the custom change handler
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
