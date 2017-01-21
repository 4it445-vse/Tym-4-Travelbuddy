import React, {Component} from "react";
import {RequestsList} from "../components/Requests/RequestsList.js";
import lodash from "lodash";
import axios from "../api";
import ShowRequestModal from "../components/Modals/ShowRequestModal";
import GooglePlacesSuggest from "../components/Autosuggest/SuggestCity";
import { connect } from "react-redux";
import { openAlert, openContactBuddy } from "../actions/modals";

class RequestsPage extends Component {
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
    }

    openContactBuddy = (buddyTo) => {
        if (buddyTo && buddyTo.name) {
            this.setState({
                showRequestShowModal: false
            });
            this.props.openContactBuddy({buddy: buddyTo});
        }
    }

    openShowRequestShowModal = (buddy, request) => {
        this.setState({
            showRequestShowModal: true,
            requestShowModalContent: {
                buddy: buddy,
                request: request
            }
        });
    }

    paramsForSerchString(searchString) {
        if (!searchString) {
            return {};
        }
        return {filter: {fields: {id:true},where: {city: {like: `%${searchString}%`}}}}
    }

    fetchRequests(searchString) {
        axios.get('Requests', {params: this.paramsForSerchString(searchString)})
            .then((response) => {
                this.setState({requests: response.data, search: searchString, searchedCity: searchString});
            });
    }

    componentDidMount() {
        this.fetchRequests();
    }

    handleSearchChange = () => {
        const searchString = document.getElementById('search-town').value;
        this.fetchRequestsDebounced(searchString);
    }

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
              <h1 className="v-o-4">Find yours Requests</h1>
                <ShowRequestModal showProp={this.state.showRequestShowModal} hideFn={this.closeShowRequestShowModal}
                                  requestShowModalContent={this.state.requestShowModalContent}
                                  contactBuddy={this.openContactBuddy}/>

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
                  <i className="fa fa-search SearchIcon" aria-hidden="true"></i> Search
              </button>
            </span>
                    </div>
                </GooglePlacesSuggest>

            </div></div>
                {requests === null ?

                    <div className="container">
                         </div> :
                    <div className="container"><RequestsList requests={requests} openShowRequestShowModal={this.openShowRequestShowModal}
                                  openContactBuddy={this.openContactBuddy} city={this.state.searchedCity}/></div>
                }
          </div>
        );
    }
}

export default connect(
    (state) => ({
        user : state.user
    }),
    {
        openAlert,
        openContactBuddy
    }
)(RequestsPage)
