import * as Constants from '../Constants'

export async function GetSongsUsingSearchTerm(query, offset, limit){
    var qString = `SongName=${query}&offset=${offset}&limit=${limit}`;
    const res = await fetch(Constants.baseUri + `Songs/GetSong?${qString}`)
    .then((response) => response.json())
    .catch((error) => {
        console.error('Error fetching data:', error);
    });
    return res;
};
