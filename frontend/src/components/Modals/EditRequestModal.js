import React, {Component} from "react";
import AbstractModal from "./AbstractModal";
import Select from "react-select";
import axios from "../../api";
import moment from 'moment';
import currentUser from "../../actions/CurrentUser";
import GooglePlacesSuggest from "../Autosuggest/SuggestCity"

export default class RequestModal extends Component {

    constructor(props) {
        super(props);
        this.state = {
            errors: {},
            requests: [],
            request: {
                city: null,
                from: null,
                to: null,
                text: null
            },
            showValidation: {
                city: false,
                text: false
            },
            selectedRequest: null,
            displaySuggest: true
        };

        this.handleSubmitEdit = this.handleSubmitEdit.bind(this);
        this.findBuddysRequests = this.findBuddysRequests.bind(this);
        this.handleSelectChange = this.handleSelectChange.bind(this);
        this.onChange = this.onChange.bind(this);
        this.prepareRemoveRequest = this.prepareRemoveRequest.bind(this);
        this.removeRequest = this.removeRequest.bind(this);
        this.hideModal = this.hideModal.bind(this);
    }

    hideModal() {
        this.state = {
            errors: {},
            requests: [],
            request: {
                city: null,
                from: null,
                to: null,
                text: null
            },
            showValidation: {
                city: false,
                text: false
            },
            selectedRequest: null,
            displaySuggest: true
        };
        this.props.hideFn();
    }

    prepareRemoveRequest() {
        currentUser.setQuestion({
            text: "Are you sure, you want to delete this request?",
            cb: this.removeRequest
        });
        this.props.hideFn();
    }

    removeRequest() {
        var id = this.state.selectedRequest
        axios.delete('Requests/' + id).then(response => {
            console.log("ok");
            currentUser.setAlert({"type": "success", "message": "Request has been successfully deleted."});
            this.props.hideFn();
        });
    }

    validate(name, value, fields) {
        var showValidation = this.state.showValidation;
        if (value) {
            fields[name] = value;
            showValidation[name] = true;
            this.setState({
                fields: fields,
                showValidation: showValidation,
                displaySuggest: true

            });
        } else {
            fields[name] = undefined;
            showValidation[name] = true;
            this.setState({
                fields: fields,
                showValidation: showValidation
            });
        }
    }


    onChange(e) {
        console.log(e.target);
        let name = e.target.name;
        let value = e.target.value;
        let errors = this.state.errors;
        let fields = this.state.request;
        switch (name) {
            case "city":
                this.validate(name, value, fields);
                break;
            case "text":
                this.validate(name, value, fields);
                break;
            case "from":
                if (value) {
                    if (moment(value).isValid()) {
                        errors[name] = undefined;
                        fields[name] = value;
                        this.setState({
                            errors: errors,
                            fields: fields
                        });
                    } else {
                        errors[name] = "Unfortunately, date is in wrong format.";
                        fields[name] = value;
                        this.setState({
                            errors: errors,
                            fields: fields
                        });
                    }
                } else {
                    errors[name] = "When you are planning to travel?";
                    fields[name] = value;
                    this.setState({
                        errors: errors,
                        fields: fields
                    });
                }
                break;
            case "to":
                if (value) {
                    if (moment(value).isValid()) {
                        errors[name] = undefined;
                        fields[name] = value;
                        this.setState({
                            errors: errors,
                            fields: fields
                        });
                    } else {
                        errors[name] = "Unfortunately, date is in wrong format.";
                        fields[name] = value;
                        this.setState({
                            errors: errors,
                            fields: fields
                        });
                    }
                } else {
                    errors[name] = "When you are planning to travel?";
                    fields[name] = value;
                    this.setState({
                        errors: errors,
                        fields: fields
                    });
                }
        }
    }

    findBuddysRequests(suggest) {
        axios.get('Requests', {
            params: {filter: {where: {buddy_id: currentUser.getCurrentUser().id}}}
        })
            .then(response => {
                //Remapping response beacuase of Select component
                var requestsFormated = response.data.map(function (object) {
                    var remappedObj = {value: object.id, label: object.city};
                    return remappedObj;
                })
                this.setState({
                    requests: requestsFormated, selectedRequest: requestsFormated[0],
                    request: {
                        city: requestsFormated[0].city,
                        from: requestsFormated[0].from,
                        to: requestsFormated[0].to,
                        text: requestsFormated[0].text
                    },
                    displaySuggest: suggest
                });
                this.handleSelectChange(this.state.selectedRequest);
            })
    }

    handleSubmitEdit() {
        var id = this.state.request.id;
        var city = this.state.request.city;
        var from = this.state.request.from;
        var to = this.state.request.to;
        var text = this.state.request.text;
        var buddy_id = currentUser.getCurrentUser().id;

        var fieldsAreValid = true;
        this.state.showValidation.city = true;
        this.state.showValidation.text = true;
        for (var name of ["city", "from", "to", "text"]) {
            if (!this.state.request[name]) {
                fieldsAreValid = false;
            }
        }

        if (fieldsAreValid) {
            var updatedRequest = {
                "city": city,
                "from": from,
                "to": to,
                "text": text,
                "buddy_id": buddy_id
            }
            axios.patch('Requests/' + id, updatedRequest).then(response => {
                currentUser.setAlert({"type": "success", "message": "Request has been successfully updated."});
                this.hideModal();
            })
                .then(() => {
                    this.findBuddysRequests(true);
                })
                .catch(error => {
                    const {response} = error;
                    this.setState({errors: response.data.error.details.messages});
                });
        } else {
            this.setState(this.state);
        }
    }

    handleSelectChange(requestFormated) {
        console.log("in handleSelectChange");
        axios.get('Requests/' + requestFormated.value)
            .then(response => {
                this.setState({request: response.data, displaySuggest: false});
            });
        this.setState({selectedRequest: requestFormated.value});
    }

    componentDidMount() {
        this.findBuddysRequests(false);
    }

    handleSelectSuggest = (suggestName, coordinate) => {
        var request = this.state.request;
        request.city = suggestName;
        this.setState({request: request});
    }

    render() {
        const {showProp, hideFn, switchFn} = this.props;
        const {errors} = this.state;
        const title = "Edit My Requests";

        const dateFormat = "YYYY-MM-DD";
        var fromFormated = moment(this.state.request.from).format(dateFormat);
        var toFormated = moment(this.state.request.to).format(dateFormat);

        if (this.state.requests.length === 0) {
            return (
                <AbstractModal title={title} showProp={showProp} hideFn={hideFn} submitFn={switchFn}
                               submitText={"I want to go somewhere!"}>
                    <p>Unfortunately, you have not created any requests, so you can not edit them.</p>
                    <p>You can create new request in section: New Request.</p>
                </AbstractModal>
            );
        }
        return (
            <AbstractModal title={title} showProp={showProp} hideFn={this.hideModal}
                           submitFn={this.handleSubmitEdit} submitText={"Save Request"}>
                <form>
                    <div className="form-group row text-xs-center">
                        <label htmlFor="rides" className="col-xs-6 col-form-label text-xs-right">Choose a request, which
                            you want to edit.</label>
                        <div className="col-xs-6">
                            <Select name="form-field-name" value={this.state.selectedRequest}
                                    options={this.state.requests} onChange={this.handleSelectChange}/>
                        </div>
                    </div>
                    <hr/>
                    <div className="form-group row text-xs-center">
                        <label htmlFor="city" className="col-xs-3 col-sm-2 col-form-label text-xs-right">City: </label>
                        <div className="col-xs-9 col-sm-10 text-xs-left">
                            <GooglePlacesSuggest onSelectSuggest={ this.handleSelectSuggest }
                                                 search={ this.state.request.city } display={this.state.displaySuggest}>
                                <input
                                    className={ "form-control" + ( this.state.showValidation.city && !this.state.request.city ? ' alert-danger' : '' ) }
                                    value={this.state.request.city} onBlur={this.onChange} onChange={this.onChange}
                                    type="text"
                                    name="city" placeholder="City, where you are going to travel."
                                    autoComplete="off"/>
                                { this.state.showValidation.city && !this.state.request.city ?
                                    <span className="validation-error">City is a mandatory field, so buddies could find you.</span> : ""}
                            </GooglePlacesSuggest>
                        </div>
                    </div>
                    <div className="form-group row text-xs-center">
                        <label htmlFor="from" className="col-xs-2 col-form-label text-xs-right">From: </label>
                        <div className="col-xs-4">
                            <input className={ "form-control" + ( errors.from ? ' alert-danger' : '' ) }
                                   value={fromFormated} onChange={this.onChange} type="date" name="from"
                                   placeholder="YYYY-MM-DD"/>
                            { errors.from ? <span className="validation-error">{errors.from}</span> : ""}
                        </div>
                        <label htmlFor="to" className="col-xs-2 col-form-label text-xs-right">To: </label>
                        <div className="col-xs-4">
                            <input className={ "form-control" + ( errors.to ? ' alert-danger' : '' ) }
                                   value={toFormated} onChange={this.onChange} type="date" name="to"
                                   placeholder="YYYY-MM-DD"/>
                            { errors.to ? <span className="validation-error">{errors.to}</span> : ""}
                        </div>
                    </div>
                    <div className="form-group row text-xs-center">
                        <label htmlFor="text"
                               className="col-xs-3 col-sm-2 col-form-label text-xs-right">Description: </label>
                        <div className="col-xs-9 col-sm-10 text-xs-left">
                            <textarea
                                className={ "form-control" + ( this.state.showValidation.text && !this.state.request.text ? ' alert-danger' : '' ) }
                                value={this.state.request.text} onBlur={this.onChange} onChange={this.onChange}
                                type="text"
                                name="text" rows="3"
                                placeholder="Explain your buddies the reason, why they should choose you, over other people!"></textarea>
                            { this.state.showValidation.text && !this.state.request.text ? <span
                                className="validation-error">Tell something about you to pontetial buddies!</span> : ""}
                        </div>
                    </div>
                    <hr/>
                    <div className="row">
                        <div className="col-xs-12">
                            <a href="#" onClick={this.prepareRemoveRequest}>
                                <button type="button" className="col-xs-12 btn btn-danger">Delete request</button>
                            </a>
                        </div>
                    </div>
                </form>
            </AbstractModal>
        );
    }
}
