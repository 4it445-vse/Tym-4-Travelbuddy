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
                    this.setState({showErrorMessage: "Prosím nejdříve navštivte Váš email a ověř ho kliknutím na zaslaný odkaz!"});
                }
            })
        }).catch(error => {
            this.setState({showErrorMessage: "Špatně zadaný email či heslo!"});
        });;
    }

    render() {
        const {showProp, switchFn, restorePassFn} = this.props;
        return (
            <Modal show={showProp} onHide={this.closeModal}>
                <Modal.Header closeButton>
                    <Modal.Title>Přihlášení</Modal.Title>
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
                                   placeholder="Váš email"/>
                        </FormGroup>
                        <FormGroup>
                            <input type="password" name="password" className="form-control" id="pass-l"
                                   placeholder="Heslo"/>
                        </FormGroup>
                        <div className="modal-group">

                            <div className="form-check">
                                <label className="form-check-label float-left">
                                    <input id="remember_me" type="checkbox" className="form-check-input"
                                           name="remember-me"/>
                                    Zapamatovat si mě
                                </label>
                                <a href="#" className="float-right" data-target="#" onClick={restorePassFn}>Zapomenuté
                                    heslo?</a>
                            </div>

                        </div>
                        <FormGroup>
                            <button onClick={this.handleSubmitLogIn} type="button"
                                    className="btn btn-primary fullsize v-o-5">Přihlásit
                            </button>
                        </FormGroup>
                    </form>
                </Modal.Body>
                <Modal.Footer>
                    <FormCheck>
						  <span className="float-left">
							  Nemáš ještě účet?
						  </span>
                        <button type="button" data-dismiss="modal" className="btn btn-primary float-right"
                                data-toggle="modal" data-target="#regmodal" onClick={switchFn}>Registrace
                        </button>
                    </FormCheck>
                </Modal.Footer>
            </Modal>

        );
    }
}
