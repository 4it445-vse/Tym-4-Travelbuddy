import React, {Component} from "react";
import {Modal} from "react-bootstrap";
import FormGroup from "./FormGroup";
import FormCheck from "./FormCheck";
import axios from "../../api";
import currentUser from "../../actions/CurrentUser";
import GooglePlacesSuggest from "../Autosuggest/SuggestCity";
import validation from "../../Validation/Validation";

export default class RegisterModal extends Component {

    constructor(props) {
        super(props);

        this.state = {
            buddies: [],
            errors: {},
            fields: {}
        };

        this.handleSubmitRegistration = this.handleSubmitRegistration.bind(this);
        this.onChange = this.onChange.bind(this);
        this.closeModal = this.closeModal.bind(this);
        this.switchModal = this.switchModal.bind(this);
    }

    closeModal() {
        this.state.errors = {};
        this.state.fields = {};
        this.props.hideFn();
    }

    switchModal() {
        this.state.errors = {};
        this.state.fields = {};
        this.props.switchFn();
    }

    handleSearchChange = (e) => {
      var fields = this.state.fields;
      fields.city = e.target.value;
      this.setState({ registrationValidation: fields })
    }

    handleSelectSuggest = (suggestName, coordinate) => {
      var fields = this.state.fields;
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
        const fieldsArray = ["name", "surname", "city", "email", "pass", "pass_repeated", "agreed_with_conditions"];
        for (var name of fieldsArray) {
            let obj = {
                target: {
                    value: this.state.fields[name],
                    name: name
                }
            };
            this.onChange(obj);
        }
        let fieldsAreValid = true;
        for (var name of fieldsArray) {
            if (this.state.errors[name] !== undefined) {
                fieldsAreValid = false;
            }
        }
        if (fieldsAreValid === false) {
            return;
        }

        var name = this.state.fields.name;
        var surname = this.state.fields.surname;
        var email = this.state.fields.email;
        var city = this.state.fields.city;
        var pass = this.state.fields.pass;

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
                let errors = this.state.errors;
                errors.email = "User with this e-mail already exists.";
                this.setState({errors: errors});
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
                    });
                    this.closeModal();
                });
            }
        });
    }

    onChange(e) {
        let name = e.target.name;
        let value = e.target.value;
        console.log("### in onChange in: ", value);
        let errors = this.state.errors;
        let fields = this.state.fields;

        if(name === "agreed_with_conditions") {
            value = e.target.checked;
        }

        if (name === 'pass') {
            errors = validation.validatePass(value, this.state.fields.pass_repeated, errors, name);
        } else if (name === 'pass_repeated') {
            errors = validation.validatePass(this.state.fields.pass, value, errors, name);
        } else {
            errors[name] = validation.validate(name, value);
        }

        fields[name] = value;

        this.setState({
            errors: errors,
            fields: fields
        });
    }

    render() {
        const {showProp} = this.props;
        const {errors} = this.state;
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
                        <input onBlur={this.onChange} type="text" name="name" placeholder="Your Name"
                               className={ "form-control" + ( !!errors.name ? ' alert-danger' : '') }/>
                        {
                            !!errors.name ?
                          <span className="validation-error">{errors.name}</span> : ""
                        }
                      </div>
                    </div>
                    <div className="row m-b-10">
                      <div className="col-xs-3 col-sm-2">
                        <label htmlFor="surname" className="col-form-label">Surname: </label>
                      </div>
                      <div className="col-xs-9 col-sm-10">
                        <input onBlur={this.onChange} type="text" name="surname" placeholder="Your Surname"
                               className={ "form-control" + ( !!errors.surname ? ' alert-danger' : '') }/>
                        {
                            !!errors.surname ?
                          <span className="validation-error">{errors.surname}</span>: ""
                        }
                      </div>
                    </div>
                    <div className="row m-b-10">
                      <div className="col-xs-3 col-sm-2">
                        <label htmlFor="email" className="col-form-label">E-mail: </label>
                      </div>
                      <div className="col-xs-9 col-sm-10">
                        <input onBlur={this.onChange} type="email" name="email" placeholder="Your E-mail"
                               className={ "form-control" + ( !!errors.email ? ' alert-danger' : '') }/>
                        {
                            !!errors.email ?
                          <span className="validation-error">{errors.email}</span> : ""
                        }
                      </div>
                    </div>
                    <div className="row m-b-10">
                      <div className="col-xs-3 col-sm-2">
                        <label htmlFor="city" className="col-form-label">City: </label>
                      </div>
                      <div className="col-xs-9 col-sm-10">
                        <GooglePlacesSuggest className="" onSelectSuggest={ this.handleSelectSuggest } search={ this.state.fields.city } display={true}>
                          <input onBlur={this.onChange} onChange={this.handleSearchChange} type="text" autoComplete="off" name="city" placeholder="Your City"
                                 className={ "form-control no-margin " + ( !!errors.city ? ' alert-danger' : '' ) }
                                 value = { this.state.fields.city } />
                        </GooglePlacesSuggest>
                        {
                            !!errors.city ?
                          <span className="validation-error">{errors.city}</span> : ""
                        }
                      </div>
                    </div>
                    <hr/>
                    <div className="row m-b-10">
                      <div className="col-xs-5 col-sm-3">
                        <label htmlFor="pass" className="col-form-label">Password: </label>
                      </div>
                      <div className="col-xs-7 col-sm-9">
                        <input onBlur={this.onChange} type="password" name="pass" placeholder="Your Password"
                             className={ "form-control" + ( !!errors.pass ? ' alert-danger' : '') }/>
                        {
                            !!errors.pass ?
                          <span className="validation-error">{errors.pass}</span> : ""
                        }
                      </div>
                    </div>
                    <div className="row m-b-10">
                      <div className="col-xs-5 col-sm-3">
                        <label htmlFor="pass_repeated" className="col-form-label">Password again: </label>
                      </div>
                      <div className="col-xs-7 col-sm-9">
                        <input onBlur={this.onChange} type="password" name="pass_repeated" placeholder="Repeat your Password"
                             className={ "form-control" + ( !!errors.pass_repeated ? ' alert-danger' : '') }/>
                        {
                            !!errors.pass_repeated ?
                          <span className="validation-error">{errors.pass_repeated}</span> : ""
                        }
                      </div>
                    </div>
                    <div className="row m-b-10">
                      <div className="col-xs-6 col-sm-3">
                        <label htmlFor="pass_repeated" className="col-form-label">I accept the terms.</label>
                      </div>
                      <div className="col-xs-6 col-sm-9">
                        <input onChange={this.onChange} name="agreed_with_conditions" type="checkbox" className="big_checkbox"/>
                        {
                            !!errors.agreed_with_conditions ?
                            <span className="validation-error">{errors.agreed_with_conditions}</span> : ""
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
                                data-toggle="modal" data-target="#regmodal" onClick={this.switchModal}>Sign In
                        </button>
                    </FormCheck>
                </Modal.Footer>
            </Modal>

        );
    }
}
