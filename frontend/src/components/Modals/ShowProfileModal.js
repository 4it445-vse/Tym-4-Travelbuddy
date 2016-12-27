import React, {Component} from "react";
import {Modal} from "react-bootstrap";
import currentUser from "../../actions/CurrentUser";
import { connect } from "react-redux";
import { openContactBuddy } from "../../actions/modals";

class ShowProfileModal extends Component {

    constructor(props) {
        super(props);

        this.openContactBuddy = this.openContactBuddy.bind(this);
    }

    openContactBuddy() {
        this.setState({
            showRequestShowModal: false
        });
        this.props.openContactBuddy({buddy: this.props.buddy});
    }

    render() {
        const {showProp, hideFn, buddy, showContactButton} = this.props;
        const profilePhotoName = currentUser.composeProfilePhotoName(buddy);
        return (
            <Modal show={showProp} onHide={hideFn}>
                <Modal.Header closeButton>
                    <Modal.Title>{buddy.name + " " + buddy.surname}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
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
                          <b>Hosting: </b>
                        </div>
                        <div className="col-xs-9">
                          {buddy.is_hosting ? "Yes" : "No"}
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
                      <p className="no-margin-bottom">{buddy.about_me}</p>
                    </div>
                  </div>

                  {/* <div>
                        <img
                            src={ profilePhotoName }
                            alt="..." className="profil_img rounded"/>
                        <br/><br/>
                        <b>Sex: </b>
                        {buddy.sex === 'male' ? "muž" : "žena"}
                        <br/>
                        <b>City: </b>{buddy.city}
                        <br/>
                        <b>Am I hosting: </b>
                        {buddy.is_hosting ? "ano" : "ne"}
                        <br/>
                        <b>E-mail: </b>{buddy.email}
                        <br/>
                        <label htmlFor="exampleInputFile"><b>About me: </b></label>
                        <textarea type="text" className="form-control"
                                  id="about_me"
                                  defaultValue={buddy.about_me} disabled/>
                    </div> */}
                </Modal.Body>
                <Modal.Footer>
                    {
                        showContactButton ?
                            <div className="form-check">
                                <button onClick={this.openContactBuddy} type="button"
                                        className="btn btn-primary fullsize">Message
                                </button>
                            </div>
                            : ""
                    }
                </Modal.Footer>
            </Modal>
        );
    }
}

export default connect(
    null,
    {
        openContactBuddy
    }
)(ShowProfileModal);
