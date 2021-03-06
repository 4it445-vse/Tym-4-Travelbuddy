import React, {Component} from "react";
import {Modal} from "react-bootstrap";
import axios from "../../api";
import validation from "../../Validation/Validation";
import {connect} from "react-redux";
import {openAlert} from "../../actions/modals";
import Loading from "../Images/Loading";

class ResetPassModal extends Component {

    constructor(props) {
        super(props);

        this.state = {
            errors: {},
            fields: {},
            displayLoading: false
        }
    }

    handleSubmitResetPass = (event) => {
        const email = this.state.fields.email;
        let obj = {
            target: {
                value: email,
                name: 'email'
            }
        };
        let errors = this.validate(obj);
        if (errors['email'] !== undefined) {
            this.setState({errors});
            return;
        }
        this.setState({displayLoading: true});
        axios.post('messages/request-pass-reset', {
            email: email
        }).then(response => {
            if (response.data.status === "OK") {
                this.props.openAlert({
                    "type": "success",
                    "message": "Instructions how to reset your password has been sent to you email."
                });
            } else {
                this.setState({showErrorMessage: "There is no user with this e-mail."});
            }
        });
    };

    validate = (e) => {
        let name = e.target.name;
        let value = e.target.value;
        let errors = this.state.errors;
        let fields = this.state.fields;

        errors[name] = validation.validate(name, value);

        fields[name] = value;

        return errors;
    };

    onChange = (e) => {
        let name = e.target.name;
        let value = e.target.value;
        let fields = this.state.fields;

        fields[name] = value;
        this.setState({fields});
    }

    render() {
        const {showProp, hideFn} = this.props;
        const {errors} = this.state;
        return (
            <Modal show={showProp} onHide={hideFn}>
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
                        {
                            this.state.displayLoading? <Loading/> : ""
                        }
                        <a onClick={this.handleSubmitResetPass}
                                className="btn btn-primary fullsize white">Reset password
                        </a>
                    </form>
                </Modal.Body>
            </Modal>

        );
    }
}

export default connect(
    null,
    {
        openAlert
    }
)(ResetPassModal);
