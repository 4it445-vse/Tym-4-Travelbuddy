import React, {Component} from "react";
import {Modal} from "react-bootstrap";
import FormGroup from "./FormGroup";
import currentUser from "../../actions/CurrentUser";
import axios from "../../api";

export default class ResetPassModal extends Component {

    constructor(props) {
        super(props);

        this.handleSubmitResetPass = this.handleSubmitResetPass.bind(this);
    }

    handleSubmitResetPass(event) {
        var email = document.getElementById("email-l").value;
        if (email) {
            /*axios.post('buddies/login', {
                email: "admin@admin.cz",
                password: "Aa123456"
            }).then(response => {
                console.log("OK setting auth token.");
                currentUser.setAuthToken(response.data.id);
*/
                axios.post('messages/request-pass-reset', {
                    email: email
                }).then(response => {
                    console.log("response: ", response);
                    if(response.data.status === "OK"){
                        currentUser.setAlert({
                            "type": "success",
                            "message": "Email k obnovení hesla úspěšně zaslána na Váš email. Prosím navštivte ho."
                        })
                        this.props.hideFn();
                    }else{
                        console.error("Email was not sent!");
                    }
                });
            /*});*/
        }
    }

    render() {
        const {showProp, hideFn} = this.props;
        return (
            <Modal show={showProp} onHide={hideFn}>
                <Modal.Header closeButton>
                    <Modal.Title>Resetuj heslo přes email</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <form>
                        <FormGroup>
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
