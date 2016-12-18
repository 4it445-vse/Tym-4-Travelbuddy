import React, {Component} from "react";
import currentUser from "../../actions/CurrentUser";
import AbstractModal from "./AbstractModal";
import FormGroup from "./FormGroup";
import axios from "../../api";

export default class ContactBuddyModal extends Component {

    constructor(props) {
        super(props);

        this.state = {
            showValidation: false,
            text: ""
        }
        this.handleSubmitContactBuddy = this.handleSubmitContactBuddy.bind(this);
        this.validate = this.validate.bind(this);
        this.closeModal = this.closeModal.bind(this);
    }

    closeModal() {
        this.state.showValidation = false;
        this.props.hideFn();
    }

    validate(e) {
        var value = e.target.value;
        if (value) {
            this.setState({
                showValidation: false,
                text: value
            });
        } else {
            this.setState({
                showValidation: true
            });
        }
    }

    handleSubmitContactBuddy() {
        if (!this.state.text) {
            this.setState({
                showValidation: true
            });
            return;
        }
        const loggedUser = currentUser.getCurrentUser();
        let text = this.state.text.replace(/\r?\n/g, '</br>');
        axios.post('messages', {
            "text": text,
            "displayed": false,
            "date_time": new Date(),
            "buddy_id_from": loggedUser.id,
            "buddy_id_to": this.props.buddyTo.id

        }).then(response => {
            currentUser.setAlert({
                "type": "success",
                "message": "Zpráva úspěšně odeslána."
            })
            this.closeModal();
        });
    }

    render() {
        const {showProp, buddyTo} = this.props;
        const title = "Kontaktuj buddyho - " + buddyTo.name + " " + buddyTo.surname;
        return (
            <AbstractModal title={title} showProp={showProp} hideFn={this.closeModal}
                           submitFn={this.handleSubmitContactBuddy} submitText={"Odešli"}>
                <form>
                    <div className="form-group no-margin-bottom-bottom row">
                        <label className="col-xs-12 col-form-label">Text: </label>
                        <div className="col-xs-12">
                            {
                                this.state.showValidation
                                    ? <span className="validation-error">You have to enter some message text!</span>
                                    : ""
                            }
                            <textarea type="text" className="form-control" id="about_me" aria-describedby="AboutHelp"
                                      onChange={this.validate}/>
                            <small id="emailHelp" className="form-text text-muted text-xs-center">Write the message text.
                            </small>
                        </div>
                    </div>
                </form>
            </AbstractModal>
        );
    }
}
