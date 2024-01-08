import * as Constants from '../Constants';
import { handleAPIRequest } from './UserService'; // Adjust the import path as needed

export async function GetSongsUsingSearchTerm(query, offset, limit) {
    const qString = `SongName=${query}&offset=${offset}&limit=${limit}`;
    return handleAPIRequest(`Songs/GetSong?${qString}`, 'GET');
}

export async function GetSongsByEventId(id, isUser = false) {
    return handleAPIRequest(`Songs/GetSongHistory?EventId=${id}&isUser=${isUser}`, 'GET');
}

export async function ModifySongRequest(data) {
    return handleAPIRequest('Songs/UpdateSongHistory', 'PUT', data);
}
