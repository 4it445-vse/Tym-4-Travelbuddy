import React, {Component} from "react";
import {Modal} from "react-bootstrap";
import FormGroup from "./FormGroup";
import FormCheck from "./FormCheck";
import currentUser from "../../actions/CurrentUser";
import axios from "../../api";

export default class LoginModal extends Component {

    constructor(props) {
        super(props);

        this.handleSubmitLogIn = this.handleSubmitLogIn.bind(this);
    }

    handleSubmitLogIn(event) {
        var email = document.getElementById("email-l").value;
        var pass = document.getElementById("pass-l").value;
        var rememberUser = document.getElementById("remember_me").checked;

        axios.get('buddies', {
            params: {
                filter: {
                    where: {
                        email: email,
                    },
                },
            }
        }).then(response => {
            if (response.data && response.data[0] && response.data[0].password === pass) {
                console.log("login success");
                currentUser.setCurrentUser(response.data[0], rememberUser);
                this.props.hideFn();
            } else {
                console.log("login failure");
            }
        });
    }

    render() {
        const {showProp, hideFn, switchFn} = this.props;
        return (
            <Modal show={showProp} onHide={hideFn}>
                <Modal.Header closeButton>
                    <Modal.Title>Přihlášení</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <form>
                        <FormGroup>
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
                                {/*<a href="#" className="float-right" data-dismiss="modal" data-toggle="modal"
                                 data-target="#zapommodal">Zapomenuté heslo?</a>*/}
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