import React, {Component} from "react";


export default class SearchForm extends Component {

    constructor(props) {
        super(props);

        this.fillSearchTown = this.fillSearchTown.bind(this);
    }

    fillSearchTown() {
        var {setSearchedTown} = this.props;

        setSearchedTown(document.getElementById("search-town").value);
    }

    render() {
        return (
            <div className="row">
                <div className="input-group v-o-15">
                    <input id="search-town" type="search" className="form-control SearchBar SearchHeight SearchBorder"
                           placeholder="Zadej cílové město"/>
                    <span className="input-group-btn">
                  <button className="btn btn-defaul SearchButton SearchHeight text-white" type="button"
                          onClick={this.fillSearchTown}>
                      <i className="fa fa-search SearchIcon" aria-hidden="true"></i> Hledej
                  </button>
              </span>
                </div>
            </div>
        );
    }
}