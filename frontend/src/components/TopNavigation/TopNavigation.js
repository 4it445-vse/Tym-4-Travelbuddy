import React, {Component} from "react";
import currentUser from "../../actions/CurrentUser";
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
import { connect } from "react-redux"

class TopNavigation extends Component {
    constructor(props) {
        super(props);
        this.state = {
            showLoginModal: false,
            showRegisterModal: false,
            showEditModal: false,
            showNewRequestModal: false,
            showRestorePass: false,
            showEditRequestModal: false,
            showProfileModal: false,
            showContactBuddyModal: false,
            selectedBuddy: undefined,
            showContactButton: undefined
        };

        this.closeLogin = this.closeLogin.bind(this);
        this.openLogin = this.openLogin.bind(this);
        this.closeRegister = this.closeRegister.bind(this);
        this.openRegister = this.openRegister.bind(this);
        this.openEdit = this.openEdit.bind(this);
        this.closeEdit = this.closeEdit.bind(this);
        this.openNewRequest = this.openNewRequest.bind(this);
        this.closeNewRequest = this.closeNewRequest.bind(this);
        this.openEditRequests = this.openEditRequests.bind(this);
        this.closeAlert = this.closeAlert.bind(this);
        this.openRestorePass = this.openRestorePass.bind(this);
        this.closeRestorePass = this.closeRestorePass.bind(this);
        this.closeEditRequests = this.closeEditRequests.bind(this);
        this.closeQuestion = this.closeQuestion.bind(this);
        this.removeUser = this.removeUser.bind(this);
        this.openProfileModal = this.openProfileModal.bind(this);
        this.closeProfileModal = this.closeProfileModal.bind(this);
        this.openContactBuddy = this.openContactBuddy.bind(this);
        this.closeContactBuddy = this.closeContactBuddy.bind(this);
    }

    componentDidMount() {
        currentUser.setOpenLogInFn(this.openLogin);
        currentUser.setOpenProfilefn(this.openProfileModal);
        currentUser.setOpenContactBuddy(this.openContactBuddy);
    }

    openContactBuddy(selectedBuddy) {
        this.setState({showContactBuddyModal: true, selectedBuddy: selectedBuddy});
    }

    closeContactBuddy() {
        this.setState({showContactBuddyModal: false});
    }

    openRestorePass() {
        this.setState({showRestorePass: true, showLoginModal: false});
    }

    closeRestorePass() {
        this.setState({showRestorePass: false});
    }

    closeAlert() {
        currentUser.setAlert(null);
        this.setState(this.state);
    }

    closeQuestion() {
        currentUser.setQuestion(null);
        this.setState(this.state);
    }

    openLogin() {
        this.setState({showRegisterModal: false, showLoginModal: true});
    }

    closeLogin() {
        this.setState({showLoginModal: false});
    }

    openProfileModal(selectedBuddy, showContactButton) {
        this.setState({selectedBuddy: selectedBuddy, showContactButton: showContactButton, showProfileModal: true});
    }

    closeProfileModal() {
        this.setState({showProfileModal: false});
    }

    openRegister() {
        this.setState({showRegisterModal: true, showLoginModal: false});
    }

    closeRegister() {
        this.setState({showRegisterModal: false});
    }

    openEdit() {
        this.closeRegister();
        this.setState({showEditModal: true});
    }

    closeEdit() {
        this.setState({showEditModal: false});
    }

    openNewRequest() {
        this.closeEditRequests();
        this.setState({showNewRequestModal: true});
    }

    closeNewRequest() {
        this.setState({showNewRequestModal: false});
    }

    openEditRequests() {
        this.setState({showEditRequestModal: true});
    }

    closeEditRequests() {
        this.setState({showEditRequestModal: false});
    }

    removeUser() {
        const question = currentUser.getQuestion();
        question.cb();
        this.closeQuestion();
    }

    render() {
        const loggedUser = this.props.user;
        const userLogged = !!loggedUser;
        const alert = currentUser.getAlert();
        const question = currentUser.getQuestion();
        return (
            <div>
                <Menu openEdit={this.openEdit} openRegister={this.openRegister} openLogin={this.openLogin}
                      openNewRequest={this.openNewRequest} openEditRequests={this.openEditRequests}/>

                <LoginModal restorePassFn={this.openRestorePass} showProp={this.state.showLoginModal}
                            hideFn={this.closeLogin} switchFn={this.openRegister}/>

                <RegisterModal showProp={this.state.showRegisterModal} hideFn={this.closeRegister}
                               switchFn={this.openLogin}/>

                {
                    this.state.showContactBuddyModal ?
                        <ContactBuddyModal showProp={this.state.showContactBuddyModal} hideFn={this.closeContactBuddy}
                                           buddyTo={this.state.selectedBuddy}/>
                        : ""
                }

                {
                    this.state.showProfileModal ?
                        <ShowProfileModal showProp={this.state.showProfileModal} hideFn={this.closeProfileModal}
                                          buddy={this.state.selectedBuddy}
                                          showContactButton={this.state.showContactButton}/>
                        : ""
                }

                {
                    (!!alert) ?
                        <Modal show={true} onHide={this.closeAlert}>
                            <Modal.Header closeButton>
                            </Modal.Header>
                            <Modal.Body>
                                <Alert bsStyle={alert.type}>
                                    {alert.message}
                                </Alert>
                            </Modal.Body>
                        </Modal> : ""
                }
                {
                    (!!question) ?
                        <Modal show={true} onHide={this.closeQuestion}>
                            <Modal.Header closeButton>
                            </Modal.Header>
                            <Modal.Body className="text-xs-center">
                                <p>{question.text}</p>
                                <div className="row">
                                    <div className="col-xs-6 text-xs-right">
                                        <button className="btn btn-defaul SearchButton text-white" type="button"
                                                onClick={this.removeUser}>Yes
                                        </button>
                                    </div>
                                    <div className="col-xs-6 text-xs-left">
                                        <button className="btn btn-defaul SearchButton text-white" type="button"
                                                onClick={this.closeQuestion}>No
                                        </button>
                                    </div>
                                </div>
                            </Modal.Body>
                        </Modal> : ""
                }
                { userLogged ?
                    <div>
                        <EditProfileModal showProp={this.state.showEditModal} hideFn={this.closeEdit}/>
                        <NewRequestModal showProp={this.state.showNewRequestModal} hideFn={this.closeNewRequest}/>
                        { this.state.showEditRequestModal ?
                            <EditRequestModal showProp={this.state.showEditRequestModal} hideFn={this.closeEditRequests}
                                              switchFn={this.openNewRequest}/>
                            : ""}
                    </div>
                    : ""}

                <ResetPassModal showProp={this.state.showRestorePass} hideFn={this.closeRestorePass}/>
            </div>
        );
    }
}
export default connect(
    (state) => ({
        user: state.user
    })
);