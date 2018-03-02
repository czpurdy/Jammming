let accessToken;
let clientId = "1e1c26ec77b247539b9f0d37a4699857";
let redirectUri = "http://localhost:3000/";

let Spotify = {
    getAccessToken: function() {
        // check URL to see if it's been obtained
        // had to refer to window.location.href directly bc of ESLint
        let accessTokenMatch = window.location.href.match("access_token=([^&]*)");
        let expiresInMatch = window.location.href.match("expires_in=([^&]*)");

        if (accessToken) {
            // already has access token -- returned
            return accessToken;

        } else if (accessTokenMatch && expiresInMatch) {
            // don't have access token but can retrieve from URL
            accessToken = accessTokenMatch[1];
            let expiresIn = expiresInMatch[1];

            // resets the access token and URL parameters
            window.setTimeout(() => accessToken = null, expiresIn * 1000);
            window.history.pushState('Access Token', null, '/');

            // do not be like past Christine and forget this
            return accessToken;

        } else {
            // access token variable is empty and is not in the URL
            window.location=`https://accounts.spotify.com/authorize?client_id=${clientId}&response_type=token&scope=playlist-modify-public&redirect_uri=${redirectUri}`;
        }
    },

    search: async function(term) {
        try {
            accessToken = Spotify.getAccessToken();

            let response = await fetch(`https://api.spotify.com/v1/search?type=track&q=${term}`, {
                headers: {
                    Authorization: `Bearer ${accessToken}`
                }
            });
            if (response.ok) {
                // convert returned response to json object
                let jsonResponse = await response.json();
                let tracks = jsonResponse.tracks.items;
                if (tracks.length === 0) {
                    return [];
                } else {
                    return tracks.map(track => ({
                        id: track.id,
                        name: track.name,
                        artist: track.artists[0].name,
                        album: track.album.name,
                        uri: track.uri
                    }));
                }
            }

            // throw error if response not received
            throw new Error ("Request failed!");

        } catch(error) {
            // log error
            console.log(error);
        }
    },

    savePlaylist: async function(playlistName, trackURIs) {
        // if we don't have a playlist name or the track uri then nothing happens
        if (!playlistName || !trackURIs) {
            return;
        }

        accessToken = this.getAccessToken();
        let headers = {
            Authorization: `Bearer ${accessToken}`
        };
        let userID;
        let playlistID;
        
        // gets userID
        fetch("https://api.spotify.com/v1/me", {headers: headers}).then(response => {
            if (response.ok) {
                return response.json();
            }
            throw new Error("Request failed!");
        }, networkError => console.log(networkError.message)
        ).then(jsonResponse => {
            userID = jsonResponse.id;
        }).then(()=>{
            // creates playlist under playlistName
            fetch(`https://api.spotify.com/v1/users/${userID}/playlists`, {
                headers: headers,
                method: "POST",
                body: JSON.stringify({ name: playlistName })
            }).then(response => {
                if (response.ok) {
                    return response.json();
                }
                throw new Error("Request failed!");
            }, networkError => console.log(networkError.message)).then(jsonResponse => {
                playlistID = jsonResponse.id;
            }).then(()=>{
                // posts tracks to playlist
                fetch(`https://api.spotify.com/v1/users/${userID}/playlists/${playlistID}/tracks`, {
                    headers: headers,
                    method: "POST",
                    body: JSON.stringify({ uris: trackURIs })
                }).then(response => {
                    if (response.ok) {
                        return response.json();
                    }
                    throw new Error("Request failed!");
                })
            })
        })
    }
}

export default Spotify;

