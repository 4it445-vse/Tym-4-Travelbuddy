import React, {Component} from "react";
import {Modal} from "react-bootstrap";
import FormGroup from "./FormGroup";
import FormCheck from "./FormCheck";
import currentUser from "../../actions/CurrentUser";
import axios from "../../api";

export default class LoginModal extends Component {

    constructor(props) {
        super(props);

        this.state = {
            showErrorMessage: undefined
        }

        this.handleSubmitLogIn = this.handleSubmitLogIn.bind(this);
        this.closeModal = this.closeModal.bind(this);
    }

    closeModal() {
        this.state.showErrorMessage = undefined;
        this.props.hideFn();
    }

    handleSubmitLogIn(event) {
        var email = document.getElementById("email-l").value;
        var pass = document.getElementById("pass-l").value;
        var rememberUser = document.getElementById("remember_me").checked;
        axios.post('buddies/login', {
            email: email,
            password: pass
        }).then(response => {
            currentUser.setAuthToken(response.data.id);
            axios.get('buddies', {
                params: {
                    filter: {
                        where: {
                            email: email,
                        },
                    },
                }
            }).then(response => {
                if (response.data[0].emailVerified) {
                    console.log("login success");
                    currentUser.setCurrentUser(response.data[0], rememberUser);
                    this.closeModal();
                } else {
                    this.setState({showErrorMessage: "Please verify your e-mail, before first login, by clicking on the link we have send you on provided e-mail."});
                }
            })
        }).catch(error => {
            this.setState({showErrorMessage: "Wrong e-mail or psawword!"});
        });;
    }

    render() {
        const {showProp, switchFn, restorePassFn} = this.props;
        return (
            <Modal show={showProp} onHide={this.closeModal}>
                <Modal.Header closeButton>
                    <Modal.Title>Sign In</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <form>
                        <FormGroup>
                            {
                                !!this.state.showErrorMessage
                                    ? <span className="validation-error-big">{this.state.showErrorMessage}</span>
                                    : ""
                            }
                            <input type="email" name="email" className="form-control" id="email-l"
                                   placeholder="Your E-mail"/>
                        </FormGroup>
                        <FormGroup>
                            <input type="password" name="password" className="form-control" id="pass-l"
                                   placeholder="Your Password"/>
                        </FormGroup>
                        <div className="modal-group">

                            <div className="form-check">
                                <label className="form-check-label float-left">
                                    <input id="remember_me" type="checkbox" className="form-check-input"
                                           name="remember-me"/>
                                    Remember Me
                                </label>
                                <a href="#" className="float-right" data-target="#" onClick={restorePassFn}>I forgot my password?</a>
                            </div>

                        </div>
                        <FormGroup>
                            <button onClick={this.handleSubmitLogIn} type="button"
                                    className="btn btn-primary fullsize v-o-25">Sign In
                            </button>
                        </FormGroup>
                    </form>
                </Modal.Body>
                <Modal.Footer>
                    <FormCheck>
						  <span className="float-left">
							  You don't have account yet?
						  </span>
                        <button type="button" data-dismiss="modal" className="btn btn-primary float-right"
                                data-toggle="modal" data-target="#regmodal" onClick={switchFn}>Sign Up
                        </button>
                    </FormCheck>
                </Modal.Footer>
            </Modal>

        );
    }
}
