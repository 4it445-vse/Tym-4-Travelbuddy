import React, {Component} from "react";
import moment from 'moment';
import AbstractModal from "./AbstractModal";
import currentUser from "../../actions/CurrentUser";

export default class ShowRequestModal extends Component {

    constactBuddy = () => {
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
              <div className="row">
                <div className="row hidden-sm-up text-xs-center">
                  <img src={ profilePhotoName } alt={ buddy.name + " " + buddy.surname } className="profil_img rounded"/>
                </div>
                <hr className="hidden-sm-up"></hr>
                <div className="col-xs-12 col-sm-6">
                  <div className="row text-xs-left">
                    <div className="col-xs-3 no-padding-right">
                      <b>Name: </b>
                    </div>
                    <div className="col-xs-9">
                      {buddy.name + " " + buddy.surname}
                    </div>
                  </div>
                  <div className="row text-xs-left">
                    <div className="col-xs-3 no-padding-right">
                      <b>City: </b>
                    </div>
                    <div className="col-xs-9">
                      {buddy.city}
                    </div>
                  </div>
                  <div className="row text-xs-left">
                    <div className="col-xs-3 no-padding-right">
                      <b>From: </b>
                    </div>
                    <div className="col-xs-9">
                      {moment(request.from).format('MM/DD/YYYY')}
                    </div>
                  </div>
                  <div className="row text-xs-left">
                    <div className="col-xs-3 no-padding-right">
                      <b>To: </b>
                    </div>
                    <div className="col-xs-9">
                      {moment(request.to).format('MM/DD/YYYY')}
                    </div>
                  </div>
                  <div className="row text-xs-left">
                    <div className="col-xs-3 no-padding-right">
                      <b>Sex: </b>
                    </div>
                    <div className="col-xs-9">
                      {buddy.sex === 'male' ? "man" : "woman"}
                    </div>
                  </div>
                  <div className="row text-xs-left">
                    <div className="col-xs-3 no-padding-right">
                      <b>E-mail: </b>
                    </div>
                    <div className="col-xs-9 ellipsis">
                      {buddy.email}
                    </div>
                  </div>
                </div>
                <div className="col-sm-6 hidden-xs-down text-sm-center">
                  <img src={ profilePhotoName } alt={ buddy.name + " " + buddy.surname } className="profil_img rounded"/>
                </div>
              </div>
              <div className="row">
                <hr className="col-xs-12"></hr>
                <div className="col-xs-12">
                  <p className="no-margin-bottom">{request.text}</p>
                </div>
              </div>
            </AbstractModal>
        );
    }
}
