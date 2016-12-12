import React, {Component} from "react";
import {Modal} from "react-bootstrap";
import FormGroup from "./FormGroup";
import currentUser from "../../actions/CurrentUser";
import axios from "../../api";

export default class ResetPassModal extends Component {

    constructor(props) {
        super(props);

        this.state = {
            showErrorMessage: undefined
        }

        this.handleSubmitResetPass = this.handleSubmitResetPass.bind(this);
        this.closeModal = this.closeModal.bind(this);
    }

    closeModal() {
        this.state.showErrorMessage = undefined;
        this.props.hideFn();
    }

    handleSubmitResetPass(event) {
        var email = document.getElementById("email-l").value;
        if (email) {
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
    }

    render() {
        const {showProp} = this.props;
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
                          <input type="email" name="email" id="email-l" placeholder="Your e-mail"
                                 className={ "form-control" + ( !!this.state.showErrorMessage ? ' alert-danger' : '') }/>
                          {
                            !!this.state.showErrorMessage?
                            <span className="validation-error">{this.state.showErrorMessage}</span> : ""
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
