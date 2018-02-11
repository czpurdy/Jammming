import React from 'react';
import './App.css';

import Playlist from "../Playlist/Playlist.js";
import SearchBar from "../SearchBar/SearchBar.js";
import SearchResults from "../SearchResults/SearchResults.js";

import Spotify from "../../util/Spotify.js";

class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      searchResults: [],
      // set default playlist name -- allows playlist name to reset after a playlist is saved
      playlistName: "New Playlist",
      playlistTracks: []
    }
    this.addTrack = this.addTrack.bind(this);
    this.removeTrack = this.removeTrack.bind(this);
    this.updatePlaylistName = this.updatePlaylistName.bind(this);
    this.savePlaylist = this.savePlaylist.bind(this);
    this.search = this.search.bind(this);
  }

  addTrack(track) {
    // checks that new track id is not identical to track id of each track already added to playlist. will add to playlist if new
    let notInPlaylist = this.state.playlistTracks.every(playlistTrack =>
      playlistTrack.id !== track.id);
    if (notInPlaylist) {
      this.setState({
        playlistTracks: this.state.playlistTracks.concat([track]),
      });
    }
  }

  removeTrack(track) { 
    let tracks = this.state.playlistTracks;
    tracks = tracks.filter(currentTrack => currentTrack.id !== track.id);

    this.setState({playlistTracks: tracks});
  }

  updatePlaylistName(name) {
    this.setState({playlistName: name});
  }

  savePlaylist() {
    let trackURIs = this.state.playlistTracks.map(track => track.uri);
    Spotify.savePlaylist(this.state.playlistName, trackURIs);
    this.setState({
      playlistName: "New Playlist",
      playlistTracks: [],
      searchResults: []
    });
  }

  search(searchTerm) {
    Spotify.search(searchTerm).then(searchResults => {
      this.setState({searchResults: searchResults});
    });
  }

  render() {
    return (
      <div>
      <h1>Ja<span className="highlight">mmm</span>ing</h1>
        <div className="App">
          <SearchBar onSearch={this.search} />
          <div className="App-playlist">
            <SearchResults 
              searchResults={this.state.searchResults} 
              onAdd={this.addTrack} 
            />
            <Playlist 
              playlistName={this.state.playlistName} 
              playlistTracks={this.state.playlistTracks} 
              onRemove={this.removeTrack} 
              onNameChange={this.updatePlaylistName} 
              onSave={this.savePlaylist} 
            />
          </div>
        </div>
      </div>
    );
  }
}

export default App;


