import React, {Component} from "react";
import {RequestsList} from "../components/Requests/RequestsList.js";
import lodash from "lodash";
import axios from "../api";
import currentUser from "../actions/CurrentUser";
import {Modal} from "react-bootstrap";
import ShowRequestModal from "../components/Modals/ShowRequestModal";
import {Alert} from 'react-bootstrap';
import GooglePlacesSuggest from "../components/Autosuggest/SuggestCity"

export class RequestsPage extends Component {
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
            }
        };

        this.fetchRequestsDebounced = lodash.debounce(this.fetchRequests, 50);
        this.handleSearchChange = this.handleSearchChange.bind(this);
        this.closeShowRequestShowModal = this.closeShowRequestShowModal.bind(this);
        this.openShowRequestShowModal = this.openShowRequestShowModal.bind(this);
        this.closeAlert = this.closeAlert.bind(this);
        this.openContactBuddy = this.openContactBuddy.bind(this);
    }

    closeAlert() {
        currentUser.setAlert(null);
        this.setState(this.state);
    }

    closeShowRequestShowModal() {
        this.setState({
            showRequestShowModal: false
        });
    }

    openContactBuddy(buddyTo) {
        if (buddyTo && buddyTo.name) {
            this.setState({
                showRequestShowModal: false
            });
            currentUser.openContactBuddy(buddyTo);
        }
    }

    openShowRequestShowModal(buddy, request) {
        this.setState({
            showRequestShowModal: true,
            requestShowModalContent: {
                buddy: buddy,
                request: request
            }
        });
    }

    handleSearchChange(event) {
        const searchString = event.target.value;
        this.fetchRequestsDebounced(searchString);
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
                this.setState({requests: response.data, search: searchString});
            });
    }

    componentDidMount() {
        this.fetchRequests();
    }

    handleSelectSuggest = (suggestName, coordinate) => {
      this.fetchRequestsDebounced(suggestName);
    }

    render() {
        const {requests} = this.state;
        const alert = currentUser.getAlert();
        return (
            <div>
              <h1 className="v-o-4">Requests</h1>
                {
                    (!!alert) ?
                        <Modal show={true} onHide={this.closeAlert}>
                            <Modal.Header closeButton>
                            </Modal.Header>
                            <Modal.Body>
                                <Alert bsStyle={alert.type}>
                                    {alert.message}
                                </Alert>
                            </Modal.Body>
                        </Modal> : ""
                }
                <ShowRequestModal showProp={this.state.showRequestShowModal} hideFn={this.closeShowRequestShowModal}
                                  requestShowModalContent={this.state.requestShowModalContent}
                                  contactBuddy={this.openContactBuddy}/>
                <div className="row">
                <GooglePlacesSuggest onSelectSuggest={ this.handleSelectSuggest } search={ this.state.search } display={true}>
                    <div className="input-group">
                        <input id="search-town" type="search"
                               className="form-control SearchBar SearchHeight SearchBorder"
                               placeholder="Enter destination..." onChange={this.handleSearchChange}
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
                </div>
                {requests === null ?

                    <div className="row">
                         </div> :
                    <RequestsList requests={requests} openShowRequestShowModal={this.openShowRequestShowModal}
                                  openContactBuddy={this.openContactBuddy}/>
                }
            </div>
        );
    }
}
