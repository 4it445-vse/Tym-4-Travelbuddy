import React, {Component} from "react";
import GooglePlacesSuggest from "../Autosuggest/SuggestCity"


export default class SearchForm extends Component {

    constructor(props) {
        super(props);

        this.state = {
            search: undefined
        }

        this.handleSearchChange = this.handleSearchChange.bind(this);
        this.handleSelectSuggest = this.handleSelectSuggest.bind(this);
    }

    handleSearchChange = (e) => {
      this.setState({ search: e.target.value })
      if(!e.target.value) this.props.setSearchedTown(null);
      else this.props.setSearchedTown(e.target.value);
    }

    handleSearchButtonClick = () => {
      let value = document.getElementById('search-town').value;
      this.setState({ search: value });
      if(!value) this.props.setSearchedTown(null);
      else this.props.setSearchedTown(value);
    }

    updateSearchString = (e) => {
      this.setState({ search: e.target.value })
    }

    handleSelectSuggest = (suggestName, coordinate) => {
      this.setState({ search: suggestName });
      this.props.setSearchedTown(suggestName);
    }

    render() {
        return (
            <div className="row">
                              <GooglePlacesSuggest onSelectSuggest={ this.handleSelectSuggest } search={ this.state.search } display={true}>
              <div className="input-group">


                    <input id="search-town" type="text" className="form-control SearchBar SearchHeight SearchBorder"
                           placeholder="Enter destination..." onChange={this.updateSearchString} value={this.state.search}/>

                    <span className="input-group-btn">
                  <button className="btn btn-defaul SearchButton SearchHeight text-white" type="button"
                          onClick={this.handleSearchButtonClick}>
                      <i className="fa fa-search SearchIcon" aria-hidden="true"></i> Search
                  </button>
              </span>

                </div>
                                </GooglePlacesSuggest>
            </div>
        );
    }
}
