import React, { Component } from 'react';



export class SearchForm extends Component {
    render() {
        return (
            <div className="row">
                <div className="input-group v-o-15">
                    <input type="search" className="form-control SearchBar SearchHeight SearchBorder" placeholder="Zadej cílové město"/>
              <span className="input-group-btn" >
                  <button className="btn btn-defaul SearchButton SearchHeight text-white" type="button">
                      <i className="fa fa-search SearchIcon" aria-hidden="true"></i> Hledej
                  </button>
              </span>
                </div>
            </div>
        );
    }
}