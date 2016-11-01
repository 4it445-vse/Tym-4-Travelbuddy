import React, { Component } from 'react';
import { Link } from 'react-router';
import { FindUser } from '../components/Search/FindUser.js';
import { SearchForm } from '../components/Search/SearchForm.js';

export class HomePage extends Component {
  render() {
    return (
        <div>
        <SearchForm/>
        <FindUser/>
        </div>
    );
  }
}
