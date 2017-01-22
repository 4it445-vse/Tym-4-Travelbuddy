import React, {Component} from "react";
import AbstractModal from "./AbstractModal";
import axios from "../../api";
import moment from "moment";
import GooglePlacesSuggest from "../Autosuggest/SuggestCity";
import validation from "../../Validation/Validation";
import {connect} from "react-redux";
import {openAlert, openQuestion} from "../../actions/modals";
import {refreshRequests} from "../../actions/reloadRequests";
import currentUser from "../../actions/CurrentUser";
class RequestModal extends Component {

    constructor(props) {
        super(props);
        this.state = {
            errors: {},
            fields: {
                id: this.props.request.id,
                city: this.props.request.city,
                from:this.props.request.from,
                to:this.props.request.to,
                text: this.props.request.text
            },
            selectedRequest: null,
            displayCitySuggest: true
        };
    }

    prepareRemoveRequest = () => {
        this.props.openQuestion({
            text: "Are you sure, you want to delete this request?",
            cb: this.removeRequest
        });
    }

    removeRequest = () => {
        var id = this.state.selectedRequest
        axios.delete('Requests/' + id).then(response => {
            this.props.refreshRequests();
            this.props.openAlert({"type": "success", "message": "Request has been successfully deleted."});
        });
    }

    onChange = (e) => {
        const {name, value} = e.target;

        if(name === 'city' && value){
            this.validate(name, value, true);
        }else{
            this.validate(name, value);
        }
    }

    onBlur = (e) => {
        const {name, value} = e.target;

        this.validate(name, value);
    }

    validate = (name, value, displayCitySug) => {
        let { errors, fields, displayCitySuggest } = this.state;

        if (name === 'from') {
            errors = validation.validateDates(value, this.state.fields.to, errors, name);
        } else if (name === 'to') {
            errors = validation.validateDates(this.state.fields.from, value, errors, name);
        } else {
            errors[name] = validation.validate(name, value);
        }

        fields[name] = value;

        if(displayCitySug){
            displayCitySuggest = true;
        }

        this.setState({
            errors: errors,
            fields: fields,
            displayCitySuggest: displayCitySuggest
        });
    }

    handleSubmitEdit = () => {
        var id = this.state.fields.id;
        var city = this.state.fields.city;
        var from = this.state.fields.from;
        var to = this.state.fields.to;
        var text = this.state.fields.text;
        var buddy_id = this.props.user.id;

        for (let name of ["city", "from", "to", "text"]) {
            let obj = {
                target: {
                    value: this.state.fields[name],
                    name: name
                }
            };
            this.onChange(obj);
        }
        let fieldsAreValid = true;
        for (let name of ["city", "from", "to", "text"]) {
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
            this.props.refreshRequests();
            this.props.openAlert({"type": "success", "message": "Request has been successfully updated."});
        })
            .then(() => {
            })
            .catch(error => {
                const {response} = error;
                this.setState({errors: response.data.error.details.messages});
            });
    }

    handleSelectSuggest = (suggestName, coordinate) => {
        var fields = this.state.fields;
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

        return (
            <AbstractModal title={title} showProp={showProp} hideFn={hideFn}
                           submitFn={this.handleSubmitEdit} submitText={"Save Request"}>
                <form>
                    <div className="form-group row text-xs-center">
                        <label htmlFor="city" className="col-xs-3 col-sm-2 col-form-label text-xs-right">City: </label>
                        <div className="col-xs-9 col-sm-10 text-xs-left">
                            <GooglePlacesSuggest onSelectSuggest={ this.handleSelectSuggest }
                                                 search={ this.state.fields.city } display={this.state.displayCitySuggest}>
                                <input
                                    className={ "form-control" + ( !!errors.city ? ' alert-danger' : '' ) }
                                    value={this.state.fields.city} onBlur={this.onBlur} onChange={this.onChange}
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
                                   placeholder={currentUser.dateFormat}/>
                            { !!errors.from ? <span className="validation-error">{errors.from}</span> : ""}
                        </div>
                        <label htmlFor="to" className="col-xs-2 col-form-label text-xs-right">To: </label>
                        <div className="col-xs-4">
                            <input className={ "form-control" + ( errors.to ? ' alert-danger' : '' ) }
                                   value={toFormated} onChange={this.onChange} type="date" name="to"
                                   placeholder={currentUser.dateFormat}/>
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
    }),
    {
        openAlert,
        openQuestion,
        refreshRequests
    }
)(RequestModal)