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
                        <FormGroup>
                            {
                                this.state.showValidation
                                && this.state.isFieldValid.name === false
                                    ? <span className="validation-error">Enter your name please.</span>
                                    : ""
                            }
                            <input
                                onBlur={this.validate}
                                type="text"
                                className={
                                    "form-control"
                                    + (
                                        this.state.showValidation
                                        && this.state.isFieldValid.name === false
                                            ? ' alert-danger'
                                            : ''
                                    )
                                }
                                id="name"
                                placeholder="Name"
                            />
                        </FormGroup>
                        <FormGroup>
                            {
                                this.state.showValidation
                                && this.state.isFieldValid.surname === false
                                    ? <span className="validation-error">Enter your surname please.</span>
                                    : ""
                            }
                            <input
                                onBlur={this.validate}
                                type="text"
                                className={
                                    "form-control"
                                    + (
                                        this.state.showValidation
                                        && this.state.isFieldValid.surname === false
                                            ? ' alert-danger'
                                            : ''
                                    )
                                }
                                id="surname"
                                placeholder="Surname"
                            />
                        </FormGroup>
                        <FormGroup>
                            {
                                this.state.showValidation
                                && this.state.isFieldValid.email === false
                                    ? <span className="validation-error">Enter e-mail in a correct format: melon@collie.com</span>
                                    : ""
                            }
                            {
                                this.state.showValidation
                                && this.state.isFieldValid.email === 'emailAlreadyExists'
                                    ? <span className="validation-error">User with this e-mail already exists.</span>
                                    : ""
                            }
                            <input
                                onBlur={this.validate}
                                type="email"
                                className={
                                    "form-control"
                                    + (
                                        this.state.showValidation
                                        && this.state.isFieldValid.email === false
                                            ? ' alert-danger'
                                            : ''
                                    )
                                }
                                id="email"
                                placeholder="E-mail"
                            />
                        </FormGroup>
                        <FormGroup>
                            {
                                this.state.showValidation
                                && this.state.isFieldValid.city === false
                                    ? <span className="validation-error">City is a mandatory field.</span>
                                    : ""
                            }
                            <GooglePlacesSuggest onSelectSuggest={ this.handleSelectSuggest } search={ this.state.registrationValidation.city } display={true}>
                            <input
                                onBlur={this.validate}
                                onChange={this.handleSearchChange}
                                type="text"
                                autoComplete="off"
                                className={
                                    "form-control"
                                    + (
                                        this.state.showValidation
                                        && this.state.isFieldValid.city === false
                                            ? ' alert-danger'
                                            : ''
                                    )
                                }
                                id="city"
                                placeholder="City"
                                value = { this.state.registrationValidation.city }
                            />
                            </GooglePlacesSuggest>
                        </FormGroup>
                        <FormGroup>
                            {
                                this.state.showValidation
                                && this.state.isFieldValid.pass === false
                                    ? <span className="validation-error">The password has to be at least 8 characters long and has to contain capital letter, non-capital letter and number.</span>
                                    : ""
                            }
                            <input
                                onBlur={this.validate}
                                type="password"
                                className={
                                    "form-control"
                                    + (
                                        this.state.showValidation
                                        && this.state.isFieldValid.pass === false
                                            ? ' alert-danger'
                                            : ''
                                    )
                                }
                                id="pass"
                                placeholder="Password"
                            />
                        </FormGroup>
                        <FormGroup>
                            {
                                this.state.showValidation
                                && this.state.isFieldValid.pass_repeated === false
                                    ? <span className="validation-error">Entered passwords has to be same.</span>
                                    : ""
                            }
                            <input
                                onBlur={this.validate}
                                type="password"
                                className={
                                    "form-control"
                                    + (
                                        this.state.showValidation
                                        && this.state.isFieldValid.pass_repeated === false
                                            ? ' alert-danger'
                                            : ''
                                    )
                                }
                                id="pass_repeated"
                                placeholder="Repeat Password"
                            />
                        </FormGroup>
                        <FormCheck>
                            {
                                this.state.showValidation
                                && this.state.isFieldValid.agreed_with_conditions === false
                                    ? <p className="validation-error no-margin-bottom">You have to accept the terms.</p>
                                    : ""
                            }
                            <label className="form-check-label float-left">
                                <input onClick={this.validate} id="agreed_with_conditions" type="checkbox"
                                       className="form-check-input"/>
                                I accept the terms.
                            </label>
                            <button onClick={this.handleSubmitRegistration} type="button"
                                    className="btn btn-primary fullsize v-o-25">Sign Up
                            </button>
                        </FormCheck>
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
