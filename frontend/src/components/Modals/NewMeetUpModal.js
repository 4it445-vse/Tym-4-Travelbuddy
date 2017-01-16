import React, {Component} from "react";
import AbstractModal from "./AbstractModal";
import { connect } from "react-redux";
import axios from "../../api";
import { openAlert } from "../../actions/modals";
import moment from "moment";

class NewMeetUpModal extends Component {

    constructor(props) {
        super(props);

        this.state = {
            errors: {},
            date: moment(new Date()).add(1, 'day').format('YYYY-MM-DD')
        }
    }

    closeModal = () => {
        this.state.errors = {};
        this.state.date = new Date();
        this.props.hideFn();
    }

    handleSubmitMeetUp = () => {
        if (!this.state.date || this.state.errors.date) {
            return;
        }
        const loggedUser = this.props.user;
        axios.post('Meetups', {
            "done": false,
            "verified": false,
            "date_time": this.state.date,
            "buddy_id_from": loggedUser.id,
            "buddy_id_to": this.props.buddyTo.id

        }).then(response => {
            this.props.openAlert({
                "type": "success",
                "message": "Meet up proposal has been successfuly send."
            })
        });
    }

    onChange = (e) => {
        const date = e.target.value;
        let now = new Date();
        now.setHours(0,0,0,0);
        if (!moment(date).isValid()) {
            const errors = this.state.errors;
            errors.date = "Date is not valid!";
            this.setState({
                errors,
                date
            });
        }else if((new Date(date).getTime() - now.getTime()) < 0){
            const errors = this.state.errors;
            errors.date = "History date is not allowed!";
            this.setState({
                errors,
                date
            });
        }else{
            const errors = this.state.errors;
            errors.date = undefined;
            this.setState({
                errors,
                date
            });
        }
    }

    render() {
        const {showProp, buddyTo} = this.props;
        const title = "Meet up proposal for " + buddyTo.name + " " + buddyTo.surname;
        return (
            <AbstractModal title={title} showProp={showProp} hideFn={this.closeModal}
                           submitFn={this.handleSubmitMeetUp} submitText={"Send"}>
                <form>
                    <div className="form-group no-margin-bottom-bottom row">
                        <label className="col-xs-4 col-form-label">Date: </label>
                            <div className="col-xs-8">
                                <input className={ "form-control" + ( this.state.errors.date ? ' alert-danger' : '' ) }
                                       onChange={this.onChange}
                                       defaultValue={this.state.date} type="date"
                                       name="from" placeholder="MM/DD/YYYY"/>
                            {
                                this.state.errors.date
                                    ? <span className="validation-error">{this.state.errors.date}</span>
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
)(NewMeetUpModal)
