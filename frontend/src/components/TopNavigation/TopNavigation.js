import React, {Component} from "react";
import {Modal} from "react-bootstrap";
import LoginModal from "../Modals/LoginModal";
import RegisterModal from "../Modals/RegisterModal";
import ResetPassModal from "../Modals/ResetPassModal";
import EditProfileModal from "../Modals/EditProfileModal";
import ShowProfileModal from "../Modals/ShowProfileModal";
import NewRequestModal from "../Modals/NewRequestModal";
import EditRequestModal from "../Modals/EditRequestModal";
import ContactBuddyModal from "../Modals/ContactBuddyModal";
import Menu from "./Menu";
import {Alert} from 'react-bootstrap';
import {connect} from "react-redux";
import {closeModal, openEditRequest, openLogin, openRegistration, openCreateRequest, openEditProfile, openResetPassword} from "../../actions/modals";

class TopNavigation extends Component {
    render() {
        return (
            <div>
                <Menu openEdit={this.props.openEditProfile} openRegister={this.props.openRegistration} openLogin={this.props.openLogin}
                      openNewRequest={this.props.openCreateRequest} openEditRequests={this.props.openEditRequest}/>

                {
                    this.props.modals.modal === 'openLogin' ?
                        <LoginModal restorePassFn={this.props.openResetPassword} showProp={true}
                                    hideFn={this.props.closeModal} switchFn={this.props.openRegistration}/>
                        : ""
                }
                {
                    this.props.modals.modal === 'openRegistration' ?
                        <RegisterModal showProp={true} hideFn={this.props.closeModal}
                                       switchFn={this.props.openLogin}/>
                        : ""
                }
                {
                    this.props.modals.modal === 'openContactBuddy' ?
                        <ContactBuddyModal showProp={true} hideFn={this.props.closeModal}
                                           buddyTo={this.props.modals.data.buddy}/>
                        : ""
                }
                {
                    this.props.modals.modal === 'openProfile' ?
                        <ShowProfileModal showProp={true} hideFn={this.props.closeModal}
                                          buddy={this.props.modals.data.buddy}
                                          showContactButton={this.props.modals.data.flag}/>
                        : ""
                }
                {
                    this.props.modals.modal === 'alert' ?
                        <Modal show={true} onHide={this.props.closeModal}>
                            <Modal.Header closeButton>
                            </Modal.Header>
                            <Modal.Body>
                                <Alert bsStyle={this.props.modals.data.type}>
                                    {this.props.modals.data.message}
                                </Alert>
                            </Modal.Body>
                        </Modal> : ""
                }
                {
                    this.props.modals.modal === 'question' ?
                        <Modal show={true} onHide={this.props.closeModal}>
                            <Modal.Header closeButton>
                            </Modal.Header>
                            <Modal.Body className="text-xs-center">
                                <p>{this.props.modals.data.text}</p>
                                <div className="row">
                                    <div className="col-xs-6 text-xs-right">
                                        <button className="btn btn-defaul SearchButton text-white" type="button"
                                                onClick={this.props.modals.data.cb}>Yes
                                        </button>
                                    </div>
                                    <div className="col-xs-6 text-xs-left">
                                        <button className="btn btn-defaul SearchButton text-white" type="button"
                                                onClick={this.props.closeModal}>No
                                        </button>
                                    </div>
                                </div>
                            </Modal.Body>
                        </Modal> : ""
                }
                {
                    this.props.modals.modal === 'openEditProfile' ?
                        <EditProfileModal showProp={true} hideFn={this.props.closeModal}/>
                        : ""
                }
                {
                    this.props.modals.modal === 'openCreateRequest' ?
                        <NewRequestModal showProp={true} hideFn={this.props.closeModal}/>
                        : ""
                }
                {
                    this.props.modals.modal === 'openEditRequest' ?
                        <EditRequestModal showProp={true} hideFn={this.props.closeModal}
                                          switchFn={this.props.openCreateRequest}/>
                        : ""
                }
                {
                    this.props.modals.modal === 'openResetPassword' ?
                        <ResetPassModal showProp={true} hideFn={this.props.closeModal}/>
                        : ""
                }
            </div>
        );
    }
}
export default connect(
    (state) => ({
        user: state.user,
        modals: state.modals
    }),
    {
        closeModal,
        openLogin,
        openRegistration,
        openCreateRequest,
        openEditProfile,
        openResetPassword,
        openEditRequest
    }
)(TopNavigation);