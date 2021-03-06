﻿import React, {Component} from "react";
import moment from "moment";
import {Modal} from "react-bootstrap";
import currentUser from "../../actions/CurrentUser";
import {connect} from "react-redux";
import {openContactBuddy, openNewMeetUp} from "../../actions/modals";

class ShowRequestModal extends Component {

    constructor(props) {
        super(props);

        this.state = {
            avatarSrc: undefined
        }
    }

    componentDidMount() {
        currentUser.composeProfilePhotoName(this.props.requestShowModalContent.buddy, (avatarSrcResult) => {
            this.setState({
                avatarSrc: avatarSrcResult
            });
        });
    }

    contactBuddy = () => {
        this.props.openContactBuddy(this.props.requestShowModalContent.buddy);
    };

    openNewMeetUp = () => {
        this.props.openNewMeetUp({buddy: this.props.requestShowModalContent.buddy});
    };

    render() {
        const {showProp, hideFn, requestShowModalContent} = this.props;
        const {buddy, request} = requestShowModalContent;
        const title = buddy.name + " " + buddy.surname + " looking for buddies in " + request.city;
        return (
            <Modal show={showProp} onHide={hideFn}>
                <Modal.Header closeButton>
                    <Modal.Title>{title}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div className="row">
                        <div className="row hidden-sm-up text-xs-center">
                            <img src={ this.state.avatarSrc } alt={ buddy.name + " " + buddy.surname } className="profil_img rounded"/>
                        </div>
                        <hr className="hidden-sm-up"/>
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
                                    {moment(request.from).format(currentUser.dateFormat)}
                                </div>
                            </div>
                            <div className="row text-xs-left">
                                <div className="col-xs-3 no-padding-right">
                                    <b>To: </b>
                                </div>
                                <div className="col-xs-9">
                                    {moment(request.to).format(currentUser.dateFormat)}
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
                            <img src={ this.state.avatarSrc } alt={ buddy.name + " " + buddy.surname } className="profil_img rounded"/>
                        </div>
                    </div>
                    <div className="row">
                        <hr className="col-xs-12"/>
                        <div className="col-xs-12">
                            <p className="no-margin-bottom">{request.text}</p>
                        </div>
                    </div>
                </Modal.Body>
                <Modal.Footer>
                    <div className="form-check">
                        <button onClick={this.openNewMeetUp} type="button"
                                className="btn btn-primary fullsize">Create meet up proposal
                        </button>
                        <button onClick={this.contactBuddy} type="button"
                                className="btn btn-primary fullsize m-t-10">Message
                        </button>

                    </div>
                </Modal.Footer>
            </Modal>
        );
    }
}
export default connect(
    null,
    {
        openContactBuddy,
        openNewMeetUp
    }
)(ShowRequestModal)