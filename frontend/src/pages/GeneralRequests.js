import React, {Component} from "react";
import {RequestsList} from "../components/Requests/RequestsList.js";
import lodash from "lodash";
import axios from "../api";
import GooglePlacesSuggest from "../components/Autosuggest/SuggestCity";
import {connect} from "react-redux";
import {openAlert, openContactBuddy, openShowRequestDetails, openEditRequest} from "../actions/modals";

class GeneralRequests extends Component {
    constructor(props) {
        super(props);
        this.state = {
            search: "",
            requests: null,
            showRequestShowModal: false,
            showContactBuddyModal: false,
            requestShowModalContent: {
                buddy: {},
                request: {}
            },
            searchedCity: null,
        };

        this.fetchRequestsDebounced = lodash.debounce(this.fetchRequests, 50);
    }

    closeShowRequestShowModal = () => {
        this.setState({
            showRequestShowModal: false
        });
    };

    generalAction = (buddyTo) => {
        if(this.props.mine){
            this.openEditRequest(buddyTo);
        }else{
            this.openContactBuddy(buddyTo);
        }
    }

    openContactBuddy = (buddyTo) => {
        if (buddyTo && buddyTo.name) {
            this.setState({
                showRequestShowModal: false
            });
            this.props.openContactBuddy({buddy: buddyTo});
        }
    };

    openEditRequest = (buddyTo) => {
        if (buddyTo && buddyTo.id) {
            this.setState({
                showRequestShowModal: false
            });
            this.props.openEditRequest({request: buddyTo});
        }
    };

    openShowRequestShowModal = (buddy, request) => {
        this.props.openShowRequestDetails({
            requestShowModalContent: {
                buddy: buddy,
                request: request
            }
        });
    };

    paramsForSerchString(searchString) {
        if (this.props.mine) {
            if (!searchString) {
                return {
                    filter: {
                        where: {
                            buddy_id: this.props.user.id
                        }
                    }
                };
            }
            return {
                filter:
                    {
                        where:
                            {
                                city: {like: `%${searchString}%`},
                                buddy_id: this.props.user.id
                            },
                    }
            }
        } else {
            if (!searchString) {
                return {
                    filter: {
                        where: {
                            buddy_id: {nin: [this.props.user.id]}
                        }
                    }
                };
            }
            return {filter: {
                where: {
                    city: {like: `%${searchString}%`},
                    buddy_id: {nin: [this.props.user.id]}
                },
            }}
        }
    }

    fetchRequests(searchString) {
        axios.get('Requests', {params: this.paramsForSerchString(searchString)})
            .then((response) => {
            console.log("data: ", response.data);
                this.setState({requests: response.data, search: searchString, searchedCity: searchString});
            });
    }

    componentDidMount() {
        this.fetchRequests();
    }

    componentDidUpdate() {
        console.log(this.props.refreshRequests.time);
        if(this.time !== this.props.refreshRequests.time){
            console.log("here");
            this.time = this.props.refreshRequests.time;
            this.fetchRequests();
        }
    }

    handleSearchChange = () => {
        const searchString = document.getElementById('search-town').value;
        this.fetchRequestsDebounced(searchString);
    };

    handleSelectSuggest = (suggestName, coordinate) => {
        this.fetchRequestsDebounced(suggestName);
    };

    updateSearchString = () => {
        this.setState({search: document.getElementById('search-town').value});
    };

    render() {
        const {requests} = this.state;
        return (
            <div>
                <div className="row pad-t-5 colarose">
                    <div className="container white">
                        { this.props.mine ?
                            <h1 className="v-o-4">My Requests</h1>
                            :
                            <div>
                                <h1 className="v-o-4">Find Requests</h1>
                                <GooglePlacesSuggest onSelectSuggest={ this.handleSelectSuggest } search={ this.state.search } display={true}>
                                    <div className="input-group">
                                        <input id="search-town" type="search"
                                        className="form-control SearchBar SearchHeight SearchBorder"
                                        placeholder="Enter destination..." onChange={this.updateSearchString}
                                        autoComplete="off"
                                        value={this.state.search}/>
                                        <span className="input-group-btn">
                                            <button className="btn btn-defaul SearchButton SearchHeight text-white" type="button"
                                            onClick={this.handleSearchChange}>
                                                <i className="fa fa-search SearchIcon" aria-hidden="true"/> Search
                                            </button>
                                        </span>
                                    </div>
                                </GooglePlacesSuggest>
                            </div>
                        }
                    </div>
                </div>
                {requests === null ?

                    <div className="container">
                    </div> :
                    <div className="container"><RequestsList mine={this.props.mine} requests={requests} openShowRequestShowModal={this.openShowRequestShowModal}
                                                             openContactBuddy={this.generalAction} city={this.state.searchedCity}/></div>
                }
            </div>
        );
    }
}

export default connect(
    (state) => ({
        user: state.user,
        refreshRequests: state.reloadRequests
    }),
    {
        openAlert,
        openContactBuddy,
        openShowRequestDetails,
        openEditRequest
    }
)(GeneralRequests)
