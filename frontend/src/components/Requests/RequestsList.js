import React, {Component} from "react";
import {RequestListItem} from "./RequestListItem.js";

export class RequestsList extends Component {
    render() {
        const {requests, openShowRequestShowModal, openContactBuddy} = this.props;

        return (
        <div className="row">
            <div className="requests v-o-5">
                {requests.map(request =>
                    <RequestListItem request={request} key={request.id}
                                     openShowRequestShowModal={openShowRequestShowModal} openContactBuddy={openContactBuddy}/>
                )}
            </div>
        </div>
    )
        ;
    }
}
