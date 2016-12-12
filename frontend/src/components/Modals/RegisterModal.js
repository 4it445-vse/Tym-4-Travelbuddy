import React, {Component} from "react";
import {Modal} from "react-bootstrap";
import FormGroup from "./FormGroup";
import FormCheck from "./FormCheck";
import axios from "../../api";
import currentUser from "../../actions/CurrentUser";
import GooglePlacesSuggest from "../Autosuggest/SuggestCity"

export default class RegisterModal extends Component {

    constructor(props) {
        super(props);

        this.state = {
            buddies: [],
            registrationValidation: {
                /*
                 name: 'Josef',
                 surname: 'Draslar',
                 email: 'j.draslar@gmail.com',
                 city: 'Praha',
                 pass: 'Aa123456',
                 pass_repeated: 'Aa123456',
                 agreed_with_conditions: true
                 */
                name: undefined,
                surname: undefined,
                email: undefined,
                city: undefined,
                pass: undefined,
                pass_repeated: undefined,
                agreed_with_conditions: undefined
            },
            isFieldValid: {
                name: undefined,
                surname: undefined,
                email: undefined,
                city: undefined,
                pass: undefined,
                pass_repeated: undefined,
                agreed_with_conditions: undefined
            },
            showValidation: false,
        };

        this.handleSubmitRegistration = this.handleSubmitRegistration.bind(this);
        this.validate = this.validate.bind(this);
        this.closeModal = this.closeModal.bind(this);
    }

    closeModal() {
        for (var prop in this.state.registrationValidation) {
            this.state.registrationValidation[prop] = undefined;
            this.state.isFieldValid[prop] = undefined;
        }
        this.state.showValidation = false;
        this.props.hideFn();
    }

    handleSearchChange = (e) => {
      var fields = this.state.registrationValidation;
      fields.city = e.target.value;
      this.setState({ registrationValidation: fields })
    }

    handleSelectSuggest = (suggestName, coordinate) => {
      var fields = this.state.registrationValidation;
      fields.city = suggestName;
      this.setState({ registrationValidation: fields })
    }

    componentDidMount() {
        axios.get('buddies')
            .then(response => {
                this.setState({
                    buddies: response.data,
                });
            });
    }

    handleSubmitRegistration(event) {
        let validated = true;
        for (var prop in this.state.registrationValidation) {
            if (!this.state.registrationValidation[prop]) {
                validated = false;
		this.state.isFieldValid[prop] = false;
            }
        }
        if (!validated) {
            this.setState({showValidation: true});
            return;
        }
        var name = this.state.registrationValidation.name;
        var surname = this.state.registrationValidation.surname;
        var email = this.state.registrationValidation.email;
        var city = this.state.registrationValidation.city;
        var pass = this.state.registrationValidation.pass;

        axios.get('buddies', {
            params: {
                filter: {
                    where: {
                        email: email,
                    },
                },
            }
        }).then(response => {
            if (response.data && response.data[0] && response.data[0].email === email) {
                var isFieldValid = this.state.isFieldValid;
                isFieldValid["email"] = "emailAlreadyExists";
                this.setState({isFieldValid: isFieldValid});
            } else {
                axios.post('buddies', {
                    "email": email,
                    "password": pass,
                    "sex": "na",
                    "name": name,
                    "surname": surname,
                    "city": city,
                    "is_hosting": false

                }).then(response => {
                    console.log('registration success');
                    currentUser.setAlert({
                        "type": "success",
                        "message": "Registration has been successfull. Please verify your e-mail, before first login, by clicking on the link we have send you on provided e-mail."
                    })
                    this.closeModal();
                });
            }
        });


    }

    validate(event) {
        var value = event.target.value;
        var name = event.target.id;
        var isFieldValid = this.state.isFieldValid;
        var showValidation = this.state.showValidation;
        switch (name) {
            case "name":
            case "surname":
            case "city":
                if (value) {
                    this.state.registrationValidation[name] = value;
                    isFieldValid[name] = true;
                } else {
                    this.state.registrationValidation[name] = undefined;
                    isFieldValid[name] = false;
                    showValidation = true;
                }
                break;
            case "email":
                if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(value)) {
                    this.state.registrationValidation[name] = value;
                    isFieldValid[name] = isFieldValid[name] == 'emailAlreadyExists' ? 'emailAlreadyExists' : true;
                } else {
                    this.state.registrationValidation[name] = undefined;
                    isFieldValid[name] = false;
                    showValidation = true;
                }
                break;
            case "pass":
                var passw = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}$/;
                if (value.match(passw)) {
                    this.state.registrationValidation[name] = value;
                    isFieldValid[name] = true;
                } else {
                    this.state.registrationValidation[name] = undefined;
                    isFieldValid[name] = false;
                    showValidation = true;
                }
                break;
            case "pass_repeated":
                if (this.state.registrationValidation.pass) {
                    if (value === this.state.registrationValidation.pass) {
                        this.state.registrationValidation[name] = value;
                        isFieldValid[name] = true;
                    } else {
                        this.state.registrationValidation[name] = undefined;
                        isFieldValid[name] = false;
                        showValidation = true;
                    }
                }
                break;
            case "agreed_with_conditions":
                value = event.target.checked;
                if (value) {
                    this.state.registrationValidation[name] = true;
                    isFieldValid[name] = true;
                } else {
                    this.state.registrationValidation[name] = false;
                    isFieldValid[name] = false;
                    showValidation = true;
                }
                break;
            default:
        }
        this.setState({isFieldValid: isFieldValid, showValidation: showValidation});
    }

    render() {
        const {showProp, switchFn} = this.props;
        const title = "Sign Up";
        return (
            <Modal show={showProp} onHide={this.closeModal}>
                <Modal.Header closeButton>
                    <Modal.Title>{title}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                  <form>
                    <div className="row m-b-10">
                      <div className="col-xs-3 col-sm-2">
                        <label htmlFor="name" className="col-form-label">Name: </label>
                      </div>
                      <div className="col-xs-9 col-sm-10">
                        <input onBlur={this.validate} type="text" id="name" placeholder="Your Name"
                               className={ "form-control" + ( this.state.showValidation && this.state.isFieldValid.name === false ? ' alert-danger' : '') }/>
                        {
                          this.state.showValidation && this.state.isFieldValid.name === false ?
                          <span className="validation-error">Enter your name please.</span> : ""
                        }
                      </div>
                    </div>
                    <div className="row m-b-10">
                      <div className="col-xs-3 col-sm-2">
                        <label htmlFor="surname" className="col-form-label">Surname: </label>
                      </div>
                      <div className="col-xs-9 col-sm-10">
                        <input onBlur={this.validate} type="text" id="surname" placeholder="Your Surname"
                               className={ "form-control" + ( this.state.showValidation && this.state.isFieldValid.surname === false ? ' alert-danger' : '') }/>
                        {
                          this.state.showValidation && this.state.isFieldValid.surname === false ?
                          <span className="validation-error">Enter your surname please.</span>: ""
                        }
                      </div>
                    </div>
                    <div className="row m-b-10">
                      <div className="col-xs-3 col-sm-2">
                        <label htmlFor="email" className="col-form-label">E-mail: </label>
                      </div>
                      <div className="col-xs-9 col-sm-10">
                        <input onBlur={this.validate} type="email" id="email" placeholder="Your E-mail"
                               className={ "form-control" + ( this.state.showValidation && this.state.isFieldValid.email === false ? ' alert-danger' : '') }/>
                        {
                          this.state.showValidation && this.state.isFieldValid.email === false ?
                          <span className="validation-error">Enter e-mail in a correct format (melon@collie.com).</span> : ""
                        }
                        {
                           this.state.showValidation && this.state.isFieldValid.email === 'emailAlreadyExists' ?
                           <span className="validation-error">User with this e-mail already exists.</span> : ""
                        }
                      </div>
                    </div>
                    <div className="row m-b-10">
                      <div className="col-xs-3 col-sm-2">
                        <label htmlFor="city" className="col-form-label">City: </label>
                      </div>
                      <div className="col-xs-9 col-sm-10">
                        <GooglePlacesSuggest className="" onSelectSuggest={ this.handleSelectSuggest } search={ this.state.registrationValidation.city } display={true}>
                          <input onBlur={this.validate} onChange={this.handleSearchChange} type="text" autoComplete="off" id="city" placeholder="Your City"
                                 className={ "form-control no-margin " + ( this.state.showValidation && this.state.isFieldValid.city === false ? ' alert-danger' : '' ) }
                                 value = { this.state.registrationValidation.city } />
                        </GooglePlacesSuggest>
                        {
                          this.state.showValidation && this.state.isFieldValid.city === false ?
                          <span className="validation-error">City is a mandatory field.</span> : ""
                        }
                      </div>
                    </div>
                    <hr/>
                    <div className="row m-b-10">
                      <div className="col-xs-5 col-sm-3">
                        <label htmlFor="pass" className="col-form-label">Password: </label>
                      </div>
                      <div className="col-xs-7 col-sm-9">
                        <input onBlur={this.validate} type="password" id="pass" placeholder="Your Password"
                             className={ "form-control" + ( this.state.showValidation && this.state.isFieldValid.pass === false ? ' alert-danger' : '') }/>
                        {
                          this.state.showValidation && this.state.isFieldValid.pass === false ?
                          <span className="validation-error">The password has to be at least 8 characters long and has to contain capital letter, non-capital letter and number.</span> : ""
                        }
                      </div>
                    </div>
                    <div className="row m-b-10">
                      <div className="col-xs-5 col-sm-3">
                        <label htmlFor="pass_repeated" className="col-form-label">Password again: </label>
                      </div>
                      <div className="col-xs-7 col-sm-9">
                        <input onBlur={this.validate} type="password" id="pass_repeated" placeholder="Repeat your Password"
                             className={ "form-control" + ( this.state.showValidation && this.state.isFieldValid.pass_repeated === false ? ' alert-danger' : '') }/>
                        {
                          this.state.showValidation && this.state.isFieldValid.pass_repeated === false ?
                          <span className="validation-error">Entered passwords have to be identical.</span> : ""
                        }
                      </div>
                    </div>
                    <div className="row m-b-10">
                      <div className="col-xs-6 col-sm-3">
                        <label htmlFor="pass_repeated" className="col-form-label">I accept the terms.</label>
                      </div>
                      <div className="col-xs-6 col-sm-9">
                        <input onClick={this.validate} id="agreed_with_conditions" type="checkbox" className="big_checkbox"/>
                        {
                            this.state.showValidation && this.state.isFieldValid.agreed_with_conditions === false ?
                            <span className="validation-error"> You have to accept the terms.</span> : ""
                        }
                      </div>
                    </div>
                    <hr/>
                    <button onClick={this.handleSubmitRegistration} type="button" className="btn btn-primary fullsize">Sign Up</button>
                  </form>
                </Modal.Body>
                <Modal.Footer>
                    <FormCheck>
          					  <span className="float-left">
          						  Do you already have an account?
          					  </span>
                        <button type="button" data-dismiss="modal" className="btn btn-primary float-right"
                                data-toggle="modal" data-target="#regmodal" onClick={switchFn}>Sign In
                        </button>
                    </FormCheck>
                </Modal.Footer>
            </Modal>

        );
    }
}
