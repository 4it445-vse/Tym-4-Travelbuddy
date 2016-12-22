import React, {Component} from "react";
import AbstractModal from "./AbstractModal";
import Select from "react-select";
import axios from "../../api";
import moment from 'moment';
import currentUser from "../../actions/CurrentUser";
import GooglePlacesSuggest from "../Autosuggest/SuggestCity";
import validation from "../../Validation/Validation";
import { connect } from "react-redux";
class RequestModal extends Component {

    constructor(props) {
        super(props);
        this.state = {
            errors: {},
            requests: [],
            fields: {},
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
            fields: {},
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
            currentUser.setAlert({"type": "success", "message": "Request has been successfully deleted."});
            this.props.hideFn();
        });
    }

    onChange(e) {
        let name = e.target.name;
        let value = e.target.value;
        let errors = this.state.errors;
        let fields = this.state.fields;

        if (name === 'from') {
            errors = validation.validateDates(value, this.state.fields.to, errors, name);
        } else if (name === 'to') {
            errors = validation.validateDates(this.state.fields.from, value, errors, name);
        } else {
            errors[name] = validation.validate(name, value);
        }

        fields[name] = value;

        this.setState({
            errors: errors,
            fields: fields
        });
    }

    findBuddysRequests(suggest) {
        axios.get('Requests', {
            params: {filter: {where: {buddy_id: this.props.user.id}}}
        })
            .then(response => {
                //Remapping response beacuase of Select component
                var requestsFormated = response.data.map(function (object) {
                    var remappedObj = {value: object.id, label: object.city};
                    return remappedObj;
                })
                this.setState({
                    requests: requestsFormated, selectedRequest: requestsFormated[0],
                    fields: {
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
        var id = this.state.fields.id;
        var city = this.state.fields.city;
        var from = this.state.fields.from;
        var to = this.state.fields.to;
        var text = this.state.fields.text;
        var buddy_id = this.props.user.id;

        for (var name of ["city", "from", "to", "text"]) {
            let obj = {
                target: {
                    value: this.state.fields[name],
                    name: name
                }
            };
            this.onChange(obj);
        }
        let fieldsAreValid = true;
        for (var name of ["city", "from", "to", "text"]) {
            if (this.state.errors[name] !== undefined) {
                fieldsAreValid = false;
            }
        }
        if (fieldsAreValid === false) {
            return;
        }

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
    }

    handleSelectChange(requestFormated) {
        axios.get('Requests/' + requestFormated.value)
            .then(response => {
                this.setState({fields: response.data, displaySuggest: false});
            });
        this.setState({selectedRequest: requestFormated.value});
    }

    componentDidMount() {
        this.findBuddysRequests(false);
    }

    handleSelectSuggest = (suggestName, coordinate) => {
        var fields = this.state.request;
        fields.city = suggestName;
        this.setState({fields: fields});
    }

    render() {
        const {showProp, hideFn, switchFn} = this.props;
        const {errors} = this.state;
        const title = "Edit My Requests";

        const dateFormat = "YYYY-MM-DD";

        var fromFormated = moment(this.state.fields.from).format(dateFormat);
        var toFormated = moment(this.state.fields.to).format(dateFormat);

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
                                                 search={ this.state.fields.city } display={this.state.displaySuggest}>
                                <input
                                    className={ "form-control" + ( !!errors.city ? ' alert-danger' : '' ) }
                                    value={this.state.fields.city} onBlur={this.onChange} onChange={this.onChange}
                                    type="text"
                                    name="city" placeholder="City, where you are going to travel."
                                    autoComplete="off"/>
                                { !!errors.city ?
                                    <span className="validation-error">{errors.city}</span> : ""}
                            </GooglePlacesSuggest>
                        </div>
                    </div>
                    <div className="form-group row text-xs-center">
                        <label htmlFor="from" className="col-xs-2 col-form-label text-xs-right">From: </label>
                        <div className="col-xs-4">
                            <input className={ "form-control" + ( errors.from ? ' alert-danger' : '' ) }
                                   value={fromFormated} onChange={this.onChange} type="date" name="from"
                                   placeholder="YYYY-MM-DD"/>
                            { !!errors.from ? <span className="validation-error">{errors.from}</span> : ""}
                        </div>
                        <label htmlFor="to" className="col-xs-2 col-form-label text-xs-right">To: </label>
                        <div className="col-xs-4">
                            <input className={ "form-control" + ( errors.to ? ' alert-danger' : '' ) }
                                   value={toFormated} onChange={this.onChange} type="date" name="to"
                                   placeholder="YYYY-MM-DD"/>
                            { !!errors.to ? <span className="validation-error">{errors.to}</span> : ""}
                        </div>
                    </div>
                    <div className="form-group row text-xs-center">
                        <label htmlFor="text"
                               className="col-xs-3 col-sm-2 col-form-label text-xs-right">Description: </label>
                        <div className="col-xs-9 col-sm-10 text-xs-left">
                            <textarea
                                className={ "form-control" + ( !!errors.text ? ' alert-danger' : '' ) }
                                value={this.state.fields.text} onBlur={this.onChange} onChange={this.onChange}
                                type="text"
                                name="text" rows="3"
                                placeholder="Explain your buddies the reason, why they should choose you, over other people!"/>
                            { !!errors.text ? <span
                                className="validation-error">{errors.text}</span> : ""}
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
export default connect(
    (state) => ({
        user: state.user
    })
)(RequestModal)