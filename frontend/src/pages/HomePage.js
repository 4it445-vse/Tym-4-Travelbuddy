import React, {Component} from 'react';
import {Link} from 'react-router';
import {FindUser} from '../components/Search/FindUser.js';
import {SearchForm} from '../components/Search/SearchForm.js';
import axios from 'axios';

export class HomePage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            searchedTown: '',
            setSearchedTown: this.setSearchedTown.bind(this),
            budies: []
        };

        this.setSearchedTown = this.setSearchedTown.bind(this);
        this.findRelevantBuddies = this.findRelevantBuddies.bind(this);
        this.findAllBuddies = this.findAllBuddies.bind(this);
    }

    componentDidMount() {
        this.findAllBuddies();
    }

    findAllBuddies() {
        axios.get('http://localhost:3001/api/buddies')
            .then(response => {
                this.setState({
                    budies: response.data,
                });
            });
    }

    findRelevantBuddies() {
        console.log(this.state.searchedTown);
        var newBudiesArr = [];
        for (var buddy of this.state.budies) {
            if (buddy.city === this.state.searchedTown) {
                newBudiesArr.push(buddy);
            }
        }
        this.setState({budies: newBudiesArr});
        console.log(this.state.budies);
        /*
         axios.get('http://localhost:3001/api/buddies', {
         params: {city: this.state.searchedTown}
         }).then(response => {
         console.log(response.data);
         this.setState({
         budies: response.data,
         });
         });*/
    }

    setSearchedTown(value) {
        if (value) {
            this.state.searchedTown = value;
            this.findRelevantBuddies();
        } else {
            this.findAllBuddies();
        }

    }

    render() {
        return (
            <div>
                <SearchForm setSearchedTown={this.state.setSearchedTown}/>
                <FindUser budies={this.state.budies} searchedTown={this.state.searchedTown}/>
            </div>
        );
    }
}
