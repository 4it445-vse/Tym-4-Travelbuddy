import React, {Component} from "react";
import currentUser from "../../actions/CurrentUser";
import AbstractModal from "./AbstractModal";
import moment from "moment";
import axios from "../../api";
import GooglePlacesSuggest from "../Autosuggest/SuggestCity";

export default class NewRequestModal extends Component {

    constructor(props) {
        super(props);
        this.state = {
            errors: {},
            fields: {
                from: moment(new Date()).add(5, 'day').format('YYYY-MM-DD'),
                to: moment(new Date()).add(5, 'day').format('YYYY-MM-DD')
            },
            showValidation: {
                city: false,
                text: false
            }
        };

        this.handleSubmitRequest = this.handleSubmitRequest.bind(this);
        this.onChange = this.onChange.bind(this);
        this.validate = this.validate.bind(this);
        this.hideModal = this.hideModal.bind(this);
    }

    hideModal() {
        this.state = {
            errors: {},
            fields: {
                from: moment(new Date()).add(5, 'day').format('YYYY-MM-DD'),
                to: moment(new Date()).add(5, 'day').format('YYYY-MM-DD')
            },
            showValidation: {
                city: false,
                text: false
            }
        };
        this.props.hideFn();
    }

    validate(name, value, fields) {
        var showValidation = this.state.showValidation;
        if (value) {
            fields[name] = value;
            showValidation[name] = true;
            this.setState({
                fields: fields,
                showValidation: showValidation
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
        let fields = this.state.fields;
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
                        errors[name] = "Datum je bohužel ve špatném formátu.";
                        this.setState({
                            errors: errors
                        });
                    }
                } else {
                    errors[name] = "Potřebujeme vědět, od kdy plánujete cestu.";
                    this.setState({
                        errors: errors
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
                        errors[name] = "Datum je bohužel ve špatném formátu.";
                        this.setState({
                            errors: errors
                        });
                    }
                } else {
                    errors[name] = "Potřebujeme vědět, do kdy plánujete cestu.";
                    this.setState({
                        errors: errors
                    });
                }
        }
    }


    handleSubmitRequest() {
        var city = this.state.fields.city;
        var from = this.state.fields.from;
        var to = this.state.fields.to;
        var text = this.state.fields.text;
        var buddy_id = currentUser.getCurrentUser().id;

        var fieldsAreValid = true;
        this.state.showValidation.city = true;
        this.state.showValidation.text = true;
        for( var name of ["city", "from", "to", "text"]){
            if(!this.state.fields[name]){
                fieldsAreValid = false;
            }
        }

        if (fieldsAreValid) {
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
                this.setState({errors: {}});
            }).catch(error => {
                console.log("Chyba: ", error);
                console.log("Chyba: ", error.data);
                console.log("Chyba: ", error.data.error, error.data.error.details);
                this.setState({errors: error.data.error.details.messages});
            });
        }else{
            this.setState(this.state);
        }
    }

    handleSearchChange = (e) => {
      var fields = this.state.fields;
      fields.city = e.target.value;
      this.setState({ fields: fields });
    }

    handleSelectSuggest = (suggestName, coordinate) => {
      var fields = this.state.fields;
      fields.city = suggestName;
      this.setState({ fields: fields });
    }

    render() {
        const {showProp, hideFn} = this.props;
        const {errors} = this.state;
        console.log(errors);
        const title = "Chci jet na novou cestu!";

        return (
            <AbstractModal title={title} showProp={showProp} hideFn={this.hideModal}
                           submitFn={this.handleSubmitRequest} submitText={"Uložit jízdu"}>
                <form>
                    <div className="form-group row text-xs-center">
                        <span>Pokud jedeš na novou cestu a nenašel si nikoho, kdo by hostoval ve tvém městě, napiš pro potencionální hostitele poptávku a vysvětli jim, proč by si měli vybrat právě tebe. Někdo se určitě najde a přijme tě za svého Buddyho!</span>
                    </div>
                    <hr/>
                    <div className="form-group row text-xs-center">
                        <label htmlFor="city" className="col-xs-3 col-sm-2 col-form-label text-xs-right">Město: </label>
                        <div className="col-xs-9 col-sm-10 text-xs-left">
                        <GooglePlacesSuggest onSelectSuggest={ this.handleSelectSuggest } search={ this.state.fields.city } display={true}>
                            <input className={ "form-control" + ( this.state.showValidation.city && !this.state.fields.city ? ' alert-danger' : '' ) }
                                   onBlur={this.onChange} type="text" name="city"
                                   placeholder="Město, do kterého budete cestovat"
                                   value={this.state.fields.city}
                                   onChange={this.handleSearchChange}
                                   autoComplete="off"/>
                       </GooglePlacesSuggest>
                            { this.state.showValidation.city && !this.state.fields.city ? <span className="validation-error">Město je povinné pole, to abychom Vás mohli najít.</span> : ""}
                        </div>
                    </div>
                    <div className="form-group row text-xs-center">
                        <label htmlFor="from" className="col-xs-2 col-form-label text-xs-right">Datum od:</label>
                        <div className="col-xs-4 text-xs-left">
                            <input className={ "form-control" + ( errors.from ? ' alert-danger' : '' ) }
                                   onChange={this.onChange}
                                   defaultValue={moment(new Date()).add(1, 'day').format('YYYY-MM-DD')} type="date"
                                   name="from" placeholder="YYYY-MM-DD"/>
                            { errors.from ? <span className="validation-error">{errors.from}</span> : ""}
                        </div>
                        <label htmlFor="to" className="col-xs-2 col-form-label text-xs-right">Datum do:</label>
                        <div className="col-xs-4 text-xs-left">
                            <input className={ "form-control" + ( errors.to ? ' alert-danger' : '' ) }
                                   onChange={this.onChange}
                                   defaultValue={moment(new Date()).add(5, 'day').format('YYYY-MM-DD')} type="date"
                                   name="to" placeholder="YYYY-MM-DD"/>
                            { errors.to ? <span className="validation-error">{errors.to}</span> : ""}
                        </div>
                    </div>
                    <div className="form-group row text-xs-center">
                        <label htmlFor="text" className="col-xs-3 col-sm-2 col-form-label text-xs-right">Popis: </label>
                        <div className="col-xs-9 col-sm-10 text-xs-left">
                            <textarea className={ "form-control" + ( this.state.showValidation.text && !this.state.fields.text ? ' alert-danger' : '' ) }
                                      onBlur={this.onChange} type="text" name="text" rows="3"
                                      placeholder="Vysvětlete potenciálním hostitelům, proč jste právě vy ten pravý/á!"></textarea>
                            { this.state.showValidation.text && !this.state.fields.text ? <span className="validation-error">Řekněte něco o sobě potencionálním buddíkům!</span> : ""}
                        </div>
                    </div>
                </form>
            </AbstractModal>
        );
    }
}
