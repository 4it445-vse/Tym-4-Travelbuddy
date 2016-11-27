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
            console.log("about to ask for request-pass-reset");
            axios.post('messages/request-pass-reset', {
                email: email
            }).then(response => {
                if (response.data.status === "OK") {
                    currentUser.setAlert({
                        "type": "success",
                        "message": "Email k obnovení hesla úspěšně zaslána na Váš email. Prosím navštivte ho."
                    })
                    this.props.hideFn();
                } else {
                    this.setState({showErrorMessage: "Uživatel s daným emailem nebyl nalezen!"});
                }
            });
        }
    }

    render() {
        const {showProp} = this.props;
        return (
            <Modal show={showProp} onHide={this.closeModal}>
                <Modal.Header closeButton>
                    <Modal.Title>Resetuj heslo přes email</Modal.Title>
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
                        <button onClick={this.handleSubmitResetPass} type="button"
                                className="btn btn-primary fullsize v-o-5">Resetuj heslo
                        </button>
                    </form>
                </Modal.Body>
            </Modal>

        );
    }
}
