import React from "react";
import './Track.css';

class Track extends React.Component {
    constructor(props) {
        super(props);

        this.addTrack = this.addTrack.bind(this);
        this.removeTrack = this.removeTrack.bind(this);
    }
    
    // logic returns either plus or minus symbol depending on isRemoval
    renderAction() {
        if (this.props.isRemoval) {
            return <a onClick={this.removeTrack}>-</a>;
        } else {
            return <a onClick={this.addTrack}>+</a>;
        }
    }

    addTrack() {
        this.props.onAdd(this.props.track);
    }

    removeTrack() {
        this.props.onRemove(this.props.track);
    }

    render() {
        // toggles visibility of tracks depending on whether they're in playlist or search results
        let visibility;
        if (!this.props.isPlaylist){
            visibility = {
                display: this.props.track.isVisible ? "flex" : "none"
            }
        } else {
            visibility = {display: "flex"};
        }
        
        return (
            <div className="Track" style={visibility}>
                <div className="Track-information">
                    <h3>{this.props.track.name}</h3>
                    <p>{this.props.track.artist} | {this.props.track.album}</p>
                </div>
            <div className="Track-action">{this.renderAction()}</div>
            </div>
        );
    }
}

export default Track;