import React, {Component} from "react";
import {Modal} from "react-bootstrap";
import currentUser from "../../actions/CurrentUser";
import axios from "../../api";
import validation from "../../Validation/Validation";

export default class ResetPassModal extends Component {

    constructor(props) {
        super(props);

        this.state = {
            errors: {},
            fields: {}
        }

        this.handleSubmitResetPass = this.handleSubmitResetPass.bind(this);
        this.closeModal = this.closeModal.bind(this);
        this.onChange = this.onChange.bind(this);
    }

    closeModal() {
        this.state.errors = {};
        this.state.fields = {};
        this.props.hideFn();
    }

    handleSubmitResetPass(event) {
        var email = this.state.fields.email;
        let obj = {
            target: {
                value: email,
                name: 'email'
            }
        };
        this.onChange(obj);
        if (this.state.errors['email'] !== undefined) {
            return;
        }
        axios.post('messages/request-pass-reset', {
            email: email
        }).then(response => {
            if (response.data.status === "OK") {
                currentUser.setAlert({
                    "type": "success",
                    "message": "Instructions how to reset your password has been sent to you email."
                })
                this.props.hideFn();
            } else {
                this.setState({showErrorMessage: "There is no user with this e-mail."});
            }
        });
    }

    onChange(e) {
        let name = e.target.name;
        let value = e.target.value;
        let errors = this.state.errors;
        let fields = this.state.fields;

        errors[name] = validation.validate(name, value);

        fields[name] = value;

        this.setState({
            errors: errors,
            fields: fields
        });
    }

    render() {
        const {showProp} = this.props;
        const {errors} = this.state;
        return (
            <Modal show={showProp} onHide={this.closeModal}>
                <Modal.Header closeButton>
                    <Modal.Title>I forgot my password</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <form>
                        <div className="row m-b-10">
                            <div className="col-xs-3 col-sm-2">
                                <label htmlFor="email-l" className="col-form-label">E-mail: </label>
                            </div>
                            <div className="col-xs-9 col-sm-10">
                                <input type="email" name="email" placeholder="Your e-mail"
                                       onChange={this.onChange}
                                       className={ "form-control" + ( !!errors.email ? ' alert-danger' : '') }/>
                                {
                                    !!errors.email ?
                                        <span className="validation-error">{errors.email}</span> : ""
                                }
                            </div>
                        </div>
                        <hr/>
                        <button onClick={this.handleSubmitResetPass} type="button"
                                className="btn btn-primary fullsize">Reset password
                        </button>
                    </form>
                </Modal.Body>
            </Modal>

        );
    }
}
