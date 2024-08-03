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


  const handleFileChange = (e) => {
    setUploadImg(e.target.files[0]); // Store the file object
  };


  const handleSubmit = async () => {
    setLoading(true);
    setProfileErrorMessage('');
    setSuccessMessage('');

    // Validation: Check if required fields are filled in
    if (!djName || !userid) {
      setProfileErrorMessage('All required fields must be filled in.');
      return;
    }

    // Validation: Check if the bank account number is a number
    if (bankAccountNumber && isNaN(parseInt(bankAccountNumber))) {
      setProfileErrorMessage('Bank Account Number must be a number.');
      return;
    }

    // Create a FormData object
    const formData = new FormData();
    formData.append('DjName', djName);
    formData.append('ArtistName', artistName);
    formData.append('DjGenre', djGenre);
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

  const handleBankAccountNumberChange = (e) => {
    const input = e.target.value;
    const numericInput = input.replace(/[^0-9]/g, ''); // Allow only numeric characters
    setBankAccountNumber(numericInput);
  };

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
          <label htmlFor="artistNameInput">Artist Name</label>
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
            type="file"
            id="djPhotoInput"
            onChange={handleFileChange}
            accept="image/*"
          />
        </div>
        <div className="input-group">
          <label htmlFor="bankAccountNumberInput">Account Number</label>
          <input
            type="text"
            id="bankAccountNumberInput"
            placeholder="Account Number"
            value={bankAccountNumber}
            onChange={handleBankAccountNumberChange}
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
