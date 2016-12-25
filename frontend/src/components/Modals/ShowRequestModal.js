import React, {Component} from "react";
import moment from 'moment';
import AbstractModal from "./AbstractModal";
import currentUser from "../../actions/CurrentUser";

export default class ShowRequestModal extends Component {

    constructor(props){
        super(props);

        this.constactBuddy = this.constactBuddy.bind(this);
    }

    constactBuddy(){
        this.props.contactBuddy(this.props.requestShowModalContent.buddy);
    }

    render() {
        const {showProp, hideFn, requestShowModalContent} = this.props;
        const {buddy, request} = requestShowModalContent;
        const profilePhotoName = currentUser.composeProfilePhotoName(buddy);
        const title = buddy.name + " " + buddy.surname + " " + " looking for buddies in " + request.city;
        return (
            <AbstractModal title={title} showProp={showProp} hideFn={hideFn}
                           submitFn={this.constactBuddy} submitText={"Message"}>
                <div>
                    <img
                        src={ profilePhotoName }
                        alt="..." className="profil_img rounded"/>
                    <br/><br/>
                    <b>Name: </b>{buddy.name + " " + buddy.surname}
                    <br/>
                    <b>Surname: </b>{buddy.city}
                    <br/>
                    <b>From: </b>{moment(request.from).format('MM/DD/YYYY')}
                    <br/>
                    <b>To: </b>{moment(request.to).format('MM/DD/YYYY')}
                    <br/>
                    <b>Sex: </b>
                    {buddy.sex === 'male' ? "muž" : "žena"}
                    <br/>
                    <b>E-mail: </b>{buddy.email}
                    <br/>
                    <label><b>Description:</b></label>
                    <textarea type="text" className="form-control"
                              id="text"
                              defaultValue={request.text} disabled/>
                </div>
            </AbstractModal>
        );
    }
}
