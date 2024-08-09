import React, { useState, useEffect, useContext } from 'react';
import './DjProfile.css';
import { UpdateDjDetails, GetDjProfile } from './services/DjService';
import { MyContext } from '../App';
import { useLoadingContext } from './LoadingProvider';
import { useNavigate } from 'react-router-dom';

const DjProfile = () => {
  const { error, setError } = useContext(MyContext);
  const { errorMessage, setErrorMessage } = useContext(MyContext);
  const [id, setId] = useState('');
  const [userid, setUserId] = useState('');
  const [djName, setDjName] = useState('');
  const [artistName, setArtistName] = useState('');
  const [djGenre, setDjGenre] = useState('');
  const [djDescription, setDjDescription] = useState('');
  const [djPhoto, setDjPhoto] = useState('');
  const [uploadImg, setUploadImg] = useState(null);

  const [bankName, setBankName] = useState('');
  const [bankAccountNumber, setBankAccountNumber] = useState('');
  const [branchName, setBranchName] = useState('');
  const [ifscCode, setIfscCode] = useState('');
  const [socialLinks, setSocialLinks] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [profileErrorMessage, setProfileErrorMessage] = useState('');
  const { setLoading } = useLoadingContext();
  const navigate = useNavigate();
  const [fileName, setFileName] = useState('');
  const [djNameError, setDjNameError] = useState('');
  const [djDescriptionError, setDjDescriptionError] = useState('');
  const [bankAccountNumberError, setBankAccountNumberError] = useState('');
  const [branchNameError, setBranchNameError] = useState('');
  const [ifscCodeError, setIfscCodeError] = useState('');
  const [socialLinksError, setSocialLinksError] = useState('');

  const handleFileChange = (e) => {
      setUploadImg(e.target.files[0]); // Store the file object
      const file = e.target.files[0];
      if (file) {
          setFileName(file.name);
      }
  };

  const handleDjNameChange = (e) => {
    const value = e.target.value;
    if (value.length > 100) {
      setDjNameError('Max char allowed: 100');
    } else {
      setDjNameError('');
    }
    setDjName(value);
  };

  const handleDjDescriptionChange = (e) => {
    const value = e.target.value;
    if (value.length > 2000) {
      setDjDescriptionError('Max char allowed: 2000');
    } else {
      setDjDescriptionError('');
    }
    setDjDescription(value);
  };

  const handleBankAccountNumberChange = (e) => {
    
    const input = e.target.value;
    const numericInput = input.replace(/[^0-9]/g, '');
    if (numericInput.length > 20) {
      setBankAccountNumberError('Max char allowed: 20');
    } else {
      setBankAccountNumberError('');
    }
    setBankAccountNumber(numericInput);
  };

  const handleBranchNameChange = (e) => {
    const value = e.target.value;
    if (value.length > 100) {
      setBranchNameError('Max char allowed: 100');
    } else {
      setBranchNameError('');
    }
    setBranchName(value);
  };

  const handleIfscCodeChange = (e) => {
    const value = e.target.value;
    if (value.length > 40) {
      setIfscCodeError('Max char allowed: 40');
    } else {
      setIfscCodeError('');
    }
    setIfscCode(value);
  };

  const handleSocialLinksChange = (e) => {
    const value = e.target.value;
    if (value.length > 200) {
      setSocialLinksError('Max char allowed: 200');
    } else {
      setSocialLinksError('');
    }
    setSocialLinks(value);
  };


  const handleSubmit = async () => {
    setLoading(true);
    setProfileErrorMessage('');
    setSuccessMessage('');

    // Validation: Check if required fields are filled in
    if (!djName || !userid) {
      setProfileErrorMessage('All required fields must be filled in.');
      setLoading(false);
      return;
    }

    if (djNameError || djDescriptionError || bankAccountNumberError || branchNameError || ifscCodeError || socialLinksError) {
      setProfileErrorMessage('Please fix the validation errors before submitting.');
      setLoading(false);
      return;
    }

    // Create a FormData object
    const formData = new FormData();
    formData.append('DjName', djName);
    formData.append('ArtistName', artistName);
    formData.append('DjGenre', 'Club');
    formData.append('DjDescription', djDescription);
    if (uploadImg) {
      formData.append('uploadImg', uploadImg); // Append the file if selected
    }
    formData.append('BankName', bankName);
    formData.append('BankAccountNumber', bankAccountNumber);
    formData.append('BranchName', branchName);
    formData.append('IFSCCode', ifscCode);
    formData.append('SocialLinks', socialLinks);
    formData.append('Id', id);
    formData.append('UserId', userid);
    formData.append('ModifiedBy', localStorage.getItem('userId'));

    // Call the UpdateDjDetails function to save the DJ profile
    try {
      const response = await UpdateDjDetails(formData);
      if (response.errors) {
        console.error('Error saving DJ profile:', response.errors);
        setProfileErrorMessage('Error saving DJ profile. Please try again.');
      } else {
        console.log('DJ profile saved successfully:', response.data);
        setSuccessMessage('DJ profile saved successfully. Redirecting to home page.');
        // Set a timeout to navigate after 3-4 seconds
        setTimeout(() => {
          navigate('/djhome');
        }, 2000); // 3000 milliseconds = 3 seconds

      }
    } catch (error) {
      setError(true);
      setErrorMessage(error.message);
      console.error('Error saving DJ profile:', error);
      setProfileErrorMessage('Error saving DJ profile. Please try again.');
    }
    setLoading(false);
  };

  //const handleBankAccountNumberChange = (e) => {
  // const input = e.target.value;
  //  const numericInput = input.replace(/[^0-9]/g, ''); // Allow only numeric characters
  //  setBankAccountNumber(numericInput);
  //};

  // Fetch DJ profile data when the component mounts
  useEffect(() => {
    async function getDjProfile() {
      setLoading(true);
      try {
        const res = await GetDjProfile(localStorage.getItem('userId'));
        setDjName(res.djName);
        setArtistName(res.artistName);
        setDjGenre(res.djGenre);
        setDjDescription(res.djDescription);
        setDjPhoto(res.djPhoto); // Set djPhoto to null if no URL is present
        setBankName(res.bankName);
        setBankAccountNumber(res.bankAccountNumber);
        setBranchName(res.branchName);
        setIfscCode(res.ifsccode);
        setSocialLinks(res.socialLinks);
        setId(res.id);
        setUserId(res.userId);
        setUploadImg(null); // Initialize uploadImg to null
      } catch (error) {
        setError(true);
        setErrorMessage(error.message);
        console.error('Error fetching DJ profile:', error);
      }
      setLoading(false);
    }
    getDjProfile();
  }, []);

  return (
      <div className="dj-profile">
          <img src="/images/BGMusic.png" alt="Background" className= "profile-page-bg-image" style={{ top: '85px', position: 'absolute', height: '156px', width: '100%' }} />
          <p className="dj-profile-heading" style={{ fontWeight: '700', color: '#39125C', fontSize: '32px', marginTop: '23px', marginBottom: '10px' }}>DJ Profile</p>
      <form className="profile-form">
        {successMessage && <p className="success-message">{successMessage}</p>}
        {profileErrorMessage && <p className="dj-profile-error-message">{profileErrorMessage}</p>}
          <div className="profile-input-group">
          <label htmlFor="djNameInput">Name</label>
          <input
            type="text"
            id="djNameInput"
            classNamesName ="profile-input-fields"
            placeholder="Name"
            value={djName}
            onChange= {handleDjNameChange}
          />
          {djNameError && <p className="dj-profile-error-message">{djNameError}</p>}
        </div>
              <div className="profile-input-group">
          <label htmlFor="artistNameInput">Artist Name</label>
          <input
            type="text"
            id="artistNameInput"
            classNamesName="profile-input-fields"
            placeholder="Artist Name"
            value={artistName}
            onChange={(e) => setArtistName(e.target.value)}
          />
        </div>
              <div className="profile-input-group">
          
          <label htmlFor="djDescriptionInput">Description</label>
          <input
            id="djDescriptionInput"
            classNamesName="profile-input-fields"
            placeholder="Description"
            value={djDescription}
            onChange= {handleDjDescriptionChange}
            maxLength={2000}
          />
          {djDescriptionError && <p className="dj-profile-error-message">{djDescriptionError}</p>}
        </div>
              <div className="profile-input-group">
                  <label htmlFor="djPhotoInput">Photo</label>
                  <div
                      className="profile-upload-container"
                      onClick={() =>
                          document.getElementById("djPhotoInput").click()
                      }
                  >
                      <div className="profile-upload-icon">&#128190;</div>
                      <div className="profile-upload-text"> {fileName && fileName.length > 0 ? fileName : 'Upload File'}</div>
                      <input type="file" id="djPhotoInput" classNamesName="profile-input-fields" onChange={handleFileChange} accept="image/*" />
                  </div>
          {/*<input*/}
          {/*  type="file"*/}
          {/*  id="djPhotoInput"*/}
          {/*  classNamesName="profile-input-fields"*/}
          {/*  onChange={handleFileChange}*/}
          {/*  accept="image/*"*/}
          {/*/>*/}
        </div>
              <div className="profile-input-group">
          <label htmlFor="bankAccountNumberInput">Account No.</label>
          <input
            type="text"
            id="bankAccountNumberInput"
            classNamesName="profile-input-fields"
            placeholder="Account No."
            value={bankAccountNumber}
            onChange={handleBankAccountNumberChange}
          />
          {bankAccountNumberError && <p className="dj-profile-error-message">{bankAccountNumberError}</p>}
        </div>
              <div className="profile-input-group">
          <label htmlFor="branchNameInput">Branch Name</label>
          <input
            type="text"
            id="branchNameInput"
            classNamesName="profile-input-fields"
            placeholder="Branch Name"
            value={branchName}
            onChange= {handleBranchNameChange}
          />
          {branchNameError && <p className="dj-profile-error-message">{branchNameError}</p>}
        </div>
              <div className="profile-input-group">
          <label htmlFor="ifscCodeInput">IFSC Code</label>
          <input
            type="text"
            id="ifscCodeInput"
            classNamesName="profile-input-fields"
            placeholder="IFSC Code"
            value={ifscCode}
            onChange= {handleIfscCodeChange}
          />
          {ifscCodeError && <p className="dj-profile-error-message">{ifscCodeError}</p>}
        </div>
              <div className="profile-input-group">
          <label htmlFor="socialLinksInput">Social Links</label>
          <input
            type="text"
            id="socialLinksInput"
            classNamesName="profile-input-fields"
            placeholder="Social Links"
            value={socialLinks}
            onChange= {handleSocialLinksChange}
          />
          {socialLinksError && <p className="dj-profile-error-message">{socialLinksError}</p>}
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
