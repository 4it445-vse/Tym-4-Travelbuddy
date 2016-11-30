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

    handleSelectSuggest = (suggestName, coordinate) => {
      this.setState({ search: suggestName });
      this.props.setSearchedTown(suggestName);
    }

    render() {
        return (
            <div className="row">
                                <GooglePlacesSuggest onSelectSuggest={ this.handleSelectSuggest } search={ this.state.search }>
                <div className="input-group v-o-15">

                    <input id="search-town" type="text" className="form-control SearchBar SearchHeight SearchBorder"
                           placeholder="Zadej cílové město" onChange={this.handleSearchChange} value={this.state.search}/>

                    <span className="input-group-btn">
                  <button className="btn btn-defaul SearchButton SearchHeight text-white" type="button"
                          onClick={this.props.setSearchedTown}>
                      <i className="fa fa-search SearchIcon" aria-hidden="true"></i> Hledej
                  </button>
              </span>
                </div>
                                    </GooglePlacesSuggest>
            </div>
        );
    }
}
