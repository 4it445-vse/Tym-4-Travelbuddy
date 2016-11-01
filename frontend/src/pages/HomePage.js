import React, { Component } from 'react';
import { Link } from 'react-router';
import { FindUser } from '/home/team04/code/project/frontend/src/components/Search/FindUser.js';
import { SearchForm } from '/home/team04/code/project/frontend/src/components/Search/SearchForm.js';

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
