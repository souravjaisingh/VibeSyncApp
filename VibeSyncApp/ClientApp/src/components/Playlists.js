import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate from react-router-dom
import './Playlists.css'; // Import CSS file for styling (make sure to create this file)

const PlaylistComponent = () => {
    const navigate = useNavigate(); // Create navigate function using useNavigate
    const [excelFile, setExcelFile] = useState(null);

    const [playlists, setPlaylists] = useState([
        { id: 1, name: 'Playlist 1', songs: ['Song 1', 'Song 2', 'Song 3', 'Song 3', 'Song 3', 'Song 3', 'Song 3', 'Song 3', 'Song 3', 'Song 3', 'Song 3', 'Song 3', 'Song 3', 'Song 3', 'Song 3'], expanded: false },
        { id: 2, name: 'Playlist 2', songs: ['Song 4', 'Song 5', 'Song 6'], expanded: false },
    ]);

    const handlePlaylistClick = (playlistId) => {
        setPlaylists(prevPlaylists =>
            prevPlaylists.map(playlist =>
                playlist.id === playlistId ? { ...playlist, expanded: !playlist.expanded } : playlist
            )
        );
    };
    const handleBack = () => {
        navigate(-1); // Go back to the previous page when back button is clicked
    };
    const handleFileChange = (e) => {
        const file = e.target.files[0];
        setExcelFile(file);
    };
    // const handlePlaylistClick = (playlistId) => {
    //     // Redirect to the songs page for the selected playlist
    //     navigate(`/playlist/${playlistId}`);
    // };

    return (
        <div className="playlist-container">
            {/* Back button */}
            <span className="back-icon" onClick={handleBack}>
                &lt;&lt; Back &nbsp;
            </span>
            {/* <span className='playlist-heading'style={{ textAlign: 'center', display: 'block' }}>Playlists</span> */}

            <div className="input-group">
                <label htmlFor="excelFileInput">Upload Playlist</label>
                <input
                    type="file"
                    id="excelFileInput"
                    onChange={handleFileChange}
                    accept=".xlsx, .xls"
                />
            </div>

            <ul className="playlist-list">
                {playlists.map(playlist => (
                    <li key={playlist.id} onClick={() => handlePlaylistClick(playlist.id)}>
                        {playlist.name}
                        {/* <span className={`playlist-icon ${playlist.expanded ? 'expanded' : ''}`}>
                            {playlist.expanded ? '\u25B2' : '\u25BC'}
                        </span> */}
                        {playlist.expanded && (
                            <ul className="song-list">
                                {playlist.songs.map((song, index) => (
                                    <li key={index}>{song}</li>
                                ))}
                            </ul>
                        )}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default PlaylistComponent;
