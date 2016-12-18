import React, {Component} from "react";
import currentUser from "../actions/CurrentUser";
import {browserHistory} from "react-router";
import FormGroup from "../components/Modals/FormGroup";
import axios from "../api";
import validation from "../Validation/Validation";

export class ResetPassword extends Component {

    constructor(props) {
        super(props);
        this.state = {
            errors: {},
            fields: {}
        };
        this.handleSubmitPassReset = this.handleSubmitPassReset.bind(this);
        this.onChange = this.onChange.bind(this);
    }

    handleSubmitPassReset(event) {
        const fieldsArray = ["pass", "pass_repeated"];
        for (var name of fieldsArray) {
            let obj = {
                target: {
                    value: this.state.fields[name],
                    checked: this.state.fields[name],
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
        var pass = this.state.fields.pass;
        var at = this.props.location.query.access_token;
        var email = this.props.location.query.email;
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

    onChange(e) {
        let name = e.target.name;
        let value = e.target.value;
        let errors = this.state.errors;
        let fields = this.state.fields;

        if (name === 'pass') {
            errors = validation.validatePass(value, this.state.fields.pass_repeated, errors, name);
        } else if (name === 'pass_repeated') {
            errors = validation.validatePass(this.state.fields.pass, value, errors, name);
        }

        fields[name] = value;

        this.setState({
            errors: errors,
            fields: fields
        });
    }

    render() {
        const {errors} = this.state;
        return (
            <div>
                <div className="row">
                    <div className="card v-o-5">
                        <div className="card-block">
                            <form>
                                <FormGroup>
                                    {
                                        !!errors.pass ?
                                            <span className="validation-error">{errors.pass}</span>
                                            : ""
                                    }
                                    <input
                                        onBlur={this.onChange}
                                        type="password"
                                        className={
                                            "form-control"
                                            + (
                                                !!errors.pass ? ' alert-danger' : ' no-validation-error-1st'
                                            )
                                        }
                                        name="pass"
                                        placeholder="Password"
                                    />
                                </FormGroup>
                                <FormGroup>
                                    {
                                        !!errors.pass_repeated
                                            ? <span className="validation-error">{errors.pass_repeated}</span>
                                            : ""
                                    }
                                    <input
                                        onBlur={this.onChange}
                                        type="password"
                                        className={
                                            "form-control"
                                            + (
                                                !!errors.pass_repeated ? ' alert-danger'
                                                    : ' no-validation-error-rest'
                                            )
                                        }
                                        name="pass_repeated"
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
