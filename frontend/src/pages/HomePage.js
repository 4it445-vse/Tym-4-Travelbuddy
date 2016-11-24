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
	axios.post('messages', {
	'text':'Hi, this is sample message.',
	'displayed':false,
	'date_time': new Date(),
	'buddy_id_from': 1,
	'buddy_id_to': 2
	}).then(response => {console.log('### Message successfully sent.');});
	axios.post('messages', {
	'text':'Ahoj, tato správa je zkušební.',
	'displayed':true,
	'date_time': new Date(),
	'buddy_id_from': 3,
	'buddy_id_to': 881
	}).then(response => {console.log('### 2nd message successfully sent, but should not!!!');}, error => {console.error('Attemp to insert message with faulty FK!');});
	axios.get('messages', {
	params:{
	filter:{
	where:{
	buddy_id_to:1
	}
	}
	}
	}).then(response => {console.log("incoming messages:");console.log(response);});
	axios.get('messages', {
	params:{
	filter:{
	where:{
	buddy_id_from:1
	}
	}
	}
	}).then(response => {console.log('sent messages:');console.log(response);});
	axios.post('requests', {
	'text':'Nechtěl by mě někdo provést Prahou, jsem uživatel 1?',
	'city':'Praha',
	'from': new Date(),
	'to': new Date(),
	'buddy_id':1
	}).then(response => {console.log('request sent');});
	axios.post('requests', {
	'text':'Jedu do Liberce někdo něco?',
	'city':'Liberec',
	'from': new Date(),
	'to': new Date(),
	'buddy_id':175
	}).then(response => {console.log('request sent, but should not!!!!');}, error => {console.error('Attemp to insert request with faulty FK!');});
	axios.get('requests', {
	params:{
	filter:{
	where:{
	'city':'Praha'
	}
	}
	}
	}).then(response => {console.log(response);});
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
