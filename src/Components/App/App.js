import React from 'react';
import './App.css';

import Playlist from "../Playlist/Playlist.js";
import SearchBar from "../SearchBar/SearchBar.js";
import SearchResults from "../SearchResults/SearchResults.js";
import LoadingSpinner from '../LoadingSpinner/LoadingSpinner.js';

import Spotify from "../../util/Spotify.js";

class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      searchResults: [],
      // set default playlist name -- allows playlist name to reset after a playlist is saved
      playlistName: "New Playlist",
      playlistTracks: [],
      loading: false,
    }
    this.addTrack = this.addTrack.bind(this);
    this.removeTrack = this.removeTrack.bind(this);
    this.updatePlaylistName = this.updatePlaylistName.bind(this);
    this.savePlaylist = this.savePlaylist.bind(this);
    this.search = this.search.bind(this);
  }

  addTrack(track) {
    // checks that new track id is not identical to track id of each track already added to playlist. will add to playlist if new
    let notInPlaylist = this.state.playlistTracks.every(playlistTrack => playlistTrack.id !== track.id);

    // removes track added to playlist from search results
    if (notInPlaylist) {
      let visibleSearchResults = this.state.searchResults.map(searchTrack => {
        if (searchTrack.id === track.id){
          searchTrack.isVisible = false;
        }
        return searchTrack;
      });
      
      this.setState({
        playlistTracks: this.state.playlistTracks.concat([track]),
        searchResults: visibleSearchResults

        // alternate method to remove track added to playlist from search results 
        // searchResults: this.state.searchResults.filter(searchResultsTrack => searchResultsTrack.id !== track.id)
      });
    }
  }

  removeTrack(track) { 
    let tracks = this.state.playlistTracks;
    tracks = tracks.filter(currentTrack => currentTrack.id !== track.id);

    // adds track removed from playlist to search results
    let visibleSearchResults = this.state.searchResults.map(searchTrack => {
      if (searchTrack.id === track.id){
        searchTrack.isVisible = true;
      }
      return searchTrack;
    });

    // alternative method to add track removed from playlist to search results
    //let newSearchResults = this.state.searchResults;
    // newSearchResults.unshift(track);

    this.setState({ 
      playlistTracks: tracks,
      searchResults: visibleSearchResults
    });
  }

  updatePlaylistName(name) {
    this.setState({playlistName: name});
  }

  savePlaylist() {
    let trackURIs = this.state.playlistTracks.map(track => track.uri);
    Spotify.savePlaylist(this.state.playlistName, trackURIs).then(() => {
      
    });
    
    this.setState({
      playlistName: "New Playlist",
      playlistTracks: [],
      searchResults: []
    });
  }

  search(searchTerm) {
    this.setState({ loading: true }, () => {
      Spotify.search(searchTerm).then(searchResults => { // adds isVisible attribute to each search track
        searchResults.forEach(searchResult => {
          searchResult.isVisible = true;
          return searchResult;
        })
        return searchResults;
      }).then(searchResults => {
        this.setState({
          searchResults: searchResults,
          loading: false, 
        });
      });
    });
  }

  render() {
    const { searchResults, loading, playlistName, playlistTracks} = this.state;

    return (
      <div>
      <h1>Ja<span className="highlight">mmm</span>ing</h1>
        <div className="App">
          <SearchBar onSearch={this.search} />
          <div className="App-playlist">
            {loading ? <LoadingSpinner/> :  <SearchResults 
              searchResults={searchResults} 
              onAdd={this.addTrack} 
            />}
            <Playlist 
              playlistName={playlistName} 
              playlistTracks={playlistTracks} 
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


