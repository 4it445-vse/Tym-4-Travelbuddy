import React, {Component} from "react";
import FindUser from "../components/Search/FindUser";
import SearchForm from "../components/Search/SearchForm";
import axios from "../api";

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
        axios.get('buddies', {
params:{
filter:{
where:{
is_hosting: true
}
}
}
}).then(response => {
            this.setState({
                budies: response.data,
            });
        });
    }

    findRelevantBuddies() {
        axios.get('buddies', {
            params: {
                filter: {
                    where: {
                        city: {like: `%${this.state.searchedTown}%`},
is_hosting: true
                    },
                },
            }
        }).then(response => {
            this.setState({
                budies: response.data,
            });
        });
    }

    setSearchedTown(value) {
        if (value) {
            this.setState({searchedTown: value}, () => {this.findRelevantBuddies()});
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
