import React, { Component } from 'react'
import GooglePlacesSuggest from '../components/Autosuggest/SuggestCity'

export default class GooglePlaces extends Component {
  state = {
    search: '',
    selectedCoordinate: null,
  }

  handleSearchChange = (e) => {
    this.setState({ search: e.target.value })
  }

  handleSelectSuggest = (suggestName, coordinate) => {
    this.setState({ search: suggestName, selectedCoordinate: coordinate })
  }

  render() {
    const { search } = this.state

    return (
      <GooglePlacesSuggest onSelectSuggest={ this.handleSelectSuggest } search={ search }>
        <input
          type="text"
          value={ search }
          placeholder="Search a location"
          onChange={ this.handleSearchChange }
        />
      </GooglePlacesSuggest>
    )
  }
}
