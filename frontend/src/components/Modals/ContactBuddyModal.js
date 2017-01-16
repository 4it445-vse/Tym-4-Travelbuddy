import React, {Component} from "react";
import AbstractModal from "./AbstractModal";
import { connect } from "react-redux";
import axios from "../../api";
import { openAlert } from "../../actions/modals";

class ContactBuddyModal extends Component {

    constructor(props) {
        super(props);

        this.state = {
            showValidation: false,
            text: ""
        }
    }

    closeModal = () => {
        this.setState({
            showValidation: false,
        });
        this.props.hideFn();
    }

    validate = (e) => {
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

    handleSubmitContactBuddy = () => {
        if (!this.state.text) {
            this.setState({
                showValidation: true
            });
            return;
        }
        const loggedUser = this.props.user;
        let text = this.state.text.replace(/\r?\n/g, '</br>');
        axios.post('messages', {
            "text": text,
            "displayed": false,
            "date_time": new Date(),
            "buddy_id_from": loggedUser.id,
            "buddy_id_to": this.props.buddyTo.id

        }).then(response => {
            this.props.openAlert({
                "type": "success",
                "message": "Message has been successfuly send."
            })
        });
    }

    render() {
        const {showProp, buddyTo} = this.props;
        const title = "Contact Buddy - " + buddyTo.name + " " + buddyTo.surname;
        return (
            <AbstractModal title={title} showProp={showProp} hideFn={this.closeModal}
                           submitFn={this.handleSubmitContactBuddy} submitText={"Send"}>
                <form>
                    <div className="form-group no-margin-bottom-bottom row">
                        <label className="col-xs-12 col-form-label">Text: </label>
                        <div className="col-xs-12">
                            <textarea type="text" className="form-control" id="about_me" aria-describedby="AboutHelp"
                                      placeholder='Write the message text.' onChange={this.validate}/>
                            {
                                this.state.showValidation
                                    ? <span className="validation-error">You have to enter some message text!</span>
                                    : ""
                            }
                        </div>
                    </div>
                </form>
            </AbstractModal>
        );
    }
}
export default connect(
    (state) => ({
        user: state.user
    }),
    {
        openAlert
    }
)(ContactBuddyModal)
