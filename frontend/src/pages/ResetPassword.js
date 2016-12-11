import React, {Component} from "react";
import currentUser from "../actions/CurrentUser";
import {browserHistory} from "react-router";
import FormGroup from "../components/Modals/FormGroup";
import axios from "../api";

export class ResetPassword extends Component {

    constructor(props) {
        super(props);
        this.state = {
            registrationValidation: {
                pass: undefined,
                pass_repeated: undefined
            },
            isFieldValid: {
                pass: undefined,
                pass_repeated: undefined
            },
            showValidation: false
        };
        this.handleSubmitPassReset = this.handleSubmitPassReset.bind(this);
        this.validate = this.validate.bind(this);
    }

    handleSubmitPassReset(event) {
        let validated = true;
        console.log("state validace: ", this.state.registrationValidation);
        for (var prop in this.state.registrationValidation) {
            if (!this.state.isFieldValid[prop]) {
                validated = false;
                break;
            }
        }
        if (!validated) {
            this.setState({showValidation: true});
            return;
        }
        var pass = this.state.registrationValidation.pass;
        var at = this.props.location.query.access_token;
        var email = this.props.location.query.email;
        console.log(pass);
        axios.post('messages/reset-password', {
            body: {
                accessToken: at,
                email: email,
                password: pass
            }
        }).then(response => {
            if (response.data.status === "OK") {
                currentUser.setAlert({"type": "success", "message": "Password has been successfully changed, you can login now."});
                browserHistory.push("/");
            } else {
                console.error(response);
            }
        });
    }

    validate(event) {
        console.log(event);
        var value = event.target.value;
        var name = event.target.id;
        var isFieldValid = this.state.isFieldValid;
        var localState = this.state;
        console.log(isFieldValid);
        switch (name) {
            case "pass":
                var passw = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z]{8,}$/;
                if (value.match(passw)) {
                    localState.registrationValidation.pass = value;
                    localState.isFieldValid.pass = true;
                    localState.showValidation = false;
                } else {
                    localState.isFieldValid.pass = false;
                    localState.showValidation = true;
                }
                break;
            case "pass_repeated":
                if (this.state.registrationValidation.pass && value === this.state.registrationValidation.pass) {
                    localState.registrationValidation.pass_repeated = value;
                    localState.isFieldValid.pass_repeated = true;
                    localState.showValidation = false;
                } else {
                    localState.isFieldValid.pass_repeated = false;
                    localState.showValidation = true;
                }
                break;
            default:
        }
        this.setState(localState);
    }

    render() {
        return (
            <div>
                <div className="row">
                    <div className="card v-o-5">
                        <div className="card-block">
                            <form>
                                <FormGroup>
                                    {
                                        this.state.showValidation
                                        && this.state.isFieldValid.pass === false
                                            ? <span
                                            className="validation-error">The password has to be at least 8 characters long and has to contain capital letter, non-capital letter and number.</span>
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
                                                    : ' no-validation-error-1st'
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
                                            ? <span className="validation-error">Inserted passwords don't match.</span>
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
                                                    : ' no-validation-error-rest'
                                            )
                                        }
                                        id="pass_repeated"
                                        placeholder="Repeat your password"
                                    />
                                </FormGroup>
                                <FormGroup>
                                    <button onClick={this.handleSubmitPassReset} type="button"
                                            className="btn btn-primary fullsize v-o-5">Reset password
                                    </button>
                                </FormGroup>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}
