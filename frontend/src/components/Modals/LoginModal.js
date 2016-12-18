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
            errors: {}
        }

        this.handleSubmitLogIn = this.handleSubmitLogIn.bind(this);
        this.closeModal = this.closeModal.bind(this);
    }

    closeModal() {
        this.state.errors = {};
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
                    let errors = this.state.errors;
                    errors.notLogged = "Please verify your e-mail, before first login, by clicking on the link we have send you on provided e-mail.";
                    this.setState({errors: errors});
                }
            })
        }).catch(error => {
            let errors = this.state.errors;
            errors.notLogged = "Wrong e-mail or password!";
            this.setState({errors: errors});
        });;
    }

    render() {
        const {showProp, switchFn, restorePassFn} = this.props;
        const {errors} = this.state;
        return (
            <Modal show={showProp} onHide={this.closeModal}>
                <Modal.Header closeButton>
                    <Modal.Title>Sign In</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <form>
                      <div className="row m-b-10">
                        <div className="col-xs-3 col-sm-2">
                          <label htmlFor="email-l" className="col-form-label">E-mail: </label>
                        </div>
                        <div className="col-xs-9 col-sm-10">
                          <input type="email" name="email" id="email-l" placeholder="Your E-mail"
                                 className={ "form-control" + ( !!errors.notLogged ? ' alert-danger' : '') }/>
                        </div>
                      </div>
                      <div className="row m-b-10">
                        <div className="col-xs-3 col-sm-2">
                          <label htmlFor="pass-l" className="col-form-label">Password: </label>
                        </div>
                        <div className="col-xs-9 col-sm-10">
                          <input type="password" name="password" id="pass-l" placeholder="Your Password"
                                 className={ "form-control" + ( !!errors.notLogged ? ' alert-danger' : '') }/>
                          {
                            !!errors.notLogged?
                            <span className="validation-error">{errors.notLogged}</span> : ""
                          }
                        </div>
                      </div>
                      <hr/>
                      <div className="row">
                        <div className="col-xs-6 text-xs-left">
                          <label className="form-check-label float-left">
                            <input id="remember_me" type="checkbox" className="form-check-input" name="remember-me"/>
                            <span>Remember Me</span>
                          </label>
                        </div>
                        <div className="col-xs-6 text-xs-right">
                          <a href="#" className="float-right" data-target="#" onClick={restorePassFn}>I forgot my password</a>
                        </div>
                      </div>
                      <hr/>
                      <button onClick={this.handleSubmitLogIn} type="button" className="btn btn-primary fullsize">Sign In</button>
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
