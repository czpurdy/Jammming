import React from "react";
import "./SearchBar.css";

class SearchBar extends React.Component {
    constructor(props) {
        super(props);
        this.search = this.search.bind(this);
        this.handleTermChange = this.handleTermChange.bind(this);

        let cachedTerm = window.sessionStorage.getItem("search_term");
        let search_term = cachedTerm ? cachedTerm : "";

        // not necessary but more explicit
        this.state = { term: search_term };

        if (search_term) {
            this.search();
        }
    }
    
    search() {
        window.sessionStorage.setItem("search_term", this.state.term);
        this.props.onSearch(this.state.term);
    }

    handleTermChange(event) {
        this.setState({term: event.target.value}); 
        if (event.key === "Enter") {
            this.search();
        }
    }
    
    render() {
        return (
            <div className="SearchBar">
                <input onChange={this.handleTermChange} onKeyPress={this.handleTermChange} placeholder="Enter A Song, Album, or Artist" value={this.state.term}/>
                <a onClick={this.search}>SEARCH</a>
            </div>
        );
    }
}

export default SearchBar;