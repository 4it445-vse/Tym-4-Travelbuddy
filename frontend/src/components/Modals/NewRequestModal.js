import React, {Component} from "react";
import currentUser from "../../actions/CurrentUser";
import AbstractModal from "./AbstractModal";
import moment from "moment";
import axios from "../../api";
import GooglePlacesSuggest from "../Autosuggest/SuggestCity";
import validation from "../../Validation/Validation";

export default class NewRequestModal extends Component {

    constructor(props) {
        super(props);
        this.state = {
            errors: {},
            fields: {
                city: undefined,
                text: undefined,
                from: moment(new Date()).add(5, 'day').format('YYYY-MM-DD'),
                to: moment(new Date()).add(5, 'day').format('YYYY-MM-DD')
            }
        };

        this.handleSubmitRequest = this.handleSubmitRequest.bind(this);
        this.onChange = this.onChange.bind(this);
        this.hideModal = this.hideModal.bind(this);
    }

    hideModal() {
        this.state = {
            errors: {},
            fields: {
                city: undefined,
                text: undefined,
                from: moment(new Date()).add(5, 'day').format('YYYY-MM-DD'),
                to: moment(new Date()).add(5, 'day').format('YYYY-MM-DD')
            }
        };
        this.props.hideFn();
    }

    onChange(e) {
        let name = e.target.name;
        let value = e.target.value;

        let errors = this.state.errors;
        let fields = this.state.fields;
        console.log("in onChange: ", this.state.fields);
        if (name === 'from') {
            errors = validation.validateDates(value, this.state.fields.to, errors, name);
        } else if (name === 'to') {
            errors = validation.validateDates(this.state.fields.from, value, errors, name);
        } else {
            errors[name] = validation.validate(name, value);
        }
        console.log("in onChange save: ", name, value);
        fields[name] = value;

        this.setState({
            errors: errors,
            fields: fields
        });
    }

    handleSubmitRequest() {
        var city = this.state.fields.city;
        var from = this.state.fields.from;
        var to = this.state.fields.to;
        var text = this.state.fields.text;
        var buddy_id = currentUser.getCurrentUser().id;

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
            if(this.state.errors[name] !== undefined){
                fieldsAreValid = false;
            }
        }
        if(fieldsAreValid === false){
            return;
        }

        console.log("### Will try to store request");
        var request = {
            "city": city,
            "from": from,
            "to": to,
            "text": text,
            "buddy_id": buddy_id
        }
        axios.put('Requests', request).then(response => {
            currentUser.setAlert({"type": "success", "message": "Poptávka úspěšně uložena."});
            this.hideModal();
        });
    }

    handleSearchChange = (e) => {
        var fields = this.state.fields;
        fields.city = e.target.value;
        this.setState({fields: fields});
    }

    handleSelectSuggest = (suggestName, coordinate) => {
        var fields = this.state.fields;
        fields.city = suggestName;
        this.setState({fields: fields});
    }

    render() {
        const {showProp, hideFn} = this.props;
        const {errors} = this.state;
        console.log(errors);
        const title = "Chci jet na novou cestu!";

        return (
            <AbstractModal title={title} showProp={showProp} hideFn={this.hideModal}
                           submitFn={this.handleSubmitRequest} submitText={"Save Request"}>
                <form>
                    <div className="form-group row text-xs-center">
                        <span>Pokud jedeš na novou cestu a nenašel si nikoho, kdo by hostoval ve tvém městě, napiš pro potencionální hostitele poptávku a vysvětli jim, proč by si měli vybrat právě tebe. Někdo se určitě najde a přijme tě za svého Buddyho!</span>
                    </div>
                    <hr/>
                    <div className="form-group row text-xs-center">
                        <label htmlFor="city" className="col-xs-3 col-sm-2 col-form-label text-xs-right">City: </label>
                        <div className="col-xs-9 col-sm-10 text-xs-left">
                            <GooglePlacesSuggest onSelectSuggest={ this.handleSelectSuggest }
                                                 search={ this.state.fields.city } display={true}>
                                <input
                                    className={ "form-control" + ( !!errors.city ? ' alert-danger' : '' ) }
                                    onBlur={this.onChange} type="text" name="city"
                                    placeholder="City, where you are going to travel."
                                    value={this.state.fields.city}
                                    onChange={this.handleSearchChange}
                                    autoComplete="off"/>
                            </GooglePlacesSuggest>
                            { !!errors.city ?
                                <span className="validation-error">{errors.city}</span> : ""}
                        </div>
                    </div>
                    <div className="form-group row text-xs-center">
                        <label htmlFor="from" className="col-xs-2 col-form-label text-xs-right">From: </label>
                        <div className="col-xs-4 text-xs-left">
                            <input className={ "form-control" + ( errors.from ? ' alert-danger' : '' ) }
                                   onChange={this.onChange}
                                   defaultValue={moment(new Date()).add(1, 'day').format('YYYY-MM-DD')} type="date"
                                   name="from" placeholder="YYYY-MM-DD"/>
                            { errors.from ? <span className="validation-error">{errors.from}</span> : ""}
                        </div>
                        <label htmlFor="to" className="col-xs-2 col-form-label text-xs-right">To: </label>
                        <div className="col-xs-4 text-xs-left">
                            <input className={ "form-control" + ( errors.to ? ' alert-danger' : '' ) }
                                   onChange={this.onChange}
                                   defaultValue={moment(new Date()).add(5, 'day').format('YYYY-MM-DD')} type="date"
                                   name="to" placeholder="YYYY-MM-DD"/>
                            { errors.to ? <span className="validation-error">{errors.to}</span> : ""}
                        </div>
                    </div>
                    <div className="form-group row text-xs-center">
                        <label htmlFor="text" className="col-xs-3 col-sm-2 col-form-label text-xs-right">Description: </label>
                        <div className="col-xs-9 col-sm-10 text-xs-left">
                            <textarea
                                className={ "form-control" + ( !!errors.text ? ' alert-danger' : '' ) }
                                onBlur={this.onChange} onChange={this.onChange} type="text" name="text" rows="3"
                                placeholder="Explain your buddies the reason, why they should choose you, over other people!"></textarea>
                            { !!errors.text ?
                                <span className="validation-error">{errors.text}</span> : ""}
                        </div>
                    </div>
                </form>
            </AbstractModal>
        );
    }
}
